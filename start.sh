#!/bin/bash

echo "🚀 Starting Cubit Programming Language..."
echo ""

# Start backend API in background
echo "Starting backend API on http://localhost:8080..."
python3 api.py &
BACKEND_PID=$!

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "Starting frontend on http://localhost:3000..."
cd frontend
npm run dev

# When frontend is killed, also kill backend
kill $BACKEND_PID
