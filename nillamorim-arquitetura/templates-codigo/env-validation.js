// =====================================================================
// ENV VALIDATION — Padrão Imperatriz
// =====================================================================
// Valida variaveis de ambiente NO START do app.
// Se faltar algo critico, app NAO sobe (fail fast).
//
// Dependências: zod
// =====================================================================

const { z } = require('zod');

// Schema das envs esperadas
const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
  APP_NAME: z.string().min(1),
  APP_VERSION: z.string().default('unknown'),
  PORT: z.coerce.number().int().positive().default(3000),
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),

  // Auth
  JWT_SECRET: z.string().min(32, 'JWT_SECRET deve ter pelo menos 32 chars'),
  JWT_ISSUER: z.string().default('imperatriz'),

  // Banco
  DATABASE_URL: z.string().url('DATABASE_URL invalido'),

  // Redis (opcional)
  REDIS_URL: z.string().url().optional(),

  // External APIs (opcional, depende do app)
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  EVOLUTION_API_URL: z.string().url().optional(),
  EVOLUTION_API_KEY: z.string().optional(),

  // Observability (opcional)
  SENTRY_DSN: z.string().url().optional(),
  LOGTAIL_TOKEN: z.string().optional(),
});

/**
 * Valida envs ou MORRE.
 * Chame no topo do server.ts ANTES de qualquer outra coisa.
 */
function validateEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('\n🔴 ENVIRONMENT VALIDATION FAILED:\n');
    result.error.errors.forEach((err) => {
      console.error(`  ❌ ${err.path.join('.')}: ${err.message}`);
    });
    console.error('\nFix .env e tente de novo.\n');
    process.exit(1);
  }

  return result.data;
}

module.exports = { validateEnv, envSchema };

// =====================================================================
// USO
// =====================================================================
// // server.js (PRIMEIRA linha)
// const { validateEnv } = require('./utils/env');
// const env = validateEnv();
//
// // agora usa env (typed) ao inves de process.env
// console.log(`Subindo ${env.APP_NAME} v${env.APP_VERSION} em ${env.NODE_ENV}`);
// =====================================================================
