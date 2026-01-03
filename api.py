#!/usr/bin/env python3
"""
FastAPI Web Server for Cubit Programming Language
Provides REST API endpoints for executing Cubit code
"""

from io import StringIO
from typing import Optional, Any
from contextlib import redirect_stdout
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from interpreter import Interpreter

# Initialize FastAPI app
app = FastAPI(
    title="Cubit Programming Language API",
    description="REST API for executing Cubit programming language code",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for frontend integration
    allow_credentials=False,  # Credentials not needed for public API
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExecuteRequest(BaseModel):
    """Request model for code execution"""
    code: str


class ExecuteResponse(BaseModel):
    """Response model for code execution"""
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    output: Optional[str] = None
    result: Any = None
    error: Optional[str] = None


@app.get("/")
async def root():
    """Welcome endpoint with API information"""
    return {
        "message": "Welcome to Cubit Programming Language API",
        "version": "1.0.0",
        "endpoints": {
            "/": "API information (this page)",
            "/health": "Health check endpoint",
            "/execute": "Execute Cubit code (POST)"
        },
        "documentation": "/docs"
    }


@app.get("/health")
async def health():
    """Health check endpoint for monitoring"""
    return {"status": "healthy"}


@app.post("/execute", response_model=ExecuteResponse)
async def execute_code(request: ExecuteRequest):
    """
    Execute Cubit code and return the output
    
    Args:
        request: ExecuteRequest containing the code to execute
        
    Returns:
        ExecuteResponse with output, result, and error fields
    """
    # Create a new interpreter instance for each request to ensure clean state
    interpreter = Interpreter()
    
    # Capture stdout using context manager to avoid race conditions
    output_buffer = StringIO()
    
    try:
        # Execute the code with stdout redirected
        with redirect_stdout(output_buffer):
            result = interpreter.run(request.code)
        
        # Get the output
        output = output_buffer.getvalue()
        
        # Return success response
        return ExecuteResponse(
            output=output if output else None,
            result=result,
            error=None
        )
    
    except Exception as e:
        # Get any partial output before the error
        output = output_buffer.getvalue()
        
        # Return error response
        return ExecuteResponse(
            output=output if output else None,
            result=None,
            error=str(e)
        )


if __name__ == "__main__":
    import uvicorn
    import os
    
    # Get port from environment variable or default to 8080
    port = int(os.environ.get("PORT", 8080))
    
    # Run the server
    uvicorn.run(app, host="0.0.0.0", port=port)
