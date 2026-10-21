# Botones de mesa y ritmo de SPAWN · 21/10/2026 · Solo local

Cambios solicitados sobre el lote local que incluye protección del almacenamiento. Sin autorización de publicación en esta entrega.

- Ver, Ampliar y Mostrar/Ocultar derrotados comparten marco visible, fondo, bordes, radio, peso de letra y estados hover. Conservan el texto celeste de Ampliar. La altura táctil mínima sigue siendo 44 px incluso al reducir la escala de la pantalla principal.
- Mostrar/Ocultar desfijados pasa a Mostrar/Ocultar derrotados. El encabezado de su franja dice Derrotados. IDs, estructura `unpinned`, acciones de refijado y lógica de puntuación no cambian: la etiqueta no convierte un desfijado en una derrota de motor ni crea registros de combate.
- Una nueva pulsación de SPAWN muestra la ventana y espera 400 ms antes del primer volteo. La espera se ancla después de abrir el diálogo, para que el coste de dibujarlo no la consuma. Las cartas se mantienen boca abajo y no interactivas durante ese intervalo. El orden y duración de los volteos posteriores permanecen iguales.
- La pausa no se añade a regeneraciones, elecciones ni reapertura de una tanda. Movimiento reducido mantiene el comportamiento inmediato existente. Los sorteos y el guardado se resuelven de la misma forma; la espera es exclusivamente de presentación.

405/405 pruebas de aplicación aprobadas, incluida una nueva prueba de límites temporales de la pausa y movimiento reducido. QA `scripts/verificar-ritmo-y-botones.mjs`: estilos computados idénticos, cuatro tamaños y tres escalas, ausencia de desbordes, altura táctil, cambio Mostrar/Ocultar derrotados, pausa medida de 401 ms desde la apertura, guardado intacto durante la espera/volteo y reapertura/movimiento reducido inmediatos. Captura revisada: `docs/verificacion/botones-mesa-unificados.png`. No hay revisión física en la tablet del usuario.

Versión local preparada del lote: `c989ca7874faba2d`. Se conservan los cambios de protección documentados en [PROTECCION_ALMACENAMIENTO.md](PROTECCION_ALMACENAMIENTO.md). Sin subir a GitHub.
