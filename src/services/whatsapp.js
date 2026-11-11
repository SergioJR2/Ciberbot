import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

const GRAPH_API_VERSION = 'v27.0';
const GRAPH_API_BASE_URL = 'https://graph.facebook.com';

export async function enviarMensajeTexto(destinatario, texto) {
  if (!env.WHATSAPP_TOKEN.trim()) {
    throw new Error('Falta configurar WHATSAPP_TOKEN en .env.');
  }

  if (!env.WHATSAPP_PHONE_NUMBER_ID.trim()) {
    throw new Error('Falta configurar WHATSAPP_PHONE_NUMBER_ID en .env.');
  }

  if (typeof destinatario !== 'string' || destinatario.trim().length === 0) {
    throw new TypeError('El destinatario debe ser un número de WhatsApp válido.');
  }

  if (typeof texto !== 'string' || texto.trim().length === 0) {
    throw new TypeError('El mensaje de texto no puede estar vacío.');
  }

  const url = `${GRAPH_API_BASE_URL}/${GRAPH_API_VERSION}/${encodeURIComponent(env.WHATSAPP_PHONE_NUMBER_ID)}/messages`;
  const respuesta = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: destinatario,
      type: 'text',
      text: {
        preview_url: false,
        body: texto,
      },
    }),
  });

  let resultado;

  try {
    resultado = await respuesta.json();
  } catch {
    throw new Error('La respuesta de WhatsApp no contiene JSON válido.');
  }

  if (!respuesta.ok) {
    logger.error(
      {
        estadoHttp: respuesta.status,
        codigoError: resultado?.error?.code,
      },
      'Meta rechazó el envío del mensaje de WhatsApp.',
    );

    throw new Error('No se pudo enviar el mensaje de WhatsApp.');
  }

  const idMensaje = resultado?.messages?.[0]?.id;

  if (typeof idMensaje === 'string') {
    logger.info({ whatsappMessageId: idMensaje }, 'Mensaje de WhatsApp enviado.');
  }

  return resultado;
}
