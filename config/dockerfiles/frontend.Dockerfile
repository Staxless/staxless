# Base image
FROM node:18-alpine AS base

# Dependencies stage
FROM base AS deps
RUN ["apk", "add", "--no-cache", "libc6-compat"]
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN ["npm", "ci"]

FROM deps AS dev
WORKDIR /app
COPY ["./", "./"]
CMD ["npm", "run", "dev"]

# Production dependencies stage
FROM base AS prod-deps
RUN ["apk", "add", "--no-cache", "libc6-compat", "curl"]
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
RUN ["npm", "ci", "--production"]

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps ["/app/node_modules", "./node_modules"]
COPY ["./", "./"]
ENV NEXT_TELEMETRY_DISABLED=1
RUN ["npm", "run", "build"]

# Production stage
FROM base AS prod
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOST=0.0.0.0
RUN ["addgroup", "--system", "--gid", "1001", "nodejs"]
RUN ["adduser", "--system", "--uid", "1001", "nextjs"]
RUN ["mkdir", ".next"]
RUN ["chown", "nextjs:nodejs", ".next"]
COPY --from=builder --chown=nextjs:nodejs ["/app/.next/standalone", "./"]
COPY --from=builder --chown=nextjs:nodejs ["/app/.next/static", "./.next/static"]
COPY --from=prod-deps --chown=nextjs:nodejs ["/app/node_modules", "./node_modules"]
USER nextjs
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=5 \
  CMD ["curl", "-f", "http://localhost:3000/api/health"]
CMD ["npm", "run", "start", "--", "--hostname", "0.0.0.0", "--port", "3000"]