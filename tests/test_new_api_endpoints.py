"""
Tests for new API endpoints: /api/modules/status and /api/execute/debug
"""

import pytest
from fastapi.testclient import TestClient
from api import app

client = TestClient(app)


def test_modules_status_endpoint():
    """Test GET /api/modules/status endpoint"""
    response = client.get("/api/modules/status")
    assert response.status_code == 200
    
    data = response.json()
    
    # Check top-level structure
    assert "modules" in data
    assert "system" in data
    
    # Check modules list
    assert isinstance(data["modules"], list)
    assert len(data["modules"]) == 11  # Should have 11 modules
    
    # Check first module structure
    module = data["modules"][0]
    assert "id" in module
    assert "name" in module
    assert "type" in module
    assert "status" in module
    assert "version" in module
    assert "metrics" in module
    
    # Check metrics structure
    metrics = module["metrics"]
    assert "total_requests" in metrics
    assert "avg_response_time_ms" in metrics
    assert "error_rate" in metrics
    assert "last_request_time" in metrics
    
    # Check system summary
    system = data["system"]
    assert "total_modules" in system
    assert "active_modules" in system
    assert "error_modules" in system
    assert "uptime_seconds" in system
    
    assert system["total_modules"] == 11
    assert system["active_modules"] >= 0
    assert system["error_modules"] >= 0


def test_modules_status_module_types():
    """Test that modules have correct types"""
    response = client.get("/api/modules/status")
    data = response.json()
    
    modules = data["modules"]
    module_types = [m["type"] for m in modules]
    
    # Should have core, pedagogical, game, and api types
    assert "core" in module_types
    assert "pedagogical" in module_types
    assert "game" in module_types
    assert "api" in module_types


def test_execute_debug_simple_code():
    """Test POST /api/execute/debug with simple code"""
    response = client.post(
        "/api/execute/debug",
        json={
            "code": "let x = 5\nprint x",
            "teaching_enabled": False,
            "verbosity": "normal"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Check top-level structure
    assert "steps" in data
    assert "final_result" in data
    assert "total_duration_ms" in data
    
    # Check steps
    steps = data["steps"]
    assert isinstance(steps, list)
    assert len(steps) >= 3  # Should have lexer, parser, interpreter steps
    
    # Check lexer step
    lexer_step = steps[0]
    assert lexer_step["module"] == "lexer"
    assert lexer_step["status"] == "completed"
    assert "tokens" in lexer_step["output"]
    
    # Check parser step
    parser_step = steps[1]
    assert parser_step["module"] == "parser"
    assert parser_step["status"] == "completed"
    assert "ast_summary" in parser_step["output"]
    
    # Check interpreter step
    interpreter_step = steps[2]
    assert interpreter_step["module"] == "interpreter"
    assert interpreter_step["status"] == "completed"
    assert "result" in interpreter_step["output"]
    assert "stdout" in interpreter_step["output"]
    
    # Check final result
    final_result = data["final_result"]
    assert "output" in final_result
    assert "result" in final_result
    assert "error" in final_result
    assert final_result["error"] is None


def test_execute_debug_with_teaching():
    """Test /api/execute/debug with teaching enabled"""
    response = client.post(
        "/api/execute/debug",
        json={
            "code": "let x = 10",
            "teaching_enabled": True,
            "verbosity": "normal"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Should have steps
    assert "steps" in data
    assert len(data["steps"]) >= 3
    
    # Final result should include teaching data
    final_result = data["final_result"]
    assert "skill_level" in final_result
    assert "progress" in final_result
    assert "suggestions" in final_result


def test_execute_debug_with_error():
    """Test /api/execute/debug with invalid code"""
    response = client.post(
        "/api/execute/debug",
        json={
            "code": "invalid syntax here",
            "teaching_enabled": False,
            "verbosity": "normal"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Should still return steps (at least up to where it failed)
    assert "steps" in data
    assert "final_result" in data
    
    # Final result should have error
    final_result = data["final_result"]
    assert final_result["error"] is not None


def test_progress_endpoint_structure():
    """Test GET /progress returns structured data"""
    response = client.get("/progress")
    assert response.status_code == 200
    
    data = response.json()
    
    # Check all required fields
    assert "total_calls" in data
    assert "method_diversity" in data
    assert "mastered_concepts" in data
    assert "current_skill_level" in data
    assert "session_info" in data
    assert "skill_trajectory" in data
    
    # Check types
    assert isinstance(data["total_calls"], int)
    assert isinstance(data["method_diversity"], list)
    assert isinstance(data["mastered_concepts"], list)
    assert isinstance(data["current_skill_level"], str)
    assert isinstance(data["skill_trajectory"], list)


def test_execute_teaching_moment():
    """Test that /execute now includes teaching_moment field"""
    response = client.post(
        "/execute",
        json={
            "code": "print \"hello\"",
            "teaching_enabled": True,
            "verbosity": "normal"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Should have teaching_moment when teaching is enabled
    assert "teaching_moment" in data
    
    if data["teaching_moment"] is not None:
        teaching_moment = data["teaching_moment"]
        assert "type" in teaching_moment
        assert "level" in teaching_moment
        assert "message" in teaching_moment
        assert "timestamp" in teaching_moment


def test_step_timestamps_and_durations():
    """Test that debug steps have proper timestamps and durations"""
    response = client.post(
        "/api/execute/debug",
        json={
            "code": "let x = 1",
            "teaching_enabled": False
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    for step in data["steps"]:
        assert "id" in step
        assert "timestamp" in step
        assert "duration_ms" in step
        assert isinstance(step["duration_ms"], (int, float))
        assert step["duration_ms"] >= 0


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
