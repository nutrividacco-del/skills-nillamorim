# =====================================================================
# DOCKERFILE PADRAO NODE.JS — Imperatriz
# =====================================================================
# Multi-stage build: imagem final pequena e segura.
# Roda como user non-root (security best practice).
# =====================================================================

# ============== STAGE 1: BUILD ============
FROM node:20-alpine AS builder

WORKDIR /app

# Copia so package files primeiro (cache de layer)
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Se for TypeScript, precisa de devDeps pra buildar
FROM node:20-alpine AS ts-builder
WORKDIR /app
COPY package*.json tsconfig*.json ./
COPY src ./src
RUN npm ci --no-audit --no-fund
RUN npm run build

# ============== STAGE 2: PRODUCTION ============
FROM node:20-alpine

# Tini = init process correto pra container (zumbie handling)
RUN apk add --no-cache tini

WORKDIR /app

# User non-root
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Copia node_modules da fase build (so prod deps)
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

# Copia codigo compilado da fase ts-builder
COPY --from=ts-builder --chown=nodejs:nodejs /app/dist ./dist
COPY --chown=nodejs:nodejs package*.json ./

# Health check (Nginx pode usar isso pra liveness)
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:'+process.env.PORT+'/health',(r)=>{process.exit(r.statusCode===200?0:1)}).on('error',()=>process.exit(1))"

USER nodejs

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "dist/server.js"]

# =====================================================================
# .dockerignore (criar no root do projeto)
# =====================================================================
# node_modules
# .env
# .env.*
# !.env.example
# .git
# .github
# dist
# build
# coverage
# .nyc_output
# .vscode
# .idea
# *.log
# README.md
# docs
# tests
# *.test.ts
# *.spec.ts
# =====================================================================
