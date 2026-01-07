"""
Tests for the games API endpoints
"""

import pytest
from fastapi.testclient import TestClient
from api import app

client = TestClient(app)


def test_get_games_endpoint():
    """Test GET /games endpoint returns games catalog"""
    response = client.get("/games")
    assert response.status_code == 200
    
    data = response.json()
    assert "games" in data
    assert isinstance(data["games"], list)
    
    # Should have at least one game
    assert len(data["games"]) > 0
    
    # Check first game has required fields
    game = data["games"][0]
    assert "title" in game
    assert "description" in game
    assert "instructions" in game


def test_execute_game_code_simple():
    """Test POST /games/execute with simple draw commands"""
    response = client.post(
        "/games/execute",
        json={
            "game": "AnimatedArt",
            "code": "draw_circle(100, 100, 30)\ndraw_square(200, 200, 40)",
            "teaching_enabled": False
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Should have shapes
    assert "shapes" in data
    assert isinstance(data["shapes"], list)
    assert len(data["shapes"]) == 2
    
    # Check first shape (circle)
    circle = data["shapes"][0]
    assert circle["type"] == "circle"
    assert circle["x"] == 100
    assert circle["y"] == 100
    assert circle["size"] == 30
    
    # Check second shape (square)
    square = data["shapes"][1]
    assert square["type"] == "square"
    assert square["x"] == 200
    assert square["y"] == 200
    assert square["size"] == 40


def test_execute_game_code_with_colors():
    """Test draw commands with color specifications"""
    response = client.post(
        "/games/execute",
        json={
            "game": "AnimatedArt",
            "code": "set_color('red')\ndraw_circle(50, 50, 20, 'blue')",
            "teaching_enabled": False
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    assert "shapes" in data
    assert len(data["shapes"]) == 1
    
    # Circle should have blue color (overrides set_color)
    circle = data["shapes"][0]
    assert circle["type"] == "circle"
    assert circle["color"] in ["#3b82f6", "blue"]  # Normalized or original


def test_execute_game_code_with_teaching():
    """Test game execution with teaching enabled"""
    response = client.post(
        "/games/execute",
        json={
            "game": "AnimatedArt",
            "code": "draw_circle(100, 100, 30)",
            "teaching_enabled": True,
            "verbosity": "normal"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Should have shapes
    assert "shapes" in data
    
    # May have teaching data (depends on pedagogical API)
    # These are optional but check they're present if teaching works
    if "skill_level" in data and data["skill_level"] is not None:
        assert isinstance(data["skill_level"], str)


def test_execute_game_code_invalid_syntax():
    """Test error handling for invalid draw commands"""
    response = client.post(
        "/games/execute",
        json={
            "game": "AnimatedArt",
            "code": "draw_circle(invalid, syntax, here)",
            "teaching_enabled": False
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Should have an error
    assert "error" in data
    assert data["error"] is not None


def test_execute_game_code_empty():
    """Test empty code returns empty shapes"""
    response = client.post(
        "/games/execute",
        json={
            "game": "AnimatedArt",
            "code": "",
            "teaching_enabled": False
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Should have empty shapes list
    assert "shapes" in data
    assert len(data["shapes"]) == 0


def test_execute_game_code_with_comments():
    """Test that comments are properly ignored"""
    response = client.post(
        "/games/execute",
        json={
            "game": "AnimatedArt",
            "code": "# This is a comment\ndraw_circle(100, 100, 30)\n# Another comment",
            "teaching_enabled": False
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    
    # Should have exactly one shape
    assert "shapes" in data
    assert len(data["shapes"]) == 1


def test_health_check():
    """Test that health endpoint still works"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
