#!/usr/bin/env python3
"""
Cubit Language REPL (Read-Eval-Print Loop)
Interactive shell for the Cubit programming language
"""

import sys
from interpreter import Interpreter

# Guard PedagogicalAPI import with fallback stub
try:
    from pedagogical.api import PedagogicalAPI
except (ImportError, ModuleNotFoundError):
    print("⚠️ Pedagogical module not found. Running in basic mode.")

    class PedagogicalAPI:
        def __init__(self, wrapped_api, **kwargs):
            self.wrapped_api = wrapped_api
            self.call_history = []
            self.verbosity = kwargs.get('default_verbosity', 'normal')

        def call(self, method, *args, **kwargs):
            return getattr(self.wrapped_api, method)(*args, **kwargs)

        def set_verbosity(self, level):
            self.verbosity = level

        def get_learning_progress(self):
            return {}

        def suggest_next_concepts(self):
            return []

        def _infer_skill_level(self):
            return "beginner"


def run_repl():
    """Run the interactive REPL"""
    interpreter = Interpreter()
    
    # Wrap interpreter with pedagogical features
    ped_interpreter = PedagogicalAPI(interpreter, default_verbosity='normal')
    teaching_enabled = True
    
    print("╔═══════════════════════════════════════════════════════════╗")
    print("║    Cubit Programming Language v1.0 - Teaching Mode       ║")
    print("╚═══════════════════════════════════════════════════════════╝")
    print()
    print("🎓 Teaching mode is ENABLED - You'll receive learning insights!")
    print("Type 'exit' or 'quit' to exit, 'help' for help")
    print("Type 'teaching off' to disable teaching mode")
    print("Type 'teaching on' to enable teaching mode")
    print("Type 'verbosity [minimal|normal|detailed]' to change teaching detail")
    print("Type 'progress' to see your learning progress")
    print()
    
    while True:
        try:
            # Read input
            line = input("cubit> ")
            
            # Check for special commands
            if line.strip() in ('exit', 'quit'):
                print("\n📊 Final Learning Summary:")
                if teaching_enabled:
                    progress = ped_interpreter.get_learning_progress()
                    print(f"  Total commands: {progress.get('total_calls', 0)}")
                    print(f"  Skill level: {ped_interpreter._infer_skill_level()}")
                print("\n👋 Goodbye! Keep learning!")
                break
            
            if line.strip() == 'help':
                print_help()
                continue
            
            if line.strip() == 'vars':
                print("Variables:", interpreter.variables)
                continue
            
            if line.strip() == 'teaching off':
                teaching_enabled = False
                print("🔕 Teaching mode disabled - running in silent mode")
                continue
            
            if line.strip() == 'teaching on':
                teaching_enabled = True
                print("🎓 Teaching mode enabled - you'll receive learning insights!")
                continue
            
            if line.strip().startswith('verbosity '):
                level = line.strip().split()[1]
                if level in ['minimal', 'normal', 'detailed']:
                    ped_interpreter.set_verbosity(level)
                    print(f"📝 Verbosity set to: {level}")
                else:
                    print("❌ Invalid verbosity. Use: minimal, normal, or detailed")
                continue
            
            if line.strip() == 'progress':
                progress = ped_interpreter.get_learning_progress()
                skill = ped_interpreter._infer_skill_level()
                print("\n📊 Your Learning Progress:")
                print(f"  Total commands: {progress.get('total_calls', 0)}")
                print(f"  Current skill level: {skill}")
                print(f"  Methods used: {len(progress.get('method_diversity', []))}")
                
                suggestions = ped_interpreter.suggest_next_concepts()
                if suggestions:
                    print(f"\n🎯 Suggested next concepts:")
                    for i, concept in enumerate(suggestions[:5], 1):
                        print(f"    {i}. {concept}")
                print()
                continue
            
            if not line.strip():
                continue
            
            # Evaluate with or without teaching
            if teaching_enabled:
                result = ped_interpreter.call('run', line)
            else:
                result = interpreter.run(line)
            
            # Print result if it's not None and no output was produced
            if result is not None and not interpreter.output_produced:
                print(f"=> {result}")
        
        except KeyboardInterrupt:
            print("\n⚠️  KeyboardInterrupt")
            print("Use 'exit' or 'quit' to exit")
        except EOFError:
            print("\nGoodbye!")
            break
        except Exception as e:
            print(f"Error: {e}")


def run_file(filename: str):
    """Run a Cubit source file"""
    try:
        with open(filename, 'r') as f:
            source = f.read()
        
        interpreter = Interpreter()
        interpreter.run(source)
    
    except FileNotFoundError:
        print(f"Error: File '{filename}' not found")
        sys.exit(1)
    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)


def print_help():
    """Print help information"""
    help_text = """
╔═══════════════════════════════════════════════════════════╗
║          Cubit Programming Language - Help                ║
╚═══════════════════════════════════════════════════════════╝

🎓 TEACHING MODE COMMANDS:
  teaching off     - Disable teaching mode
  teaching on      - Enable teaching mode
  verbosity minimal   - Brief hints only
  verbosity normal    - Balanced explanations (default)
  verbosity detailed  - Comprehensive teaching
  progress         - Show your learning progress

📝 BASIC SYNTAX:
  Variables:    let x = 10  or  x = 10
  Arithmetic:   +, -, *, /
  Comparison:   ==, !=, <, >, <=, >=
  Print:        print expression
  Comments:     # This is a comment
  
🔄 CONTROL FLOW:
  If statement: if condition { ... } else { ... }
  While loop:   while condition { ... }

📚 BUILT-IN FUNCTIONS:
  Math:    sqrt, pow, abs, min, max, floor, ceil, round
           sin, cos, tan
  String:  len, upper, lower, split, join, strip, replace
  List:    append, pop, insert, remove, reverse, sort
  Random:  random, randint, choice, shuffle
  Type:    int, float, str
  Input:   input

💡 EXAMPLES:
  let x = 5
  let y = x * 2
  print x + y
  
  if x > 3 {
    print "x is greater than 3"
  }
  
  let i = 0
  while i < 5 {
    print i
    i = i + 1
  }
  
  let numbers = [1, 2, 3, 4, 5]
  append(numbers, 6)
  print numbers

🎮 REPL COMMANDS:
  help  - Show this help
  vars  - Show all variables
  exit  - Exit the REPL
  quit  - Exit the REPL
"""
    print(help_text)


def main():
    """Main entry point"""
    if len(sys.argv) > 1:
        # Run file
        run_file(sys.argv[1])
    else:
        # Run REPL
        run_repl()


if __name__ == '__main__':
    main()
