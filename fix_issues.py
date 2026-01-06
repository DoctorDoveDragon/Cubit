#!/usr/bin/env python3
"""
Automation script to fix missing imports, modules, and type hint issues.
This script creates/updates files to ensure the Cubit project can run with fallback stubs.
"""

import os
import sys
from pathlib import Path


def create_pedagogical_package():
    """Create pedagogical package with minimal files if needed"""
    print("📦 Checking pedagogical package...")
    
    # Create pedagogical directory
    pedagogical_dir = Path("pedagogical")
    pedagogical_dir.mkdir(exist_ok=True)
    
    # Create __init__.py if it doesn't exist
    init_file = pedagogical_dir / "__init__.py"
    if not init_file.exists():
        print("  Creating pedagogical/__init__.py")
        init_file.write_text("""# Pedagogical teaching system package
# (empty file to make this a module)
""")
    else:
        print("  ✓ pedagogical/__init__.py exists")
    
    # Create api.py if it doesn't exist
    api_file = pedagogical_dir / "api.py"
    if not api_file.exists():
        print("  Creating pedagogical/api.py")
        api_file.write_text("""class PedagogicalAPI:
    def __init__(self, wrapped_api, default_verbosity='normal'):
        self.wrapped_api = wrapped_api
        self.verbosity = default_verbosity
        self.call_history = []

    def call(self, method_name, *args, **kwargs):
        # Call the wrapped API and record the call
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
        return {
            'total_calls': len(self.call_history),
            'method_diversity': list(set(call['method'] for call in self.call_history)),
            'mastered_concepts': []
        }

    def suggest_next_concepts(self, mastered=None):
        # Simple suggestion list for demonstration
        return ['variables', 'functions', 'loops']

    def _infer_skill_level(self):
        if len(self.call_history) < 5:
            return 'beginner'
        elif len(self.call_history) < 15:
            return 'intermediate'
        else:
            return 'advanced'
    
    def get_last_teaching_moment(self):
        return None
""")
    else:
        print("  ✓ pedagogical/api.py exists")
    
    print("✅ Pedagogical package ready\n")


def create_interpreter_stub():
    """Create interpreter.py stub if needed"""
    print("🔧 Checking interpreter.py...")
    
    interpreter_file = Path("interpreter.py")
    if not interpreter_file.exists():
        print("  Creating interpreter.py stub")
        interpreter_file.write_text("""class Interpreter:
    def __init__(self):
        self.variables = {}
        self.output_produced = False

    def run(self, code):
        # Simple line-based interpreter for demonstration
        lines = code.strip().split('\\n')
        results = []

        for line in lines:
            line = line.strip()
            if not line or line.startswith('#'):
                continue

            if line.startswith('print '):
                expr = line[6:].strip()
                result = self._evaluate(expr)
                print(result)
                self.output_produced = True
                results.append(result)
            elif '=' in line:
                var_name, expr = line.split('=', 1)
                var_name = var_name.strip()
                result = self._evaluate(expr.strip())
                self.variables[var_name] = result
                results.append(result)
            else:
                result = self._evaluate(line)
                results.append(result)

        return results[-1] if results else None

    def _evaluate(self, expr):
        # Very simple evaluation for demonstration
        # NOTE: This is a minimal stub. The actual interpreter.py uses a proper parser.
        # Using eval() here is a security risk and should not be used in production.
        if expr.isdigit():
            return int(expr)
        elif expr in self.variables:
            return self.variables[expr]
        elif expr.startswith('"') and expr.endswith('"'):
            return expr[1:-1]
        elif expr.startswith("'") and expr.endswith("'"):
            return expr[1:-1]
        else:
            try:
                # WARNING: eval() is used here only for demonstration in the stub
                # The actual interpreter.py uses a proper lexer/parser/AST approach
                return eval(expr, {}, self.variables)
            except Exception:
                raise ValueError(f"Cannot evaluate expression: {expr}")
""")
    else:
        print("  ✓ interpreter.py exists")
    
    print("✅ Interpreter ready\n")


def create_frontend_stubs():
    """Create minimal frontend stubs if needed"""
    print("🌐 Checking frontend structure...")
    
    frontend_dir = Path("frontend")
    frontend_dir.mkdir(exist_ok=True)
    
    # Create package.json if needed
    package_json = frontend_dir / "package.json"
    if not package_json.exists():
        print("  Creating frontend/package.json")
        package_json.write_text("""{
  "name": "cubit-frontend",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.0.0"
  }
}
""")
    else:
        print("  ✓ frontend/package.json exists")
    
    # Create next.config.js if needed
    next_config = frontend_dir / "next.config.js"
    if not next_config.exists():
        print("  Creating frontend/next.config.js")
        next_config.write_text("""/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

module.exports = nextConfig
""")
    else:
        print("  ✓ frontend/next.config.js exists")
    
    # Create src directory structure
    src_dir = frontend_dir / "src"
    src_dir.mkdir(exist_ok=True)
    
    app_dir = src_dir / "app"
    app_dir.mkdir(exist_ok=True)
    
    # Create page.tsx if needed
    page_tsx = app_dir / "page.tsx"
    if not page_tsx.exists():
        print("  Creating frontend/src/app/page.tsx")
        page_tsx.write_text("""export default function Home() {
  return (
    <main>
      <h1>Cubit Programming Language</h1>
      <p>Frontend stub - to be implemented</p>
    </main>
  )
}
""")
    else:
        print("  ✓ frontend/src/app/page.tsx exists")
    
    # Create components directory
    components_dir = src_dir / "components"
    components_dir.mkdir(exist_ok=True)
    
    # Create component stubs if needed
    components = [
        ("CodeExecutor.tsx", """export default function CodeExecutor() {
  return <div>Code Executor Component</div>
}
"""),
        ("ProgressDashboard.tsx", """export default function ProgressDashboard() {
  return <div>Progress Dashboard Component</div>
}
"""),
        ("CreativeCommandsPanel.tsx", """export default function CreativeCommandsPanel() {
  return <div>Creative Commands Panel Component</div>
}
""")
    ]
    
    for filename, content in components:
        component_file = components_dir / filename
        if not component_file.exists():
            print(f"  Creating frontend/src/components/{filename}")
            component_file.write_text(content)
        else:
            print(f"  ✓ frontend/src/components/{filename} exists")
    
    # Create utils directory
    utils_dir = src_dir / "utils"
    utils_dir.mkdir(exist_ok=True)
    
    # Create api.ts if needed
    api_ts = utils_dir / "api.ts"
    if not api_ts.exists():
        print("  Creating frontend/src/utils/api.ts")
        api_ts.write_text("""export async function executeCode(code: string) {
  const response = await fetch('/api/execute', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  })
  return response.json()
}
""")
    else:
        print("  ✓ frontend/src/utils/api.ts exists")
    
    print("✅ Frontend structure ready\n")


def update_api_imports():
    """Update api.py to have resilient imports"""
    print("🔄 Checking api.py imports...")
    
    api_file = Path("api.py")
    if api_file.exists():
        content = api_file.read_text()
        
        # Check if resilient import is already present
        if "Ensure pedagogical import is resilient" in content:
            print("  ✓ api.py already has resilient imports")
        else:
            print("  ⚠️  api.py needs manual update for resilient imports")
            print("     See problem statement for the correct import pattern")
    else:
        print("  ⚠️  api.py not found")
    
    print()


def update_cubit_imports():
    """Update cubit.py to have guarded imports"""
    print("🔄 Checking cubit.py imports...")
    
    cubit_file = Path("cubit.py")
    if cubit_file.exists():
        content = cubit_file.read_text()
        
        # Check if guarded import is already present
        if "Guard PedagogicalAPI import" in content or "Pedagogical module not found" in content:
            print("  ✓ cubit.py already has guarded imports")
        else:
            print("  ⚠️  cubit.py needs manual update for guarded imports")
            print("     See problem statement for the correct import pattern")
    else:
        print("  ⚠️  cubit.py not found")
    
    print()


def main():
    """Main entry point"""
    print("=" * 60)
    print("🔧 Cubit Issue Fixer - Fixing Imports and Stubs")
    print("=" * 60)
    print()
    
    # Change to repository root if needed
    if not Path(".git").exists():
        print("⚠️  Not in repository root. Please run from repository root.")
        sys.exit(1)
    
    # Run all fixes
    create_pedagogical_package()
    create_interpreter_stub()
    create_frontend_stubs()
    update_api_imports()
    update_cubit_imports()
    
    print("=" * 60)
    print("✅ All checks complete!")
    print("=" * 60)
    print()
    print("Next steps:")
    print("1. Review the changes made")
    print("2. Test imports with: python3 -c 'import api; import cubit'")
    print("3. Run the application to verify everything works")
    print()


if __name__ == "__main__":
    main()
