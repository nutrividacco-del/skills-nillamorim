// =====================================================================
// CONTROL PLANE: Config Dinamica via Polling — Padrão Imperatriz
// =====================================================================
// Apps fazem polling em tabela central de configs.
// Tem cache local pra resiliencia (se control plane cair, app continua).
//
// Aplicar quando: > 2 apps com configs parecidas que mudam juntas.
// =====================================================================

const { createLogger } = require('./logger');

class ConfigStore {
  constructor({ db, appName, pollIntervalMs = 5 * 60 * 1000 }) {
    this.db = db;
    this.appName = appName;
    this.pollInterval = pollIntervalMs;
    this.cache = new Map();
    this.lastUpdate = null;
    this.log = createLogger('config-store');
    this.timer = null;
  }

  async start() {
    await this.refresh();
    this.timer = setInterval(() => {
      this.refresh().catch((err) => {
        this.log.warn({ err: err.message }, 'falha ao atualizar config - usando cache');
      });
    }, this.pollInterval);
    this.log.info({ appName: this.appName, interval: this.pollInterval }, 'config store iniciado');
  }

  async stop() {
    if (this.timer) clearInterval(this.timer);
  }

  async refresh() {
    const rows = await this.db.query(
      `SELECT key, value, updated_at
       FROM app_configs
       WHERE app_name = $1 OR app_name = 'global'`,
      [this.appName]
    );

    this.cache.clear();
    rows.forEach((row) => {
      this.cache.set(row.key, row.value);
    });
    this.lastUpdate = new Date();
    this.log.debug({ count: rows.length }, 'config atualizado');
  }

  /**
   * Pega config. Se nao tem em cache, retorna default.
   * NUNCA bloqueia (sempre sincrono).
   */
  get(key, defaultValue = null) {
    return this.cache.has(key) ? this.cache.get(key) : defaultValue;
  }

  /**
   * Pega config com hot-reload via callback.
   * Subscribe e chama callback quando valor muda.
   */
  watch(key, callback) {
    let lastValue = this.get(key);
    callback(lastValue);

    const interval = setInterval(() => {
      const newValue = this.get(key);
      if (JSON.stringify(newValue) !== JSON.stringify(lastValue)) {
        callback(newValue);
        lastValue = newValue;
      }
    }, this.pollInterval);

    return () => clearInterval(interval);
  }
}

module.exports = { ConfigStore };

// =====================================================================
// SCHEMA DO BANCO (Postgres)
// =====================================================================
//
// CREATE TABLE app_configs (
//   id SERIAL PRIMARY KEY,
//   app_name TEXT NOT NULL,  -- 'app-tarefas', 'global', etc
//   key TEXT NOT NULL,
//   value JSONB NOT NULL,
//   description TEXT,
//   updated_at TIMESTAMPTZ DEFAULT NOW(),
//   updated_by TEXT,
//   UNIQUE(app_name, key)
// );
//
// CREATE INDEX idx_app_configs_app ON app_configs(app_name);
//
// =====================================================================

// =====================================================================
// USO
// =====================================================================
//
// const { ConfigStore } = require('./config-store');
//
// const config = new ConfigStore({
//   db: pgPool,
//   appName: 'app-tarefas',
//   pollIntervalMs: 5 * 60 * 1000,
// });
//
// await config.start();
//
// // Em qualquer lugar do codigo:
// const maxAudioMb = config.get('max_audio_mb', 25);
// const promptIA = config.get('gemini_prompt', 'Transcreva...');
//
// // Hot reload (recebe atualizacoes sem reiniciar)
// config.watch('feature_flags', (flags) => {
//   console.log('feature flags atualizadas', flags);
// });
//
// =====================================================================
