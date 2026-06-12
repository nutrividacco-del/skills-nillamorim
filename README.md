# Skills da Nill Amorim

Coleção de skills do Claude Code criadas pela **Nill Amorim** (Oficina de Gaia) para uso interno e compartilhamento com mentoradas.

> Repositório **público** — qualquer mentorada pode clonar e instalar.

---

## O que tem aqui

| Skill | O que faz | Stack |
|-------|-----------|-------|
| **nillamorim-arquitetura** | Auditoria e diagnóstico arquitetural de apps — 6 padrões universais (engenharia reversa da Atlassian), notas 0-10, anti-patterns, roadmap 30/60/90 e código pronto. Método Imperatriz (Tata Gonçalves) | Node/TS (qualquer app) |
| **nillamorim-carrossel** | Cria carrosseis 1080×1080 para Instagram com identidade visual aprovada (HTML → PNG via Playwright) | HTML/CSS, Playwright |
| **nillamorim-editor-video** | Editor de vídeo com IA — analisa, transcreve, corta, compila depoimentos e Reels (CTA animado com Remotion) | ffmpeg, Whisper/Gemini, Remotion |
| **nillamorim-funil** | Agente Mestre de Funis — orquestra criação de página de vendas + funil completo | Multi-skill |
| **nillamorim-login** | SEVERINO — sistema de login por convite + admin panel + recuperação de senha | Express, SQLite, JWT, React |
| **nillamorim-minerador** | Minerador inteligente de WhatsApp — monitora grupos, classifica com IA, relatório diário | Baileys, Gemini |
| **nillamorim-orquestrador-terminais** | Gerente de produção — divide um projeto em frentes independentes sem conflito de arquivos pra rodar vários terminais do Claude Code em paralelo, com pacote de trabalho por terminal + plano de integração | Claude Code |
| **nillamorim-pixel** | Instala e configura Meta Pixel com eventos custom em projetos React + TypeScript | React, TypeScript |
| **nillamorim-transcricao** | ISAURA — transcreve aulas + gera materiais (workbook, mapa mental, plataforma Netflix-style) | Gemini, React, Cloudflare Pages |

---

## Instalação rápida

### 1. Pré-requisitos

- Claude Code instalado ([guia oficial](https://docs.claude.com/claude-code))
- Git instalado

### 2. Instalar todas as skills de uma vez

```bash
cd ~/.claude/skills
git clone https://github.com/nutrividacco-del/skills-nillamorim.git
cd skills-nillamorim
bash install.sh
```

O `install.sh` cria links simbólicos pra todas as skills aparecerem no Claude Code automaticamente.

### 3. Atualizar quando tiver versão nova

```bash
cd ~/.claude/skills/skills-nillamorim
git pull
```

Pronto — as skills se atualizam sem precisar reinstalar.

---

## Como usar cada skill

Depois de instalar, basta digitar o nome da skill no Claude Code:

```
/nillamorim-arquitetura
/nillamorim-carrossel
/nillamorim-editor-video
/nillamorim-funil
/nillamorim-login
/nillamorim-minerador
/nillamorim-orquestrador-terminais
/nillamorim-pixel
/nillamorim-transcricao
```

Ou simplesmente descrever o que você quer (ex: "quero criar um carrossel sobre X") — o Claude Code ativa a skill automaticamente.

---

## Personalização

As skills usam **caminhos multiplataforma** (`~/skills-conteudos/`, `~/skills-fotos-marca/`) que funcionam em Windows (Git Bash), Mac e Linux. As pastas são criadas automaticamente quando você usa a skill pela primeira vez.

### Pastas que as skills usam

| Pasta | Para que serve | Skills que usam |
|-------|----------------|-----------------|
| `~/skills-conteudos/` | Saída de carrosseis, HTMLs, PNGs gerados | `nillamorim-carrossel` |
| `~/skills-fotos-marca/` | Fotos da expert (você ou a aluna) pra capa de carrossel | `nillamorim-carrossel` |
| `~/depo-cutter/` | Workspace do editor de vídeo (input/output/temp) | `nillamorim-editor-video` |
| `~/.isaura-config.json` | Config persistente da skill de transcrição | `nillamorim-transcricao` |
| `~/.severino-config.json` | Config persistente da skill de login | `nillamorim-login` |

### O que você pode customizar

- **Identidade visual** (paletas, fontes) — cada SKILL.md tem uma seção "Design System". Abra e troque pelas suas cores e fontes
- **Caminhos** — se quiser usar pastas diferentes das padrões, abra o SKILL.md e edite as variáveis no topo
- **Prompts da IA** — pode ajustar tom, vocabulário e exemplos pra ficar com a sua cara

---

## Licença e uso

Estas skills foram criadas por **Nill Amorim** para uso pessoal e das mentoradas autorizadas da Oficina de Gaia.

- ✅ **Pode:** usar nos seus próprios projetos, adaptar pra sua identidade visual, modificar caminhos, gerar conteúdo pra você
- ❌ **Não pode:** redistribuir publicamente, vender, republicar como sua autoria

Em caso de dúvida, fala comigo.

---

## Suporte

Dúvida ou bug? Manda mensagem direto pra mim no WhatsApp da mentoria ou abre uma issue aqui no GitHub.

---

*Feito com 🌱 pela Oficina de Gaia*
