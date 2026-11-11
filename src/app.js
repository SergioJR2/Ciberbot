import express from 'express';
import webhookRouter from './routes/webhook.js';

const app = express();

app.disable('x-powered-by');

app.get('/health', (_request, response) => {
  response.status(200).json({
    estado: 'ok',
    servicio: 'ciberbot',
  });
});

app.use('/webhook', webhookRouter);

export default app;
