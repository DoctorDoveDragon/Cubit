#!/usr/bin/env python3
"""
FastAPI Web Server for Cubit Programming Language
Provides REST API endpoints for executing Cubit code
"""

import os
import json
import time
from io import StringIO
from typing import Optional, Any, Dict, List
from contextlib import redirect_stdout
from pathlib import Path
from datetime import datetime
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from interpreter import Interpreter
from pedagogical.api import PedagogicalAPI
from games_executor import parse_game_code
from module_metrics import metrics_tracker

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


class GameExecuteRequest(BaseModel):
    """Request model for game code execution"""
    game: str
    code: str
    options: Optional[Dict[str, Any]] = None
    teaching_enabled: Optional[bool] = False
    verbosity: Optional[str] = 'normal'


class ExecuteResponse(BaseModel):
    """Response model for code execution"""
    model_config = ConfigDict(arbitrary_types_allowed=True)
    
    output: Optional[str] = None
    result: Any = None
    error: Optional[str] = None
    teaching_moment: Optional[Dict[str, Any]] = None
    skill_level: Optional[str] = None
    progress: Optional[Dict[str, Any]] = None
    suggestions: Optional[List[str]] = None
    shapes: Optional[List[Dict[str, Any]]] = None  # For game visualization


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
            "Concept suggestions",
            "Games and visualizations"
        ],
        "endpoints": {
            "/": "API information (this page)",
            "/health": "Health check endpoint",
            "/execute": "Execute Cubit code (POST)",
            "/api/execute/debug": "Execute code with step-by-step debugging (POST)",
            "/api/modules/status": "Get system modules status (GET)",
            "/progress": "Get learning progress (GET)",
            "/concepts": "Get concept suggestions (GET)",
            "/games": "Get list of available games (GET)",
            "/games/execute": "Execute game code with visualization (POST)"
        },
        "documentation": "/docs"
    }


@app.get("/health")
async def health():
    """Health check endpoint for monitoring"""
    return {"status": "healthy"}


@app.get("/api/modules/status")
async def get_modules_status():
    """
    Get real-time status information for all Cubit system modules
    
    Returns:
        Status information for all modules including metrics and system summary
    """
    # Define all system modules
    modules = [
        {
            "id": "lexer",
            "name": "Lexer",
            "type": "core",
            "status": "active",
            "version": "1.0.0",
            "metrics": metrics_tracker.get_metrics("lexer")
        },
        {
            "id": "parser",
            "name": "Parser",
            "type": "core",
            "status": "active",
            "version": "1.0.0",
            "metrics": metrics_tracker.get_metrics("parser")
        },
        {
            "id": "interpreter",
            "name": "Interpreter",
            "type": "core",
            "status": "active",
            "version": "1.0.0",
            "metrics": metrics_tracker.get_metrics("interpreter")
        },
        {
            "id": "ped-api",
            "name": "Pedagogical API",
            "type": "pedagogical",
            "status": "active",
            "version": "1.0.0",
            "metrics": metrics_tracker.get_metrics("ped-api")
        },
        {
            "id": "context-analyzer",
            "name": "Context Analyzer",
            "type": "pedagogical",
            "status": "active",
            "version": "1.0.0",
            "metrics": metrics_tracker.get_metrics("context-analyzer")
        },
        {
            "id": "skill-inference",
            "name": "Skill Inference Engine",
            "type": "pedagogical",
            "status": "active",
            "version": "1.0.0",
            "metrics": metrics_tracker.get_metrics("skill-inference")
        },
        {
            "id": "learning-engine",
            "name": "Adaptive Learning Engine",
            "type": "pedagogical",
            "status": "active",
            "version": "1.0.0",
            "metrics": metrics_tracker.get_metrics("learning-engine")
        },
        {
            "id": "concept-mapper",
            "name": "Concept Dependency Mapper",
            "type": "pedagogical",
            "status": "active",
            "version": "1.0.0",
            "metrics": metrics_tracker.get_metrics("concept-mapper")
        },
        {
            "id": "insight-delivery",
            "name": "Insight Delivery",
            "type": "pedagogical",
            "status": "active",
            "version": "1.0.0",
            "metrics": metrics_tracker.get_metrics("insight-delivery")
        },
        {
            "id": "games-executor",
            "name": "Games Executor",
            "type": "game",
            "status": "active",
            "version": "1.0.0",
            "metrics": metrics_tracker.get_metrics("games-executor")
        },
        {
            "id": "fastapi",
            "name": "FastAPI Server",
            "type": "api",
            "status": "active",
            "version": "1.0.0",
            "metrics": metrics_tracker.get_metrics("fastapi")
        }
    ]
    
    # Calculate system summary
    total_modules = len(modules)
    active_modules = sum(1 for m in modules if m["status"] == "active")
    error_modules = sum(1 for m in modules if m["status"] == "error")
    
    return {
        "modules": modules,
        "system": {
            "total_modules": total_modules,
            "active_modules": active_modules,
            "error_modules": error_modules,
            "uptime_seconds": int(metrics_tracker.get_uptime())
        }
    }


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
            default_verbosity=request.verbosity or 'normal'
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
        teaching_moment_data = None
        
        if request.teaching_enabled:
            # Get the last teaching moment delivered
            teaching_moment_data = {
                "type": "skill_level_insight",
                "level": ped_interpreter.get_skill_level(),
                "message": f"You're currently at {ped_interpreter.get_skill_level()} level",
                "timestamp": datetime.now().isoformat()
            }
            
            teaching_data = {
                'teaching_moment': teaching_moment_data,
                'skill_level': ped_interpreter.get_skill_level(),
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


@app.post("/api/execute/debug")
async def execute_code_debug(request: ExecuteRequest):
    """
    Execute Cubit code with step-by-step instrumentation for visualization
    
    Args:
        request: ExecuteRequest containing:
            - code: The Cubit code to execute
            - teaching_enabled: Whether to provide teaching insights (default: True)
            - verbosity: Teaching detail level - minimal/normal/detailed (default: normal)
        
    Returns:
        Execution steps showing processing through Lexer -> Parser -> Interpreter
    """
    from lexer import Lexer
    from parser import Parser
    
    steps = []
    final_result = {
        "output": None,
        "result": None,
        "error": None,
        "skill_level": "beginner",
        "progress": {},
        "suggestions": []
    }
    total_start = time.time()
    
    try:
        # Step 1: Lexer
        lexer_start = time.time()
        lexer = Lexer(request.code)
        tokens = lexer.tokenize()
        lexer_duration = (time.time() - lexer_start) * 1000
        
        # Record metrics
        metrics_tracker.record_request("lexer", lexer_duration, True)
        
        # Format tokens for display
        token_strings = [f"{t.type}({t.value})" if t.value else t.type for t in tokens]
        
        steps.append({
            "id": "lexer-001",
            "module": "lexer",
            "timestamp": datetime.now().isoformat(),
            "duration_ms": round(lexer_duration, 2),
            "input": request.code,
            "output": {
                "tokens": token_strings
            },
            "status": "completed"
        })
        
        # Step 2: Parser
        parser_start = time.time()
        parser = Parser(tokens)
        ast = parser.parse()
        parser_duration = (time.time() - parser_start) * 1000
        
        # Record metrics
        metrics_tracker.record_request("parser", parser_duration, True)
        
        # Get AST summary
        ast_summary = f"{type(ast).__name__}" if ast else "None"
        
        steps.append({
            "id": "parser-001",
            "module": "parser",
            "timestamp": datetime.now().isoformat(),
            "duration_ms": round(parser_duration, 2),
            "input": "tokens from lexer",
            "output": {
                "ast_summary": ast_summary
            },
            "status": "completed"
        })
        
        # Step 3: Interpreter
        interpreter_start = time.time()
        interpreter = Interpreter()
        
        # Wrap with pedagogical API if teaching is enabled
        if request.teaching_enabled:
            ped_interpreter = PedagogicalAPI(
                interpreter,
                default_verbosity=request.verbosity or 'normal'
            )
        
        # Capture stdout
        output_buffer = StringIO()
        with redirect_stdout(output_buffer):
            if request.teaching_enabled:
                result = ped_interpreter.call('run', request.code)
            else:
                result = interpreter.run(request.code)
        
        output = output_buffer.getvalue()
        interpreter_duration = (time.time() - interpreter_start) * 1000
        
        # Record metrics
        metrics_tracker.record_request("interpreter", interpreter_duration, True)
        
        # Get variables from interpreter
        variables = {}
        if hasattr(interpreter, 'symbol_table'):
            variables = {k: v for k, v in interpreter.symbol_table.items() if not k.startswith('_')}
        
        steps.append({
            "id": "interpreter-001",
            "module": "interpreter",
            "timestamp": datetime.now().isoformat(),
            "duration_ms": round(interpreter_duration, 2),
            "input": "AST from parser",
            "output": {
                "result": result,
                "stdout": output,
                "variables": variables
            },
            "status": "completed"
        })
        
        # Build final result
        final_result["output"] = output
        final_result["result"] = result
        final_result["error"] = None
        
        if request.teaching_enabled:
            final_result["skill_level"] = ped_interpreter.get_skill_level()
            final_result["progress"] = ped_interpreter.get_learning_progress()
            final_result["suggestions"] = ped_interpreter.suggest_next_concepts()[:5]
        
    except Exception as e:
        # Record error in the appropriate module
        error_msg = str(e)
        if "lexer" in error_msg.lower() or len(steps) == 0:
            metrics_tracker.record_request("lexer", 0, False)
            steps.append({
                "id": "lexer-error",
                "module": "lexer",
                "timestamp": datetime.now().isoformat(),
                "duration_ms": 0,
                "input": request.code,
                "output": {},
                "status": "error",
                "error": error_msg
            })
        elif "parser" in error_msg.lower() or len(steps) == 1:
            metrics_tracker.record_request("parser", 0, False)
            steps.append({
                "id": "parser-error",
                "module": "parser",
                "timestamp": datetime.now().isoformat(),
                "duration_ms": 0,
                "input": "tokens from lexer",
                "output": {},
                "status": "error",
                "error": error_msg
            })
        else:
            metrics_tracker.record_request("interpreter", 0, False)
            steps.append({
                "id": "interpreter-error",
                "module": "interpreter",
                "timestamp": datetime.now().isoformat(),
                "duration_ms": 0,
                "input": "AST from parser",
                "output": {},
                "status": "error",
                "error": error_msg
            })
        
        final_result["error"] = error_msg
    
    total_duration = (time.time() - total_start) * 1000
    
    return {
        "steps": steps,
        "final_result": final_result,
        "total_duration_ms": round(total_duration, 2)
    }


@app.get("/progress")
async def get_progress():
    """
    Get aggregated learning progress information
    
    Returns:
        Progress metrics including total calls, method diversity, skill trajectory
    """
    # NOTE: This will be session-based in future with user authentication
    # For now, return example structure
    return {
        "total_calls": 0,
        "method_diversity": [],
        "mastered_concepts": [],
        "current_skill_level": "beginner",
        "session_info": "Progress tracking is session-based. Use /execute with teaching_enabled=true to track progress.",
        "skill_trajectory": []
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


@app.get("/games")
async def get_games():
    """
    Get the list of available games from games.json
    
    Returns:
        The contents of frontend/src/course/games.json
    """
    try:
        # Try to find games.json in the frontend directory
        games_path = Path(__file__).parent / 'frontend' / 'src' / 'course' / 'games.json'
        
        if not games_path.exists():
            # Fallback: try relative to current directory
            games_path = Path('frontend/src/course/games.json')
        
        if games_path.exists():
            with open(games_path, 'r', encoding='utf-8') as f:
                games_data = json.load(f)
            return games_data
        else:
            # Return a minimal fallback response if file not found
            return {
                "games": [
                    {
                        "title": "Animated Art",
                        "description": "Create generative art with Cubit code",
                        "instructions": "Use draw_circle(), draw_square(), draw_triangle(), set_color(), animate()",
                        "starter": "set_color('blue')\ndraw_circle(50, 50, 20)",
                        "solution": "set_color('blue')\ndraw_circle(50, 50, 20)"
                    }
                ]
            }
    except Exception as e:
        return {
            "error": f"Failed to load games: {str(e)}",
            "games": []
        }


@app.post("/games/execute", response_model=ExecuteResponse)
async def execute_game_code(request: GameExecuteRequest):
    """
    Execute game code and return structured visualization data
    
    Args:
        request: GameExecuteRequest containing:
            - game: Name of the game (AnimatedArt, GraphingCalculator, etc.)
            - code: The code to execute
            - options: Optional game-specific options
            - teaching_enabled: Whether to provide teaching insights
            - verbosity: Teaching detail level
    
    Returns:
        ExecuteResponse with shapes/commands for visualization
    """
    try:
        # Parse the game code to extract draw commands
        parse_result = parse_game_code(request.code, request.game)
        
        # If there was a parsing error, return it
        if parse_result.get("error"):
            return ExecuteResponse(
                output=None,
                result=None,
                error=parse_result["error"],
                shapes=parse_result.get("shapes", [])
            )
        
        # Get teaching data if enabled
        teaching_data = {}
        if request.teaching_enabled:
            try:
                # Create interpreter and wrap with pedagogical API
                interpreter = Interpreter()
                ped_interpreter = PedagogicalAPI(
                    interpreter,
                    default_verbosity=request.verbosity or 'normal'
                )
                
                # Execute the code to get teaching insights
                output_buffer = StringIO()
                with redirect_stdout(output_buffer):
                    ped_interpreter.call('run', request.code)
                
                teaching_data = {
                    'skill_level': ped_interpreter._infer_skill_level(),
                    'progress': ped_interpreter.get_learning_progress(),
                    'suggestions': ped_interpreter.suggest_next_concepts()[:5]
                }
            except Exception:
                # If teaching analysis fails, continue without it
                pass
        
        # Return successful response with shapes
        return ExecuteResponse(
            output=parse_result.get("output"),
            result=None,
            error=None,
            shapes=parse_result.get("shapes", []),
            **teaching_data
        )
    
    except Exception as e:
        return ExecuteResponse(
            output=None,
            result=None,
            error=f"Execution failed: {str(e)}",
            shapes=[]
        )


if __name__ == "__main__":
    import uvicorn
    import os
    
    # Get port from environment variable or default to 8080
    port = int(os.environ.get("PORT", 8080))
    
    # Run the server
    uvicorn.run(app, host="0.0.0.0", port=port)
