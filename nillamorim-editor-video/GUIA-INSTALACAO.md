# EditeIA — Guia de Instalacao

## O que e o EditeIA?

Skill do Claude Code que transforma videos brutos em Reels prontos para Instagram/TikTok:
- Transcreve automaticamente com IA
- Pontua e seleciona os melhores trechos
- Aplica analise de copy (Sexy Canvas + Bencivenga) pra escolher a ordem certa
- Reordena na sequencia estrategica (BOMBA primeiro, CTA no final)
- Faz auditoria dos cortes antes de executar
- Gera legendas estilizadas
- Cria capa + caption prontos pra postar

---

## Passo 1: Ter uma conta no Claude (Anthropic)

O Claude Code precisa da SUA conta na Anthropic. Voce precisa:
1. Ter um plano Claude Pro ou Team em https://claude.ai
2. Estar logada no Claude Code

**Se aparecer erro "OAuth token has expired" ou "Invalid authentication credentials":**
→ Rode `/login` dentro do Claude Code para reautenticar sua conta.

---

## Passo 2: Rodar o setup automatico

Coloque os 3 arquivos que voce recebeu numa pasta e rode no terminal:

```bash
bash setup-editeia.sh
```

Ele instala tudo automaticamente (Homebrew, Node.js, ffmpeg, Python, faster-whisper, Claude Code) e pede sua chave de API.

---

## Passo 3 (alternativo): Instalacao manual

Se preferir instalar manualmente:

```bash
# Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Ferramentas
brew install ffmpeg node
pip3 install faster-whisper
npm install -g @anthropic-ai/claude-code

# Pasta do projeto
mkdir -p ~/depo-cutter/{input,output,temp,src,remotion}

# Skill do Claude Code
mkdir -p ~/.claude/skills/editeia
cp SKILL.md ~/.claude/skills/editeia/SKILL.md
```

---

## Passo 4: Configurar sua chave de API

Voce precisa de UMA chave (Gemini ou OpenAI) para transcrever videos:

**Google Gemini (recomendado — gratis ate certo limite):**
→ https://aistudio.google.com/apikey

**OpenAI:**
→ https://platform.openai.com/api-keys

Salve no arquivo `~/depo-cutter/.env`:
```
GEMINI_API_KEY=sua-chave-aqui
```

---

## Passo 5: Usar!

1. Coloque seus videos em `~/depo-cutter/input/`
2. Abra o terminal e rode: `claude`
3. Digite qualquer comando:

| Comando | O que faz |
|---------|-----------|
| `/editeia full` | Pipeline completo (transcreve + corta + compila) |
| `/editeia analyze` | So transcreve e pontua os videos |
| `/editeia cut` | Corta os melhores trechos |
| `/editeia compile` | Junta tudo num video final |
| `/editeia legendas` | Gera legendas estilizadas |
| `/editeia reels` | Transforma video longo em clips de 30-60s |
| `/editeia highlights` | Extrai os TOP 3 momentos |

---

## Problemas Comuns

**"OAuth token has expired" ou "Invalid authentication credentials"**
→ Esse erro e do Claude Code, NAO da chave Gemini/OpenAI.
→ Rode `/login` dentro do Claude Code para reautenticar.

**"command not found: ffmpeg"**
→ Rode `brew install ffmpeg`

**"No module named faster_whisper"**
→ Rode `pip3 install faster-whisper`

**"API key not found"**
→ Verifique se o arquivo `~/depo-cutter/.env` existe e tem sua chave

---

## Importante

- Cada pessoa usa SUA PROPRIA conta Claude + SUA PROPRIA chave de API
- Nao compartilhe chaves com ninguem
- Os videos ficam na SUA maquina
- Resultados ficam em `~/Desktop/Videos Editados/`
