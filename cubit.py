#!/usr/bin/env python3
"""
Cubit Language REPL (Read-Eval-Print Loop)
Interactive shell for the Cubit programming language
"""

import sys
from interpreter import Interpreter


def run_repl():
    """Run the interactive REPL"""
    interpreter = Interpreter()
    
    print("Cubit Programming Language v1.0")
    print("Type 'exit' or 'quit' to exit, 'help' for help")
    print()
    
    while True:
        try:
            # Read input
            line = input("cubit> ")
            
            # Check for special commands
            if line.strip() in ('exit', 'quit'):
                print("Goodbye!")
                break
            
            if line.strip() == 'help':
                print_help()
                continue
            
            if line.strip() == 'vars':
                print("Variables:", interpreter.variables)
                continue
            
            if not line.strip():
                continue
            
            # Evaluate
            result = interpreter.run(line)
            
            # Print result if it's not None and no output was produced
            if result is not None and not interpreter.output_produced:
                print(f"=> {result}")
        
        except KeyboardInterrupt:
            print("\nKeyboardInterrupt")
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
Cubit Programming Language - Help
=================================

Basic Syntax:
  - Variables: let x = 10 or x = 10
  - Arithmetic: +, -, *, /
  - Comparison: ==, !=, <, >, <=, >=
  - Print: print expression
  - Comments: # This is a comment
  
Control Flow:
  - If statement: if condition { ... } else { ... }
  - While loop: while condition { ... }

Examples:
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

REPL Commands:
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
