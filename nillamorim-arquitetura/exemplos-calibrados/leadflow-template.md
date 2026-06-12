# Exemplo Calibrado — Leadflow Template

> Auditoria de exemplo de template self-hosted multi-tenant (porte 3 modelo B).

---

## 🎯 IDENTIFICACAO

- **App:** Leadflow Template
- **Pasta:** ~/Documents/leadflow-template/
- **Repo:** github.com/tatagoncalvesof/leadflow-template (privado)
- **Funcao:** CRM self-hosted pra mentoradas terem instancia propria
- **Stack:** Node + Express + (provavelmente Postgres) + Docker + Evolution + Cloud API + IG + Email
- **Modelo multi-tenant:** **B** (instancia dedicada por cliente)
- **Status atual:** Fase 0+1A completas; 1B-5 pendentes (~10k linhas pra portar)
- **Porte:** 3 (Multi-Tenant, modelo B)

---

## 📊 DIAGNOSTICO DOS 6 PADROES

**ATENCAO:** template em construcao. Diagnostico baseado no que estiver pronto + plano.

| # | Padrao | Nota | Justificativa |
|---|--------|------|---------------|
| 1 | Fila + Aviso | 5/10 | Necessario pra emails em lote + sync IG; checar se ja implementado |
| 2 | Control/Data Plane | 7/10 | Nao precisa — cada cliente e isolado (modelo B) |
| 3 | Molde + Dados | 7/10 | Templates de email essenciais aqui |
| 4 | Receita Congelada | 9/10 | Dockerizado desde o inicio (validar) |
| 5 | Planta da Infra | 8/10 | docker-compose existe; script de instalacao OK |
| 6 | Concentre na Borda | 6/10 | Cada instancia tem sua propria edge |

**Score (porte 3 modelo B):** 70/100 = 🟡 **RAZOAVEL** mas com pendencias

---

## 🚨 ANTI-PATTERNS DETECTADOS

| # | Anti-Pattern | Status | Risco |
|---|--------------|--------|-------|
| 1 | Auth duplicada (cada instancia tem propria) | ✅ | Aceitavel no modelo B |
| 7 | Backup nao testado | ⚠️ | **CRITICO** — cada mentorada precisa de backup automatico |
| 8 | SPOF (1 VPS por cliente) | ⚠️ | Aceitavel no modelo B mas educar mentoradas |

---

## 🚀 ROADMAP 30/60/90

### Sprint Atual (30 dias) — Completar template
| # | Tarefa | Score |
|---|--------|-------|
| 1 | Portar 10k linhas restantes (Fases 1B-5) | — (depende, estimar separado) |
| 2 | Script `install.sh` zero-touch (testar em VPS limpa) | 720 |
| 3 | Backup automatico embutido (cron + rclone pra Google Drive) | 700 |
| 4 | Docker image pre-built no Docker Hub | 540 |

### Proximo Sprint (30-60 dias)
| # | Tarefa | Score |
|---|--------|-------|
| 5 | Documentacao de onboarding pra mentorada (sem precisar Tata) | 504 |
| 6 | Healthcheck + auto-restart configurado | 432 |
| 7 | Quota interna (LLM, Evolution, email) | 384 |

### Trimestre (60-90 dias)
| # | Tarefa | Score |
|---|--------|-------|
| 8 | Marketplace de templates de funil dentro do app | 324 |
| 9 | Integracao com Mapa do Potencial + outros apps Tata | 288 |
| 10 | Sistema de update remoto (Tata empurra patch pras instancias) | 252 |

---

## 💡 INSIGHTS PRA TATA

### 🟢 Pontos fortes
- Modelo B (instancia dedicada) **MATA** o risco #1 do multi-tenant (vazamento entre clientes)
- Cada mentorada e ISOLADA — bug em 1 nao afeta outras
- Boa hist'oria de venda ("seu CRM, sua VPS, seus dados")

### 🔴 Riscos
- **Suporte e mais caro.** Cada mentorada com VPS dela = voce vai resolver bug 8x.
- **Update remoto e dificil.** Como empurra patch pra todas as instancias rodando?
- **Custo da mentorada.** VPS basica Hostinger = R$50/mes. Cabe no ticket?

### 🎯 Decisao critica
**Tata, escolha:**
- A) **Self-hosted puro** (mentorada hospeda) — mais barato pra voce, mais trabalhoso pra mentorada
- B) **Self-hosted managed** (mentorada paga voce pra hospedar) — receita recorrente pra voce, simples pra ela

### 🛠️ Sugestoes especificas
1. **Atomic deploys:** mesma imagem Docker em todas as instancias. Tata pode subir versao nova num comando.
2. **Telemetria opt-in:** mentorada autoriza enviar metricas anonimas pra Tata melhorar o produto.
3. **Documentacao por video:** mentorada media nao sabe SSH. Video passo a passo.

---

## 🔗 INTEGRACAO COM ARSENAL

- Use `/skill-deploy-vps` pra empacotar deploy
- Use `/skill-claude-md-builder` pra fazer CLAUDE.md do template
- Padrao similar ao **App Tarefas Imperatriz Template** e ao **login-mentoradas**
- Quando completar, virou estudo de caso pra `/linha-editorial-imperatriz`

---

## ⚠️ CALIBRACAO

Este e o **TEMPLATE-MODELO** pros futuros produtos self-hosted da Tata. As decisoes aqui viram **padrao** pros proximos (App Tarefas template, bot Larissa template, etc).

Por isso, **invista em qualidade arquitetural aqui** — o ROI se multiplica em cada novo produto que herdar.
