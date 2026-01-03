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
- **Lists/Arrays**: Create and manipulate lists with indexing
- **Function Calls**: Call built-in functions
- **Advanced Modules**: Math, String, List, and Random modules

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

### Lists/Arrays

```cubit
# Create a list
let numbers = [1, 2, 3, 4, 5]
let mixed = [1, "hello", 3.14]

# Access elements by index
print numbers[0]  # First element: 1
print numbers[2]  # Third element: 3
print numbers[-1]  # Last element: 5

# Nested lists
let matrix = [[1, 2], [3, 4]]
print matrix[0][1]  # Element at row 0, column 1: 2
```

### Built-in Functions

Cubit includes several built-in modules with useful functions:

#### Math Module

```cubit
# Mathematical functions
print sqrt(16)        # Square root: 4.0
print pow(2, 8)       # Power: 256
print abs(-42)        # Absolute value: 42
print min(5, 2, 8, 1) # Minimum: 1
print max(5, 2, 8, 1) # Maximum: 8
print floor(3.7)      # Floor: 3
print ceil(3.2)       # Ceiling: 4
print round(3.5)      # Round: 4

# Trigonometric functions
print sin(0)          # Sine
print cos(0)          # Cosine
print tan(0)          # Tangent
```

#### String Module

```cubit
let text = "Hello, World!"

# String operations
print len(text)                    # Length: 13
print upper(text)                  # Uppercase
print lower(text)                  # Lowercase
print strip("  hello  ")           # Remove whitespace

# String manipulation
print split("a,b,c", ",")          # Split into list: ['a', 'b', 'c']
print join("-", ["a", "b", "c"])   # Join list: "a-b-c"
print replace(text, "World", "Cubit")  # Replace

# String tests
print startswith(text, "Hello")    # True
print endswith(text, "!")          # True
```

#### List Module

```cubit
let nums = [3, 1, 4, 1, 5]

# List operations
print len(nums)           # Length: 5
append(nums, 9)           # Add element
let val = pop(nums)       # Remove and return last element
insert(nums, 0, 2)        # Insert at index
remove(nums, 1)           # Remove first occurrence
sort(nums)                # Sort in-place
reverse(nums)             # Reverse in-place
```

#### Random Module

```cubit
# Random number generation
print random()            # Random float 0.0-1.0
print randint(1, 10)      # Random integer 1-10
print choice([1, 2, 3])   # Random choice from list

let deck = [1, 2, 3, 4, 5]
shuffle(deck)             # Shuffle list in-place
print deck
```

#### Type Conversion

```cubit
print int(3.14)           # Convert to integer: 3
print float(42)           # Convert to float: 42.0
print str(123)            # Convert to string: "123"
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

# Advanced modules
python3 cubit.py examples/math_module.cubit      # Math functions
python3 cubit.py examples/string_module.cubit    # String operations
python3 cubit.py examples/list_module.cubit      # List/array operations
python3 cubit.py examples/random_module.cubit    # Random number generation
python3 cubit.py examples/advanced_demo.cubit    # Comprehensive demo
```

## Architecture

Cubit is implemented in Python with three main components:

1. **Lexer** (`lexer.py`) - Tokenizes source code into tokens
2. **Parser** (`parser.py`) - Builds an Abstract Syntax Tree (AST) from tokens
3. **Interpreter** (`interpreter.py`) - Evaluates the AST and executes the code

## Advanced Modules

Cubit now includes several advanced modules:

### ✅ Math Module
Built-in mathematical functions including sqrt, pow, abs, min, max, floor, ceil, round, and trigonometric functions (sin, cos, tan).

### ✅ String Module
String manipulation functions including len, upper, lower, split, join, strip, replace, startswith, and endswith.

### ✅ List/Array Module
Full list support with literal syntax `[1, 2, 3]`, indexing `list[0]`, and functions like append, pop, insert, remove, sort, reverse, and shuffle.

### ✅ Random Module
Random number generation with random(), randint(), choice(), and shuffle() functions.

### ✅ Type Conversion
Functions for converting between types: int(), float(), str().

### ✅ Input Function
Get user input with the input() function.

## Future Enhancements

Possible future additions:
- User-defined functions with parameters and return values
- File I/O operations (read/write files)
- Error messages with better context and line numbers
- For loops and break/continue statements
- Dictionaries/objects
- Import system for organizing code

## License

MIT License - Feel free to use and modify!
