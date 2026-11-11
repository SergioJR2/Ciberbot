# Ciberbot

Asistente de pedidos por WhatsApp para cibercafés.

## Propósito

Ciberbot busca facilitar la recepción de trabajos que los clientes solicitan a un cibercafé. El objetivo es que el asistente identifique el tipo de pedido, recopile los datos necesarios y prepare una solicitud ordenada para que el empleado la complete.

Los resultados automáticos deben ser revisados por el empleado antes de entregarse al cliente.

## Tipos de pedido previstos

- Investigaciones con ilustraciones.
- Búsqueda de ilustraciones.
- Acomodar imágenes para imprimir.
- Transcribir imágenes a texto mediante OCR.
- Localizar trabajos anteriores parecidos.

Estas funciones forman parte del plan del proyecto; todavía no están implementadas.

## Estado actual

El repositorio está preparado como proyecto Node.js con módulos ES. Por ahora, el programa solo imprime un mensaje de inicio: todavía no levanta un servidor ni se conecta a WhatsApp.

La recepción de pedidos, el procesamiento de archivos, los avisos al empleado y el panel web se incorporarán en commits posteriores.

## Requisitos

- Node.js 20 o superior.
- npm, incluido con Node.js.

## Ejecutar en Windows con PowerShell

Desde la carpeta del proyecto, instala las dependencias:

```powershell
npm install
```

Inicia el programa:

```powershell
npm start
```

Para usar el modo de desarrollo, que reinicia el programa cuando cambia un archivo:

```powershell
npm run dev
```

Detén el modo de desarrollo con `Ctrl+C`.

## Pruebas

Ejecuta el test runner nativo de Node.js:

```powershell
npm test
```

Todavía no hay pruebas automatizadas, así que el resultado actual esperado es cero pruebas fallidas y cero pruebas ejecutadas.
