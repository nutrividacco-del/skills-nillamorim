# Modo 2 — Projeto Novo (do Zero)

> "Vou começar agora. Quero arquitetura que não quebre."

---

## 🎯 QUANDO USAR

- App ainda não existe
- Tem briefing claro do que vai fazer
- Quer começar bem (sem refatoração futura dolorosa)
- Quer aproveitar templates prontos da Tata

---

## 📋 PASSO-A-PASSO

### Passo 1 — As 7 perguntas obrigatórias

Adapte pra projeto novo:
1. **Que app vai ser?** (nome provisório)
2. **O que ele vai fazer em 1 frase?**
3. **Quem vai usar?** (você, time, mentoradas, público)
4. **Stack preferida?** (Node + Express é padrão Tata)
5. **Quantos users esperados em 3 meses? E em 12?**
6. **Qual a dor que ele resolve?**
7. **Vai ser multi-tenant?**

Adicione **3 perguntas específicas do modo projeto novo:**
8. **Tem alguma feature que demora (> 3s)?** (IA, transcrição, upload pesado)
9. **Vai integrar com quais sistemas externos?** (WhatsApp, Gemini, Stripe, etc)
10. **Tem prazo apertado?** (MVP em X semanas?)

### Passo 2 — Identificar porte-alvo
Use `frameworks/03-calibrador-por-porte.md`. Carregue o perfil correspondente.

**IMPORTANTE:** considere a evolução. Se vai sair de porte 2 pra 3 em 6 meses, prepara terreno.

### Passo 3 — Desenhar arquitetura-alvo

Use o template do perfil de porte. Customize com:
- Stack específica
- Componentes obrigatórios pra esse caso
- Componentes opcionais (com "ativar se" condicional)

### Passo 4 — Mapear features → camadas

Pra cada feature do app, identifique qual camada precisa:

| Feature | Camada principal | Camadas auxiliares |
|---------|------------------|---------------------|
| Login | 5 (Sidecars - auth) | 6 (Edge - rate-limit) |
| Upload de áudio | 1 (Queue) | 4 (Image as Code - worker) |
| Webhook do WhatsApp | 5 (auth com signature) | 1 (queue pra processar) |
| Dashboard analytics | 6 (Edge - cache) | — |
| ... | | |

### Passo 5 — Gerar esqueleto do projeto

Crie estrutura de pastas pronta:

```
[nome-app]/
├── README.md
├── package.json
├── tsconfig.json
├── .gitignore
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── docker-compose.dev.yml
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── server.ts (entrypoint)
│   ├── config.ts
│   ├── routes/
│   ├── middlewares/
│   ├── services/
│   ├── workers/
│   ├── utils/
│   └── types/
├── prisma/ (se usar Postgres)
│   └── schema.prisma
├── nginx/
│   └── default.conf
├── scripts/
│   ├── setup-dev.sh
│   └── deploy.sh
└── docs/
    ├── ARCHITECTURE.md
    └── DEPLOY.md
```

### Passo 6 — Customizar templates

Pegue dos `templates-codigo/`:
- Dockerfile padrão Node
- docker-compose com Postgres + Redis
- middlewares (auth + log + ratelimit)
- BullMQ setup (se tiver feature longa)
- Nginx edge layer
- GitHub Actions
- Healthcheck

Customize **com nome do app, porte, features identificadas**.

### Passo 7 — Documentar decisões

Pra cada decisão arquitetural, escreva no `05-Decisoes-e-Tradeoffs.md`:
- **Decisão:** o que decidi
- **Alternativas consideradas:** quais outras opções
- **Por quê esta:** justificativa
- **Quando revisitar:** condição que faria mudar

### Passo 8 — Roadmap de implementação

Use `frameworks/04-priorizador-ice.md` pra ordenar:
- **Sprint 0:** setup (1 semana) — repo, Docker, CI, deploy básico
- **Sprint 1:** MVP funcional sem features avançadas
- **Sprint 2-N:** features

### Passo 9 — Gerar entregáveis no vault

Crie pasta `~/Documents/Obsidian Vault/03 - Projetos/Arquitetura-[Nome-App]/` com:
- `00-Briefing-Inicial.md` (substitui Diagnóstico no modo projeto novo)
- `01-Esqueleto-Pastas.md`
- `02-Arquitetura-Proposta.md` (com Mermaid)
- `03-Roadmap-Implementacao.md`
- `04-Codigo-Pronto/` (templates customizados)
- `05-Decisoes-e-Tradeoffs.md`
- `dashboard.html`

### Passo 10 — Pergunte se quer scaffolding

Ofereça:
- "Quer que eu crie a pasta do projeto e copie os templates pra lá?" → criar
- "Quer que eu rode `npm init` + instale dependências?" → setup
- "Quer que eu faça `git init` + primeiro commit?" → init repo
- "Quer publicar no GitHub?" → criar repo

---

## 📦 ENTREGÁVEIS OBRIGATÓRIOS

Igual ao modo auditoria, exceto:
- `00-Diagnostico.md` → vira `00-Briefing-Inicial.md`
- `01-Arquitetura-Atual.md` → vira `01-Esqueleto-Pastas.md`

---

## 🎯 EXEMPLO DE EXECUÇÃO

```
USUÁRIO: /arquitetura-imperatriz projeto novo: app pra mentoradas
agendarem stories no Instagram

SKILL:
> Vou te ajudar a projetar isso desde o início.
> Primeiro, 10 perguntas.

[... entrevista ...]

SKILL:
> 🎯 Identificado:
> - Porte 3 (Multi-Tenant) já desde início, pois cada mentorada
>   tem conta IG própria
> - Features longas: upload de vídeo, geração de thumb
> - Integrações: Instagram Graph API, Gemini (legendas auto)
> - Prazo: MVP em 6 semanas
> 
> ARQUITETURA PROPOSTA:
> [diagrama Mermaid]
> 
> Esqueleto criado em ~/Documents/agendador-stories/
> Templates customizados copiados em src/middlewares/
> 
> ROADMAP:
> - Sprint 0 (semana 1): setup completo
> - Sprint 1 (semana 2-3): auth Instagram + upload pra storage
> - Sprint 2 (semana 4): scheduler + worker que posta
> - Sprint 3 (semana 5-6): dashboard + analytics
> 
> Quer que eu rode npm init e instale dependências?
```
