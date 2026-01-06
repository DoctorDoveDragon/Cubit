#!/usr/bin/env bash
set -e
echo "=== start-fullstack: prefer docker-compose for local full-stack runs ==="
if command -v docker-compose >/dev/null 2>&1 || (command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1); then
  echo "Using docker-compose to build & run services..."
  if docker compose version >/dev/null 2>&1; then
    docker compose up --build
  else
    docker-compose up --build
  fi
  exit 0
fi

echo "docker-compose not found; falling back to local processes"
if [ -f "backend/api.py" ]; then
  echo "Starting backend using python3 backend/api.py on port 8080..."
  (cd backend && python3 api.py) &
  BACKEND_PID=$!
  echo "Backend PID: $BACKEND_PID"
  sleep 2
else
  echo "Backend files not found at backend/ - please run from repo root or use docker-compose"
fi

if [ -d "frontend" ]; then
  echo "Starting frontend (Next.js) on port ${PORT:-3000}..."
  cd frontend
  if [ ! -d ".next" ]; then
    echo "No .next build found — running npm run build..."
    npm run build
  fi
  npm run start
else
  echo "Frontend directory not found at frontend/ - please run from repo root or use docker-compose"
fi
