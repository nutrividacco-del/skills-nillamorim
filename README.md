# Skills da Nill Amorim

Coleção de skills do Claude Code criadas pela **Nill Amorim** (Oficina de Gaia) para uso interno e compartilhamento com mentoradas.

> Repositório **privado**. Acesso por convite.

---

## O que tem aqui

| Skill | O que faz | Stack |
|-------|-----------|-------|
| **nillamorim-carrossel** | Cria carrosseis 1080×1080 para Instagram com identidade visual aprovada (HTML → PNG via Playwright) | HTML/CSS, Playwright |
| **nillamorim-editor-video** | Editor de vídeo com IA — analisa, transcreve, corta, compila depoimentos e Reels (CTA animado com Remotion) | ffmpeg, Whisper/Gemini, Remotion |
| **nillamorim-funil** | Agente Mestre de Funis — orquestra criação de página de vendas + funil completo | Multi-skill |
| **nillamorim-login** | SEVERINO — sistema de login por convite + admin panel + recuperação de senha | Express, SQLite, JWT, React |
| **nillamorim-minerador** | Minerador inteligente de WhatsApp — monitora grupos, classifica com IA, relatório diário | Baileys, Gemini |
| **nillamorim-pixel** | Instala e configura Meta Pixel com eventos custom em projetos React + TypeScript | React, TypeScript |
| **nillamorim-transcricao** | ISAURA — transcreve aulas + gera materiais (workbook, mapa mental, plataforma Netflix-style) | Gemini, React, Cloudflare Pages |

---

## Instalação rápida

### 1. Pré-requisitos

- Claude Code instalado ([guia oficial](https://docs.claude.com/claude-code))
- Git instalado
- Acesso a este repositório (convite enviado por e-mail)

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
/nillamorim-carrossel
/nillamorim-editor-video
/nillamorim-funil
/nillamorim-login
/nillamorim-minerador
/nillamorim-pixel
/nillamorim-transcricao
```

Ou simplesmente descrever o que você quer (ex: "quero criar um carrossel sobre X") — o Claude Code ativa a skill automaticamente.

---

## Personalização

Algumas skills foram criadas com caminhos absolutos do meu computador (`E:\CLAUDE\...`). Antes de usar, abra o `SKILL.md` da skill e ajuste:

- Caminhos de saída (`E:\CLAUDE\Fabrica de Conteudos\` → seu próprio caminho)
- Identidade visual (paletas, fontes) — substitua pela sua
- Caminhos de fotos pessoais (`E:\CLAUDE\FOTOS\Nill-IA\`) → onde estão as suas

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
