# Revelación de enemigos: acciones independientes · 19/10/2026

Corrección solicitada tras publicar e223734: una única configuración en Personalizado, sin interruptor de habilitación ni Combinación anterior. No cambia reglas de movimiento, Corrupción, combate o trofeos.

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

La decisión del usuario cierra la duda sobre el sorteo de abominaciones y amplía la misma opción a otros nigromantes. Se retira la alternativa de funcionamiento anterior. Independiente / Todos juntos se refiere exclusivamente al cálculo de activaciones adicionales del grupo.

## Datos y comportamiento técnico

La app crea y guarda los perfiles de ambos mazos en `config.revelacionEnemigos`. Los campos siguen siendo opcionales al validar guardados históricos. Al pulsar SPAWN se completa cualquier perfil futuro ausente dentro de la misma transacción de guardado; nunca se modifican capturas históricas ni resultados ya resueltos. Los ajustes se guardan explícitamente y se aplican desde la siguiente tanda.

La interfaz muestra directamente Siempre / Por probabilidad / Nunca para cada acción. No hay casilla «Configurar acciones independientes» ni selector de combinaciones antiguas. Los perfiles guardados conservan sus porcentajes y Calcular por. Cuando falta un perfil, se inicializa desde la combinación guardada: deterministas a Siempre/Nunca; azar individual al 50%. El antiguo Al azar pasa al perfil inicial de Profanador Siempre, otros 50% y Spawn 50%, o activación/Spawn al 50% para abominaciones; incremento 0 y máximo 100. Es un cambio de comportamiento futuro, no una equivalencia estadística ni una repetición del historial. Los modos oficiales conservan sus reglas y ocultan los controles de Personalizado.

Cada extracción registra sus sorteos de activación, referencias de enemigos y resultado de Spawn. «Sin efecto» es un resultado explícito cuando no hubo activaciones ni aparición. Los límites no utilizan el antiguo mecanismo que sustituye Spawn por activación. La validación comprueba familias, IDs, porcentajes, resolución y coherencia de las activaciones guardadas.

El porcentaje de Spawn se reconstruye desde eventos válidos de su propio mazo. Cancelar un origen retira su aporte sin volver a sortear los demás resultados. Reemplazar crea una extracción nueva; regenerar un enemigo conserva el resultado de su origen. Recargar/reabrir no modifica la probabilidad ni usa RNG. Los cambios del porcentaje base se usan tras una aparición; el porcentaje existente se conserva al cambiar parámetros, limitado por el máximo actual. La anulación de tanda restaura configuración, progreso y referencias mediante el respaldo existente.

## Verificación

- 366/366 pruebas totales, incluidas 25 de acciones independientes: prioridad, Nunca, cálculos independiente/conjunto, Profanador separado, Siempre, extremos 0/100, aumento/máximo/reinicio, bloqueos, continuidad al cambiar parámetros, cancelación/reemplazo/anulación, regeneración, recuperación/cuota, compatibilidad y validación.
- Abominaciones: primera aparición, bloqueo sin activar, progreso propio de Spawn, activación Siempre, sorteos por enemigo y un único sorteo conjunto. Nigromantes conjuntos: Profanador activado con grupo inactivo y viceversa.
- `scripts/verificar-revelacion-independiente.mjs`: título/introducción/condiciones, perfiles y porcentaje máximo, ambos selectores Calcular por, ayuda dinámica, guardado explícito y próxima tanda, Sin efecto, cuota, cinco tamaños, recuperación y offline.
- QA anterior de Configuración conserva pestañas, borradores, topes y Daily. Sin verificación en dispositivos físicos.

## Validación de la corrección

366/366 pruebas y 13/13 de base-web. Navegador: revelación única (incluido SPAWN sin abrir configuración desde un guardado sin perfiles), configuración, ajustes Daily/Especial, modos, configuración durante partida y vista de mesa. Verificados cinco tamaños, guardado explícito y fallo de cuota, perfiles persistidos, historial intacto, reposición, cambio a modos oficiales, anulación y recarga offline. Los scripts de modos y configuración durante partida se adaptaron a pestañas y desplegables que sus versiones históricas aún no recorrían. Sin dispositivos físicos.
