---
name: nillamorim-pixel
description: Instala e configura o Meta Pixel com eventos padrão e customizados em projetos React + TypeScript. Inclui pixel base no index.html, utilitário centralizado (pixel.ts), tracking automático de scroll/tempo/exit intent, rastreamento de seções e eventos customizados em CTAs e formulários. Use quando o usuário pedir "configurar pixel", "adicionar pixel Meta", "instalar pixel do Facebook", "criar eventos de pixel" ou "rastrear eventos no site".
---

# nillamorim-pixel — Meta Pixel + Eventos

## Quando usar
Quando o usuário pedir para "configurar o pixel", "adicionar pixel Meta", "instalar pixel do Facebook", "criar eventos de pixel" ou "rastrear eventos no site".

## O que essa skill faz
Instala e configura o Meta Pixel com eventos padrão e customizados em projetos React + TypeScript. Cobre:
- Pixel base no `index.html`
- Utilitário centralizado (`pixel.ts`)
- Tracking automático de scroll, tempo e exit intent (`usePixelTracking.ts`)
- Rastreamento de seções (`SectionTracker.tsx`)
- Eventos customizados em todos os CTAs, formulários e interações

---

## PASSO 1 — Pixel no index.html

Adicionar dentro do `<head>` (substituir PIXEL_ID pelo ID real):

```html
<!-- Meta Pixel Code -->
<script>
  !function(f,b,e,v,n,t,s)
  {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};
  if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window, document,'script',
  'https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', 'PIXEL_ID');
  fbq('track', 'PageView');
</script>
<!-- End Meta Pixel Code -->
```

Adicionar no início do `<body>`:

```html
<noscript>
  <img height="1" width="1" style="display:none"
    src="https://www.facebook.com/tr?id=PIXEL_ID&ev=PageView&noscript=1"/>
</noscript>
```

---

## PASSO 2 — Criar src/lib/pixel.ts

```typescript
/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

function fbq(...args: any[]) {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    window.fbq(...args);
  }
}

// Eventos padrão Meta
export const pixelTrack = {
  pageView: () => fbq("track", "PageView"),

  viewContent: (params?: { content_name?: string; content_category?: string }) =>
    fbq("track", "ViewContent", params),

  initiateCheckout: (params?: { content_name?: string; value?: number; currency?: string }) =>
    fbq("track", "InitiateCheckout", { currency: "BRL", ...params }),

  lead: (params?: { content_name?: string }) =>
    fbq("track", "Lead", params),

  contact: () => fbq("track", "Contact"),

  purchase: (params?: { value?: number; currency?: string }) =>
    fbq("track", "Purchase", { currency: "BRL", value: 0, ...params }),
};

// Eventos customizados
export const pixelEvent = {
  // Cliques em CTAs (identificar qual seção)
  clickCTA: (section: string) =>
    fbq("trackCustom", "ClickCTA", { section }),

  clickDemoButton: () => fbq("trackCustom", "ClickDemoButton"),
  openChatBubble: () => fbq("trackCustom", "OpenChatBubble"),
  submitChatLead: () => fbq("trackCustom", "SubmitChatLead"),
  clickWhatsApp: () => fbq("trackCustom", "ClickWhatsApp"),

  // Engajamento comportamental (disparados automaticamente)
  scrollDepth: (percent: number) =>
    fbq("trackCustom", "ScrollDepth", { depth: `${percent}%` }),

  sectionView: (section: string) =>
    fbq("trackCustom", "SectionView", { section }),

  timeOnPage: (seconds: number) =>
    fbq("trackCustom", "TimeOnPage", { seconds }),

  faqClick: (question: string) =>
    fbq("trackCustom", "FAQClick", { question }),

  exitIntent: (params: { time_on_page: number; scroll_depth: number }) =>
    fbq("trackCustom", "ExitIntent", params),
};
```

---

## PASSO 3 — Criar src/hooks/usePixelTracking.ts

Dispara automaticamente ScrollDepth (25/50/75/100%), TimeOnPage (30s/60s/2min/5min) e ExitIntent. Basta chamar `usePixelTracking()` na página raiz.

```typescript
import { useEffect, useRef } from "react";
import { pixelEvent } from "@/lib/pixel";

export function usePixelTracking() {
  const scrollFiredRef = useRef(new Set<number>());
  const startTimeRef = useRef(Date.now());
  const maxScrollRef = useRef(0);
  const timeFiredRef = useRef(new Set<number>());

  // ScrollDepth: 25%, 50%, 75%, 100%
  useEffect(() => {
    const THRESHOLDS = [25, 50, 75, 100];
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      const percent = Math.round((scrollTop / docHeight) * 100);
      if (percent > maxScrollRef.current) maxScrollRef.current = percent;
      for (const threshold of THRESHOLDS) {
        if (percent >= threshold && !scrollFiredRef.current.has(threshold)) {
          scrollFiredRef.current.add(threshold);
          pixelEvent.scrollDepth(threshold);
        }
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // TimeOnPage: 30s, 60s, 2min, 5min
  useEffect(() => {
    const INTERVALS_SECONDS = [30, 60, 120, 300];
    const timers = INTERVALS_SECONDS.map((seconds) =>
      window.setTimeout(() => {
        if (!timeFiredRef.current.has(seconds)) {
          timeFiredRef.current.add(seconds);
          pixelEvent.timeOnPage(seconds);
        }
      }, seconds * 1000)
    );
    return () => timers.forEach((t) => clearTimeout(t));
  }, []);

  // ExitIntent: mouse sai pelo topo
  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY > 0) return;
      const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);
      pixelEvent.exitIntent({
        time_on_page: timeOnPage,
        scroll_depth: maxScrollRef.current,
      });
    };
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);
}
```

---

## PASSO 4 — Criar src/components/SectionTracker.tsx

Envolve qualquer seção e dispara `SectionView` uma vez quando ela aparece na tela.

```typescript
import { useEffect, useRef, type ReactNode } from "react";
import { pixelEvent } from "@/lib/pixel";

interface SectionTrackerProps {
  name: string;
  children: ReactNode;
  threshold?: number;
}

const SectionTracker = ({ name, children, threshold = 0.3 }: SectionTrackerProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          pixelEvent.sectionView(name);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [name, threshold]);

  return <div ref={ref}>{children}</div>;
};

export default SectionTracker;
```

---

## PASSO 5 — Usar na página raiz

```tsx
import { usePixelTracking } from "@/hooks/usePixelTracking";
import SectionTracker from "@/components/SectionTracker";

const Index = () => {
  usePixelTracking(); // ativa ScrollDepth + TimeOnPage + ExitIntent

  return (
    <div>
      <SectionTracker name="Hero"><HeroSection /></SectionTracker>
      <SectionTracker name="Dores"><ProblemSection /></SectionTracker>
      <SectionTracker name="Preco"><PricingSection /></SectionTracker>
      <SectionTracker name="FAQ"><FAQSection /></SectionTracker>
      {/* ... restante das seções */}
    </div>
  );
};
```

---

## PASSO 6 — Eventos manuais nos componentes

### Botão CTA / link para checkout:
```tsx
import { pixelTrack, pixelEvent } from "@/lib/pixel";

<a href={URL} onClick={() => {
  pixelEvent.clickCTA("NomeDaSecao");
  pixelTrack.initiateCheckout({ content_name: "Descrição", value: 49.90 });
}}>
```

### Formulário de lead (ao submeter com sucesso):
```tsx
pixelEvent.submitChatLead();
pixelTrack.lead({ content_name: "Nome do formulário" });
```

### Botão de WhatsApp:
```tsx
onClick={() => {
  pixelEvent.clickWhatsApp();
  pixelTrack.contact();
}}
```

### FAQ com Accordion do shadcn/ui:
```tsx
import { pixelEvent } from "@/lib/pixel";

<Accordion onValueChange={(value) => {
  if (value) pixelEvent.faqClick(faqItems[parseInt(value.replace("item-",""))]?.question ?? value);
}}>
```

### Página de sucesso de pagamento:
```tsx
import { useEffect } from "react";
import { pixelTrack } from "@/lib/pixel";

useEffect(() => {
  pixelTrack.purchase({ value: 497 }); // valor do produto
}, []);
```

---

## Eventos gerados (resumo para o Gerenciador de Eventos Meta)

| Evento | Tipo | Quando |
|--------|------|--------|
| PageView | Padrão | Ao carregar qualquer página |
| ViewContent | Padrão | Ao ver seção de preços |
| InitiateCheckout | Padrão | Clique em qualquer CTA |
| Lead | Padrão | Formulário enviado |
| Contact | Padrão | Clique no WhatsApp |
| Purchase | Padrão | Página de sucesso de pagamento |
| ClickCTA | Custom | Clique em CTA (com nome da seção) |
| ScrollDepth | Custom | 25%, 50%, 75%, 100% da página |
| SectionView | Custom | Cada seção que o usuário vê |
| TimeOnPage | Custom | 30s, 60s, 2min, 5min |
| FAQClick | Custom | Pergunta do FAQ aberta |
| ExitIntent | Custom | Mouse sai pelo topo |
| OpenChatBubble | Custom | Abre o chat flutuante |
| SubmitChatLead | Custom | Lead enviado pelo chat |
| ClickWhatsApp | Custom | Clique no link do WhatsApp |
