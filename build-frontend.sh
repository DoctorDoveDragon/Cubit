#!/usr/bin/env bash
# Frontend standalone build script for Cubit
# Validates and creates Next.js standalone build with proper asset copying

set -euo pipefail
shopt -s nullglob

echo "==> Cubit Frontend Build Script"

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
  echo "❌ Error: frontend directory not found!"
  echo "   Expected: ./frontend"
  exit 1
fi

cd frontend

# Remove previous build
echo "==> Cleaning previous build..."
rm -rf .next

# Install dependencies
echo "==> Installing dependencies..."
if [ -f "package-lock.json" ]; then
  npm ci || npm install
else
  npm install
fi

# Run build
echo "==> Running npm run build..."
npm run build

# Verify standalone directory exists
if [ ! -d ".next/standalone" ]; then
  echo "❌ Error: .next/standalone directory not created!"
  echo "   Make sure next.config has output: 'standalone'"
  exit 1
fi

# Copy public directory to standalone (best-effort)
echo "==> Copying public assets to standalone..."
if [ -d "public" ]; then
  mkdir -p .next/standalone
  cp -r public .next/standalone/ || echo "⚠️  Warning: Failed to copy public directory (non-fatal)"
else
  echo "   No public directory found, skipping..."
fi

# Copy .next/static to standalone/.next/static (best-effort)
echo "==> Copying static assets to standalone..."
if [ -d ".next/static" ]; then
  mkdir -p .next/standalone/.next
  cp -r .next/static .next/standalone/.next/ || echo "⚠️  Warning: Failed to copy static assets (non-fatal)"
else
  echo "   No .next/static directory found, skipping..."
fi

cd ..

# Candidate locations for Next.js standalone server.js
CANDIDATE_LOCATIONS=(
  "frontend/.next/standalone/server.js"
  frontend/.next/standalone/*/server.js
  "frontend/.next/standalone/frontend/server.js"
)

# Function to find server.js
find_server_js() {
  for location in "${CANDIDATE_LOCATIONS[@]}"; do
    if [ -f "$location" ]; then
      echo "$location"
      return 0
    fi
  done
  return 1
}

# Verify server.js exists
if SERVER_JS=$(find_server_js); then
  echo "✅ Build successful!"
  echo "   Standalone server found at: $SERVER_JS"
  exit 0
else
  echo "❌ Error: Standalone server.js not found!"
  echo "   Checked locations:"
  for location in "${CANDIDATE_LOCATIONS[@]}"; do
    echo "     - $location"
  done
  echo ""
  echo "   Contents of .next/standalone:"
  ls -la frontend/.next/standalone/ || true
  exit 2
fi
