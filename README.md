# Cubit Programming Language

Cubit is a simple, educational programming language with a clean syntax designed for learning programming concepts.

## Features

- **Simple Syntax**: Easy to read and write
- **Variables**: Dynamic typing with the `let` keyword
- **Arithmetic**: Basic math operations (+, -, *, /)
- **Comparison**: Comparison operators (==, !=, <, >, <=, >=)
- **Control Flow**: If-else statements and while loops
- **Print Statements**: Output values to the console
- **Comments**: Line comments with `#`
- **Interactive REPL**: Test code interactively
- **File Execution**: Run `.cubit` source files

## Installation

No installation required! Just Python 3.6+ needed.

```bash
# Make the script executable (Unix/Linux/Mac)
chmod +x cubit.py

# Run the REPL
python3 cubit.py

# Or run a file
python3 cubit.py examples/basic.cubit
```

## Language Syntax

### Variables

```cubit
let x = 10
let name = "Cubit"
y = 20  # 'let' is optional for assignment
```

### Arithmetic

```cubit
let sum = 10 + 5
let difference = 20 - 8
let product = 4 * 7
let quotient = 100 / 4
let complex = (10 + 5) * 2
```

### Print Statements

```cubit
print "Hello, World!"
print 42
print x + y
```

### Conditionals

```cubit
if x > 10 {
    print "x is large"
} else {
    print "x is small"
}

# Parentheses around condition are optional
if (score >= 90) {
    print "Grade: A"
}
```

### Loops

```cubit
let i = 0
while i < 5 {
    print i
    i = i + 1
}
```

### Comments

```cubit
# This is a comment
let x = 10  # Comments can be at end of line
```

## Examples

### Hello World

```cubit
print "Hello, World!"
```

### Calculate Fibonacci Sequence

```cubit
let a = 0
let b = 1
let i = 0

while i < 10 {
    print a
    let temp = a + b
    a = b
    b = temp
    i = i + 1
}
```

### Countdown

```cubit
let count = 10
while count > 0 {
    print count
    count = count - 1
}
print "Liftoff!"
```

## REPL Usage

The REPL (Read-Eval-Print Loop) provides an interactive environment:

```bash
$ python3 cubit.py
Cubit Programming Language v1.0
Type 'exit' or 'quit' to exit, 'help' for help

cubit> let x = 5
=> 5
cubit> let y = 10
=> 10
cubit> print x + y
15
cubit> help
[shows help text]
cubit> vars
Variables: {'x': 5, 'y': 10}
cubit> exit
Goodbye!
```

### REPL Commands

- `help` - Display help information
- `vars` - Show all defined variables
- `exit` or `quit` - Exit the REPL

## Running Examples

The `examples/` directory contains sample programs:

```bash
# Basic arithmetic and variables
python3 cubit.py examples/basic.cubit

# Fibonacci sequence
python3 cubit.py examples/fibonacci.cubit

# Conditional logic
python3 cubit.py examples/conditionals.cubit

# Countdown
python3 cubit.py examples/countdown.cubit
```

## Architecture

Cubit is implemented in Python with three main components:

1. **Lexer** (`lexer.py`) - Tokenizes source code into tokens
2. **Parser** (`parser.py`) - Builds an Abstract Syntax Tree (AST) from tokens
3. **Interpreter** (`interpreter.py`) - Evaluates the AST and executes the code

## Future Enhancements

Possible future additions:
- Functions and function calls
- Arrays and data structures
- More operators and built-in functions
- File I/O operations
- Error messages with better context

## License

MIT License - Feel free to use and modify!
