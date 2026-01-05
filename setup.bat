@echo off
echo 🚀 Setting up Cubit Programming Language Environment
echo.

REM Check Python installation
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Python is not installed. Please install Python 3.8+ first.
    exit /b 1
)

echo ✅ Python found
python --version

REM Check Node.js installation
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo ✅ Node.js found
node --version

REM Install Python dependencies
echo.
echo 📦 Installing Python dependencies...
pip install -r requirements.txt

if %errorlevel% neq 0 (
    echo ❌ Failed to install Python dependencies
    exit /b 1
)

echo ✅ Python dependencies installed

REM Install frontend dependencies
echo.
echo 📦 Installing frontend dependencies...
cd frontend
set PUPPETEER_SKIP_DOWNLOAD=true
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)

echo ✅ Frontend dependencies installed

REM Build frontend for production
echo.
echo 🔨 Building frontend for production (standalone mode)...
call npm run build

if %errorlevel% neq 0 (
    echo ❌ Failed to build frontend
    exit /b 1
)

echo ✅ Frontend built successfully

cd ..

echo.
echo ✨ Setup complete! 🎉
echo.
echo ====================================================
echo               How to Run Cubit
echo ====================================================
echo.
echo Option 1 - Production Mode (Manual, Two terminals):
echo   Terminal 1 (Backend API):
echo     python api.py
echo.
echo   Terminal 2 (Frontend Standalone):
echo     cd frontend\.next\standalone\frontend
echo     set BACKEND_URL=http://localhost:8080
echo     set PORT=3000
echo     node server.js
echo.
echo Option 2 - Development Mode (Two terminals):
echo   Terminal 1 (Backend API):
echo     python api.py
echo.
echo   Terminal 2 (Frontend Dev Server):
echo     cd frontend
echo     npm run dev
echo.
echo Option 3 - Docker (Full-stack):
echo   docker-compose up --build
echo.
echo ====================================================
echo URLs:
echo   Frontend:       http://localhost:3000
echo   Backend API:    http://localhost:8080
echo   API Docs:       http://localhost:8080/docs
echo ====================================================
echo.
echo Note: For automated startup on Unix/Linux/Mac, use ./start.sh
echo.

pause
