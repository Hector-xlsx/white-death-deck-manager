# Ajustes de mesa y registro · 21/10/2026 · Solo local

El usuario pidió conservar este lote en local para probar los lanzadores. No se autoriza su subida ni publicación en esta entrega.

## Presentación

- Ajuste estético posterior: dificultad visible **Base** (antes Fácil) y **Avanzado** (antes Estándar), en opciones, resumen y etiquetas de contenido. Valores históricos `Fácil`/`Normal`, IDs y filtros `easy`/`normal` conservados. 41 pruebas relacionadas aprobadas; versión local preparada tras este cambio: `a509cd8d8c3e9818`.
- Aparición muestra junto al título una insignia del nivel con el que se generó la tanda, sin selector ni rótulo adicional. Conserva el nivel histórico al reabrir; la ausencia del campo en formatos antiguos equivale a Azul según el contrato existente.
- Última tanda conserva su plegado y muestra **Ver** inmediatamente después del título, antes del separador.
- En juego agrupa **Ampliar** y **Mostrar/Ocultar desfijados** a continuación del título. Comparten el estilo de botón de texto; los controles pueden pasar de línea en pantallas pequeñas.
- Iniciar nueva partida aparece únicamente en General, con la misma advertencia y confirmación.
- El usuario confirmó en su tablet el funcionamiento de Mantener pantalla encendida. No se cambia esa función.

## Registro exportable

`partida.registroActividad` se incorpora en la siguiente acción que produzca un cambio guardado. Conserva una instantánea inicial (incluye configuración, catálogo y estado de mazos) y eventos consecutivos con `fecha` en milisegundos Unix, `tipo`, número de `tanda` y `cambios`. SPAWN incluye además la fecha de generación ya guardada en la tanda. Una tanda anulada y una posterior pueden tener el mismo número; los IDs consecutivos de evento las distinguen.

Cada cambio contiene una `ruta` de claves/índices y los valores `antes` y `despues` cuando existen. La ausencia de uno de esos campos indica una incorporación o eliminación. Incluye cambios en cartas de todos los mazos, probabilidades, configuración vigente/pendiente, selección de cajas/cartas y contadores. El estado inicial más los cambios permite analizar el contexto en que se jugó. No se incorporan imágenes ni envíos externos.

La anulación restaura el juego y conserva el registro; el evento incluye la tanda retirada. Los respaldos para anular excluyen el registro para evitar duplicaciones recursivas. El historial visual continúa mostrando solo tandas vigentes. Al iniciar otra partida, el nuevo registro comienza con su propia configuración; no funciona como archivo de partidas anteriores.

No se reconstruyen interacciones previas a esta versión. Los clics sin cambios, zoom, preferencias de dispositivo, intentos rechazados y acciones físicas no registradas no forman parte de este registro. El guardado y el registro se escriben juntos: ante cuota o conflicto no se confirma ninguno. El volumen aumenta con la actividad; no se recorta automáticamente el historial. La exportación existente incluye el campo íntegro y mantiene su formato compatible.

## Actualización

La búsqueda manual espera también la transición entre un worker instalado y su disponibilidad en `registration.waiting`, y captura `updatefound` antes de solicitar la actualización. Una pulsación descarga y activa desde General, conservando las protecciones de borradores y otras pestañas. Ante un fallo informa y permite reintentar; no borra almacenamiento.

## Verificación

380/380 pruebas de aplicación y 13/13 originales aprobadas; prueba de registro cubre regeneración general/secundaria, anulación, recuperación, exportación, configuración pendiente, cuota, conflicto y nueva partida. QA en Chrome aislado: cinco tamaños, tres distribuciones, escalas de Aparición, nueva ubicación de gestión, exportación real y recuperación offline. Actualización verificada con paquete en espera, una pulsación, disponibilidad retrasada de `waiting`, borradores, dos pestañas, descarga fallida y activación offline. Captura de insignia revisada en `docs/verificacion/feedback-adrenalina-tablet.png`. Versión local preparada: `6f2c3d9ab1aef952`.

No se modifica la partida del usuario ni se reinicia su servidor del puerto 8080. La revisión visual en la tablet física de estos ajustes queda a cargo del usuario. Para probar: ejecutar `REINICIAR_LOCAL.cmd`, mantener la ventana abierta y usar Configuración → General → Buscar y aplicar actualización en el mismo origen local.
