---
name: nillamorim-editor-video
description: >
  EditeIA — Editor de videos com IA. Analisa, transcreve, pontua, corta e compila videos
  automaticamente usando ffmpeg + Whisper/Gemini. Especializado em depoimentos,
  reels, compilados e videos de marketing. Gera CTA final animado com Remotion.
  Triggers on: "editar video", "cortar video", "compilar depoimentos", "editor de
  video", "analisar video", "montar compilado", "video testimonial", "reels",
  "cortar depoimento", "juntar videos", "video com CTA", "legendar video",
  "transcrever video", "melhores momentos", "highlights video".
argument-hint: "analyze | cut | compile | reorder | cta | legendas | highlights | reels | full <action>"
allowed-tools:
  - Read
  - Write
  - Edit
  - Grep
  - Glob
  - Bash
  - Agent
  - mcp__nanobanana__generate_image
---

# EditeIA — Editor de Videos com IA

Pipeline completo de edicao de video usando ffmpeg + IA (Whisper/Gemini/GPT-4o).
Projeto base: `~/depo-cutter/`

## Quick Reference

| Comando | O que faz |
|---------|-----------|
| `/editeia analyze` | Transcreve + pontua todos os videos em input/ |
| `/editeia cut` | Corta os melhores trechos automaticamente |
| `/editeia compile` | Junta tudo + normaliza audio + CTA final |
| `/editeia reorder` | Reordena/remove trechos antes de compilar |
| `/editeia cta` | Gera/atualiza CTA animado com Remotion |
| `/editeia legendas` | Gera legendas estilizadas (.srt + burned-in) |
| `/editeia highlights` | Extrai os TOP 3 momentos de cada video |
| `/editeia reels` | Corta video longo em clips de 30-60s pra Reels |
| `/editeia full` | Pipeline completo: analyze → cut → compile |

## Prerequisites

- **ffmpeg** installed (with ffprobe)
- **Node.js** 20+
- API key: `OPENAI_API_KEY` or `GEMINI_API_KEY` in `~/depo-cutter/.env`
- Project: `~/depo-cutter/` (auto-created if missing)

## Architecture

```
~/depo-cutter/
├── input/           → Drop raw videos here
├── output/
│   ├── analysis.json    → Transcription + scores
│   ├── cuts.json        → Selected segments manifest
│   ├── cuts/            → Individual cut clips
│   ├── depoimentos-compilado.mp4  → Without CTA
│   └── depoimentos-final.mp4     → With CTA ending
├── temp/            → Audio + frames (temporary)
├── remotion/        → CTA animation (React)
└── src/
    ├── config.js    → Environment config
    ├── analyze.js   → Step 1: Transcribe + score
    ├── cut.js       → Step 2: Cut best segments
    ├── reorder.js   → Optional: Reorder/remove
    └── compile.js   → Step 3: Concat + normalize + CTA
```

## Execution Flow

When the user invokes this skill, follow this decision tree:

### `/editeia analyze`
1. Verify `~/depo-cutter/` exists, if not create it by running setup (see Setup section)
2. Check that videos exist in `~/depo-cutter/input/`
3. If user provided video paths, copy them to `input/` first
4. Run `cd ~/depo-cutter && npm run analyze`
5. Show results: number of segments, top 5 by score, average score per video
6. Ask if user wants to proceed to cut

### `/editeia cut`
1. Verify `output/analysis.json` exists
2. Run `cd ~/depo-cutter && npm run cut`
3. Show all selected segments with scores and text preview
4. Ask if user wants to remove/reorder any before compiling

### `/editeia compile`
1. Verify `output/cuts.json` exists
2. Run `cd ~/depo-cutter && npm run compile`
3. Report final video path and duration
4. If CTA exists, report final version with CTA

### `/editeia reorder`
1. Show current cuts list with scores
2. Ask user which to remove or reorder
3. Run `node src/reorder.js --remove X,Y` or `--order X,Y,Z`
4. Show updated list

## ROTEIRO ESTRATEGICO — Protocolo para qualquer video de depoimento

### Principio: Bombardeio de Tangibilidade
O Instagram/TikTok decide nos primeiros 3 segundos se a pessoa fica ou sai.
NUNCA comece com setup generico ("oi pessoal", "normalmente eu faria...").
SEMPRE comece com a frase mais IMPACTANTE e TANGIVEL do video.

### Passo 1: Mapear o video em segmentos
Apos transcrever com Whisper, classificar CADA trecho em uma categoria:

| Categoria | O que eh | Prioridade no video |
|-----------|---------|-------------------|
| BOMBA | Frase chocante, controversa ou surpreendente | 1o (abre o video) |
| TANGIVEL | Resultado concreto com numeros/provas | 2o (segura apos hook) |
| CONTEXTO | Situacao que gerou o resultado | 3o (conecta) |
| HUMANIZA | Momento real/vulneravel | 4o (gera empatia) |
| METODO | Como aconteceu | 5o (explica) |
| HUMOR | Frase engraçada/relatable | 6o (memoravel) |
| CTA | Recomendacao direta | 7o (fecha) |

### Passo 1.5: Analise de Copy Estrategica (Sexy Canvas + Bencivenga)

Apos mapear os segmentos nas 7 categorias, aplicar analise de copy estrategica
para escolher QUAIS segmentos ficam e em QUAL ORDEM.

#### A) SEXY CANVAS — Gatilho emocional por segmento

Para CADA segmento classificado, identificar qual gatilho emocional ativa:

| Gatilho | Desejo Primitivo | Quando aparece no depoimento |
|---------|-----------------|------------------------------|
| GANANCIA | Ter mais, acumular, vantagem | "faturei X", "retorno", "resultado financeiro" |
| LUXURIA | Desejo intenso, prazer | "incrivel", "surreal", "sensacao", "experiencia" |
| INVEJA | Querer o que o outro tem | "enquanto os outros", "todo mundo quer", "ja estao usando" |
| IRA | Raiva, frustracao, indignacao | "cansei de", "chega de perder", "injusto" |
| CRIANCA INTERIOR | Nostalgia, diversao, leveza | "simples", "leve", "como eu sonhava", "diversao" |
| GULA | Querer tudo, abundancia | "tudo isso", "e ainda mais", "nao para", "muito mais" |
| PREGUICA | Facilidade, atalho, automacao | "automatizado", "em minutos", "sem esforco", "pronto" |
| VAIDADE | Status, superioridade, ego | "profissional", "top", "elite", "os outros vao ver" |

Para cada segmento, anotar:
```
Seg 1 [BOMBA] — Gatilho: PREGUICA + GANANCIA (automacao + resultado)
Seg 2 [CONTEXTO] — Gatilho: PREGUICA (subir campanhas automatizadas)
```

**Regra de ouro:** NAO colocar 3 segmentos seguidos com o MESMO gatilho.
Alternar gatilhos para manter o cerebro do espectador engajado.

#### B) BENCIVENGA — Persuasion Equation do roteiro completo

Avaliar o roteiro montado (ANTES de cortar) com a equacao de persuasao:

| Criterio | Peso | O que verificar |
|----------|------|----------------|
| Promessa Urgente | 0-25 | O video abre com resultado concreto? Gera curiosidade nos 3s? |
| Proposta Unica | 0-25 | Mostra algo que SO essa mentoria/produto entrega? |
| Prova Irresistivel | 0-25 | Tem numero, screenshot, resultado tangivel, nome especifico? |
| Oferta Irrecusavel | 0-25 | O CTA faz parecer "burrice nao ir"? |

**Score total: 0-100**
- 80+ = Roteiro forte, pode cortar
- 60-79 = Reorganizar segmentos pra fortalecer o ponto mais fraco
- <60 = Considerar usar o video quase inteiro ou buscar outro depoimento

Se o score for baixo em "Prova Irresistivel", priorizar segmentos TANGIVEL.
Se for baixo em "Proposta Unica", priorizar segmentos METODO.

#### C) PALAVRAS DE PODER — Para caption e capa

Ao gerar caption e capa, substituir palavras genericas por palavras de poder
alinhadas ao gatilho DOMINANTE do video:

| Gatilho | Palavras de Poder |
|---------|-------------------|
| GANANCIA | faturou, triplicou, retorno, piloto automatico, investimento |
| PREGUICA | em minutos, automatizado, sem esforco, plug and play, pronto |
| GULA | tudo isso, e ainda mais, completo, do zero ao resultado, pacote |
| VAIDADE | top 1%, profissional, elite, referencia, autoridade |
| INVEJA | enquanto voce hesita, ja estao usando, proxima turma, vagas limitadas |
| IRA | chega de perder tempo, cansei de, nao aceite menos, basta |
| LUXURIA | irresistivel, exclusivo, premium, experiencia unica, transformador |
| CRIANCA INTERIOR | simples, leve, sem complicacao, volta a ser facil, natural |

**Aplicar em:** headline da capa, primeira frase da caption, CTA da caption.
NAO exagerar — 2-3 palavras de poder por caption e suficiente.

### Passo 2: Hierarquia de impacto
Reordenar os segmentos nesta sequencia:

```
1. BOMBA        → Segura nos primeiros 3s (frase mais forte)
2. TANGIVEL 1   → Prova concreta #1 (resultado especifico)
3. TANGIVEL 2   → Prova concreta #2 (empilha evidencia)
4. HUMANIZA     → "Pessoa real, sem producao" (gera conexao)
5. METODO       → Como aconteceu (credibiliza)
6. HUMOR        → Frase memoravel (viraliza)
7. CTA NATURAL  → Recomendacao espontanea do depoente
8. CTA REMOTION → Tela animada com vantagens + link
```

### Passo 3: Cortar nos pontos certos
**REGRA DE OURO: Cortar em pausas de respiracao, NUNCA no meio de frases.**

Protocolo de corte:
1. Ler a transcricao completa com timestamps do Whisper
2. Identificar PAUSAS (gaps > 0.3s entre palavras) — esses sao os pontos de corte seguros
3. Para cada segmento, adicionar 0.2s de margem ANTES e DEPOIS da frase
4. Se um trecho conecta naturalmente com o proximo, MANTER JUNTO
5. Se a mesma frase aparece em 2 segmentos, usar em APENAS UM

**Anti-patterns (NUNCA fazer):**
- Cortar no meio de uma frase conectada
- Separar frases que perdem contexto separadas
- Duplicar a mesma frase em 2 cortes diferentes
- Usar `-to` (timestamp absoluto) com `-ss` — usar `-t` (duracao) em vez disso
- Segmento que TERMINA com frase do PROXIMO segmento (overlap de audio)
- Mesma frase aparecendo no inicio E no final do video

### Passo 3.5: Analise de Copy — Enxugar cada segmento
Apos mapear e reordenar, analisar CADA segmento com olho de copywriter:

**Pergunta-chave por segmento:** "Essa frase entrega RESULTADO ou JUSTIFICA?"
- RESULTADO = manter
- JUSTIFICA/EXPLICA = cortar ou enxugar

**Regra do Enxugamento:**
1. Ler a transcricao word-by-word do segmento
2. Identificar a FRASE-NUCLEO (o que a pessoa REALMENTE quer dizer)
3. Identificar ENROLACAO (repeticoes, justificativas, hesitacoes)
4. Cortar a enrolacao mantendo a frase-nucleo intacta
5. Se possivel, manter a primeira frase + punchline, cortando o meio

**Tipos de enrolacao comuns em depoimentos:**
- Listas repetitivas ("isso, aquilo, aquele outro") → manter 1 item + punchline
- Justificativas ("porque, ne, tipo, assim, entao") → cortar
- Hesitacoes ("sei la, como posso dizer") → cortar
- Setup longo antes do resultado → cortar setup, ir direto ao resultado

**IMPORTANTE:** Ao cortar o meio de um segmento, usar Whisper word timestamps pra
encontrar os pontos EXATOS de pausa. Juntar as 2 partes (setup + punchline) com
ffmpeg concat. O corte deve soar natural — se parecer jump cut estranho, manter o
trecho inteiro em vez de forcar o corte.

### Passo 3.8: AUDITORIA OBRIGATORIA — Aprovar antes de cortar
**REGRA ABSOLUTA: NUNCA cortar o video sem apresentar a auditoria primeiro.**

Antes de executar qualquer corte com ffmpeg, OBRIGATORIAMENTE:

1. **Transcrever o video original com faster-whisper** (word-level timestamps)
2. **Montar o plano de cortes** com o texto EXATO de cada segmento
3. **Apresentar a auditoria** para o usuario no seguinte formato:

```
=== AUDITORIA DE CORTES ===

CORTE 1 — BOMBA [132.50s - 139.00s] (6.5s)
Texto: "To saindo com a cabeca explodindo e to saindo aqui com a minha IA ja pronta."
Primeira palavra: "To" [132.50s] — OK (inicio natural)
Ultima palavra: "pronta." [138.78s] — OK (frase completa)
Frase sozinha faz sentido? SIM
Status: [OK]

CORTE 2 — CONTEXTO [25.00s - 39.50s] (14.5s)
Texto: "Basicamente eu cheguei nessa mentoria pensando o seguinte..."
Primeira palavra: "Basicamente" [25.62s] — OK
Ultima palavra: "IA." [39.20s] — OK (frase completa)
Frase sozinha faz sentido? SIM
Status: [OK]
```

4. **Checklist por corte:**
   - [ ] Primeira palavra comeca COMPLETA (nao cortou prefixo/silaba)
   - [ ] Ultima palavra termina COMPLETA (nao cortou sufixo)
   - [ ] A frase faz sentido SOZINHA (sem depender do que veio antes/depois)
   - [ ] Nao tem micro-segmento isolado (<2s)
   - [ ] Timestamps baseados em Whisper word-level (NAO em Gemini)
   - [ ] Padding de 0.3s antes da primeira palavra e depois da ultima

5. **Se algum corte tiver [PROBLEMA]:** explicar o problema e propor ajuste
6. **Aguardar aprovacao do usuario** antes de prosseguir para o Passo 4

**Anti-patterns que a auditoria deve pegar:**
- Frase cortada no meio ("Pena participar" quando deveria ser "Valeu muito a pena participar")
- Frase que termina sem completar o sentido
- Micro-segmento de menos de 2s isolado entre cortes maiores
- Frase que comeca com palavra do meio de outra frase

### Passo 4: Compilar + Legendar + Capa + Caption
Apos aprovar a auditoria e executar os cortes, seguir na sequencia:
1. Concat segmentos + CTA Remotion
2. Fix A/V offset (verificar start_time)
3. Legendar com Whisper (no video JA reordenado)
4. Gerar capa 1080x1920 com HOOK na zona segura
5. Gerar caption com copy estrategica + hashtags
6. Copiar tudo pro Desktop com nomes claros

### Passo 5: Capa com copy da BOMBA
A capa SEMPRE usa a frase da BOMBA (segmento 1) como headline:
- Topo (zona segura): Frase de impacto em branco + palavra-chave em amarelo
- Rodape (zona segura): 3 tangibilidades em lista (o que a pessoa conquistou)
- Centro: Frame do momento de maior expressao facial

### `/editeia cta`
1. Ask user for: title, subtitle, benefits (list), button text, URL, social proof
2. **NAO incluir preco nem data** por padrao — manter generico pra reusar
3. Update `remotion/Root.tsx` defaultProps
4. Run `cd ~/depo-cutter && npx remotion render remotion/index.tsx cta-final output/cta-final.mp4 --codec h264`
5. Normalize CTA para match specs dos cortes (30fps, 48kHz, timescale 15360)
6. **Acentos:** Remotion usa system-ui font que suporta Unicode/PT-BR. SEMPRE usar acentos corretos nos textos.

### `/editeia legendas`
Generate precise subtitles using faster-whisper (word-level timestamps):
1. Run: `cd ~/depo-cutter && python3 src/legendar.py INPUT.mp4`
2. Script automatically: extracts audio → transcribes with Whisper (word-level) → groups into subtitle blocks → highlights keywords → burns ASS into video
3. Outputs: `_legendado.mp4` (burned-in), `_legendas.srt`, `_legendas.ass`, `_words.json` (raw word timestamps)
4. SRT-only mode: `python3 src/legendar.py INPUT.mp4 --srt-only`

**CRITICAL PROTOCOL — NEVER use Gemini timestamps for subtitles.**
Gemini timestamps are approximate (~1-2s off). ALWAYS use faster-whisper for subtitles
because it provides word-level timestamps with millisecond precision.
- Dependency: `pip3 install faster-whisper`
- Model: `medium` (best accuracy/speed balance for PT-BR)
- Word timestamps enabled + VAD filter for silence detection

### Capa/Miniatura — SEMPRE entregar junto com o video
Para cada video editado, SEMPRE gerar a capa do Reels:
1. Tamanho: **1080x1920** (full Stories/Reels size)
2. Extrair melhor frame: `ffmpeg -ss BEST_MOMENT -i video.mp4 -frames:v 1 -q:v 1 thumb.jpg`
3. Zona segura do grid Instagram: **y=285 a y=1635** (centro 1350px)
4. TODO texto importante DENTRO da zona segura (topo e rodape ficam cortados no grid)
5. Overlay com ffmpeg drawtext:
   - Topo (y~320): headline de hook em branco + keyword em amarelo (#FFE135)
   - Rodape (y~1365): frase de impacto + @SEU_INSTAGRAM
   - Fundo semitransparente (drawbox black@0.6) atras dos textos
6. Salvar como `capa-reels.jpg` junto com o video
7. Entregar ambos: video MP4 + capa JPG

Mapa da zona segura:
```
0px     — zona cortada no grid (topo)
285px   — inicio da zona segura
         [textos de topo aqui, y=300-500]
         [rosto/conteudo principal no centro]
         [textos de rodape aqui, y=1350-1600]
1635px  — fim da zona segura
1920px  — zona cortada no grid (rodape)
```

### Caption Instagram — SEMPRE entregar junto com o video
Para cada video editado, SEMPRE gerar caption estrategica para Instagram:
1. Analisar a transcricao do video (ja disponivel do Whisper)
2. Identificar a frase mais forte do depoimento (hook)
3. Estrutura da caption (framework AIDA adaptado pra Reels):
   - **HOOK** (1a linha): Frase mais impactante do depoimento entre aspas
   - **PATTERN INTERRUPT**: "Essas nao sao minhas palavras." (ou variacao)
   - **CONTEXTO**: Quem falou e de onde veio
   - **DESTAQUE**: 3 frases-chave do depoimento com → (setas)
   - **BENEFICIOS**: Lista com emojis dos entregaveis concretos
   - **DIFERENCIAL**: O que torna unico
   - **CTA**: "O link ta na bio" ou chamada personalizada
   - **HASHTAGS**: 10 hashtags estrategicas (5 de nicho + 3 de alcance + 2 de marca pessoal)
4. Tom: conversacional, direto, PT-BR natural, sem exageros
5. Tamanho: 150-300 palavras (ideal pro Instagram)
6. Salvar como `caption.txt` junto com o video

### `/editeia highlights`
Extract top moments from video(s):
1. Run analysis pipeline on the video
2. Sort segments by score descending
3. Take top 3 (or user-specified count)
4. Cut each as individual clip
5. Output as separate files: `highlight_1.mp4`, `highlight_2.mp4`, etc.

### `/editeia reels`
Convert long video into Reels-ready clips:
1. Analyze and transcribe the video
2. Group adjacent high-score segments into 30-60s clusters
3. Each cluster = 1 Reel with natural start/end points
4. Cut each cluster as vertical 1080x1920
5. Suggest caption for each Reel based on content
6. Output: `reel_01.mp4`, `reel_02.mp4`, etc.

### `/editeia full`
Complete pipeline:
1. Run analyze → show results
2. Run cut → show selected segments
3. Ask for confirmation or adjustments
4. Run compile → deliver final video

## Setup (auto-run if project missing)

If `~/depo-cutter/` does not exist:
```bash
mkdir -p ~/depo-cutter/{input,output,temp,src,remotion}
cd ~/depo-cutter
npm install
```
Then create all source files (analyze.js, cut.js, compile.js, reorder.js, config.js)
and Remotion files (Root.tsx, CTAFinal.tsx, index.tsx) as documented in the project CLAUDE.md.

## Scoring Criteria (how AI rates segments)

| Criteria | Points |
|----------|--------|
| Transformation story (before/after) | +30 |
| Specific results or numbers | +25 |
| Emotional impact / genuine excitement | +20 |
| Mentions product/method/mentor by name | +15 |
| Clear, quotable statement | +10 |
| Filler words, tangents, unclear | -20 |
| Generic/vague praise | -10 |

## Config (.env)

| Variable | Default | Description |
|----------|---------|-------------|
| OPENAI_API_KEY | - | OpenAI key (Whisper + GPT-4o-mini) |
| GEMINI_API_KEY | - | Alternative: Google Gemini key |
| MIN_SCORE | 60 | Minimum score to include segment |
| MAX_DURATION | 90 | Max total duration in seconds |
| PADDING_SEC | 0.3 | Padding before/after each cut |
| CTA_TITLE | - | CTA main title (seu produto/evento) |
| CTA_SUBTITLE | - | CTA subtitle |
| CTA_BUTTON_TEXT | GARANTA SUA VAGA | CTA button text |
| CTA_URL | - | Your URL |

## FFmpeg Cheat Sheet (for custom operations)

```bash
# Cortar trecho especifico
ffmpeg -ss 00:01:30 -i input.mp4 -t 00:00:45 -c copy output.mp4

# Redimensionar pra vertical (Reels)
ffmpeg -i input.mp4 -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black" output.mp4

# Extrair audio
ffmpeg -i input.mp4 -vn -ar 16000 -ac 1 audio.wav

# Juntar videos (concat)
ffmpeg -f concat -safe 0 -i list.txt -c copy output.mp4

# Adicionar musica de fundo (volume baixo)
ffmpeg -i video.mp4 -i musica.mp3 -filter_complex "[1:a]volume=0.15[bg];[0:a][bg]amix=inputs=2:duration=shortest" -c:v copy output.mp4

# Gerar thumbnail do melhor frame
ffmpeg -i input.mp4 -ss 00:00:15 -frames:v 1 -q:v 2 thumb.jpg

# Acelerar video (2x)
ffmpeg -i input.mp4 -filter_complex "[0:v]setpts=0.5*PTS[v];[0:a]atempo=2.0[a]" -map "[v]" -map "[a]" output.mp4

# Normalizar audio
ffmpeg -i input.mp4 -af loudnorm=I=-16:TP=-1.5:LRA=11 -c:v copy output.mp4

# Remover silencio
ffmpeg -i input.mp4 -af silenceremove=start_periods=1:start_silence=0.5:start_threshold=-40dB output.mp4

# Overlay texto (sem Remotion)
ffmpeg -i input.mp4 -vf "drawtext=text='SEU TEXTO':fontsize=60:fontcolor=white:x=(w-text_w)/2:y=h-100:box=1:boxcolor=black@0.5:boxborderw=10" output.mp4

# Extrair frames (1 por segundo)
ffmpeg -i input.mp4 -vf fps=1 frames/frame_%04d.jpg

# Converter pra GIF (stories)
ffmpeg -i input.mp4 -vf "fps=15,scale=540:-1" -t 10 output.gif
```

## Advanced: Custom Operations

When the user asks for something not covered by the standard commands, use ffmpeg directly.
Common custom requests:
- "Adiciona musica de fundo" → amix filter
- "Acelera esse trecho" → setpts + atempo
- "Remove os silencios" → silenceremove
- "Coloca texto por cima" → drawtext filter
- "Faz em formato quadrado" → scale + pad to 1080x1080
- "Gera thumbnail" → extract best frame
- "Converte pra GIF" → fps + scale + palettegen

## REGRAS CRITICAS (aprendidas em producao)

### Audio/Video Sync — OBRIGATORIO em todo corte
WhatsApp videos vem com FPS e sample rates diferentes (30fps/44100Hz vs 59.94fps/48000Hz).
Se nao normalizar ANTES de concatenar, o audio fica atrasado.

**SEMPRE aplicar em CADA corte individual (nao so no final):**
```bash
ffmpeg -y -ss START -i input.mp4 -t DURATION \
  -vf "fps=30,scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:(ow-iw)/2:(oh-ih)/2:black,setpts=PTS-STARTPTS" \
  -af "aresample=48000,asetpts=PTS-STARTPTS" \
  -c:v libx264 -preset fast -crf 22 -c:a aac -b:a 128k -ar 48000 \
  -video_track_timescale 15360 \
  -movflags +faststart \
  output.mp4
```

**Apos concatenar, SEMPRE verificar e corrigir offset:**
```bash
# Verificar
ffprobe -v quiet -show_entries stream=start_time -select_streams v -of csv=p=0 final.mp4
ffprobe -v quiet -show_entries stream=start_time -select_streams a -of csv=p=0 final.mp4

# Se video start != 0.000000, corrigir:
ffmpeg -y -itsoffset -$OFFSET -i final.mp4 -i final.mp4 \
  -map 0:v -map 1:a -c copy -movflags +faststart fixed.mp4
```

**Checklist obrigatorio:**
- [ ] Todos os cortes em 30fps
- [ ] Todos os cortes em 48000Hz
- [ ] Todos com setpts=PTS-STARTPTS (video E audio)
- [ ] Todos com video_track_timescale=15360
- [ ] Apos concat: verificar start_time = 0.000000 em ambos
- [ ] Se offset != 0: corrigir com itsoffset

### Cortes — NAO cortar palavras
- **NUNCA cortar micro-trechos** (5-15s) de depoimentos — corta palavras no inicio/fim
- **PREFERIR usar o video quase inteiro** — so tirar aberturas genericas e fechamentos vazios
- **Padding minimo de 1.5s** antes e depois do trecho de fala
- Para depoimentos curtos (<60s): usar o video INTEIRO e so tirar silencio/filler
- Para depoimentos longos (>2min): cortar em blocos naturais de 20-40s, sempre em pausas de respiracao

### Estrutura de Copy para Compilados de Depoimentos
1. **HOOK/CREDIBILIDADE** — Abrir com o depoimento mais forte
2. **PROVA/TRANSFORMACAO** — Mostrar aprendizado ou mudanca (antes/depois)
3. **VALOR/ROI** — Depoimento que fala de investimento, retorno
4. **ANCORA DE PRECO** — Alguem dizendo que o valor e baixo (quebra objecao)
5. **CTA NATURAL** — Fechamento com recomendacao direta
6. **CTA ANIMADO** — Remotion com dados da oferta

### Gemini Transcription — JSON malformado
Gemini as vezes retorna JSON invalido na transcricao. SEMPRE usar o parser robusto:
1. Tentar `JSON.parse(cleaned)`
2. Se falhar: extrair array com regex `\[[\s\S]*\]`
3. Se falhar: retry com prompt mais estrito
4. NUNCA confiar que o primeiro parse vai funcionar

### Player Cache
Ao abrir video atualizado, o player pode cachear a versao antiga.
SEMPRE copiar pra um caminho novo antes de abrir:
```bash
cp output/final.mp4 ~/Desktop/VIDEO-NOVO.mp4 && open ~/Desktop/VIDEO-NOVO.mp4
```

## Organizacao de Pastas — OBRIGATORIO

Todos os entregaveis ficam em `~/Desktop/Videos Editados/`.
Para CADA video, criar uma subpasta com nome descritivo e TODOS os arquivos dentro:

```
~/Desktop/Videos Editados/
├── 01-Descricao-Do-Video/
│   ├── video-legendado-estrategico.mp4   ← video final
│   ├── capa-reels.jpg                    ← 1080x1920, textos zona segura
│   ├── caption.txt                       ← copy + hashtags
│   └── legendas.srt                      ← legendas pra uso externo
├── 02-Outro-Video/
│   └── ...
└── assets/
    └── cta-normalizado-30fps.mp4         ← CTA reutilizavel
```

**Regras de nomenclatura:**
- Pastas: `NN-Descricao-Curta`
- Numerar sequencialmente na ordem de criacao
- Video principal: `video-legendado-estrategico.mp4`
- Assets reutilizaveis vao na pasta `assets/`

**Checklist de entrega por video:**
- [ ] video-legendado-estrategico.mp4 (reordenado + legendas + CTA)
- [ ] capa-reels.jpg (1080x1920, zona segura)
- [ ] caption.txt (copy AIDA + 10 hashtags)
- [ ] legendas.srt (pra uso externo)

## Output Formats

| Format | Resolution | Use |
|--------|-----------|-----|
| Stories/Reels | 1080x1920 | Instagram/TikTok (default) |
| Feed | 1080x1080 | Instagram feed |
| YouTube | 1920x1080 | YouTube/horizontal |
| Thumbnail | 1280x720 | YouTube thumbnail |

Adjust with: `--format feed` or `--format youtube` (changes the scale filter in cut.js)
