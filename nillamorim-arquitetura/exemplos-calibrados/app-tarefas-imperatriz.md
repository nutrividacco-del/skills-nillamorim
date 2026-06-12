# Exemplo Calibrado — App Tarefas Imperatriz

> Auditoria de exemplo do **App Tarefas** (porte 2).
> Use como referencia pra calibrar a skill em apps similares.

---

## 🎯 IDENTIFICACAO

- **App:** App Tarefas Imperatriz
- **URL:** tarefas.mentoriaimperioia.com
- **Pasta:** /var/www/apps/app-tarefas-imperatriz/
- **Funcao:** Mentorada manda audio no WhatsApp → vira tarefa no dashboard
- **Stack:** Node + Express + SQLite + Evolution API + Gemini + PM2 (porta 3920)
- **Users:** Tata + mentoradas com login (imperio2026)
- **Porte:** 2 (Apps Internos)

---

## 📊 DIAGNOSTICO DOS 6 PADROES

| # | Padrao | Nota | Justificativa |
|---|--------|------|---------------|
| 1 | Fila + Aviso | 7/10 | Tem processamento async, mas pode estar sem idempotencia |
| 2 | Control/Data Plane | 3/10 | Config hardcoded no codigo; sem dashboard pra mudar |
| 3 | Molde + Dados | 5/10 | Resposta IA via template basico, mas nao versionado |
| 4 | Receita Congelada | 4/10 | Sem Dockerfile; deploy via git pull + PM2 |
| 5 | Planta da Infra | 5/10 | Nginx config OK; sem docker-compose; sem CI/CD |
| 6 | Concentre na Borda | 5/10 | Login proprio; sem rate-limit central |

**Score ponderado (porte 2):** 47/100 = 🟠 **FRAGIL** (divida tecnica em ~6 meses)

---

## 🚨 ANTI-PATTERNS DETECTADOS

| # | Anti-Pattern | Status | Acao |
|---|--------------|--------|------|
| 1 | Auth duplicada | 🔴 | Migrar pra @imperatriz/middlewares |
| 3 | Deploy git pull | 🔴 | Dockerfile + GitHub Actions |
| 4 | Worker no web | ⚠️ | Verificar se transcribe e async |
| 6 | Logs no PM2 | 🔴 | Adicionar Pino |
| 11 | Sem rate-limit | 🔴 | Limitar webhook do Evolution |

---

## 🚀 ROADMAP 30/60/90

### Sprint Atual (30 dias)
| # | Tarefa | I | C | E | Score |
|---|--------|---|---|---|-------|
| 1 | Rate-limit no Nginx (Evolution webhook) | 9 | 9 | 9 | 729 |
| 2 | Dockerizar app | 8 | 9 | 7 | 504 |
| 3 | Backup automatico do SQLite | 9 | 10 | 8 | 720 |

### Proximo Sprint (30-60 dias)
| # | Tarefa | I | C | E | Score |
|---|--------|---|---|---|-------|
| 4 | Migrar auth pra @imperatriz/middlewares | 9 | 8 | 6 | 432 |
| 5 | Pino + logs estruturados | 7 | 9 | 7 | 441 |
| 6 | GitHub Actions CI/CD | 8 | 8 | 6 | 384 |

### Trimestre (60-90 dias)
| # | Tarefa | Score |
|---|--------|-------|
| 7 | Verificar idempotencia da fila (se nao tem) | 320 |
| 8 | Healthcheck endpoint + UptimeRobot | 270 |

---

## 📦 ENTREGAVEIS QUE A SKILL GERARIA

Pasta: `~/Documents/Obsidian Vault/03 - Projetos/Arquitetura-App-Tarefas/`

- `00-Diagnostico.md` (este conteudo expandido)
- `01-Arquitetura-Atual.md`:
  ```mermaid
  graph LR
    WhatsApp -->|webhook| Evolution
    Evolution -->|HTTP| AppNode
    AppNode -->|sync, BLOQUEIA| Gemini
    AppNode -->|save| SQLite
    Dashboard -->|HTTP| AppNode
  ```
- `02-Arquitetura-Proposta.md`:
  ```mermaid
  graph LR
    WhatsApp -->|webhook| Nginx
    Nginx -->|rate-limit| Evolution
    Evolution -->|HTTP| AppNode
    AppNode -->|enqueue| BullMQ
    BullMQ -->|async| Worker
    Worker -->|HTTP| Gemini
    Worker -->|save| Postgres
    Dashboard -->|@imperatriz/middlewares auth| AppNode
  ```
- `03-Roadmap-30-60-90.md` (tabela ICE acima)
- `04-Codigo-Pronto/`:
  - `Dockerfile` (customizado pra app-tarefas)
  - `docker-compose.yml`
  - `.github/workflows/deploy.yml`
  - `src/middlewares/auth.js`
  - `src/queues/audio-transcribe.js`
- `05-Decisoes-e-Tradeoffs.md`
- `dashboard.html`

---

## 💡 INSIGHTS PRA TATA

1. **Rate-limit e o quick-win.** Evolution webhook nao deveria aceitar > 5 audios/min do mesmo usuario.
2. **Dockerizar agora vale.** Voce ja tem 3 anti-patterns relacionados (deploy, modificacao manual, logs). Docker mata todos juntos.
3. **Backup do SQLite é critico.** Hoje voce tem? Quando foi a ultima vez que testou restore?
4. **Quando virar template pras mentoradas (porte 3),** vai ter que mover pra Postgres + multi-tenant. Comece preparando agora.

---

## 🔗 INTEGRACAO COM ARSENAL

- Use `/skill-deploy-vps` pra implementar Dockerfile + deploy
- Use `/imperio-infra` pra setup de observabilidade (Pino + UptimeRobot)
- Use `/ice-imperatriz` pra refinar priorizacao
- Use `/mapa-mental-imperatriz` pra visualizar arquitetura nova
