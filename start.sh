#!/bin/bash
set -e

echo "🚀 Starting Cubit Full-Stack Application (Production Mode)"
echo ""

# Function to cleanup background processes
cleanup() {
    echo ""
    echo "Shutting down services..."
    if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo "Stopping backend API (PID: $BACKEND_PID)..."
        kill "$BACKEND_PID"
        wait "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
        echo "Stopping frontend server (PID: $FRONTEND_PID)..."
        kill "$FRONTEND_PID"
        wait "$FRONTEND_PID" 2>/dev/null || true
    fi
    echo "✅ Services stopped"
}

# Register cleanup function
trap cleanup EXIT INT TERM

# Start backend API in background
echo "Starting FastAPI backend on http://localhost:8080..."
python3 api.py &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait for backend health check
echo "Waiting for backend to be healthy..."
for i in {1..30}; do
    if curl -sSf http://localhost:8080/health >/dev/null 2>&1; then
        echo "✅ Backend API is healthy and ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Backend failed to become healthy within 30 seconds"
        exit 1
    fi
    sleep 1
done

# Check if Next.js standalone build exists
if [ ! -f "frontend/.next/standalone/frontend/server.js" ]; then
    echo "❌ Next.js standalone build not found!"
    echo "Please run 'cd frontend && npm run build' first"
    exit 1
fi

# Start Next.js frontend in standalone mode
echo "Starting Next.js frontend on http://localhost:3000..."
ORIGINAL_DIR=$(pwd)
cd frontend/.next/standalone/frontend
BACKEND_URL=http://localhost:8080 PORT=3000 node server.js &
FRONTEND_PID=$!
cd "$ORIGINAL_DIR"
echo "Frontend PID: $FRONTEND_PID"

# Wait for frontend to start
echo "Waiting for frontend to start..."
for i in {1..30}; do
    if curl -sSf http://localhost:3000 >/dev/null 2>&1; then
        echo "✅ Frontend is ready"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "⚠️  Frontend might not be ready yet, but continuing..."
        break
    fi
    sleep 1
done

echo ""
echo "✨ Cubit is now running!"
echo ""
echo "📍 Backend API:    http://localhost:8080"
echo "📍 API Docs:       http://localhost:8080/docs"
echo "📍 Frontend:       http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait
