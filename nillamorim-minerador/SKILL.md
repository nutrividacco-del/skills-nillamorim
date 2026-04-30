---
name: nillamorim-minerador
description: "Cria um Minerador Inteligente de WhatsApp — ferramenta que monitora grupos, classifica mensagens com IA, gera relatórios diários com brainstorm estratégico e envia resumo por WhatsApp. Use quando o usuario pedir: minerador whatsapp, monitorar grupos, extrair depoimentos whatsapp, minerador de grupos, capturar mensagens whatsapp, relatorio de grupo, whatsapp minerador, minerar whatsapp, espionar grupo (de forma ética), ou qualquer ferramenta de extração inteligente de mensagens de grupos do WhatsApp."
---

# Minerador Inteligente de WhatsApp

Você é um especialista em automação de WhatsApp. Sua missão é criar um **Minerador Inteligente de Grupos do WhatsApp** personalizado para o usuário.

## O que o Minerador faz

1. **Captura** mensagens dos grupos do WhatsApp escolhidos (24h/dia)
2. **Classifica com IA** cada mensagem automaticamente: depoimento, dúvida, dor, insight, resultado, elogio
3. **Gera relatório diário** com tudo organizado por categoria e relevância
4. **Cria brainstorm estratégico** com ideias de conteúdo, oportunidades de produto e alertas
5. **Envia resumo no WhatsApp** pessoal do usuário todo dia no horário escolhido

## Fluxo de Setup (siga esta ordem)

### ETAPA 1 — Coleta de informações

Pergunte ao usuário (pode ser tudo de uma vez):

1. **Qual é o seu nicho/negócio?** (ex: estética, fitness, marketing, educação) — isso personaliza a classificação da IA
2. **Quais grupos quer monitorar?** (nomes dos grupos do WhatsApp)
3. **Qual o número que vai RECEBER o resumo diário?** (com DDD e código do país, ex: +5511999999999)
4. **Tem chave da API OpenAI?** Se não, explique:
   - Acesse platform.openai.com (pode usar a mesma conta do ChatGPT)
   - Vá em API Keys → Create new secret key
   - Adicione créditos (US$5 bastam — o modelo gpt-4o-mini custa centavos)
5. **Onde quer rodar?** Opções:
   - **No computador** (precisa deixar terminal aberto)
   - **Num servidor VPS** (roda 24h — recomendado). Se tiver servidor, peça IP e acesso SSH.
6. **Que horário quer receber o resumo?** (padrão: 22h)

### ETAPA 2 — Criar o projeto

Crie a pasta do projeto e todos os arquivos abaixo. **IMPORTANTE:** Personalize o prompt do classificador e do brainstorm com o nicho do usuário.

#### Estrutura de arquivos:
```
whatsapp-minerador/
├── package.json
├── .env
├── .gitignore
├── src/
│   ├── config.js
│   ├── database.js
│   ├── classifier.js
│   ├── brainstorm.js
│   ├── reporter.js
│   ├── index.js
│   ├── gerar-relatorio.js
│   └── qr-server.js
├── reports/
└── data/
```

#### package.json
```json
{
  "name": "whatsapp-minerador",
  "version": "1.0.0",
  "description": "Minerador inteligente de grupos do WhatsApp",
  "type": "module",
  "scripts": {
    "start": "node src/index.js",
    "relatorio": "node src/gerar-relatorio.js",
    "qr": "node src/qr-server.js"
  },
  "dependencies": {
    "whatsapp-web.js": "^1.26.1-alpha.3",
    "qrcode-terminal": "^0.12.0",
    "better-sqlite3": "^11.7.0",
    "openai": "^4.77.0",
    "node-cron": "^3.0.3",
    "dotenv": "^16.4.7"
  }
}
```

#### .env
```
OPENAI_API_KEY={{chave do usuário}}
GRUPOS_MONITORAR={{nomes dos grupos separados por vírgula}}
HORARIO_RELATORIO={{cron do horário escolhido, ex: 0 22 * * *}}
MIN_MENSAGENS=5
NUMERO_RELATORIO={{número do usuário sem +}}
```

#### .gitignore
```
node_modules/
data/
.env
reports/
```

#### src/config.js
```javascript
import 'dotenv/config';

export const config = {
  openaiKey: process.env.OPENAI_API_KEY,
  gruposMonitorar: process.env.GRUPOS_MONITORAR
    ? process.env.GRUPOS_MONITORAR.split(',').map(g => g.trim())
    : [],
  horarioRelatorio: process.env.HORARIO_RELATORIO || '0 22 * * *',
  minMensagens: parseInt(process.env.MIN_MENSAGENS) || 5,
  dbPath: new URL('../data/minerador.db', import.meta.url).pathname,
  reportsPath: new URL('../reports/', import.meta.url).pathname,
  sessionPath: new URL('../data/wwebjs-session/', import.meta.url).pathname,
  numeroRelatorio: process.env.NUMERO_RELATORIO || null,
};
```

#### src/database.js
```javascript
import Database from 'better-sqlite3';
import { config } from './config.js';

let db;

export function initDB() {
  db = new Database(config.dbPath);
  db.pragma('journal_mode = WAL');

  db.exec(`
    CREATE TABLE IF NOT EXISTS mensagens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      whatsapp_id TEXT UNIQUE,
      grupo TEXT NOT NULL,
      autor TEXT,
      conteudo TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      data_hora TEXT NOT NULL,
      classificacao TEXT DEFAULT 'pendente',
      subcategoria TEXT,
      resumo TEXT,
      sentimento TEXT,
      relevancia INTEGER DEFAULT 0,
      processada INTEGER DEFAULT 0,
      criado_em TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_grupo ON mensagens(grupo);
    CREATE INDEX IF NOT EXISTS idx_classificacao ON mensagens(classificacao);
    CREATE INDEX IF NOT EXISTS idx_timestamp ON mensagens(timestamp);
    CREATE INDEX IF NOT EXISTS idx_processada ON mensagens(processada);
  `);

  return db;
}

export function salvarMensagem({ whatsappId, grupo, autor, conteudo, timestamp }) {
  const dataHora = new Date(timestamp * 1000).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });

  const stmt = db.prepare(`
    INSERT OR IGNORE INTO mensagens (whatsapp_id, grupo, autor, conteudo, timestamp, data_hora)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  return stmt.run(whatsappId, grupo, autor, conteudo, timestamp, dataHora);
}

export function buscarNaoProcessadas(limite = 50) {
  return db.prepare(`
    SELECT id, grupo, autor, conteudo, data_hora
    FROM mensagens
    WHERE processada = 0
    ORDER BY timestamp ASC
    LIMIT ?
  `).all(limite);
}

export function atualizarClassificacao(id, { classificacao, subcategoria, resumo, sentimento, relevancia }) {
  db.prepare(`
    UPDATE mensagens
    SET classificacao = ?, subcategoria = ?, resumo = ?, sentimento = ?, relevancia = ?, processada = 1
    WHERE id = ?
  `).run(classificacao, subcategoria, resumo, sentimento, relevancia, id);
}

export function buscarPorPeriodo(dataInicio, dataFim) {
  return db.prepare(`
    SELECT *
    FROM mensagens
    WHERE timestamp >= ? AND timestamp < ?
      AND classificacao != 'irrelevante'
    ORDER BY relevancia DESC, timestamp ASC
  `).all(dataInicio, dataFim);
}

export function buscarDepoimentos(limite = 20) {
  return db.prepare(`
    SELECT grupo, autor, conteudo, resumo, data_hora, relevancia
    FROM mensagens
    WHERE classificacao = 'depoimento'
    ORDER BY timestamp DESC
    LIMIT ?
  `).all(limite);
}

export function estatisticas(dataInicio, dataFim) {
  return db.prepare(`
    SELECT classificacao, COUNT(*) as total
    FROM mensagens
    WHERE timestamp >= ? AND timestamp < ?
      AND processada = 1
    GROUP BY classificacao
    ORDER BY total DESC
  `).all(dataInicio, dataFim);
}

export function getDB() {
  return db;
}
```

#### src/classifier.js

**IMPORTANTE:** Personalize o `PROMPT_SISTEMA` com o nicho do usuário. Substitua referências a skincare/estética pelo nicho real (fitness, marketing, educação, etc). Os critérios de classificação devem refletir o que é relevante para o negócio do usuário.

```javascript
import OpenAI from 'openai';
import { config } from './config.js';
import { buscarNaoProcessadas, atualizarClassificacao } from './database.js';

const openai = new OpenAI({ apiKey: config.openaiKey });

const PROMPT_SISTEMA = `Você é um assistente de {{NOME DO USUÁRIO}}, especialista em {{NICHO DO USUÁRIO}}.

Sua tarefa é classificar mensagens de grupos de WhatsApp de {{PÚBLICO DO USUÁRIO — ex: alunas, clientes, membros}}.

Para CADA mensagem, retorne um JSON com:
{
  "classificacao": "depoimento" | "duvida" | "dor" | "insight" | "resultado_clinico" | "pedido_ajuda" | "elogio" | "irrelevante",
  "subcategoria": "string curta descrevendo o subtema",
  "resumo": "resumo de 1 linha do que a pessoa disse",
  "sentimento": "positivo" | "negativo" | "neutro",
  "relevancia": 1-10 (10 = extremamente relevante para marketing/produto/conteúdo)
}

Critérios de classificação:
- **depoimento**: relatos de resultado, antes/depois, agradecimentos por transformação, elogios ao método/curso
- **duvida**: perguntas sobre {{TEMAS RELEVANTES DO NICHO}}
- **dor**: frustrações, medos, inseguranças, reclamações, dificuldades
- **insight**: observações inteligentes, sugestões, conexões entre conceitos, ideias
- **resultado_clinico**: relatos de resultados concretos, casos de sucesso, evolução
- **pedido_ajuda**: pedidos diretos de ajuda ou orientação
- **elogio**: elogios diretos ao profissional, ao método, ao curso
- **irrelevante**: bom dia, figurinhas, conversas genéricas, links aleatórios, mensagens muito curtas sem contexto

Depoimentos e resultados com alta relevância são OURO — classifique com relevância 8-10.
Dúvidas recorrentes são muito valiosas para conteúdo — relevância 6-8.
Dores e frustrações são valiosas para copy — relevância 7-9.`;

export async function classificarLote() {
  const mensagens = buscarNaoProcessadas(30);

  if (mensagens.length === 0) {
    return { processadas: 0 };
  }

  const batches = [];
  for (let i = 0; i < mensagens.length; i += 10) {
    batches.push(mensagens.slice(i, i + 10));
  }

  let totalProcessadas = 0;

  for (const batch of batches) {
    const mensagensFormatadas = batch.map((m, i) =>
      `[${i}] Grupo: ${m.grupo} | Autor: ${m.autor} | Mensagem: ${m.conteudo}`
    ).join('\n\n');

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.1,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: PROMPT_SISTEMA },
          {
            role: 'user',
            content: `Classifique estas ${batch.length} mensagens. Retorne um JSON com a chave "resultados" contendo um array de objetos na mesma ordem:\n\n${mensagensFormatadas}`
          }
        ]
      });

      const resultado = JSON.parse(response.choices[0].message.content);
      const classificacoes = resultado.resultados || [];

      for (let i = 0; i < batch.length; i++) {
        const c = classificacoes[i];
        if (c) {
          atualizarClassificacao(batch[i].id, {
            classificacao: c.classificacao,
            subcategoria: c.subcategoria || null,
            resumo: c.resumo || null,
            sentimento: c.sentimento || 'neutro',
            relevancia: c.relevancia || 0,
          });
          totalProcessadas++;
        }
      }
    } catch (err) {
      console.error('Erro ao classificar batch:', err.message);
      for (const m of batch) {
        atualizarClassificacao(m.id, {
          classificacao: 'erro',
          subcategoria: null,
          resumo: err.message,
          sentimento: 'neutro',
          relevancia: 0,
        });
      }
    }
  }

  return { processadas: totalProcessadas, total: mensagens.length };
}
```

#### src/brainstorm.js

**IMPORTANTE:** Personalize o `PROMPT_BRAINSTORM` com o nicho, nome, produtos e público do usuário.

```javascript
import OpenAI from 'openai';
import { config } from './config.js';

const openai = new OpenAI({ apiKey: config.openaiKey });

const PROMPT_BRAINSTORM = `Você é a estrategista digital de {{NOME DO USUÁRIO}} — {{DESCRIÇÃO CURTA DO PROFISSIONAL E NICHO}}.

Ele(a) tem:
{{LISTA DE PRODUTOS/SERVIÇOS DO USUÁRIO}}

Você vai receber as mensagens relevantes dos grupos do dia. Analise TUDO e gere um brainstorm estratégico com:

1. **DEPOIMENTOS OURO** — Os depoimentos mais poderosos do dia, já formatados para uso em:
   - Stories (versão curta)
   - Página de vendas (versão completa)
   - Legenda de post (com contexto)

2. **IDEIAS DE CONTEÚDO** (3-5 ideias) — Baseadas nas dúvidas e dores reais:
   - Formato sugerido (Reels, carrossel, live, stories)
   - Gancho/hook para começar
   - Por que esse tema é relevante agora

3. **OPORTUNIDADES DE PRODUTO** — Dores recorrentes que poderiam virar:
   - Um novo módulo ou bônus
   - Uma aula extra
   - Um material/template
   - Um produto digital novo

4. **ALERTAS IMPORTANTES** — Coisas que precisa saber:
   - Frustrações ou reclamações que precisam de atenção
   - Pedidos de ajuda urgentes
   - Tendências que estão surgindo
   - Elogios excepcionais que merecem destaque

5. **DÚVIDAS QUE VIRAM AUTORIDADE** — Dúvidas que, se respondidas em público, posicionam como referência

Seja específica, prática e direta. Cada ideia deve ser acionável — algo que pode ser feito AMANHÃ.

Responda em JSON com a estrutura:
{
  "depoimentos_ouro": [{ "autor": "", "original": "", "versao_stories": "", "versao_pagina": "", "versao_legenda": "" }],
  "ideias_conteudo": [{ "titulo": "", "formato": "", "hook": "", "por_que_agora": "" }],
  "oportunidades_produto": [{ "ideia": "", "por_que": "", "proximo_passo": "" }],
  "alertas": [{ "tipo": "frustracao|urgente|tendencia|elogio", "descricao": "", "acao_sugerida": "" }],
  "duvidas_autoridade": [{ "duvida": "", "por_que_responder": "", "formato_sugerido": "" }]
}`;

export async function gerarBrainstorm(mensagens) {
  if (!mensagens || mensagens.length === 0) return null;

  const porCategoria = {};
  for (const m of mensagens) {
    if (!porCategoria[m.classificacao]) porCategoria[m.classificacao] = [];
    porCategoria[m.classificacao].push(m);
  }

  let contexto = 'Mensagens relevantes dos grupos hoje:\n\n';

  const categorias = ['depoimento', 'resultado_clinico', 'dor', 'duvida', 'insight', 'elogio', 'pedido_ajuda'];
  for (const cat of categorias) {
    const msgs = porCategoria[cat];
    if (!msgs || msgs.length === 0) continue;
    contexto += `=== ${cat.toUpperCase()} (${msgs.length}) ===\n`;
    for (const m of msgs) {
      contexto += `[${m.autor || 'Anônimo'}] (grupo: ${m.grupo}) (relevância: ${m.relevancia}/10): ${m.conteudo}\n\n`;
    }
  }

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.7,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: PROMPT_BRAINSTORM },
        { role: 'user', content: contexto }
      ]
    });

    return JSON.parse(response.choices[0].message.content);
  } catch (err) {
    console.error('Erro ao gerar brainstorm:', err.message);
    return null;
  }
}

export function formatarBrainstormMarkdown(b) {
  if (!b) return '';

  let md = `\n---\n\n# 🧠 Brainstorm Estratégico do Dia\n\n`;

  if (b.depoimentos_ouro && b.depoimentos_ouro.length > 0) {
    md += `## ⭐ Depoimentos Ouro\n\n`;
    for (const d of b.depoimentos_ouro) {
      md += `### ${d.autor || 'Membro'}\n`;
      md += `**Original:** "${d.original}"\n\n`;
      md += `📱 **Para Stories:** ${d.versao_stories}\n\n`;
      md += `🛒 **Para Página de Vendas:** ${d.versao_pagina}\n\n`;
      md += `📝 **Para Legenda:** ${d.versao_legenda}\n\n`;
    }
  }

  if (b.ideias_conteudo && b.ideias_conteudo.length > 0) {
    md += `## 💡 Ideias de Conteúdo\n\n`;
    for (const i of b.ideias_conteudo) {
      md += `### ${i.titulo}\n`;
      md += `- **Formato:** ${i.formato}\n`;
      md += `- **Hook:** "${i.hook}"\n`;
      md += `- **Por que agora:** ${i.por_que_agora}\n\n`;
    }
  }

  if (b.oportunidades_produto && b.oportunidades_produto.length > 0) {
    md += `## 🚀 Oportunidades de Produto\n\n`;
    for (const o of b.oportunidades_produto) {
      md += `### ${o.ideia}\n`;
      md += `- **Por quê:** ${o.por_que}\n`;
      md += `- **Próximo passo:** ${o.proximo_passo}\n\n`;
    }
  }

  if (b.alertas && b.alertas.length > 0) {
    const icones = { frustracao: '⚠️', urgente: '🚨', tendencia: '📈', elogio: '🏆' };
    md += `## 🔔 Alertas\n\n`;
    for (const a of b.alertas) {
      md += `${icones[a.tipo] || '📌'} **${a.descricao}**\n`;
      md += `→ ${a.acao_sugerida}\n\n`;
    }
  }

  if (b.duvidas_autoridade && b.duvidas_autoridade.length > 0) {
    md += `## 🎓 Dúvidas que Viram Autoridade\n\n`;
    for (const d of b.duvidas_autoridade) {
      md += `### "${d.duvida}"\n`;
      md += `- **Por que responder:** ${d.por_que_responder}\n`;
      md += `- **Formato:** ${d.formato_sugerido}\n\n`;
    }
  }

  return md;
}

export function formatarBrainstormWhatsApp(b) {
  if (!b) return '';

  let msg = `\n\n🧠 *BRAINSTORM DO DIA*\n`;

  if (b.depoimentos_ouro && b.depoimentos_ouro.length > 0) {
    msg += `\n⭐ *Depoimentos prontos pra usar:*\n`;
    for (const d of b.depoimentos_ouro.slice(0, 2)) {
      msg += `\n📱 Stories: _${d.versao_stories}_\n`;
    }
  }

  if (b.ideias_conteudo && b.ideias_conteudo.length > 0) {
    msg += `\n💡 *Ideias de conteúdo:*\n`;
    for (const i of b.ideias_conteudo.slice(0, 3)) {
      msg += `• *${i.titulo}* (${i.formato})\n  Hook: "${i.hook}"\n`;
    }
  }

  if (b.oportunidades_produto && b.oportunidades_produto.length > 0) {
    msg += `\n🚀 *Oportunidades de produto:*\n`;
    for (const o of b.oportunidades_produto.slice(0, 2)) {
      msg += `• ${o.ideia}\n`;
    }
  }

  if (b.alertas && b.alertas.length > 0) {
    const icones = { frustracao: '⚠️', urgente: '🚨', tendencia: '📈', elogio: '🏆' };
    msg += `\n🔔 *Alertas:*\n`;
    for (const a of b.alertas.slice(0, 2)) {
      msg += `${icones[a.tipo] || '📌'} ${a.descricao}\n`;
    }
  }

  if (b.duvidas_autoridade && b.duvidas_autoridade.length > 0) {
    msg += `\n🎓 *Responda em público (vira autoridade):*\n`;
    for (const d of b.duvidas_autoridade.slice(0, 2)) {
      msg += `• "${d.duvida}" → ${d.formato_sugerido}\n`;
    }
  }

  return msg;
}
```

#### src/reporter.js
```javascript
import { writeFileSync } from 'fs';
import { join } from 'path';
import { config } from './config.js';
import { buscarPorPeriodo, estatisticas } from './database.js';
import { gerarBrainstorm, formatarBrainstormMarkdown, formatarBrainstormWhatsApp } from './brainstorm.js';

export async function gerarRelatorio(data = new Date()) {
  const inicio = new Date(data);
  inicio.setHours(0, 0, 0, 0);
  const fim = new Date(data);
  fim.setHours(23, 59, 59, 999);

  const tsInicio = Math.floor(inicio.getTime() / 1000);
  const tsFim = Math.floor(fim.getTime() / 1000);

  const mensagens = buscarPorPeriodo(tsInicio, tsFim);
  const stats = estatisticas(tsInicio, tsFim);

  if (mensagens.length === 0) {
    console.log('Nenhuma mensagem relevante para gerar relatório.');
    return null;
  }

  const grupos = {};
  for (const m of mensagens) {
    if (!grupos[m.classificacao]) grupos[m.classificacao] = [];
    grupos[m.classificacao].push(m);
  }

  const dataFormatada = data.toLocaleDateString('pt-BR');
  const nomeArquivo = `relatorio-${data.toISOString().split('T')[0]}.md`;

  const emojis = {
    depoimento: '⭐', resultado_clinico: '🔬', duvida: '❓',
    dor: '💔', insight: '💡', pedido_ajuda: '🆘', elogio: '🏆',
  };
  const titulos = {
    depoimento: 'Depoimentos', resultado_clinico: 'Resultados Clínicos',
    duvida: 'Dúvidas (oportunidade de conteúdo)', dor: 'Dores e Frustrações (oportunidade de copy)',
    insight: 'Insights e Ideias', pedido_ajuda: 'Pedidos de Ajuda', elogio: 'Elogios',
  };

  let md = `# Relatório Minerador — ${dataFormatada}\n\n`;
  md += `## Resumo do Dia\n\n`;
  md += `| Categoria | Quantidade |\n|---|---|\n`;
  for (const s of stats) {
    if (s.classificacao !== 'irrelevante') {
      md += `| ${emojis[s.classificacao] || '📌'} ${titulos[s.classificacao] || s.classificacao} | ${s.total} |\n`;
    }
  }
  md += `\n**Total de mensagens relevantes:** ${mensagens.length}\n\n`;

  const ordemPrioridade = ['depoimento', 'resultado_clinico', 'dor', 'duvida', 'insight', 'elogio', 'pedido_ajuda'];
  for (const cat of ordemPrioridade) {
    const msgs = grupos[cat];
    if (!msgs || msgs.length === 0) continue;
    msgs.sort((a, b) => b.relevancia - a.relevancia);
    md += `---\n\n## ${emojis[cat] || '📌'} ${titulos[cat] || cat}\n\n`;
    for (const m of msgs) {
      const estrelas = '★'.repeat(Math.min(m.relevancia, 10));
      md += `### ${m.resumo || 'Sem resumo'}\n`;
      md += `- **Grupo:** ${m.grupo}\n`;
      md += `- **Autor:** ${m.autor || 'Anônimo'}\n`;
      md += `- **Horário:** ${m.data_hora}\n`;
      md += `- **Relevância:** ${estrelas} (${m.relevancia}/10)\n`;
      if (m.subcategoria) md += `- **Tema:** ${m.subcategoria}\n`;
      md += `\n> ${m.conteudo.replace(/\n/g, '\n> ')}\n\n`;
    }
  }

  if (grupos.depoimento) {
    md += `---\n\n## 📋 Depoimentos Prontos para Copiar\n\n`;
    md += `*Use em páginas de venda, stories e ads:*\n\n`;
    for (const m of grupos.depoimento.filter(d => d.relevancia >= 7)) {
      md += `> "${m.conteudo.replace(/\n/g, ' ').trim()}"\n> — ${m.autor || 'Membro'}, ${m.grupo}\n\n`;
    }
  }

  if (grupos.duvida && grupos.duvida.length >= 2) {
    const temas = {};
    for (const m of grupos.duvida) {
      const tema = m.subcategoria || 'geral';
      temas[tema] = (temas[tema] || 0) + 1;
    }
    md += `---\n\n## 📊 Temas Mais Perguntados (ideias de conteúdo)\n\n`;
    const sorted = Object.entries(temas).sort((a, b) => b[1] - a[1]);
    for (const [tema, count] of sorted) {
      md += `- **${tema}** — ${count} menção(ões)\n`;
    }
    md += `\n`;
  }

  console.log('🧠 Gerando brainstorm estratégico...');
  const brainstorm = await gerarBrainstorm(mensagens);
  if (brainstorm) {
    md += formatarBrainstormMarkdown(brainstorm);
  }

  const caminho = join(config.reportsPath, nomeArquivo);
  writeFileSync(caminho, md, 'utf-8');
  console.log(`✅ Relatório salvo: ${caminho}`);

  const resumoWpp = gerarResumoWhatsApp(dataFormatada, stats, grupos) + formatarBrainstormWhatsApp(brainstorm);
  return { caminho, resumoWhatsApp: resumoWpp };
}

function gerarResumoWhatsApp(dataFormatada, stats, grupos) {
  let msg = `📊 *Minerador — ${dataFormatada}*\n\n`;

  const emojis = {
    depoimento: '⭐', resultado_clinico: '🔬', duvida: '❓',
    dor: '💔', insight: '💡', pedido_ajuda: '🆘', elogio: '🏆',
  };
  const titulos = {
    depoimento: 'Depoimentos', resultado_clinico: 'Resultados',
    duvida: 'Dúvidas', dor: 'Dores', insight: 'Insights',
    pedido_ajuda: 'Pedidos de Ajuda', elogio: 'Elogios',
  };

  msg += `*Resumo:*\n`;
  for (const s of stats) {
    if (s.classificacao !== 'irrelevante' && s.classificacao !== 'erro') {
      msg += `${emojis[s.classificacao] || '📌'} ${titulos[s.classificacao] || s.classificacao}: ${s.total}\n`;
    }
  }

  if (grupos.depoimento && grupos.depoimento.length > 0) {
    const top = grupos.depoimento.sort((a, b) => b.relevancia - a.relevancia).slice(0, 3);
    msg += `\n⭐ *Melhores depoimentos:*\n`;
    for (const m of top) {
      const texto = m.conteudo.length > 200 ? m.conteudo.substring(0, 200) + '...' : m.conteudo;
      msg += `\n> _"${texto.replace(/\n/g, ' ')}"_\n> — ${m.autor || 'Membro'}\n`;
    }
  }

  if (grupos.dor && grupos.dor.length > 0) {
    const top = grupos.dor.sort((a, b) => b.relevancia - a.relevancia).slice(0, 2);
    msg += `\n💔 *Dores detectadas:*\n`;
    for (const m of top) {
      msg += `• ${m.resumo || m.conteudo.substring(0, 100)}\n`;
    }
  }

  if (grupos.duvida && grupos.duvida.length > 0) {
    const top = grupos.duvida.sort((a, b) => b.relevancia - a.relevancia).slice(0, 3);
    msg += `\n❓ *Dúvidas mais relevantes:*\n`;
    for (const m of top) {
      msg += `• ${m.resumo || m.conteudo.substring(0, 100)}\n`;
    }
  }

  msg += `\n_Relatório completo salvo no computador._`;
  return msg;
}
```

#### src/index.js
```javascript
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import cron from 'node-cron';
import { config } from './config.js';
import { initDB, salvarMensagem } from './database.js';
import { classificarLote } from './classifier.js';
import { gerarRelatorio } from './reporter.js';

const db = initDB();

const client = new Client({
  authStrategy: new LocalAuth({
    dataPath: config.sessionPath,
  }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  },
});

client.on('qr', (qr) => {
  console.log('\n📱 Escaneie o QR Code abaixo com seu WhatsApp:\n');
  qrcode.generate(qr, { small: true });
  console.log('\nAbra WhatsApp > Dispositivos conectados > Conectar dispositivo\n');
});

client.on('authenticated', () => {
  console.log('✅ Autenticado com sucesso!');
});

client.on('ready', async () => {
  console.log('🟢 WhatsApp Minerador conectado e rodando!\n');

  const chats = await client.getChats();
  const grupos = chats.filter(c => c.isGroup);

  console.log('📋 Grupos encontrados:');
  grupos.forEach(g => {
    const monitorado = config.gruposMonitorar.length === 0 ||
      config.gruposMonitorar.some(nome => g.name.includes(nome));
    console.log(`  ${monitorado ? '✅' : '⬜'} ${g.name} (${g.id._serialized})`);
  });

  if (config.gruposMonitorar.length === 0) {
    console.log('\n⚠️  Nenhum grupo configurado. Monitorando TODOS os grupos.\n');
  } else {
    console.log(`\n🎯 Monitorando: ${config.gruposMonitorar.join(', ')}\n`);
  }

  cron.schedule('*/30 * * * *', async () => {
    console.log(`[${new Date().toLocaleTimeString('pt-BR')}] 🔄 Classificando mensagens...`);
    const resultado = await classificarLote();
    console.log(`   → ${resultado.processadas}/${resultado.total} mensagens classificadas`);
  });

  cron.schedule(config.horarioRelatorio, async () => {
    console.log(`[${new Date().toLocaleTimeString('pt-BR')}] 📊 Gerando relatório diário...`);
    const resultado = await gerarRelatorio(new Date());
    if (resultado && config.numeroRelatorio) {
      await enviarResumoWhatsApp(resultado.resumoWhatsApp);
    }
  });

  console.log(`⏰ Classificação: a cada 30 min | Relatório: ${config.horarioRelatorio}`);
  if (config.numeroRelatorio) {
    console.log(`📲 Resumo diário será enviado para: +${config.numeroRelatorio}\n`);
  }
});

client.on('message', async (msg) => {
  try {
    const chat = await msg.getChat();
    if (!chat.isGroup) return;

    if (config.gruposMonitorar.length > 0) {
      const monitorado = config.gruposMonitorar.some(nome => chat.name.includes(nome));
      if (!monitorado) return;
    }

    if (msg.type !== 'chat' && !msg.body) return;
    if (!msg.body || msg.body.trim().length < 5) return;

    const contato = await msg.getContact();
    const autor = contato.pushname || contato.name || msg.author || 'Desconhecido';

    const result = salvarMensagem({
      whatsappId: msg.id._serialized,
      grupo: chat.name,
      autor: autor,
      conteudo: msg.body,
      timestamp: msg.timestamp,
    });

    if (result.changes > 0) {
      console.log(`💬 [${chat.name}] ${autor}: ${msg.body.substring(0, 60)}...`);
    }
  } catch (err) {
    // Silenciar erros individuais
  }
});

async function enviarResumoWhatsApp(texto) {
  try {
    const chatId = config.numeroRelatorio + '@c.us';
    await client.sendMessage(chatId, texto);
    console.log(`📲 Resumo enviado para +${config.numeroRelatorio}`);
  } catch (err) {
    console.error('Erro ao enviar resumo via WhatsApp:', err.message);
  }
}

client.on('disconnected', (reason) => {
  console.log('❌ Desconectado:', reason);
  setTimeout(() => client.initialize(), 10000);
});

console.log('🚀 Minerador de WhatsApp');
console.log('========================\n');
console.log('Iniciando conexão com WhatsApp Web...\n');
client.initialize();
```

#### src/gerar-relatorio.js
```javascript
import { initDB } from './database.js';
import { classificarLote } from './classifier.js';
import { gerarRelatorio } from './reporter.js';

initDB();

const dataArg = process.argv[2];
const data = dataArg ? new Date(dataArg + 'T12:00:00') : new Date();

console.log(`📊 Gerando relatório para ${data.toLocaleDateString('pt-BR')}...\n`);

console.log('🔄 Classificando mensagens pendentes...');
const resultado = await classificarLote();
console.log(`   → ${resultado.processadas} mensagens classificadas\n`);

const resultadoRelatorio = await gerarRelatorio(data);

if (resultadoRelatorio) {
  console.log(`\n✅ Pronto! Abra o relatório em:\n   ${resultadoRelatorio.caminho}`);
} else {
  console.log('\n⚠️  Sem mensagens relevantes para este dia.');
}
```

#### src/qr-server.js (para deploy em servidor VPS)
```javascript
import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import { createServer } from 'http';
import { config } from './config.js';

let qrAtual = null;
let status = 'aguardando';

const client = new Client({
  authStrategy: new LocalAuth({ dataPath: config.sessionPath }),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
  },
});

client.on('qr', (qr) => {
  qrAtual = qr;
  status = 'qr_pronto';
  console.log('QR Code gerado! Acesse a página web para escanear.');
});

client.on('authenticated', () => {
  status = 'autenticado';
  console.log('✅ Autenticado!');
});

client.on('ready', () => {
  status = 'conectado';
  console.log('🟢 Conectado! Pode fechar e iniciar o minerador.');
  setTimeout(() => { server.close(); client.destroy(); process.exit(0); }, 10000);
});

const server = createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  if (status === 'conectado') {
    res.end(`<html><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#f0f9f0;">
      <div style="text-align:center;"><h1 style="color:#22c55e;">✅ Conectado!</h1><p>Pode fechar esta página.</p></div></body></html>`);
  } else if (status === 'autenticado') {
    res.end(`<html><head><meta http-equiv="refresh" content="2"></head><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
      <h1>⏳ Autenticando...</h1></body></html>`);
  } else if (qrAtual) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(qrAtual)}`;
    res.end(`<html><head><meta http-equiv="refresh" content="20"></head><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#f5f5f5;">
      <div style="text-align:center;background:white;padding:40px;border-radius:16px;box-shadow:0 4px 20px rgba(0,0,0,0.1);">
        <h2>📱 Minerador — Conectar WhatsApp</h2><p>Escaneie com seu celular:</p>
        <p style="color:#666;">WhatsApp → Dispositivos conectados → Conectar</p>
        <img src="${qrUrl}" style="margin:20px auto;display:block;border-radius:8px;" />
        <p style="color:#999;font-size:12px;">A página atualiza sozinha.</p>
      </div></body></html>`);
  } else {
    res.end(`<html><head><meta http-equiv="refresh" content="3"></head><body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;">
      <h1>⏳ Gerando QR Code...</h1></body></html>`);
  }
});

server.listen(3456, '0.0.0.0', () => {
  console.log('🌐 Abra no navegador: http://SEU_IP:3456');
});

console.log('Iniciando WhatsApp Web...');
client.initialize();
```

### ETAPA 3 — Instalar e rodar

Após criar todos os arquivos:

```bash
cd ~/whatsapp-minerador
npm install
npm start
```

O QR code aparece no terminal. O usuário escaneia com o celular que tem os grupos.

### ETAPA 4 — Deploy em servidor (opcional, recomendado)

Se o usuário tem um VPS/servidor:

1. Copiar o projeto pro servidor via SCP
2. Instalar Node.js 22 no servidor:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt-get install -y nodejs
   ```
3. Instalar dependências do Chrome:
   ```bash
   apt-get install -y libxfixes3 libx11-xcb1 libxcb-dri3-0 libxcomposite1 libxdamage1 libxrandr2 libgbm1 libasound2t64 libpangocairo-1.0-0 libatk1.0-0 libatk-bridge2.0-0 libcups2 libdrm2 libxshmfence1 libxkbcommon0 fonts-liberation
   ```
4. Instalar PM2 e iniciar:
   ```bash
   npm install -g pm2
   cd /opt/whatsapp-minerador
   npm install
   ```
5. Autenticar via QR code web:
   ```bash
   ufw allow 3456/tcp
   node src/qr-server.js
   ```
   Escanear no navegador: `http://IP_DO_SERVIDOR:3456`
   Depois fechar a porta: `ufw deny 3456/tcp`
6. Iniciar com PM2:
   ```bash
   pm2 start src/index.js --name minerador
   pm2 save
   pm2 startup
   ```

### Personalização do prompt

Ao criar o classifier.js e brainstorm.js, **substitua todos os placeholders** `{{...}}` com informações reais do usuário. Pergunte:
- Nome do profissional
- Nicho (estética, fitness, marketing, etc.)
- Público (alunas, clientes, membros, etc.)
- Produtos/serviços que oferece
- Temas relevantes do nicho (para classificação de dúvidas)

### Informações importantes para o usuário

- O minerador **só captura mensagens de outros** — não as enviadas pelo próprio número conectado
- Custo estimado: ~R$0,10 a R$1,00 por dia (GPT-4o-mini é muito barato)
- O WhatsApp permite até 4 dispositivos conectados simultaneamente
- Se o minerador desconectar, precisa escanear QR code novamente
- No servidor, o PM2 reinicia automaticamente se cair
