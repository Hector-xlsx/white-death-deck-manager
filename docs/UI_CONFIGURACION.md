# Organización de Configuración · 19/10/2026

Refinamiento local posterior: nombres explícitos de mazos, Cartas Spawn especial, grupos plegables con consulta, ayudas por opción y elegibilidad Daily seleccionable. El porcentaje Daily se conserva al cambiar de adrenalina. Prevalece [AJUSTES_CONFIGURACION_Y_DAILY.md](AJUSTES_CONFIGURACION_Y_DAILY.md) para estos cambios; pendientes de publicación.

Cambio de interfaz solicitado y autorizado para publicar por el usuario. Conserva la estética, los controles y la lógica de la aplicación.

## Distribución

| Pestaña | Secciones |
| --- | --- |
| Contenido | Colección, Dificultad y Cartas de la partida. |
| Mazos | General y Spawn Especial, Nigromantes, Abominaciones y Daily Spawn. |
| Apariencia | Apariciones adicionales y Marcador de puntaje. |

Cada sección de ajustes se despliega por separado y muestra un resumen del borrador cuando está cerrada. Nigromantes y Abominaciones reúnen modo, reposición, acción predeterminada y sus propios topes personalizados. Los topes se muestran y habilitan únicamente cuando corresponde a ese modo.

Daily integrado conserva su habilitación en Daily, oculta los parámetros probabilísticos independientes y ofrece «Ir a Spawn Especial» para editar sus cantidades/reposición. Los ajustes independientes se conservan en el formulario. Las ayudas extensas se pliegan en «Cómo funciona».

## Navegación y guardado

Las pestañas admiten flechas, Inicio/Fin y navegación por teclado, con roles y relaciones accesibles. Cambiar de pestaña no guarda, borra ni reconstruye el borrador. Los controles se mueven una sola vez al iniciar la interfaz, conservando nombres y manejadores; no se clonan inputs.

Guardar configuración permanece al pie fuera del contenido desplazable, junto a errores y una nota sobre aplicación de cambios. El resumen de cantidades se oculta en pantallas de poca altura para dejar espacio útil. Iniciar nueva partida se ubica en un desplegable separado y conserva su confirmación y su comportamiento anteriores.

Las acciones predeterminadas de enemigos conservan el guardado inmediato al seleccionarlas, identificado junto a cada control. Los demás ajustes mantienen el guardado explícito, la aplicación a la próxima tanda y la apariencia al guardar. La confirmación de salida con cambios pendientes se conserva. Se abre la sección/pestaña correspondiente ante una validación nativa inválida.

Una pestaña oculta no deshabilita los controles de Especial: solo se consideran las secciones ocultas por su modalidad dentro del propio Especial. Esto permite reabrir y editar una configuración activa tras una recarga, sin alterar la validación de campos que no corresponden al modo.

## Archivos y verificación

- `dist/configuracion-ui.js`: agrupación de nodos, navegación, resúmenes y ayuda.
- `dist/app.js`: inicialización, visibilidad de topes por familia y actualización de resúmenes.
- `dist/style.css`: disposición adaptable con encabezado/pestañas/pie fijos y cuerpo desplazable.
- `dist/especial-ui.js`: habilitación independiente de la visibilidad de la pestaña.
- `scripts/preparar.mjs`: nuevo módulo incluido en caché y versión PWA.
- `scripts/ayuda-configuracion.mjs`: navegación compartida para QA; scripts vigentes de Especial, puntaje, ocultación, Daily y vista de mesa adaptados a las pestañas.

Pasaron 334/334 pruebas de la aplicación y 13/13 de la base. `scripts/verificar-configuracion.mjs` verifica teclado, controles únicos, borradores entre pestañas, guardado explícito e inmediato, límites, Daily integrado, confirmación de nueva partida, errores/cuota, reapertura de Especial y recarga offline.

QA de Configuración, Especial, puntaje/ocultación, defaults Daily y vista de mesa aprobado. Cinco tamaños: 1440×900, 1024×768, 844×390, 390×844 y 320×568. Capturas `docs/verificacion/configuracion-*.png` revisadas visualmente. Se usaron contextos aislados; no se modificó la partida del usuario.

Sin cambios a motor, reglas, catálogo, formato persistido o dependencias. Sin pruebas en dispositivos físicos. La subida a main y la publicación mediante el workflow Pages existente fueron autorizadas por el usuario en esta solicitud.
