// =====================================================================
// MIDDLEWARE: RATE-LIMIT — Padrão Imperatriz
// =====================================================================
// Defesa em camadas: alem do Nginx, app tambem limita.
// Usa Redis pra compartilhar entre processos/PM2 cluster.
//
// Dependências: express-rate-limit, rate-limit-redis, ioredis
// =====================================================================

const rateLimit = require('express-rate-limit');
const RedisStore = require('rate-limit-redis').default;
const Redis = require('ioredis');

// Reutilize a mesma instancia Redis do app (cache, fila, etc)
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

/**
 * Rate-limit geral (proteger contra abuso)
 * 100 requests / 15 minutos por IP
 */
const geral = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix: 'rl:geral:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'muitas requisicoes, tente em 15 minutos' },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate-limit estrito pra login (anti-brute-force)
 * 5 tentativas / 15 minutos por IP
 */
const login = rateLimit({
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
    prefix: 'rl:login:',
  }),
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { error: 'muitas tentativas de login, espere 15 minutos' },
  skipSuccessfulRequests: true,  // so conta falhas
});

/**
 * Rate-limit pra endpoints pesados (IA, geração)
 * 10 / minuto por user (nao por IP, por isso usa keyGenerator)
 */
function iaUsage(maxPorMinuto = 10) {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redis.call(...args),
      prefix: 'rl:ia:',
    }),
    windowMs: 60 * 1000,
    max: maxPorMinuto,
    keyGenerator: (req) => {
      // Por usuario logado (precisa rodar APOS requireAuth)
      return req.user?.id || req.ip;
    },
    message: { error: 'limite de uso de IA atingido. Tente em 1 minuto.' },
  });
}

/**
 * Rate-limit MULTI-TENANT
 * Limita por tenantId (cada cliente tem sua propria cota)
 */
function porTenant(maxPorHora = 1000) {
  return rateLimit({
    store: new RedisStore({
      sendCommand: (...args) => redis.call(...args),
      prefix: 'rl:tenant:',
    }),
    windowMs: 60 * 60 * 1000,
    max: maxPorHora,
    keyGenerator: (req) => req.user?.tenantId || req.ip,
    message: { error: 'cota da sua conta atingida' },
  });
}

module.exports = { geral, login, iaUsage, porTenant };

// =====================================================================
// EXEMPLO DE USO
// =====================================================================
//
// const ratelimit = require('@imperatriz/middlewares/ratelimit');
//
// // Aplica geral em TUDO
// app.use(ratelimit.geral);
//
// // Login estrito
// app.post('/api/auth/login', ratelimit.login, handler);
//
// // IA: 5 chamadas/min
// app.post('/api/gerar-conteudo',
//   requireAuth(),
//   ratelimit.iaUsage(5),
//   handler
// );
//
// // Multi-tenant: 500 requests/hora por cliente
// app.use('/api/', requireAuth(), ratelimit.porTenant(500));
//
// =====================================================================
