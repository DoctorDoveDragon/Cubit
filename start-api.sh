#!/usr/bin/env bash
# Resilient deployment script for Cubit API/Frontend Server
# Detects Next.js standalone server in multiple locations and falls back gracefully

set -euo pipefail
shopt -s nullglob

# Default values
PORT="${PORT:-8080}"
NODE_ENV="${NODE_ENV:-production}"

export PORT
export NODE_ENV

echo "==> Cubit Deployment Script"
echo "    PORT: $PORT"
echo "    NODE_ENV: $NODE_ENV"

# Function to find server.js in candidate locations
find_server_js() {
  # Check explicit paths first
  local candidates=(
    "frontend/.next/standalone/server.js"
    "frontend/.next/standalone/frontend/server.js"
  )
  
  for location in "${candidates[@]}"; do
    if [ -f "$location" ]; then
      echo "$location"
      return 0
    fi
  done
  
  # Check glob pattern for wildcard locations
  for location in frontend/.next/standalone/*/server.js; do
    if [ -f "$location" ]; then
      echo "$location"
      return 0
    fi
  done
  
  return 1
}

# Try to find existing server.js
if SERVER_JS=$(find_server_js); then
  echo "==> Found Next.js standalone server at: $SERVER_JS"
  echo "==> Starting Next.js frontend server..."
  exec node "$SERVER_JS"
fi

# Server not found - attempt frontend build if possible
echo "==> Next.js standalone server not found, checking for frontend..."

if [ ! -f "frontend/package.json" ]; then
  echo "==> Frontend not available, starting API-only mode..."
  exec uvicorn api:app --host 0.0.0.0 --port "$PORT" --workers 1
fi

echo "==> Frontend detected, attempting best-effort build..."

# Check if npm is available
if ! command -v npm &> /dev/null; then
  echo "==> npm not available, starting API-only mode..."
  exec uvicorn api:app --host 0.0.0.0 --port "$PORT" --workers 1
fi

# Try to install dependencies and build
cd frontend

echo "==> Installing frontend dependencies..."
if [ -f "package-lock.json" ]; then
  npm ci || npm install || {
    echo "==> Failed to install dependencies, starting API-only mode..."
    cd ..
    exec uvicorn api:app --host 0.0.0.0 --port "$PORT" --workers 1
  }
else
  npm install || {
    echo "==> Failed to install dependencies, starting API-only mode..."
    cd ..
    exec uvicorn api:app --host 0.0.0.0 --port "$PORT" --workers 1
  }
fi

echo "==> Building frontend..."
npm run build || {
  echo "==> Build failed, checking for existing .next directory..."
  if [ -d ".next" ]; then
    echo "==> Found .next directory, attempting npm run start..."
    exec npm run start
  fi
  echo "==> No .next directory, starting API-only mode..."
  cd ..
  exec uvicorn api:app --host 0.0.0.0 --port "$PORT" --workers 1
}

cd ..

# Re-check for server.js after build
if SERVER_JS=$(find_server_js); then
  echo "==> Build successful! Found server at: $SERVER_JS"
  echo "==> Starting Next.js frontend server..."
  exec node "$SERVER_JS"
fi

# Build completed but no standalone server found
echo "==> Build completed but standalone server not found"
if [ -d "frontend/.next" ]; then
  echo "==> Found .next directory, attempting npm run start..."
  cd frontend
  exec npm run start
fi

# Ultimate fallback
echo "==> Frontend unavailable, starting API-only mode..."
exec uvicorn api:app --host 0.0.0.0 --port "$PORT" --workers 1
