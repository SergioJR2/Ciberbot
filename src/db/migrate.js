import { crearConexion } from './index.js';
import { aplicarMigraciones } from './migrations.js';

const conexion = crearConexion();

try {
  const migracionesAplicadas = aplicarMigraciones(conexion);

  if (migracionesAplicadas.length === 0) {
    console.info('La base de datos ya está actualizada.');
  } else {
    for (const nombreMigracion of migracionesAplicadas) {
      console.info(`Migración aplicada: ${nombreMigracion}`);
    }
  }
} catch (error) {
  console.error('No se pudieron aplicar las migraciones:', error);
  process.exitCode = 1;
} finally {
  conexion.close();
}
