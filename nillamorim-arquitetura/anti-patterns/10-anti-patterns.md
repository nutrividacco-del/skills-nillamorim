# 10 Anti-Patterns que a Skill Detecta

> Erros arquiteturais comuns. Quando detectar **QUALQUER UM** durante uma auditoria, **GRITE** no diagnostico.

---

## 1. 🔴 AUTH DUPLICADA POR APP

### Sintoma
Cada app tem sua propria logica de login. Mentorada/cliente precisa logar 8 vezes.

### Por que e ruim
- Bug em 1 = bug em todos
- Imposivel implementar SSO
- Senhas em formatos diferentes (vazamento)
- Sessoes nao compartilhadas

### Como detectar
- Procure `bcrypt`, `jwt.sign`, `passport` em **multiplos repos**
- Sem pacote `@imperatriz/middlewares/auth` compartilhado

### Solucao
Middleware central de auth + JWT compartilhado.
Template: `templates-codigo/express-middleware-auth.js`

---

## 2. 🔴 SEGREDOS EM `.env` VERSIONADO

### Sintoma
`git log .env` retorna commits. Credenciais expostas no GitHub.

### Por que e ruim
- Senha vaza pra sempre (mesmo deletando depois)
- Multa LGPD/GDPR
- Conta cloud zerada por bots scanners

### Como detectar
```bash
git log --all --full-history -- .env
git log --all -p -- "*.env" | head
```

### Solucao
- `.gitignore` rigoroso: `.env`, `.env.*`, exceto `.env.example`
- Move credentials pra Vault/Doppler ou Obsidian vault (porte 2)
- **Rotaciona TUDO** se ja vazou

---

## 3. 🔴 DEPLOY VIA `git pull && pm2 restart`

### Sintoma
Pra fazer deploy, voce SSH na VPS, da git pull, pm2 restart.

### Por que e ruim
- Dev e prod desalinhados (versao diferente do node, sem build, etc)
- Impossivel reverter facilmente
- Quebra producao se faltar dependencia nova
- Sem rollback automatico

### Como detectar
Pergunta pro usuario: "como voce faz deploy?". Se a resposta tem "git pull", e isso.

### Solucao
- Docker + GitHub Actions
- Template: `templates-codigo/dockerfile-padrao-node.dockerfile` + `github-actions-deploy.yml`

---

## 4. 🔴 WORKER NO MESMO PROCESSO DO WEB

### Sintoma
Operacao longa (transcrever audio, gerar relatorio) trava o servidor HTTP enquanto roda.

### Por que e ruim
- Cliente recebe timeout
- 1 job mata o app pra todos
- Sem retry automatico

### Como detectar
- Procura `setTimeout` ou await dentro de handler HTTP
- Tempo de response > 5s em alguma rota

### Solucao
Fila (BullMQ) + worker em processo separado.
Template: `templates-codigo/queue-bullmq-setup.js`

---

## 5. 🔴 SEM IDEMPOTENCIA NA FILA

### Sintoma
Cliente clica 2x no botao → 2 jobs duplicados (cobra 2x, envia 2 emails, etc).

### Por que e ruim
- Cobranca duplicada = chargeback
- Email duplicado = spam
- Trabalho desperdiçado

### Como detectar
Procura `queue.add(...)` SEM `jobId` ou sem `unique` option.

### Solucao
```js
queue.add('job', data, {
  jobId: `unique-key-${user_id}-${hash(content)}`
});
```

---

## 6. 🔴 LOGS SO NO PM2

### Sintoma
Bug em algum app, voce nao sabe onde foi. PM2 logs misturados, sem timestamp util, sem correlation ID.

### Por que e ruim
- Imposivel rastrear request entre apps
- Imposivel debugar bug intermitente
- Imposivel agregar metricas

### Como detectar
- `console.log` espalhado
- Sem `pino`, `winston`, `bunyan`
- Sem correlation ID nos logs

### Solucao
Logger estruturado (Pino) + correlation ID + arquivo por app.
Template: `templates-codigo/express-middleware-logger.js`

---

## 7. 🔴 BACKUP CONFIGURADO MAS NUNCA TESTADO

### Sintoma
"Tem backup, ele roda toda noite no cron." Mas voce nunca fez restore.

### Por que e ruim
- Backup pode estar **corrompido ha meses**
- Backup pode estar **vazio**
- Cron pode ter **parado de rodar**
- Restore pode demorar 8h (e voce so descobre na hora critica)

### Como detectar
Pergunta: "qual foi a ultima vez que voce fez RESTORE do backup?". Se "nunca", e isso.

### Solucao
- Cron mensal de teste de restore (rotacao com staging)
- Notificacao quando backup falha
- Documentar procedimento de restore

---

## 8. 🔴 SINGLE POINT OF FAILURE (SPOF)

### Sintoma
1 VPS, 1 DB, sem replica. Se VPS cair, tudo cai.

### Por que e ruim
- Downtime de horas
- Perda de dados se VPS pegar fogo
- Reputacao destruida

### Como detectar
Pergunta: "quantas maquinas estao envolvidas em manter cada app de pe?". Se "uma", e SPOF.

### Solucao
Porte 2: backup offsite + monitoramento (mitigacao)
Porte 3+: replica de DB + multi-AZ

---

## 9. 🔴 MENTORADA USA MESMO BANCO/CRED QUE OUTRA (vazamento multi-tenant)

### Sintoma
Sistema multi-tenant onde cliente A consegue ver dado do cliente B via bug ou injection.

### Por que e ruim
- **INCIDENTE CRITICO**
- LGPD viola
- Cliente sai
- Mancha permanente

### Como detectar
- Sem `tenant_id` em queries
- Sem Row Level Security (Postgres)
- Sem testes E2E de isolamento

### Solucao
- Postgres RLS obrigatorio
- Middleware injeta tenant_id automatico
- Testes E2E de cross-tenant access (deve dar 403)

---

## 10. 🔴 MODIFICACAO MANUAL EM PRODUCAO

### Sintoma
"Edita o arquivo direto na VPS via SSH + nano + pm2 restart."

### Por que e ruim
- Mudanca nao versionada (esquece em 1 mes)
- Quando refaz deploy, sobrescreve a mudanca
- Sem auditoria de quem mudou o que
- Bug imposivel de reproduzir em dev

### Como detectar
Pergunta: "voce ja editou um arquivo direto no servidor de producao?". Se "sim", e isso.

### Solucao
- Image as code (Docker) — servidor e imutavel
- Toda mudanca passa por Git
- Acesso SSH SO pra debugar (nunca pra editar)

---

## 🎯 OUTROS ANTI-PATTERNS COMUNS (BONUS)

### 11. Sem rate-limit
Bot consome toda quota do Gemini em 5 minutos. Sem rate-limit no Nginx nem no app.

### 12. Sem healthcheck
UptimeRobot nao tem o que checar. Voce so sabe que caiu quando cliente reclama.

### 13. `npm install` em producao (sem `npm ci`)
Dependencia atualiza sozinha, quebra prod.

### 14. CORS aberto (`Access-Control-Allow-Origin: *`)
Qualquer site pode chamar sua API logado como user.

### 15. SQL injection (concatenacao de strings em queries)
`query("SELECT * FROM users WHERE id = " + req.params.id)` — risco critico.

---

## 📊 SAIDA OBRIGATORIA NO DIAGNOSTICO

Sempre liste:

```markdown
## 🚨 Anti-Patterns Detectados

| # | Anti-Pattern | Risco | Onde | Como corrigir |
|---|--------------|-------|------|---------------|
| 1 | Auth duplicada | Alto | apps marketing-command, app-tarefas | criar @imperatriz/middlewares |
| 4 | Worker no web | Critico | app-tarefas/src/routes/transcribe.js | mover pra BullMQ worker |
| 6 | Logs so no PM2 | Medio | todos | adicionar Pino |
```
