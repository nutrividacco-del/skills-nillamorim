# Templates de Código — Arquitetura Imperatriz

> Templates prontos pra colar. Cada um implementa uma parte dos 6 padroes.

---

## 📦 ARQUIVOS DISPONÍVEIS

| Arquivo | Camada | Quando usar |
|---------|--------|-------------|
| `nginx-edge-layer.conf` | 6 (Edge) | Configurar Nginx como porteiro central |
| `nginx-snippets.conf` | 6 (Edge) | Snippets reutilizaveis pra todos os apps |
| `express-middleware-auth.js` | 5 (Sidecar) | Autenticacao JWT compartilhada |
| `express-middleware-ratelimit.js` | 5 (Sidecar) | Rate-limit com Redis |
| `express-middleware-logger.js` | 5+Bonus | Logger estruturado Pino + correlation ID |
| `dockerfile-padrao-node.dockerfile` | 4 (Image) | Dockerfile multi-stage seguro |
| `docker-compose-multi-app.yml` | 4+5 (Image+IaC) | Compose com Postgres+Redis+apps |
| `queue-bullmq-setup.js` | 1 (Fila) | BullMQ idempotente |
| `control-plane-polling.js` | 2 (Control) | Config dinamica via polling |
| `pm2-ecosystem.config.js` | 4 (Image, transicao) | PM2 pra quem ainda nao migrou pra Docker |
| `github-actions-deploy.yml` | 4+5 (CI/CD) | Deploy automatico |
| `healthcheck.js` | Bonus | Endpoint /health + /health/deep |
| `env-validation.js` | Bonus | Valida envs no start (fail fast) |
| `setup-vps-from-scratch.sh` | 5 (IaC) | Setup completo de VPS Ubuntu |

---

## 🎯 COMO USAR

### Pra App Novo (Modo 2 da skill)
1. Crie repo
2. Copie `dockerfile-padrao-node.dockerfile` → renomeia pra `Dockerfile`
3. Copie `env-validation.js` → coloca em `src/utils/env.js`
4. Copie middlewares (auth, ratelimit, logger) → `src/middlewares/`
5. Copie `healthcheck.js` → `src/routes/health.js`
6. Copie `github-actions-deploy.yml` → `.github/workflows/deploy.yml`

### Pra App Existente (Modo 1/3 da skill)
1. Identifique a camada que vai refatorar
2. Pegue só o template daquela camada
3. **Implementa em paralelo** (não troca de uma vez)
4. Feature flag pra testar
5. Migra gradualmente

### Pra VPS Nova
1. Roda `setup-vps-from-scratch.sh`
2. Copia `docker-compose-multi-app.yml` pra `/opt/imperatriz/`
3. Copia `nginx-edge-layer.conf` + `nginx-snippets.conf` pro Nginx
4. Roda `certbot` pra SSL
5. Sobe apps: `docker compose up -d`

---

## ⚠️ IMPORTANTE

- Todos os templates assumem **stack Tata** (Node + Express + Postgres + Redis + Nginx)
- Pra Python/outros, adapte (a estrutura é a mesma)
- Sempre **substitua** placeholders (APP_NAME, dominio, portas)
- Sempre **valide** envs antes de subir em prod
- Sempre **teste** em dev primeiro
