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

## Avances realizados

- Servidor Express con una ruta de salud.
- Webhook de Meta con verificación.
- Validación de la firma de las solicitudes entrantes.
- Registro de metadatos de los mensajes recibidos.
- Respuesta eco a mensajes de texto mediante WhatsApp Cloud API.
- Guía de configuración de Meta y ngrok para Windows.
- Scripts de npm para iniciar, desarrollar y probar el proyecto.

## Estado actual

El proyecto levanta un servidor Express con una ruta de salud y un webhook de Meta. El webhook verifica la firma de las solicitudes, registra metadatos de mensajes entrantes y responde con un eco a los mensajes de texto usando WhatsApp Cloud API.

La respuesta eco sirve para probar la integración; todavía no procesa pedidos. No conectes un número de clientes reales mientras esa respuesta esté activa.

Consulta [la guía de configuración de Meta y ngrok](docs/configuracion-webhook-whatsapp.md) para probar el webhook localmente desde Windows.

## Flujo actual de un mensaje

1. Una persona envía un mensaje de texto por WhatsApp.
2. Meta envía la solicitud al webhook del proyecto.
3. El webhook verifica la firma de la solicitud.
4. Se registran los metadatos del mensaje recibido.
5. El proyecto responde con un eco del mismo texto usando WhatsApp Cloud API.

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
