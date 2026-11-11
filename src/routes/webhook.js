import { Router } from 'express';
import { env } from '../config/env.js';

const webhookRouter = Router();

webhookRouter.get('/', (request, response) => {
  const modo = request.query['hub.mode'];
  const tokenVerificacion = request.query['hub.verify_token'];
  const desafio = request.query['hub.challenge'];

  if (
    modo === 'subscribe' &&
    typeof tokenVerificacion === 'string' &&
    env.WEBHOOK_VERIFY_TOKEN.length > 0 &&
    tokenVerificacion === env.WEBHOOK_VERIFY_TOKEN &&
    typeof desafio === 'string'
  ) {
    return response.status(200).type('text/plain').send(desafio);
  }

  return response.sendStatus(400);
});

export default webhookRouter;
