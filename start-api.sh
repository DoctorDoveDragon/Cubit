#!/bin/bash
set -e

# Resilient start script for Cubit
# - Detects Next.js standalone server.js in multiple candidate paths
# - If missing, attempts to build the frontend (if present)
# - Falls back to running the FastAPI backend via uvicorn

echo "========================================"
echo "🚀 Starting Cubit (resilient start-api.sh)"
echo "========================================"

PORT=${PORT:-8080}
NODE_ENV=${NODE_ENV:-production}

# Candidate server.js locations (checked in order)
CANDIDATES=(
  "frontend/.next/standalone/server.js"
  "frontend/.next/standalone/*/server.js"
  "frontend/.next/standalone/frontend/server.js"
)

find_server_js() {
  for p in "${CANDIDATES[@]}"; do
    # Expand glob patterns safely
    matches=( $p )
    for m in "${matches[@]}"; do
      if [ -f "$m" ]; then
        echo "$m"
        return 0
      fi
    done
  done
  return 1
}

start_frontend_server() {
  local server_js="$1"
  echo "Found frontend server: $server_js"
  echo "Starting frontend server with PORT=$PORT"
  export NODE_ENV="$NODE_ENV"
  export PORT="$PORT"
  # Exec so this process becomes the node process in containers
  exec node "$server_js"
}

if server_path=$(find_server_js); then
  start_frontend_server "$server_path"
fi

# If frontend exists, try to build it
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
  echo "⚠️ Standalone build not found. Attempting to build frontend..."
  pushd frontend >/dev/null
  if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    PUPPETEER_SKIP_DOWNLOAD=true npm ci || PUPPETEER_SKIP_DOWNLOAD=true npm install
  fi
  echo "Building frontend..."
  npm run build
  popd >/dev/null

  # Re-check for server.js
  if server_path=$(find_server_js); then
    start_frontend_server "$server_path"
  else
    echo "⚠️ Build completed but standalone server.js not found. Checking for standard build..."
    if [ -d "frontend/.next" ]; then
      echo "Standard build exists. Starting dev server (next start)..."
      pushd frontend >/dev/null
      exec npm run start
    fi
  fi
fi

# Fall back to API-only mode
echo "⚠️ Frontend unavailable or build failed. Starting API-only mode..."
exec uvicorn api:app --host 0.0.0.0 --port "$PORT" --workers 1
