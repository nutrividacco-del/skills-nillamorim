# Framework 1 — Diagnóstico dos 6 Padrões

> Pra cada padrão, dá nota 0-10 e explica POR QUÊ.
> Use no Modo Auditoria e no Modo Refatoração Cirúrgica.

---

## 🎯 COMO USAR

Pra cada um dos 6 padrões:

1. **Faça as 5 perguntas de diagnóstico** (abaixo)
2. **Calcule a nota** (cada pergunta vale 2 pontos: SIM=2, PARCIAL=1, NÃO=0)
3. **Escreva 1 parágrafo de análise** com exemplos do app
4. **Liste 1-3 ações específicas** pra subir a nota

---

## PADRÃO 1 — FILA + AVISO (Async via Queue)

### Conceito
Operações longas vão pra fila. Cliente não espera no telefone — recebe aviso quando ficar pronto.

### 5 perguntas de diagnóstico

| # | Pergunta | SIM | PARCIAL | NÃO |
|---|----------|-----|---------|-----|
| 1 | Tem alguma operação que demora mais de 3 segundos? | (continua) | — | (já tudo OK, pula pra pad. 2) |
| 2 | Essa operação roda **fora** do request HTTP? (worker, queue, cron) | ✓ | parcial | ✗ |
| 3 | Cliente recebe **resposta imediata** (ack + ID) e descobre depois se deu certo? | ✓ | parcial | ✗ |
| 4 | Se o worker cair, a tarefa **não some** (persiste em queue/DB)? | ✓ | parcial | ✗ |
| 5 | Tem **idempotência** (executar 2x não duplica)? | ✓ | parcial | ✗ |

### Ferramentas comuns
- **Node:** BullMQ (Redis), Agenda (Mongo), simple SQLite queue
- **Python:** Celery, RQ, FastAPI BackgroundTasks
- **AWS:** SQS, SNS

### Anti-patterns
- ❌ Processar áudio/transcrição/IA no mesmo processo do HTTP
- ❌ Cliente fica em request HTTP aberto por 30+ segundos
- ❌ Retry sem idempotência (gera duplicatas)

---

## PADRÃO 2 — CONTROLE vs EXECUÇÃO (Control Plane vs Data Plane)

### Conceito
Separe quem MANDA AS ORDENS de quem FAZ O TRABALHO.

### 5 perguntas de diagnóstico

| # | Pergunta | SIM | PARCIAL | NÃO |
|---|----------|-----|---------|-----|
| 1 | Existe **um lugar** que define regras (dashboard admin, arquivo de config central)? | ✓ | parcial | ✗ |
| 2 | Os apps que rodam o trafego **leem** dessas regras (não duplicam lógica)? | ✓ | parcial | ✗ |
| 3 | Se o painel de controle cair, os apps **continuam funcionando** com última config? | ✓ | parcial | ✗ |
| 4 | Mudou regra no painel → apps recebem em **segundos/minutos** sem deploy? | ✓ | parcial | ✗ |
| 5 | Painel e apps usam **bancos/processos separados** (zero acoplamento)? | ✓ | parcial | ✗ |

### Quando aplicar (por porte)
- **Porte 1:** ignorar (não vale a pena)
- **Porte 2:** opcional (se tiver 4+ apps com mesmas regras)
- **Porte 3:** obrigatório (mentoradas precisam mudar tom do bot sem deploy)
- **Porte 4:** crítico

### Ferramentas comuns
- **Simples:** arquivo JSON no S3/disco + apps fazem polling
- **Médio:** Redis pub/sub
- **Avançado:** Consul, etcd, Sovereign (o do Vasilios)

---

## PADRÃO 3 — MOLDE + DADOS (Templates + Context)

### Conceito
Usuário preenche 5 campos. Sistema gera 500 linhas de config. Esconde complexidade.

### 5 perguntas de diagnóstico

| # | Pergunta | SIM | PARCIAL | NÃO |
|---|----------|-----|---------|-----|
| 1 | Existe entrada **simples do usuário** (formulário, JSON, comando) que gera saída complexa? | ✓ | parcial | ✗ |
| 2 | A geração usa **templates** (Handlebars, Jinja, Mustache, JSX)? | ✓ | parcial | ✗ |
| 3 | A separação **template/dados** é clara (não tem dado dentro do template)? | ✓ | parcial | ✗ |
| 4 | Os templates são **versionados** no Git? | ✓ | parcial | ✗ |
| 5 | Mudou template → afeta **todas as gerações futuras** sem retrabalho manual? | ✓ | parcial | ✗ |

### Onde aplica no portfólio Tata
- ✅ `/imperatriz-bot` (já faz)
- ✅ `/skill-pagina-vendas` (já faz)
- ❓ App Tarefas (poderia gerar relatórios via template)
- ❓ Leadflow-template (templates de email automatizado?)

---

## PADRÃO 4 — RECEITA CONGELADA (Image as Code)

### Conceito
Servidor nunca é modificado em produção. Mudou? Cria novo, mata o velho.

### 5 perguntas de diagnóstico

| # | Pergunta | SIM | PARCIAL | NÃO |
|---|----------|-----|---------|-----|
| 1 | Cada app tem **Dockerfile** versionado no Git? | ✓ | parcial | ✗ |
| 2 | A imagem é **construída por CI** (não manualmente)? | ✓ | parcial | ✗ |
| 3 | Deploy é "**sobe novo container, mata velho**" (não `git pull && pm2 restart`)? | ✓ | parcial | ✗ |
| 4 | **Zero alteração manual** em produção (sem SSH pra editar arquivo)? | ✓ | parcial | ✗ |
| 5 | Consegue rodar a **mesma imagem em dev/staging/prod** sem mudança? | ✓ | parcial | ✗ |

### Quando aplicar (por porte)
- **Porte 1:** parcial (Dockerfile sim, CI pode esperar)
- **Porte 2:** SIM, integral
- **Porte 3:** obrigatório (cada mentorada precisa de versão limpa)
- **Porte 4:** crítico + multi-region

### Stack da Tata
- Hoje: PM2 + git pull (anti-pattern parcial)
- Alvo: Docker + Docker Compose por app + CI no GitHub Actions

---

## PADRÃO 5 — PLANTA DA INFRA (Infrastructure as Code)

### Conceito
Toda infraestrutura num arquivo versionável no Git. Replicável e auditável.

### 5 perguntas de diagnóstico

| # | Pergunta | SIM | PARCIAL | NÃO |
|---|----------|-----|---------|-----|
| 1 | Toda config de Nginx está **versionada no Git**? | ✓ | parcial | ✗ |
| 2 | Toda config de PM2/systemd está **versionada**? | ✓ | parcial | ✗ |
| 3 | Tem `docker-compose.yml` ou `Terraform` descrevendo a infra? | ✓ | parcial | ✗ |
| 4 | Consegue **destruir a VPS** e recriar tudo em 1 hora? | ✓ | parcial | ✗ |
| 5 | Segredos em **gerenciador** (não em `.env` versionado)? (Vault, Doppler, AWS Secrets) | ✓ | parcial | ✗ |

### Quando aplicar
- **Porte 1:** docker-compose só
- **Porte 2:** docker-compose + Nginx no Git + scripts de setup
- **Porte 3:** Terraform pra novos clientes
- **Porte 4:** Terraform multi-region + Vault

---

## PADRÃO 6 — CONCENTRE NA BORDA (Edge Centralization)

### Conceito
Auth, logs, rate-limit, segurança: TUDO no porteiro. Apps cuidam só do negócio.

### 5 perguntas de diagnóstico

| # | Pergunta | SIM | PARCIAL | NÃO |
|---|----------|-----|---------|-----|
| 1 | Auth é **centralizada** (1 lugar) entre os apps? | ✓ | parcial | ✗ |
| 2 | Rate-limit é configurado **no Nginx ou edge** (não em cada app)? | ✓ | parcial | ✗ |
| 3 | SSL/HTTPS gerenciado **em 1 lugar** (Certbot/Let's Encrypt central)? | ✓ | parcial | ✗ |
| 4 | Headers de segurança (HSTS, CSP, X-Frame-Options) **padronizados**? | ✓ | parcial | ✗ |
| 5 | Logs **agregados** num só lugar (não espalhados em cada app)? | ✓ | parcial | ✗ |

### Quando aplicar
- **Porte 1:** ignorar (1 app só)
- **Porte 2:** **CRÍTICO** (apps internos da Tata estão aqui)
- **Porte 3:** depende — multi-tenant precisa de tenant isolation (auth por tenant)
- **Porte 4:** crítico + WAF + DDoS protection (CloudFront/Cloudflare)

---

## 📊 SAÍDA DO FRAMEWORK 1

Gere uma tabela final assim:

| # | Padrão | Nota | Análise (1 frase) | Ações pra subir |
|---|--------|------|-------------------|-----------------|
| 1 | Fila + Aviso | 8/10 | App já usa BullMQ mas falta idempotência | Adicionar dedupe key na fila |
| 2 | Controle vs Execução | 3/10 | Regras hardcoded no código | Mover pra arquivo JSON central |
| 3 | Molde + Dados | 7/10 | Templates de email via Handlebars | Versionar templates no Git |
| 4 | Receita Congelada | 4/10 | Dockerfile existe mas deploy é `git pull` | Trocar pra `docker compose up -d` |
| 5 | Planta da Infra | 5/10 | Nginx no Git, mas sem docker-compose | Adicionar `docker-compose.yml` |
| 6 | Concentre na Borda | 6/10 | Nginx central, mas auth duplicada | Criar middleware central de auth |

### Nota final (média ponderada por relevância pro porte)

- Porte 1: padrão 4 e 1 valem 30%, resto 10% cada
- Porte 2: padrões 4, 5, 6 valem 25%, resto 8% cada (somando 100%)
- Porte 3: padrões 2, 4, 5, 6 valem 22%, resto 6% cada
- Porte 4: tudo igual (16% cada)

### Score final → veredito

| Score | Veredito |
|-------|----------|
| 0-3 | 🔴 Crítico — refatoração arquitetural urgente |
| 4-5 | 🟠 Frágil — divida técnica significativa, vai quebrar em 6 meses |
| 6-7 | 🟡 Razoável — pronto pra escalar até 2x sem dor |
| 8-9 | 🟢 Sólido — pronto pra escalar 10x |
| 10 | 💎 Lendário — referência pra documentar publicamente |
