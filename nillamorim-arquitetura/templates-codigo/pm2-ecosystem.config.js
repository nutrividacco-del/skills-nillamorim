// =====================================================================
// PM2 ECOSYSTEM — Padrão Imperatriz
// =====================================================================
// Se voce ainda nao migrou pra Docker, esse e o ecosystem PM2 ideal.
// Lugar: ecosystem.config.js no root do projeto
// Subir: pm2 start ecosystem.config.js --env production
// =====================================================================

module.exports = {
  apps: [
    // ============== WEB SERVER ============
    {
      name: 'app-web',
      script: './dist/server.js',
      instances: 'max',  // 1 por core
      exec_mode: 'cluster',  // load balance entre cores
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',  // reinicia se passar de 500MB

      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Logs
      out_file: './logs/web-out.log',
      error_file: './logs/web-err.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,
    },

    // ============== WORKER (separado!) ============
    {
      name: 'app-worker',
      script: './dist/worker.js',
      instances: 2,  // 2 workers
      exec_mode: 'fork',  // workers NAO usam cluster
      autorestart: true,
      max_memory_restart: '500M',

      env_production: {
        NODE_ENV: 'production',
      },

      out_file: './logs/worker-out.log',
      error_file: './logs/worker-err.log',
    },
  ],

  // Deploy via pm2 deploy (opcional, se nao usar GitHub Actions)
  deploy: {
    production: {
      user: 'tata',
      host: 'comando.iacomtata.com.br',
      ref: 'origin/main',
      repo: 'git@github.com:tatagoncalvesof/marketing-command.git',
      path: '/var/www/marketing-command',
      'post-deploy':
        'npm ci && npm run build && pm2 reload ecosystem.config.js --env production',
    },
  },
};

// =====================================================================
// COMANDOS UTEIS
// =====================================================================
// pm2 start ecosystem.config.js --env production
// pm2 reload all          # zero-downtime restart
// pm2 monit               # dashboard tempo real
// pm2 logs --lines 100
// pm2 logs app-worker --err
// pm2 save                # salva estado pra recover apos reboot
// pm2 startup             # autostart no boot
// =====================================================================
