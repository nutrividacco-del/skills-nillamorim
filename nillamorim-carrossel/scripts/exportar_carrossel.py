"""
Exportador de Carrossel Instagram — Oficina de Gaia
Converte cards HTML em PNG 1080x1080 usando Playwright.

USO:
  1. Editar as variaveis HTML_CARROSSEL, HTML_CAPA, OUTPUT_DIR e CARDS abaixo
  2. Rodar: python exportar_carrossel.py

REQUISITO: pip install playwright && playwright install chromium
"""

from playwright.sync_api import sync_playwright
from pathlib import Path
import time

# ── Configurar aqui ───────────────────────────────────────────
HTML_CARROSSEL = Path("E:/CLAUDE/Fabrica de Conteudos/carrossel-SLUG.html")
HTML_CAPA      = Path("E:/CLAUDE/Fabrica de Conteudos/carrossel-SLUG-capa-foto.html")
OUTPUT_DIR     = Path("E:/CLAUDE/Fabrica de Conteudos/carrossel-SLUG/")

# (id_do_elemento, nome_do_arquivo_sem_extensao)
CARDS = [
    ("capa-c",   "00_capa"),       # Capa com foto — HTML_CAPA
    ("card-01",  "01_intro"),
    ("card-02",  "02_card2"),
    # ... adicionar cards conforme o carrossel
    ("card-10",  "10_fechamento"),
]
# ─────────────────────────────────────────────────────────────


def exportar(page, html_path: Path, card_id: str, out_path: Path):
    page.goto(html_path.as_uri())
    page.wait_for_load_state("networkidle", timeout=15000)
    time.sleep(1.5)
    el = page.locator(f"#{card_id}")
    el.wait_for(state="visible", timeout=8000)
    el.screenshot(path=str(out_path))
    print(f"  >> {out_path.name}")


def main():
    OUTPUT_DIR.mkdir(exist_ok=True)
    print(f"\n[OK] Exportando para: {OUTPUT_DIR}\n")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={"width": 1080, "height": 1080},
            device_scale_factor=1,
        )
        page = ctx.new_page()

        for card_id, nome in CARDS:
            out = OUTPUT_DIR / f"{nome}.png"
            # Capa usa HTML separado
            html = HTML_CAPA if card_id.startswith("capa") else HTML_CARROSSEL
            exportar(page, html, card_id, out)

        browser.close()

    print(f"\n[DONE] {len(CARDS)} cards exportados em:\n   {OUTPUT_DIR}\n")


if __name__ == "__main__":
    main()
