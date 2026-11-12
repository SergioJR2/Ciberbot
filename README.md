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

El proyecto levanta un servidor Express con una ruta de salud y un webhook de Meta. El webhook verifica la firma de las solicitudes, registra metadatos de mensajes entrantes y responde con un eco a los mensajes de texto usando WhatsApp Cloud API.

La respuesta eco sirve para probar la integración; todavía no procesa pedidos. No conectes un número de clientes reales mientras esa respuesta esté activa.

Consulta [la guía de configuración de Meta y ngrok](docs/configuracion-webhook-whatsapp.md) para probar el webhook localmente desde Windows.

## Requisitos

- Node.js 20.19 o superior dentro de la serie 20, 22.13 o superior dentro de la serie 22, o 24 o superior.
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
