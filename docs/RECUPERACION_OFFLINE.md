# Recuperación de caché offline incompleta · 21/10/2026

## Incidente y diagnóstico

Tras publicar el máximo Daily, el usuario informó que la tablet conectada a internet, desde el navegador, mostraba únicamente Recurso offline no disponible. La publicación de GitHub estaba correcta y cargaba en un navegador limpio. Entre los dos commits anteriores, la lógica del service worker no cambió: cambió su identificador de versión.

Se reprodujo exactamente la respuesta 503 retirando el paquete de caché en un contexto aislado con el service worker de `e7c9763`. El almacenamiento local se conservó. Esto confirma la condición del error (recurso ausente en el paquete que intenta servir el worker), no la causa concreta que dejó incompleta la caché de la tablet. No se accedió a la tablet ni se atribuye la pérdida a un limpiador, cuota o borrado específico sin evidencia.

## Corrección y rescate

- `recuperar.html` es una página autónoma, sin módulos, imágenes ni estilos externos. Se sirve fuera de la lista interceptada por el worker anterior y requiere conexión. El botón solicita una copia completa y activa una actualización disponible; si la versión actual ya está instalada, pide reparar su paquete.
- La recuperación no borra ni escribe localStorage, partidas, historial o configuración; no desregistra el worker. Avisa de guardar los borradores de otras pestañas antes de continuar.
- Un recurso de la versión activa ausente puede repararse desde la red, solo si la versión publicada coincide. Los archivos faltantes se descargan a una caché temporal y se comprueba la versión antes/después de descargarlos, antes de copiarlos al paquete activo. Fallos de red/cuota permiten reintentar sin borrar los datos de juego.
- Una navegación sin documento cacheado abre la página de recuperación desde la red. Sin conexión muestra una explicación y enlace de rescate, no solo el texto de error.
- Una pestaña antigua nunca obtiene módulos de otra versión como sustitución silenciosa. Si su paquete falta y la web ya cambió, debe pasar por una actualización completa.
- La instalación normal verifica también la versión publicada antes/después de la precarga. La reparación en curso queda protegida frente a la limpieza de paquetes.

El enlace de rescate se mantiene fuera de `ARCHIVOS` intencionalmente: debe poder cargarse desde la red aunque el paquete de la app esté roto. Si está sin conexión no sustituye una copia offline perdida.

## Validación

398 pruebas de aplicación y 13 originales aprobadas. `scripts/verificar-recuperacion-offline.mjs` reproduce el error con el worker anterior, descarga/activación nueva, reparación total y parcial de la misma versión, conservación byte por byte de la partida, fallo/reintento, explicación sin conexión, prohibición de mezclar módulos entre versiones y recuperación offline posterior. Rescate sin desborde en tablet/teléfono. La batería de actualización normal conserva borradores y otras pestañas, descarga fallida y activación offline.

Versión preparada `257f0abfd06e07b6`. Corrección del incidente de la publicación solicitada; no se cambia el máximo Daily ni las reglas de juego. La confirmación de recuperación en la tablet del usuario permanece pendiente.
