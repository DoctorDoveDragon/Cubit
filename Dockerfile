# Docker Configuration

This repository now uses separate Dockerfiles for frontend and backend services.

## Structure

- `frontend/Dockerfile` - Multi-stage build for Next.js frontend
- `backend/Dockerfile` - Python backend with FastAPI
- `docker-compose.yml` - Orchestrates both services

## Running the Application

Use docker-compose to run the full stack:

```bash
docker compose up --build
```

Or use the start script which prefers docker-compose:

```bash
./start-fullstack.sh
```

For detailed instructions, see the main README.md
