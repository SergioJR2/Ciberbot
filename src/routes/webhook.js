import express, { Router } from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const webhookRouter = Router();

function validarFirmaWebhook(request, response, next) {
  const firmaHeader = request.get('x-hub-signature-256');
  const secretoAplicacion = env.WHATSAPP_APP_SECRET;

  if (
    !Buffer.isBuffer(request.cuerpoCrudo) ||
    secretoAplicacion.length === 0 ||
    typeof firmaHeader !== 'string'
  ) {
    return response.sendStatus(401);
  }

  const [algoritmo, firmaHex, ...partesAdicionales] = firmaHeader.split('=');

  if (
    algoritmo !== 'sha256' ||
    partesAdicionales.length > 0 ||
    typeof firmaHex !== 'string' ||
    !/^[\da-f]{64}$/i.test(firmaHex)
  ) {
    return response.sendStatus(401);
  }

  const firmaEsperada = createHmac('sha256', secretoAplicacion)
    .update(request.cuerpoCrudo)
    .digest();
  const firmaRecibida = Buffer.from(firmaHex, 'hex');

  if (!timingSafeEqual(firmaEsperada, firmaRecibida)) {
    return response.sendStatus(401);
  }

  return next();
}

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

webhookRouter.post(
  '/',
  express.json({
    verify: (request, _response, buffer) => {
      request.cuerpoCrudo = Buffer.from(buffer);
    },
  }),
  validarFirmaWebhook,
  (request, response) => {
    const entradas = Array.isArray(request.body?.entry) ? request.body.entry : [];

    for (const entrada of entradas) {
      const cambios = Array.isArray(entrada?.changes) ? entrada.changes : [];

      for (const cambio of cambios) {
        if (cambio?.field !== 'messages') {
          continue;
        }

        const mensajes = Array.isArray(cambio.value?.messages) ? cambio.value.messages : [];

        for (const mensaje of mensajes) {
          logger.info(
            {
              whatsappMessageId: mensaje?.id,
              tipo: mensaje?.type,
            },
            'Mensaje entrante de WhatsApp recibido.',
          );
        }
      }
    }

    return response.sendStatus(200);
  },
);

export default webhookRouter;
