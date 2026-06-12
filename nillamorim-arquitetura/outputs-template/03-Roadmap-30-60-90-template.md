---
tipo: roadmap
app: {APP_NAME}
horizonte: 90 dias
---

# {APP_NAME} — Roadmap 30/60/90

> Plano priorizado por ICE (Impacto × Confianca × Ease).

---

## 📊 TABELA ICE COMPLETA

| # | Recomendacao | Camada | I | C | E | Score | Sprint |
|---|--------------|--------|---|---|---|-------|--------|
| 1 | {REC_1} | {CAMADA_1} | {I1} | {C1} | {E1} | {S1} | {SPRINT_1} |
| 2 | {REC_2} | {CAMADA_2} | {I2} | {C2} | {E2} | {S2} | {SPRINT_2} |
| 3 | {REC_3} | {CAMADA_3} | {I3} | {C3} | {E3} | {S3} | {SPRINT_3} |
| ... | ... | ... | ... | ... | ... | ... | ... |

---

## 🚀 SPRINT ATUAL (proximos 30 dias)

### Quick Wins
{LISTA_QUICK_WINS}

### Bloqueadores Criticos (mesmo se nao for quick win)
{LISTA_BLOQUEADORES}

### Total estimado: {HORAS_SPRINT_1} horas

---

## 🟡 PROXIMO SPRINT (30-60 dias)

{ITENS_SPRINT_2}

### Total estimado: {HORAS_SPRINT_2} horas

---

## 🟠 TRIMESTRE QUE VEM (60-90 dias)

{ITENS_SPRINT_3}

### Total estimado: {HORAS_SPRINT_3} horas

---

## 🔮 CONSIDERACOES FUTURAS (> 90 dias)

{ITENS_FUTURO}

---

## 🔗 DEPENDENCIAS ENTRE TAREFAS

```mermaid
graph LR
    {DIAGRAMA_DEPS}
```

---

## ⚠️ RISCOS POR SPRINT

### Sprint 1
- {RISCO_S1}

### Sprint 2
- {RISCO_S2}

### Sprint 3
- {RISCO_S3}

---

## ✅ CRITERIOS DE SUCESSO POR TAREFA

| Tarefa | Como sei que ficou pronto |
|--------|-----------------------------|
| {TAREFA_1} | {CRITERIO_1} |
| {TAREFA_2} | {CRITERIO_2} |
| {TAREFA_3} | {CRITERIO_3} |

---

## 📅 REAVALIE EM

Daqui a 30 dias, rode `/arquitetura-imperatriz` modo auditoria de novo pra:
- Verificar quais itens fechou
- Reordenar com base no aprendizado
- Detectar novos anti-patterns que surgiram

---

## 📚 CONTINUA EM

- [[02-Arquitetura-Proposta]]
- `04-Codigo-Pronto/` — templates pra implementar
- [[05-Decisoes-e-Tradeoffs]]
