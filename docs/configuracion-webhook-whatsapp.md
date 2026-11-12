# Configurar Meta y ngrok para probar el webhook

Esta guía explica cómo exponer temporalmente el servidor local de Ciberbot para recibir webhooks de WhatsApp Cloud API. Está escrita para Windows 11 y PowerShell.

## Alcance y precauciones

- La ruta pública de callback es `/webhook`.
- El servidor valida `X-Hub-Signature-256` antes de procesar los eventos.
- Durante esta fase, cada mensaje entrante de tipo texto recibe como respuesta el mismo texto. Es una respuesta eco para pruebas, no el flujo final de pedidos.
- Usa un número de prueba de Meta y un destinatario de prueba autorizado. No conectes conversaciones de clientes mientras la respuesta eco esté activa.
- Mantén el túnel de ngrok abierto solo durante las pruebas. Su URL permite llegar desde Internet al puerto local que reenvía.
- No publiques `.env`, tokens, secretos de Meta ni el authtoken de ngrok.

## 1. Instalar ngrok

Instala ngrok desde su [página oficial para Windows](https://ngrok.com/download/windows). La guía oficial ofrece instalación desde Microsoft Store, WinGet, Scoop o descarga directa.

Comprueba la instalación:

```powershell
ngrok version
```

Conecta el agente a tu cuenta usando el authtoken que muestra el panel de ngrok:

```powershell
ngrok config add-authtoken "<AUTHTOKEN_DE_NGROK>"
```

Ese comando guarda el authtoken en la configuración local de ngrok; no lo agregues al repositorio ni a `.env` de Ciberbot.

## 2. Preparar las variables de Meta

Antes de editar `.env`, completa el flujo oficial de [inicio de WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started/): crea o selecciona una app en Meta for Developers y habilita WhatsApp Cloud API. Meta indica que el uso de Cloud API requiere un portafolio comercial, una WhatsApp Business Account (WABA) y un número de teléfono; el flujo de inicio ayuda a crear o conectar esos recursos. Para esta guía, usa los recursos de prueba que te presenta el panel.

Desde la carpeta del proyecto, crea `.env` solo si aún no existe:

```powershell
if (-not (Test-Path -LiteralPath .env)) {
    Copy-Item -LiteralPath .env.example -Destination .env
}
```

Abre `.env` en VS Code y completa estas variables con los valores de tu app y número de prueba:

| Variable                   | Valor que debes configurar                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------------- |
| `WHATSAPP_TOKEN`           | Token de acceso de WhatsApp Cloud API.                                                       |
| `WHATSAPP_PHONE_NUMBER_ID` | ID del número que enviará las respuestas.                                                    |
| `WHATSAPP_APP_SECRET`      | Secreto de la app de Meta; se usa para validar firmas.                                       |
| `WEBHOOK_VERIFY_TOKEN`     | Texto secreto que eliges y que debe coincidir con el configurado para verificar el callback. |

Obtén el token de acceso y el ID del número desde la sección de WhatsApp de tu app. El secreto de la app se obtiene desde la configuración de esa app. Los nombres de las secciones del panel pueden cambiar; sigue el flujo oficial enlazado arriba si difieren de esta guía.

Usa valores reales solo en `.env`, que está excluido por `.gitignore`. No rellenes `.env.example` con secretos ni los pegues en un issue, pull request o chat.

## 3. Iniciar Ciberbot

En una ventana de PowerShell, desde la carpeta del proyecto:

```powershell
npm install
npm start
```

El servidor usa el puerto definido en `PORT` (por defecto, `3000`). Comprueba la ruta local de salud desde otra ventana:

```powershell
Invoke-WebRequest -Uri 'http://localhost:3000/health' -UseBasicParsing |
    Select-Object StatusCode, Content
```

Debe responder HTTP `200` con el estado `ok`. Si aparece `EADDRINUSE`, ya hay otro proceso ocupando el puerto; detén la instancia anterior con `Ctrl+C` antes de iniciar otra.

## 4. Abrir el túnel HTTPS

En una segunda ventana de PowerShell, ejecuta:

```powershell
ngrok http 3000
```

Ngrok mostrará una URL HTTPS pública que reenvía tráfico al puerto local `3000`. Copia esa URL y añádele `/webhook`; ese resultado será el callback, por ejemplo:

```text
https://<URL-HTTPS-DE-NGROK>/webhook
```

La URL puede cambiar entre sesiones. Si cambia, actualiza el callback en la configuración de Meta antes de probar de nuevo.

## 5. Configurar el webhook en Meta

Sigue la sección de webhooks de la [documentación oficial de WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/) y configura la app de prueba:

1. Usa la URL HTTPS de ngrok terminada en `/webhook` como callback.
2. Escribe en Meta el mismo valor que guardaste en `WEBHOOK_VERIFY_TOKEN`.
3. Completa la verificación del callback. Ciberbot compara `hub.mode` y `hub.verify_token`, y devuelve `hub.challenge` cuando coinciden.
4. Suscribe el campo `messages` para recibir mensajes entrantes.
5. Verifica que la app esté suscrita a la WhatsApp Business Account (WABA) de prueba. Meta documenta este paso en su colección oficial de [WhatsApp Cloud API](https://www.postman.com/meta/whatsapp-business-platform/documentation/wlk6lh4/whatsapp-cloud-api).

El envío de texto del servicio está fijado a Graph API `v27.0`, la versión que Meta destaca actualmente en sus [novedades para desarrolladores](https://developers.meta.com/blog/). Revisa la versión vigente en esa fuente antes de actualizarla.

## 6. Probar el flujo eco

Desde un destinatario de prueba permitido, envía un mensaje de texto al número de prueba de WhatsApp. Con el servidor y ngrok activos, Ciberbot debe:

1. Recibir el `POST` firmado en `/webhook`.
2. Responder HTTP `200` al webhook.
3. Registrar el ID y tipo del mensaje, sin registrar el teléfono ni el texto.
4. Enviar como respuesta el mismo texto recibido.

La respuesta libre corresponde a una conversación iniciada por el usuario. La política de WhatsApp permite respuestas sin plantilla dentro de la ventana de servicio de 24 horas; fuera de esa ventana solo permite mensajes con plantillas aprobadas. Consulta la [política oficial de WhatsApp Business](https://whatsappbusiness.com/policy/).

## 7. Detener la prueba

Presiona `Ctrl+C` en las ventanas de Ciberbot y ngrok cuando termines. No dejes el túnel activo si no estás probando el webhook.

## Referencias oficiales

- [Instalar ngrok en Windows](https://ngrok.com/download/windows)
- [Inicio rápido de ngrok](https://ngrok.com/docs/start)
- [Inicio de WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/get-started/)
- [Webhooks de WhatsApp Cloud API](https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/)
- [Colección oficial de Meta para WhatsApp Cloud API](https://www.postman.com/meta/whatsapp-business-platform/)
- [Novedades de Meta para desarrolladores](https://developers.meta.com/blog/)
- [Política de WhatsApp Business](https://whatsappbusiness.com/policy/)
