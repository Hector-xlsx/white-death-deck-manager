# Propuesta: rondas, cierre e historial de partidas · 16/10/2026

Estado vigente 16/10/2026: fórmula temporal de TABLA PUNTAJES, registro explícito de derrotas y relojes por forma implementados; ver PUNTAJE.md. Los apartados inferiores que describen la fórmula como indefinida son antecedentes históricos. Cierre e historial siguen pendientes.

Actualización 16/10/2026: ya se implementó el registro explícito de derrotas para puntuar Abominaciones, Nigromantes y Bake-Danuki al ser eliminados, con valores fijos (ver PUNTAJE.md). El cálculo por antigüedad, cierre e historial descritos aquí siguen siendo futuros.

Estado: idea futura solicitada por el usuario para dejarla anotada. Este documento no implementa el registro, el botón de cierre ni una fórmula nueva. El puntaje actual por zombis generados sigue según PUNTAJE.md.

## Registro de la partida

- Conservar cantidades generadas por tipo exacto de zombi, además de su categoría para puntaje. Los acompañantes de Rakshasa y Shakōki participan como apariciones de su tipo; las referencias visuales no duplican cantidades. Los ajustes manuales actuales representan Caminantes.
- Para cada presencia de Abominación o Nigromante: identidad, aparición, ronda de entrada, ronda de salida y resultado de esa salida. Conservar también nivel de adrenalina y contexto de aparición para futuras fórmulas, sin aplicar por ahora una variación por nivel.
- El usuario define que al volver a pasar por SPAWN se considera que ya transcurrió un turno del enemigo que estaba en juego. Cada paso posterior de aparición incrementa en uno los turnos completados por esas presencias.
- Registrar con precisión desde que se implemente. Los datos antiguos que no permitan determinar ronda o motivo de salida deben identificarse como desconocidos; no inferir una derrota de cualquier desfijado ni fabricar fechas o rondas históricas.

## Convención de rondas: detalle por afinar

Es necesario distinguir turnos completos del enemigo e intervalo en el que fue eliminado. Propuesta para evitar un desfase: si aparece en SPAWN 3, empieza con 0 turnos completados. Eliminado antes de SPAWN 4 figura en «primer turno». Al llegar a SPAWN 4 ya completó 1 y entra en el segundo intervalo. Confirmar esta correspondencia al implementar; no convertirla todavía en regla del código.

Propuesta técnica: contar una ronda por SPAWN principal aceptado. Añadir una carta/zona, regenerar, consultar o reabrir no adelantan rondas. Anular la tanda debe restaurar el registro y la antigüedad anteriores; un fallo de guardado no puede contar una ronda. Si se realizan varias tandas dentro de una fase física, definir cómo diferenciarlas antes de automatizar el avance.

## Finalizar partida

Botón propuesto en la parte inferior de la página principal, con confirmación y posibilidad de cancelar. Al finalizar, presentar:

1. Puntaje obtenido.
2. Puntaje perfecto o máximo posible (100%), calculado con la misma fórmula y las mismas apariciones de esa partida.
3. Porcentaje obtenido respecto de ese máximo. El ejemplo 80/100 = 80% ilustra el formato; no fija una penalización.
4. Abominaciones eliminadas en el primer, segundo, tercer, cuarto y quinto turno o posteriores, con cantidad en cada grupo.
5. El mismo desglose de Nigromantes.
6. Cantidades generadas de Caminantes y demás tipos, con sus aportes al puntaje.
7. Total de rondas y cajas/expansiones utilizadas, mostradas por nombre.

Confirmado: los enemigos presentes al finalizar puntúan como si hubieran sido eliminados en la ronda de cierre, según su antigüedad en ese momento. Conservar el motivo de cierre, sin inventar una derrota física. El resultado de la misión es independiente y prioritario frente al puntaje. Quedan por definir una partida sin apariciones/máximo cero, cómo registrar victoria/derrota y si se puede reabrir un cierre para corregir errores.

## Historial de partidas

Acceso propuesto desde Configuración. Mantener un resumen persistente por partida finalizada: puntaje real, máximo, porcentaje, total de rondas, desglose de tipos/derrotas y nombres de cajas empleadas. Una nueva partida no debería borrar esos cierres. El cierre debe ser idempotente: confirmar dos veces o recargar no genera dos registros. Preservar estado previo si falla almacenamiento.

Como actualmente se pueden cambiar cajas y contenido durante la partida, propuesta a revisar: guardar las cajas utilizadas a lo largo de la partida, no solamente las seleccionadas al cerrar. Al implementar precisar si «utilizada» significa habilitada en algún momento o con al menos una carta aparecida.

## Fórmula futura y datos necesarios

El usuario propone premiar más la eliminación temprana de Abominaciones y Nigromantes, con menor puntaje tras más turnos en juego. Faltan los valores o factores para turnos 1, 2, 3, 4 y 5+, y definir si los 25/12 puntos actuales son el máximo base u otra parte de la fórmula. La posible variación por adrenalina queda como idea, sin fórmula ni valores aprobados.

Conviene conservar la versión de fórmula aplicada al cierre, sus pesos y el resumen resultante para que un ajuste futuro no cambie puntajes históricos. Esto es una propuesta de trazabilidad, no un formato de datos aprobado.

## Distinciones necesarias

- Derrota real, retirada por corrección, descarte/regeneración y transformación son motivos distintos. Eliminar o corregir una extracción no debe fabricar una derrota puntuable.
- Mumm-Ra: contadores independientes por forma. Nigromante conserva su referencia de aparición original y solo acumula tiempo en esa forma; el período como Abominación no suma turnos de Nigromante. La Abominación tiene su propio contador. Transformarse no cuenta como eliminación. Al concretar el registro, precisar el reinicio o acumulación de tramos tras cada derrota/reaparición.
- Confirmado: una derrota seguida de reaparición cuenta como eliminación, aunque la carta siga representada en En juego. Cerrar o cancelar el aviso no registra una eliminación. Las salidas por otros conductos tampoco cuentan como eliminaciones.
- Enemigos todavía en juego al cierre necesitan un estado propio, separado de los grupos de eliminados.

## Orden sugerido para una futura implementación

Primero acordar la convención de rondas y registrar eventos/motivos. Después definir pesos y máximo perfecto. Finalmente construir cierre, desglose e historial de partidas. De este modo se evita presentar un porcentaje de rendimiento basado en reglas aún no definidas.
