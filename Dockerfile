# Multi-stage Dockerfile for Cubit Full-Stack Application
# Builds Next.js frontend and sets up Python backend venv
# Final image runs both via the repository start script

FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM node:20-slim AS runner
RUN apt-get update && apt-get install -y \
    python3 python3-pip python3-venv curl \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY requirements.txt .
RUN python3 -m venv /opt/venv && \
    /opt/venv/bin/pip install --no-cache-dir --upgrade pip && \
    /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# Backend files (repo root)
COPY api.py .
COPY interpreter.py .
COPY lexer.py .
COPY parser.py .
COPY cubit.py .
COPY pedagogical/ ./pedagogical/

# Frontend build output
RUN mkdir -p ./frontend
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Startup script
COPY start-fullstack.sh .
RUN chmod +x start-fullstack.sh

EXPOSE 3000
ENV PORT=3000
ENV BACKEND_URL=http://localhost:8080
CMD ["./start-fullstack.sh"]
