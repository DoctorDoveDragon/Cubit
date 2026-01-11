# ==============================================================================
# Multi-stage Dockerfile for Next.js Frontend
# Optimized for Railway/Nixpacks deployment with standard Next.js build
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
RUN npm ci --legacy-peer-deps


# ------------------------------------------------------------------------------
# Stage 2: Builder
# Build the Next.js application
# ------------------------------------------------------------------------------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy all source files
COPY . .

# Build the Next.js application
RUN npm run build


# ------------------------------------------------------------------------------
# Stage 3: Runner (Production)
# Create the final production image with minimal size
# For standalone output mode
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production for optimizations
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy the standalone output from the builder
# This includes all necessary dependencies automatically bundled by Next.js
# Next.js creates .next/standalone/frontend/ structure for apps in subdirectories
COPY --from=builder /app/.next/standalone ./
# Copy static assets to the correct location within the standalone structure
COPY --from=builder /app/.next/static ./frontend/.next/static
COPY --from=builder /app/public ./frontend/public

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the default Next.js port (3000)
# Railway will map this to the service's public URL
EXPOSE 3000

# Set the port environment variable for Railway
ENV PORT=3000

# Start the Next.js server using standalone mode command
# Next.js standalone mode for apps in subdirectories creates .next/standalone/<dirname>/server.js
CMD ["node", "frontend/server.js"]
