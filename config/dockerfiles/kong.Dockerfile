# ───────────────────────────────────────────────────
# Base Stage - Common configuration
# ───────────────────────────────────────────────────
FROM kong:3.6 AS base

# Add metadata labels
LABEL maintainer="staxless"
LABEL version="1.0"
LABEL description="Custom Kong API Gateway with RBAC plugin"

USER root

# Create plugin directory with proper structure
WORKDIR /usr/local/share/lua/5.1/kong/plugins/rbac-auth

# Copy plugin files
COPY ./plugins/rbac-auth ./

# Validate plugin structure
RUN [ -f "handler.lua" ] || { echo "ERROR: handler.lua not found"; exit 1; }
RUN [ -f "schema.lua" ] || { echo "ERROR: schema.lua not found"; exit 1; }

# Set proper permissions for plugin files
RUN chown -R kong:kong /usr/local/share/lua/5.1/kong/plugins/rbac-auth && \
    chmod -R 755 /usr/local/share/lua/5.1/kong/plugins/rbac-auth

# Copy declarative config
COPY ./src/kong.yaml /etc/kong/kong.yaml

# Set proper permissions for config
RUN chown kong:kong /etc/kong/kong.yaml && \
    chmod 644 /etc/kong/kong.yaml

# Basic YAML syntax validation
RUN grep -q "_format_version:" /etc/kong/kong.yaml || { echo "ERROR: kong.yaml missing _format_version"; exit 1; }

# Common environment variables
ENV KONG_PLUGINS="bundled,rbac-auth" \
    KONG_DATABASE=off \
    KONG_DECLARATIVE_CONFIG=/etc/kong/kong.yaml \
    KONG_LOG_LEVEL=notice \
    KONG_PREFIX=/var/run/kong

# Create Kong prefix directory with proper permissions
# This is where Kong will create its runtime directories including logs
RUN mkdir -p /var/run/kong && \
    chown -R kong:kong /var/run/kong && \
    chmod -R 755 /var/run/kong

# Switch back to kong user
USER kong

# ───────────────────────────────────────────────────
# Dev Stage (hot-reload, debug enabled)
# ───────────────────────────────────────────────────
FROM base AS dev

USER root

# Dev-specific configurations
ENV KONG_LOG_LEVEL=debug \
    KONG_ADMIN_LISTEN="0.0.0.0:8001, 0.0.0.0:8444 ssl" \
    KONG_PROXY_LISTEN="0.0.0.0:8000, 0.0.0.0:8443 ssl" \
    KONG_ADMIN_ACCESS_LOG=/dev/stdout \
    KONG_ADMIN_ERROR_LOG=/dev/stderr \
    KONG_PROXY_ACCESS_LOG=/dev/stdout \
    KONG_PROXY_ERROR_LOG=/dev/stderr

# Expose all ports including admin API
EXPOSE 8000 8001 8443 8444

USER kong

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD ["kong", "health"]

CMD ["kong", "docker-start"]

# ───────────────────────────────────────────────────
# Production Stage (security hardened)
# ───────────────────────────────────────────────────
FROM base AS prod

USER root

# Production-specific configurations
ENV KONG_LOG_LEVEL=notice \
    KONG_ADMIN_LISTEN="127.0.0.1:8001" \
    KONG_PROXY_LISTEN="0.0.0.0:8000, 0.0.0.0:8443 ssl" \
    KONG_PROXY_ACCESS_LOG=/dev/stdout \
    KONG_PROXY_ERROR_LOG=/dev/stderr \
    KONG_NGINX_WORKER_PROCESSES=auto \
    KONG_UPSTREAM_KEEPALIVE_IDLE_TIMEOUT=60 \
    KONG_UPSTREAM_KEEPALIVE_MAX_REQUESTS=100

# Production hardening
RUN rm -rf /var/cache/apk/* && \
    mkdir -p /var/run/kong && \
    chown -R kong:kong /var/run/kong && \
    chmod -R 755 /var/run/kong

# Only expose proxy ports (not admin API)
EXPOSE 8000 8443

USER kong

# Production health check (more frequent)
HEALTHCHECK --interval=10s --timeout=5s --start-period=30s --retries=3 \
  CMD ["kong", "health"]

CMD ["kong", "docker-start"]

# ───────────────────────────────────────────────────
# Optional: Testing Stage
# ───────────────────────────────────────────────────
FROM dev AS test

USER root

# Install testing dependencies
RUN apk add --no-cache curl jq

# Copy test scripts
COPY ./tests /tests

RUN chmod +x /tests/*.sh

USER kong

CMD ["/tests/run-tests.sh"]