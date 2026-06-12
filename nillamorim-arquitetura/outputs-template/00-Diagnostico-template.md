---
tipo: arquitetura
app: {APP_NAME}
porte: {PORTE_NUM}
data: {DATA}
modo: {MODO}
score-final: {SCORE}/60
veredito: {VEREDITO}
---

# {APP_NAME} — Diagnostico Arquitetural

> Gerado por `/arquitetura-imperatriz` em {DATA}.

---

## 🎯 IDENTIFICACAO

| Campo | Valor |
|-------|-------|
| **App** | {APP_NAME} |
| **URL/Pasta** | {URL_PASTA} |
| **O que faz** | {DESCRICAO_1_FRASE} |
| **Quem usa** | {QUEM_USA} |
| **Stack atual** | {STACK} |
| **Users hoje** | {USERS_HOJE} |
| **Users esperados em 12m** | {USERS_FUTURO} |
| **Dor atual** | {DOR_ATUAL} |
| **Multi-tenant** | {MULTI_TENANT_SIM_NAO} |
| **Porte identificado** | {PORTE} ({PORTE_NOME}) |

---

## 📊 NOTAS DOS 6 PADROES

| # | Padrao | Nota | Analise |
|---|--------|------|---------|
| 1 | Fila + Aviso | {N1}/10 | {ANALISE_1} |
| 2 | Control/Data Plane | {N2}/10 | {ANALISE_2} |
| 3 | Molde + Dados | {N3}/10 | {ANALISE_3} |
| 4 | Receita Congelada | {N4}/10 | {ANALISE_4} |
| 5 | Planta da Infra | {N5}/10 | {ANALISE_5} |
| 6 | Concentre na Borda | {N6}/10 | {ANALISE_6} |

**Score final ponderado:** {SCORE_FINAL}/60

**Veredito:** {VEREDITO_FRASE}

---

## 🚨 ANTI-PATTERNS DETECTADOS

{TABELA_ANTI_PATTERNS}

**Score anti-patterns:** {N_OK}/10 OK

---

## ✅ 12 PERGUNTAS-CHAVE RESPONDIDAS

### 1. Preciso de fila? Pra que?
{R1}

### 2. Preciso separar control/data plane? Quando?
{R2}

### 3. Que partes da config deveriam ser template + context?
{R3}

### 4. Estou usando Docker corretamente?
{R4}

### 5. Onde mora minha planta de infra hoje?
{R5}

### 6. Que coisas estao duplicadas entre apps?
{R6}

### 7. Onde estao meus SPOFs?
{R7}

### 8. Quanto custaria isso quebrar em prod?
{R8}

### 9. Qual a proxima camada que mais doi?
{R9}

### 10. Quanto tempo ate divida tecnica matar feature velocity?
{R10}

### 11. Se vendesse esse app pra mentorada amanha, o que quebraria?
{R11}

### 12. Que parte aqui e "ouro" pra documentar como autoridade publica?
{R12}

---

## 🎯 RESUMO EXECUTIVO (5 frases)

1. **Veredito geral:** {VEREDITO_RESUMO}
2. **Top 3 forcas:** {FORCAS}
3. **Top 3 fraquezas criticas:** {FRAQUEZAS}
4. **Quick wins (30 dias):** {QUICK_WINS}
5. **Proximo passo concreto:** {PROXIMO_PASSO}

---

## 📚 PROXIMOS DOCUMENTOS

- [[01-Arquitetura-Atual]] — diagrama do que existe
- [[02-Arquitetura-Proposta]] — diagrama do estado-alvo
- [[03-Roadmap-30-60-90]] — plano priorizado
- [[04-Codigo-Pronto/]] — templates customizados
- [[05-Decisoes-e-Tradeoffs]] — por quê de cada decisao
- `dashboard.html` — visualizacao interativa

---

*Gerado por `/arquitetura-imperatriz` — Método Imperatriz de Arquitetura.*
