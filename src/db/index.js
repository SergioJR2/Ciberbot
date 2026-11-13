import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

const rutaArchivo = fileURLToPath(import.meta.url);
const directorioActual = path.dirname(rutaArchivo);
const directorioProyecto = path.join(directorioActual, '..', '..');

export const rutaBaseDatos = path.join(directorioProyecto, 'storage', 'ciberbot.sqlite');

export function crearConexion(ruta = rutaBaseDatos) {
  if (ruta !== ':memory:') {
    mkdirSync(path.dirname(ruta), { recursive: true });
  }

  const conexion = new Database(ruta);
  conexion.pragma('foreign_keys = ON');

  return conexion;
}
