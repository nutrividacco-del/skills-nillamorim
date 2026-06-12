---
name: nillamorim-arquitetura
description: Aplica os 6 padrões universais de arquitetura (engenharia reversa da Atlassian) em apps Node/TS — sejam apps prontos (modo auditoria), novos (modo projeto novo) ou camada específica (modo refatoração cirúrgica). Calibra recomendações por porte (solo, apps internos, multi-tenant, escala público). Gera diagnóstico, roadmap 30/60/90, código pronto pra colar, decisões com tradeoffs e dashboard HTML. Use quando o usuário pedir "auditar arquitetura do meu app", "projetar app novo do zero com arquitetura boa", "refatorar a camada de auth/fila/edge do meu sistema", "como organizar meus apps na VPS", "minha infra tá virando bagunça", "como deixar pronto pra escalar", "como preparar pra virar multi-tenant", "diagnóstico arquitetural", "edge layer", "control plane", "image as code", "infrastructure as code", "anti-patterns de arquitetura". Método Imperatriz de Arquitetura — propriedade Tata Goncalves.
---

# Arquitetura Imperatriz

> Aplica os 6 padrões universais destilados da edge infrastructure da Atlassian em qualquer projeto Node/TS — pronto ou novo.
> Adapta recomendações pelo porte do negócio (solo, apps internos, multi-tenant, escala público).

---

## 🎯 QUANDO ATIVAR

Ative quando o usuário pedir:
- "auditar arquitetura do meu app"
- "projetar app novo com arquitetura boa"
- "refatorar [camada] do meu sistema" (auth, fila, edge, deploy)
- "como organizar meus apps na VPS"
- "minha infra tá virando bagunça"
- "como preparar pra virar multi-tenant"
- "diagnóstico arquitetural"
- "blueprint técnico"
- "edge layer", "control plane", "image as code", "infrastructure as code", "sidecars"
- "anti-patterns de arquitetura"
- "estou perdendo controle dos meus apps"

---

## 🧠 OS 3 MODOS

Pergunte sempre primeiro: **qual modo?**

### MODO 1 — AUDITORIA (app pronto)
*"Já tenho. Quero saber o que falta."*
→ Leia `modos/1-auditoria.md`

### MODO 2 — PROJETO NOVO (do zero)
*"Vou começar agora. Quero arquitetura que não quebre."*
→ Leia `modos/2-projeto-novo.md`

### MODO 3 — REFATORAÇÃO CIRÚRGICA (camada específica)
*"Quero evoluir só uma parte."*
→ Leia `modos/3-refatoracao-cirurgica.md`

Se o usuário não souber: pergunte se o app **já existe** ou **vai começar**. Se já existe e quer mexer em UMA camada, é Modo 3. Se já existe e quer ver tudo, é Modo 1.

---

## 📋 AS 7 PERGUNTAS OBRIGATÓRIAS (entrevista inicial)

Faça SEMPRE, em qualquer modo, **antes de qualquer recomendação**:

1. **Que app é?** (nome, URL, pasta no Mac)
2. **O que ele faz em 1 frase?**
3. **Quem usa?** (você, seu time, mentoradas, público geral)
4. **Stack atual?** (Node? Python? PM2? Docker? Postgres? SQLite? Redis?)
5. **Quantos usuários simultâneos hoje? E em 12 meses?**
6. **Qual sua dor maior hoje?** (lentidão, custo, bug, escala, refatoração)
7. **Vai virar multi-tenant?** (cada mentorada com instância própria?)

Use as respostas pra calibrar via `frameworks/03-calibrador-por-porte.md`.

---

## 🔧 OS 4 FRAMEWORKS QUE RODAM EM SEQUÊNCIA

1. **DIAGNÓSTICO DOS 6 PADRÕES** → `frameworks/01-diagnostico-6-padroes.md`
   Pra cada padrão (Fila, Control/Data, Templates+Context, Receita Congelada, IaC, Edge), dá nota 0-10 e explica.

2. **5 CAMADAS DA ATLASSIAN ADAPTADAS** → `frameworks/02-5-camadas-atlassian-adaptadas.md`
   Traduz cada camada do estudo Atlassian pra realidade Node + Express + Nginx + Docker da Tata.

3. **CALIBRADOR POR PORTE** → `frameworks/03-calibrador-por-porte.md`
   Decide quais recomendações fazem sentido pro porte (1=Solo Tata, 2=Apps Internos ~8, 3=Multi-Tenant, 4=Escala Público).

4. **PRIORIZADOR ICE** → `frameworks/04-priorizador-ice.md`
   Cada recomendação ganha score Impacto × Confiança × Esforço (1-10 cada). Ordena o roadmap.

---

## 📚 OS 4 PERFIS DE PORTE

A skill **NUNCA** dá recomendação igual pra portes diferentes. Carregue o perfil que combina:

- **Porte 1 — Solo Tata** → `perfis-porte/1-solo-tata.md`
  Apps que só você usa (skills, scripts, dashboards internos)

- **Porte 2 — Apps Internos** → `perfis-porte/2-apps-internos.md`
  ~8 apps na VPS Hostinger, usados por você + time pequeno (esse é o porte da Tata HOJE)

- **Porte 3 — Multi-Tenant** → `perfis-porte/3-multi-tenant.md`
  Cada mentorada/cliente com instância isolada (leadflow-template, App Tarefas template)

- **Porte 4 — Escala Público** → `perfis-porte/4-escala-publico.md`
  ~1000+ usuários/dia, público geral (ex: futuro SaaS público)

---

## 🚨 OS 10 ANTI-PATTERNS QUE A SKILL DETECTA

Leia `anti-patterns/10-anti-patterns.md` e **GRITE** quando ver qualquer um nos apps analisados.

---

## ✅ AS 12 PERGUNTAS-CHAVE QUE A SKILL RESPONDE

Pra cada app analisado, a skill **OBRIGATORIAMENTE** responde as 12 perguntas em `validadores/12-perguntas-chave.md`.

Se você não conseguir responder alguma → pergunte mais ao usuário.

---

## 📦 ESTRUTURA DE ENTREGÁVEIS (saída obrigatória)

Pra CADA execução, crie no vault em `~/Documents/Obsidian Vault/03 - Projetos/Arquitetura-[Nome-do-App]/`:

```
00-Diagnostico.md           # notas 0-10 por padrão + análise
01-Arquitetura-Atual.md     # diagrama Mermaid do que existe
02-Arquitetura-Proposta.md  # diagrama Mermaid do estado-alvo
03-Roadmap-30-60-90.md      # tarefas priorizadas com horas
04-Codigo-Pronto/           # pasta com templates prontos pra colar
05-Decisoes-e-Tradeoffs.md  # por quê de cada decisão
dashboard.html              # visualização interativa
```

Use os templates em `outputs-template/` como ponto de partida.

---

## 🤝 INTEGRAÇÃO COM ARSENAL DA TATA

Sempre que aplicável, **CHAME ou MENCIONE** estas skills:

| Quando | Skill |
|--------|-------|
| Antes de começar, pra entender porte do negócio | `/imperio-diagnostico` (DOMINIO+FRIO+PENTA) |
| Pra detalhar operações (hooks, custos, observabilidade) | `/imperio-infra` (GUARDIAO+PONTE+UNICO+RELOGIO+MOEDA+OLHAR) |
| Pra deploy do código pronto | `/skill-deploy-vps` |
| Pra mapa mental da arquitetura | `/mapa-mental-imperatriz` |
| Pra priorizar roadmap | `/ice-imperatriz` |
| Pra escolher framework de processo (PDCA, OKR, etc) | `/processo-imperatriz` |

**IMPORTANTE:** essa skill é **arquitetural** (decisões de design). A `/imperio-infra` é **operacional** (configurações). Não duplique — complemente.

---

## 🎨 VOZ E ESTILO DA SKILL

### Linguagem
- **SEMPRE Português BR**
- Toda palavra em inglês com **tradução entre parênteses** na primeira aparição
- Use as **analogias do estudo Atlassian** (shopping, padaria, porteiro, receita de bolo, planta de prédio, ajudantes) quando ajudar
- Tom: **estratégico + acessível** — Tata é founder técnica mas não programadora hardcore

### Saídas em 2 níveis
- **Executivo:** Tata lê em 5 minutos, entende o que decidir
- **Técnico:** dev/agência executa sem precisar perguntar

### Validação contra `feedback_skill_quality_standard`
- Fichas completas (não só bullet points)
- Scripts literais nos templates de código (não pseudo-código)
- Integração explícita com ecossistema da Tata
- Salva no vault Obsidian por padrão

---

## 🔁 FLUXO COMPLETO DA SKILL (passo-a-passo)

1. **Pergunte qual modo** (auditoria / projeto novo / refatoração)
2. **Faça as 7 perguntas obrigatórias**
3. **Identifique o porte** (1, 2, 3 ou 4) e carregue o perfil
4. **Aplique os 4 frameworks** em sequência
5. **Detecte anti-patterns**
6. **Responda as 12 perguntas-chave**
7. **Use ICE pra priorizar**
8. **Gere os 6 entregáveis no vault** (00 ao 05 + dashboard)
9. **Mostre resumo executivo** pro usuário
10. **Ofereça próximos passos** (deploy via `/skill-deploy-vps`, mapa mental, etc)

---

## 🧪 CALIBRAÇÃO

Os 3 exemplos calibrados em `exemplos-calibrados/` mostram como a skill se comporta em apps reais da Tata:

- `app-tarefas-imperatriz.md` — porte 2 (apps internos)
- `imperio-multi-agent.md` — porte 3 (multi-tenant)
- `leadflow-template.md` — porte 3 (multi-tenant)

Use como referência pra calibrar respostas.

---

## ⚠️ ARMADILHAS A EVITAR

- **NÃO** dar recomendação de porte 4 pra app de porte 1 (over-engineering)
- **NÃO** ignorar a stack atual ("você deveria usar Kubernetes" — não, isso é pra porte 4+)
- **NÃO** entregar texto sem código pronto pra colar
- **NÃO** misturar diagnóstico com solução (separe em arquivos)
- **NÃO** entregar saída só em inglês — TUDO em PT-BR
- **NÃO** ignorar o arsenal existente — sempre referencie
- **NÃO** pular as 7 perguntas obrigatórias

---

*Método Imperatriz de Arquitetura — propriedade Tata Goncalves.*
*Inspirado na engenharia reversa da edge infrastructure da Atlassian (Vasilios Syrakis, 2026).*
