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
call npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)

cd ..

echo.
echo ✨ Setup complete! 🎉
echo.
echo To start Cubit:
echo.
echo Option 1 - Manual (Two terminals):
echo   Terminal 1 (Backend API):
echo     python api.py
echo.
echo   Terminal 2 (Frontend):
echo     cd frontend
echo     npm run dev
echo.
echo Then visit: http://localhost:3000
echo.
echo Note: For automated startup on Unix/Linux/Mac, use ./start.sh
echo.

pause
