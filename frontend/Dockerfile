# Frontend Dockerfile: use CONTEXT=frontend for repo-root builds, CONTEXT=. when building from ./frontend
ARG CONTEXT=frontend

FROM node:20-alpine AS deps
ARG CONTEXT
WORKDIR /app
# copy package metadata from the chosen context
COPY ${CONTEXT}/package.json ${CONTEXT}/package-lock.json ./
ENV PUPPETEER_SKIP_DOWNLOAD=true
RUN npm ci

FROM node:20-alpine AS builder
ARG CONTEXT
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
# copy app sources from chosen context (./ when building inside frontend/)
COPY ${CONTEXT}/ ./
# build Next.js
RUN npm run build || true
# optional standalone step used by the repo's package.json
RUN npm run build:standalone || true

FROM node:20-slim AS runner
WORKDIR /app
# runtime artifacts produced by builder
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/package.json /app/package.json

EXPOSE 3000
ENV PORT=3000
CMD ["npm", "run", "start"]
