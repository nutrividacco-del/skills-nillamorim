# 🏛️ Arquitetura Imperatriz

> Skill que aplica os **6 padrões universais** de arquitetura destilados da edge infrastructure da Atlassian — em **qualquer projeto Node.js/TypeScript**.
>
> Sirva pra apps **prontos** (modo auditoria), **novos** (modo projeto novo) ou **camada específica** (modo refatoração cirúrgica).

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PT-BR](https://img.shields.io/badge/lang-pt--br-green.svg)]()

---

## 🎯 O QUE FAZ

Diagnostica seu app contra **6 padrões universais** + **5 camadas técnicas adaptadas**, calibra por **porte** (solo, apps internos, multi-tenant, escala público), prioriza ações via **ICE** e entrega:

- ✅ Diagnóstico arquitetural completo
- ✅ Diagrama Mermaid do **atual** vs **proposta**
- ✅ Roadmap 30/60/90 priorizado
- ✅ **Código pronto pra colar** (Dockerfile, middlewares, Nginx, GitHub Actions)
- ✅ Dashboard HTML interativo
- ✅ Decisões e tradeoffs documentados

---

## 🧠 OS 6 PADRÕES UNIVERSAIS

1. **FILA + AVISO** — operações longas vão pra fila assíncrona
2. **CONTROLE vs EXECUÇÃO** — separar quem manda ordens de quem executa
3. **MOLDE + DADOS** — templates simples geram configs complexas
4. **RECEITA CONGELADA** — servidor imutável (Docker/AMI)
5. **PLANTA DA INFRA** — Infrastructure as Code
6. **CONCENTRE NA BORDA** — auth/log/rate-limit centralizado no proxy

(Destilados do vídeo *"I was laid off by Atlassian"* de Vasilios Syrakis)

---

## 🏗️ INSTALAÇÃO

### Pré-requisito
[Claude Code](https://docs.claude.com/claude-code) instalado.

### Instalar
```bash
git clone https://github.com/tatagoncalvesof/skill-arquitetura-imperatriz.git \
  ~/.claude/skills/arquitetura-imperatriz
```

Pronto. A skill já fica disponível no Claude Code.

---

## 🚀 COMO USAR

### Modo 1 — Auditoria (app pronto)
```
/arquitetura-imperatriz auditar meu app X
```
A skill faz 7 perguntas, diagnostica os 6 padrões, detecta anti-patterns, e entrega roadmap + código pronto.

### Modo 2 — Projeto Novo (do zero)
```
/arquitetura-imperatriz projeto novo: app que faz Y
```
A skill propõe arquitetura ideal calibrada pelo porte esperado, cria esqueleto de pastas e gera templates prontos.

### Modo 3 — Refatoração Cirúrgica (camada específica)
```
/arquitetura-imperatriz refatorar a camada de auth do app Z
```
A skill foca em UMA camada específica, mostra antes/depois e gera código pronto pra implementar.

---

## 📦 O QUE TEM DENTRO

```
arquitetura-imperatriz/
├── SKILL.md                          # mestre — fluxo da skill
├── frameworks/
│   ├── 01-diagnostico-6-padroes.md   # como pontuar cada padrão
│   ├── 02-5-camadas-atlassian-adaptadas.md
│   ├── 03-calibrador-por-porte.md
│   └── 04-priorizador-ice.md
├── perfis-porte/
│   ├── 1-solo-tata.md
│   ├── 2-apps-internos.md            # ← maioria dos casos
│   ├── 3-multi-tenant.md
│   └── 4-escala-publico.md
├── modos/
│   ├── 1-auditoria.md
│   ├── 2-projeto-novo.md
│   └── 3-refatoracao-cirurgica.md
├── templates-codigo/                 # 14 arquivos prontos
│   ├── nginx-edge-layer.conf
│   ├── express-middleware-auth.js
│   ├── express-middleware-ratelimit.js
│   ├── express-middleware-logger.js
│   ├── dockerfile-padrao-node.dockerfile
│   ├── docker-compose-multi-app.yml
│   ├── queue-bullmq-setup.js
│   ├── control-plane-polling.js
│   ├── github-actions-deploy.yml
│   ├── healthcheck.js
│   ├── env-validation.js
│   ├── pm2-ecosystem.config.js
│   ├── setup-vps-from-scratch.sh
│   └── nginx-snippets.conf
├── anti-patterns/
│   └── 10-anti-patterns.md
├── validadores/
│   ├── 12-perguntas-chave.md
│   └── 10-anti-patterns-detector.md
├── exemplos-calibrados/              # apps reais
│   ├── app-tarefas-imperatriz.md
│   ├── imperio-multi-agent.md
│   └── leadflow-template.md
└── outputs-template/                 # templates de saída
    ├── 00-Diagnostico-template.md
    ├── 01-Arquitetura-Atual-template.md
    ├── 02-Arquitetura-Proposta-template.md
    ├── 03-Roadmap-30-60-90-template.md
    ├── 04-Codigo-Pronto-README-template.md
    ├── 05-Decisoes-e-Tradeoffs-template.md
    └── dashboard.html
```

---

## 🎯 PARA QUEM É

- **Founders solo** que constroem múltiplos apps Node
- **Founders/agências** com 5-15 apps na mesma VPS
- **Startups multi-tenant** que querem padrão arquitetural
- **Devs aprendendo arquitetura de produção**

**NÃO é pra:** apps Kubernetes em escala 10k+ users/dia (pra isso, contrate SRE de verdade).

---

## 🧰 STACK ASSUMIDA

A skill é otimizada pra:
- **Node.js + TypeScript** (também funciona pra Python/Go com adaptação)
- **Express ou Fastify**
- **Postgres ou SQLite**
- **Redis (opcional)**
- **Docker + Docker Compose**
- **Nginx**
- **VPS Linux (Hostinger, DigitalOcean, Hetzner, etc)**

---

## 📚 BASEADO EM

- Vídeo [*I was laid off by Atlassian*](https://www.youtube.com/watch?v=55pTFVoclvE) (Vasilios Syrakis, 2026)
- [Open Service Broker spec](https://www.openservicebrokerapi.org/)
- [Envoy proxy](https://www.envoyproxy.io/) e [Sovereign](https://bitbucket.org/atlassian/sovereign)
- HashiCorp [Packer](https://www.packer.io/) + [Terraform](https://www.terraform.io/)
- [BullMQ](https://bullmq.io/) (filas)

---

## 🤝 SKILLS RELACIONADAS

| Quando | Skill |
|--------|-------|
| Entender porte do negócio antes | `/imperio-diagnostico` |
| Operações (hooks, custos, observability) | `/imperio-infra` |
| Deploy do código gerado | `/skill-deploy-vps` |
| Mapa mental visual | `/mapa-mental-imperatriz` |
| Priorizar roadmap | `/ice-imperatriz` |

---

## 📄 LICENÇA

MIT © Tata Gonçalves

---

## 🙏 CRÉDITOS

Inspirado na engenharia reversa do trabalho de Vasilios Syrakis na Atlassian (edge infrastructure que serve Jira, Confluence, Bitbucket).

Construído por [Tata Gonçalves](https://github.com/tatagoncalvesof) e Claude Code.
