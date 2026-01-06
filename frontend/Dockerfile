# frontend/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY frontend/ ./
RUN npm run build || true
RUN npm run build:standalone || true

FROM node:20-slim AS runner
WORKDIR /app
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/node_modules /app/node_modules
EXPOSE 3000
ENV PORT=3000
CMD ["npm", "run", "start"]
