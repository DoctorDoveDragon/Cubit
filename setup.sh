#!/bin/bash

echo "🚀 Setting up Cubit Programming Language Environment"
echo ""

# Check Python installation
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

echo "✅ Python 3 found: $(python3 --version)"

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Install Python dependencies
echo ""
echo "📦 Installing Python dependencies..."
if pip3 install -r backend/requirements.txt; then
    echo "✅ Python dependencies installed"
else
    echo "❌ Failed to install Python dependencies"
    exit 1
fi

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
if PUPPETEER_SKIP_DOWNLOAD=true npm install; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Failed to install frontend dependencies"
    exit 1
fi

# Build frontend for production
echo ""
echo "🔨 Building frontend for production (standalone mode)..."
if npm run build; then
    echo "✅ Frontend built successfully"
else
    echo "❌ Failed to build frontend"
    exit 1
fi

cd ..

echo ""
echo "✨ Setup complete! 🎉"
echo ""
echo "===================================================="
echo "              How to Run Cubit"
echo "===================================================="
echo ""
echo "Option 1 - Production Mode (Standalone, Recommended):"
echo "  ./start.sh"
echo "  (Runs both backend and Next.js standalone build)"
echo ""
echo "Option 2 - Development Mode (Two terminals):"
echo "  Terminal 1 (Backend API):"
echo "    cd backend && python3 api.py"
echo ""
echo "  Terminal 2 (Frontend Dev Server):"
echo "    cd frontend"
echo "    npm run dev"
echo ""
echo "Option 3 - Docker (Full-stack):"
echo "  docker compose up --build"
echo ""
echo "===================================================="
echo "URLs:"
echo "  Frontend:       http://localhost:3000"
echo "  Backend API:    http://localhost:8080"
echo "  API Docs:       http://localhost:8080/docs"
echo "===================================================="
echo ""
