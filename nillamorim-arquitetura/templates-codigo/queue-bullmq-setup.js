// =====================================================================
// QUEUE: BullMQ Setup — Padrão Imperatriz
// =====================================================================
// Fila com Redis. Idempotente, com retry, com dead letter queue.
//
// Dependências: bullmq, ioredis
// =====================================================================

const { Queue, Worker, QueueEvents } = require('bullmq');
const Redis = require('ioredis');
const { createLogger } = require('./logger');

// Conexao compartilhada
const connection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: null,  // BullMQ exige isso
  enableReadyCheck: false,
});

// ============== EXEMPLO: FILA DE TRANSCRICAO DE AUDIO ============

const audioQueue = new Queue('audio-transcribe', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 5000 },  // 5s, 25s, 125s
    removeOnComplete: { age: 24 * 3600, count: 1000 },  // limpa apos 24h
    removeOnFail: { age: 7 * 24 * 3600 },  // mantem falhas 7 dias
  },
});

/**
 * Adiciona job. IDEMPOTENTE: se chamar 2x com mesmo conteudo, gera so 1 job.
 */
async function addAudioJob({ audioUrl, userId }) {
  const crypto = require('crypto');
  const hash = crypto.createHash('sha256').update(audioUrl).digest('hex').slice(0, 12);
  const jobId = `audio-${userId}-${hash}`;

  const job = await audioQueue.add(
    'transcribe',
    { audioUrl, userId },
    { jobId }  // chave de deduplicacao
  );

  return job.id;
}

// ============== WORKER (rodar em processo separado!) ============

function createAudioWorker() {
  const log = createLogger('worker:audio');

  const worker = new Worker(
    'audio-transcribe',
    async (job) => {
      log.info({ jobId: job.id, userId: job.data.userId }, 'iniciando transcricao');

      const { audioUrl, userId } = job.data;

      // Baixa o audio
      const audioBuffer = await downloadAudio(audioUrl);

      // Manda pro Gemini (ou Whisper)
      const transcription = await transcribeWithGemini(audioBuffer);

      // Salva no banco
      await saveTranscription({ userId, audioUrl, transcription });

      log.info({ jobId: job.id, len: transcription.length }, 'transcricao OK');

      return { transcription };
    },
    {
      connection,
      concurrency: 5,  // 5 jobs em paralelo nesse worker
      limiter: {
        max: 60,  // max 60 jobs
        duration: 60000,  // por minuto
      },
    }
  );

  worker.on('completed', (job, result) => {
    log.info({ jobId: job.id }, 'job completed');
  });

  worker.on('failed', (job, err) => {
    log.error({ jobId: job.id, err: err.message, attempts: job.attemptsMade }, 'job failed');
    // Se atingiu max attempts, alerta
    if (job.attemptsMade >= 3) {
      // sendAlertToSlack(`Job ${job.id} falhou definitivamente: ${err.message}`);
    }
  });

  worker.on('error', (err) => {
    log.fatal({ err }, 'worker error - reiniciando');
  });

  return worker;
}

// ============== EVENTS (pra notificar cliente que ficou pronto) ============

function createQueueEvents() {
  const queueEvents = new QueueEvents('audio-transcribe', { connection });

  queueEvents.on('completed', ({ jobId, returnvalue }) => {
    // Notifica cliente via WebSocket/SSE
    // notifyClient(jobId, returnvalue);
  });

  return queueEvents;
}

module.exports = {
  audioQueue,
  addAudioJob,
  createAudioWorker,
  createQueueEvents,
};

// =====================================================================
// EXEMPLO DE USO
// =====================================================================
//
// // server.js (HTTP)
// const { addAudioJob } = require('./queues/audio');
//
// app.post('/api/transcribe', requireAuth(), async (req, res) => {
//   const jobId = await addAudioJob({
//     audioUrl: req.body.audioUrl,
//     userId: req.user.id,
//   });
//   res.json({ jobId, status: 'queued' });
// });
//
// // worker.js (processo separado!)
// const { createAudioWorker } = require('./queues/audio');
// const worker = createAudioWorker();
// console.log('Worker rodando...');
//
// =====================================================================
