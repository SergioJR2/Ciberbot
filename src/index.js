import app from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

const server = app.listen(env.PORT, () => {
  logger.info({ puerto: env.PORT }, 'Servidor de Ciberbot iniciado.');
});

server.on('error', (error) => {
  logger.error({ error: error.message, puerto: env.PORT }, 'No se pudo iniciar el servidor.');
  process.exitCode = 1;
});
