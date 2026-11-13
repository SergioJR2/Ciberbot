import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const rutaArchivo = fileURLToPath(import.meta.url);
const directorioActual = path.dirname(rutaArchivo);
const directorioMigraciones = path.join(directorioActual, 'migrations');

export function aplicarMigraciones(conexion) {
  conexion.exec(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      nombre TEXT PRIMARY KEY,
      aplicada_en DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const archivosMigracion = readdirSync(directorioMigraciones, { withFileTypes: true })
    .filter((archivo) => archivo.isFile() && archivo.name.endsWith('.sql'))
    .map((archivo) => archivo.name)
    .sort();
  const buscarMigracion = conexion.prepare('SELECT nombre FROM schema_migrations WHERE nombre = ?');
  const guardarMigracion = conexion.prepare('INSERT INTO schema_migrations (nombre) VALUES (?)');
  const aplicadas = [];

  for (const nombreArchivo of archivosMigracion) {
    if (buscarMigracion.get(nombreArchivo)) {
      continue;
    }

    const rutaMigracion = path.join(directorioMigraciones, nombreArchivo);
    const contenidoMigracion = readFileSync(rutaMigracion, 'utf8');
    const aplicarUnaMigracion = conexion.transaction(() => {
      conexion.exec(contenidoMigracion);
      guardarMigracion.run(nombreArchivo);
    });

    aplicarUnaMigracion();
    aplicadas.push(nombreArchivo);
  }

  return aplicadas;
}
