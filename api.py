#!/usr/bin/env python3
"""
FastAPI Web Server for Cubit Programming Language
Provides REST API endpoints for executing Cubit code
"""

import os
from io import StringIO
from typing import Optional, Any, Dict, List
from contextlib import redirect_stdout
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from interpreter import Interpreter

# Ensure pedagogical import is resilient
try:
    from pedagogical.api import PedagogicalAPI
except Exception:
    import sys
    sys.path.append('.')
    try:
        from pedagogical.api import PedagogicalAPI  # type: ignore
    except Exception:
        class PedagogicalAPI:
            def __init__(self, wrapped_api, **kwargs):
                self.wrapped_api = wrapped_api
                self.call_history = []
                self.verbosity = kwargs.get('default_verbosity', 'normal')

            def call(self, method_name, *args, **kwargs):
                result = getattr(self.wrapped_api, method_name)(*args, **kwargs)
                self.call_history.append({
                    'method': method_name,
                    'args': args,
                    'kwargs': kwargs,
                    'result': result
                })
                return result

            def set_verbosity(self, level):
                self.verbosity = level

            def get_learning_progress(self):
                return {}

            def suggest_next_concepts(self, mastered=None):
                return []

            def _infer_skill_level(self):
                return 'beginner'
            
            def get_last_teaching_moment(self):
                return None

# Initialize FastAPI app
app = FastAPI(
    title="Cubit Programming Language API",
    description="REST API for executing Cubit programming language code",
    version="1.0.0"
)

# Configure CORS with environment-based allowed origins
# For production, set CORS_ORIGINS to your frontend URL(s)
# For development, it defaults to allow all origins
cors_origins_env = os.environ.get("CORS_ORIGINS", "*")
if cors_origins_env == "*":
    allowed_origins = ["*"]
else:
    # Split by comma to support multiple origins
    allowed_origins = [origin.strip() for origin in cors_origins_env.split(",")]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,  # Credentials not needed for public API
    allow_methods=["*"],
    allow_headers=["*"],
)


class ExecuteRequest(BaseModel):
    """Request model for code execution"""
    code: str
    teaching_enabled: Optional[bool] = True
    verbosity: Optional[str] = 'normal'


class ExecuteResponse(BaseModel):
    """Response model for code execution"""
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    output: Optional[str] = None
    result: Optional[Any] = None
    error: Optional[str] = None
    teaching_moment: Optional[Dict[str, Any]] = None
    skill_level: Optional[str] = None
    progress: Optional[Dict[str, Any]] = None
    suggestions: Optional[List[str]] = None


@app.get("/")
async def root():
    """Welcome endpoint with API information"""
    return {
        "message": "Welcome to Cubit Programming Language API",
        "version": "1.0.0 - Teaching Edition",
        "features": [
            "Code execution",
            "Adaptive teaching system",
            "Skill-level inference",
            "Learning progress tracking",
            "Concept suggestions"
        ],
        "endpoints": {
            "/": "API information (this page)",
            "/health": "Health check endpoint",
            "/execute": "Execute Cubit code (POST)",
            "/progress": "Get learning progress (GET)",
            "/concepts": "Get concept suggestions (GET)"
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
    Execute Cubit code and return the output with optional teaching insights
    
    Args:
        request: ExecuteRequest containing:
            - code: The Cubit code to execute
            - teaching_enabled: Whether to provide teaching insights (default: True)
            - verbosity: Teaching detail level - minimal/normal/detailed (default: normal)
        
    Returns:
        ExecuteResponse with output, result, error, and optional teaching data
    """
    # Create a new interpreter instance for each request to ensure clean state
    interpreter = Interpreter()
    
    # Wrap with pedagogical API if teaching is enabled
    if request.teaching_enabled:
        ped_interpreter = PedagogicalAPI(
            interpreter,
            default_verbosity=request.verbosity or 'normal',
            silent_mode=True  # Don't print teaching insights, return as structured data
        )
    
    # Capture stdout using context manager to avoid race conditions
    output_buffer = StringIO()
    
    try:
        # Execute the code with stdout redirected
        with redirect_stdout(output_buffer):
            if request.teaching_enabled:
                result = ped_interpreter.call('run', request.code)
            else:
                result = interpreter.run(request.code)
        
        # Get the output
        output = output_buffer.getvalue()
        
        # Get pedagogical data if teaching is enabled
        teaching_data = {}
        if request.teaching_enabled:
            teaching_data = {
                'teaching_moment': ped_interpreter.get_last_teaching_moment(),
                'skill_level': ped_interpreter._infer_skill_level(),
                'progress': ped_interpreter.get_learning_progress(),
                'suggestions': ped_interpreter.suggest_next_concepts()[:5]
            }
        
        # Return success response
        return ExecuteResponse(
            output=output if output else None,
            result=result,
            error=None,
            **teaching_data
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


@app.get("/progress")
async def get_progress():
    """
    Get example learning progress information
    
    Returns:
        Progress metrics and skill level information
    """
    return {
        "message": "Progress tracking is session-based in execute endpoint",
        "info": "Each /execute request with teaching_enabled=true includes progress data"
    }


@app.get("/concepts")
async def get_concepts():
    """
    Get programming concept suggestions
    
    Returns:
        List of programming concepts with dependencies
    """
    from pedagogical.concept_mapper import ConceptDependencyMapper
    
    mapper = ConceptDependencyMapper()
    
    # Get some common concept paths
    concepts = {
        'beginner': mapper.suggest_next_concepts([]),
        'intermediate': mapper.suggest_next_concepts(['variables', 'functions', 'loops']),
        'advanced': mapper.suggest_next_concepts(['variables', 'functions', 'loops', 'lists', 'conditionals']),
    }
    
    return {
        "concepts": concepts,
        "graph": {
            concept: {
                'prerequisites': mapper.get_prerequisites(concept),
                'difficulty': mapper.get_concept_difficulty(concept)
            }
            for concept in ['variables', 'functions', 'loops', 'lists', 'classes', 'decorators']
        }
    }


if __name__ == "__main__":
    import uvicorn
    import os
    
    # Get port from environment variable or default to 8080
    port = int(os.environ.get("PORT", 8080))
    
    # Run the server
    uvicorn.run(app, host="0.0.0.0", port=port)
