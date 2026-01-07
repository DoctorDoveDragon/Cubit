#!/usr/bin/env python3
"""
Games Executor Module for Cubit
Parses simple draw commands and returns structured shape data for frontend rendering
"""

import re
from typing import List, Dict, Any, Optional


class GamesExecutor:
    """
    Lightweight parser for simple draw commands used in games and visualizations.
    Converts commands like draw_circle(x, y, r) into structured JSON output.
    """
    
    def __init__(self):
        self.shapes: List[Dict[str, Any]] = []
        self.current_color = "purple"
        self.errors: List[str] = []
    
    def parse(self, code: str) -> Dict[str, Any]:
        """
        Parse draw commands from code and return structured output.
        
        Args:
            code: String containing draw commands
            
        Returns:
            Dictionary with:
                - shapes: List of shape objects
                - error: Error message if parsing failed
                - output: Text output from commands
        """
        self.shapes = []
        self.errors = []
        self.current_color = "purple"
        
        lines = code.split('\n')
        
        for line_num, line in enumerate(lines, 1):
            line = line.strip()
            
            # Skip empty lines and comments
            if not line or line.startswith('#'):
                continue
            
            try:
                self._parse_line(line, line_num)
            except Exception as e:
                self.errors.append(f"Line {line_num}: {str(e)}")
        
        result = {
            "shapes": self.shapes,
            "output": None,
            "error": None if not self.errors else "\n".join(self.errors)
        }
        
        return result
    
    def _parse_line(self, line: str, line_num: int):
        """Parse a single line of code"""
        
        # Match draw_circle(x, y, radius) or draw_circle(x, y, radius, color)
        circle_match = re.match(r'draw_circle\s*\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^,\)]+)(?:\s*,\s*["\']?([^"\')\s]+)["\']?)?\s*\)', line, re.IGNORECASE)
        if circle_match:
            x = self._parse_number(circle_match.group(1), "x coordinate")
            y = self._parse_number(circle_match.group(2), "y coordinate")
            size = self._parse_number(circle_match.group(3), "radius")
            color = circle_match.group(4) if circle_match.group(4) else self.current_color
            
            self.shapes.append({
                "type": "circle",
                "x": x,
                "y": y,
                "size": size,
                "color": self._normalize_color(color)
            })
            return
        
        # Match draw_square(x, y, size) or draw_square(x, y, size, color)
        square_match = re.match(r'draw_square\s*\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^,\)]+)(?:\s*,\s*["\']?([^"\')\s]+)["\']?)?\s*\)', line, re.IGNORECASE)
        if square_match:
            x = self._parse_number(square_match.group(1), "x coordinate")
            y = self._parse_number(square_match.group(2), "y coordinate")
            size = self._parse_number(square_match.group(3), "size")
            color = square_match.group(4) if square_match.group(4) else self.current_color
            
            self.shapes.append({
                "type": "square",
                "x": x,
                "y": y,
                "size": size,
                "color": self._normalize_color(color)
            })
            return
        
        # Match draw_triangle(x, y, size) or draw_triangle(x, y, size, color)
        triangle_match = re.match(r'draw_triangle\s*\(\s*([^,\)]+)\s*,\s*([^,\)]+)\s*,\s*([^,\)]+)(?:\s*,\s*["\']?([^"\')\s]+)["\']?)?\s*\)', line, re.IGNORECASE)
        if triangle_match:
            x = self._parse_number(triangle_match.group(1), "x coordinate")
            y = self._parse_number(triangle_match.group(2), "y coordinate")
            size = self._parse_number(triangle_match.group(3), "size")
            color = triangle_match.group(4) if triangle_match.group(4) else self.current_color
            
            self.shapes.append({
                "type": "triangle",
                "x": x,
                "y": y,
                "size": size,
                "color": self._normalize_color(color)
            })
            return
        
        # Match set_color("color") or set_color('color')
        color_match = re.match(r'set_color\s*\(\s*["\']([^"\']+)["\']\s*\)', line, re.IGNORECASE)
        if color_match:
            self.current_color = color_match.group(1)
            return
        
        # Match clear()
        if re.match(r'clear\s*\(\s*\)', line, re.IGNORECASE):
            self.shapes = []
            return
        
        # Match animate() - just acknowledge it, actual animation happens on frontend
        if re.match(r'animate\s*\(\s*\)', line, re.IGNORECASE):
            # Animation directive - frontend will handle this
            return
        
        # If we get here, it's an unrecognized command
        # Don't error out - just skip it silently for compatibility with Cubit code
        pass
    
    def _parse_number(self, value: str, field_name: str) -> float:
        """Parse a number from string, handling basic expressions"""
        value = value.strip()
        
        try:
            # Try direct conversion first
            return float(value)
        except ValueError:
            # Try evaluating simple expressions like "100 + 50"
            # Use a restricted eval for safety
            try:
                # Only allow numbers, operators, and parentheses
                if re.match(r'^[\d\s\+\-\*/\(\)\.]+$', value):
                    return float(eval(value))
                else:
                    raise ValueError(f"Invalid {field_name}: {value}")
            except:
                raise ValueError(f"Invalid {field_name}: {value}")
    
    def _normalize_color(self, color: str) -> str:
        """Normalize color names to CSS-compatible format"""
        # Map common color names to hex codes
        color_map = {
            'red': '#ef4444',
            'blue': '#3b82f6',
            'green': '#10b981',
            'yellow': '#f59e0b',
            'purple': '#7c3aed',
            'pink': '#ec4899',
            'orange': '#f97316',
            'cyan': '#14b8a6',
            'white': '#ffffff',
            'black': '#000000',
            'gray': '#6b7280',
            'grey': '#6b7280'
        }
        
        color_lower = color.lower().strip()
        
        # Return mapped color or original if it looks like a hex code
        if color_lower in color_map:
            return color_map[color_lower]
        elif color.startswith('#'):
            return color
        else:
            # Return as-is, frontend will handle it
            return color


def parse_game_code(code: str, game: str = "AnimatedArt") -> Dict[str, Any]:
    """
    Parse game code and return structured output.
    
    Args:
        code: The code to parse
        game: The game type (AnimatedArt, GraphingCalculator, etc.)
        
    Returns:
        Dictionary with shapes, output, and error fields
    """
    executor = GamesExecutor()
    return executor.parse(code)
