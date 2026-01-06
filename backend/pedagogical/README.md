# Pedagogical API System

Transform any Python API into an adaptive, teaching-focused learning experience.

## Overview

The Pedagogical API System is a comprehensive framework that wraps existing Python APIs and adds intelligent teaching capabilities. It observes how users interact with code, infers their skill level, and delivers contextual teaching moments at optimal times.

## Features

### 🧠 Adaptive Learning Engine
- **Skill-Based Teaching**: Automatically adjusts explanations for beginner, intermediate, advanced, and expert users
- **Teaching Opportunities**: Identifies optimal moments to provide insights based on usage patterns
- **Learning Strategies**: Different teaching approaches for each skill level

### 📊 Skill Inference
- **Behavioral Analysis**: Infers user skill level from coding patterns
- **Pattern Detection**: Recognizes advanced techniques like comprehensions, decorators, and context managers
- **Progress Tracking**: Monitors skill progression over time

### 🗺️ Concept Dependency Mapping
- **Knowledge Graph**: Maps relationships between programming concepts
- **Learning Paths**: Generates personalized learning sequences
- **Prerequisite Checking**: Ensures foundational concepts are mastered first

### 💡 Context-Aware Insights
- **Stack Frame Analysis**: Understands the calling context
- **Intent Detection**: Infers what the user is trying to accomplish
- **Smart Delivery**: Provides insights at the right verbosity level

### ⚙️ Flexible Verbosity Levels
- **Minimal**: Brief hints for experienced users
- **Normal**: Balanced explanations (default)
- **Detailed**: Comprehensive teaching for beginners

## Architecture

The system consists of 6 core components:

```
pedagogical/
├── __init__.py              # Package initialization
├── api.py                   # Main PedagogicalAPI orchestrator
├── learning_engine.py       # Adaptive teaching strategies
├── concept_mapper.py        # Concept dependency graph
├── skill_inference.py       # User skill level detection
├── context_analyzer.py      # Calling context analysis
├── insight_delivery.py      # Teaching moment formatting
├── demo.py                  # Quick demo
└── web_app.py              # Flask web interface
```

## Quick Start

### Basic Usage

```python
from pedagogical.api import PedagogicalAPI

# Your existing API
class Calculator:
    def add(self, a, b):
        return a + b

# Wrap it with pedagogical features
calc = Calculator()
ped_calc = PedagogicalAPI(calc)

# Use it normally - teaching moments appear automatically!
result = ped_calc.call('add', 5, 3)
# Output: 8
# 💡 Teaching moment: "The add() method performs addition..."
```

### Run the Demo

```bash
# Quick demo
python pedagogical/demo.py

# Basic example
python examples/basic_example.py

# Advanced example with verbosity control
python examples/advanced_example.py

# Concept mapping visualization
python examples/concepts_example.py
```

### Web Interface

```bash
# Start the Flask web app
python pedagogical/web_app.py

# Open browser to http://localhost:5000
```

## Installation

### Install Dependencies

```bash
# Install Flask for web interface
pip install flask>=3.0.0

# Or install all Cubit requirements
pip install -r requirements.txt
```

### Integration with Cubit

The pedagogical system is designed to integrate with the Cubit programming language interpreter:

```python
# In cubit.py REPL
from pedagogical.api import PedagogicalAPI
from interpreter import Interpreter

# Wrap the interpreter
interpreter = Interpreter()
ped_interpreter = PedagogicalAPI(interpreter)

# Now all Cubit code execution includes teaching moments
ped_interpreter.call('run', cubit_code)
```

## Component Details

### PedagogicalAPI (api.py)

Main orchestrator that coordinates all components.

**Key Methods:**
- `call(method, *args, **kwargs)`: Execute API method with teaching
- `set_verbosity(level)`: Set 'minimal', 'normal', or 'detailed'
- `get_learning_progress()`: Get progress metrics
- `get_skill_trajectory()`: Get skill level over time
- `suggest_next_concepts()`: Get personalized learning suggestions

### AdaptiveLearningEngine (learning_engine.py)

Implements skill-specific teaching strategies.

**Key Methods:**
- `identify_teaching_opportunity()`: Find teachable moments
- `get_progress()`: Get learning metrics

### ConceptDependencyMapper (concept_mapper.py)

Manages the programming concepts knowledge graph.

**Key Methods:**
- `get_prerequisites(concept)`: Get required concepts
- `get_learning_path(target)`: Generate learning sequence
- `suggest_next_concepts(mastered)`: Recommend next steps
- `visualize_path(target)`: Generate ASCII visualization

### SkillInferenceEngine (skill_inference.py)

Infers user skill level from behavioral patterns.

**Key Methods:**
- `infer_level(history, profile)`: Determine skill level
- `get_skill_progression(history)`: Track skill changes
- `suggest_skill_improvement()`: Get improvement tips

### ContextAnalyzer (context_analyzer.py)

Analyzes calling context using Python's inspect module.

**Key Methods:**
- `analyze(frame)`: Extract context from stack frame
- `infer_intent(context)`: Guess user's goal
- `detect_patterns(context)`: Find code patterns

### InsightDelivery (insight_delivery.py)

Formats and delivers teaching moments.

**Key Methods:**
- `deliver(insight, result)`: Display teaching moment
- `set_verbosity(level)`: Change verbosity
- `deliver_progress_report(progress)`: Show progress
- `deliver_suggestion(suggestions)`: Show recommendations

## Usage Examples

### Example 1: Wrapping a Simple API

```python
from pedagogical.api import PedagogicalAPI

class StringProcessor:
    def reverse(self, text):
        return text[::-1]
    
    def uppercase(self, text):
        return text.upper()

# Wrap it
processor = StringProcessor()
ped_processor = PedagogicalAPI(processor)

# Use with teaching
result = ped_processor.call('reverse', 'hello')
# Shows teaching about string slicing with [::-1]
```

### Example 2: Controlling Verbosity

```python
# Start with detailed for beginners
ped_api.set_verbosity('detailed')
ped_api.call('some_method', args)  # Verbose explanation

# Switch to minimal for experts
ped_api.set_verbosity('minimal')
ped_api.call('another_method', args)  # Brief hint
```

### Example 3: Tracking Progress

```python
# Get comprehensive progress
progress = ped_api.get_learning_progress()
print(f"Total calls: {progress['total_calls']}")
print(f"Skill level: {ped_api._infer_skill_level()}")

# Get skill trajectory
trajectory = ped_api.get_skill_trajectory()
for snapshot in trajectory:
    print(f"Call {snapshot['call_number']}: {snapshot['skill_level']}")
```

### Example 4: Learning Paths

```python
from pedagogical.concept_mapper import ConceptDependencyMapper

mapper = ConceptDependencyMapper()

# Get path to advanced concept
path = mapper.get_learning_path('decorators')
for step in path:
    print(f"{step['step']}. {step['concept']}")

# Get suggestions based on what's mastered
mastered = ['variables', 'functions', 'loops']
suggestions = mapper.suggest_next_concepts(mastered)
print("Learn next:", suggestions)
```

## API Reference

### PedagogicalAPI

```python
class PedagogicalAPI:
    def __init__(self, wrapped_api, max_history=1000, default_verbosity='normal')
    def call(self, method_name: str, *args, **kwargs) -> Any
    def set_verbosity(self, level: str)  # 'minimal', 'normal', 'detailed'
    def get_learning_progress() -> Dict[str, Any]
    def get_skill_trajectory() -> List[Dict[str, Any]]
    def suggest_next_concepts(mastered=None) -> List[str]
    def reset_history()
    def export_history() -> List[Dict[str, Any]]
    def import_history(history: List[Dict[str, Any]])
```

## Skill Levels

The system recognizes four skill levels:

1. **Beginner**: New to programming concepts
   - Detailed explanations
   - Step-by-step guidance
   - Concept introductions

2. **Intermediate**: Familiar with basics
   - Balanced explanations
   - Best practice tips
   - Pattern recognition

3. **Advanced**: Strong fundamentals
   - Performance insights
   - Advanced techniques
   - Optimization tips

4. **Expert**: Deep expertise
   - Minimal hints
   - Advanced patterns
   - Architecture insights

## Concept Graph

The system includes a comprehensive programming concepts graph:

- **Fundamentals**: variables, data_types, operators, conditionals, loops
- **Functions**: functions, parameters, return_values, scope, lambda_functions
- **Data Structures**: lists, dictionaries, sets, tuples
- **Advanced**: classes, decorators, generators, context_managers
- **Patterns**: list_comprehensions, error_handling, file_io, modules

## Web Interface

The Flask web application provides:

- **Home**: Overview and features
- **Playground**: Interactive API testing
- **Concepts**: Visual concept dependency graph
- **Progress**: Learning metrics and skill trajectory

Access at `http://localhost:5000` after running `python pedagogical/web_app.py`

## Integration Points

### With Cubit Interpreter

```python
# In cubit.py
from pedagogical.api import PedagogicalAPI

class CubitREPL:
    def __init__(self):
        self.interpreter = Interpreter()
        self.ped_interpreter = PedagogicalAPI(self.interpreter)
    
    def run(self, code):
        return self.ped_interpreter.call('run', code)
```

### With FastAPI Backend

```python
# In api.py
from pedagogical.api import PedagogicalAPI
from interpreter import Interpreter

@app.post("/execute")
async def execute(code: str):
    interpreter = Interpreter()
    ped_interpreter = PedagogicalAPI(interpreter)
    result = ped_interpreter.call('run', code)
    
    return {
        'result': result,
        'skill_level': ped_interpreter._infer_skill_level(),
        'progress': ped_interpreter.get_learning_progress()
    }
```

## Testing

```bash
# Run basic example
python examples/basic_example.py

# Run advanced example
python examples/advanced_example.py

# Run concept visualization
python examples/concepts_example.py

# Run quick demo
python pedagogical/demo.py
```

## Future Enhancements

- [ ] Persistent user profiles
- [ ] Multi-user session management
- [ ] Custom concept graphs
- [ ] Export learning reports
- [ ] Integration with LMS platforms
- [ ] Gamification features
- [ ] Code quality metrics
- [ ] Collaborative learning features

## License

Part of the Cubit programming language project.

## Contributing

Contributions welcome! Areas of interest:
- Additional teaching strategies
- More programming concepts
- Better skill inference algorithms
- UI/UX improvements for web interface
- Integration examples

## Credits

Developed as part of the Cubit pedagogical programming language initiative.
