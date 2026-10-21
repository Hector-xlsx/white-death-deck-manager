# Pantalla principal compacta y selector por iconos

21/10/2026. Implementación y validación local completadas. El usuario autorizó después subir el lote a GitHub, lo que activa la publicación automática existente en `main`. Esta autorización sustituye la pausa de publicación solicitada mientras se reunían los ajustes.

## Alcance completado

- Aparición: un único botón cíclico Adaptativa → Horizontal → Vertical → Adaptativa. Representación de nueve cuadrados, barra horizontal y barra vertical. Icono del modo activo, nombre accesible y tooltip con modo actual/siguiente. Conserva la clave de preferencia anterior; Enter/Espacio funcionan como pulsación. No modifica distribución ni orden de cartas más allá de seleccionar uno de los modos ya existentes.
- Pantalla principal: retirados visualmente barra/porcentaje y rótulo Mazo general, etiqueta superior y texto del pie. Se conservan los nodos internos de porcentaje para compatibilidad del render, ocultos. El estado offline permanece para accesibilidad y comprobaciones, sin ocupar espacio; errores de guardado y aviso de actualización siguen disponibles.
- Adrenalina centrada encima del contador de zonas estándar. SPAWN y zonas se reorganizan para tablet horizontal y teléfono. Historial se traslada a la misma fila de controles que lupa, pantalla completa y Configuración, como icono con contador y nombre accesible.
- En juego pasa a la sección intermedia; título, ojo y Mostrar desfijados se alinean con la muralla. Última tanda pasa a la sección inferior y su encabezado se alinea con el separador de corrupción.
- Última tanda plegable, inicialmente cerrada al cargar. El control informa `aria-expanded`; Ver cartas sigue disponible sin desplegar las miniaturas. La apertura del plegable se mantiene durante la sesión y no modifica la partida.
- Compactación de separación entre secciones y miniaturas: reserva uniforme de 28 px arriba/abajo en Última tanda, suficiente para ambos marcos actuales. Imágenes y referencias originales conservadas; no depende de que salga una carta con marco.
- Lupa de pantalla principal con controles −/porcentaje/+, paso de 5 %, límites 75–125 %, inicio 100 % al recargar. Solo escala la página central; Aparición, Historial, Configuración y demás diálogos conservan su escala. Los controles táctiles mantienen al menos 44 px efectivos. Escape cierra el control sin interferir con un diálogo abierto. El aviso de actualización se mantiene fuera de la escala para conservar su presentación.

Las decisiones reversibles de esta entrega son Última tanda inicialmente cerrada y zoom principal con los mismos límites de Aparición. Se declararon en el chat antes de aplicarlas. No se incorporaron como reglas permanentes del proyecto.

## Validación

376/376 pruebas actuales. QA nuevo `scripts/verificar-pantalla-principal-compacta.mjs`: orden de secciones, plegado y acceso directo, adrenalina centrada sobre el contador, herramientas alineadas, cinco tamaños (1440×900, 960×600, 844×390, 390×844, 320×568), cinco escalas 75/95/100/110/125 % en tablet y teléfono, controles táctiles, independencia del zoom de Aparición, iconos/ciclo/teclado/preferencia, Historial, bytes de partida intactos y recarga offline. Se utilizó copia aislada del JSON facilitado mediante `MAZO_PARTIDA`, sin modificar ni incluir el archivo original.

Regresiones aprobadas: marcos en Aparición y Última tanda desplegada (cinco tamaños, abertura y adornos, alineación, zoom y offline), tres vistas de Aparición con el botón cíclico, descarga JSON, cuota/conflicto de pestañas y pantalla completa real en Chrome. Los verificadores de vistas y marcos se adaptaron al botón y al plegado inicial. No se afirma prueba física en la tablet del usuario.

Capturas revisadas: `docs/verificacion/principal-compacta-960.png` y `principal-compacta-390.png`. La falta de espacio en teléfono puede repartir un encabezado en varias filas; no se ocultan controles para forzar una única fila. La compactación no garantiza ausencia de desplazamiento vertical con cualquier cantidad de enemigos o escala.

## Archivos y continuidad

Nuevo módulo de interfaz `dist/vista-mesa.js`, inicializado desde `app.js`; cambios en `index.html`, `style.css`, `escala-aparicion.js`, precarga y PWA regenerada. Sin cambios al motor, catálogos, formato de partida, reglas ni datos exportados.

Lote preparado para commit y subida autorizados; verificar el workflow y la versión servida antes de dar por completada la publicación. No cambia la configuración del alojamiento. Continúan fuera de este alcance la protección frente a limpiadores y cualquier nuevo ajuste que surja de la revisión.
