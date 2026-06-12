# Perfil de Porte 2 — Apps Internos

> ⭐ **Este é o porte da Tata HOJE.** ~8 apps na VPS Hostinger, usados pela Tata + time + mentoradas via Tata.
> < 100 users/dia, criticidade média (se cair, mentoradas reclamam).

---

## 🎯 QUEM SE ENCAIXA

- Você tem 2-15 apps relacionados
- Usuários são você + time pequeno (2-10 pessoas) + alguns clientes via login simples
- Apps dividem mesma VPS / mesma rede
- Sem SLA formal mas se cair > 1 dia, complica
- Não vai virar produto público nos próximos 12 meses

**Apps da Tata neste porte:**
- Marketing Command
- App Tarefas Imperatriz (single-user, mas via WhatsApp public)
- Mapa do Potencial
- O Que Vender
- Glossário da Tata (público mas baixo tráfego)
- Skill Edição Vídeo site
- Página Imersão Maio 26
- Vault / Obsidian sync interno

---

## 🧱 STACK RECOMENDADA

| Camada | Ferramenta | Por quê |
|--------|-----------|---------|
| Linguagem | **Node.js + TypeScript** | Padrão Tata |
| Framework | **Express** (ou **Fastify** se quiser mais perf) | |
| Banco | **Postgres** (1 instance, schemas por app) ou **SQLite** por app | Postgres se precisar JOINs cross-app |
| Cache | **Redis** | Compartilhado entre apps |
| Fila | **BullMQ + Redis** | Substitui setTimeout |
| Proxy | **Nginx central** (1 só) | Roteamento + SSL + rate-limit |
| Container | **Docker + docker-compose** | Por app |
| Process | **PM2** dentro do container ou Docker restart | |
| CI/CD | **GitHub Actions** simples (build + ssh deploy) | |
| Observability | **Pino** (logger estruturado) + arquivos rotacionados | |
| Secrets | `.env` (não versionado) + cópia no Obsidian vault | Vault completo só no porte 3+ |

---

## 🧪 OS 6 PADRÕES NO PORTE 2

### Padrão 1 — Fila + Aviso ✅ OBRIGATÓRIO
**Como:** BullMQ + Redis. Workers separados do web server.
**Por quê:** mentorada manda áudio no WhatsApp, espera resposta. Se travar, ruim.
**Template:** `templates-codigo/queue-bullmq-setup.js`

### Padrão 2 — Control/Data Plane ⚠️ OPCIONAL
**Aplicar?** Só se mais de 4 apps usam configs parecidas (tom de voz, prompts IA, etc).
**Como:** tabela `app_configs` no Postgres + apps fazem polling a cada 5min.

### Padrão 3 — Molde + Dados ✅ RECOMENDADO
**Aplicar?** Pra geração de relatórios, emails, conteúdo IA.
**Como:** Handlebars + templates versionados no Git.

### Padrão 4 — Receita Congelada (Docker) 🔴 CRÍTICO
**Aplicar?** SIM, urgentemente. Sair do `git pull + pm2 restart`.
**Como:** Dockerfile por app + docker-compose central.
**Template:** `templates-codigo/dockerfile-padrao-node.dockerfile`

### Padrão 5 — Planta da Infra ✅ OBRIGATÓRIO
**Aplicar?** Sim.
**Como:** docker-compose + Nginx config versionados no Git + script `setup-vps.sh`.

### Padrão 6 — Concentre na Borda 🔴 CRÍTICO
**Aplicar?** SIM. Este é o maior ganho pra Tata.
**Como:**
- Pacote interno `@imperatriz/middlewares` com:
  - Auth (JWT compartilhado)
  - Rate-limit
  - Logger com correlation ID
  - Error handler unificado
- Nginx central com:
  - SSL único (wildcard cert)
  - Rate-limit por zona
  - Headers de segurança padronizados
  - Logs agregados

**Template:** `templates-codigo/nginx-edge-layer.conf` + 3 middlewares

---

## 🏗️ ARQUITETURA-ALVO PARA PORTE 2

```
Internet
   ↓
Nginx (edge layer)
   ├─ SSL termination
   ├─ Rate-limit
   ├─ Headers de segurança
   ├─ Logs agregados
   ↓
Roteamento por subdomain:
   ├─ tarefas.mentoriaimperioia.com → container app-tarefas
   ├─ comando.iacomtata.com.br → container marketing-command
   ├─ ... (cada app em container Docker)
   ↓
Cada container Express usa @imperatriz/middlewares:
   ├─ auth (JWT compartilhado)
   ├─ logger (Pino + correlation ID)
   ├─ ratelimit (defesa em camadas)
   ↓
Bancos compartilhados:
   ├─ Postgres (1 instance, schemas por app)
   ├─ Redis (cache + BullMQ)
   ↓
Worker pool:
   └─ BullMQ workers (separados do web)
```

---

## ⚠️ ARMADILHAS COMUNS NO PORTE 2

### Armadilha 1: Cada app com auth próprio
Sintomas: 8 apps, 8 jeitos diferentes de login, mentorada precisa logar 8 vezes.
**Solução:** middleware central + JWT compartilhado.

### Armadilha 2: Deploy via `git pull` + `pm2 restart`
Sintomas: deploy quebra produção, dev e prod desalinhados, impossível reverter.
**Solução:** Docker + GitHub Actions.

### Armadilha 3: Logs espalhados
Sintomas: bug em algum app, você não sabe onde foi. PM2 logs misturados.
**Solução:** Pino + arquivo por app + agregador opcional (Loki).

### Armadilha 4: Secrets no `.env` versionado
Sintomas: você commitou `.env` por engano, credenciais expostas no GitHub.
**Solução:** `.gitignore` rigoroso + secrets só no Obsidian vault.

### Armadilha 5: Sem backup testado
Sintomas: VPS pega fogo, você tem backup mas nunca testou restore. Não funciona.
**Solução:** backup automático + teste de restore mensal.

---

## 📦 CHECKLIST MÍNIMO DE QUALIDADE

### Por app
- [ ] `Dockerfile` versionado e build em CI
- [ ] `docker-compose.yml` com env vars documentadas
- [ ] `README.md` com setup + deploy + troubleshooting
- [ ] `.env.example` completo
- [ ] Usa `@imperatriz/middlewares` (não reimplementa auth/log/rate)
- [ ] Healthcheck endpoint (`/health`)
- [ ] Logs estruturados (Pino, JSON)

### Na infra
- [ ] Nginx config no Git
- [ ] SSL com wildcard cert (renovação automática)
- [ ] Rate-limit configurado no Nginx
- [ ] Backup automático Postgres + Redis
- [ ] Backup automático testado mensalmente
- [ ] Monitoramento (UptimeRobot ou similar)

### Por padrão
- [ ] GitHub Actions roda em todo push: build + tests
- [ ] Deploy em produção via tag/release (não em push pra main)

---

## 🚀 QUANDO ESCALAR PRA PORTE 3

Migre pra perfil 3 quando:
- Mentorada vai TER instância própria (não só usar a sua)
- Você vai vender VPS individual pra cliente
- Precisa de tenant isolation (dados de uma mentorada não podem misturar com outra)
- Precisa de Single Sign-On entre apps DE clientes diferentes

**Próxima leitura:** [3-multi-tenant.md](3-multi-tenant.md)

---

## 🎯 PRIORIDADES PARA TATA AGORA

Em ordem de impacto (ICE):

1. 🔴 **Edge Layer no Nginx** — pacote `@imperatriz/middlewares` (Padrão 6)
2. 🔴 **Docker pros 8 apps** — fim do `git pull` em prod (Padrão 4)
3. 🟠 **BullMQ no App Tarefas** — se ainda não tem (Padrão 1)
4. 🟠 **GitHub Actions CI** — deploy automatizado (Padrão 5)
5. 🟡 **Pino logger central** — observability básica (Bônus)
