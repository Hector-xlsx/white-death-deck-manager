# Aparición: distribuciones, acciones y detalles

21/10/2026. Ajuste solicitado durante revisión física de la tablet; subida a GitHub/Pages autorizada en esta iteración de feedback.

## Cambios

- Acciones de carta siempre cuadradas, sin estirarse para completar la fila. Mantienen 44×44 px efectivos entre 75 % y 125 % de escala; si hay más acciones de las que caben, pasan a otra línea. Se conserva la reserva uniforme para marcos, con y sin marco.
- Anular tanda pasa a la cabecera, junto al zoom. Conserva disponibilidad, confirmación, cancelación y restauración existentes.
- Selector directo de distribución: Adaptativa conserva el reparto en columnas/filas; Horizontal mantiene una fila y permite desplazamiento lateral interno; Vertical mantiene una columna. Se conservan el orden y los vínculos entre carta y enemigo. Cabecera y controles permanecen fuera del área de desplazamiento. Si la altura no alcanza, el contenido sigue siendo desplazable verticalmente para no ocultar acciones.
- La distribución se guarda como preferencia del dispositivo en `white-death-vista-aparicion-v1`, fuera de la partida y del formulario de reglas. Si el almacenamiento falla, se conserva durante la sesión y aparece un aviso. Escala conserva el comportamiento anterior: 100 % al recargar, pasos de 5 %, límites 75–125 %.
- Botón ⓘ en la cabecera, activable/desactivable y oculto inicialmente al cargar. Muestra los detalles bajo las cartas sin repetir sus nombres. Nombres accesibles y textos de imágenes/acciones se conservan; Historial y Última tanda no cambian.

## Probabilidades

Se muestran exclusivamente los registros guardados al resolver, sin consultar ni recalcular las probabilidades actuales: `dailyIntento.probabilidad` y `especialIntento.probabilidad`, en líneas Daily Spawn y Spawn especial, con resultado. Por ejemplo, la tanda 8 facilitada conserva Daily Spawn 6 % y Spawn especial 24 % en Corredores. El aumento acumulado ya está reflejado en ese porcentaje; no se suma otra vez.

Para Spawn especial por tanda se muestra `tanda.especialIntento` una sola vez encima de las cartas, identificado «por tanda», sin atribuirlo a una extracción cuando el guardado no identifica origen. No se inventa un porcentaje donde no existe intento registrado. Se distinguen aparición, fallo, bloqueo sin cartas, máximo alcanzado y falta de elegibles. Máximo y falta de elegibles se etiquetan como sin intento, no como fallos aleatorios.

Los resultados de resolución (incluido cero activaciones y límites) y los detalles de forma se agrupan en el mismo bloque plegable de información. Las elecciones pendientes y el estado descartado/anulado siguen visibles y operativos. La información de cartas todavía sin revelar permanece oculta durante la animación. No cambia ningún sorteo ni dato persistido de partida.

## Verificación

376/376 pruebas actuales, incluidas tres sobre ambos porcentajes, ausencia de registro, eventos por tanda y resultados bloqueados. QA `scripts/verificar-vistas-aparicion.mjs`: cinco tamaños (1440×900, 960×600 con DPR 2, 844×390, 390×844 y 320×568), tres distribuciones, orden inalterado, desplazamiento lateral interno, botones cuadrados en 75/95/100/110/125 %, persistencia de distribución, información histórica y recarga offline. Copia aislada del JSON del usuario mediante `MAZO_PARTIDA`; no se modifica ni incluye en Git el original.

Anulación validada con semilla sintética del formato vigente: cancelar conserva el estado y confirmar coincide con la restauración del motor. El script histórico `verificar-anular-tanda.mjs` no pudo utilizar su semilla antigua porque la actualización de partidas de prueba la reinicia; queda pendiente modernizar esa batería histórica. Esta limitación no se ocultó: la comprobación de la cabecera se realizó en el nuevo verificador con formato actual.

Regresiones de marcos: abertura, adornos, alineación, zoom y offline aprobados en cinco tamaños. `verificar-debug-daily.mjs` actualizado al botón ⓘ y la nomenclatura nueva: 20/40/60 %, acierto 100 %, cero y deshabilitado, recuperación sin resorteo y 320/844 px. Capturas `docs/verificacion/aparicion-detalles.png` y `aparicion-horizontal.png` revisadas. Falta la revisión física posterior del usuario.

Archivos: `dist/app.js`, `index.html`, `style.css`, `escala-aparicion.js`, nuevo `detalles-aparicion.js`, precarga/paquete PWA, pruebas y documentación. No cambia el motor, los catálogos ni el formato de partida.

## Siguiente paso

Publicar y revisar en la tablet mediante General → Buscar y aplicar actualización. Comprobar comodidad del selector, botones y desplazamiento lateral. Los cambios de pantalla principal, plegado/intercambio de secciones y protección de almacenamiento continúan fuera de este ajuste.
