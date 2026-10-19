# Organización de Configuración · 19/10/2026

## Pantalla completa · 19/10/2026

Botón junto a Configuración para entrar/salir de pantalla completa mediante un gesto del usuario. Cambia su icono y nombre accesible, refleja salidas realizadas desde el navegador y mantiene los controles táctiles de al menos 44 px. La solicitud utiliza el documento completo para conservar acceso a diálogos. No guarda preferencias ni modifica la partida, no se activa automáticamente al abrir y no fuerza la instalación de la PWA. Si falta soporte o el navegador rechaza la solicitud, muestra un aviso recuperable. Compatibilidad por detección de API estándar/WebKit.

Verificación: scripts/verificar-pantalla-completa.mjs comprueba entrada/salida real en Chrome, salida externa, Configuración dentro de pantalla completa, cinco tamaños sin solapes, API no permitida, rechazo, variante WebKit simulada, guardado intacto y recarga offline. Regresiones de vista de mesa y Configuración aprobadas; capturas de tablet y teléfono revisadas. Sin verificación en el tablet físico ni en Safari real. El nuevo módulo se incluye en el paquete offline.

## Revisión de claridad · 19/10/2026

Textos de configuración y avisos revisados para explicar los mazos, topes, intentos, porcentajes y tandas sin depender del desarrollo. Ajustes solo de presentación; reglas, valores internos y guardados conservados. Ejemplos, alcance y propuestas separadas en [REVISION_TEXTOS_INTERFAZ.md](REVISION_TEXTOS_INTERFAZ.md).

## Corrección de Revelación · 19/10/2026

Personalizado utiliza únicamente los controles nuevos Siempre / Por probabilidad / Nunca. Retirados «Configurar acciones independientes» y «Combinación anterior». «Calcular por: Independiente / Todos juntos» pertenece solo a activación adicional de abominaciones y otros nigromantes, excluyendo al Profanador. Perfiles guardados e historial conservados; perfiles futuros ausentes se completan al guardar configuración o al siguiente SPAWN. Este cierre sustituye las notas anteriores sobre mantener ambas alternativas. Detalle: [REVELACION_ACCIONES_INDEPENDIENTES.md](REVELACION_ACCIONES_INDEPENDIENTES.md).

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
