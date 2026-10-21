# Aparición compacta y configuración General

Fecha: 20/10/2026. Alcance autorizado: compactar Aparición manteniendo reserva uniforme para marcos, control de escala, pestaña General con actualización directa y casilla para mantener pantalla encendida. Subida a GitHub/Pages autorizada en la misma solicitud para revisión física en tablet.

## Aparición

- Encabezado en una fila cuando hay espacio: Aparición · Tanda N · zonas iniciales. Se adapta en pantallas estrechas. Retirada la explicación permanente; se conservan nombres accesibles y tooltips de controles.
- Carta de 155 px conservada al 100 %. Reserva vertical de 36 px arriba y 40 px abajo para todas las cartas, tengan o no marco. Sustituye 62 px por lado en Aparición; no cambia Última tanda ni Historial.
- Reserva basada en los bordes visibles de ambos PNG actuales, no solo en las cartas que salgan: extensión superior máxima medida ≈32,4 px e inferior ≈36,3 px. Contorno, abertura central y proporciones originales conservados. Los márgenes no dependen del contenido de la tanda.
- Cuadrícula con 4 px de protección lateral y recorte de desbordamiento transparente del recurso; los adornos visibles permanecen dentro de la reserva y no interfieren con los botones.
- Control −/porcentaje/+ junto al cierre. Pasos de 5 %, de 75 % a 125 %, solo para el contenido de Aparición. El encabezado y cierre no se reducen; los botones de cartas mantienen al menos 44 px efectivos. Empieza en 100 % al recargar y conserva la elección al cerrar/reabrir Aparición durante la sesión. No cambia la escala de la pantalla principal, Historial ni En juego.

## General

Nueva pestaña junto a Contenido, Mazos y Apariencia. Se conserva la pestaña inicial y la navegación de teclado existente; General es accesible directamente.

Actualizar aplicación se traslada desde Apariencia a General, sin desplegable: botón a la izquierda y explicación a la derecha; en teléfono estrecho pasan a una columna. Conserva búsqueda, espera de descarga, protección de borradores y activación de la versión completa en esta pestaña.

Mantener pantalla encendida usa Screen Wake Lock. Desactivado inicialmente; preferencia independiente de la partida, en la clave local `white-death-pantalla-encendida-v1`. Se aplica sin Guardar configuración. Solicita el bloqueo al marcar o al recuperar una preferencia activa, libera al ocultarse y lo solicita de nuevo al volver. Una respuesta tardía se libera si la opción ya no está marcada o la página está oculta. Los rechazos, liberaciones del sistema y falta de soporte se muestran explícitamente. Si no se puede guardar la preferencia, puede actuar durante la sesión y se informa.

El navegador y el sistema pueden rechazar o retirar el bloqueo; la casilla representa la preferencia y el texto indica el estado efectivo. No fuerza ajustes del sistema, no impide que el usuario bloquee el equipo ni promete funcionamiento con la página en segundo plano. Fuente primaria: [MDN · WakeLock.request](https://developer.mozilla.org/en-US/docs/Web/API/WakeLock/request).

## Validación

373/373 pruebas actuales, incluidas cuatro sobre activación, liberación/rechazo, recuperación, petición tardía, falta de soporte y almacenamiento bloqueado. QA Chrome de Configuración y actualización aprobados: cuatro pestañas/teclado, guardado, borradores, dos pestañas, cinco tamaños, descarga fallida y offline.

`scripts/verificar-mesa-compacta.mjs`: seis tamaños (1440×900, 1024×600, 1024×768, 844×390, 390×844 y 320×568); General directo, wake lock simulado con pausa/recuperación/rechazo y preferencia al recargar, escala y límites, controles táctiles, estado sin cambios y recuperación offline. Se utilizó una copia aislada del JSON facilitado mediante `MAZO_PARTIDA`, sin incluirlo en el repositorio ni modificar el archivo original. La tanda 8 muestra sus cuatro cartas y controles de la primera fila en 1024×600. Quitar los marcos del DOM no cambia las posiciones de tokens, imágenes ni acciones.

Regresión `scripts/verificar-marcos.mjs`: ambos marcos, abertura con tolerancia de 0,15 px, alineación de filas, adornos sin cortar ni invadir tokens/botones, cinco tamaños, zoom de carta y offline. Capturas revisadas: `docs/verificacion/aparicion-compacta-tablet.png`, `general-tablet.png` y regresiones de marcos. La API de pantalla encendida se comprobó con simulaciones controladas; falta confirmar el comportamiento del Huawei y su ahorro de batería durante uso prolongado. La foto no identifica con precisión el viewport CSS físico; 1024×600 es una prueba de referencia, no una medición de la tablet.

Cambios en `dist/index.html`, `style.css`, `configuracion-ui.js`, `app.js`, módulos `pantalla-encendida.js`/`escala-aparicion.js`, precarga y paquete PWA regenerado. No cambian reglas, motor, datos de cartas ni formato de partida.

## Pendientes

Revisión física por el usuario tras publicar. Permanecen como propuestas el intercambio/plegado de Última tanda, compactación de la pantalla principal, su zoom y modos horizontal/vertical/adaptativo.

Acceso a ajustes del dispositivo para proteger los datos: propuesto para después; no se implementa ni se promete un enlace universal. Evaluar compatibilidad del navegador/dispositivo y solicitud de almacenamiento persistente. Esta última puede reducir la expulsión automática por el navegador, pero no debe presentarse como protección frente a borrado explícito o limpiadores externos. Fuente: [MDN · StorageManager.persist](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist). La exportación manual sigue disponible como copia independiente.
