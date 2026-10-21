# Daily Spawn: máximo por tanda · 21/10/2026

Solicitud autorizada: límite con el mismo formato que Spawn adicional por probabilidad, publicación en GitHub y apagado del equipo una vez terminada la publicación.

## Uso y comportamiento

Configuración → Mazos → Daily Spawn incorpora Límite de apariciones por tanda: mismo máximo para todos los niveles o un máximo por nivel. Vacío significa sin límite; los demás valores deben ser enteros positivos. Inicialmente no hay máximo, conservando las partidas existentes.

La configuración se guarda para la próxima tanda. Se congela el perfil junto al nivel de adrenalina de esa tanda. Alcanzar el cupo suspende los intentos Daily y sus incrementos sin consumir azar; el detalle de Aparición informa el máximo alcanzado. Una nueva tanda renueva el cupo. Se cuentan apariciones vigentes de esa tanda, no miniaturas ni enemigos actualmente fijados: retirar un enemigo del tablero no libera cupo; cancelar su extracción sí lo libera. No se reintentan automáticamente las cartas que ya se resolvieron. Regenerar sustituye un resultado sin duplicar su aporte.

Daily integrado también respeta su máximo propio. El mazo especial conserva su límite global y excluye candidatos Daily al agotarse su cuota; otros candidatos siguen disponibles. Si solo quedaban candidatos Daily, el resultado es Sin cartas disponibles y no aumenta la probabilidad especial. Los controles de límite Daily permanecen visibles cuando la probabilidad independiente está oculta por integración.

## Persistencia y compatibilidad

- Campos opcionales `dailyLimite` y `dailyLimitesPorNivel`. La ausencia conserva Sin límite; perfiles completos Azul/Amarillo/Naranja/Rojo, con `null` para cada nivel sin máximo. El perfil por nivel tiene prioridad sobre el general.
- `configLimitesDaily` en la tanda conserva los límites usados, también en formatos sin `configTanda`. Los snapshots se validan sin reconstruir los de tandas anteriores.
- Nuevo resultado de intento Daily `limite`, omitido al reconstruir probabilidad e incremento acumulado. Se conserva su diagnóstico histórico.
- Anular restaura configuración, mazos, contadores y respaldo. El registro exportable conserva las acciones; guardado con control de cuota y conflicto previo.
- Sin cambio de revisión ni reinicio/migración destructiva de partidas; no se cambia el comportamiento de Daily independiente/integrado sin un máximo explícito.

## Validación

398/398 pruebas de aplicación y 13/13 originales aprobadas. Ocho pruebas nuevas cubren máximo general, perfil/nivel congelado, ausencia de límite, pausa de azar/incremento, nueva tanda, descarte/regeneración, cambio de configuración, anulación, Daily integrado, cuota, recuperación y rechazo de máximos inválidos.

Chrome aislado: selector, validación inmediata de cero, máximos vacíos, cinco tamaños, guardado para próxima tanda, aviso de cupo, cambio entre perfil/general, integrado y recarga offline. Regresiones de Configuración y Especial aprobadas. Captura revisada: `docs/verificacion/daily-limites-tablet.png`. No se modifica la partida del usuario ni su servidor de 8080; no hay verificación física en tablet.

Versión preparada `20323e0d95b5b4e2`. Publicación autorizada mediante el workflow existente de `main`. El apagado se solicita al finalizar sin forzar cierres; la aceptación del comando no demuestra la observación física del equipo apagado.
