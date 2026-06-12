---
tipo: arquitetura
parte: atual
app: {APP_NAME}
---

# {APP_NAME} — Arquitetura ATUAL

> O que existe HOJE. Sem julgamento, so observacao.

---

## 🗺️ DIAGRAMA

```mermaid
graph TB
    {DIAGRAMA_MERMAID}
```

---

## 🧱 COMPONENTES ATUAIS

### Frontend
- {DETALHES_FRONTEND}

### Backend
- {DETALHES_BACKEND}

### Banco de Dados
- {DETALHES_DB}

### Cache / Fila
- {DETALHES_CACHE_FILA}

### Proxy / Edge
- {DETALHES_PROXY}

### CI/CD
- {DETALHES_CICD}

### Observabilidade
- {DETALHES_OBS}

---

## 🔌 INTEGRACOES EXTERNAS

| Servico | Pra que | Critico? |
|---------|---------|----------|
| {SERVICO_1} | {USO_1} | {CRITICIDADE_1} |

---

## 💥 PONTOS UNICOS DE FALHA (SPOFs)

| # | SPOF | Risco | Impacto se cair |
|---|------|-------|------------------|
| 1 | {SPOF_1} | {RISCO_1} | {IMPACTO_1} |

---

## 🐛 DIVIDAS TECNICAS CONHECIDAS

1. {DIVIDA_1}
2. {DIVIDA_2}
3. {DIVIDA_3}

---

## 📍 ONDE TUDO ESTA

| Recurso | Localizacao |
|---------|-------------|
| Codigo | {LOCALIZACAO_CODIGO} |
| Config | {LOCALIZACAO_CONFIG} |
| Logs | {LOCALIZACAO_LOGS} |
| Backups | {LOCALIZACAO_BACKUPS} |
| Secrets | {LOCALIZACAO_SECRETS} |

---

## 📚 CONTINUA EM

- [[00-Diagnostico]]
- [[02-Arquitetura-Proposta]] — proximo passo
