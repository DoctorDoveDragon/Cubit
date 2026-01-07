#!/bin/bash
# Startup script for Cubit full-stack application
# Runs both FastAPI backend and Next.js frontend servers

set -e

echo "=== Starting Cubit Full-Stack Application ==="

# Save the frontend port
FRONTEND_PORT=${PORT:-3000}

# Determine Python executable (use venv if available, otherwise system python3)
if [ -f "/opt/venv/bin/python3" ]; then
  PYTHON_BIN="/opt/venv/bin/python3"
else
  PYTHON_BIN="python3"
fi

# Start FastAPI backend in background on fixed port 8080
echo "Starting FastAPI backend on port 8080 using $PYTHON_BIN..."
PORT=8080 $PYTHON_BIN api.py > /tmp/backend.log 2>&1 &
BACKEND_PID=$!

# Wait for backend to initialize
echo "Waiting for backend to initialize..."
sleep 3

# Check if backend process is still running
if ! kill -0 $BACKEND_PID 2>/dev/null; then
  echo "ERROR: Backend failed to start"
  echo "Backend logs:"
  cat /tmp/backend.log
  exit 1
fi

# Verify backend is responding to health checks
echo "Verifying backend health..."
for i in {1..10}; do
  if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "✓ Backend started successfully (PID: $BACKEND_PID)"
    break
  fi
  if [ $i -eq 10 ]; then
    echo "ERROR: Backend not responding to health checks after 10 attempts"
    echo "Backend logs:"
    cat /tmp/backend.log
    kill $BACKEND_PID 2>/dev/null || true
    exit 1
  fi
  sleep 1
done

# Determine frontend directory path
# After nixpacks build, the standalone output is in ./frontend-standalone
# The standalone server.js is at the root level of that directory
if [ -d "frontend-standalone" ] && [ -f "frontend-standalone/server.js" ]; then
  FRONTEND_DIR="frontend-standalone"
elif [ -d "frontend" ] && [ -f "frontend/server.js" ]; then
  FRONTEND_DIR="frontend"
else
  echo "ERROR: Frontend build not found. Expected: frontend-standalone/server.js or frontend/server.js"
  kill $BACKEND_PID 2>/dev/null || true
  exit 1
fi

# Start Next.js frontend on the main port
echo "Starting Next.js frontend on port ${FRONTEND_PORT}..."
cd "$FRONTEND_DIR"

# Use exec to replace shell with Node.js process for proper signal handling
exec env PORT=$FRONTEND_PORT BACKEND_URL=http://localhost:8080 node server.js
