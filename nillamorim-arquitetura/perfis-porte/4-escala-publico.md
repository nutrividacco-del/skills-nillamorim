# Perfil de Porte 4 — Escala Público

> Produto público com 1000+ users/dia. Receita justifica time dedicado.
> SLA 99.9%+. Disponibilidade global.

---

## 🎯 QUEM SE ENCAIXA

- App público, qualquer um se cadastra
- > 1000 users/dia ativos
- Receita do produto > custo do time de infra
- Latência global importa (usuários no mundo todo)
- Downtime de 1h custa $$$

**Apps da Tata neste porte:** **NENHUM AINDA.**
**Quando seria:** se o O Que Vender virar produto público com tracking de uso por usuário, ou se a Imersão virar SaaS público (não só pra mentoradas).

---

## 🧱 STACK RECOMENDADA

| Camada | Ferramenta | Por quê |
|--------|-----------|---------|
| Linguagem | Node.js + TS ou Go | Go pra hot paths críticos |
| Framework | Fastify (mais perf que Express) | |
| Banco | Postgres + read replicas + PgBouncer | Escala horizontal |
| Cache | Redis Cluster | |
| Fila | BullMQ + Redis Cluster | |
| Proxy | **Cloudflare** (CDN + WAF + DDoS) + Nginx | |
| Container | Docker | |
| Orquestração | **Kubernetes** (k8s) ou Docker Swarm | Pra HA |
| CI/CD | GitHub Actions + ArgoCD (GitOps) | |
| Observability | OpenTelemetry + Prometheus + Grafana + Loki | |
| Secrets | Vault | |
| IaC | Terraform multi-region | |
| Search | Elasticsearch ou Meilisearch | |
| Email | SendGrid/Postmark com domain reputation | |

---

## 🧪 OS 6 PADRÕES NO PORTE 4

Aqui **TODOS** os padrões são **CRÍTICOS**. Não tem espaço pra cortar canto.

### Padrão 1 — Fila + Aviso
- Múltiplos workers em múltiplas máquinas
- Dead letter queue
- Retry exponential backoff
- Idempotência absoluta

### Padrão 2 — Control/Data Plane
- etcd / Consul real
- Feature flags com LaunchDarkly/Unleash
- Config rollout gradual (canary deploys)

### Padrão 3 — Molde + Dados
- Templates versionados + A/B testing
- Personalização por segmento de usuário

### Padrão 4 — Receita Congelada
- Image registry privado
- Blue/green deployments
- Rollback automático em < 30s

### Padrão 5 — Planta da Infra
- Terraform multi-region
- GitOps com ArgoCD
- Disaster recovery testado mensalmente

### Padrão 6 — Concentre na Borda
- Cloudflare WAF + DDoS protection
- Edge functions (Workers/Lambda@Edge)
- mTLS interno
- Zero-trust networking

---

## 🏗️ ARQUITETURA-ALVO PARA PORTE 4

```
Usuário no Brasil → Cloudflare PoP São Paulo
Usuário em Tóquio → Cloudflare PoP Tóquio
   ↓
Cloudflare:
   ├─ WAF + bot protection
   ├─ DDoS protection
   ├─ Edge cache
   ├─ Edge functions (lógica leve)
   ↓
Load balancer regional (k8s ingress)
   ↓
Pods (auto-scaling)
   ├─ App pods (replica 5-50)
   ├─ Worker pods (replica 2-20)
   ├─ Cron pods
   ↓
Bancos:
   ├─ Postgres primary + 3 read replicas + PgBouncer
   ├─ Redis Cluster (6 nodes mínimo)
   ├─ Elasticsearch cluster
   ↓
Observability:
   ├─ OpenTelemetry → Tempo (traces)
   ├─ Pino → Loki (logs)
   ├─ Métricas → Prometheus → Grafana
   └─ Alertas → PagerDuty
```

---

## ⚠️ ARMADILHAS NO PORTE 4

### Armadilha 1: Time pequeno demais
**Regra:** porte 4 exige no mínimo 1 SRE/DevOps + 2 backend + 1 QA. Sem isso, vai dar problema grave.

### Armadilha 2: Kubernetes prematuro
K8s sem time SRE = caos. Comece com Swarm/ECS, migre quando time crescer.

### Armadilha 3: Sem observability proativa
"A gente vê o problema quando o cliente reclama." Não. Tem que ver ANTES.

### Armadilha 4: Single-region
Latência ruim pra metade do mundo. Multi-region ou CDN agressivo é obrigatório.

### Armadilha 5: Sem chaos engineering
Sistema "funciona" até falhar 1 dependência. Teste falhas regularmente (Netflix-style).

---

## 💰 CUSTO ESPERADO

Pra ter ideia de escala:

| Componente | Custo/mês (USD) |
|-----------|-----------------|
| Cloudflare Pro/Business | $20 - $200 |
| VPS/k8s (3-10 nodes) | $200 - $2000 |
| Postgres managed (RDS/equivalent) | $100 - $1000 |
| Redis managed | $50 - $500 |
| Observability stack | $50 - $500 |
| Logs (Loki/Logtail) | $30 - $300 |
| Secrets manager | $10 - $50 |
| **Total** | **$460 - $4550/mês** |

Se sua receita não comporta isso, **VOLTE PRO PORTE 3.**

---

## ⛔ AVISO IMPORTANTE

Se você é founder solo ou time pequeno (< 5 devs) — **NÃO TENTE ESCALAR DIRETO PRO PORTE 4.**

Faça assim:
1. Valide produto em porte 1
2. Adicione clientes pagantes em porte 2
3. Vire SaaS em porte 3
4. **SÓ ENTÃO** considere porte 4 (e provavelmente já tem time de 5+ devs)

A maioria dos negócios viáveis vive feliz em porte 2 ou 3 pra sempre.

---

## 🎯 RECADO PRA TATA

Você **NÃO ESTÁ AQUI** e provavelmente não precisa estar nos próximos 24 meses.

Se a Mentoria Imperio IA virar SaaS público com 1000+ alunas pagando mensalidade ativas, aí sim revisite porte 4.

Até lá, foca em fazer porte 2 perfeito e migrar pra porte 3 quando começar a vender apps pras mentoradas.
