#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob

echo "========================================"
echo "🚀 Starting Cubit (resilient start-api.sh)"
echo "========================================"

PORT="${PORT:-8080}"
NODE_ENV="${NODE_ENV:-production}"

# Candidate server.js locations (checked in order)
CANDIDATES=(
  "frontend/.next/standalone/server.js"
  "frontend/.next/standalone/*/server.js"
  "frontend/.next/standalone/frontend/server.js"
)

find_server_js() {
  for p in "${CANDIDATES[@]}"; do
    for m in $p; do
      if [ -f "$m" ]; then
        printf '%s\n' "$m"
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
  export NODE_ENV PORT
  # exec to replace this process with node
  exec node "$server_js"
}

if server_path=$(find_server_js); then
  start_frontend_server "$server_path"
fi

# If frontend exists, try to build it (best-effort)
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
  echo "⚠️ Standalone build not found. Attempting to build frontend..."
  pushd frontend >/dev/null
  if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    if command -v npm >/dev/null 2>&1; then
      npm ci || npm install
    else
      echo "npm not found; cannot install frontend dependencies"
    fi
  fi

  if command -v npm >/dev/null 2>&1; then
    echo "Building frontend..."
    npm run build || true
  else
    echo "npm not available — skipping frontend build."
  fi
  popd >/dev/null

  if server_path=$(find_server_js); then
    start_frontend_server "$server_path"
  fi

  # If standalone still isn't present, fall back to next start if available
  if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
    if [ -d "frontend/.next" ] && command -v npm >/dev/null 2>&1; then
      echo "Standard Next build exists or build attempted. Starting 'next start' (frontend)..."
      pushd frontend >/dev/null
      exec npm run start
    fi
  fi
fi

# Fallback to API-only mode
echo "⚠️ Frontend unavailable or build failed. Starting API-only mode..."
cd backend
exec uvicorn api:app --host 0.0.0.0 --port "${PORT}" --workers 1
