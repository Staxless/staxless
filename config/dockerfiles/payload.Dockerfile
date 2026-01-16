# ──────────────────────────────────────────────────────────────
# 1. BUILDER – compile Next.js + Payload CMS → build/
# ──────────────────────────────────────────────────────────────
FROM node:lts-alpine AS builder
USER node
WORKDIR /home/node

# Copy package files
COPY --chown=node:node ["package.json", "package-lock.json", "./"]

# Install all dependencies (using legacy-peer-deps to handle Payload version conflicts)
RUN ["npm", "ci", "--legacy-peer-deps"]

# Copy all source and config files
COPY --chown=node:node . ./

RUN ["npm", "run", "generate:importmap"]

# Build Payload CMS + Next.js
RUN ["npm", "run", "build"]

# Remove dev dependencies
RUN ["npm", "prune", "--prod"]

# Create media directory
RUN ["mkdir", "-p", "media"]

# Clean up unnecessary files
RUN ["rm", "-rf", "src", ".git", ".gitignore", "README.md", "*.md"]

# ──────────────────────────────────────────────────────────────
# 2. DEV – hot reload with Next.js dev server
# ──────────────────────────────────────────────────────────────
FROM node:lts-alpine AS dev
USER node
WORKDIR /home/node

# Copy package files
COPY --chown=node:node ["package.json", "package-lock.json", "./"]

# Install all dependencies (using legacy-peer-deps to handle Payload version conflicts)
RUN ["npm", "ci", "--legacy-peer-deps"]

# Copy all source
COPY --chown=node:node . ./

# Create media directory
RUN ["mkdir", "-p", "media"]

EXPOSE 3000
CMD ["npm", "run", "dev"]

# ──────────────────────────────────────────────────────────────
# 3. PRODUCTION – run built Next.js + Payload CMS (standalone)
# ──────────────────────────────────────────────────────────────
FROM node:lts-alpine AS prod

# Add metadata
LABEL maintainer="staxless"
LABEL description="Staxless CMS Service - Payload CMS"

USER node
WORKDIR /home/node

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=8085

# Copy the standalone server and its dependencies
COPY --chown=node:node --from=builder ["/home/node/.next/standalone", "./"]

# Copy static files to the correct location for standalone mode
COPY --chown=node:node --from=builder ["/home/node/.next/static", "./.next/static"]

# Copy media directory
COPY --chown=node:node --from=builder ["/home/node/media", "./media"]

# Create media directory for uploads if it doesn't exist
RUN ["mkdir", "-p", "media"]

EXPOSE 8085

# Health check (fixed URL path)
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
CMD node -e "require('http').get('http://localhost:8085/admin',(r)=>process.exit(r.statusCode===200||r.statusCode===302?0:1))"

# Run Next.js standalone server
# server.js is in the root of standalone output
CMD ["node", "server.js"]