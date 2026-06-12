# Perfil de Porte 1 — Solo

> Apps que **só você usa** (founder solo, dev solo).
> Dashboards internos, skills, scripts, ferramentas de bastidor.

---

## 🎯 QUEM SE ENCAIXA

- App tem 1 usuário (você)
- Não vai virar produto
- Não vai virar multi-tenant
- Sem SLA (se cair 1h, ninguém morre)

**Exemplos no portfólio Tata:**
- Skills (não são "apps" mas valem a regra)
- Scripts de automação
- Dashboards internos só pra você acompanhar

---

## 🧱 STACK RECOMENDADA

| Camada | Ferramenta | Por quê |
|--------|-----------|---------|
| Linguagem | **Node.js + TypeScript** | Padrão Tata |
| Framework HTTP | **Express** ou **Fastify** | Simples, conhecido |
| Banco | **SQLite** | Zero setup, 1 arquivo |
| Cache | Nenhum | Não precisa |
| Fila | `setTimeout` ou cron simples | Não precisa BullMQ |
| Proxy | Nenhum (acesso direto) ou Nginx simples | |
| Container | **Dockerfile** (mesmo que rode local) | Disciplina pra futuro |
| Process | **PM2** ou `node` direto | |
| CI/CD | Manual (git push + script) | Não precisa GitHub Actions |
| Observability | `console.log` + arquivo `app.log` | Suficiente |

---

## 🧪 OS 6 PADRÕES NO PORTE 1

### Padrão 1 — Fila + Aviso
**Aplicar?** Só se tiver operação > 5s.
**Como:** `setTimeout` ou `setImmediate`. Sem fila.

### Padrão 2 — Control/Data Plane
**Aplicar?** NÃO. Over-engineering.

### Padrão 3 — Molde + Dados
**Aplicar?** Se gerar saída repetitiva (relatório, email). Use Handlebars simples.

### Padrão 4 — Receita Congelada (Docker)
**Aplicar?** SIM. Cria disciplina mesmo no porte 1.
**Como:** Dockerfile + `docker run`. Sem orquestração.

### Padrão 5 — Planta da Infra
**Aplicar?** `docker-compose.yml` no Git. Suficiente.

### Padrão 6 — Concentre na Borda
**Aplicar?** NÃO. 1 app só, não tem o que centralizar.

---

## ⚠️ ARMADILHAS COMUNS NO PORTE 1

### Armadilha 1: Achar que é porte 2
"Eu uso esse app no celular e no notebook, então é 2 usuários!"
**Não.** Porte 1 = 1 PESSOA. Mesmo que use em 5 dispositivos.

### Armadilha 2: Over-engineering preventivo
"Vou colocar Kubernetes desde o início pra não precisar refatorar."
**NÃO.** Você vai abandonar o app antes de precisar.

### Armadilha 3: Sem backup
"É só meu, não preciso backup."
**SIM PRECISA.** Backup do SQLite pro Dropbox/Drive todo dia.

---

## 📦 CHECKLIST MÍNIMO DE QUALIDADE

- [ ] `.gitignore` correto (node_modules, .env, *.db)
- [ ] `README.md` que VOCÊ entenda em 6 meses
- [ ] `.env.example` com todas as variáveis necessárias
- [ ] `Dockerfile` que builda
- [ ] Backup do SQLite automatizado (cron + rsync/rclone)
- [ ] Log de erros em arquivo (não só console)

---

## 🚀 QUANDO ESCALAR PRA PORTE 2

Migre pra perfil 2 quando:
- Mais de 1 pessoa precisa usar
- Você quer expor pro time/mentoradas via mim
- Performance começa a importar
- Você tem 3+ apps relacionados

**Próxima leitura:** [2-apps-internos.md](2-apps-internos.md)
