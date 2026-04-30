---
name: nillamorim-carrossel
description: >
  Cria carrosseis completos para Instagram da Oficina de Gaia: HTML 1080x1080px por card,
  exporta automaticamente para PNG via Playwright e salva em ~/skills-conteudos/.
  Use quando o usuario pedir "carrossel", "carousel", "slides para Instagram", "cards para post",
  "sequencia de posts", "carrossel educativo" ou qualquer sequencia de imagens para feed do Instagram.
  Aplica o design system aprovado da Oficina de Gaia (paleta creme/dourado/marrom, Montserrat, layout centralizado).
---

# Carrossel Instagram — Oficina de Gaia

## Workflow

1. Receber os textos dos cards (rascunho ou final)
2. Perguntar se tem foto para a capa (pasta `~/skills-fotos-marca/`) — se sim, usar como background
3. Gerar HTML com todos os cards
4. Rodar exportacao automatica via Playwright
5. Confirmar PNGs gerados mostrando preview de 3 cards

## Design System Aprovado

### Paleta
- Fundo claro: `#F7F1E6`
- Fundo escuro (capa/fechamento): `#231708`
- Dourado: `#C49A28`
- Texto principal: `#1C1208`
- Texto secundario fundo claro: `#4A3A28` — NUNCA `#7A6A52` (contraste ruim no creme)
- Texto secundario fundo escuro: `#9A8770`

### Tipografia
- Familia: Montserrat via Google Fonts CDN
- Titulos impacto: weight 800-900
- Corpo: weight 400-600
- Introducoes suaves: italic weight 300

### Layout dos Cards
- Tamanho: 1080x1080px, padding 72px
- Conteudo: `justify-content: center` — texto fica centralizado verticalmente
- Footer branding: `position: absolute; bottom: 72px; left: 72px; right: 72px`
- Alinhamento: texto sempre a esquerda

### O que NAO fazer
- NAO colocar header "OFICINA DE GAIA" + linha no topo — fica minusculo e ilegivel
- NAO usar `margin-top: auto` no footer — empurra conteudo para cima com espaco vazio embaixo
- Bullets: usar `span` com `•` em texto, NAO divs com border-radius (falha de renderizacao)

### Elementos Decorativos
- Fios de acafrao: SVG 3 filamentos + bolinhas, canto superior direito, opacity 0.4-0.55
- Ghost word: texto transparente com `-webkit-text-stroke` dourado, position absolute no fundo
- Divisores: linha `#C49A28` 2px solido ou gradiente fadindo para transparente

### Cards Escuros (capa e fechamento)
- Background `#231708`, texto `#F7F1E6`, destaque `#C49A28`
- Incluir ghost word com palavra-chave do tema no fundo

## CSS Essencial

```css
.card {
  width: 1080px; height: 1080px;
  display: flex; flex-direction: column; justify-content: center;
  padding: 72px; position: relative; overflow: hidden;
  background: #F7F1E6;
}
.dark { background: #231708; }
.card-foot {
  position: absolute; bottom: 72px; left: 72px; right: 72px;
  display: flex; justify-content: space-between;
}
.foot-brand { font-size:14px; font-weight:700; letter-spacing:0.3em; text-transform:uppercase; color:#C49A28; }
.foot-handle { font-size:14px; letter-spacing:0.15em; color:#4A3A28; }
.dark .foot-handle { color: rgba(196,154,40,0.5); }
.dark .c-muted { color: #9A8770; }
```

## Capa com Foto

- Buscar em `~/skills-fotos-marca/` — preferir fotos no atelier/saboaria produzindo
- Overlay gradiente diagonal: escuro onde esta o texto, abre na foto
- Sem header, sem tag pill — conteudo comeca direto com linha introdutoria
- Footer absoluto no rodape

```css
.bg { position:absolute; inset:0; background-size:cover; }
.overlay { position:absolute; inset:0;
  background: linear-gradient(108deg,
    rgba(8,5,2,0.94) 0%, rgba(8,5,2,0.85) 30%,
    rgba(8,5,2,0.50) 58%, rgba(8,5,2,0.30) 100%); }
```

## Exportacao Automatica (Playwright)

Script: `scripts/exportar_carrossel.py`

Editar variaveis no topo e rodar: `python exportar_carrossel.py`

Requisito: `pip install playwright` + `playwright install chromium`

## Nomenclatura

- HTML: `~/skills-conteudos/carrossel-[slug].html`
- Capa: `~/skills-conteudos/carrossel-[slug]-capa-foto.html`
- PNGs: `~/skills-conteudos/carrossel-[slug]\00_capa.png`, `01_xxx.png` ...

## Footer (obrigatorio em todos os cards)
- Esquerda: `OFICINA DE GAIA` — uppercase, letter-spacing 0.3em, cor `#C49A28`
- Direita: `@oficinadegaia.saboaria` — letter-spacing 0.15em, cor muted
