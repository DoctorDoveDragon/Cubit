"""
Flask Web Application for Pedagogical API
Provides a web interface for interacting with the pedagogical system
"""

from flask import Flask, render_template_string, request, jsonify
from pedagogical.api import PedagogicalAPI
from typing import Any, Dict
import json


app = Flask(__name__)

# Store active pedagogical API instances (in production, use a proper session store)
api_instances: Dict[str, PedagogicalAPI] = {}


# HTML Templates
INDEX_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pedagogical API - Interactive Learning</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        nav {
            background: #f8f9fa;
            padding: 20px 40px;
            border-bottom: 1px solid #dee2e6;
        }
        nav a {
            display: inline-block;
            padding: 10px 20px;
            margin: 0 10px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 8px;
            transition: transform 0.2s;
        }
        nav a:hover {
            transform: translateY(-2px);
            background: #764ba2;
        }
        .content {
            padding: 40px;
        }
        .feature-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 30px;
            margin-top: 30px;
        }
        .feature-card {
            background: #f8f9fa;
            padding: 30px;
            border-radius: 15px;
            border: 2px solid #e9ecef;
            transition: all 0.3s;
        }
        .feature-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            border-color: #667eea;
        }
        .feature-card h3 {
            color: #667eea;
            margin-bottom: 15px;
            font-size: 1.5em;
        }
        .feature-card p {
            color: #6c757d;
            line-height: 1.6;
        }
        .icon {
            font-size: 3em;
            margin-bottom: 15px;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <h1>🎓 Pedagogical API</h1>
            <p>Transform any API into an interactive learning experience</p>
        </header>
        
        <nav>
            <a href="/">Home</a>
            <a href="/playground">Playground</a>
            <a href="/concepts">Concept Map</a>
            <a href="/progress">Progress</a>
        </nav>
        
        <div class="content">
            <h2>Welcome to the Pedagogical API</h2>
            <p>A system that wraps any Python API and adds adaptive teaching capabilities.</p>
            
            <div class="feature-grid">
                <div class="feature-card">
                    <div class="icon">🧠</div>
                    <h3>Adaptive Learning</h3>
                    <p>Automatically adjusts teaching style based on your skill level and learning patterns.</p>
                </div>
                
                <div class="feature-card">
                    <div class="icon">📊</div>
                    <h3>Progress Tracking</h3>
                    <p>Monitor your learning journey with detailed metrics and skill progression.</p>
                </div>
                
                <div class="feature-card">
                    <div class="icon">🗺️</div>
                    <h3>Concept Mapping</h3>
                    <p>Visualize concept dependencies and get personalized learning paths.</p>
                </div>
                
                <div class="feature-card">
                    <div class="icon">💡</div>
                    <h3>Smart Insights</h3>
                    <p>Receive contextual teaching moments at just the right time.</p>
                </div>
                
                <div class="feature-card">
                    <div class="icon">🎯</div>
                    <h3>Skill Inference</h3>
                    <p>System automatically detects your skill level from usage patterns.</p>
                </div>
                
                <div class="feature-card">
                    <div class="icon">⚙️</div>
                    <h3>Flexible Verbosity</h3>
                    <p>Choose from minimal, normal, or detailed teaching modes.</p>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
"""

PLAYGROUND_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>API Playground</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px 40px;
            border-radius: 20px 20px 0 0;
        }
        .content {
            padding: 40px;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 8px;
            font-weight: 600;
            color: #495057;
        }
        input, select, textarea {
            width: 100%;
            padding: 12px;
            border: 2px solid #e9ecef;
            border-radius: 8px;
            font-size: 1em;
            transition: border-color 0.3s;
        }
        input:focus, select:focus, textarea:focus {
            outline: none;
            border-color: #667eea;
        }
        button {
            background: #667eea;
            color: white;
            padding: 12px 30px;
            border: none;
            border-radius: 8px;
            font-size: 1em;
            cursor: pointer;
            transition: all 0.3s;
        }
        button:hover {
            background: #764ba2;
            transform: translateY(-2px);
        }
        .output {
            margin-top: 30px;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border-left: 4px solid #667eea;
        }
        .output pre {
            white-space: pre-wrap;
            word-wrap: break-word;
        }
        .back-link {
            display: inline-block;
            margin-bottom: 20px;
            color: white;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <header>
            <a href="/" class="back-link">← Back to Home</a>
            <h1>🎮 API Playground</h1>
            <p>Try the Pedagogical API interactively</p>
        </header>
        
        <div class="content">
            <form id="apiForm">
                <div class="form-group">
                    <label for="method">Method Name:</label>
                    <input type="text" id="method" name="method" placeholder="e.g., add, filter_data" required>
                </div>
                
                <div class="form-group">
                    <label for="args">Arguments (JSON array):</label>
                    <textarea id="args" name="args" rows="3" placeholder='[5, 3] or ["hello", "world"]'></textarea>
                </div>
                
                <div class="form-group">
                    <label for="verbosity">Verbosity Level:</label>
                    <select id="verbosity" name="verbosity">
                        <option value="minimal">Minimal</option>
                        <option value="normal" selected>Normal</option>
                        <option value="detailed">Detailed</option>
                    </select>
                </div>
                
                <button type="submit">Execute Method</button>
            </form>
            
            <div id="output" class="output" style="display: none;">
                <h3>Output:</h3>
                <pre id="outputContent"></pre>
            </div>
        </div>
    </div>
    
    <script>
        document.getElementById('apiForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const method = document.getElementById('method').value;
            const argsText = document.getElementById('args').value;
            const verbosity = document.getElementById('verbosity').value;
            
            let args = [];
            if (argsText.trim()) {
                try {
                    args = JSON.parse(argsText);
                } catch (err) {
                    alert('Invalid JSON for arguments');
                    return;
                }
            }
            
            try {
                const response = await fetch('/api/call', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ method, args, verbosity })
                });
                
                const data = await response.json();
                
                document.getElementById('output').style.display = 'block';
                document.getElementById('outputContent').textContent = 
                    JSON.stringify(data, null, 2);
            } catch (err) {
                alert('Error: ' + err.message);
            }
        });
    </script>
</body>
</html>
"""


@app.route('/')
def index():
    """Main landing page"""
    return render_template_string(INDEX_TEMPLATE)


@app.route('/playground')
def playground():
    """Interactive playground"""
    return render_template_string(PLAYGROUND_TEMPLATE)


@app.route('/concepts')
def concepts():
    """Concept dependency visualization"""
    from pedagogical.concept_mapper import ConceptDependencyMapper
    mapper = ConceptDependencyMapper()
    
    # Generate concept graph data
    concepts = ['variables', 'functions', 'classes', 'decorators', 
                'list_comprehensions', 'generators']
    
    graph_data = []
    for concept in concepts:
        prereqs = mapper.get_prerequisites(concept)
        graph_data.append({
            'concept': concept,
            'prerequisites': prereqs
        })
    
    return jsonify(graph_data)


@app.route('/progress')
def progress():
    """Show learning progress"""
    # In a real app, get session-specific API instance
    # For demo, return sample progress
    return jsonify({
        'total_calls': 0,
        'skill_level': 'beginner',
        'concepts_mastered': [],
        'message': 'Make some API calls to see progress!'
    })


@app.route('/api/call', methods=['POST'])
def api_call():
    """Execute an API call through the pedagogical system"""
    data = request.json
    method = data.get('method')
    args = data.get('args', [])
    verbosity = data.get('verbosity', 'normal')
    
    # For demo purposes, use a simple calculator
    class Calculator:
        def add(self, a, b): return a + b
        def subtract(self, a, b): return a - b
        def multiply(self, a, b): return a * b
        def divide(self, a, b): return a / b if b != 0 else 'Error: Division by zero'
    
    # Create or get pedagogical API
    session_id = 'demo'  # In production, use proper sessions
    if session_id not in api_instances:
        calc = Calculator()
        api_instances[session_id] = PedagogicalAPI(calc)
    
    ped_api = api_instances[session_id]
    ped_api.set_verbosity(verbosity)
    
    try:
        result = ped_api.call(method, *args)
        progress = ped_api.get_learning_progress()
        
        return jsonify({
            'success': True,
            'result': result,
            'skill_level': ped_api._infer_skill_level(),
            'total_calls': progress.get('total_calls', 0)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400


@app.route('/api/progress', methods=['GET'])
def api_progress():
    """Get current learning progress"""
    session_id = 'demo'
    
    if session_id in api_instances:
        ped_api = api_instances[session_id]
        progress = ped_api.get_learning_progress()
        trajectory = ped_api.get_skill_trajectory()
        
        return jsonify({
            'progress': progress,
            'trajectory': trajectory,
            'skill_level': ped_api._infer_skill_level()
        })
    else:
        return jsonify({
            'message': 'No activity yet'
        })


@app.route('/api/concepts/graph', methods=['GET'])
def concept_graph():
    """Get concept dependency graph"""
    from pedagogical.concept_mapper import ConceptDependencyMapper
    mapper = ConceptDependencyMapper()
    
    target = request.args.get('target', 'classes')
    path = mapper.get_learning_path(target)
    
    return jsonify({
        'target': target,
        'path': path,
        'visualization': mapper.visualize_path(target)
    })


if __name__ == '__main__':
    print("=" * 70)
    print("🎓 Pedagogical API Web Application")
    print("=" * 70)
    print()
    print("Starting Flask server...")
    print("Open your browser to: http://localhost:5000")
    print()
    print("Available endpoints:")
    print("  - /          : Home page")
    print("  - /playground: Interactive API testing")
    print("  - /concepts  : Concept dependency graph")
    print("  - /progress  : Learning progress")
    print()
    
    app.run(debug=True, port=5000)
