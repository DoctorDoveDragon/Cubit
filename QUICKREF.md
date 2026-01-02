# Cubit Language Quick Reference

## Running Cubit

```bash
# Interactive REPL
python3 cubit.py

# Run a file
python3 cubit.py program.cubit
```

## Syntax Reference

### Comments
```cubit
# This is a comment
```

### Variables
```cubit
let x = 10        # declare with let
y = 20            # or assign directly
```

### Data Types
```cubit
42                # integers
3.14              # floats
"Hello"           # strings
```

### Arithmetic Operators
```cubit
+                 # addition
-                 # subtraction
*                 # multiplication
/                 # division
```

### Comparison Operators
```cubit
==                # equal to
!=                # not equal to
<                 # less than
>                 # greater than
<=                # less than or equal
>=                # greater than or equal
```

### Print Statement
```cubit
print expression
print "text"
print x + y
```

### If-Else Statement
```cubit
if condition {
    # statements
} else {
    # statements
}

# Condition can have optional parentheses
if (x > 5) {
    # statements
}
```

### While Loop
```cubit
while condition {
    # statements
}

# Example: count to 10
let i = 0
while i < 10 {
    print i
    i = i + 1
}
```

### Grouping with Parentheses
```cubit
(a + b) * c
```

## REPL Commands

- `help` - Show help
- `vars` - Display all variables
- `exit` or `quit` - Exit REPL

## Example Programs

See the `examples/` directory for complete programs:
- `basic.cubit` - Variables and arithmetic
- `fibonacci.cubit` - Generate Fibonacci numbers
- `conditionals.cubit` - If-else logic
- `countdown.cubit` - While loop example
- `test_suite.cubit` - Comprehensive feature test
