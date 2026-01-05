# ==============================================================================
# Dockerfile for Cubit FastAPI Backend
# Runs the FastAPI backend server on port 8080
# ==============================================================================

FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend source code
COPY api.py .
COPY interpreter.py .
COPY lexer.py .
COPY parser.py .
COPY cubit.py .
COPY pedagogical/ ./pedagogical/

# Expose port 8080
EXPOSE 8080

# Set environment variable for port
ENV PORT=8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD python3 -c "import urllib.request; urllib.request.urlopen('http://localhost:8080/health')"

# Run the FastAPI server
CMD ["python3", "api.py"]
