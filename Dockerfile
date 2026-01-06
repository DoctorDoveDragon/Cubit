# ==============================================================================
# Multi-stage Dockerfile for Cubit Full-Stack Application
# Runs both Next.js frontend server and FastAPI backend server
# ==============================================================================

# ------------------------------------------------------------------------------
# Stage 1: Build Frontend
# ------------------------------------------------------------------------------
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package.json frontend/package-lock. json ./

# Install frontend dependencies (skip chromium download for puppeteer)
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Build the Next.js application
RUN npm run build


# ------------------------------------------------------------------------------
# Stage 2: Production with Both Servers
# ------------------------------------------------------------------------------
FROM node:20-slim

# Install Python
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Create and activate virtual environment, then install Python dependencies
COPY requirements.txt .  
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir --upgrade pip && \
    /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# Copy backend source code (all at root level)
COPY api. py . 
COPY interpreter.py .
COPY lexer.py .
COPY parser.py .  
COPY cubit.py .  
COPY pedagogical/ ./pedagogical/

# Copy frontend built files
# Use wildcard to handle variable standalone output structure
RUN mkdir -p ./frontend
COPY --from=frontend-builder /app/frontend/. next/standalone/* ./frontend
COPY --from=frontend-builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Copy startup script
COPY start-fullstack.sh . 
RUN chmod +x start-fullstack. sh

# Expose the port (Railway will set PORT env variable)
EXPOSE 3000

# Set default environment variables
ENV PORT=3000
ENV BACKEND_URL=http://localhost:8080

# Start both servers
CMD ["./start-fullstack.sh"]
