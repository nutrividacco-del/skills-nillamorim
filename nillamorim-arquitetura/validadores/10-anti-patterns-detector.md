# Detector Automatico de 10 Anti-Patterns

> Checklist a rodar em CADA auditoria.
> Pra cada item, marca ✅ (sem anti-pattern) ou 🔴 (presente).

---

## Como usar

A skill faz **inspecao do codigo + entrevista** pra responder cada item.

### Inspecao do codigo (se tem acesso aos arquivos)
- Le `package.json`, `Dockerfile`, `docker-compose.yml`, `nginx.conf`
- Procura padroes conhecidos via grep
- Lista arquivos em pastas suspeitas (auth, queue, deploy)

### Entrevista (se nao tem acesso)
Pergunta direta ao usuario com perguntas-bait.

---

## Checklist

### Anti-Pattern 1 — Auth Duplicada
**Inspecao:**
- [ ] Procura `bcrypt`/`jwt.sign`/`passport` em multiplos repos
- [ ] Verifica se tem pacote `@imperatriz/middlewares` ou similar

**Entrevista:**
- [ ] "Como cada app valida login? Tem 1 lugar so?"

**Veredito:** 🔴 se cada app tem auth propria

---

### Anti-Pattern 2 — Segredos em .env versionado
**Inspecao:**
- [ ] `git log --all --full-history -- .env` retorna algo?
- [ ] `.gitignore` tem `.env`?

**Entrevista:**
- [ ] "Voce ja commitou .env por engano?"

**Veredito:** 🔴 se ja foi commitado (mesmo deletado depois)

---

### Anti-Pattern 3 — Deploy via git pull
**Inspecao:**
- [ ] Existe `.github/workflows/`?
- [ ] Dockerfile existe?
- [ ] Script de deploy automatizado?

**Entrevista:**
- [ ] "Como voce faz deploy hoje? Me descreve passo a passo."

**Veredito:** 🔴 se a descricao tem "ssh + git pull + pm2"

---

### Anti-Pattern 4 — Worker no mesmo processo do web
**Inspecao:**
- [ ] Procura `setTimeout(...,longo)` ou `await` dentro de handlers HTTP
- [ ] Existe arquivo `worker.js` separado?
- [ ] BullMQ/Bull/Bee instalado?

**Entrevista:**
- [ ] "Tem operacao que demora mais de 5 segundos no app?"
- [ ] "Onde essa operacao roda? Mesmo processo do web server?"

**Veredito:** 🔴 se operacao longa roda no handler HTTP

---

### Anti-Pattern 5 — Fila sem idempotencia
**Inspecao:**
- [ ] Procura `queue.add(` sem `jobId` ou `unique`

**Entrevista:**
- [ ] "Se cliente clicar 2x rapido no botao, gera 2 jobs?"

**Veredito:** 🔴 se gera duplicata

---

### Anti-Pattern 6 — Logs so no PM2
**Inspecao:**
- [ ] `package.json` tem `pino`/`winston`/`bunyan`?
- [ ] Existe diretorio de logs estruturado?
- [ ] Procura `console.log` espalhado

**Entrevista:**
- [ ] "Quando da bug em prod, como voce rastreia?"

**Veredito:** 🔴 se a resposta e "pm2 logs"

---

### Anti-Pattern 7 — Backup nunca testado
**Entrevista:**
- [ ] "Qual foi a ULTIMA vez que voce fez RESTORE de backup?"

**Veredito:** 🔴 se "nunca" ou "ha mais de 6 meses"

---

### Anti-Pattern 8 — SPOF (single point of failure)
**Entrevista:**
- [ ] "Quantas VPS o app usa?"
- [ ] "DB tem replica?"
- [ ] "Backup esta em outra regiao?"

**Veredito:** 🔴 se 1 VPS + 1 DB sem replica + backup so na propria VPS

---

### Anti-Pattern 9 — Vazamento multi-tenant
**Inspecao** (se aplicavel):
- [ ] Postgres usa Row Level Security?
- [ ] Queries filtram por `tenant_id` explicitamente?
- [ ] Tem testes E2E de cross-tenant?

**Entrevista:**
- [ ] "Voce ja testou se um cliente consegue ver dado de outro?"

**Veredito:** 🔴 se nao tem RLS + nao tem testes

---

### Anti-Pattern 10 — Modificacao manual em producao
**Entrevista:**
- [ ] "Voce ja editou um arquivo direto na VPS de producao via SSH?"

**Veredito:** 🔴 se "sim" (mesmo que ha tempo)

---

## 📊 SAIDA OBRIGATORIA

Sempre coloque no `00-Diagnostico.md`:

```markdown
## 🚨 Anti-Patterns Detectados

| # | Anti-Pattern | Status | Risco | Como corrigir |
|---|--------------|--------|-------|---------------|
| 1 | Auth duplicada | 🔴 | Alto | Criar @imperatriz/middlewares |
| 2 | .env versionado | ✅ | — | OK |
| 3 | Deploy git pull | 🔴 | Critico | Migrar pra Docker + GitHub Actions |
| 4 | Worker no web | 🔴 | Alto | Mover pra BullMQ worker |
| 5 | Sem idempotencia | ✅ | — | OK |
| 6 | Logs no PM2 | 🔴 | Medio | Adicionar Pino |
| 7 | Backup nao testado | 🔴 | Critico | Cron mensal de restore |
| 8 | SPOF | 🔴 | Medio | Backup offsite + monitor |
| 9 | Vazamento multi-tenant | N/A | — | Nao aplicavel (single-tenant) |
| 10 | Edicao manual em prod | 🔴 | Medio | Politica zero-touch em prod |
```

**Score de anti-patterns:** N/10
**Se < 7/10:** 🚨 Refatoracao arquitetural urgente
