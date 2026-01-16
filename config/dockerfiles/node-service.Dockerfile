# ──────────────────────────────────────────────────────────────
# 1. BUILDER – compile TS → dist/
# ──────────────────────────────────────────────────────────────
FROM node:lts-alpine AS builder
USER node
WORKDIR /home/node

# Copy package files + tsconfig
COPY --chown=node:node ["package*.json", "tsconfig.json", "./"]

# Install all dependencies (including dev: typescript, @types/*)
RUN ["npm", "ci"]

# Copy source
COPY --chown=node:node ["src", "./src"]

# Build using local tsc → creates dist/
RUN ["npm", "run", "build"]

# Remove dev dependencies
RUN ["npm", "prune", "--production"]

# Clean up source and config (not needed in prod)
RUN ["rm", "-rf", "src", "tsconfig.json"]

# ──────────────────────────────────────────────────────────────
# 2. DEV – hot reload with tsx
# ──────────────────────────────────────────────────────────────
FROM node:lts-alpine AS dev
USER node
WORKDIR /home/node

COPY --chown=node:node ["package*.json", "tsconfig.json", "./"]
RUN ["npm", "ci"]
COPY --chown=node:node ["src", "./src"]

CMD ["npm", "run", "dev"]

# ──────────────────────────────────────────────────────────────
# 3. PROD – run compiled JS only
# ──────────────────────────────────────────────────────────────
FROM node:lts-alpine AS prod
USER node
WORKDIR /home/node
ENV HOST=0.0.0.0

# Copy only runtime files
COPY --chown=node:node --from=builder ["/home/node/package*.json", "./"]
COPY --chown=node:node --from=builder ["/home/node/node_modules", "./node_modules"]
COPY --chown=node:node --from=builder ["/home/node/dist", "./dist"]

# Run compiled app directly
CMD ["node", "dist/server.js"]