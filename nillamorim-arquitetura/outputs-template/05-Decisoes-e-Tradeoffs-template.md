---
tipo: decisoes
app: {APP_NAME}
---

# {APP_NAME} — Decisoes e Tradeoffs

> Por que escolhi X em vez de Y. Pra Tata revisitar em 6 meses sem esquecer o porque.

---

## 🧭 DECISOES PRINCIPAIS

### Decisao 1: {NOME_DECISAO_1}

**O que decidimos:** {DECISAO_1}

**Alternativas consideradas:**
- {ALT_1A}
- {ALT_1B}
- {ALT_1C}

**Por que essa:** {JUSTIFICATIVA_1}

**Quando revisitar:** {QUANDO_REVISITAR_1}

**Custo se mudar dps:** {CUSTO_MUDAR_1}

---

### Decisao 2: {NOME_DECISAO_2}

**O que decidimos:** {DECISAO_2}

**Alternativas consideradas:** {ALTS_2}

**Por que essa:** {JUSTIFICATIVA_2}

**Quando revisitar:** {QUANDO_REVISITAR_2}

---

### Decisao 3: {NOME_DECISAO_3}

[Repete formato]

---

## 🚫 O QUE FICOU DE FORA (e por que)

### Nao incluimos: {ITEM_1}
**Por que:** {RAZAO_1}
**Quando reconsiderar:** {QUANDO_1}

### Nao incluimos: {ITEM_2}
**Por que:** {RAZAO_2}
**Quando reconsiderar:** {QUANDO_2}

---

## 🔮 CONSIDERACOES FUTURAS (> 90 dias)

### Se {CONDICAO_1} acontecer:
- {ACAO_1}

### Se {CONDICAO_2} acontecer:
- {ACAO_2}

---

## 📊 TRADEOFFS ASSUMIDOS

| Tradeoff | Escolhemos | Sacrificamos | Tolerancia ate |
|----------|-----------|--------------|----------------|
| Velocidade vs Robustez | Velocidade | Robustez | 1000 users/dia |
| Custo vs Performance | Custo | Performance | latencia > 1s |
| Simplicidade vs Flexibilidade | Simplicidade | Flexibilidade | 5 features novas |

---

## 🎯 PRINCIPIOS QUE GUIARAM AS DECISOES

1. **Calibrar pelo porte atual, preparar pra proximo.** Nao over-engineer.
2. **Reusar arsenal da Tata.** Sempre que possivel, integrar com skills existentes.
3. **PT-BR sempre.** Nada em ingles na infra/codigo Tata sem traducao.
4. **Anti-pattern e bloqueador.** Nada vai pra prod com anti-pattern critico.
5. **Documentar o porque, nao so o que.** Codigo conta o que. Decisoes contam o porque.

---

## 📚 VOLTA PRA

- [[00-Diagnostico]]
- [[02-Arquitetura-Proposta]]
- [[03-Roadmap-30-60-90]]
