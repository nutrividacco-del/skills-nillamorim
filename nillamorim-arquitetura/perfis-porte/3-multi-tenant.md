# Perfil de Porte 3 — Multi-Tenant

> SaaS onde cada cliente tem instância e/ou dados isolados.
> 100-1000 users totais. Aqui mora **leadflow-template, App Tarefas template, Imperio Multi-Agent**.

---

## 🎯 QUEM SE ENCAIXA

- Cada cliente/mentorada tem espaço isolado (banco, instância ou schema)
- Você vende/distribui o app pra outras pessoas administrarem
- Vazamento de dados entre tenants = **incidente grave**
- Precisa de onboarding automatizado de novos tenants

**Apps da Tata neste porte:**
- **leadflow-template** — cada mentorada tem fork próprio na VPS dela
- **App Tarefas Imperatriz Template** — fork limpo pras mentoradas
- **login-mentoradas** — bibliotca pra sistema de convite
- **Imperio Multi-Agent** — multi-tenant SaaS
- **Bot Larissa** (futuro) — quando virar produto pras mentoradas

---

## 🧱 STACK RECOMENDADA

| Camada | Ferramenta | Por quê |
|--------|-----------|---------|
| Linguagem | Node.js + TypeScript | Padrão |
| Framework | Express ou Fastify | |
| Banco | **Postgres com schemas por tenant** OU **1 DB por tenant** | Isolamento |
| Cache | **Redis** com namespacing por tenant | |
| Fila | BullMQ com queue por tenant ou shared com tenant_id | |
| Proxy | Nginx + roteamento por subdomain/path por tenant | |
| Container | **Docker** obrigatório | |
| Orquestração | **Docker Compose** ou **Swarm** | Kubernetes só se time aguentar |
| CI/CD | GitHub Actions + deploy automático | |
| Observability | Pino + Loki + Grafana (ou Logtail) | Multi-tenant exige rastreabilidade |
| Secrets | **Vault, Doppler** ou AWS Secrets Manager | `.env` não escala |
| IaC | **Terraform** pra provisionar novo tenant | Automatiza onboarding |

---

## 🧪 OS 6 PADRÕES NO PORTE 3

### Padrão 1 — Fila + Aviso ✅ OBRIGATÓRIO
**Como:** BullMQ com queue por tenant (`queue:tenant_123:emails`) ou shared com `tenant_id` no payload.
**Importante:** **isolamento de quota** — tenant não pode comer recurso do outro.

### Padrão 2 — Control/Data Plane 🔴 OBRIGATÓRIO
**Como:** dashboard admin (você) muda regras → propaga pros tenants em segundos.
**Stack:**
- Tabela `tenant_configs` no Postgres central
- Redis pub/sub avisa mudança
- Apps fazem polling como fallback
- Cache local pra resiliência

### Padrão 3 — Molde + Dados ✅ RECOMENDADO
**Como:** templates de email/relatório/conteúdo por tenant. Tenant customiza variáveis.

### Padrão 4 — Receita Congelada (Docker) 🔴 CRÍTICO
**Como:** mesma imagem Docker roda 100x com `--env TENANT_ID=x`.
**Importante:** imagem precisa ser **imutável e parametrizada**.

### Padrão 5 — Planta da Infra (IaC) 🔴 OBRIGATÓRIO
**Como:**
- **Terraform** pra provisionar VPS nova de cliente em 10 minutos
- Script de onboarding: 1 comando = nova instância pronta
- Backup automático por tenant

### Padrão 6 — Concentre na Borda 🔴 CRÍTICO
**Como:** ainda mais crítico que porte 2.
- **Auth com tenant_id obrigatório** no token (JWT com claim `tenant_id`)
- **Tenant isolation no banco** (RLS - Row Level Security do Postgres)
- **Rate-limit por tenant** (não global)
- **WAF leve** (Cloudflare grátis na frente)

---

## 🏗️ ARQUITETURA-ALVO PARA PORTE 3

### Modelo A — Multi-tenant em 1 instância (econômico)

```
Cloudflare (WAF + DDoS)
   ↓
Nginx (edge layer)
   ├─ Rate-limit por tenant_id
   ├─ Auth (JWT com tenant_id)
   ↓
App único (Express)
   ├─ Middleware extrai tenant_id do JWT
   ├─ Todas queries filtram por tenant_id (Postgres RLS)
   ↓
Postgres com Row Level Security
   └─ Dados isolados por tenant
```

**Pra quem:** Imperio Multi-Agent. Centenas de tenants, 1 instância só.

### Modelo B — Instância dedicada por tenant (premium)

```
Cliente A:
   tenant-a.imperio.com → VPS dedicada do cliente
   └─ Docker Compose com: app + Postgres + Redis (todos isolados)

Cliente B:
   tenant-b.imperio.com → VPS dedicada
   └─ ... etc
```

**Pra quem:** leadflow-template, App Tarefas template. Cada mentorada tem VPS própria.

### Modelo C — Híbrido
- Cliente free → multi-tenant compartilhado (Modelo A)
- Cliente paid → instância dedicada (Modelo B)

---

## ⚠️ ARMADILHAS COMUNS NO PORTE 3

### Armadilha 1: Vazamento de dados entre tenants
Sintomas: cliente A vê dado do cliente B. **INCIDENTE CRÍTICO.**
**Solução:** Row Level Security do Postgres + testes E2E que validam isolamento.

### Armadilha 2: Quota não isolada
Sintomas: tenant A roda job pesado, tenant B fica lento.
**Solução:** rate-limit por tenant_id + workers isolados + monitoring por tenant.

### Armadilha 3: Onboarding manual
Sintomas: você gasta 2h por mentorada nova.
**Solução:** Terraform + script `provision-tenant.sh` que faz tudo.

### Armadilha 4: Sem painel admin
Sintomas: pra mudar config de 1 tenant, você precisa abrir SSH na VPS dele.
**Solução:** dashboard admin centralizado (control plane).

### Armadilha 5: Versão diferente por tenant
Sintomas: cliente A na v1.2, B na v1.5. Bug que afeta só A.
**Solução:** rolling update obrigatório. Todos os tenants na mesma versão (ou +1 atrás).

---

## 📦 CHECKLIST MÍNIMO DE QUALIDADE

### Por tenant
- [ ] Banco/schema isolado
- [ ] Quotas (storage, CPU, requests/min)
- [ ] Backup automático individual
- [ ] Health monitoring individual
- [ ] Painel admin pra você controlar do alto

### Globalmente
- [ ] Onboarding automatizado (1 comando)
- [ ] Offboarding seguro (exportar + apagar dados)
- [ ] Compliance LGPD (consent, direito ao esquecimento)
- [ ] SLA documentado (mesmo que 99%)
- [ ] Plano de incidente (o que fazer quando vaza)

---

## 🚀 QUANDO ESCALAR PRA PORTE 4

Migre pra perfil 4 quando:
- Tem 1000+ users/dia ativos
- Receita do produto justifica time dedicado
- Precisa de multi-region (latência global)
- Precisa de SLA 99.9%+ formal

**Próxima leitura:** [4-escala-publico.md](4-escala-publico.md)
