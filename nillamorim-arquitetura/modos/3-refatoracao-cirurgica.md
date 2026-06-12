# Modo 3 — Refatoração Cirúrgica (Camada Específica)

> "Quero evoluir só uma parte do app."

---

## 🎯 QUANDO USAR

- App já existe
- Identificou UM problema específico (auth, fila, deploy, edge)
- Quer código pronto pra implementar
- Não quer auditoria completa agora

---

## 📋 PASSO-A-PASSO

### Passo 1 — Identificar a camada-alvo

Pergunte qual é (1-6):

1. **Fila + Aviso** — operações longas
2. **Control/Data Plane** — config dinâmica
3. **Molde + Dados** — geração via template
4. **Receita Congelada** — Dockerização
5. **Planta da Infra** — IaC
6. **Concentre na Borda** — edge layer (auth, rate-limit, log)
7. (bônus) **Observabilidade** — logs/métricas/traces

### Passo 2 — Mini-diagnóstico só dessa camada

Use as 5 perguntas de diagnóstico daquele padrão (em `frameworks/01-diagnostico-6-padroes.md`).

### Passo 3 — Identificar porte (rápido)

Não faz auditoria completa, só calibra a recomendação.

### Passo 4 — Mostrar estado atual

Diagrama Mermaid simples do que existe naquela camada hoje.

### Passo 5 — Mostrar estado-alvo

Diagrama Mermaid do que deveria ser.

### Passo 6 — Gerar código pronto

**ESSE É O CORE DO MODO 3.** Pegue os templates relevantes e **customize** com:
- Nome do app
- Tecnologias específicas
- Variáveis de ambiente
- Endpoints reais

### Passo 7 — Plano de migração sem quebrar

Sempre proponha:
1. **Implementar em paralelo** (não trocar de uma vez)
2. **Feature flag** ou rota separada pra testar
3. **Validação** (como saber que funcionou?)
4. **Rollback** (como voltar se der ruim?)

### Passo 8 — Lista de testes

Antes de declarar "pronto", liste testes pra validar:
- Testes unitários
- Testes E2E manuais
- Métricas a observar (latência, erro, throughput)
- Tempo mínimo em canary antes de full rollout

### Passo 9 — Entregáveis

Crie pasta `~/Documents/Obsidian Vault/03 - Projetos/Refatoracao-[App]-Camada-[N]/`:

- `00-Diagnostico-Camada-X.md` — só dessa camada
- `01-Antes-Depois.md` — diagramas
- `02-Codigo-Pronto/` — arquivos prontos pra colar
- `03-Plano-Migracao.md` — passo-a-passo sem quebrar
- `04-Testes-Validacao.md` — checklist de testes

### Passo 10 — Ofertas

- "Quer que eu faça as edições no código real?" → aplicar (se Tata aprovar)
- "Quer auditoria completa do resto do app?" → Modo 1
- "Quer refatorar outra camada?" → repete Modo 3

---

## 📦 ENTREGÁVEIS OBRIGATÓRIOS

Menor que os outros modos. Foco em **código pronto**, não em diagnóstico exaustivo.

---

## 🎯 EXEMPLO DE EXECUÇÃO

```
USUÁRIO: /arquitetura-imperatriz refatorar a fila do App Tarefas
(BullMQ duplica tarefas)

SKILL:
> Camada-alvo identificada: 1 (Fila + Aviso)
> Porte: 2 (Apps Internos)
> 
> MINI-DIAGNÓSTICO:
> - Fila existe? ✅ BullMQ
> - Worker separado? ✅
> - Resposta imediata? ✅
> - Tarefa persiste? ✅
> - Idempotência? ❌ (raiz do problema)
> 
> ANTES:
> queue.add('processarAudio', { audioUrl, userId })
> // se cliente clica 2x → 2 jobs duplicados
> 
> DEPOIS:
> queue.add(
>   'processarAudio',
>   { audioUrl, userId },
>   { jobId: `audio-${userId}-${hash(audioUrl)}` }
> )
> // BullMQ deduplica automaticamente pelo jobId
> 
> CÓDIGO PRONTO:
> [arquivo src/queues/audio-queue.ts customizado]
> 
> PLANO DE MIGRAÇÃO:
> 1. Deploy do código novo em paralelo (não tira o velho)
> 2. Feature flag DEDUPE_ENABLED=true só pra você primeiro
> 3. Observa 24h: zero duplicatas?
> 4. Liga pra todos os users
> 5. Remove código velho em 7 dias
> 
> TESTES:
> - Manual: clica 5x rápido no botão "transcrever". Deve aparecer só 1 job.
> - Verificar BullMQ dashboard
> - Métrica: contagem de jobs duplicados (deve ser 0)
> 
> Salvei tudo em ~/Documents/Obsidian Vault/03 - Projetos/Refatoracao-AppTarefas-Camada-1/
> 
> Quer que eu aplique no código direto?
```
