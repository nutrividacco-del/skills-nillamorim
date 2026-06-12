// =====================================================================
// HEALTHCHECK — Padrão Imperatriz
// =====================================================================
// Endpoint /health pra UptimeRobot, Docker, Nginx, Kubernetes verem
// se o app esta vivo E saudavel.
//
// 2 niveis:
// - /health      → "to vivo?" (basico, rapido)
// - /health/deep → "minhas dependencias estao OK?" (mais lento)
// =====================================================================

const express = require('express');

function createHealthRouter({ db, redis, queue }) {
  const router = express.Router();

  /**
   * /health - basico
   * Responde rapido (<50ms). Usado por loadbalancer/Docker.
   */
  router.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  /**
   * /health/deep - checa dependencias
   * Usado por painel admin / verificacao manual.
   */
  router.get('/health/deep', async (req, res) => {
    const checks = {};
    let allHealthy = true;

    // DB
    if (db) {
      try {
        await Promise.race([
          db.query('SELECT 1'),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000)),
        ]);
        checks.db = 'ok';
      } catch (e) {
        checks.db = `error: ${e.message}`;
        allHealthy = false;
      }
    }

    // Redis
    if (redis) {
      try {
        await Promise.race([
          redis.ping(),
          new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), 3000)),
        ]);
        checks.redis = 'ok';
      } catch (e) {
        checks.redis = `error: ${e.message}`;
        allHealthy = false;
      }
    }

    // Queue
    if (queue) {
      try {
        const count = await queue.getJobCounts('active', 'waiting');
        checks.queue = { ...count, status: 'ok' };
      } catch (e) {
        checks.queue = `error: ${e.message}`;
        allHealthy = false;
      }
    }

    // Memoria
    const mem = process.memoryUsage();
    checks.memory = {
      rss_mb: Math.round(mem.rss / 1024 / 1024),
      heap_used_mb: Math.round(mem.heapUsed / 1024 / 1024),
      heap_total_mb: Math.round(mem.heapTotal / 1024 / 1024),
    };

    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.APP_VERSION || 'unknown',
      checks,
    });
  });

  return router;
}

module.exports = { createHealthRouter };

// =====================================================================
// USO
// =====================================================================
// const { createHealthRouter } = require('./middlewares/healthcheck');
// app.use('/', createHealthRouter({ db, redis, queue: audioQueue }));
// =====================================================================
