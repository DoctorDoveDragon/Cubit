# ==============================================================================
# Multi-stage Dockerfile for Next.js Frontend (Standalone Output)
# Builds and runs Next.js in standalone mode for optimized production deployment
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
# Skip puppeteer download to avoid network issues
ENV PUPPETEER_SKIP_DOWNLOAD=true
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

# Build the Next.js application (standalone output enabled in next.config.ts)
ENV NEXT_TELEMETRY_DISABLED=1
ENV NEXT_PUBLIC_API_URL=http://localhost:8080
RUN npm run build


# ------------------------------------------------------------------------------
# Stage 3: Runner (Production)
# Create the final production image with minimal size using standalone output
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production for optimizations
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone output from the builder
# Next.js standalone mode preserves the directory name in the output structure
# Even when building from the frontend directory, it creates .next/standalone/frontend/
COPY --from=builder /app/.next/standalone/frontend ./

# Copy static assets to the correct location
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose port 3000
EXPOSE 3000

# Set the port environment variable
ENV PORT=3000

# Backend URL (can be overridden at runtime)
ENV BACKEND_URL=http://localhost:8080

# Start the Next.js server using standalone mode entry point
CMD ["node", "server.js"]

