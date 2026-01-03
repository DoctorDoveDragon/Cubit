#!/bin/bash

echo "🚀 Starting Cubit Programming Language..."
echo ""

# Function to cleanup background processes
cleanup() {
    if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
        echo ""
        echo "Stopping backend API..."
        kill "$BACKEND_PID"
    fi
}

# Register cleanup function
trap cleanup EXIT

# Start backend API in background
echo "Starting backend API on http://localhost:8080..."
python3 api.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Check if backend is still running
if ! kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo "❌ Failed to start backend API"
    exit 1
fi

echo "✅ Backend API started successfully"

# Start frontend
echo "Starting frontend on http://localhost:3000..."
cd frontend
npm run dev
