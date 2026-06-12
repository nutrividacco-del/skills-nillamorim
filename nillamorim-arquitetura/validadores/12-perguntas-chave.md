# 12 Perguntas-Chave que a Skill OBRIGATORIAMENTE Responde

> Pra cada app analisado, **responde TODAS as 12**.
> Se nao conseguir responder, **PERGUNTE MAIS** ao usuario.

---

## 1. Preciso de fila? Pra que?

### Pra responder
- Tem operacao > 3s?
- Cliente pode esperar essa operacao em request HTTP?
- Operacao pode falhar e precisa de retry?

### Formato da resposta
**SIM/NAO**, e se SIM, lista 3-5 cenarios concretos onde precisa.

### Exemplo
> SIM. Cenarios:
> - Transcrever audio do WhatsApp (Gemini demora 3-30s)
> - Gerar relatorio mensal pra mentorada (varios bancos, 10-60s)
> - Enviar email em lote (50+ emails, 30s)

---

## 2. Preciso separar control/data plane? Quando?

### Pra responder
- Quantos apps tem regras parecidas (tom IA, limites, features)?
- Voce precisa mudar regra **sem fazer deploy**?
- Vai virar multi-tenant?

### Formato
**SIM/NAO**, justificativa em 1 paragrafo.

---

## 3. Que partes da config deveriam ser template + context?

### Pra responder
- Existe geracao repetitiva (emails, relatorios, conteudo IA)?
- Cada cliente customiza variaveis (cor, logo, nome) na saida?
- Templates atualmente estao hardcoded?

### Formato
Lista as 3-5 areas onde aplicar.

---

## 4. Estou usando Docker corretamente? O que ta em mutacao?

### Pra responder
- Tem Dockerfile?
- Imagem builda em CI (nao manualmente)?
- Deploy = subir nova image + matar velha?
- Voce ja editou arquivo direto na VPS em prod?

### Formato
Nota 0-10 + 1 paragrafo do que precisa mudar.

---

## 5. Onde mora minha planta de infra hoje? Esta no Git?

### Pra responder
- Config Nginx no Git?
- docker-compose.yml no Git?
- Scripts de setup no Git?
- Tem `IaC` (Terraform/Pulumi)?

### Formato
Lista o que esta no Git, lista o que NAO esta.

---

## 6. Que coisas estao duplicadas entre apps? Vao pro Nginx central?

### Pra responder
- Apps internos compartilham:
  - Auth?
  - Rate-limit?
  - Logs?
  - Headers de seguranca?
  - SSL?

### Formato
Tabela: o que esta duplicado vs o que ja esta centralizado.

---

## 7. Onde estao meus pontos unicos de falha (SPOFs)?

### Pra responder
- Quantas VPS?
- Quantas replicas do banco?
- Backup offsite?
- Replica do Redis?
- DNS centralizado (Cloudflare)?

### Formato
Lista os SPOFs encontrados, com **risco e impacto**.

---

## 8. Quanto custaria isso quebrar em producao?

### Pra responder
- Quantos clientes/mentoradas usam?
- Quanto perderia em $$/dia se cair?
- Quanto perderia em reputacao?
- Tempo medio pra recuperar (RTO)?

### Formato
Estimativa de impacto em $$ + reputacao + tempo.

---

## 9. Qual a proxima camada que mais doi?

### Pra responder
Baseado no diagnostico dos 6 padroes, qual tem a menor nota relativa ao porte?

### Formato
Camada N — Padrao X. Justificativa em 1 paragrafo.

---

## 10. Quanto tempo ate divida tecnica matar feature velocity?

### Pra responder
- Quanto tempo voce gasta hoje resolvendo bugs vs criando feature?
- Esta crescendo?
- Em quanto tempo voce nao consegue mais entregar feature por estar so apagando incendio?

### Formato
Estimativa em meses. Se < 6 meses, e CRITICO.

---

## 11. Se eu vendesse esse app pra mentorada amanha, o que quebraria?

### Pra responder
- Tem isolamento de dados?
- Tem onboarding automatizado?
- Mentorada consegue admin sem te chamar?
- Backups por tenant?
- Custo individual cabe no preco?

### Formato
Lista 5-10 coisas que precisariam mudar pra virar produto vendavel.

---

## 12. Que parte aqui e "ouro" pra documentar como autoridade publica?

### Pra responder
- Qual decisao arquitetural foi inovadora/diferente?
- Qual problema voce resolveu de jeito incomum?
- Qual mecanismo aqui daria carrossel/video/case publico?

### Formato
Lista 2-3 angulos de autoridade pra Tata explorar (cruzar com `/linha-editorial-imperatriz`).

---

## 📊 SAIDA OBRIGATORIA

No arquivo `00-Diagnostico.md`, sempre inclua secao "12 Perguntas-Chave Respondidas" com as 12.
