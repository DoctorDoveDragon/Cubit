# ==============================================================================
# Multi-stage Dockerfile for Next.js Frontend
# Optimized for Railway/Nixpacks deployment with standalone output
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Dependencies
# Install all dependencies (including devDependencies for build)
# ------------------------------------------------------------------------------
FROM node:20-alpine AS deps

# Install libc6-compat for compatibility with Node.js native modules
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Copy package files for dependency installation
COPY package.json package-lock.json ./

# Install dependencies using clean install for reproducible builds
RUN npm ci


# ------------------------------------------------------------------------------
# Stage 2: Builder
# Build the Next.js application with standalone output
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Build the Next.js application
# This creates .next directory with standalone output (configured in next.config.ts)
RUN npm run build


# ------------------------------------------------------------------------------
# Stage 3: Runner (Production)
# Create the final production image with minimal size
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production for optimizations
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone server files from builder
COPY --from=builder /app/.next/standalone ./

# Create parent directories for assets to ensure cp commands succeed
# This prevents "No such file or directory" errors during Railway/Nixpacks deployment
RUN mkdir -p /app/frontend/public && \
    mkdir -p /app/frontend/.next/static

# Copy public assets to the standalone directory
# Public assets need to be in the standalone output for proper serving
COPY --from=builder /app/public ./frontend/public

# Copy static assets to the standalone directory
# Static assets (JS, CSS, images) need to be in the standalone output
COPY --from=builder /app/.next/static ./frontend/.next/static

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the default Next.js port (3000)
# Railway will map this to the service's public URL
EXPOSE 3000

# Set the port environment variable for Railway
ENV PORT=3000

# Start the Next.js standalone server
# This runs the optimized standalone server built by Next.js
CMD ["node", "frontend/server.js"]
