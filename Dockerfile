FROM node:18-alpine AS builder

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./
RUN npm ci

# Copy backend package files
COPY backend/package.json backend/package-lock.json ./backend/
WORKDIR /app/backend
RUN npm ci

# Copy frontend package files
COPY package.json package-lock.json ./
WORKDIR /app
RUN npm ci

# Copy application code
COPY . .

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Build backend
WORKDIR /app/backend
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy built application
COPY --from=builder /app/backend/dist ./backend/dist
COPY --from=builder /app/frontend/dist ./frontend/dist

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "backend/dist/index.js"]