# Docker Guide for Cubit

This guide provides detailed information about running Cubit using Docker Compose.

## Architecture

Cubit uses a **dual-server architecture**:

1. **Python Backend (FastAPI)** - Serves the Cubit programming language API
   - Runs on port 8080
   - Provides REST endpoints for code execution
   - Includes lexer, parser, and interpreter
   - Pedagogical API for learning tracking

2. **Next.js Frontend** - Provides the web interface
   - Runs on port 3000
   - Built with React and TypeScript
   - Communicates with backend API
   - Two modes: production (optimized build) and development (hot-reload)

## Prerequisites

- **Docker** (version 20.10 or later)
- **Docker Compose** (version 2.0 or later)
- At least 2GB of free disk space
- Ports 3000 and 8080 available on your host machine

## Services

### Backend Service

**Container:** `cubit-backend`
- **Image:** `python:3.11-slim`
- **Port:** 8080
- **Healthcheck:** HTTP GET to `/health` endpoint
- **Auto-reload:** Enabled (code changes reload server automatically)

**Mounted Volumes:**
- All Python source files (`api.py`, `lexer.py`, `parser.py`, `interpreter.py`, etc.)
- `pedagogical/` directory (teaching modules)
- `examples/` directory (example code)
- `requirements.txt` (dependencies)

### Frontend Service (Production)

**Container:** `cubit-frontend`
- **Build:** Multi-stage Dockerfile from `frontend/Dockerfile`
- **Port:** 3000
- **Target:** `runner` (optimized production stage)
- **Healthcheck:** HTTP GET to root endpoint
- **Dependencies:** Waits for backend to be healthy before starting

**Environment Variables:**
- `NODE_ENV=production`
- `PORT=3000`
- `NEXT_PUBLIC_API_URL=http://localhost:8080`

### Frontend-Dev Service (Development)

**Container:** `cubit-frontend-dev`
- **Image:** `node:20-alpine`
- **Port:** 3000
- **Profile:** `dev` (only runs with `--profile dev` flag)
- **Hot Reload:** Enabled via volume mounts and `WATCHPACK_POLLING`

**Mounted Volumes:**
- `./frontend` → `/app` (full source code)
- Anonymous volumes for `node_modules` and `.next` (performance optimization)

**Environment Variables:**
- `NODE_ENV=development`
- `NEXT_PUBLIC_API_URL=http://backend:8080` (uses Docker network)
- `WATCHPACK_POLLING=true` (ensures file changes are detected)

## Quick Start

### Production Mode (Recommended)

Run the optimized production build:

```bash
docker compose up
```

Access the application:
- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:8080
- **API Docs:** http://localhost:8080/docs

### Development Mode

Run with hot-reload for frontend development:

```bash
docker compose --profile dev up
```

This starts:
- Backend with auto-reload (file changes reload the server)
- Frontend-dev with hot module replacement (instant UI updates)

## Common Commands

### Start Services

```bash
# Start all services (production frontend)
docker compose up

# Start in background (detached mode)
docker compose up -d

# Start with development frontend
docker compose --profile dev up

# Start only the backend
docker compose up backend

# Start backend + dev frontend
docker compose --profile dev up backend frontend-dev
```

### Stop Services

```bash
# Stop all running services (graceful shutdown)
docker compose down

# Stop and remove volumes
docker compose down -v

# Stop without removing containers
docker compose stop
```

### View Logs

```bash
# View logs from all services
docker compose logs

# Follow logs in real-time
docker compose logs -f

# View logs from specific service
docker compose logs backend
docker compose logs frontend

# Follow backend logs
docker compose logs -f backend
```

### Rebuild Services

```bash
# Rebuild frontend image after Dockerfile changes
docker compose build frontend

# Rebuild and restart
docker compose up --build

# Force rebuild without cache
docker compose build --no-cache frontend
```

### Execute Commands in Containers

```bash
# Open shell in backend container
docker compose exec backend sh

# Run Python REPL in backend
docker compose exec backend python

# Check backend dependencies
docker compose exec backend pip list

# Open shell in frontend container
docker compose exec frontend sh
```

## Environment Variables

### Backend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Port for FastAPI server |
| `PYTHONUNBUFFERED` | `1` | Disable Python output buffering |
| `CORS_ORIGINS` | `*` | Allowed CORS origins (comma-separated) |

### Frontend Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node environment mode |
| `PORT` | `3000` | Port for Next.js server |
| `NEXT_PUBLIC_API_URL` | `http://localhost:8080` | Backend API URL (browser) |
| `WATCHPACK_POLLING` | `true` (dev only) | Enable file watching in Docker |

## Troubleshooting

### Port Already in Use

**Error:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution:**
```bash
# Find process using the port
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change the port in docker-compose.yml
# Edit ports section:
ports:
  - "3001:3000"  # Use 3001 on host instead
```

### Backend Healthcheck Failing

**Error:** Backend service stays unhealthy

**Solution:**
```bash
# Check backend logs
docker compose logs backend

# Common issues:
# 1. Missing Python dependencies - check requirements.txt
# 2. Syntax error in Python files - check error messages
# 3. Port conflict - ensure 8080 is available

# Manual healthcheck test
docker compose exec backend python -c "import urllib.request; print(urllib.request.urlopen('http://localhost:8080/health').read())"
```

### Frontend Build Fails

**Error:** Frontend container exits during build

**Solution:**
```bash
# Check build logs
docker compose build frontend

# Common issues:
# 1. Node modules not found - ensure package.json exists in frontend/
# 2. TypeScript errors - check source code
# 3. Memory limit - increase Docker memory allocation

# Test build locally first
cd frontend
npm install
npm run build
```

### Hot Reload Not Working (Development)

**Error:** Code changes don't trigger reload

**Solution:**
```bash
# 1. Ensure using --profile dev
docker compose --profile dev up

# 2. Check WATCHPACK_POLLING is set
docker compose exec frontend-dev env | grep WATCHPACK

# 3. Restart the dev service
docker compose restart frontend-dev

# 4. For backend changes, no restart needed (--reload handles it)
# For frontend changes, refresh browser
```

### Volume Mount Permission Issues

**Error:** `Permission denied` when accessing files

**Solution:**
```bash
# Linux/macOS: Ensure files are readable
chmod -R 755 /path/to/Cubit

# Check volume mounts
docker compose config | grep volumes

# Use docker user mapping (add to service config)
user: "${UID}:${GID}"
```

### Cannot Connect to Backend from Frontend

**Error:** Frontend can't reach backend API

**Solution:**
```bash
# 1. Check backend is healthy
docker compose ps

# 2. Verify network connectivity
docker compose exec frontend ping backend

# 3. Check environment variable
docker compose exec frontend env | grep NEXT_PUBLIC_API_URL

# 4. For browser requests, use http://localhost:8080
# For server-side requests, use http://backend:8080
```

## Production Deployment

### Optimizations

1. **Use production frontend service** (not frontend-dev)
2. **Set explicit CORS origins:**
   ```yaml
   environment:
     - CORS_ORIGINS=https://yourdomain.com
   ```
3. **Use external volumes for data persistence**
4. **Configure resource limits:**
   ```yaml
   deploy:
     resources:
       limits:
         cpus: '1.0'
         memory: 512M
   ```

### Security Considerations

1. **Don't expose backend directly** - Use reverse proxy (nginx, traefik)
2. **Use HTTPS** - Configure SSL/TLS certificates
3. **Set secure environment variables** - Use Docker secrets or .env files
4. **Regular updates** - Keep base images updated:
   ```bash
   docker compose pull
   docker compose up -d
   ```

### Monitoring

```bash
# Check service health
docker compose ps

# View resource usage
docker stats

# Check logs for errors
docker compose logs --tail=100 -f
```

### Scaling

Docker Compose is suitable for development and small deployments. For production scaling, consider:

- **Kubernetes** - Orchestrate multiple replicas
- **Docker Swarm** - Native Docker clustering
- **Cloud Services** - Railway, Heroku, AWS ECS, etc.

## Alternative: Root Dockerfile

The repository includes a root `Dockerfile` that bundles both frontend and backend into a single container. This is primarily for Railway deployment.

To use it:
```bash
docker build -t cubit:latest .
docker run -p 3000:3000 cubit:latest
```

**Note:** Docker Compose is recommended for local development as it provides better isolation and flexibility.

## Getting Help

- **Documentation:** Check the main [README.md](README.md)
- **Issues:** Report problems on [GitHub Issues](https://github.com/DoctorDoveDragon/Cubit/issues)
- **Logs:** Always include `docker compose logs` output when asking for help
