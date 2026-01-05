# Cubit Programming Language

Cubit is a simple, educational programming language with a clean syntax designed for learning programming concepts. This repository provides a complete full-stack template with a Next.js frontend and FastAPI backend, optimized for both local development and containerized deployment.

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

## Architecture

This template provides a complete full-stack application:

- **Frontend**: Next.js (standalone output mode) in `frontend/` directory
- **Backend**: FastAPI server in `api.py` with `/health` endpoint
- **Containerization**: Docker and Docker Compose support
- **CI/CD**: GitHub Actions workflows for automated testing

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 18+
- Docker and Docker Compose (for containerized deployment)

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

This will:
1. Install Python dependencies
2. Install frontend dependencies
3. Build the Next.js frontend in standalone mode
4. Display instructions for running the application

## Running the Application

### Option 1: Production Mode (Standalone Build)

After running the setup script, start both services:

**Unix/Linux/Mac:**
```bash
./start.sh
```

This automated script will:
- Start the FastAPI backend on port 8080
- Wait for the backend health check to pass
- Start the Next.js standalone server on port 3000
- Gracefully shut down both services on Ctrl+C

**Windows:**

You'll need to run both services in separate terminal windows:

Terminal 1 (Backend):
```batch
python api.py
```

Terminal 2 (Frontend):
```batch
cd frontend\.next\standalone\frontend
set BACKEND_URL=http://localhost:8080
set PORT=3000
node server.js
```

### Option 2: Development Mode

For active development with hot reloading:

**Terminal 1 (Backend API):**
```bash
python3 api.py
```

**Terminal 2 (Frontend Dev Server):**
```bash
cd frontend
npm run dev
```

The dev server supports hot module replacement for rapid iteration.

### Option 3: Docker Compose (Full-Stack)

Build and run both services in containers:

```bash
docker-compose up --build
```

This will:
- Build the backend container from `backend.Dockerfile`
- Build the frontend container from `frontend/Dockerfile`
- Start both services with proper health checks and dependencies
- Frontend waits for backend to be healthy before starting

To run in detached mode:
```bash
docker-compose up -d --build
```

To stop:
```bash
docker-compose down
```

## Manual Setup

If you prefer manual setup:

**1. Install Python dependencies:**
```bash
pip3 install -r requirements.txt
```

**2. Install frontend dependencies:**
```bash
cd frontend
PUPPETEER_SKIP_DOWNLOAD=true npm install
```

**3. Build the frontend:**
```bash
npm run build
cd ..
```

**4. Start services** (see Running the Application above)

## Accessing the Application

Once running, access the following endpoints:

- **Frontend UI**: http://localhost:3000
- **Backend API**: http://localhost:8080
- **API Documentation**: http://localhost:8080/docs
- **Health Check**: http://localhost:8080/health

## Configuration & Environment

### Backend Configuration

The backend runs on port 8080 by default. Configure via environment variables:

- `PORT`: Server port (default: 8080)
- `CORS_ORIGINS`: Allowed CORS origins (default: `*`)

### Frontend Configuration

The frontend uses Next.js standalone output mode. Key configurations:

- `PORT`: Server port (default: 3000)
- `BACKEND_URL`: Backend API URL (default: http://localhost:8080)
- `NEXT_PUBLIC_API_URL`: API URL embedded at build time

For local development, create `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Next.js Standalone Mode

This template uses Next.js `output: 'standalone'` configuration for optimized production builds. The standalone build:

- Bundles all dependencies into `.next/standalone/frontend/`
- Entry point: `frontend/.next/standalone/frontend/server.js`
- Includes minimal dependencies for production
- Reduces Docker image size significantly

**Important**: Always use the standalone server.js entry point for production, NOT the development server.

## Docker Deployment Details

### Backend Dockerfile (`backend.Dockerfile`)

- Base image: `python:3.11-slim`
- Exposes port 8080
- Includes health check via `/health` endpoint
- Runs `python3 api.py`

### Frontend Dockerfile (`frontend/Dockerfile`)

- Multi-stage build with Node 20 Alpine
- Builds Next.js in standalone mode
- Minimal production image with non-root user
- Exposes port 3000
- Entry point: `node server.js`

### Docker Compose Configuration

The `docker-compose.yml` orchestrates both services:

```yaml
services:
  backend:
    - Builds from backend.Dockerfile
    - Exposes port 8080
    - Health check enabled
  
  frontend:
    - Builds from frontend/Dockerfile  
    - Exposes port 3000
    - Depends on backend health check
    - Environment: BACKEND_URL=http://backend:8080
```

## CI/CD with GitHub Actions

This repository includes automated workflows in `.github/workflows/`:

### Backend CI (`api-smoke.yml`)
- Runs on every push and pull request
- Tests Python dependencies installation
- Starts backend server
- Validates `/health` endpoint
- Runs pytest smoke tests
- Uploads logs as artifacts on failure

### Frontend CI (`frontend-build.yml`)
- Runs on main branch and pull requests
- Installs Node.js dependencies
- Runs TypeScript type checking
- Builds Next.js in standalone mode
- Runs ESLint (non-blocking)

Both workflows ensure code quality and prevent regressions.

### Full-Stack Integration (`fullstack-ci.yml`)
- Comprehensive integration testing workflow
- Tests backend build and API endpoints
- Tests frontend build in standalone mode
- Tests Docker builds for both services
- Runs integration tests with docker-compose
- Verifies end-to-end communication between services

## Important Notes

### Standalone Mode Entry Point

This template uses Next.js **standalone output mode** for production deployments. The correct entry point is:

```
frontend/.next/standalone/frontend/server.js
```

**Important:** Do NOT use the following for production:
- ❌ `npm run dev` (development mode only)
- ❌ `frontend/server.js` (doesn't exist)
- ❌ `frontend/.next/server/index.js` (incorrect path)

The `start.sh` script and Docker configurations use the correct standalone entry point.

### Deprecated Scripts

The following scripts are maintained for legacy Railway deployment but are **not recommended** for new deployments:

- `start-api.sh` - Use `python3 api.py` directly or the new `start.sh`
- `start-fullstack.sh` - Use `start.sh` or `docker-compose up` instead

For modern deployments, prefer:
- **Local development**: `start.sh` (Unix/Linux/Mac)
- **Docker**: `docker-compose up --build`
- **Railway**: See [RAILWAY.md](RAILWAY.md)

## Production Deployment

### Railway Deployment (Recommended)

**📖 For detailed Railway deployment instructions, see [RAILWAY.md](RAILWAY.md)**

Railway is the recommended platform for deploying the full-stack application. Key features:

- Single service running both frontend and backend
- Automatic HTTPS and domain management
- Simple environment variable configuration
- Built-in monitoring and logs

Quick deployment steps:
1. Connect your GitHub repository to Railway
2. Set root directory to `/` for backend service
3. Add frontend service with root directory `/frontend`
4. Set `NEXT_PUBLIC_API_URL` environment variable
5. Deploy!

### Alternative Cloud Platforms

This template can be deployed to other platforms:

- **Vercel** (frontend only, backend needs separate hosting)
- **Heroku** (both services separately)
- **AWS ECS/Fargate** (using Docker containers)
- **Google Cloud Run** (using Docker containers)
- **Azure Container Instances** (using Docker containers)

For containerized deployments, use the provided Dockerfiles and docker-compose.yml as a starting point.

## Using the Cubit Language

### Interactive REPL (Command Line)

```bash
# Interactive REPL
python3 cubit.py

# Run a file
python3 cubit.py examples/basic.cubit
```

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

#### REPL Commands

- `help` - Display help information
- `vars` - Show all defined variables
- `exit` or `quit` - Exit the REPL

### Running Example Programs

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

## Using the REPL (Command Line)

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

## Implementation Architecture

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

### Deployment to Railway (Primary Platform)

**📖 See [RAILWAY.md](RAILWAY.md) for the complete, step-by-step Railway deployment guide.**

Cubit is designed for Railway deployment with both backend and frontend services running from the same repository.

#### Quick Start

1. Create Railway project from GitHub repository
2. Deploy backend (automatic, uses root directory)
3. Add frontend service (set root directory to `frontend`)
4. Set `NEXT_PUBLIC_API_URL` environment variable in frontend
5. Deploy!

For detailed instructions, troubleshooting, and best practices, see **[RAILWAY.md](RAILWAY.md)**.

#### Architecture Overview

- **Backend Service**: FastAPI server serving the Cubit execution API
- **Frontend Service**: Next.js application providing the interactive playground GUI
- **Communication**: Frontend calls backend API via `NEXT_PUBLIC_API_URL`

#### Deployment Steps (Summary)

##### 1. Deploy Backend Service

1. **Create a new Railway project** from your GitHub repository
2. **Configure the backend service:**
   - **Root Directory**: `/` (project root)
   - **Build Command**: Automatic (uses `nixpacks.toml` or `Procfile`)
   - **Start Command**: `uvicorn api:app --host 0.0.0.0 --port $PORT`
   - **Node Version**: Not applicable (Python service)
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
   - **Start Command**: `npm run start` (runs `node .next/standalone/server.js` for standalone mode)
   - **Node Version**: 18+ (configured in `frontend/nixpacks.toml`)
3. **Set environment variables** (critical):
   - `NEXT_PUBLIC_API_URL`: Your backend service URL from step 1
   - Example: `https://your-backend-service.railway.app`
   - **Note**: For Puppeteer installation issues, add `PUPPETEER_SKIP_DOWNLOAD=true`
4. **Railway will automatically:**
   - Detect Node.js and install dependencies from `package.json`
   - Build the Next.js application using the configuration in `frontend/nixpacks.toml`
   - Start the production server on the Railway-provided port
5. **Important**: After setting environment variables, **redeploy** the frontend service to apply changes

##### 3. Access Your Deployment

- **Backend API**: `https://your-backend-service.railway.app`
  - Test with: `https://your-backend-service.railway.app/docs`
- **Frontend GUI**: `https://your-frontend-service.railway.app`
  - Users will see the full interactive Cubit playground

#### Configuration Files

The repository includes Railway-specific configuration files:

- **`nixpacks.toml`** (root): Primary backend build and start configuration (takes precedence)
- **`railway.json`** (root): Backend deployment policies (restart settings)
- **`frontend/nixpacks.toml`**: Frontend build and start configuration
- **`Procfile`** (root): Fallback start command (only used if nixpacks.toml is removed)

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

#### Alternative Deployment Platforms

While Railway is recommended for full-stack deployment from a single repository, you can also deploy to other platforms:

##### Vercel (Frontend Only)

**Frontend Deployment:**
1. Import your GitHub repository to Vercel
2. Set **Root Directory** to `frontend`
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-api.example.com`
4. Vercel auto-detects Next.js and configures build settings
5. Deploy

**Note:** You'll need to deploy your backend separately (Railway, Heroku, etc.)

##### Netlify (Frontend Only)

**Frontend Deployment:**
1. Create new site from Git in Netlify
2. Set **Base directory** to `frontend`
3. Set **Build command** to `npm run build`
4. Set **Publish directory** to `frontend/.next`
5. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-api.example.com`
6. Add `PUPPETEER_SKIP_DOWNLOAD=true` to environment variables
7. Deploy

**Note:** You'll need to deploy your backend separately.

##### Important Notes for All Platforms

- **Required Environment Variable**: `NEXT_PUBLIC_API_URL` must be set for the frontend to connect to the backend
- **Build-time Variables**: Variables starting with `NEXT_PUBLIC_` are embedded during build, so you must redeploy after changing them
- **Node Version**: Ensure Node.js 18+ is used (check platform settings)
- **Backend URL Format**: Use full URL with protocol (e.g., `https://api.example.com`, not `api.example.com`)

For detailed frontend deployment instructions including troubleshooting, see `frontend/README.md`.

#### Troubleshooting

##### Common Deployment Issues

**Frontend shows "Failed to fetch" errors or "API Disconnected":**
- **Issue**: Frontend cannot connect to the backend API
- **Solutions**:
  1. Verify `NEXT_PUBLIC_API_URL` is set correctly in Railway frontend service
  2. Ensure the backend service is running and accessible (check Railway logs)
  3. Test backend URL directly: `https://your-backend-service.railway.app/health`
  4. Remember: Environment variables starting with `NEXT_PUBLIC_` must be set at build time
  5. After setting/changing environment variables, trigger a **redeploy** of the frontend service
  6. Check for HTTPS issues: Railway uses HTTPS, make sure URL starts with `https://`

**Backend not accessible or returns 404:**
- **Issue**: Backend service not starting or not exposing the correct port
- **Solutions**:
  1. Check Railway logs for Python errors or dependency installation failures
  2. Verify `requirements.txt` includes all necessary dependencies:
     - `fastapi`
     - `uvicorn`
     - `pydantic`
  3. Ensure the `PORT` environment variable is being used correctly
  4. Test the root endpoint: `https://your-backend-service.railway.app/`
  5. Check that `nixpacks.toml` is present and properly configured

**Frontend build fails:**
- **Issue**: Next.js build process fails during deployment
- **Solutions**:
  1. Check deployment platform build logs for specific error messages
  2. Verify all dependencies are in `frontend/package.json`
  3. Ensure Node.js version 18+ is configured
  4. Check for TypeScript errors in your components
  5. If Puppeteer installation fails, add environment variable: `PUPPETEER_SKIP_DOWNLOAD=true`
  6. Try building locally to reproduce: `cd frontend && npm ci && npm run build`
  7. Verify `NEXT_PUBLIC_API_URL` is set (missing env vars can cause build issues in some cases)

**Changes not reflecting after deployment:**
- **Issue**: New code or configuration changes not visible
- **Solutions**:
  1. Railway requires a redeploy after environment variable changes
  2. Frontend must be rebuilt when `NEXT_PUBLIC_API_URL` changes
  3. Clear browser cache or try incognito/private browsing mode
  4. Verify the deployment completed successfully in Railway logs
  5. Check the commit hash in Railway matches your latest changes

**Health indicator always shows "Disconnected":**
- **Issue**: Health check endpoint not working
- **Solutions**:
  1. Verify backend `/health` endpoint is accessible
  2. Check browser console for CORS errors
  3. Ensure backend CORS settings allow frontend domain
  4. Test health endpoint directly: `curl https://your-backend-service.railway.app/health`
  5. Check Railway logs for backend startup errors

**CSS styles not loading or appearing broken:**
- **Issue**: Tailwind CSS not properly configured
- **Solutions**:
  1. Ensure `@import "tailwindcss"` is at the top of `globals.css`
  2. Verify `tailwind.config.js` and `postcss.config.mjs` are present
  3. Check that Tailwind v4 syntax is used consistently
  4. Clear Next.js cache: `rm -rf frontend/.next`
  5. Rebuild: `npm run build`

##### Local Development Issues

**Backend API fails to start locally:**
- **Solutions**:
  1. Ensure Python 3.11+ is installed: `python3 --version`
  2. Install dependencies: `pip install -r requirements.txt`
  3. Check port 8080 is not already in use: `lsof -i :8080` (Mac/Linux)
  4. Try a different port: `PORT=8081 python3 api.py`

**Frontend cannot connect to local backend:**
- **Solutions**:
  1. Ensure backend is running on port 8080
  2. Create `frontend/.env.local` with: `NEXT_PUBLIC_API_URL=http://localhost:8080`
  3. Restart frontend dev server after creating `.env.local`
  4. Check browser console for CORS or network errors

**npm install fails in frontend:**
- **Solutions**:
  1. Use Node.js 18+ (check with `node --version`)
  2. If Puppeteer fails to download Chrome: set `PUPPETEER_SKIP_DOWNLOAD=true` environment variable
  3. Clear npm cache: `npm cache clean --force`
  4. Delete `node_modules` and `package-lock.json`, then reinstall
  5. Try `npm install --legacy-peer-deps` if dependency conflicts occur
  6. For CI/CD, ensure cache is cleared between builds if issues persist

**Cleaning build artifacts and dependencies (Best Practice):**
- **When to clean**: Before reporting issues, after major updates, or when seeing unexplained errors
- **Steps**:
  1. Remove old build artifacts:
     ```bash
     # From repository root
     rm -rf frontend/.next frontend/out
     ```
  2. Clean dependency caches:
     ```bash
     cd frontend
     npm cache clean --force
     rm -rf node_modules package-lock.json
     npm install
     ```
  3. Remove any stale compiled config files:
     ```bash
     # These files are auto-ignored in .gitignore
     rm -f next.config.compiled.js frontend/next.config.compiled.js
     ```
  4. For Python dependencies:
     ```bash
     # From repository root
     pip install --upgrade pip
     pip install -r requirements.txt --force-reinstall
     ```
- **Note**: The repository includes a placeholder `next.config.js` in the root directory to prevent Next.js from searching for configs in the wrong location. The actual Next.js configuration is in `frontend/next.config.ts`.

##### Getting Help

If issues persist:
1. Check deployment platform logs for detailed error messages
2. Review browser console for frontend errors (F12 Developer Tools)
3. Test individual components in isolation
4. Ensure environment variables are correctly set in your platform's dashboard
5. Verify your GitHub repository is properly connected to your deployment platform
6. Try redeploying from scratch if configuration changes aren't taking effect
7. For Railway-specific issues, check the Railway documentation at https://docs.railway.app
8. See detailed troubleshooting in `frontend/README.md` for frontend-specific issues

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
