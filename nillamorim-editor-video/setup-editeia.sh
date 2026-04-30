#!/bin/bash
# ============================================
# EditeIA — Setup Automatico
# Rode: bash setup-editeia.sh
# ============================================

echo ""
echo "========================================="
echo "  EditeIA — Editor de Videos com IA"
echo "  Setup Automatico"
echo "========================================="
echo ""

ERRORS=0

echo ">> Verificando Homebrew..."
if ! command -v brew &> /dev/null; then
    echo "   Instalando Homebrew (pode pedir sua senha do Mac)..."
    /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
else
    echo "   Homebrew OK"
fi

echo ">> Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "   Instalando Node.js..."
    brew install node
else
    NODE_VERSION=$(node -v | sed 's/v//' | cut -d. -f1)
    if [ "$NODE_VERSION" -lt 20 ]; then
        echo "   Node.js $NODE_VERSION encontrado, atualizando para 20+..."
        brew install node
    else
        echo "   Node.js $(node -v) OK"
    fi
fi

echo ">> Verificando ffmpeg..."
if ! command -v ffmpeg &> /dev/null; then
    echo "   Instalando ffmpeg (pode demorar uns minutos)..."
    brew install ffmpeg
else
    echo "   ffmpeg OK"
fi

echo ">> Verificando Python 3..."
if ! command -v python3 &> /dev/null; then
    echo "   Instalando Python 3..."
    brew install python3
else
    echo "   Python $(python3 --version) OK"
fi

echo ">> Instalando faster-whisper (legendas)..."
pip3 install faster-whisper -q 2>/dev/null
if pip3 show faster-whisper &> /dev/null; then
    echo "   faster-whisper OK"
else
    echo "   AVISO: faster-whisper nao instalou. Rode manualmente: pip3 install faster-whisper"
    ERRORS=$((ERRORS+1))
fi

echo ">> Verificando Claude Code..."
if ! command -v claude &> /dev/null; then
    echo "   Instalando Claude Code..."
    npm install -g @anthropic-ai/claude-code
else
    echo "   Claude Code OK"
fi

echo ">> Criando pasta ~/depo-cutter/..."
mkdir -p ~/depo-cutter/{input,output,temp,src,remotion}
echo "   Pasta criada"

if [ ! -f ~/depo-cutter/.env ]; then
    echo ""
    echo "========================================="
    echo "  Configurar chave de API"
    echo "========================================="
    echo ""
    echo "Voce precisa de UMA chave de API para transcrever videos."
    echo ""
    echo "Opcao 1 (recomendada): Google Gemini (gratis)"
    echo "  → Acesse: https://aistudio.google.com/apikey"
    echo ""
    echo "Opcao 2: OpenAI"
    echo "  → Acesse: https://platform.openai.com/api-keys"
    echo ""
    read -p "Cole sua chave aqui (ou ENTER pra configurar depois): " API_KEY

    if [ -n "$API_KEY" ]; then
        if [[ "$API_KEY" == sk-* ]]; then
            echo "OPENAI_API_KEY=$API_KEY" > ~/depo-cutter/.env
            echo "   Chave OpenAI salva!"
        else
            echo "GEMINI_API_KEY=$API_KEY" > ~/depo-cutter/.env
            echo "   Chave Gemini salva!"
        fi
    else
        cat > ~/depo-cutter/.env << 'ENVEOF'
# Coloque SUA chave aqui (escolha uma):
GEMINI_API_KEY=cole-sua-chave-aqui
# OPENAI_API_KEY=cole-sua-chave-aqui
ENVEOF
        echo "   Arquivo .env criado. Edite depois: ~/depo-cutter/.env"
        ERRORS=$((ERRORS+1))
    fi
else
    echo ">> .env ja existe, mantendo"
fi

echo ">> Configurando skill EditeIA no Claude Code..."
mkdir -p ~/.claude/skills/editeia

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/SKILL.md" ] && [ ! -f ~/.claude/skills/editeia/SKILL.md ]; then
    cp "$SCRIPT_DIR/SKILL.md" ~/.claude/skills/editeia/SKILL.md
    echo "   SKILL.md copiada!"
elif [ -f ~/.claude/skills/editeia/SKILL.md ]; then
    echo "   SKILL.md ja existe — atualizando..."
    cp "$SCRIPT_DIR/SKILL.md" ~/.claude/skills/editeia/SKILL.md
    echo "   SKILL.md atualizada!"
elif [ -f "SKILL.md" ]; then
    cp SKILL.md ~/.claude/skills/editeia/SKILL.md
    echo "   SKILL.md copiada!"
else
    echo "   AVISO: Coloque o arquivo SKILL.md em ~/.claude/skills/editeia/"
    ERRORS=$((ERRORS+1))
fi

echo ""
echo "========================================="
if [ $ERRORS -eq 0 ]; then
    echo "  TUDO PRONTO!"
else
    echo "  QUASE PRONTO ($ERRORS avisos acima)"
fi
echo "========================================="
echo ""
echo "Proximos passos:"
echo "  1. Coloque seus videos em: ~/depo-cutter/input/"
echo "  2. Abra o terminal e rode: claude"
echo "  3. Digite: /editeia full"
echo ""
echo "Se der erro de autenticacao no Claude Code:"
echo "  → Rode /login dentro do Claude Code"
echo ""
