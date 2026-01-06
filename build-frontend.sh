#!/usr/bin/env bash
set -euo pipefail
shopt -s nullglob

echo "Building frontend (build-frontend.sh)"

if [ ! -d "frontend" ]; then
  echo "No frontend directory found; nothing to build."
  exit 1
fi

pushd frontend >/dev/null

# Clean previous build artifacts
rm -rf .next

# Install dependencies
if [ -f package-lock.json ] || [ -f npm-shrinkwrap.json ]; then
  npm ci
else
  npm install
fi

# Build Next.js (allow failure to be detectable by exit code)
npm run build

# Ensure standalone directory exists (Next may produce different layouts)
mkdir -p .next/standalone

# Copy public and .next/static into standalone so assets are available (best-effort)
if [ -d "public" ]; then
  cp -r public .next/standalone/ || true
fi
if [ -d ".next/static" ]; then
  mkdir -p .next/standalone/.next
  cp -r .next/static .next/standalone/.next/ || true
fi

# Detect server.js in candidate locations
CANDIDATES=(
  ".next/standalone/server.js"
  ".next/standalone/*/server.js"
  ".next/standalone/frontend/server.js"
)

found=0
for p in "${CANDIDATES[@]}"; do
  for m in $p; do
    if [ -f "$m" ]; then
      echo "✅ Standalone server found: $m"
      found=1
    fi
  done
done

if [ "$found" -eq 1 ]; then
  echo "Standalone build ready: .next/standalone"
  popd >/dev/null
  exit 0
else
  echo "⚠️ Standalone server not found after build. Ensure Next's experimental.output: 'standalone' (or appropriate Next configuration) and that your Next version supports standalone output."
  popd >/dev/null
  exit 2
fi
