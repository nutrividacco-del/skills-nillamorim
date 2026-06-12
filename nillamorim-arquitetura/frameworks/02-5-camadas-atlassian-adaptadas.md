# Framework 2 — 5 Camadas da Atlassian Adaptadas

> Traduz cada camada do estudo Atlassian pra realidade da Tata (Node + Express + Nginx + Docker + Hostinger VPS).
> Cada camada tem: o que é, quando aplicar, stack recomendada, anti-patterns.

---

## CAMADA 1 — Provisionamento Async (Open Service Broker)

### Versão Atlassian
Open Service Broker → FastAPI + SQS + Worker + DynamoDB. Provisiona load balancers.

### Versão Tata
Sistema que recebe pedidos demorados, responde rápido, processa em background.

### Stack adaptada por porte

| Porte | Stack |
|-------|-------|
| 1 (Solo) | `setImmediate` / `setTimeout` no Node — sem fila |
| 2 (Apps Internos) | **BullMQ + Redis** (recomendado) ou SQLite queue |
| 3 (Multi-Tenant) | BullMQ + Redis dedicado por tenant ou queue compartilhada com tenant_id |
| 4 (Escala Público) | BullMQ + Redis Cluster + workers em múltiplas máquinas |

### Quando aplicar
- Operação > 3 segundos (transcrição, geração IA, envio de email em massa, processamento de upload)
- Operação que pode falhar e precisa de retry
- Operação que pode ser duplicada se cliente clicar 2x

### Quando NÃO aplicar
- Operações instantâneas (< 500ms)
- Apps de leitura simples (dashboards estáticos)
- Quando o cliente PRECISA da resposta na hora (login, validação)

### Template de código
`templates-codigo/queue-bullmq-setup.js`

### Anti-patterns
- ❌ Processar áudio do WhatsApp no handler HTTP (timeout do request)
- ❌ Fila sem dead letter queue (tarefas que falham 5x somem)
- ❌ Worker sem idempotência (retry duplica)

### Aplicação no portfólio Tata
- ✅ **App Tarefas Imperatriz** — áudio WhatsApp → fila → Gemini transcreve
- ✅ **Marketing Command** — gerar relatório longo → fila → email com link
- ❓ **Imperio Multi-Agent** — chamadas a múltiplos modelos LLM (vale fila pra paralelizar)

---

## CAMADA 2 — Control Plane + Data Plane (Envoy + Sovereign)

### Versão Atlassian
Sovereign (central de instruções, FastAPI) + 2000 Envoy proxies (data plane). Mudança de config propaga em segundos.

### Versão Tata
Dashboard admin (Tata muda configs) → apps em produção (mentoradas usam). Apps fazem polling ou recebem push.

### Stack adaptada por porte

| Porte | Stack |
|-------|-------|
| 1 (Solo) | Arquivo `config.json` no disco — apps releem ao receber sinal SIGHUP |
| 2 (Apps Internos) | Tabela `app_configs` no SQLite/Postgres central + apps fazem polling a cada 5min |
| 3 (Multi-Tenant) | Tabela `tenant_configs` por tenant + Redis pub/sub avisa mudança em tempo real |
| 4 (Escala Público) | etcd / Consul / Sovereign-like custom |

### Quando aplicar
- Tem > 2 apps com regras parecidas que mudam juntas
- Quer mudar regra sem fazer deploy de N apps
- Quer auditar mudanças de regra (log de quem alterou o quê)

### Quando NÃO aplicar
- App único e isolado
- Regras imutáveis (lógica de negócio raramente muda)

### Template
`templates-codigo/control-plane-polling.js`

### Anti-patterns
- ❌ Sem cache local — se control plane cair, app trava
- ❌ Polling muito rápido (< 30s) — sobrecarrega banco central
- ❌ Sem versionamento das configs (impossível auditar/reverter)

### Aplicação no portfólio Tata
- ⚠️ **Mentoria multi-tenant** — quando você quiser mudar o tom dos bots de todas as mentoradas, precisa disso
- ⚠️ **Imperio Multi-Agent** — qual modelo/prompt usar por tenant
- ❌ **App Tarefas / Mapa do Potencial** — single-user, não precisa

---

## CAMADA 3 — Image as Code (AMI / Docker)

### Versão Atlassian
Packer constrói imagem AMI com tudo dentro (Envoy + agentes + sidecars). 2000 EC2s clonam da AMI. Servidor nunca é modificado em produção.

### Versão Tata
Cada app vira **container Docker** com tudo dentro. Deploy = subir novo container, matar velho. Zero alteração manual no servidor.

### Stack adaptada por porte

| Porte | Stack |
|-------|-------|
| 1 (Solo) | Dockerfile + build local |
| 2 (Apps Internos) | Dockerfile por app + docker-compose central + build em CI (GitHub Actions) |
| 3 (Multi-Tenant) | Mesma imagem rodando 10x com `--env TENANT_ID=x` |
| 4 (Escala Público) | Imagem + registry privado + rolling deploy |

### Quando aplicar
**SEMPRE.** Não tem desculpa pra não usar Docker em 2026.

### Template
`templates-codigo/dockerfile-padrao-node.dockerfile`
`templates-codigo/docker-compose-multi-app.yml`

### Anti-patterns
- ❌ `git pull && pm2 restart` — anti-pattern clássico, sem isolamento
- ❌ Modificar arquivos diretamente no servidor (SSH + nano)
- ❌ Imagem que não roda em dev = não roda em prod
- ❌ Dockerfile sem `.dockerignore` (imagens gigantes)
- ❌ Secrets no Dockerfile (build sem `--build-arg` corretamente)

### Aplicação no portfólio Tata
- ⚠️ **Todos os 8 apps na VPS** — hoje rodam direto via PM2. Vale migrar.
- ✅ **Evolution API** — já roda em Docker
- ✅ **leadflow-template** — já tem Dockerfile

---

## CAMADA 4 — Infrastructure as Code (CloudFormation / Terraform)

### Versão Atlassian
CloudFormation descreve TODA a infra (VPC, subnets, EC2s, NLB, Route 53) num arquivo. 1 comando provisiona em 13 regiões.

### Versão Tata
Toda config de Nginx + PM2 + Docker no Git. Pra recriar a VPS do zero, basta clonar repo e rodar 1 script.

### Stack adaptada por porte

| Porte | Stack |
|-------|-------|
| 1 (Solo) | `docker-compose.yml` no Git |
| 2 (Apps Internos) | docker-compose + config Nginx no Git + script `setup.sh` que faz tudo |
| 3 (Multi-Tenant) | Terraform pra provisionar VPS nova de cada cliente |
| 4 (Escala Público) | Terraform + Ansible + Vault pra secrets + multi-region |

### Quando aplicar
- Tem mais de 1 servidor pra gerenciar
- Quer poder reconstruir a infra em < 1 hora se VPS pegar fogo
- Quer auditar quem mudou o quê

### Template
`templates-codigo/setup-vps-from-scratch.sh`

### Anti-patterns
- ❌ Config Nginx só na VPS (não versionada)
- ❌ Setup manual da VPS (sem script)
- ❌ Backup configurado mas nunca testado restore
- ❌ Secrets no `.env` versionado (vazamento)

### Aplicação no portfólio Tata
- ⚠️ Tata tem hoje: docker-compose pra alguns apps, mas não pra TODOS
- ⚠️ Nginx tá versionado? Parcialmente (no /etc/nginx/sites-enabled)
- 🟢 Quando virar 10+ mentoradas com VPS própria → Terraform vira obrigatório

---

## CAMADA 5 — Sidecars / Middlewares (Auth + Authz + Rate-limit)

### Versão Atlassian
Cada Envoy roda com 3 containers vizinhos: auth (Rust), authz, rate-limit. Cada um é independente.

### Versão Tata
Cada app Express usa middlewares centrais compartilhados. Mesmas funções de auth/log/rate-limit em todos.

### Stack adaptada por porte

| Porte | Stack |
|-------|-------|
| 1 (Solo) | Middleware Express simples por app |
| 2 (Apps Internos) | **Pacote NPM interno** (`@imperatriz/middlewares`) com auth + log + rate-limit |
| 3 (Multi-Tenant) | Mesmo pacote + tenant isolation (auth com tenant_id) |
| 4 (Escala Público) | Sidecars de verdade (containers separados) + WAF |

### Quando aplicar
- Tem 2+ apps com mesmas necessidades de auth/log/rate-limit

### Templates
- `templates-codigo/express-middleware-auth.js`
- `templates-codigo/express-middleware-ratelimit.js`
- `templates-codigo/express-middleware-logger.js`

### Anti-patterns
- ❌ Auth implementada do zero em cada app (copy/paste com bugs)
- ❌ Rate-limit só no app (deveria ter no Nginx também — defesa em camadas)
- ❌ Logger sem correlation ID (impossível rastrear request entre apps)

### Aplicação no portfólio Tata
- 🔴 **CRÍTICO** — você tem 8 apps. Cada um implementa auth do jeito dele. Vale criar pacote interno.
- 🟡 Rate-limit hoje provavelmente nem existe — vale adicionar no Nginx

---

## 📐 BÔNUS — A 6ª CAMADA INVISÍVEL: OBSERVABILIDADE

> Não estava explicitamente no estudo Atlassian, mas o Vasilios menciona "logging + observability agents" na AMI.

### O que é
**Saber o que tá acontecendo nos seus apps** — antes do problema aparecer.

### 3 pilares
1. **Logs** — texto que descreve eventos
2. **Métricas** — números agregados (requests/seg, latência, erros)
3. **Traces** — caminho de 1 request entre múltiplos apps

### Stack adaptada por porte

| Porte | Stack |
|-------|-------|
| 1 (Solo) | `console.log` + PM2 logs |
| 2 (Apps Internos) | **Pino** (logger estruturado) + arquivos rotacionados |
| 3 (Multi-Tenant) | Pino + envio pra Loki/Logtail + métricas Prometheus |
| 4 (Escala Público) | Tudo acima + traces OpenTelemetry + Grafana |

### Integração
Ver `/imperio-infra` pra detalhes operacionais (framework OLHAR).

---

## 📊 TABELA RESUMO — QUE CAMADAS APLICAR POR PORTE

| Camada | Porte 1 | Porte 2 | Porte 3 | Porte 4 |
|--------|---------|---------|---------|---------|
| 1 - Provisionamento Async | Opcional | Recomendado | Obrigatório | Crítico |
| 2 - Control/Data Plane | Não | Opcional | Obrigatório | Crítico |
| 3 - Image as Code | Recomendado | Obrigatório | Obrigatório | Crítico |
| 4 - Infra as Code | Opcional | Recomendado | Obrigatório | Crítico |
| 5 - Sidecars/Middlewares | Opcional | Crítico | Obrigatório | Crítico |
| 6 - Observabilidade | Mínimo | Recomendado | Obrigatório | Crítico |

**Legenda:**
- **Crítico** = sem isso, não funciona
- **Obrigatório** = sem isso, vai dar problema em 6 meses
- **Recomendado** = vale o esforço, retorno alto
- **Opcional** = só se sobrar tempo/orçamento
- **Não/Mínimo** = ignore por enquanto
