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
RUN npm ci


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
# ------------------------------------------------------------------------------
FROM node:20-alpine AS runner

WORKDIR /app

# Set NODE_ENV to production for optimizations
ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files for production
COPY --from=builder /app/next.config.ts ./
COPY --from=builder /app/package.json ./
COPY --from=builder /app/package-lock.json ./

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Install only production dependencies
RUN npm ci --omit=dev

# Change ownership to non-root user
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Expose the default Next.js port (3000)
# Railway will map this to the service's public URL
EXPOSE 3000

# Set the port environment variable for Railway
ENV PORT=3000

# Start the Next.js server using standard next start command
CMD ["npm", "run", "start"]
