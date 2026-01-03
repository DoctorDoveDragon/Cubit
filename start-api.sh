#!/bin/bash
# Deployment script for Cubit API Server
# Installs dependencies and starts the FastAPI server

set -e  # Exit on error

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Starting Cubit API Server..."
# Use PORT environment variable from Railway if available, otherwise default to 8080
PORT=${PORT:-8080}

# Start the server with uvicorn
# --host 0.0.0.0: Listen on all network interfaces
# --port: Use the specified port
# --workers 1: Single worker for simplicity (can be increased for production)
exec uvicorn api:app --host 0.0.0.0 --port "$PORT" --workers 1
