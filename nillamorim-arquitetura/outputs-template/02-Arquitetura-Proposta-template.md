---
tipo: arquitetura
parte: proposta
app: {APP_NAME}
porte-alvo: {PORTE_ALVO}
---

# {APP_NAME} — Arquitetura PROPOSTA

> Estado-alvo. Para onde estamos indo.

---

## 🗺️ DIAGRAMA-ALVO

```mermaid
graph TB
    {DIAGRAMA_MERMAID_ALVO}
```

**Legenda de mudancas:**
- 🟢 verde = novo/melhorado
- 🟡 amarelo = sem mudanca
- 🔴 vermelho = removido

---

## 🆕 O QUE MUDA

### Adicoes
1. **{ADICAO_1_NOME}** — {ADICAO_1_PORQUE}
2. **{ADICAO_2_NOME}** — {ADICAO_2_PORQUE}

### Modificacoes
1. **{MOD_1_NOME}** — de `{ANTES}` pra `{DEPOIS}` porque {PORQUE}

### Remocoes
1. **{REMOCAO_1}** — removido porque {PORQUE}

---

## 🧱 STACK-ALVO

| Camada | Atual | Alvo | Justificativa |
|--------|-------|------|---------------|
| Frontend | {ATUAL_FE} | {ALVO_FE} | {JUST_FE} |
| Backend | {ATUAL_BE} | {ALVO_BE} | {JUST_BE} |
| Banco | {ATUAL_DB} | {ALVO_DB} | {JUST_DB} |
| Cache | {ATUAL_CACHE} | {ALVO_CACHE} | {JUST_CACHE} |
| Fila | {ATUAL_FILA} | {ALVO_FILA} | {JUST_FILA} |
| Proxy | {ATUAL_PROXY} | {ALVO_PROXY} | {JUST_PROXY} |
| Container | {ATUAL_CONT} | {ALVO_CONT} | {JUST_CONT} |
| CI/CD | {ATUAL_CICD} | {ALVO_CICD} | {JUST_CICD} |
| Observ. | {ATUAL_OBS} | {ALVO_OBS} | {JUST_OBS} |

---

## 🔄 SEQUENCIA DE MIGRACAO

**NAO troque tudo de uma vez.** Ordem sugerida:

### Fase 1 (Semana 1-2)
- {FASE_1}
- **Validacao:** {VALIDACAO_1}

### Fase 2 (Semana 3-4)
- {FASE_2}
- **Validacao:** {VALIDACAO_2}

### Fase 3 (Semana 5-8)
- {FASE_3}
- **Validacao:** {VALIDACAO_3}

---

## ⚠️ RISCOS DA MIGRACAO

1. **{RISCO_1_NOME}** — Mitigacao: {MITIGACAO_1}
2. **{RISCO_2_NOME}** — Mitigacao: {MITIGACAO_2}

---

## ✅ CRITERIOS DE SUCESSO

Migracao esta completa quando:
- [ ] {CRITERIO_1}
- [ ] {CRITERIO_2}
- [ ] {CRITERIO_3}

---

## 📚 CONTINUA EM

- [[01-Arquitetura-Atual]]
- [[03-Roadmap-30-60-90]] — proximo passo
