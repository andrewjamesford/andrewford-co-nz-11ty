# Multi-stage Dockerfile for 11ty site with API server

# Stage 1: Build stage
FROM node:24-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including devDependencies for build)
RUN npm install

# Copy source code
COPY . .

# Copy vector store files
COPY vector_store/ ./vector_store/

# Start API server in background and build the static site
RUN nohup node api/server.mjs & \
    sleep 5 && \
    npm run build && \
    pkill -f "node api/server.mjs"

# Stage 2: Production stage
FROM node:24-alpine AS production

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --only=production && npm cache clean --force

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