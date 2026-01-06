# Repository Structure

This repository has been restructured into separate frontend and backend services.

## Directory Structure

```
.
├── backend/               # Python FastAPI backend
│   ├── api.py            # Main API server
│   ├── interpreter.py    # Cubit interpreter
│   ├── lexer.py          # Lexer
│   ├── parser.py         # Parser
│   ├── cubit.py          # Main Cubit CLI
│   ├── pedagogical/      # Pedagogical features
│   ├── requirements.txt  # Python dependencies
│   └── Dockerfile        # Backend Docker image
├── frontend/             # Next.js frontend
│   ├── src/              # React components and pages
│   ├── public/           # Static assets
│   ├── package.json      # Node dependencies
│   └── Dockerfile        # Frontend Docker image
├── docker-compose.yml    # Orchestrates both services
├── start-fullstack.sh    # Development startup script
└── .dockerignore         # Docker build exclusions
```

## Running the Application

### Using Docker Compose (Recommended)

```bash
docker compose up --build
```

Or run in detached mode:

```bash
docker compose up -d --build
docker compose logs -f
```

### Using the Startup Script

The `start-fullstack.sh` script prefers docker-compose but falls back to local processes:

```bash
./start-fullstack.sh
```

### Local Development

Backend:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 api.py
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```

## Services

- **Backend**: FastAPI on port 8080
- **Frontend**: Next.js on port 3000

The frontend communicates with the backend via `http://backend:8080` in Docker or `http://localhost:8080` locally.
