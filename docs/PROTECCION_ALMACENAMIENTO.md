# Protección del almacenamiento · 21/10/2026 · Solo local

## Solicitud y comportamiento

El usuario autorizó solicitar protección al abrir la página y añadir un botón de reintento en Configuración → General. No pidió publicar este cambio; se mantiene local.

Al abrir una página visible se consulta `navigator.storage.persisted()`. Si ya está concedida, no se vuelve a pedir. Si falta la concesión, se llama a `navigator.storage.persist()` una vez durante esa apertura. Si la página empieza oculta se espera a que esté visible. Regresar a una pestaña ya abierta solo consulta el estado; otra apertura o recarga vuelve a solicitar si no hay concesión.

El botón Solicitar protección del almacenamiento llama nuevamente a `persist()` desde el gesto del usuario. Muestra Comprobando, Concedida, No concedida, Error o No compatible según la API real. Peticiones simultáneas se agrupan. Un error permite reintentar sin bloquear SPAWN. Se vuelve a consultar al regresar a la página para reflejar cambios externos del permiso.

La aplicación no puede obligar al navegador a mostrar un menú ni revocar/resetear permisos para provocar otro aviso. Algunos navegadores deciden sin diálogo, y un reintento puede volver a ser rechazado. No se crea una casilla o preferencia local que simule una concesión. El permiso es del navegador/origen, no de la partida ni una garantía para otros navegadores o dispositivos. Requiere soporte de la API y contexto seguro (HTTPS o localhost admitido por el navegador).

## Alcance y límites

La persistencia busca evitar la expulsión automática del almacenamiento por presión de espacio del navegador. No impide el borrado manual, ni garantiza protección frente a limpiadores externos o reinicio del dispositivo. El texto visible conserva la recomendación de exportar una partida como respaldo. No se abre la configuración nativa de Android ni se cambia el comportamiento del acceso instalado que falla en la tablet.

El módulo no lee, escribe, migra ni borra datos de la partida o preferencias de localStorage. No cambia el formato de guardado, el motor ni la recuperación offline. Se incluye en el paquete PWA.

Referencias verificadas: [persist()](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist) y [persisted()](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persisted).

## Archivos y validación

- `dist/proteccion-almacenamiento.js`: ciclo de permiso, diagnóstico y reintento, con dependencias inyectables.
- `dist/configuracion-ui.js` y `dist/app.js`: botón/explicación lateral en General y arranque independiente del formulario de partida.
- `scripts/preparar.mjs`: inclusión offline y versión generada.
- `tests/proteccion-almacenamiento.test.js`: seis pruebas significativas de concesión/rechazo, consulta/revocación, visibilidad, concurrencia, error, soporte y nuevas aperturas.
- `scripts/verificar-proteccion-almacenamiento.mjs`: QA aislado de petición automática y manual, cinco tamaños, estado sin API, guardado idéntico y recarga offline. Concesión simulada para comprobar ambos resultados.

404/404 pruebas de aplicación y 13/13 originales aprobadas. Regresión de Configuración aprobada. API real de Chrome consultada: devolvió no persistente y la UI informó No concedida, sin afirmar una protección inexistente. Captura de tablet revisada: `docs/verificacion/proteccion-almacenamiento-tablet.png`. No se ha comprobado en la Huawei MediaPad M5 Lite BAH2-W19 con Android/EMUI 8 del usuario.

Versión local preparada `af8660f6d0ae338f`. No subir a GitHub sin autorización.
