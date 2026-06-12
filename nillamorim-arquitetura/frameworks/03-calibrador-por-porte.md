# Framework 3 — Calibrador por Porte

> Decide qual perfil de porte aplicar com base nas respostas das 7 perguntas obrigatórias.
> Carrega o perfil correto e ajusta TODAS as recomendações.

---

## 🎯 OS 4 PORTES

| Porte | Quem | Apps típicos | Escala | Stack-alvo |
|-------|------|--------------|--------|------------|
| **1 — Solo** | Founder solo, dev solo | Dashboards internos, scripts, skills | < 10 users/dia (só você) | Node/Express + SQLite + PM2 |
| **2 — Apps Internos** | Time pequeno (2-10 pessoas) | Apps de produtividade, ferramentas internas | < 100 users/dia | Node/Express + Postgres + PM2 + Nginx central |
| **3 — Multi-Tenant** | SaaS com clientes isolados | Cada cliente tem instância/dados separados | < 1000 users totais | Docker por tenant + Postgres com schemas + Redis |
| **4 — Escala Público** | Produto público | App público, marketplace, plataforma | 1000+ users/dia | Containers + Kubernetes-light (Docker Swarm) + multi-region |

---

## 🔍 CHECKLIST DE IDENTIFICAÇÃO

Use as respostas das 7 perguntas obrigatórias pra decidir.

### Indicadores Porte 1 — Solo
- ✅ Resposta 3: "só eu uso"
- ✅ Resposta 5: < 10 users hoje
- ✅ Resposta 7: "não vai virar multi-tenant"

### Indicadores Porte 2 — Apps Internos (você está aqui hoje, Tata)
- ✅ Resposta 3: "eu + meu time + mentoradas via mim"
- ✅ Resposta 5: 10-100 users hoje, 100-500 em 12 meses
- ✅ Resposta 4: stack já é Node + PM2 + Nginx + VPS
- ✅ Resposta 7: "talvez, futuramente"

### Indicadores Porte 3 — Multi-Tenant
- ✅ Resposta 3: "mentoradas/clientes têm acesso direto"
- ✅ Resposta 5: 100-1000 users hoje
- ✅ Resposta 7: "SIM, cada cliente com instância própria"
- ✅ Resposta 4: já usa Docker

### Indicadores Porte 4 — Escala Público
- ✅ Resposta 3: "público geral, qualquer um pode se cadastrar"
- ✅ Resposta 5: 1000+ users/dia projetado
- ✅ Resposta 6: "performance, custo de infra, downtime"
- ✅ Resposta 7: "já é multi-tenant em produção"

---

## ⚠️ ANTI-PADRÕES DE CALIBRAÇÃO

### Erro 1: Over-engineering (recomendar porte alto pra app porte baixo)
**Exemplo:** "você deveria usar Kubernetes" pra um dashboard interno que só você usa.
**Por quê é ruim:** complexidade desnecessária, manutenção cara, curva de aprendizado.

### Erro 2: Under-engineering (recomendar porte baixo pra app porte alto)
**Exemplo:** "use SQLite" pra um SaaS com 500 tenants.
**Por quê é ruim:** vai quebrar em 3 meses, refatoração será dolorosa.

### Erro 3: Ignorar evolução
**Exemplo:** app hoje é porte 2 mas vai virar porte 3 em 6 meses → não recomendar Docker hoje.
**Por quê é ruim:** vai ter que refatorar mais cedo. Vale preparar terreno.

### Regra de ouro
**Recomende stack do porte ATUAL, mas com hooks pra evoluir pro próximo porte.**

Exemplo: Tata está em porte 2 hoje, vai pra 3 em 12 meses → recomende Docker (porte 2) já preparado pra multi-tenant (porte 3 fácil).

---

## 🎨 COMO AJUSTAR RECOMENDAÇÕES POR PORTE

Pra cada recomendação técnica, a skill aplica este filtro:

### Pergunta 1: Esse padrão é crítico/obrigatório pra esse porte?
- **SIM** → entra no roadmap como prioridade alta
- **NÃO** → vai pra "considerações futuras" no documento de decisões

### Pergunta 2: A ferramenta sugerida combina com esse porte?
- Use a tabela do Framework 2 (que stack por porte)
- Não sugira Kubernetes pra porte 1
- Não sugira `setTimeout` pra porte 4

### Pergunta 3: O esforço cabe no porte?
- Porte 1: max 1 dia por recomendação
- Porte 2: max 1 semana
- Porte 3: max 1 mês
- Porte 4: max 1 trimestre

---

## 📋 TEMPLATE DE OUTPUT DA CALIBRAÇÃO

Logo após as 7 perguntas, gere:

```markdown
## 🎯 Calibração do App

**App:** [nome]
**Porte identificado:** [1, 2, 3 ou 4] — [Solo / Apps Internos / Multi-Tenant / Escala Público]
**Justificativa:** [1 parágrafo explicando por que escolheu esse porte]
**Evolução esperada:** [vai pro porte X em Y meses? ou vai ficar nesse?]

**Stack-alvo recomendada pra esse porte:**
- Linguagem: [...]
- Framework: [...]
- Banco: [...]
- Processo: [...]
- Proxy: [...]
- Container: [...]
- CI/CD: [...]
- Observabilidade: [...]
```

---

## 🔗 PERFIS DETALHADOS

Carregue o perfil correspondente:

- [perfis-porte/1-solo-tata.md](../perfis-porte/1-solo-tata.md)
- [perfis-porte/2-apps-internos.md](../perfis-porte/2-apps-internos.md)
- [perfis-porte/3-multi-tenant.md](../perfis-porte/3-multi-tenant.md)
- [perfis-porte/4-escala-publico.md](../perfis-porte/4-escala-publico.md)
