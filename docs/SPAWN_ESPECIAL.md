# Spawn Especial · 18/10/2026

## Alcance y decisiones confirmadas

Diseño solicitado y aclarado por el usuario en este chat. Es una configuración personalizada del gestor, no una regla oficial del juego. Mantiene la integración directa existente y añade dos modalidades. Solo usa cartas confirmadas y habilitadas del catálogo; no incorpora cartas o reglas nuevas de campañas citadas como ejemplos. Bestias divinas Aparición continúa pendiente.

Se configura en **Configuración → Mazo de Aparición · Spawn Especial**. La selección de colección y cartas sigue en Contenido. Guardar programa los cambios para la siguiente pulsación de SPAWN; la tanda abierta conserva configuración, resultados y nivel. No hay reinicio de partida ni reinterpretación de tandas anteriores. Iniciar nueva partida conserva el flujo de confirmación existente.

## Modalidades

1. **Actual:** expansiones dentro del general, con su composición anterior. Es el valor predeterminado para partidas sin esta configuración.
2. **Disparadores:** retira los grupos de expansión seleccionados del general y añade seis disparadores virtuales, editables desde uno. Cada disparador consume una copia del general y revela una carta del Especial en su zona. Se muestra la carta final; el disparador se conserva en el historial interno. Si todos los candidatos son Daily presentes, se informa que no hay candidatos, sin inventar una aparición.
3. **Probabilidad:** los grupos van inicialmente al Especial. Cada carta puede trasladarse al general; queda en un único destino y conserva su cantidad configurada. El listado de orígenes elegibles incluye esas cartas del general, seleccionadas inicialmente. No se duplican copias entre los dos mazos.

Los dos formatos requieren al menos una carta elegida para el Especial. Las cantidades de grupos son enteras positivas, inicialmente las del catálogo. El selector con/sin reposición es independiente del general. Sin reposición se reinicia al agotar candidatos; con reposición se conservan las cantidades. Los grupos pueden repetirse aunque haya otra extracción de ese tipo fijada.

## Intentos, probabilidad y límites

- **Por carta:** cada extracción general elegible genera un intento; el fallo suma el incremento de su nivel y el éxito reinicia el aumento a cero. Regenerar la general o añadir otra zona puede generar un nuevo intento, sujeto al límite de la tanda.
- **Por tanda:** exactamente un intento al finalizar la resolución, incluidas las elecciones pendientes y sus derivadas. Una aparición se asigna uniformemente a una de las zonas con carta final elegible y vigente. El resultado se presenta al final, conservando su marcador de zona. Una tanda sin cartas elegibles cuenta como fallo e incrementa sin sortear ubicación.
- Reabrir, recargar, regenerar una carta o añadir una zona después del intento por tanda no vuelve a ejecutarlo. Regenerar únicamente el resultado Especial cambia su selección sin repetir el intento probabilístico.
- Base e incremento entre 0 y 100, configurables por adrenalina. El incremento acumulado se conserva al cambiar de nivel; los aportes antiguos mantienen el incremento de su tanda. La probabilidad efectiva tiene techo 100%.
- Valores iniciales técnicos conservadores: 0% de base y 0 de incremento hasta que el usuario los configure. No se copiaron los porcentajes de Daily como decisión implícita de dificultad.
- Límite general o por adrenalina: vacío significa sin límite; los demás valores son enteros positivos. Al alcanzarlo se suspenden intentos e incrementos. Se cuentan las apariciones vigentes; descartar su origen cancela sus aportes. Anular toda la tanda restaura el respaldo anterior completo.
- Elegibilidad inicial: grupos del general y Asedio; activaciones, Nigromante y Abominación desmarcados. Todas estas cartas del general se pueden seleccionar o desmarcar individualmente. Los resultados Especial y Daily nunca generan intentos adicionales entre sí.
- Si no hay candidatos disponibles, el intento con zona elegible queda bloqueado y no aumenta la probabilidad. Se conserva la excepción explícita acordada: una tanda sin zonas elegibles cuenta como fallo.

## Daily independiente o integrado

Daily independiente mantiene su lógica anterior, probabilidades propias y una copia por identidad, sin controles de cantidad. Puede coincidir con un Especial sobre una carta general; ninguno dispara al otro.

Daily integrado no ejecuta una probabilidad propia: sus identidades participan como candidatos del Especial. Cada carta Daily tiene cantidad editable, inicialmente una. Todas sus copias representan una sola identidad: al aparecer se excluyen todas mientras esté en juego, incluido al reiniciar el Especial. Las cantidades son pesos de selección, nunca miniaturas simultáneas.

Se conservan fijación, reglas particulares, puntuación, Rakshasa, Bake-Danuki y restricciones de Meng Huo. Al devolver explícitamente una identidad al mazo vuelve con su cantidad configurada. La reposición integrada sigue el selector del Especial; sin reposición, sus descartes se reincorporan al agotarse el conjunto de candidatos, conservando fuera a los presentes. Los parámetros independientes permanecen guardados para volver a esa modalidad.

## Compensación del motor

Opción desactivada inicialmente. Referencia: Core seleccionado después de aplicar Fácil/Estándar. Solo aumenta Nigromante, Abominación y Asedio; no compensa al desmarcar dificultades.

Sea `B` el número de cartas del Core filtrado fuera de esas tres familias y `E` las cartas añadidas directamente al general. El factor es `(B + E) / B`. Se multiplica cada cantidad original del motor por ese factor y se redondea al entero más cercano; desde 0,5 hacia arriba. Se bloquea la compensación si no queda ninguna carta del Core fuera del motor.

En disparadores, `E` incluye sus copias virtuales. En probabilidad, incluye únicamente los grupos trasladados al general, con sus cantidades configuradas. Las cartas que permanecen en el Especial no diluyen el general.

Ejemplo con Core completo: seis disparadores producen 11 Nigromantes, 7 Abominaciones y 11 Asedios; general de 67 cartas. Motor conjunto: 42,86% original frente a 43,28% final. Son porcentajes iniciales aproximados por redondeo; el consumo sin reposición y el reinicio anticipado siguen modificando la distribución durante el ciclo. La vista previa muestra ambos porcentajes, sin prometer igualdad exacta.

## Implementación y persistencia

- `dist/especial-config.js`: opciones, validación y ajuste puro de composición.
- `dist/especial.js`: selección ponderada, disponibilidad, eventos, progresión, límites, cancelación y validación de estado.
- `dist/especial-ui.js`: configuración y vista previa; sin sorteos durante render.
- Integración en catálogo, motor, secundarios, Daily, estado, contadores, reglas de apoyo y presentación.
- `spawnEspecial` es opcional. Partidas sin el campo conservan sus bytes y comportamiento al recuperarlas. No se aumenta la revisión que ejecutaba el reinicio histórico de partidas de prueba.
- Configuración y nivel congelados por tanda; IDs estables para disparador, origen y resultados. Los eventos registran la probabilidad e incremento usados. Guardado atómico y control de conflicto de pestañas existentes.
- Los cuatro módulos se incluyen en preparación, versión y caché PWA, con rutas relativas compatibles con la subruta `/mazo/` y GitHub Pages.

## Verificación y límites

Validación final: **334/334 pruebas actuales**, incluidas **27 nuevas de Especial**, más **13/13 de base-web**. Versión preparada `a85be97a605dd7bb`.

Pruebas en `tests/especial.test.js`: modalidades, compatibilidad, cantidades, reposición, repetición, probabilidad, límites, ubicación, cartas derivadas, elecciones tardías, compensación, Daily único y devolución, agotamiento integrado, puntaje, descartes, regeneración, anulación, cuotas y validación de guardados.

Navegador: `scripts/verificar-especial.mjs`, contextos aislados, cinco tamaños, configuración y cantidades, destinos por set/carta y elegibilidad, borradores Daily, límite, imagen final del disparador, descarte, cuota, recuperación con dos pestañas abiertas y recarga offline. Capturas `docs/verificacion/especial-*.png`. No modifica la partida del usuario.

Sin pruebas en dispositivos físicos. La implementación se cerró localmente el 18/10/2026. El usuario autorizó su subida a main el 19/10/2026; la publicación automática depende del resultado del workflow Pages existente.
