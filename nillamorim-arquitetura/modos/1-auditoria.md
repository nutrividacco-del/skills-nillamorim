# Modo 1 — Auditoria (App Pronto)

> "Já tenho o app. Quero saber o que falta arquiteturalmente."

---

## 🎯 QUANDO USAR

- App já existe e está em produção (ou desenvolvimento avançado)
- Quer entender gaps arquiteturais
- Quer roadmap pra evoluir
- Quer saber se está pronto pra escalar/multi-tenant/vender

---

## 📋 PASSO-A-PASSO

### Passo 1 — As 7 perguntas obrigatórias
(ver SKILL.md)

Adicione **3 perguntas específicas do modo auditoria:**
8. **Qual a maior dor TÉCNICA hoje?** (bug, lentidão, dificuldade de deploy, etc)
9. **Qual a última vez que algo quebrou em produção?** (e o que foi)
10. **Você consegue rodar o app em outra máquina em < 30 minutos?** (sim = bom, não = problema)

### Passo 2 — Reconhecimento do código
Se possível, leia:
- `package.json` (stack)
- `Dockerfile` (existe? versionado?)
- `docker-compose.yml`
- Pasta `nginx/` ou `/etc/nginx/sites-enabled` se acessível
- README.md
- Estrutura de pastas
- Variáveis de ambiente (`.env.example`)

Anote o **state atual real** (não confie só no que o usuário diz).

### Passo 3 — Identificar porte
Use `frameworks/03-calibrador-por-porte.md`. Carregue o perfil correspondente.

### Passo 4 — Diagnóstico dos 6 padrões
Use `frameworks/01-diagnostico-6-padroes.md`. Pontue 0-10 cada padrão.

### Passo 5 — Detecção de anti-patterns
Use `anti-patterns/10-anti-patterns.md`. Marque cada anti-pattern presente.

### Passo 6 — Responder as 12 perguntas-chave
Use `validadores/12-perguntas-chave.md`. Responda cada uma.

### Passo 7 — Recomendações priorizadas (ICE)
Use `frameworks/04-priorizador-ice.md`. Crie tabela ICE com TODAS as recomendações.

### Passo 8 — Gerar entregáveis no vault
Crie a pasta `~/Documents/Obsidian Vault/03 - Projetos/Arquitetura-[Nome-App]/` com os 6 arquivos + dashboard.

### Passo 9 — Resumo executivo
Mostre pra Tata um resumo de 5 frases:
1. Veredito geral (nota X/60)
2. Top 3 forças
3. Top 3 fraquezas críticas
4. Quick wins recomendados (próximos 30 dias)
5. Próximo passo concreto

### Passo 10 — Ofertas de continuação
Ofereça:
- "Quer que eu detalhe a refatoração de uma camada específica?" → Modo 3
- "Quer que eu gere o código pronto da edge layer?" → puxa templates
- "Quer mapa mental visual?" → chama `/mapa-mental-imperatriz`

---

## 📦 ENTREGÁVEIS OBRIGATÓRIOS

### `00-Diagnostico.md`
- Identificação do app
- Porte detectado (1-4) + justificativa
- Notas dos 6 padrões (tabela)
- Anti-patterns detectados (lista)
- 12 perguntas-chave respondidas
- Score final + veredito

### `01-Arquitetura-Atual.md`
- Diagrama Mermaid do que existe HOJE
- Stack atual (linguagem, frameworks, bancos, infra)
- Componentes que faltam (cache? fila? CI?)
- Pontos únicos de falha
- Dívidas técnicas conhecidas

### `02-Arquitetura-Proposta.md`
- Diagrama Mermaid do estado-alvo
- Diferenças marcadas em vermelho/verde
- Cada mudança com justificativa
- Sequência de migração (não trocar tudo de uma vez)

### `03-Roadmap-30-60-90.md`
- Tabela ICE completa
- Sprints planejadas (próximos 90 dias)
- Dependências entre tarefas
- Riscos por sprint
- Critérios de sucesso

### `04-Codigo-Pronto/`
- Pasta com **templates customizados** pra esse app específico
- Cada arquivo com comentários explicando o por quê
- README do que cada arquivo faz e onde colocar

### `05-Decisoes-e-Tradeoffs.md`
- Por que escolhi X em vez de Y
- O que ficou de fora e por quê
- Considerações futuras (porte > 90 dias)
- Quando reavaliar

### `dashboard.html`
- Visualização interativa do diagnóstico
- Notas dos 6 padrões em gráfico radar
- Tabela ICE filtrável
- Roadmap visual

---

## 🎯 EXEMPLO DE EXECUÇÃO

```
USUÁRIO: /arquitetura-imperatriz auditar App Tarefas Imperatriz

SKILL:
> Antes de começar, preciso entender o app. 7 perguntas:
> 
> 1. Que app é? (nome, URL, pasta no Mac)
> ...

USUÁRIO: [responde]

SKILL:
> ✅ Identificado: Porte 2 (Apps Internos)
> 
> Vou agora ler o código pra completar a análise.
> [lê arquivos relevantes]
> 
> Agora vou aplicar os 4 frameworks.

[skill executa todos os passos]

SKILL:
> Análise pronta. Salvei 6 arquivos + dashboard em:
> ~/Documents/Obsidian Vault/03 - Projetos/Arquitetura-App-Tarefas/
> 
> RESUMO EXECUTIVO:
> 
> 🎯 Veredito: 38/60 (FRÁGIL — divida técnica em 6 meses)
> 
> ✅ Forças:
> - BullMQ já implementado (padrão 1: 9/10)
> - Docker existe (padrão 4: 7/10)
> - Logs estruturados (bônus: 8/10)
> 
> ❌ Fraquezas críticas:
> - Auth duplicada (padrão 6: 3/10)
> - Sem CI/CD (padrão 5: 4/10)
> - Sem rate-limit (padrão 6: 2/10)
> 
> 🚀 Quick wins (próximos 30 dias):
> 1. Adicionar rate-limit no Nginx (4h, score ICE 729)
> 2. Migrar auth pra @imperatriz/middlewares (1 dia, score 540)
> 3. GitHub Actions CI (4h, score 504)
> 
> 📍 Próximo passo: quer que eu detalhe a refatoração da camada de auth?
```
