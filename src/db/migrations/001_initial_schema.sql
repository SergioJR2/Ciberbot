CREATE TABLE clientes (
  telefono TEXT PRIMARY KEY,
  nombre TEXT,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE pedidos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  telefono TEXT NOT NULL,
  tipo TEXT,
  estado TEXT DEFAULT 'recopilando',
  datos TEXT,
  resumen TEXT,
  asignado_a TEXT,
  fecha_entrega TEXT,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP,
  actualizado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE archivos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  pedido_id INTEGER NOT NULL,
  origen TEXT,
  ruta TEXT,
  hash TEXT,
  fuente TEXT,
  creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE conversaciones (
  telefono TEXT PRIMARY KEY,
  pedido_id INTEGER,
  paso_actual TEXT,
  actualizado_en DATETIME
);

CREATE TABLE mensajes_procesados (
  wa_message_id TEXT PRIMARY KEY,
  procesado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE VIRTUAL TABLE pedidos_fts USING fts5(
  resumen,
  content = 'pedidos',
  content_rowid = 'id'
);
