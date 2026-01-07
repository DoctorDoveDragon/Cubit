#!/bin/bash

# Exit on error
set -e

echo "Starting full-stack deployment..."

# Check if required environment variables are set
if [ -z "$DATABASE_URL" ]; then
    echo "Error: DATABASE_URL is not set"
    exit 1
fi

if [ -z "$JWT_SECRET" ]; then
    echo "Error: JWT_SECRET is not set"
    exit 1
fi

# Set default ports if not provided
export BACKEND_PORT=${BACKEND_PORT:-8000}
export FRONTEND_PORT=${FRONTEND_PORT:-3000}

echo "Backend will run on port: $BACKEND_PORT"
echo "Frontend will run on port: $FRONTEND_PORT"

# Function to cleanup background processes on exit
cleanup() {
    echo "Cleaning up..."
    kill $(jobs -p) 2>/dev/null || true
}
trap cleanup EXIT

# Start backend
echo "Starting backend server..."
cd backend

# Install backend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

# Run Prisma migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Generate Prisma Client
echo "Generating Prisma Client..."
npx prisma generate

# Start backend server in background
echo "Launching backend server on port $BACKEND_PORT..."
PORT=$BACKEND_PORT node src/server.js &
BACKEND_PID=$!

# Wait for backend to be ready
echo "Waiting for backend to be ready..."
sleep 5

# Start frontend
echo "Starting frontend server..."
cd ../frontend

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend server
echo "Launching frontend server on port $FRONTEND_PORT..."
exec env PORT=$FRONTEND_PORT HOSTNAME=0.0.0.0 BACKEND_URL=http://localhost:8000 node server.js
