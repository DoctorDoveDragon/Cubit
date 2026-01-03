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

## Quick Start

### Automated Setup (Recommended)

**Unix/Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```batch
setup.bat
```

### Manual Setup

**1. Install Python dependencies:**
```bash
pip3 install -r requirements.txt
```

**2. Install frontend dependencies:**
```bash
cd frontend
npm install
```

**3. Start the backend API (Terminal 1):**
```bash
python3 api.py
```

**4. Start the frontend (Terminal 2):**
```bash
cd frontend
npm run dev
```

**5. Open your browser:**
Visit http://localhost:3000

### Using the REPL (Command Line)

```bash
# Interactive REPL
python3 cubit.py

# Run a file
python3 cubit.py examples/basic.cubit
```

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

## API Server

Cubit now includes a FastAPI web server that provides REST API endpoints for executing Cubit code. This enables web-based code execution and integration with frontend applications.

### Running the API Server Locally

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the server:

```bash
# Using the deployment script
./start-api.sh

# Or directly with uvicorn
uvicorn api:app --host 0.0.0.0 --port 8080

# Or with Python
python3 api.py
```

The API server will be available at `http://localhost:8080`

### API Endpoints

#### GET `/`
Welcome endpoint with API information.

**Response:**
```json
{
  "message": "Welcome to Cubit Programming Language API",
  "version": "1.0.0",
  "endpoints": {
    "/": "API information (this page)",
    "/health": "Health check endpoint",
    "/execute": "Execute Cubit code (POST)"
  },
  "documentation": "/docs"
}
```

#### GET `/health`
Health check endpoint for monitoring.

**Response:**
```json
{
  "status": "healthy"
}
```

#### POST `/execute`
Execute Cubit code and return the output.

**Request:**
```json
{
  "code": "let x = 10\nprint x * 2"
}
```

**Response (Success):**
```json
{
  "output": "20\n",
  "result": 20,
  "error": null
}
```

**Response (Error):**
```json
{
  "output": null,
  "result": null,
  "error": "Undefined variable: y"
}
```

### API Usage Examples

#### Using curl

```bash
# Execute simple code
curl -X POST http://localhost:8080/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "let x = 10\nprint x * 2"}'

# Execute code with error
curl -X POST http://localhost:8080/execute \
  -H "Content-Type: application/json" \
  -d '{"code": "print undefined_var"}'

# Health check
curl http://localhost:8080/health
```

#### Using Python requests

```python
import requests

# Execute Cubit code
response = requests.post('http://localhost:8080/execute', json={
    'code': '''
let numbers = [1, 2, 3, 4, 5]
let sum = 0
let i = 0
while i < len(numbers) {
    sum = sum + numbers[i]
    i = i + 1
}
print sum
'''
})

print(response.json())
# Output: {'output': '15\n', 'result': 15, 'error': None}
```

#### Using JavaScript/TypeScript

```javascript
// Execute Cubit code
const response = await fetch('http://localhost:8080/execute', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: 'let x = 10\nprint x * 2' })
});

const result = await response.json();
console.log(result);
// Output: { output: "20\n", result: 20, error: null }
```

### Deployment to Railway (Full Stack)

Cubit supports deployment of both the backend API and frontend GUI as separate Railway services from the same repository.

#### Architecture Overview

- **Backend Service**: FastAPI server serving the Cubit execution API
- **Frontend Service**: Next.js application providing the interactive playground GUI
- **Communication**: Frontend calls backend API via `NEXT_PUBLIC_API_URL`

#### Deployment Steps

##### 1. Deploy Backend Service

1. **Create a new Railway project** from your GitHub repository
2. **Configure the backend service:**
   - **Root Directory**: `/` (project root)
   - **Build Command**: Automatic (uses `nixpacks.toml` or `Procfile`)
   - **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
3. **Railway will automatically:**
   - Detect Python and install dependencies from `requirements.txt`
   - Use the `Procfile` or `nixpacks.toml` configuration
   - Set the `PORT` environment variable
4. **Note your backend URL**: `https://your-backend-service.railway.app`

##### 2. Deploy Frontend Service

1. **Add a new service** to the same Railway project
2. **Configure the frontend service:**
   - **Root Directory**: `/frontend`
   - **Build Command**: `npm run build`
   - **Start Command**: `npm run start`
3. **Set environment variables** (critical):
   - `NEXT_PUBLIC_API_URL`: Your backend service URL from step 1
   - Example: `https://your-backend-service.railway.app`
4. **Railway will automatically:**
   - Detect Node.js and install dependencies from `package.json`
   - Build the Next.js application
   - Start the production server on the Railway-provided port

##### 3. Access Your Deployment

- **Backend API**: `https://your-backend-service.railway.app`
  - Test with: `https://your-backend-service.railway.app/docs`
- **Frontend GUI**: `https://your-frontend-service.railway.app`
  - Users will see the full interactive Cubit playground

#### Configuration Files

The repository includes Railway-specific configuration files:

- **`railway.json`**: Backend service configuration (root)
- **`nixpacks.toml`**: Backend build configuration (root)
- **`frontend/nixpacks.toml`**: Frontend build configuration
- **`Procfile`**: Fallback backend start command

#### Environment Variables

##### Backend Service
- `PORT` - Server port (automatically set by Railway)

##### Frontend Service
- `NEXT_PUBLIC_API_URL` - Backend API URL (must be set manually)
  - **Required**: Yes
  - **Format**: `https://your-backend-service.railway.app`
  - **Example**: `https://cubit-api-production.up.railway.app`

To set in Railway dashboard:
1. Go to your frontend service settings
2. Navigate to "Variables" tab
3. Add `NEXT_PUBLIC_API_URL` with your backend URL
4. Redeploy the frontend service

#### Local Development with Environment Variables

Create a `.env.local` file in the `frontend/` directory for local development:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

See `frontend/.env.example` for reference.

#### CORS Configuration

The backend API is configured to allow requests from any origin, supporting the frontend deployment on a different domain. CORS settings are in `api.py`:

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows frontend from any domain
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### Troubleshooting

**Frontend shows "Failed to fetch" errors:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Railway
- Check that the backend service is running and accessible
- Environment variables starting with `NEXT_PUBLIC_` must be set at build time

**Backend not accessible:**
- Ensure the `PORT` environment variable is being used
- Check Railway logs for startup errors
- Verify `requirements.txt` dependencies are installing correctly

**Changes not reflecting:**
- Railway requires a redeploy after environment variable changes
- Frontend must be rebuilt when `NEXT_PUBLIC_API_URL` changes

### Interactive Documentation

Once the server is running, visit `http://localhost:8080/docs` to access the interactive API documentation powered by Swagger UI.

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
