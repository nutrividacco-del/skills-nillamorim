#!/usr/bin/env bash
# Skills da Nill Amorim — instalador
# Cria links simbólicos das skills no diretório do Claude Code (~/.claude/skills/)
# Funciona em Linux, macOS e Windows (Git Bash / WSL)

set -e

echo ""
echo "=========================================="
echo "  Skills da Nill Amorim — Instalador"
echo "=========================================="
echo ""

REPO_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SKILLS_DIR="$HOME/.claude/skills"

# Garante que ~/.claude/skills/ existe
mkdir -p "$SKILLS_DIR"

# Lista das skills a instalar
SKILLS=(
  "nillamorim-arquitetura"
  "nillamorim-carrossel"
  "nillamorim-editor-video"
  "nillamorim-funil"
  "nillamorim-login"
  "nillamorim-minerador"
  "nillamorim-orquestrador-terminais"
  "nillamorim-pixel"
  "nillamorim-transcricao"
)

INSTALLED=0
SKIPPED=0
UPDATED=0

for skill in "${SKILLS[@]}"; do
  SRC="$REPO_DIR/$skill"
  DEST="$SKILLS_DIR/$skill"

  if [ ! -d "$SRC" ]; then
    echo "  ⚠ $skill — pasta não encontrada no repo, pulando"
    continue
  fi

  if [ -L "$DEST" ]; then
    # Já é link simbólico — atualiza
    rm "$DEST"
    ln -s "$SRC" "$DEST"
    echo "  ↻ $skill — atualizado"
    UPDATED=$((UPDATED + 1))
  elif [ -d "$DEST" ]; then
    # Existe como pasta real (não link) — pula pra não sobrescrever
    echo "  ⏭ $skill — já existe como pasta real, pulando (remova manualmente se quiser substituir)"
    SKIPPED=$((SKIPPED + 1))
  else
    # Não existe — cria link
    ln -s "$SRC" "$DEST"
    echo "  ✓ $skill — instalado"
    INSTALLED=$((INSTALLED + 1))
  fi
done

echo ""
echo "=========================================="
echo "  Resumo:"
echo "    Instaladas: $INSTALLED"
echo "    Atualizadas: $UPDATED"
echo "    Puladas:    $SKIPPED"
echo "=========================================="
echo ""
echo "  Pra atualizar no futuro:"
echo "    cd $REPO_DIR && git pull"
echo ""
echo "  Pra usar no Claude Code, digite:"
echo "    /nillamorim-arquitetura"
echo "    /nillamorim-carrossel"
echo "    /nillamorim-editor-video"
echo "    /nillamorim-funil"
echo "    /nillamorim-login"
echo "    /nillamorim-minerador"
echo "    /nillamorim-orquestrador-terminais"
echo "    /nillamorim-pixel"
echo "    /nillamorim-transcricao"
echo ""
echo "  Pronto! 🌱"
echo ""
