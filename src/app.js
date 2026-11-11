import express from 'express';

const app = express();

app.disable('x-powered-by');

app.get('/health', (_request, response) => {
  response.status(200).json({
    estado: 'ok',
    servicio: 'ciberbot',
  });
});

export default app;
