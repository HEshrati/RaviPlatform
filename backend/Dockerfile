# Base image
FROM node:20-alpine AS base

# Build stage
FROM base AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build application
RUN ./node_modules/.bin/nest build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app


# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm install --only=production && npm cache clean --force

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Create logs directory
RUN mkdir -p logs && chown -R node:node /app

# Use non-root user
USER node

# Expose port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

