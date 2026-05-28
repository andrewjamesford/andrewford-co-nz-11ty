# syntax=docker/dockerfile:1.10
# Multi-stage Dockerfile for 11ty site with API server

ARG NODE_VERSION=24.12
ARG NPM_VERSION=11.16.0
ARG YOUTUBE_CHANNEL_ID=mock-channel-id-for-docker-build

# Stage 1: Build stage
FROM node:${NODE_VERSION}-alpine AS builder

ARG NPM_VERSION
ARG YOUTUBE_CHANNEL_ID

WORKDIR /app

# Align Docker installs with packageManager so peer resolution matches local/CI.
RUN npm install -g npm@${NPM_VERSION}

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies from the lockfile (including devDependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Copy vector store files
COPY vector_store/ ./vector_store/

# Start API server in background, build the static site, then stop the server
RUN --mount=type=secret,id=youtube_api_key,env=YOUTUBE_API_KEY,required=false \
    export YOUTUBE_CHANNEL_ID="${YOUTUBE_CHANNEL_ID}"; \
    node api/server.mjs & \
    SERVER_PID=$!; \
    sleep 5; \
    npm run build; \
    BUILD_STATUS=$?; \
    kill $SERVER_PID || true; \
    exit $BUILD_STATUS

# Stage 2: Production stage
FROM node:${NODE_VERSION}-alpine AS production

ARG NPM_VERSION

WORKDIR /app

# Align production npm commands with packageManager as well.
RUN npm install -g npm@${NPM_VERSION}

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files and node_modules from builder, then prune to production only
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Prune to production dependencies only (native modules already built in builder)
RUN npm prune --omit=dev && npm cache clean --force

# Copy built site from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/_site ./_site

# Copy API server code
COPY --chown=nextjs:nodejs api/ ./api/

# Copy vector store files
COPY --from=builder --chown=nextjs:nodejs /app/vector_store ./vector_store/

# Create logs directory
RUN mkdir -p logs && chown nextjs:nodejs logs

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "const http = require('http'); \
    const options = { host: 'localhost', port: 3000, path: '/health', timeout: 2000 }; \
    const req = http.request(options, (res) => { \
    if (res.statusCode === 200) process.exit(0); \
    else process.exit(1); \
    }); \
    req.on('error', () => process.exit(1)); \
    req.end();"

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the API server
CMD ["node", "api/server.mjs"]
