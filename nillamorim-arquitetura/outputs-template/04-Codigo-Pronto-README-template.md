# Codigo Pronto — {APP_NAME}

> Templates customizados pra esse app especifico.
> Cada arquivo foi adaptado com nome do app, portas, dominio e dependencias reais.

---

## 📦 ARQUIVOS NESSA PASTA

| Arquivo | O que faz | Onde colocar |
|---------|-----------|--------------|
| `Dockerfile` | Container do app | Root do projeto |
| `docker-compose.yml` | Orquestracao local + prod | Root do projeto |
| `nginx-{app}.conf` | Config Nginx desse app | `/etc/nginx/sites-available/` |
| `.github/workflows/deploy.yml` | CI/CD | Root do projeto |
| `src/middlewares/auth.js` | Auth JWT | `src/middlewares/` |
| `src/middlewares/ratelimit.js` | Rate-limit | `src/middlewares/` |
| `src/middlewares/logger.js` | Pino logger | `src/middlewares/` |
| `src/queues/{nome}.js` | BullMQ queue | `src/queues/` |
| `src/utils/env.js` | Validacao envs | `src/utils/` |
| `src/routes/health.js` | Endpoint /health | `src/routes/` |
| `.env.example` | Template de envs | Root |
| `.dockerignore` | Ignora no build | Root |

---

## 🚀 COMO USAR

### Passo 1: Copia tudo pra pasta do app
```bash
cp -r 04-Codigo-Pronto/. ~/Documents/{APP_NAME}/
```

### Passo 2: Revisa cada arquivo
**IMPORTANTE:** templates tem placeholders. Procura por `{...}` e substitui.

### Passo 3: Instala dependencias novas
```bash
cd ~/Documents/{APP_NAME}
npm install jsonwebtoken express-rate-limit rate-limit-redis ioredis pino pino-http nanoid bullmq zod
npm install -D pino-pretty
```

### Passo 4: Builda Docker
```bash
docker build -t {app-name}:latest .
docker run -p 3000:3000 --env-file .env {app-name}:latest
```

### Passo 5: Testa local
```bash
curl http://localhost:3000/health
curl http://localhost:3000/health/deep
```

### Passo 6: Deploy (via GitHub Actions)
```bash
git add .
git commit -m "feat: arquitetura imperatriz aplicada"
git push origin main
# GitHub Actions builda + deploya
```

---

## ⚠️ ATENCAO

- **Nao copie tudo de uma vez** se o app ja esta em producao
- **Implemente em paralelo:** novo codigo coexiste com velho ate validar
- **Feature flag:** ative novo codigo so pra voce primeiro
- **Backup primeiro:** antes de qualquer mudanca em prod

---

## 🆘 SE ALGO DER ERRADO

1. **Rollback rapido:** `docker compose down && docker compose up -d --no-build`
2. **Logs:** `docker compose logs -f {app-name}`
3. **Healthcheck:** `curl https://{dominio}/health/deep`

---

## 📚 VOLTA PRA

- [[../00-Diagnostico]]
- [[../02-Arquitetura-Proposta]]
- [[../03-Roadmap-30-60-90]]
