// =====================================================================
// MIDDLEWARE: LOGGER (Pino + Correlation ID) — Padrão Imperatriz
// =====================================================================
// Logs estruturados (JSON) com correlation ID pra rastrear requests
// entre apps.
//
// Dependências: pino, pino-http, nanoid
// =====================================================================

const pino = require('pino');
const pinoHttp = require('pino-http');
const { nanoid } = require('nanoid');

// Logger raiz - usa nivel do env (default: info)
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  // Em dev, formato pretty. Em prod, JSON puro.
  transport: process.env.NODE_ENV === 'production'
    ? undefined
    : { target: 'pino-pretty', options: { colorize: true } },
  base: {
    app: process.env.APP_NAME || 'unknown-app',
    env: process.env.NODE_ENV || 'development',
  },
  redact: {
    // Nunca logar estas keys (security)
    paths: [
      'password',
      'token',
      'authorization',
      'cookie',
      'apiKey',
      '*.password',
      '*.token',
      'req.headers.authorization',
      'req.headers.cookie',
    ],
    censor: '[REDACTED]',
  },
});

/**
 * Middleware pino-http que loga cada request automaticamente.
 * Tambem garante correlation ID (X-Request-ID).
 */
const httpLogger = pinoHttp({
  logger,
  genReqId: (req, res) => {
    // Usa o ID que o Nginx ja gerou, ou cria um novo
    const existingId = req.headers['x-request-id'];
    const id = existingId || nanoid(12);
    res.setHeader('X-Request-ID', id);
    return id;
  },
  customLogLevel: (req, res, err) => {
    if (err) return 'error';
    if (res.statusCode >= 500) return 'error';
    if (res.statusCode >= 400) return 'warn';
    return 'info';
  },
  customSuccessMessage: (req, res) => {
    return `${req.method} ${req.url} -> ${res.statusCode} (${res.responseTime}ms)`;
  },
  serializers: {
    req: (req) => ({
      method: req.method,
      url: req.url,
      tenantId: req.user?.tenantId,
      userId: req.user?.id,
      // NAO loga headers inteiros (vaza secrets)
      userAgent: req.headers['user-agent'],
    }),
    res: (res) => ({
      statusCode: res.statusCode,
    }),
  },
});

/**
 * Logger por modulo - use ao inves de console.log
 *   const log = createLogger('queue:audio');
 *   log.info({ jobId, userId }, 'job iniciado');
 */
function createLogger(name) {
  return logger.child({ module: name });
}

module.exports = {
  logger,
  httpLogger,
  createLogger,
};

// =====================================================================
// EXEMPLO DE USO
// =====================================================================
//
// // server.js
// const express = require('express');
// const { httpLogger, createLogger } = require('@imperatriz/middlewares/logger');
//
// const app = express();
// app.use(httpLogger);  // SEMPRE primeiro middleware
//
// // Em outros arquivos
// const log = createLogger('routes:dashboard');
//
// app.get('/dashboard', (req, res) => {
//   log.info({ userId: req.user.id }, 'acessou dashboard');
//   res.json({ ok: true });
// });
//
// // Log com error
// try {
//   await dbQuery(...);
// } catch (err) {
//   log.error({ err, userId: req.user.id }, 'falha no DB');
//   throw err;
// }
//
// =====================================================================
