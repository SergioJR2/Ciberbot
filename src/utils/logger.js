import pino from 'pino';
import { env } from '../config/env.js';

const rutasSensibles = [
  'authorization',
  'cookie',
  'password',
  'token',
  'apiKey',
  '*.authorization',
  '*.cookie',
  '*.password',
  '*.token',
  '*.apiKey',
  '*.accessToken',
  '*.refreshToken',
  'req.headers.authorization',
  'req.headers.cookie',
  'WHATSAPP_TOKEN',
  'WHATSAPP_APP_SECRET',
  'WEBHOOK_VERIFY_TOKEN',
  'TELEGRAM_BOT_TOKEN',
  'ANTHROPIC_API_KEY',
  'PEXELS_API_KEY',
  'UNSPLASH_ACCESS_KEY',
  'PANEL_PASSWORD',
  '*.WHATSAPP_TOKEN',
  '*.WHATSAPP_APP_SECRET',
  '*.WEBHOOK_VERIFY_TOKEN',
  '*.TELEGRAM_BOT_TOKEN',
  '*.ANTHROPIC_API_KEY',
  '*.PEXELS_API_KEY',
  '*.UNSPLASH_ACCESS_KEY',
  '*.PANEL_PASSWORD',
];

export const logger = pino({
  level: env.NODE_ENV === 'development' ? 'debug' : 'info',
  base: { servicio: 'ciberbot' },
  redact: {
    paths: rutasSensibles,
    censor: '[REDACTADO]',
  },
});
