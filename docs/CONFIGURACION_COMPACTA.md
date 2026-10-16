# Configuración compacta y reposición Daily · 15/10/2026

## Cambios

- Tabla de topes con encabezados explícitos «Nigromantes adicionales» y «Abominaciones totales», y ejemplos en la descripción. No cambia límites ni reglas.

- Listados dentro de cada caja ordenados alfabéticamente en español, incluidos secundarios, Daily y ayudas. Familias de zombis también ordenadas, conservando Fácil antes de Estándar dentro de cada familia. Orden aplicado solo a la presentación; selecciones e inventarios no se modifican. Verificados 24 grupos y 11 pruebas pertinentes tras este ajuste.
- Fácil y Estándar comparten una fila. Modo y reposición de cada mazo comparten una cuadrícula adaptable, con la identidad de abominación estándar cuando corresponda. Se reducen márgenes de secciones. Todos los selectores de configuración usan tipografía, fondo y altura coherentes con el diseño existente. En pantallas sin ancho suficiente los campos pasan a otra fila.
- Contenido inicia con sus cajas contraídas al abrir configuración y al cambiar de filtro. Cada caja tiene un checkbox general y un contador de identidades seleccionadas/seleccionables; no representa copias físicas. Parcial o vacío pasa a completo; completo pasa a vacío para las cartas editables. Las obligatorias conservan su selección y las pendientes no se habilitan. Si todas son obligatorias, el control general se deshabilita. El estado parcial se indica con `indeterminate` nativo y `aria-checked=mixed`.
- Cambiar una carta actualiza el resumen de su caja sin cerrar el desplegable. Cambiar la caja conserva si estaba abierta o cerrada. Los controles son independientes de la apertura del desplegable. La selección vinculada de las formas de Mumm-Ra se mantiene coherente tanto individualmente como al marcar/desmarcar una caja.
- Las cartas operativas de generales, secundarios y Daily tienen botón de consulta. Se muestran los recursos originales/traducidos existentes en Información y se permite ampliarlos. La consulta no requiere una extracción, no cambia selección ni consume cartas y vuelve al menú conservando el contexto. Colección conserva su estructura.

## Reposición de Daily Spawn

Pregunta confirmada por el usuario: en «Con reposición», la carta vuelve al retirarla de En juego y nunca puede duplicarse mientras siga presente. «Sin reposición» conserva el reciclado por ciclos existente.

Campo `config.modoDaily` opcional con valores `sin-reposicion` y `con-reposicion`. Ausente significa el comportamiento anterior, sin reposición. Una configuración guardada se aplica a la próxima tanda, conserva presentes y no repite sorteos ni interpreta de nuevo el historial. Al adoptar con reposición, los descartes anteriores quedan disponibles; las identidades fijadas permanecen excluidas. Anular tanda recupera el modo y el inventario previos. No se cambia el comportamiento de reposición de Abominaciones/Nigromantes en esta iteración ni se eluden las reapariciones especiales de Meng Huo.

## Archivos y validación

Interfaz: `dist/index.html`, `dist/style.css`, `dist/app.js`, `dist/informacion.js`, `dist/contenido.js`. Motor y compatibilidad: `dist/daily.js`, `dist/secundarios.js`, `dist/configuracion-partida.js`. Recursos PWA/versionado regenerados mediante `scripts/preparar.mjs`.

289/289 pruebas aprobadas, incluidas cinco nuevas sobre reposición, unicidad, cambio diferido, anulación, persistencia/cuota y selección por caja. Aserciones anteriores de presentación y metadatos Daily actualizadas al contrato vigente, sin alterar reglas para satisfacer pruebas.

`scripts/verificar-configuracion-compacta.mjs`: tipografía y disposición, cinco tamaños (1440×900, 1024×768, 844×390, 390×844, 320×568), sin desbordamiento horizontal del menú, cajas contraídas, cambios completos/parciales/vacíos, consultas con imágenes cargadas, guardado diferido, reapertura y consulta Daily offline. Contexto de Chrome aislado, sin modificar la partida del usuario. Capturas `docs/verificacion/configuracion-compacta-*.png`. Sin verificación en dispositivos físicos.
