# Decisiones pendientes y propuestas

**Antes de la versión final:** retirar el porcentaje de depuración Daily junto al nombre en Aparición (bandera DEBUG_DAILY_SPAWN de dist/app.js, añadido por solicitud del 14/10/2026).

Este documento conserva las propuestas iniciales como registro histórico y separa las decisiones ya cerradas de lo pendiente. Las propuestas antiguas de la tabla A no son instrucciones vigentes; los registros de cierre son el comportamiento aprobado.

## Listado vigente al 16/10/2026

Correcciones del usuario implementadas: Personalizado inicial, modos y contenido durante partida desde próxima tanda, topes configurados conservados, Estándar sin trofeos y con Kan de respaldo, protección de trofeos al desmarcar/remarcar y reset único de pruebas anteriores. Prevalece `CONFIGURACION_DURANTE_PARTIDA.md` sobre las decisiones iniciales de `ITERACION_MODOS_ENEMIGOS.md`. Validación final 257 pruebas y QA de modos/configuración en cinco tamaños con recuperación offline. Corrupción queda en espera; tokens completados.

Este listado separa el trabajo completado del pendiente. Prevalece sobre registros inferiores que describan un alcance anterior. Completados 1–4, 7, 10, 11, 14–17 y 19–21; el 18 se integra en los modos, el 23 en el 8, y 24/25 retirados. La iteración de modos autorizada el 14/10/2026 está implementada y verificada; decisiones y preguntas resueltas en `ITERACION_MODOS_ENEMIGOS.md`. Quedan pendientes 5, 6, 8 y 9; se añade el 28 como propuesta futura de registro, cierre e historial de partidas; el 27 está completado; el 12 está completado con las dos imágenes del usuario; el 13 reformulado como contador de generados está completado; 5 y 8 quedan en espera. El 22 se retira por solicitud del usuario del 15/10/2026. El punto 26 se completó el 14/10/2026 con los marcadores originales. Los alcances inferiores anteriores al cierre son históricos.

| N.º | Pendiente | Alcance y estado |
|---|---|---|
| 1 | Mazo Daily Spawn | Completado: mazo independiente, configuración, probabilidades, apariciones, persistencia, cancelaciones y presentación. Reglas por carta quedan en el punto 9. |
| 2 | Spawns de expansiones | Completado: cinco fichas con 24 copias confirmadas en el Excel. Bestias divinas Aparición sigue incompleta y deshabilitada. |
| 3 | Fácil / Estándar | Completado: clasificación del Excel y etiqueta visible Estándar, preservando Normal interno, IDs y compatibilidad. |
| 4 | Limitadores de nigromantes y abominaciones | Completado, revisado en el 21: solo Personalizado. Defaults adicionales 0/0/1/1 y espacio Profanador separado; abominaciones 1/2/3/4. Valores configurados no se convierten ni reinician al alternar modo o iniciar partida. Perfiles no decrecientes, ajustes desde próxima tanda y reset de pruebas con topes conservados. |
| 5 | Bestias divinas | En espera por solicitud del 15/10/2026: mecánica específica de cuatro bestias, transición temporal y mazo de acciones propio por bestia; requiere recursos completos y diseño. Ver propuesta futura debajo. |
| 6 | Ayudas vinculadas | Asociar los recursos de apoyo con las cartas correspondientes, incluido Death Notes. Separar consulta de automatización. |
| 7 | Selector de adrenalina | Completado: selector manual Azul / Amarillo / Naranja / Rojo en la pantalla principal, guardado, nivel por tanda y restauración al anular. Integración con límites automáticos en el punto 4 y estadísticas en el 13. |
| 8 | Contador de zonas de corrupción | En espera. Su propósito era apoyar el conteo de zombis, pero no cubre por sí solo reposiciones o cantidades variables como terracota. Reevaluar tras el contador directo del 13. Conserva las notas del antiguo 23; sin implementación ahora. |
| 9 | Reglas especiales por carta única | Avance 15/10/2026: Mumm-Ra (transformaciones y derrota), Chimimōryō/Meng Huo (reaparición), Shakōki Dogū (acompañantes por tipo) y Rakshasa (+3 Caminantes) implementados en el alcance de `REGLAS_CARTAS_UNICAS.md`, además de Bake-Danuki. Movimiento/combate en mesa. Bestias divinas en espera; selector Minimalista / Cartas custom de acompañantes completado (`APARICIONES_ADICIONALES.md`). Otras reglas se revisan individualmente. |
| 10 | Flechas de derivación | Completado y revisado visualmente: se retiró la segunda flecha hacia la zona del Profanador por solicitud posterior; se conservan relaciones internas. Prevalecen los tokens del punto 26. |
| 11 | Identificación visual por zona | Completado y revisado: tokens sobre cada carta sustituyen títulos y líneas agrupadoras. Filas alineadas y crecimiento de página sin scroll interno en Última tanda; ver punto 26. |
| 12 | Separador de muralla | Completado 15/10/2026: puerta nevada centrada y muralla con torre/escalera extendida a ambos lados, misma escala, responsive y offline. Recursos originales conservados; verificado en cinco tamaños. |
| 13 | Zombis generados y puntaje | Completado: cantidades automáticas y ajustes manuales independientes Caminantes/Brutos/Corredores, con historial tipado. Marcadores Kang/Dragón/Cabeza. Puntaje de TABLA PUNTAJES y registro de derrotas temporal; Bake-Danuki/Mumm-Ra y reeliminaciones. Ver PUNTAJE.md; cierre de partida en 28. |
| 14 | Revisar margen superior de cartas con marco | Completado: el CSS activo reservaba 62 px para todas las cartas. Reserva ajustada según marco y disposición, conservando imágenes completas de 155 px y sus decoraciones. |
| 15 | Daily Spawn por nivel de adrenalina | Completado: cuatro pares de base (%) e incremento (puntos) editables. Cambiar de nivel conserva los puntos acumulados y los suma a su nueva base, hasta el 100%. Configuración aplicada a una nueva partida; tandas y partidas anteriores preservadas. Sustituye el enfoque de primera rotación. |
| 16 | Prioridad y gestión del Profanador | Completado: obligatorio en los tres modos nuevos; aparece si falta, aunque haya adicionales, con espacio reservado y sin duplicados. |
| 17 | Zonas creadas exclusivamente por el Profanador | Completado: solo él aporta zona al contador; se retira con su presencia. Robo y resolución de su zona después de las iniciales, con presentación boca abajo hasta el final. Adicionales sin zona ni robo derivado. |
| 18 | Resolución de acciones de enemigos | Integrado en la definición de modos de nigromantes y abominaciones; deja de ser un pendiente independiente. Ver decisión de azar condicionado al cupo debajo. |
| 19 | Modo normal de Abominaciones | Completado: Estándar con identidad elegida de la selección de colección; sin presencia aparece, con presencia se activa. Se conserva la selección para otros modos. |
| 20 | Festival de Abominaciones | Completado: modo explícito sin topes personalizados. Sin presencia aparece una; con presencia se activan todas y después aparece otra disponible. Sin candidatos no duplica identidades. |
| 21 | Topes por adrenalina frente a reglas oficiales | Completado: solo Personalizado; espacio Profanador separado, azar filtra spawn si no hay cupo y acciones fijas conservan fallback. Estándar, Varios y Festival siguen su resolución propia. |
| 23 | Evento real de corrupción y contador | Integrado en el punto 8 por solicitud del usuario; no se revisa como pendiente independiente. |
| 26 | Tokens visuales de zonas de aparición | Completado 14/10/2026: token rojo con número blanco centrado encima de cada carta de zona estándar; token verde sin número para la zona del Profanador. Reemplaza encabezados Zona, líneas agrupadoras y segunda flecha. También en Última tanda e Historial; sin cambios en IDs, resolución ni guardado. |
| 27 | Banderines Daily Spawn en Aparición y Última tanda | Completado 15/10/2026: las siete cartas muestran su banderín por familia en la esquina, con los recursos existentes. Bake-Danuki conserva su referencia por dado sin insignias duplicadas. Verificado en cinco tamaños, zoom y offline; sin cambios en reglas ni guardado. |
| 28 | Registro de rondas, cierre e historial de partidas | Parcialmente implementado: registro de derrotas y fórmula temporal de TABLA PUNTAJES, relojes por forma de Mumm-Ra, Bake-Danuki y reeliminaciones. Pendiente: Finalizar partida, desglose de cierre, máximo perfecto/porcentaje e historial desde Configuración con cajas/rondas. Adrenalina sin fórmula. Ver PUNTAJE.md y PROPUESTA_CIERRE_E_HISTORIAL.md. |

### Decisiones del 15/10/2026: prioridades y contador

- Punto 22 retirado, igual que la revisión de nigromantes incompatibles: el usuario indica que no se generan cartas incompatibles. No filtrar ni deshabilitar cartas por este motivo. No reutilizar el número.
- Punto 8 en espera. El conteo directo y una ventana rápida de ajustes podrían cubrir apariciones variables y reposiciones como terracota sin depender de un contador intermedio de corrupción; no automatizar esa regla por analogía.
- Punto 5 en espera. El usuario describe sustitución por la siguiente bestia si transcurre cierto número de turnos sin derrotarla, con mazo propio de acciones para cada bestia. Hace falta digitalizar los recursos y revisar la integración; no asumir tiempos ni efectos no suministrados.
- Propuesta futura del usuario para Bestias divinas: en Estándar revisar el uso exclusivo de estas abominaciones; en Festival/Personalizado, tras aparecer la primera, priorizar la siguiente bestia cuando deba aparecer una abominación y no haya ninguna bestia divina presente. Si hay una bestia presente, permitir otra abominación del mazo. Propuesta a definir/validar cuando se retome, sin implementación autorizada ahora.
- Punto 12 completado el 15/10/2026 tras recibir puerta y muralla definitivas del usuario.
- Punto 13 confirmado e implementado: automático para cantidades conocidas, manual para extras y correcciones. Total oculto al abrir; control de privacidad solo de presentación. Detalle y pruebas en IMPLEMENTACION_ACTUAL.md.

### Decisiones y nuevo pendiente del 14/10/2026

- Nigromantes Personalizado, opción general Al azar: antes del sorteo comprobar el cupo de adicionales. Si está completo, excluir las tres acciones que contienen spawn y sortear entre Activación del Profanador y Activación del Profanador + azar, con igual probabilidad entre las opciones elegibles (50% cada una). No sortear una acción imposible y convertirla después. Con cupo disponible se conserva el sorteo uniforme entre las cinco acciones (20% cada una).
- Si resulta Activación del Profanador + azar, se mantiene un segundo sorteo independiente del 50% por cada nigromante adicional presente. Guardar ambos resultados sin repetirlos al recargar. Este ajuste se refiere a la opción general Al azar; no modifica por sí mismo la resolución acordada de acciones fijas al alcanzar el tope ni la prioridad del Profanador ausente.
- El punto 26 fue autorizado y completado con los recursos originales el 14/10/2026. La zona del Profanador no debe confundirse con una zona creada por cualquier otro nigromante.
- Los puntos 24 y 25 quedan retirados, sin reutilizar sus números. El 18 se integra en los modos y el 23 en el 8. Las definiciones nuevas todavía no están programadas.

### Revisión de reglas: prioridad recomendada, 13/10/2026

La revisión implementada completó **16, 17, 19, 20 y 21**. Orden recomendado de lo restante de esta revisión: **9**, con **8** en espera; ninguno se implementa por este cierre. El 18 está integrado en los modos y el 23 en el 8; 24 y 25 retirados. Se conserva la numeración para mantener las referencias existentes. También se retira del 22 la revisión de nigromantes incompatibles: el usuario aclara que no se hicieron cartas para ellos.

Fuente de la revisión inicial: extracto del reglamento aportado por el usuario en el chat, secciones «Jugar con varias Abominaciones», «Festival de Abominaciones» y «Jugar con varios Nigromantes». Posteriormente se consultó la regla específica del Profanador y se cerraron los modos con el usuario. El estado de cada punto en la tabla superior y `ITERACION_MODOS_ENEMIGOS.md` prevalecen sobre este contraste inicial.

Contraste anterior a la implementación de modos: todos los nigromantes se sorteaban sin prioridad y generaban zonas/robos derivados; el contador verde contaba todos los presentes. Ambos tipos admitían tres acciones y elección aleatoria, con activación forzada por tope. No había modos explícitos ni destinatarios individualizados. Esos comportamientos se conservan únicamente en partidas legadas; los modos nuevos corrigen prioridad, zonas y activaciones. Filtro de incompatibilidad y contador de corrupción siguen pendientes; movimiento/Almenara permanece fuera de alcance.

Las decisiones de composición y prioridad (16), zonas (17), destinatarios/orden (18–20) y topes personalizados (21) están cerradas e implementadas. Se preservan partidas anteriores sin reinterpretar el historial. Antes de implementar el contador del 8 queda concretar el evento medible de corrupción, que absorbe el 23; el 22 se vincula con revisión por carta del 9. Almenara/movimiento no autorizan incorporar seguimiento de combate o tablero.

### Próxima iteración: alcance acordado

El usuario seleccionó los puntos **4, 7, 8, 10, 11 y 14** y posteriormente añadió la implementación del **15**, reformulado como Daily Spawn por nivel de adrenalina. Los puntos 5, 6, 9, 12 y 13 no forman parte de esta iteración. Acordar el alcance no cierra las decisiones funcionales pendientes de cada punto.

Daily Spawn por adrenalina (punto 15), confirmado e implementado el 13/10/2026: cuatro pares editables de base e incremento, uno por nivel. Conserva los modos por carta o tanda y usa el nivel congelado en SPAWN. Cambiar de nivel conserva los puntos acumulados: 20% de base Azul + 20 puntos pasa a 30% de base Amarillo + 20 puntos = 50%. Cada fallo aporta el incremento de la adrenalina de su tanda, sin recalcular los aportes antiguos con otro incremento. Aparición reinicia el aumento a cero; tasa efectiva limitada al 100%. Los ejemplos no son valores iniciales aprobados.

Los nuevos perfiles se guardan para la próxima partida. Las partidas ya iniciadas con configuración general conservan exactamente su cálculo anterior; el formulario muestra esa base/incremento en los cuatro niveles para facilitar la transición. Sin configuración previa se mantienen 0/0 por nivel y Daily desactivado. Cancelar/regenerar reconstruye solo aportes vigentes; anular restaura nivel, probabilidad y configuración anteriores. El enfoque de primera rotación queda sustituido y no se usa como condición de ciclo. Validado con 186 pruebas y navegador en cinco tamaños, cuota, compatibilidad y recarga offline; sin dispositivos físicos.

Selector de nivel de adrenalina (punto 7), confirmado e implementado el 13/10/2026: control compacto en la parte superior central de la pantalla principal, título «Nivel de adrenalina» y debajo el nombre del color en blanco sobre un rectángulo del color correspondiente, con una flecha a cada lado. La flecha derecha avanza y la izquierda retrocede, en orden Azul / Amarillo / Naranja / Rojo. La corrección del usuario sustituye el nombre anterior «Nivel de amenaza».

Decisiones cerradas del selector:

- Partida nueva en Azul; cada cambio se guarda y se conserva tras recarga. Partidas anteriores sin el campo muestran Azul sin inventar niveles de tandas históricas ni sobrescribir sus bytes al leer.
- Flecha izquierda desactivada en Azul y derecha desactivada en Rojo, sin navegación circular.
- Cambio exclusivamente manual desde la pantalla principal. No aparece en Aparición ni se incrementa durante SPAWN; el usuario lo ajusta durante el turno de jugadores cuando corresponde por eliminaciones físicas.
- Cada tanda conserva el nivel vigente al pulsar SPAWN, incluidas sus derivadas, elecciones posteriores y regeneraciones. Un cambio al cerrar Aparición se aplica a la próxima tanda; los topes del punto 4 respetan este nivel y conservan su propio snapshot por tanda.
- Anular la última tanda restaura el nivel anterior a SPAWN, incluso si se modificó después de cerrar Aparición.

Verificado en navegador en cinco tamaños, con encabezado centrado, controles táctiles y recuperación offline. Los valores de límites por nivel quedaron confirmados e implementados en el punto 4. Las estadísticas del punto 13 quedan fuera de esta iteración. No se probaron dispositivos físicos.

### Daily Spawn: reglas comunes implementadas

- Siete cartas únicas de la carpeta 05, caja Frozen Fortress. Rakshasa usa el ID `DU02` por indicación expresa del usuario, aunque la imagen conservada imprime Du00.
- Un solo mazo y una probabilidad general; se omite el modo de aparición por tipo. No restringir el sorteo al tipo caminante/bruto/corredor del spawn original. Pesos por carta quedan para una evolución futura.
- Un intento por cada carta de spawn elegible. Asedio zombi también es elegible. Activaciones adicionales, spawn de abominación y spawn de nigromante no lo son.
- El Daily se añade a los zombis de la carta general, sin sustituirlos. Sigue el flujo común de unicidad/presencia de los secundarios, sin activación adicional propia como fallback.
- Configuración implementada: habilitar el mazo, elegir cartas según Colección, base e incremento por adrenalina y forma de incremento por carta o por tanda. Partidas antiguas con tasa general conservan su progresión. Los ejemplos 10% y +15 puntos no son defaults aprobados.
- Por carta: cada intento elegible sin aparición incrementa; cada aparición vuelve a la base. Por tanda: sin ninguna aparición incrementa una vez, incluso si no hubo cartas elegibles; si hubo aparición vuelve a la base. Máximo 100%.
- Enemigos en juego excluidos del sorteo y del reinicio. Si todos están en juego, probabilidad efectiva 0% y ninguna aparición; jamás duplicar una identidad ni generar una activación adicional.
- Devolución, refijado, regeneración, anulación y recuperación integrados y probados. Cancelar el origen devuelve el Daily y elimina su aporte de probabilidad; la carta general se consume. Regenerar solo el Daily no repite el intento probabilístico. Las cadenas pertenecen a la misma tanda, sin incrementar dos veces por reabrirla.
- Estado inicial conservador: desactivado, base 0%, incremento 0 y aumento por tanda. Colección, selección y parámetros se aplican a la próxima partida. Una tanda sin cartas elegibles incrementa si hay candidatos; si comienza sin candidatos, no incrementa. La probabilidad efectiva es 0 mientras no haya candidatos.

### Limitadores: comportamiento confirmado e implementado

- Revisión del 13/10/2026: el usuario solicita implementar límites exclusivamente por nivel de adrenalina, con configuración independiente para nigromantes y abominaciones. No implementar controles de límite manual separados ni un selector de modo manual/automático; esta revisión sustituye las propuestas anteriores.
- Los ajustes de topes se aplican a la próxima tanda, sin esperar una nueva partida. La tanda ya creada conserva su nivel y los topes que regían al pulsar SPAWN, también al reabrir, resolver elecciones o regenerar.
- Al alcanzar el límite de enemigos en juego, la nueva carta de spawn del tipo se resuelve automáticamente como activación adicional, sin añadir otro enemigo. Ejemplo: dos nigromantes en juego y límite dos.
- Valores iniciales confirmados e implementados: nigromantes 1 / 1 / 2 / 2 y abominaciones 1 / 2 / 3 / 4, en orden Azul / Amarillo / Naranja / Rojo. La configuración admite enteros positivos editables; cada valor debe ser mayor o igual que el anterior dentro de su familia. No se ajustan otros colores silenciosamente al editar: un perfil decreciente bloquea guardado e inicio con un mensaje.
- La monotonía se aplica al perfil. Retroceder con el selector de adrenalina o editar un perfil puede dejar más enemigos presentes que el nuevo tope; se conservan esas instancias y todo nuevo spawn de la familia se resuelve como activación adicional mientras la presencia sea mayor o igual al tope. No eliminar enemigos ni bajar contadores como efecto del cambio de tope.
- Presentación compacta horizontal, siguiendo Fácil / Estándar. La última preferencia por valores directos sustituye la propuesta previa de incrementos acumulativos al cambiar de adrenalina.
- El antiguo reinicio del límite manual de nigromantes a 1 deja de regir al eliminarse ese modo. Nueva partida conserva el perfil configurado y reinicia la adrenalina en Azul; en la primera configuración se usan los valores confirmados arriba.
- Al completar un tope mediante una elección, otros spawns pendientes de esa familia en la misma tanda pasan a activación adicional sin otro sorteo. La selección/regeneración secundaria consulta el tope congelado; no consume secundaria ni genera zona adicional cuando se alcanza el máximo.
- Guardados sin perfiles se conservan al leer. La pantalla muestra los defaults confirmados; el próximo SPAWN adopta el perfil atómicamente. Las tandas antiguas sin topes guardados conservan su resolución anterior. Anular restaura también la configuración previa al SPAWN; fallo de cuota no acepta cambios parciales.
- Las excepciones por identidad, incluida una posible transformación de Mumm-Ra bajo condiciones por confirmar, pertenecen al punto 9. No están automatizadas ni alteran estos topes todavía.
- Validación: 203 pruebas aprobadas (17 nuevas), navegador en cinco tamaños, configuración, elecciones, cadenas, ajustes desde próxima tanda, anulación, cuota, pestañas y recuperación offline. Sin pruebas en dispositivos físicos.

### Corrupción y estadísticas: alcance registrado

- Cada pulsación de SPAWN con al menos un nigromante ya en juego aumenta corrupción en 1. La solicitud es +1 por pulsación con presencia, no +1 por cada nigromante; representa el avance de su aparición durante la activación física en mesa.
- Corrupción y el selector/registro de adrenalina apoyarán el conteo estadístico de zombis aparecidos por nivel (Azul, Amarillo, Naranja y Rojo), además del conteo de eliminados.
- Definir la fórmula y fuente de las cantidades asociadas a corrupción y cómo registrar eliminaciones. No inferirlas de presencia ni de desfijar cualquier referencia.
- Entrada manual para apariciones externas, por ejemplo por robo de otras cartas: en evaluación. El usuario revisará los casos; su implementación no está aprobada todavía.
- Precisar turno físico frente a múltiples tandas, nivel de adrenalina guardado por evento estadístico, cancelaciones/regeneraciones y reversión al anular tanda antes de implementar estadísticas. El selector ya guarda el nivel por tanda; no bloquea los puntos 1 a 3.

### Derivación y zonas: implementado el 13/10/2026

- `Zona 1` con línea inferior que abarque su carta general y, si aparece, el nigromante de esa zona. Ampliar la línea al insertar la carta derivada.
- `Zona 1 nigromante` para la aparición asociada, con otra línea inferior que abarque las N cartas de esa zona. No repetir sufijos visibles `Zona 1-2` y `Zona 1-3`.
- Conservar la flecha entre genérica y enemigo; añadir otra entre el nigromante y la carta de su nueva zona.
- Implementado en Aparición, historial y última tanda. Las cadenas muestran `Zona 1 nigromante 2` y siguientes; las zonas verdes conservan `Nigromante 1` y sus derivadas usan `Nigromante 1 · nueva zona`. Los nombres se calculan desde relaciones estables, sin cambiar etiquetas históricas ni IDs.
- Los grupos y flechas se amplían al revelar las cartas, sin mostrar zonas futuras vacías. La segunda flecha rodea los grupos cuando se apilan; no cruza imágenes ni intercepta controles. Cancelar un origen retira sus conexiones y derivadas.
- Punto 14: reserva superior por grupo de 62 px con marco de nigromante, 51 px con abominación y 8 px sin marco; durante la revelación procedural se conserva una reserva uniforme para evitar anticipar tipos. En móvil apilado, las cartas sin marco recuperan 8 px. Última tanda usa reservas menores para su escala; no se reducen imágenes ni se recortan marcos.
- Validación: 211 pruebas (ocho nuevas), navegador en cinco tamaños, cadenas, revelación, cancelaciones, historial, última tanda, zoom, guardado intacto al renderizar, cuota y recarga offline. Pasaron también las verificaciones de marcos, revelación, límites, Daily por adrenalina e interfaz general. Sin pruebas en dispositivos físicos.

### Mejoras futuras fuera de la iteración completada

Exportar/importar respaldos y pesos variables por carta siguen como evolución futura. Las pruebas físicas en dispositivos permanecen pendientes. Adrenalina se promovió al listado vigente y ya no queda solo como sugerencia futura.

Actualización 8/10/2026: los puntos A aplicables al flujo común de nigromantes quedaron cerrados con la solicitud de usar la lógica de abominaciones, contador igual a fijados y robo inmediato. El registro de cierre de nigromantes prevalece sobre las propuestas anteriores de la tabla. Restricciones por miniaturas, pesos y reglas particulares siguen fuera de alcance.

## A. Propuestas históricas, no vigentes

| ID | Decisión por cerrar | Lo que ya está acordado | Propuesta para discutir |
|---|---|---|---|
| D01 | Fijación automática de nigromantes, al implementar su motor. | Abominaciones nuevas se fijan automáticamente (8/10/2026); fijar no suma zonas. | Confirmar el caso de nigromantes en su etapa. |
| D02 | Cerrada para abominaciones. | Fijados válidos cuentan como presencia; desfijados y anulados no. | No pendiente para esta etapa. |
| D03 | Genéricas antiguas de nigromantes al implementar su motor. | Abominación genérica válida fijada indica presencia sin inventar identidad; descartadas/anuladas no cuentan. | Confirmar la migración aplicable a nigromantes en su etapa. |
| D04 | Modo de nigromantes; pesos avanzados futuros. | Abominaciones: con/sin reposición seleccionable; siempre reiniciar al agotar, una copia por identidad. | Ninguna variante sin reinicio para abominaciones. |
| D05 | ¿Puede salir un enemigo cuya miniatura ya está ocupada? | No hay límite numérico acordado. | Excluir instancias no disponibles y pedir resolución manual si no quedan elegibles; falta inventario físico. |
| D06 | Primera aparición de nigromante: ¿aumenta contador verde? ¿roba enseguida por su nuevo spawn? | Mostrar el enemigo en lugar de la genérica. La expansión Zona 2-2/2-3 se pidió solo para la opción conjunta con uno ya presente. | Aumentar contador verde una vez al resolver la primera aparición y mantener su efecto inicial de mesa manual; confirmar el momento y el robo. |
| D07 | Opción conjunta: ¿el spawn generado se mantiene en siguientes tandas? | Se extrae la carta general de Zona 2-3. | Crear un aporte persistente al contador verde, además del robo inmediato, una sola vez. |
| D08 | Cerrada para abominaciones. | Activación adicional o Activación adicional + Spawn de abominación. Mesa manual; secundaria a continuación, misma zona. | No pendiente para esta etapa. |
| D09 | ¿Una Zona 2-3 con otra carta de nigromante puede generar otra cadena? | Nada cerrado sobre recursión. | Resolución manual secuencial con continuación explícita para cada cadena, sin bucles automáticos ilimitados. |
| D10 | Consumos de derivados de nigromante. | Abominaciones: descartar/regenerar origen devuelve secundaria; general consumida. Regenerar secundaria devuelve anterior antes del nuevo robo. | No aplicar conservación del consumo secundario a abominaciones. |
| D11 | Registro de derivados de nigromantes. | Abominaciones anuladas se conservan en historial con vínculo al origen, fuera de Aparición. | Mantener trazabilidad en la siguiente etapa sin confundir anulación y consumo general. |
| D12 | Cancelación de derivados de nigromantes. | Abominaciones anuladas se desfijan y conservan registro; no pueden volver a fijarse. | Confirmar nigromantes cuando se implemente su árbol. |
| D13 | Reversión del spawn generado cuando ya hubo ajustes manuales/desfijación. | No puede haber negativos; desfijación permite Sí/No. | Aportes con ID/estado: cancelar solo el aporte todavía activo; definir a cuál aporte afecta cada resta manual, para evitar doble descuento. |
| D14 | Alcance de una activación con varios enemigos presentes. | Hay modalidades y posibles comportamientos específicos. | Mostrar la regla de la genérica/identidades; mantener resolución de mesa manual hasta validar el alcance por enemigo. |

No volver a preguntar las decisiones cerradas en los registros siguientes. Antes de automatizar reglas particulares, confirmar los efectos específicos y sus datos; restricciones de miniaturas y pesos adaptativos son evolución futura, no condiciones del flujo actual.

## B. Datos del catálogo

Registro histórico de datos inicialmente pendientes: las cantidades y dificultades de cinco spawns de expansión, y las siete identidades Daily de Frozen Fortress, quedaron confirmadas e integradas el 13/10/2026. Para el estado vigente, prevalecen los puntos 1 a 3 del listado superior; Bestias divinas y vínculos de ayudas siguen pendientes.

- Juego y expansión de origen de cada ficha no base: por confirmar. Algunos nombres mencionan el juego, pero eso no confirma compatibilidad ni colección completa.
- Cantidad física y clasificación de spawn de expansiones: por confirmar. Hay cinco números de spawn identificados en el inventario, más recursos de bestias cuyo papel debe confirmarse.
- Dificultad de expansión: no deducir de sus estadísticas; requiere una clasificación del usuario.
- Recursos de nigromante: falta indicar qué imágenes de apoyo vincular a cada enemigo/genérica.
- Traducciones: conservar originales y variantes; revisar reglas antes de usarlas como fuente de automatización.
- La disponibilidad y pertenencia de las cartas se confirmaron mediante las carpetas 00–04 del usuario. Los secundarios tienen una copia por carta, sin número ni dificultad. El número de miniaturas físicas no se deduce de esta clasificación.
- Mumm-Ra tiene recursos de nigromante y de abominación separados. Conservar identidades diferenciadas; su transformación es un comportamiento especial que necesita una decisión propia.
- Dragón nigromántico y Bestias divinas Activación pertenecen a la carpeta 04 del usuario; Bestias divinas Aparición a la 02. Esto confirma el grupo del recurso, sin automatizar sus efectos.

## C. Complementos propuestos

- Exportar/importar respaldo JSON para trasladar partidas entre dominios. No equivale a sincronización automática.
- Mostrar tasa actual por enemigo y un historial de cambios de pesos en las etapas avanzadas; el usuario no definió todavía esos controles.
- Selector de adrenalina: implementado el 13/10/2026 según el registro del punto 7. La consulta de cartas conserva los cuatro niveles completos.

## D. Decisiones ya cerradas que no se deben volver a preguntar

- Cantidades del mazo base: 56, con tabla entregada.
- Fácil: 429 Caminantes, 435 Brutos, 442 Corredores.
- Dificultad por exclusión, sin compensación de proporciones.
- General sin reposición y reinicio bajo el umbral tras cada robo.
- Umbral 0% reinicia cuando se agota.
- Tanda en vez de Turno.
- Contadores separados normales/nigromante, no negativos.
- Blanco/verde en Aparición agregan carta y zona; encabezado solo ajusta contador.
- Descartar consume la copia ya robada y no obliga a robar otra.
- Regenerar deja original descartada y extrae una nueva.
- Historial permite fijar.
- Desfijados se conservan a la derecha, último primero.
- Desfijar nigromante con contador cero no pregunta.
- El alcance inicial no incluía límites de enemigos activos. Sustituido por el pendiente 4 y la confirmación del 13/10/2026; limitadores aún no implementados.
- Abominaciones no generan spawn adicional.
- No hay sincronización ni multijugador.

## Registro de cierre

### Acciones por defecto, 9 de octubre de 2026

- Dos selectores independientes junto a Última tanda: nigromante y abominación. Inicialmente Elegir en el momento.
- Activación adicional, Spawn adicional sin activación, Activación adicional + Spawn adicional, Al azar y Elegir en el momento.
- Al azar elige uniformemente una de las primeras tres acciones; nunca elegir en el momento. Pesos por dificultad quedan para una evolución futura, sin implementar.
- Sin presencia fijada del tipo, aparición automática como antes. Un nigromante nuevo siempre auto-fija, aporta zona y roba su general inmediatamente.
- Cambiar selector afecta futuras apariciones de la partida actual y se guarda; no resuelve retroactivamente pendientes ni cambia resultados anteriores.


### Nigromantes, 8 de octubre de 2026

- D01/D03: secundarios auto-fijados; fijados válidos dan presencia y una zona por extracción. Descartados/anulados y desfijados no cuentan. No se inventan identidades para genéricas antiguas.
- D04: misma reposición que abominaciones, selección uniforme de una copia por identidad, con/sin reposición y reinicio obligatorio al agotar. Congelado por partida.
- D06/D07: todo nigromante nuevo roba inmediatamente una general para su spawn, incluido el primero. Su fijación suma una zona persistente para futuras tandas.
- D09: general derivada de nigromante queda con elección porque ya hay presencia. La cadena avanza una vez por elección, sin bucle automático ilimitado.
- D10/D11/D12: cancelar origen retira árbol, devuelve secundarios, desfija y conserva historial anulado. Generales consumidas no se devuelven. Regenerar secundaria hace lo mismo antes del nuevo sorteo y su nuevo robo general.
- D13: contador calculado desde fijados, sin ajustes manuales ni pregunta opcional de resta en partidas nuevas. No hay aportes que descontar dos veces. Refijar devuelve zona sin repetir una aparición ya resuelta.
- D14: activaciones/movimientos físicos y reglas específicas se resuelven en mesa. No se infieren efectos desde traducciones.
- Diez identidades de carpeta 03 operativas. Death Notes permanece como referencia hasta confirmar vinculación/automatización o su participación en el sorteo.
- Guardados previos se preservan; activar en nueva partida, sin robos o identidades retroactivos.

### Abominaciones, 8 de octubre de 2026

- Sin presencia: conservar spawn y añadir secundaria con la misma etiqueta de zona, sin contador adicional.
- Con presencia: dos elecciones sobre imagen; se guarda una sola resolución. Activación simple no roba.
- Cada nueva secundaria queda fijada. Desfijar manualmente no devuelve una carta: solo quita presencia.
- Descartar o regenerar origen consume la general como antes, anula sus secundarias, devuelve su disponibilidad y las desfija.
- La secundaria no tiene descarte propio. Regenerarla anula/devuelve la anterior antes de sortear; puede salir otra vez la misma identidad.
- Con reposición mantiene disponibilidad; sin reposición reinicia siempre al agotarse. El modo se congela al iniciar partida.
- Pendiente futuro: campo de input para enemigos que no pueden reaparecer por su regla. Sin automatizar excepciones todavía.
- Pendiente puntual: participación de Bestias divinas Activación en sorteo. Kijin mantiene su única identidad con variante corregida.
- Detalle técnico de devolución: revierte el reinicio agotado si aún no hubo otros robos del nuevo ciclo. Si ya los hubo, conserva sus elecciones/ciclo; no duplica una copia que otro origen vigente consume en ese ciclo.
- Los anulados siguen consultables en Historial y Desfijados, sin presencia. No se habilita un sorteo retroactivo en partidas antiguas.

Cuando el usuario responda, actualizar este archivo con ID, fecha y decisión exacta; trasladar el resultado a especificación y criterios de aceptación. No conservar una propuesta contradictoria como instrucción activa.
