import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { z } from 'zod';

const rutaArchivo = fileURLToPath(import.meta.url);
const directorioActual = path.dirname(rutaArchivo);

dotenv.config({
  path: path.join(directorioActual, '..', '..', '.env'),
});

const esquemaEntorno = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  TIMEZONE: z.string().trim().min(1).default('America/Guatemala'),
  WHATSAPP_TOKEN: z.string().default(''),
  WHATSAPP_PHONE_NUMBER_ID: z.string().default(''),
  WHATSAPP_APP_SECRET: z.string().default(''),
  WEBHOOK_VERIFY_TOKEN: z.string().default(''),
  TELEGRAM_BOT_TOKEN: z.string().default(''),
  TELEGRAM_CHAT_ID: z.string().default(''),
  ANTHROPIC_API_KEY: z.string().default(''),
  AI_MODEL: z.string().trim().min(1).default('claude-haiku-5-5'),
  PEXELS_API_KEY: z.string().default(''),
  UNSPLASH_ACCESS_KEY: z.string().default(''),
  PANEL_USER: z.string().default(''),
  PANEL_PASSWORD: z.string().default(''),
  RETENTION_DAYS: z.coerce.number().int().positive().default(30),
});

const resultado = esquemaEntorno.safeParse(process.env);

if (!resultado.success) {
  const errores = resultado.error.issues
    .map((issue) => `- ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');

  throw new Error(`La configuración de entorno no es válida:\n${errores}`);
}

export const env = resultado.data;
