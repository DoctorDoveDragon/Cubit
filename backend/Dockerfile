# Backend Dockerfile (context-agnostic; default CONTEXT=backend)
ARG CONTEXT=backend
FROM python:3.11-slim AS base
RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    build-essential \
    gcc \
    libffi-dev \
    libpq-dev \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
# copy requirements from chosen context (expects build context at repo root)
COPY ${CONTEXT}/requirements.txt .
RUN python -m venv /opt/venv \
    && /opt/venv/bin/pip install --upgrade pip setuptools wheel \
    && /opt/venv/bin/pip install --no-cache-dir -r requirements.txt

# copy backend source from chosen context
COPY ${CONTEXT}/ ./
# fail early if required files are missing (helps detect wrong build context/ARG)
RUN [ -f requirements.txt ] || (echo "Missing requirements.txt — wrong build context or CONTEXT arg" && exit 1)

ENV PATH="/opt/venv/bin:$PATH"
EXPOSE 8080

CMD ["uvicorn", "api:app", "--host", "0.0.0.0", "--port", "8080", "--loop", "auto", "--ws", "auto"]
