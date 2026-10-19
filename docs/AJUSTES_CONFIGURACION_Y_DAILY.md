# Ajustes de configuración y Daily · 19/10/2026

Implementación local autorizada. Se acumula con actualización visible y Death Notes; sin commit, push ni publicación.

## Interfaz

Se usan «mazo general», «mazo especial» y «Cartas Spawn especial» en controles y resúmenes. Los identificadores internos de disparadores permanecen para compatibilidad. La descripción explica que esas cartas funcionan como las de Abominación/Nigromante: al salir una en el mazo general, se extrae del mazo especial y se muestra el resultado en su zona.

Cartas y cantidades agrupa cada tipo de zombi en desplegables con sus variantes, copias, destinos y botones de consulta de imagen; Daily integrado mantiene un grupo por identidad. Plegar conserva los valores; los grupos abiertos se conservan al reconstruir destinos. El límite general oculta y deshabilita exclusivamente la columna de máximos por adrenalina; las probabilidades por adrenalina siguen visibles. El reinicio anticipado identifica expresamente al mazo general.

Los modos de nigromantes y abominaciones muestran su explicación bajo el selector, igual que la reposición. El selector de acción pasa a «Funcionamiento Spawn nigromante/abominación» y muestra el efecto seleccionado. Los modos fijados explican que el funcionamiento depende del modo; Personalizado conserva sus acciones, cupos y guardado inmediato.

Daily muestra la explicación de porcentajes bajo la tabla, una descripción dinámica bajo «Incrementar por» y otra bajo Reposición. Se aclara la unicidad mientras el zombi esté presente, su devolución al derrotar/desfijar con reposición y su descarte hasta reiniciar al agotarse sin reposición. En modo integrado usa la reposición del mazo especial y su explicación de ese flujo.

## Elegibilidad Daily

`dailyElegibles` es una selección opcional de IDs de cartas del mazo general. Si falta, mantiene los orígenes anteriores: grupos de zombis y Asedio, excluyendo activaciones adicionales, nigromantes y abominaciones. La configuración muestra las cartas presentes en el mazo general; permite desmarcarlas o habilitar tipos antes excluidos. Conserva elecciones de cartas temporalmente retiradas del mazo general. Una selección vacía no genera intentos; el incremento por tanda mantiene su fallo al cerrar sin Daily.

Se guarda para próxima tanda. Los intentos se validan contra su propia configuración histórica. Las cartas Daily y del mazo especial siguen sin provocar intentos adicionales entre sí. En modo integrado no se usan probabilidades ni elegibilidad independiente de Daily.

## Porcentaje continuo

Cambiar de adrenalina conserva el porcentaje actual, también al bajar, antes del primer intento y al llegar al 100%. Un fallo agrega el incremento del nivel capturado por la tanda; aparecer un Daily reinicia al porcentaje base de ese nivel. Una elección tardía usa el nivel de su tanda. Cambiar la base de configuración la aplica al próximo reinicio, sin sumarla inmediatamente a lo acumulado.

Ejemplo: Azul 5% + dos fallos de 1 punto = 7%. Subir a Amarillo conserva 7%; el siguiente fallo de 2 puntos deja 9%. Una aparición en Amarillo reinicia a su base de 8%.

El cálculo se reconstruye desde resultados guardados y configuraciones de tanda para soportar descarte, reemplazo, anulación y recarga, sin ejecutar RNG ni modificar resultados históricos. En guardados anteriores, el porcentaje futuro se reconstruye con la regla corregida; las probabilidades e identidades ya registradas no se reescriben. Daily independiente conserva intentos por carta elegible; «Incrementar por tanda» controla la frecuencia del incremento. No se modifica la probabilidad del mazo especial.

## Validación

- 341 pruebas aprobadas. Expectativas de la regla anterior actualizadas; nuevas pruebas de reinicio con la base del nivel del éxito, elegibilidad configurable y validación de IDs.
- QA de Configuración y Spawn Especial adaptada a grupos desplegables: cinco tamaños, borradores, cantidades, destinos, cuota, guardado y offline.
- `scripts/verificar-ajustes-configuracion.mjs`: textos, ayudas dinámicas, consulta de carta, plegado conservando copias, máximo general/nivel, selección Daily, cambio de nivel conservando 40%, guardado, cinco tamaños y offline.
- Capturas `ajustes-configuracion-tablet.png` y `ajustes-configuracion-vertical.png`. Sin dispositivos físicos ni publicación.
