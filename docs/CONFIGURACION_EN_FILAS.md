# Configuración en filas · 21/10/2026 · Solo local

Solicitud: acumular este ajuste junto al lote local de protección del almacenamiento, botones y pausa de revelación. No publicar hasta una nueva autorización.

- Etiquetas y controles en una fila; selectores con ancho de sus opciones y límite del espacio disponible. En pantallas estrechas la fila puede continuar abajo, sin desplazamiento horizontal.
- Porcentaje de activación junto a «Cuándo se aplica», con entrada breve y símbolo %. Aumento, máximo y cálculo por grupo conservan sus etiquetas. Tablas por adrenalina conservadas.
- Explicaciones bajo botones ⓘ: una ayuda abierta a la vez, cierre por otra pulsación, fuera de la ayuda o Escape. Escape cierra primero la ayuda. Mensajes de error, estado del almacenamiento, composición y disponibilidad siguen visibles.
- Apariencia directa: Apariciones adicionales y Marcador de puntaje sin secciones desplegables ni título duplicado.
- Reposición del nigromante oculta en Estándar; su valor permanece al volver a otro modo.
- Dificultad retirada por decisión explícita. Al abrir Configuración, `contenidoSinDificultad` transforma los filtros antiguos en selección individual desmarcando las cartas que excluían y habilita ambos campos históricos. No modifica el estado persistido hasta guardar, ni reconstruye el mazo activo o el historial. Los cambios de contenido siguen aplicándose desde la siguiente tanda.

Archivos principales: `dist/ayuda-configuracion.js`, `configuracion-ui.js`, `revelacion-ui.js`, `contenido.js`, `app.js`, `style.css`. Módulo nuevo incluido en preparación y paquete offline.

Validación: 406 pruebas de aplicación y 13 originales aprobadas. Prueba de transición: misma composición antes/después para las cuatro combinaciones de filtros, entrada intacta, transformación idempotente y selección posterior de cartas antes filtradas. QA `verificar-configuracion-filas.mjs`: cinco tamaños (1920×1200, 960×600, 844×390, 390×844 y 320×568), cuatro pestañas sin desbordes, ayuda/Escape, alineación de modo/porcentaje en tablet, reposición condicional, borrador sin persistir y guardado/recarga. `verificar-configuracion.mjs`: regresión de teclado, límites, Daily integrado, confirmaciones, cuota e historial conservado con recarga offline.

Límite: comprobación en Chrome de escritorio con ventanas de prueba; revisión física en Huawei pendiente. No se modificaron datos del navegador de uso habitual ni se subió a GitHub.
