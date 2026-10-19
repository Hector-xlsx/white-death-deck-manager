# Revelación de enemigos: acciones independientes · 19/10/2026

Implementación local verificada, sin commit, push ni publicación. Conserva los cambios locales anteriores de actualización, Death Notes y configuración. No cambia reglas de movimiento, Corrupción, combate o trofeos.

## Decisiones confirmadas

- «Revelación Carta Nigromante», seguido de la explicación de qué ocurre al revelar una carta de Nigromante del mazo general en Personalizado y un desplegable «Se aplican estas condiciones:», inicialmente cerrado.
- Acciones independientes de activación del Profanador, activación de otros nigromantes y Spawn adicional. Cada acción admite Siempre / Por probabilidad / Nunca. Otros nigromantes excluyen al Profanador y permiten elegir el alcance del sorteo.
- Spawn probabilístico con base, aumento por fallo y máximo configurable, que puede ser menor que 100. Una aparición reinicia a la base; un fallo aumenta hasta el máximo; límite de presencia o falta de candidatos bloquean solo el Spawn, sin aumentar ni forzar una activación.
- El Profanador tiene prioridad cuando está fuera de juego y conserva su papel exclusivo de creador de zonas. Estándar y Varios mantienen su funcionamiento fijado.
- Aplicar un esquema equivalente a abominaciones: activación de las presentes y Spawn adicional, sin Profanador. Estándar y Festival mantienen su funcionamiento fijado; en Personalizado se conserva la primera aparición cuando no hay ninguna presente.

## Alcance de activación confirmado: Calcular por

- «Independiente»: un sorteo por cada enemigo presente del grupo. Con 50%, algunos pueden activarse y otros no.
- «Todos juntos»: un único sorteo para activar a todo el grupo o a ninguno. No realiza sorteos cuando no hay enemigos elegibles.
- La opción aparece con Por probabilidad, tanto en otros nigromantes como en abominaciones. No se ofrece para el Profanador ni para Spawn. El Profanador conserva su sorteo separado, incluso cuando los otros nigromantes se evalúan juntos.
- `calcularPor` admite `independiente` / `juntos` en `otros` o `activacion`. Si falta en un perfil anterior, equivale a Independiente. Siempre/Nunca conservan su efecto determinista. La selección se conserva al ocultar los porcentajes y entre recargas.
- Se guarda en la configuración de próxima tanda y en cada captura histórica. La validación rechaza resultados mixtos cuando la configuración histórica indicaba Todos juntos.

La decisión del usuario cierra la duda sobre el sorteo de abominaciones y amplía la misma opción a otros nigromantes. Se mantiene la conservación del antiguo Al azar hasta activar y guardar el perfil nuevo; no se aplica una conversión automática.

## Datos y comportamiento técnico

`config.revelacionEnemigos` es opcional y contiene perfiles por `nigromantes` y/o `abominaciones`. Su ausencia conserva las combinaciones anteriores. Se clona al normalizar configuración y se captura en `configTanda` para conservar la interpretación histórica. Los controles nuevos se guardan explícitamente y se aplican desde la siguiente tanda.

La interfaz conserva «Combinación anterior» cuando el perfil no está habilitado. Activar las acciones independientes muestra los porcentajes que el usuario puede revisar antes de guardar. Las combinaciones deterministas se representan con Siempre/Nunca y 50% para el azar individual. Para el antiguo Al azar se presenta una propuesta editable (Profanador siempre, otros 50%, Spawn 50%; abominaciones 50% y 50%, incremento 0 y máximo 100), sin aplicarla automáticamente ni afirmar equivalencia estadística.

Cada extracción registra sus sorteos de activación, referencias de enemigos y resultado de Spawn. «Sin efecto» es un resultado explícito cuando no hubo activaciones ni aparición. Los límites no utilizan el antiguo mecanismo que sustituye Spawn por activación. La validación comprueba familias, IDs, porcentajes, resolución y coherencia de las activaciones guardadas.

El porcentaje de Spawn se reconstruye desde eventos válidos de su propio mazo. Cancelar un origen retira su aporte sin volver a sortear los demás resultados. Reemplazar crea una extracción nueva; regenerar un enemigo conserva el resultado de su origen. Recargar/reabrir no modifica la probabilidad ni usa RNG. Los cambios del porcentaje base se usan tras una aparición; el porcentaje existente se conserva al cambiar parámetros, limitado por el máximo actual. La anulación de tanda restaura configuración, progreso y referencias mediante el respaldo existente.

## Verificación

- 364/364 pruebas totales, incluidas 23 de acciones independientes: prioridad, Nunca, cálculos independiente/conjunto, Profanador separado, Siempre, extremos 0/100, aumento/máximo/reinicio, bloqueos, continuidad al cambiar parámetros, cancelación/reemplazo/anulación, regeneración, recuperación/cuota, compatibilidad y validación.
- Abominaciones: primera aparición, bloqueo sin activar, progreso propio de Spawn, activación Siempre, sorteos por enemigo y un único sorteo conjunto. Nigromantes conjuntos: Profanador activado con grupo inactivo y viceversa.
- `scripts/verificar-revelacion-independiente.mjs`: título/introducción/condiciones, perfiles y porcentaje máximo, ambos selectores Calcular por, ayuda dinámica, guardado explícito y próxima tanda, Sin efecto, cuota, cinco tamaños, recuperación y offline.
- QA anterior de Configuración conserva pestañas, borradores, topes y Daily. Sin dispositivos físicos ni publicación.
