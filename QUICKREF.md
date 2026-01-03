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
[1, 2, 3]         # lists/arrays
```

### Lists/Arrays
```cubit
let nums = [1, 2, 3, 4, 5]    # create list
print nums[0]                  # access by index (first element)
print nums[-1]                 # negative indexing (last element)
let matrix = [[1, 2], [3, 4]] # nested lists
print matrix[0][1]             # access nested element
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

### Function Calls
```cubit
# Math functions
sqrt(16)              # square root
pow(2, 8)             # power
abs(-5)               # absolute value
min(1, 2, 3)          # minimum
max(1, 2, 3)          # maximum
floor(3.7)            # floor
ceil(3.2)             # ceiling
round(3.5)            # round

# String functions
len("hello")          # length
upper("hello")        # uppercase
lower("HELLO")        # lowercase
split("a,b,c", ",")   # split string
join("-", [1, 2, 3])  # join list

# List functions
append(list, item)    # add to list
pop(list)             # remove last
sort(list)            # sort in-place
reverse(list)         # reverse in-place

# Random functions
random()              # random 0.0-1.0
randint(1, 10)        # random integer
choice([1, 2, 3])     # random choice
shuffle(list)         # shuffle in-place

# Type conversion
int(3.14)             # to integer
float(42)             # to float
str(123)              # to string

# Input
input("Enter: ")      # get user input
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
- `math_module.cubit` - Math module examples
- `string_module.cubit` - String module examples
- `list_module.cubit` - List/array module examples
- `random_module.cubit` - Random module examples
- `advanced_demo.cubit` - All modules demo
