#!/usr/bin/env python3
"""
Cubit Full-Stack Application Startup Script
Starts both FastAPI backend and Next.js frontend servers
"""

import os
import sys
import time
import subprocess
import signal
from pathlib import Path

# Process tracking
backend_process = None
frontend_process = None

def signal_handler(sig, frame):
    """Handle graceful shutdown on SIGINT/SIGTERM"""
    print("\n=== Shutting down Cubit application ===")
    if backend_process:
        backend_process.terminate()
    if frontend_process:
        frontend_process.terminate()
    sys.exit(0)

def start_backend():
    """Start the FastAPI backend server"""
    print("Starting FastAPI backend on port 8000...")
    
    backend_env = os.environ.copy()
    backend_env['PORT'] = '8000'
    
    # Start backend process
    backend = subprocess.Popen(
        [sys.executable, 'api.py'],
        env=backend_env,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    
    # Wait for backend to initialize
    time.sleep(3)
    
    # Check if process is still running
    if backend.poll() is not None:
        stdout, stderr = backend.communicate()
        print(f"ERROR: Backend failed to start")
        print(f"STDOUT: {stdout}")
        print(f"STDERR: {stderr}")
        sys.exit(1)
    
    print(f"✓ Backend started successfully (PID: {backend.pid})")
    return backend

def start_frontend():
    """Start the Next.js frontend server"""
    frontend_port = os.environ.get('PORT', '3000')
    print(f"Starting Next.js frontend on port {frontend_port}...")
    
    # Determine frontend directory
    frontend_paths = [
        Path('frontend-standalone/server.js'),
        Path('frontend/server.js'),
        Path('.next/standalone/server.js')
    ]
    
    frontend_server = None
    for path in frontend_paths:
        if path.exists():
            frontend_server = path
            break
    
    if not frontend_server:
        print("ERROR: Frontend build not found")
        print(f"Searched paths: {[str(p) for p in frontend_paths]}")
        return None
    
    frontend_env = os.environ.copy()
    frontend_env['PORT'] = frontend_port
    frontend_env['HOSTNAME'] = '0.0.0.0'
    frontend_env['BACKEND_URL'] = 'http://localhost:8000'
    
    # Start frontend process
    frontend = subprocess.Popen(
        ['node', str(frontend_server)],
        env=frontend_env,
        cwd=str(frontend_server.parent) if frontend_server.parent != Path('.') else None
    )
    
    print(f"✓ Frontend started successfully (PID: {frontend.pid})")
    return frontend

def main():
    """Main startup routine"""
    # Register signal handlers
    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)
    
    print("=== Starting Cubit Full-Stack Application ===")
    
    global backend_process, frontend_process
    
    # Start backend
    backend_process = start_backend()
    
    # Give backend time to fully initialize
    time.sleep(5)
    
    # Check backend is still alive
    if backend_process.poll() is not None:
        print("ERROR: Backend process died during startup")
        sys.exit(1)
    
    # Start frontend
    frontend_process = start_frontend()
    
    if not frontend_process:
        backend_process.terminate()
        sys.exit(1)
    
    print("\n✓ Cubit application is running")
    print(f"  Backend:  http://localhost:8000")
    print(f"  Frontend: http://localhost:{os.environ.get('PORT', '3000')}")
    
    # Keep the script running and monitor processes
    try:
        while True:
            # Check if either process has died
            if backend_process.poll() is not None:
                print("ERROR: Backend process died")
                frontend_process.terminate()
                sys.exit(1)
            
            if frontend_process.poll() is not None:
                print("ERROR: Frontend process died")
                backend_process.terminate()
                sys.exit(1)
            
            time.sleep(1)
    except KeyboardInterrupt:
        signal_handler(None, None)

if __name__ == '__main__':
    main()
