# Framework 4 — Priorizador ICE

> Cada recomendação ganha score Impacto × Confiança × Esforço.
> Ordena o roadmap pra Tata fazer o que mais retorna primeiro.

---

## 🎯 O QUE É ICE

**I**mpact × **C**onfidence × **E**ase (1-10 cada)

- **Impacto:** quanto isso melhora o app/negócio? (1=zero, 10=transformador)
- **Confiança:** quanto você tem certeza que vai funcionar? (1=chute, 10=garantido)
- **Esforço:** quão fácil é fazer? **INVERTIDO** — 10=trivial, 1=enorme

**Score = Impacto × Confiança × Ease** (max 1000)

---

## 📊 COMO PONTUAR CADA DIMENSÃO

### IMPACTO (1-10)
| Pontuação | Critério |
|-----------|----------|
| 10 | Resolve dor crítica atual + destrava receita futura |
| 8-9 | Resolve dor crítica atual OU destrava receita futura |
| 6-7 | Melhora muito a manutenção/velocidade de feature |
| 4-5 | Melhora qualidade técnica mas usuário não sente |
| 1-3 | Refinamento marginal |

### CONFIANÇA (1-10)
| Pontuação | Critério |
|-----------|----------|
| 10 | Tata/time já fez antes, sabe que funciona |
| 8-9 | Padrão validado no mercado + algum exemplo dela |
| 6-7 | Padrão conhecido, dela é a primeira vez |
| 4-5 | Padrão emergente, alto risco |
| 1-3 | Especulação |

### EASE (1-10) — INVERTIDO
| Pontuação | Critério |
|-----------|----------|
| 10 | Trivial — < 1h, código quase pronto |
| 8-9 | Fácil — 1-4h |
| 6-7 | Médio — 1-2 dias |
| 4-5 | Difícil — 1-2 semanas |
| 1-3 | Muito difícil — 1+ mês |

---

## 🚀 INTERPRETAÇÃO DO SCORE

| Score | Veredito | Quando fazer |
|-------|----------|--------------|
| 700-1000 | 🟢 Quick Win | Faça AGORA (sprint atual) |
| 400-699 | 🟡 Bom investimento | Próximo sprint (2-4 semanas) |
| 200-399 | 🟠 Vale planejar | Trimestre que vem |
| 0-199 | 🔴 Não vale | Coloca em "considerações futuras" |

---

## 📋 TEMPLATE DE TABELA ICE

A skill SEMPRE gera essa tabela no arquivo `03-Roadmap-30-60-90.md`:

```markdown
| # | Recomendação | I | C | E | Score | Sprint |
|---|--------------|---|---|---|-------|--------|
| 1 | Adicionar idempotência no worker BullMQ | 9 | 9 | 9 | 729 | Agora |
| 2 | Migrar auth pra middleware central | 10 | 9 | 6 | 540 | +30 dias |
| 3 | Dockerfile + docker-compose pros 8 apps | 9 | 9 | 5 | 405 | +30 dias |
| 4 | GitHub Actions pra CI/CD | 7 | 8 | 6 | 336 | +60 dias |
| 5 | Terraform pra provisionar VPS de mentorada | 8 | 6 | 3 | 144 | Considerações futuras |
```

---

## 🗓️ ROADMAP 30/60/90

Pra cada janela, agrupe as recomendações:

### Sprint Atual (próximos 30 dias)
- Quick wins (score > 700)
- Bloqueadores críticos (Impacto 10 mesmo com score < 700)

### Próximo Sprint (30-60 dias)
- Bom investimento (score 400-699)
- Preparação pra evolução de porte

### Trimestre que vem (60-90 dias)
- Vale planejar (score 200-399)
- Refatoração estrutural

### Considerações futuras (> 90 dias)
- Score < 200
- Depende de evolução do negócio

---

## ⚠️ REGRAS DE OURO

### 1. Bloqueadores críticos ignoram score
Se algo está QUEBRANDO em produção (Impacto 10, Confiança 10) — faça AGORA, não importa o esforço.

### 2. Não empacote tudo no mesmo sprint
Max 3-5 tarefas grandes por sprint. Senão Tata vai paralisar.

### 3. Quick wins sempre primeiro
Mesmo que tenha algo "mais importante", quick wins criam momentum.

### 4. Considere dependências
Se A precisa de B feito antes, force a ordem (mesmo que ICE diga o contrário).

### 5. Reavalie ICE depois de cada sprint
Score muda com aprendizado. Reordene roadmap a cada 30 dias.

---

## 🔗 INTEGRAÇÃO COM /ice-imperatriz

Se a Tata já usa `/ice-imperatriz`, mencione e ofereça delegar a priorização pra essa skill especializada. Use os mesmos critérios pra manter consistência.

---

## 📝 SAÍDA OBRIGATÓRIA

No arquivo `03-Roadmap-30-60-90.md`, sempre inclua:

1. **Tabela ICE completa** (com todas as recomendações pontuadas)
2. **Resumo por sprint** (o que cabe em cada janela)
3. **Quick wins destacados** (top 3)
4. **Dependências entre tarefas** (qual bloqueia qual)
5. **Riscos** (o que pode dar errado em cada sprint)
6. **Critérios de sucesso** (como saber que cada item foi entregue)
