import assert from 'node:assert/strict';
import { createHmac, randomBytes } from 'node:crypto';
import { after, before, describe, it } from 'node:test';

const secretoAplicacion = randomBytes(32).toString('hex');
const tokenVerificacion = randomBytes(32).toString('hex');

process.env.WHATSAPP_APP_SECRET = secretoAplicacion;
process.env.WEBHOOK_VERIFY_TOKEN = tokenVerificacion;

let servidor;
let urlBase;

before(async () => {
  const { default: app } = await import('../src/app.js');

  servidor = app.listen(0, '127.0.0.1');

  await new Promise((resolve, reject) => {
    servidor.once('listening', resolve);
    servidor.once('error', reject);
  });

  const direccion = servidor.address();

  if (!direccion || typeof direccion === 'string') {
    throw new Error('No se pudo obtener el puerto del servidor de prueba.');
  }

  urlBase = `http://127.0.0.1:${direccion.port}`;
});

after(async () => {
  if (!servidor) {
    return;
  }

  await new Promise((resolve, reject) => {
    servidor.close((error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve();
    });
  });
});

describe('verificación del webhook', () => {
  it('devuelve el desafío cuando el token de verificación coincide', async () => {
    const respuesta = await fetch(
      `${urlBase}/webhook?hub.mode=subscribe&hub.verify_token=${tokenVerificacion}&hub.challenge=123456`,
    );

    assert.equal(respuesta.status, 200);
    assert.equal(await respuesta.text(), '123456');
  });

  it('rechaza la verificación cuando el token no coincide', async () => {
    const respuesta = await fetch(
      `${urlBase}/webhook?hub.mode=subscribe&hub.verify_token=${tokenVerificacion}-incorrecto&hub.challenge=123456`,
    );

    assert.equal(respuesta.status, 400);
  });
});

describe('validación de la firma del webhook', () => {
  const cuerpoWebhook = JSON.stringify({
    object: 'whatsapp_business_account',
    entry: [],
  });

  function crearFirma(secreto) {
    return `sha256=${createHmac('sha256', secreto).update(cuerpoWebhook).digest('hex')}`;
  }

  it('acepta una solicitud con una firma válida', async () => {
    const respuesta = await fetch(`${urlBase}/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': crearFirma(secretoAplicacion),
      },
      body: cuerpoWebhook,
    });

    assert.equal(respuesta.status, 200);
  });

  it('rechaza una solicitud con una firma inválida', async () => {
    const respuesta = await fetch(`${urlBase}/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': crearFirma(randomBytes(32).toString('hex')),
      },
      body: cuerpoWebhook,
    });

    assert.equal(respuesta.status, 401);
  });
});
