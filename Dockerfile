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
COPY frontend/package.json frontend/package-lock.json ./

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

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip3 install --no-cache-dir -r requirements.txt --break-system-packages

# Copy backend source code
COPY api.py .
COPY interpreter.py .
COPY lexer.py .
COPY parser.py .
COPY cubit.py .
COPY pedagogical/ ./pedagogical/

# Copy frontend built files
# The standalone build includes everything needed to run the frontend
COPY --from=frontend-builder /app/frontend/.next/standalone/frontend ./frontend
COPY --from=frontend-builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Create startup script that runs both servers
RUN echo '#!/bin/bash\n\
set -e\n\
\n\
# Start FastAPI backend in background on port 8080\n\
echo "Starting FastAPI backend on port 8080..."\n\
python3 api.py &\n\
BACKEND_PID=$!\n\
\n\
# Wait for backend to be ready\n\
sleep 2\n\
\n\
# Check if backend started successfully\n\
if ! kill -0 $BACKEND_PID 2>/dev/null; then\n\
  echo "ERROR: Failed to start backend"\n\
  exit 1\n\
fi\n\
\n\
echo "Backend started successfully (PID: $BACKEND_PID)"\n\
\n\
# Start Next.js frontend on the main port\n\
echo "Starting Next.js frontend on port ${PORT:-3000}..."\n\
cd frontend\n\
BACKEND_URL=http://localhost:8080 node server.js\n\
' > /app/start.sh && chmod +x /app/start.sh

# Expose the port (Railway will set PORT env variable)
EXPOSE 3000

# Set default environment variables
ENV PORT=3000
ENV BACKEND_URL=http://localhost:8080

# Start both servers
CMD ["/app/start.sh"]

