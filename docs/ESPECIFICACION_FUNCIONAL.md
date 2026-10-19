# Especificación funcional · Gestor de mazos Zombicide

## Revelación independiente y alcance del sorteo · 19/10/2026

Personalizado permite acciones independientes Siempre/Por probabilidad/Nunca y Spawn con aumento y máximo. En la activación de otros nigromantes y de abominaciones, «Calcular por» ofrece Independiente (un sorteo por enemigo) o Todos juntos (un sorteo para todo el grupo). El Profanador queda fuera de ese grupo. Los topes bloquean únicamente Spawn, sin forzar activaciones ni contar como fallo. Las combinaciones guardadas permanecen hasta activar el nuevo perfil. [REVELACION_ACCIONES_INDEPENDIENTES.md](REVELACION_ACCIONES_INDEPENDIENTES.md) prevalece sobre las descripciones históricas de combinaciones fijas para este perfil opcional.

## Corrección Daily y claridad de configuración · 19/10/2026

[AJUSTES_CONFIGURACION_Y_DAILY.md](AJUSTES_CONFIGURACION_Y_DAILY.md) establece nombres explícitos de mazos, grupos plegables con consulta, descripciones por opción y orígenes Daily seleccionables. Cambiar de adrenalina mantiene el porcentaje actual; cada fallo usa el incremento del nivel de su tanda y una aparición reinicia a la base de ese nivel. Prevalece sobre la descripción histórica de sumar a la nueva base.

## Death Notes y actualización visible · 19/10/2026

Death Notes se incorpora como nigromante de Frozen Fortress, una copia seleccionable y reglas consultables; ruido y daño en mesa. El aviso fijo «Actualizar ahora» permite activar una versión completa y recargar conservando partidas y las otras pestañas. Las selecciones anteriores se mantienen. [ACTUALIZACION_Y_DEATH_NOTES.md](ACTUALIZACION_Y_DEATH_NOTES.md) sustituye las notas históricas inferiores sobre esta carta y la actualización.

## Ampliación confirmada: Spawn Especial · 18/10/2026

La composición directa se conserva como modalidad inicial. Las modalidades opcionales de disparadores y aparición probabilística, sus cantidades, reposición, Daily integrado, compensación y persistencia se definen en [SPAWN_ESPECIAL.md](SPAWN_ESPECIAL.md), que prevalece sobre las descripciones históricas de expansiones siempre integradas al general.

## Banderines Daily Spawn en Aparición y Última tanda: 15/10/2026

Pendiente 27 completado. Las siete identidades Daily muestran en la esquina superior izquierda el banderín de su familia de catálogo: Caminante azul, Bruto morado o Corredor ámbar. Se reutilizan recursos y geometría existentes (altura del 20%, margen de 4 px y corrección del lienzo transparente), sin duplicar insignias ni interceptar zoom o controles. Bake-Danuki conserva Caminante en su aparición inicial y el estandarte guardado por dado en su referencia especial final. No se aplica retrospectivamente su última transformación a imágenes de apariciones anteriores.

Solo presentación en miniHTML y cardHTML de Aparición; Historial ordinario conserva su presentación previa y la referencia de Bake-Danuki sigue mostrándose con su resultado histórico. Sin cambios al motor, sorteos, contador de zombis ni guardado. Servidor local reiniciado para revisión en http://127.0.0.1:8080/mazo/.

QA verificar-banderines-daily.mjs: las siete cartas y sus tres familias en las dos vistas, una sola insignia por carta, altura/proporción/posición, cinco tamaños, sin desbordamiento de página, zoom al pulsar sobre banderín, guardado intacto, Bake-Danuki sin zona y con un solo banderín según D6, recarga offline sin resorteo. Pasó también verificar-bake-danuki.mjs: orden final de la animación, historial, anular y recuperación de estandarte. Capturas daily-banderines-*.png. Sin pruebas en dispositivos físicos.


## Ajustes de zombis agrupados: 15/10/2026

El contador ahora usa un borrador numérico entre −1 y +1, editable con teclado del teléfono. −1/+1/+5/+10 solo modifican ese borrador y no registran ni guardan cambios. El botón Agregar (o envío del formulario con teclado) aplica la cantidad completa como una única entrada de historial, y reinicia el campo a 0 tras guardado correcto. También reinicia el borrador al abrir. Mostrar/Ocultar no elimina el borrador. Se admiten enteros positivos y negativos para correcciones, rechazando cero, fracciones, valores inseguros o una corrección que deje el total negativo. Se mantiene la compatibilidad de los registros anteriores.

Campo temporal solo en UI; no se altera el total ni localStorage al escribir o pulsar atajos. Si falla el almacenamiento se conservan el campo preparado, total y registro anterior, permitiendo reintentar. Tras guardar, Agregar queda deshabilitado a 0 para impedir duplicados. Persistencia admite ajustes enteros agrupados con fecha/tanda/adrenalina; contador automático sin cambios.

Validación: 272/272 pruebas, incluida una nueva de cantidades agrupadas/negativas y límites; prueba previa de ajustes actualizada para aceptar enteros arbitrarios. QA verificar-contador-zombis.mjs comprueba preparación 18 sin guardar ni cambiar total, confirmación como +18 en una sola entrada, teclado, negativos, invalidación, cero y confirmación repetida, conservación de borrador ante cuota, cinco tamaños sin overflow, ubicación entre −1/+1, recarga offline y nueva partida. Capturas contador-zombis-*.png. No se probó teclado en un teléfono físico.


## Vista compacta y Última tanda sin scroll interno: 15/10/2026

Resúmenes Daily y próxima tanda agrupados en una línea flexible, fuente de 12 px y espaciados reducidos. Texto compacto (5/7, C2, Adic., Prof., Abom.) con descripción completa en title y aria-label de cada resumen; en pantallas pequeñas se permite envolver texto para conservar legibilidad sin desbordamiento. Mazo general reduce padding de 24 a 12 px y gaps de 22 a 12 px.

Muralla conserva puerta central y laterales, pero altura exactamente al 50% de la anterior: clamp(37px,4vw,52px), misma proporción y más repeticiones. Su margen inferior baja de 18 a 9 px; separador verde de 36 a 24 px con margen de 10 px; sección y título de Última tanda reducen espaciado vertical.

Última tanda cambia la tira con overflow-x:auto por cuadrícula común de columnas de 160 px con envoltura en filas y overflow visible. Los grupos de zona no crean filas independientes. Parejas de genérica/enemigo ocupan dos columnas si el contenedor tiene al menos 334 px, o una columna vertical si no; flechas se orientan al espacio real. La página crece según las filas, sin scrollbar interno horizontal ni vertical en Última tanda. No afecta la galería ampliada de En juego, cuyo desplazamiento fue solicitado por separado.

Verificado con verificar-vista-compacta.mjs: 19 cartas en cinco tamaños (1440/1024/844/390/320), resúmenes en una fila desde 844 px, muralla al 50%, cartas contenidas en sección y varias filas, sin overflow interno ni horizontal de página, altura de página creciente, offline y estado guardado intacto. Pasaron regresiones verificar-marcos.mjs, verificar-separador.mjs y verificar-activacion-sin-zona.mjs, incluyendo alineación de centros y ambos marcos. Capturas ultima-tanda-sin-scroll-*.png. No cambia motor ni guardado.


## Galería ampliada de En juego: 15/10/2026

Botón de ojo junto al título En juego abre una ventana con todas y solo las cartas fijadas actualmente, con sus estandartes (incluido el tipo actual de Bake-Danuki). No muestra Desfijados ni controles para retirar cartas. Reutiliza savedCardHTML y permite la ampliación individual existente como opción adicional.

Cabecera con −, porcentaje, icono de lupa, + y X. Inicio al 100% en cada apertura, equivalente a 280×437 px; pasos de 5 puntos porcentuales con límites técnicos 25–200%. El zoom es solo presentación local, sin alterar localStorage ni resultados de la partida. Filas calculadas según alto disponible y tamaño de carta, con cuadrícula común y desplazamiento horizontal cuando excede el ancho; zoom grande permite también desplazamiento vertical. Recalcula al redimensionar o rotar y actualiza las cartas si cambia la partida en otra pestaña. Vacío explícito si no hay fijadas.

QA verificar-galeria-en-juego.mjs: seis fijadas y una desfijada excluida, estandartes, tamaño 280 px, pasos 5%, límites, dos o más filas reales al reducir, scroll horizontal, reapertura 100%, cinco tamaños, controles dentro de viewport, zoom individual y regreso a la galería, recarga offline, consulta sin modificar guardado y sincronización de cambios desde otra pestaña. Pasó también verificar-distintivos.mjs: cinco familias, Daily, proporción, desfijar/refijar y offline. Capturas en-juego-zoom-*.png en docs/verificacion. Sin dispositivos físicos.


## Bake-Danuki: regla personalizada implementada, 15/10/2026

Si la identidad daily-du07 está fijada y vigente al iniciar SPAWN, se registra una única tirada entera D6 en esa tanda. No tira si aparece por primera vez durante la tanda ni si ya estaba desfijado; el comportamiento inicial sigue siendo Caminante. Se captura la presencia al comienzo y se consume el RNG del dado después de resolver todas las apariciones normales y derivadas. Correspondencia de la carta: 1 Abominación; 2–3 Corredor; 4–5 Bruto; 6 Caminante.

La presentación añade al final una referencia de su carta con Dado N y tipo, sin zona, nueva aparición, activación, pin duplicado ni controles de regeneración. Tiene el estandarte del resultado; la carta fijada en juego también cambia al último resultado de su propia identidad de extracción. Historial y Última tanda conservan el resultado de cada tanda. La referencia usa un UID visual separado y el UID original para zoom. No incrementa contador de zombis ni zonas; continúa perteneciendo al mazo Daily y no consume cupos de abominaciones/nigromantes. Cambiar el estandarte no implementa seguimiento de combate ni efectos de otras familias.

Resultado persistido en tanda.bakeDanuki con uid original, dado y tipo. El render no sortea ni cambia estado. Recargar/regenerar conserva la tirada; anular restaura la tanda anterior y por tanto su estandarte. Nueva partida no conserva efectos. Guardados sin bakeDanuki siguen válidos: se aplica desde la próxima tanda, sin reinterpretación retrospectiva. Registro validado contra una extracción Bake-Danuki de una tanda anterior, dado y mapeo exactos. Guardado atómico y cuota mediante guardarAccion.

Fuente: datos/mazo_daily.json conserva el texto original (tirada al comienzo de la fase de los jugadores); el usuario pidió explícitamente la variante de ejecución en SPAWN. Metadatos actualizados como regla programada personalizada, no como reproducción del momento oficial. Nuevo bake-danuki.js incluido en preparación y caché offline.

Validación: 271/271 pruebas (7 nuevas de dado, presencia, contador, historial, anular, regenerar, desfijar, persistencia y errores). Dos pruebas Daily anteriores adaptadas para distinguir ausencia de RNG de aparición cuando el mazo está bloqueado de la nueva tirada independiente de Bake-Danuki. QA verificar-bake-danuki.mjs: final real de revelación animada, sin token/sello de activación/controles, estandarte y dado, cinco tamaños, zoom, historial, anular y recarga offline sin resorteo. Capturas bake-danuki-*.png. No comprobado en dispositivos físicos.


## Separador de puerta y muralla completado: 15/10/2026

Punto 12 completado con las dos imágenes originales del usuario, ambas de 2172×724: Puerta nevada con torres y calderos.png centrada, y Muralla nevada con torre y escalera.png repetida en los tramos izquierdo y derecho. Tres elementos decorativos independientes en Última tanda, con igual escala vertical y laterales de igual ancho; no se superpone una muralla debajo de la puerta. Altura responsive entre 74 y 104 px, sin deformar imágenes, sin interacción ni lectura redundante por accesibilidad. Se preservan archivos anteriores; nuevo contenido de UI y precaché offline actualizado.

Validación: verificar-separador.mjs en 1440/1024/844/390/320 px comprueba centro, proporción, uniones, repetición lateral, ausencia de desbordamiento, separador verde intacto, recarga offline y guardado sin modificaciones. Capturas muralla-compuesta-*.png y separador-muralla-*.png. 3/3 pruebas de recursos, incluidas copias idénticas a originales y rutas de caché. No se alteran motor, reglas ni datos de la partida.


## Contador de zombis generados: 15/10/2026

Punto 13 reformulado e implementado: botón Zombis a la derecha de adrenalina. Abre una ventana con total oculto siempre al abrir y control Mostrar/Ocultar, ajustes individuales −1/+1/+5/+10 e historial manual inverso, con unas cinco filas y scroll. El encabezado no publica el total. No requiere usuarios ni sesiones por jugador; cada pulsación queda como entrada con fecha, tanda y adrenalina, sin subtotal ni acumulado en el historial.

Conteo automático puro desde extracciones vigentes: cantidades numéricas del catálogo según la adrenalina congelada de cada tanda; cada identidad secundaria Daily/abominación/nigromante añade una unidad. No suma activaciones, referencias, descartes ni anulaciones, y retirar una miniatura/fijación no borra un zombi ya generado. Regenerar sustituye el aporte y anular tanda restaura el estado previo, incluidos los ajustes manuales posteriores al respaldo. Ajustes manuales solo corrigen/extras; no se descuentan bajas. Total no negativo. Asedio y otras cantidades no determinadas, acompañantes de reglas especiales y reposiciones como terracota se añaden manualmente: no se infieren reglas desde texto ni se automatiza el punto 9.

Persistencia: campo opcional ajustesZombis validado, guardados existentes sin campo aceptados y sin reinicio/migración destructiva; reconstrucción de totales sin guardar acumulados redundantes ni repetir RNG. Nueva partida reinicia el registro. Usa guardarAccion para guardar atómicamente, manejar cuota y detectar cambios de otra pestaña; respaldo de tanda incluye el registro. Mostrar/Ocultar es presentación local, se restablece a oculto al abrir y al recargar. Los ajustes no alteran catálogos ni mazos. Nuevo contador-zombis.js incluido en caché offline.

Validado: 13 pruebas originales; 264/264 pruebas de proyecto (7 nuevas de conteo, niveles, Daily, activación, regenerar, descartar, anular, validación y persistencia). Chrome en cinco tamaños con total oculto, sumas, corrección, historial scroll, recarga offline y nueva partida; fallo de cuota conserva estado. Regresión de configuración durante partida aprobada, incluidos cambios entre pestañas y anulación. Scripts verificar-contador-zombis.mjs y verificar-configuracion-partida.mjs; capturas contador-zombis-*.png. Sin dispositivos físicos. Estadísticas de eliminados, desgloses e identidades de jugadores no forman parte de esta implementación.


## Vista de aparición actualizada: 14/10/2026

Punto 26 completado con los originales suministrados: marcador rojo con número blanco centrado sobre cada carta revelada en una zona estándar, y marcador verde sin número sobre las cartas de la zona del Profanador. Las secundarias y referencias de activación conservan el marcador de su zona real, independiente del tipo de enemigo. Misma identificación en Última tanda e Historial. Retirados encabezados textuales, líneas agrupadoras y flecha del nigromante hacia su zona; se conserva la flecha entre carta genérica y enemigo. No cambia el motor ni los datos de partida.

Validación: 13 pruebas originales; comprobación de tokens en cinco tamaños de Chrome, zoom, historial/última tanda, recarga offline y guardado intacto. Capturas en docs/verificacion/tokens-zonas-*.png; script scripts/verificar-zonas.mjs. Sin prueba en dispositivos físicos. Esta presentación prevalece sobre las descripciones históricas de líneas y segunda flecha.


## Correcciones vigentes de configuración durante partida

Prevalece `CONFIGURACION_DURANTE_PARTIDA.md` sobre las decisiones iniciales inferiores: ambos mazos inician Personalizado. Modo, identidad estándar, selección de cartas, cajas y parámetros se pueden editar durante la partida y se adoptan en próximo SPAWN; tanda existente y presencia conservadas. Topes personalizados no se reinician al alternar modo ni al iniciar nueva partida. Estándar de abominaciones excluye trofeos, activa las presentes hasta quedar vacío y respalda con Kan de Core si no hay ninguna apta seleccionada. Estándar de nigromantes conserva adicionales presentes, impide nuevos adicionales y permite aparecer al Profanador ausente.

Quitar/remarcar contenido no recupera trofeos ya derrotados; descartes activos sí pueden reiniciar el mazo, excluyendo presentes y trofeos. Catálogos históricos y configuración por tanda preservan referencias y aportes de Daily. Partidas de prueba previas se reinician una vez al cargar esta revisión, con configuración conservada y guardado atómico. El umbral conserva su aplicación inmediata. Los apartados inferiores registran la primera iteración y las etapas históricas.

## Modos de enemigos vigentes desde el 14/10/2026

La iteración autorizada de modos está implementada y prevalece sobre las resoluciones históricas inferiores. Contrato completo y decisiones: `ITERACION_MODOS_ENEMIGOS.md`. Nigromantes: Estándar / Varios / Personalizado; abominaciones: Estándar / Festival / Personalizado. Solo Personalizado admite acciones configurables (sin Elegir en el momento) y topes por adrenalina. Modos, selección estándar y composición se aplican al iniciar una nueva partida; los guardados anteriores conservan sus reglas.

El Profanador es obligatorio, prioritario si falta y único creador de zona. Su espacio no consume el cupo de adicionales: defaults 0/0/1/1, manteniendo máximos totales potenciales 1/1/2/2. Su zona se retira al salir de juego; el historial permanece. Su robo y resolución se ejecutan después de las zonas iniciales y su carta se muestra boca abajo hasta el final. Varios activa únicamente al Profanador presente y luego roba otro nigromante disponible. No hay robo extra por cada activación.

Personalizado de nigromantes ofrece cinco acciones más Al azar. Azar general uniforme entre acciones cumplibles; al completar cupo o agotar candidatos se excluyen acciones con spawn. Las acciones con azar individual activan al Profanador y sortean independientemente un 50% por cada adicional presente. Tandas guardan acción y destinatarios; recargar no repite resultados. Las referencias de activación con sello/zoom no son nuevas extracciones ni presencia.

Estándar de abominaciones usa una identidad escogida entre las marcadas en colección, sin borrar las otras preferencias. Festival activa todas las presentes y luego roba otra disponible. Personalizado conserva activación / spawn / ambos / azar y topes 1/2/3/4. Se preservan ubicaciones, unicidad, reposición y trofeos existentes. Falta de candidatos no duplica ni revive enemigos; muestra aviso y activa a los destinatarios presentes correspondientes. Corrupción y tokens visuales siguen pendientes.

Estado: base existente + ampliaciones solicitadas + decisiones pendientes. No es una declaración de que las ampliaciones ya funcionan.

## Ampliación vigente del 13/10/2026

Daily Spawn funciona como mazo independiente de siete identidades únicas de Frozen Fortress. Se añade al spawn general elegible (incluido Asedio), nunca a activaciones adicionales ni a genéricas de abominación/nigromante. Cada carta elegible intenta la probabilidad general; no se filtra por tipo. Auto-fijado, devolución y refijado usan ubicaciones del secundario; los enemigos en juego no se sortean ni barajan al reiniciar. Sin candidatos no hay aparición ni activación adicional y la probabilidad efectiva es 0.

Configuración para la próxima partida: habilitación, selección de cartas, cuatro pares editables de base (%) e incremento (puntos porcentuales), uno por adrenalina, y modo por carta/tanda. Inicio conservador: desactivado, 0/0 en cada nivel y por tanda. Fallo por carta acumula el incremento del nivel de su tanda; aparición reinicia el aumento a cero. Por tanda sin aparición acumula su incremento una sola vez (incluidas sus cadenas), salvo si comienza sin candidatos. Con candidatos, una tanda sin cartas elegibles también incrementa. Cambiar de adrenalina conserva los puntos acumulados y los suma a la nueva base, con tasa efectiva máxima del 100%; no recalcular aportes anteriores usando otro incremento. Ejemplo aprobado de comportamiento, no de valores iniciales: base Azul 20% + 20 puntos → base Amarillo 30% + 20 puntos = 50%. Anular restaura la tanda previa; cancelar un origen devuelve su Daily y elimina su intento; regenerar solo el Daily no repite la prueba probabilística. Recuperación y presentación no sortean.

Compatibilidad: partidas anteriores sin `dailyPorNivel` conservan exactamente su tasa general y su progresión, sin escribir nuevos valores al leer. Configuración muestra su base/incremento anteriores en los cuatro niveles como punto de partida editable. Guardar solo cambia la próxima configuración; iniciar una nueva partida adopta el perfil por nivel. En partidas con perfiles, cada intento, elección tardía y regeneración usa la adrenalina congelada de su tanda aunque el selector de la pantalla principal haya cambiado. El estado visible de probabilidad corresponde al nivel seleccionado para la próxima tanda. La rotación del mazo no cambia estas tasas.

Cinco fichas de expansión completas están habilitadas para selección, 24 copias adicionales. Bestias divinas Aparición permanece incompleta y deshabilitada. La interfaz usa Fácil / Estándar, conservando Normal como dato histórico compatible. Una partida existente conserva su composición congelada. Los puntos 4, 7, 10, 11, 14 y 15 están implementados; las reglas especiales individuales y los demás puntos siguen pendientes.

Topes exclusivamente por adrenalina, sin modo manual: nigromantes inicialmente Azul 1 / Amarillo 1 / Naranja 2 / Rojo 2; abominaciones 1 / 2 / 3 / 4. Cada perfil es editable con enteros positivos y no puede disminuir de Azul a Rojo. Guardar ajustes cambia los topes para la próxima tanda, no la ya creada. Cada tanda registra sus topes concretos en SPAWN y los conserva para cadenas, elecciones tardías y regeneraciones. Al alcanzar o superar el tope de una familia, una nueva genérica se resuelve como activación adicional sin selección secundaria ni zona adicional. Al completar un tope por elección, los demás pendientes de la misma familia se resuelven como activación sin otro sorteo.

La presencia se cuenta por fijados válidos, incluidas referencias genéricas históricas válidas; desfijados y anulados no cuentan. Cambiar perfil o retroceder de adrenalina conserva los enemigos presentes, aunque superen el nuevo tope. Los topes restringen las nuevas apariciones, sin retirar instancias de la mesa ni convertir cartas únicas. Nueva partida conserva el perfil elegido y vuelve a Azul. Guardados anteriores sin perfiles se leen sin cambios; el próximo SPAWN desde la UI adopta los defaults confirmados atómicamente. Tandas antiguas sin snapshot conservan sus reglas previas. Anular restaura la configuración anterior a SPAWN. Excepciones como una transformación de Mumm-Ra quedan para el punto 9, sin condiciones inferidas ni implementación aquí.

### Presentación de zonas: puntos 10, 11 y 14 implementados

Aparición, historial y última tanda presentan cada zona con un único título y una línea inferior que abarca sus cartas generales y secundarias. La inserción/revelación amplía el grupo sin mostrar posiciones futuras vacías. Las zonas derivadas muestran `Zona 1 nigromante`, `Zona 1 nigromante 2` y siguientes; las zonas verdes conservan `Nigromante 1` y sus derivadas usan `Nigromante 1 · nueva zona`. Estos nombres son una proyección visual de relaciones estables: las etiquetas históricas, IDs, consumos y estructura persistida permanecen intactos.

Además de la flecha general → nigromante, se muestra nigromante → carta general de su nueva zona. Solo se conecta cuando ambos extremos están visibles y válidos. En filas apiladas la conexión rodea los grupos; cancelaciones retiran las derivadas y sus conexiones. Redimensionar/renderizar no modifica el estado ni realiza sorteos.

El margen superior se ajusta al marco: grupos con nigromante 62 px, con abominación 51 px y sin marco 8 px. En móvil apilado las cartas sin marco usan 8 px; durante la revelación procedural se mantiene una reserva uniforme para no anticipar tipos. Última tanda usa reservas 42/34/8 px a su escala. Las imágenes principales siguen completas y con ancho 155 px. Estos puntos están completados; de la iteración acordada queda el contador de corrupción (8).

## 1. Conceptos

| Concepto | Significado |
|---|---|
| Carta de catálogo | Un tipo/variante con imagen, datos y cantidad inicial. |
| Copia | Una unidad disponible para un robo del mazo correspondiente. |
| Extracción | Una instancia con ID único, carta, mazo, ciclo y estado. |
| Tanda | Grupo creado por una pulsación de SPAWN; no equivale necesariamente a un turno. |
| Zona persistente | Aparición que debe contarse en las siguientes tandas. |
| Posición visual | Lugar de una carta en la tanda. Una carta secundaria no crea por sí sola otra zona. |
| Fijado | Acceso rápido activo. Para enemigos, también indicará presencia cuando se cierre su política. |
| Desfijado | Referencia conservada a la derecha, sin presencia activa. |
| Derivada | Extracción/resolución creada por otra aparición; conserva la relación de origen. |
| Anulada | Derivada retirada por cancelar el origen. Su política de historial/consumo está pendiente. |

## 2. Reglas del mazo general

Datos definitivos del Core de White Death: `datos/mazo_base.json`. Las 56 copias corresponden a las cantidades entregadas por el usuario, no a todos los números físicos de carta escaneados.

- Cada tipo tiene `cantidad_inicial` y `cantidad_restante` dentro de la partida.
- Robo físico sin reposición, ponderado únicamente por las copias disponibles.
- Fácil y Normal excluyen grupos completos; las 28 copias sin dificultad siguen incluidas.
- No hay compensación de proporciones ni duplicación por dificultad.
- El total inicial se calcula al construir la partida; no se recalcula contra todo el inventario de imágenes.
- Composición congelada para la partida. Los cambios estructurales de contenido se aplican en una nueva.
- Umbral editable durante el juego. El valor 0 significa reinicio al agotarse.
- El umbral se comprueba después de todo robo general, con desigualdad estricta. Reinicio restaura cantidades e incrementa ciclo; no elimina otra información.
- Un robo que dispara reinicio conserva el ciclo previo en su registro.
- Sin zonas no hay extracción ni tanda vacía.

## 3. Matriz de acciones de la base

| Acción | Consumo general | Cambia contador | Registro |
|---|---:|---|---|
| SPAWN | Una copia por zona al inicio | No | Nueva tanda. |
| `+` del encabezado | 0 | Suma una zona del tipo | Guardar el ajuste. |
| `−` del encabezado | 0 | Resta si es posible | Guardar el ajuste. |
| `+` blanco en Aparición | 1 | Suma una normal | Misma tanda y secuencia normal. |
| `+` verde en Aparición | 1 | Suma una de nigromante | Misma tanda y secuencia de nigromante. |
| Regenerar una carta | 1 nueva | No en la base | Anterior descartada con X; nueva en igual posición. |
| Descartar sin robar | 0 adicional | No en la base | Actual con X y sin efecto; conserva consumo previo. |
| Fijar/re-fijar | 0 | No | Instancia activa en referencias. |
| Desfijar | 0 | Solo si se elige restar un spawn de nigromante | Mover al inicio de Desfijados. |
| Información/zoom | 0 | No | No muta el motor. |
| Reabrir/cerrar Aparición | 0 | No | Conservar/restaurar estado de ventana. |

En las ampliaciones, las mutaciones de origen pueden cancelar contribuciones derivadas. No sustituir las reglas pendientes con la matriz de la base sin cerrar esa diferencia.

## 4. Interfaz

### Vista principal

Conservar estilo de la web de pruebas: fondo `#101b25`, paneles oscuros, texto claro, acento hielo `#7ed9ef` y verde `#93e0a8` para nigromantes. Son referencias actuales, no un requisito de inmutabilidad píxel a píxel. Evitar un rediseño innecesario.

Controles superiores con SPAWN grande a la izquierda, contadores al centro, configuración circular arriba/derecha e historial al lado derecho. Cada contador tiene `+`/`−` debajo. Controles táctiles de al menos 44 px de área efectiva, incluidos los iconos.

Franja inferior: fijados a la izquierda, separador y desfijados a la derecha. La última referencia desfijada queda primero en su segmento. Desplazamiento horizontal de la franja; vertical para listas largas. No recortar cartas ni reglas con `object-fit: cover`.

### Aparición

Ventana translúcida superpuesta, cartas acomodadas por espacio, X de cierre. Orden inicial de zonas normales seguido de zonas de nigromante. Las nuevas derivadas se insertan junto a su origen.

Las imágenes se amplían sobre esta ventana. Cerrar un zoom o una referencia de información devuelve al contexto anterior. Escape y el foco accesible deben afectar primero a la ventana superior.

Las acciones de fijar, regenerar y descartar muestran únicamente iconos. Mantener `aria-label`, título y estados deshabilitados/activos. `ⓘ` se añade cuando hay material vinculado. Consultar apoyo no exige cerrar la tanda.

Los dos botones `+` adicionales al pie siguen funcionando como en la base. No reutilizar su numeración para los sufijos derivados.

### Historial

Grupos por Tanda, últimos primero. Dentro de cada grupo conservar el orden de zona y la secuencia de reemplazos. Una X roja y texto accesible identifican cartas descartadas. Las anuladas derivadas deben tener un estado propio si se acuerda conservarlas.

Solo consulta, zoom, información y fijación. No introducir botones de regeneración sobre tandas históricas sin un cambio de alcance.

## 5. Fijados y presencia

La base fija por `uid` de extracción y permite varias instancias del mismo tipo. Eso debe preservarse.

Solicitud nueva confirmada: si hay un nigromante fijado, se considera presente para resolver la próxima carta de nigromante. No se consideran presentes los desfijados ni todas las apariciones del historial.

Hay que cerrar:

- Si el nuevo enemigo se fija automáticamente o solo por acción manual.
- Si se aplica la misma semántica a abominaciones.
- Cómo interpretar una antigua carta genérica de spawn fijada sin identidad de enemigo.
- Si se permite volver a fijar una extracción descartada como referencia, y cómo evitar que se considere un enemigo válido.

Requisito técnico: distinguir `referencia visible` de `instancia de enemigo válida`. Una carta descartada/anulada no puede ejecutar efectos ni producir presencia válida por el simple hecho de conservar su miniatura.

Desfijar un nigromante con contador > 0 muestra la pregunta acordada. Sí resta 1; No mantiene; Cancelar no cambia nada. Con contador 0 se omite. Volver a fijar no crea spawn. Cancelar un árbol no debe disparar una cadena de preguntas individuales ni restar dos veces; requiere su política de reversión.

## 6. Configuración jerárquica

Estructura solicitada: Juego → Core/Expansión → Tipo de zombi. Añadir selección de cartas/enemigos al nivel que permita controlar lo disponible.

White Death es el único mazo general completo confirmado. Green Horde tendrá su sección, pero no se declara jugable con cantidades inventadas. Los enemigos procedentes de otros juegos pueden existir en el catálogo sin activar todo su juego de origen.

Datos separados: juego de partida, procedencia del recurso, expansiones seleccionadas, tipos incluidos, dificultad y enemigos disponibles. Mantener compatibilidad por datos confirmados; no inferirla solo de que ambas cajas sean Zombicide medieval.

No se permite doble inclusión de una misma carta por tener varias etiquetas. La selección de contenido no cambia la partida ya empezada sin iniciar otra. El filtro de dificultad no sustituye el selector de expansiones.

Recursos incompletos se muestran con estado de configuración pendiente. Cuando falte cantidad, el sorteo de esa carta permanece deshabilitado; el acceso informativo puede funcionar.

## 7. Resolución de enemigos

### Nigromantes: decisión vigente del 8/10/2026

Este apartado sustituye las propuestas antiguas de nigromantes: el usuario confirmó el mismo flujo de abominaciones, más contador por fijados y robo inmediato de zona nueva, incluso en la primera aparición.

Conservar genérica, mostrar secundaria auto-fijada inmediatamente después y extraer otra carta general para su nuevo spawn. Orden Zona 2, Zona 2-2 enemigo, Zona 2-3 general. Con uno presente: Activación adicional (sin robo) o Activación adicional + Nigromante adicional (secundaria, fijación y robo general inmediato).

Si la nueva general indica otro nigromante, ya existe presencia y queda pendiente una elección del jugador; elegir otro nigromante extiende la cadena. No hay un bucle ilimitado de sorteos automáticos. Las cadenas pueden generar abominaciones con su flujo aprobado.

Contador verde = nigromantes fijados válidos, calculado por referencias a extracciones reales. Se elimina el ajuste manual verde y la pregunta Sí/No al desfijar en partidas nuevas. Desfijar resta; refijar restaura su zona, pero no repite el robo de aparición de una extracción ya resuelta. Referencias descartadas/anuladas no dan presencia ni zonas.

La tanda captura las zonas existentes al comenzar. Nuevos nigromantes generan solo su robo inmediato dentro de esa tanda y sus zonas se incluyen desde las próximas tandas; no se duplican los robos.

Descartar/regenerar origen anula todo su árbol, devuelve secundarios, desfija y actualiza contador. Las generales derivadas conservan consumo, como cartas pasadas de largo. Regenerar secundaria devuelve anterior, anula su árbol y crea nuevo enemigo/spawn sin consumir de nuevo el origen. Historial conserva todo sin efectos de anulados.

Mazos con/sin reposición e independientes, reinicio obligatorio al agotarse, catálogo y modo congelados por partida. Diez identidades confirmadas; Death Notes sigue como ayuda sin sorteo/automatización. Las partidas anteriores mantienen su lógica original, sin migración retroactiva de apariciones; nueva partida activa la lógica aprobada.

### Abominaciones: decisión vigente del 8/10/2026

Este apartado prevalece para abominaciones sobre las propuestas genéricas siguientes, que continúan pendientes para nigromantes.

El spawn permanece visible. Sin ninguna abominación fijada válida, se añade automáticamente una secundaria inmediatamente después, con la misma etiqueta de zona, y se fija. Con presencia se muestran Activación adicional y Activación adicional + Spawn de abominación. La primera registra sin robar; la segunda añade y fija una secundaria. No se aumenta ningún contador ni se roba otra general.

Configuración con/sin reposición, uniforme y una copia por identidad; reinicio obligatorio al agotarse. El modo y catálogo se congelan por partida. Las partidas anteriores no adquieren secundarios ni apariciones retroactivas: se usan al iniciar una nueva partida.

Descartar/regenerar el origen mantiene el consumo de la general, devuelve las secundarias anuladas y las desfija. La secundaria no tiene botón de descarte; regenerarla devuelve la anterior antes del nuevo sorteo. Anulaciones y elecciones se guardan idempotentemente. Historial conserva los anulados sin permitir fijarlos otra vez.

No se automatizan reglas especiales de las imágenes, ni se excluyen identidades por un inventario de miniaturas inexistente. El campo para enemigos que no puedan reaparecer queda pendiente.

### Disparador general

Una carta del mazo general indica nigromante/abominación. El motor conserva esa extracción como origen aunque la imagen visible se sustituya por la del enemigo concreto. Separar identidad de carta general, identidad secundaria y estado de elección.

### Ninguno presente

Seleccionar del mazo secundario y mostrar el enemigo en la posición del spawn genérico. La aparición no debe consumir otra carta general por sustituir la imagen.

Para nigromantes, el usuario limitó expresamente la inserción de dos derivadas a la modalidad adicional con uno ya presente. Contador y resolución del nuevo spawn en la primera aparición están pendientes; no extrapolar esa inserción a este caso.

### Ya hay alguno

Configuración independiente por tipo:

| Modalidad | Resultado esperado |
|---|---|
| Activación adicional | Mantener genérica; indicador/botón superpuesto; no robo secundario. |
| Nuevo enemigo | Resolver selección secundaria; los efectos sobre el existente dependen de la modalidad confirmada por tipo. |
| Elección del jugador | Dos opciones sobrepuestas; seleccionar una aplica el efecto una sola vez. |

Nigromantes: dos botones solicitados son Activación adicional y Activación adicional + Nigromante adicional. El segundo conserva la activación del existente y selecciona uno nuevo.

Abominaciones: funcionamiento análogo sin spawn nuevo; confirmar si su botón de nueva abominación también activa la existente o solo incorpora otra.

El botón de activación reconoce la acción del jugador; no simula movimientos o ataques físicos. Los efectos especiales que modifiquen el gestor solo pueden programarse con requisitos verificados por enemigo.

### Mazos independientes

Catálogos separados, RNG inyectable y estado independiente. La elección del modo de robo, reposición, reset y cantidades/pesos queda pendiente. Mostrar una opción no consume carta; revelar un nuevo enemigo sí consume/ajusta el mazo según el modo aprobado.

Si no hay enemigos elegibles, no sortear undefined ni fingir una selección. Mostrar el motivo, preservar la genérica y dejar pendiente su resolución. La política sobre miniaturas ocupadas también necesita confirmación.

## 8. Derivadas y anulación

Ejemplo funcional obligatorio: Carta de nigromante en Zona 2, ya hay uno fijado, opción adicional conjunta. Orden: Zona 2 genérica, Zona 2-2 enemigo, Zona 2-3 carta general de la nueva zona, luego Zona 3. Las etiquetas expresan origen; no son IDs.

Una derivada de enemigo no equivale a otra zona persistente. La zona generada tiene un ID propio y puede necesitar permanecer en siguientes tandas. Fijar una imagen no debe duplicar ese aporte.

Modelo técnico propuesto, con nombres adaptables:

```text
Extraccion: id, carta_id, mazo_id, ciclo, tanda_id, zona_id,
            raiz_id, padre_id, clase, estado, orden
Resolucion: id, origen_id, modo, estado, derivados_ids
AporteZona: id, tipo, origen_id, estado
```

Este bloque describe campos y no es un diagrama de interfaz. No depende de posiciones de arrays. El contador mostrado puede derivar de aportes manuales y generados, si esa estrategia mantiene los ajustes solicitados.

Descartar/regenerar el origen retira visualmente su subárbol completo. El resto de cartas mantiene IDs y resoluciones. Regeneración conserva la original con X y crea un reemplazo en su posición lógica.

Políticas pendientes: si los consumos de descendientes se restauran; si permanecen como anulados en historial; si los fijados descendientes se archivan; cómo revertir exactamente un aporte ya reducido manualmente; si hay resolución recursiva. Estas preguntas no cambian la necesidad de registrar parentesco desde el primer desarrollo del motor.

Anulación atómica, persistida e idempotente. Si se habilita recursión, debe existir una política explícita y pruebas para evitar ciclos automáticos ilimitados, especialmente con reinicio anticipado del general.

## 9. Información por carta

Ficha con cero o varias referencias. Una referencia tiene ID, título, ruta de imagen/texto local, idioma y procedencia/revisión. Permite vincular la misma ayuda a varias cartas sin duplicar archivo.

Recursos incluidos de ejemplo: guardias, acciones de guardia, acción de combate a distancia demorada, bestias divinas y Death Notes. Asociaciones exactas y automatización pendientes. Las imágenes de bestias no se suman al mazo general por parecer cartas de aparición.

Preferir traducción disponible para lectura en español y permitir abrir el original. No recortar ni regenerar las imágenes entregadas. Las traducciones asistidas requieren validación antes de derivar reglas ejecutables.

## 10. Persistencia y actualización

Guardar cada acción sobre un estado válido, no solo al cerrar el modal. Recuperar exactamente las extracciones y opciones elegidas. Las ventanas son interfaz y no deben ejecutar efectos al abrir.

Versionar partida y catálogo. Congelar cantidades/IDs de la composición inicial y las políticas aplicables. Una actualización no debe introducir cartas nuevas automáticamente en una partida ya iniciada.

Ante datos corruptos o fallo de escritura, mostrar un error y conservar los bytes guardados hasta una acción explícita de recuperación. Evitar que la migración convierta una referencia antigua en un enemigo elegido ficticio.

Nueva partida confirmada restaura mazos participantes, borra tandas/referencias/estado abierto y devuelve zonas de nigromante a cero; conserva zonas normales y configuración elegida. No confundir con el reinicio anticipado del general.

Offline exige que app, cartas seleccionables y referencias incluidas hayan sido descargadas. No depender de CDN, fuentes remotas ni URLs firmadas. Probar desde subruta de Pages. Definir actualización segura de service worker; la base usa `skipWaiting`, y ese comportamiento requiere revisión cuando cambie el formato de estado.

## 11. Backlog

Probabilidades adaptativas de mazos secundarios y especiales, editor/importador de catálogo y backup de partida. Se mantienen documentados y separados de las ampliaciones inmediatas. El selector de adrenalina se promovió a la iteración actual; su definición vigente aparece abajo.

Enemigos especiales dentro de grupos: decidir sustitución o adición, número máximo por grupo, nivel de adrenalina y qué cuenta como intento fallido. No evaluar probabilidad cuando la carta solo activa enemigos o no tiene efecto en azul.

No restaurar compensación de ratios en dificultad: fue expresamente abandonada.

### Colección y Contenido: decisión del 9/10/2026

La columna `caja` del Excel suministrado es la fuente de procedencia para este selector. `base` y `Core` son la misma caja; el Excel se normaliza a `Core`. `Core retrocompatibilidad` permanece separado y no se habilita por marcar Core. Hay seis grupos confirmados: Core, Core retrocompatibilidad, Frozen Fortress, Climbers terrorcotta walkers, Crossfire pack y Divine Beasts. Estos grupos no infieren reglas o compatibilidad entre juegos.

Colección es desplegable, antes de Contenido, con casillas de cajas. Core permanece marcado y bloqueado, por ser necesario para jugar. Desmarcar una caja retira sus fichas del selector y de los mazos de la próxima partida; conserva las preferencias individuales para recuperarlas al marcar la caja otra vez.

Contenido tiene un filtro de selección única: Zombis (brutos, caminantes, corredores y recursos de spawn común pendientes), Abominaciones (enemigos secundarios), Nigromantes (enemigos secundarios), Otros (spawns genéricos de abominación/nigromante, activaciones adicionales y asedio). Los seis tipos base de Otros, con sus 28 copias, están siempre marcados y bloqueados en configuraciones nuevas. La selección masiva solo afecta cartas operativas, no obligatorias, del filtro y cajas habilitadas. Las fichas aún no implementadas siguen como consulta, sin entrar al sorteo.

Guardar no cambia la composición de la partida vigente. La nueva selección de los tres mazos y cajas se aplica en la próxima partida; el umbral conserva su aplicación inmediata existente. Se bloquea iniciar una partida si un spawn habilitado requiere un mazo secundario sin enemigos elegidos, mostrando el motivo. Se permite guardar ese borrador sin iniciar la partida.

Salir de Configuración con cambios sin guardar, mediante X o Escape, ofrece Sí, salir / No, volver / Guardar configuración. Cambiar solo el filtro visual no cuenta como modificación. Guardar fallido mantiene el menú y el borrador, sin publicar cambios de partida. Abrir el menú no migra silenciosamente selecciones antiguas ni reescribe el guardado.

## 12. Anular la última tanda: decisión del 9/10/2026

Esta decisión sustituye el botón normal «Añadir zona» de Aparición por «Anular tanda». Tras confirmar, se elimina la última tanda, se cierra Aparición y la anterior queda como última tanda en la vista principal. Si se anula la primera, la partida vuelve a no tener tandas. El jugador ajusta los contadores en la vista principal antes de pulsar SPAWN de nuevo.

Restaurar exactamente el estado previo a SPAWN: mazo general y secundarios, cantidades, ciclos, fijados, desfijados, contadores, configuración e historial. Deshacer también reemplazos, descartes, resoluciones y cadenas realizadas después de ese SPAWN. Los enemigos aparecidos en la tanda anulada no se conservan como desfijados nuevos, porque esa aparición se considera no ocurrida.

Guardar un único respaldo previo junto con la partida, sin respaldos anidados. Cerrar/reabrir la última tanda y recargar conservan la posibilidad de anular; nuevas acciones no sobrescriben el respaldo hasta el siguiente SPAWN. Anular consume ese respaldo y no permite anular otra tanda anterior a continuación. La siguiente pulsación de SPAWN crea otro respaldo.

No inventar un respaldo para una tanda guardada con una versión anterior: la partida se conserva y el botón queda deshabilitado para esa tanda. No requiere nueva partida; el próximo SPAWN será anulable. Anulación atómica: si falla el guardado o cambia la partida en otra pestaña, no aplicar la restauración sobre datos desactualizados. Una confirmación abierta se cierra al recibir cambios externos.

## 13. Volteo automático de prueba

Al pulsar SPAWN, las cartas de Aparición parten con la contratapa suministrada «La tormenta oculta la horda», completa y sin distorsión, y se voltean automáticamente de izquierda a derecha en orden visual. No requieren pulsación. Las cartas nuevas insertadas al elegir aparición de enemigo, incluidas sus generales derivadas, aparecen también por el reverso y se voltean sin repetir las cartas anteriores. Nombre y controles quedan ocultos e inactivos hasta terminar el giro de esa carta. La contratapa sustituye el signo de pregunta de la prueba inicial.

Es un efecto visual transitorio: los robos, relaciones y efectos se guardan completos antes de animar. Cerrar/reabrir, recargar o recibir una partida desde otra pestaña no repite la animación ni consume cartas. La preferencia de movimiento reducido muestra las cartas inmediatamente. No altera las reglas ni los resultados de acciones por defecto.

## 14. Acciones por defecto: decisión del 9/10/2026

Selectores independientes de nigromante y abominación junto a Última tanda. Cinco opciones: Activación adicional, Spawn adicional, Activación adicional + Spawn adicional, Al azar y Elegir en el momento (inicial). Al azar sortea uniformemente una de las primeras tres opciones, sin incluir elección manual. Se guarda el resultado aplicado por carta; recargar no vuelve a sortearlo. Pesos por dificultad son futuros.

Con enemigos fijados del tipo, aplicar la opción a cada aparición nueva, también a las generales derivadas. Spawn revela/fija un nuevo enemigo sin activación; combinado añade la activación de mesa. Todo nigromante nuevo aporta zona y roba una general inmediata en ambos casos. Sin presencia, la primera aparición sigue siendo automática independientemente del selector. Elección manual muestra las tres acciones diferenciadas. Cambiar preferencia no altera cartas ya resueltas ni pendientes anteriores.

Preferencias guardadas en la partida, compatibles con estados previos sin este campo; ausencia equivale a Elegir en el momento. Anular tanda restaura también las preferencias previas a SPAWN. Protección técnica de cadenas automáticas: al alcanzar 100 niveles derivados consecutivos, abortar el intento completo sin guardar cambios parciales, solicitando usar elección manual. No limita enemigos de la partida ni completa arbitrariamente la cadena.

## 15. Presentación procedural: decisión del 9/10/2026

Actualización del 12/10/2026: mazos secundarios con ubicaciones separadas (disponibles, En juego, descarte y trofeos). Enemigos fijados excluidos del sorteo en ambos modos; no duplicar identidades activas. La X derrota al enemigo: normales al descarte y trofeos fuera de la partida. Reiniciar un mazo recicla solo descartes, nunca fijados ni trofeos; si no hay disponibles ni descartes, aplicar activación adicional sin robo ni nueva zona. Amaterasu, Hachiman y Red Hare son trofeos confirmados por el input. La habilidad y su asignación al superviviente se juegan físicamente.

Detalle de abominaciones/nigromantes: botón Volver a agregar al mazo, siempre con confirmación. Advertencia de derrota/trofeo únicamente si la ficha tiene trofeo. Aceptar desfija y devuelve la identidad inmediatamente, también como excepción manual para trofeos; cancelar no cambia estado. Volver a fijar desde desfijados retira la identidad del mazo/descarte/trofeos y sincroniza zonas de nigromante. La devolución de un nigromante no borra la general ya jugada de su aparición. Cartas anuladas no se pueden reactivar. Anular tanda restaura todos estos cambios. Estados antiguos se migran sin nuevos robos ni pérdida de historial; duplicados antiguos no se borran automáticamente, pero no se crean nuevos.

Tiempos: iniciales 700 ms; enemigos secundarios y generales de zonas derivadas 1000 ms. El sello de activación adicional tiene una etapa propia de 1000 ms. En activación más spawn se presenta primero la activación, luego el enemigo durante otros 1000 ms y después su general derivada, si corresponde, durante otros 1000 ms. También aplica a elecciones hechas tras reabrir Última tanda, sin repetir cartas conocidas. No hay nuevas escrituras ni sorteos durante estas etapas.

La primera vista de SPAWN contiene exclusivamente N cartas iniciales, donde N es el total de zonas configuradas que registra la tanda. Se voltea la primera y se completa su resolución y toda su cadena antes de voltear la segunda, y así sucesivamente de izquierda a derecha. Las iniciales aún no procesadas mantienen la contratapa, sin nombre ni acciones accesibles. No mostrar ni reservar espacios para derivadas antes de procesar su origen. Esta revisión sustituye la presentación anterior que volteaba todas las iniciales antes de resolverlas.

Recorrer los orígenes de izquierda a derecha, intercalando volteo y resolución. Para cada uno, presentar su resolución automática o esperar su elección manual; mostrar las opciones solo en el origen que corresponde. Insertar su enemigo boca abajo junto al origen y voltearlo. En nigromantes, solo después insertar/voltear la general de su nueva zona; si deriva otra aparición, completar esa cadena antes de voltear el siguiente origen inicial. Cada carta espera a que termine el volteo anterior, sin adelantar cartas de otro origen. Marcas de spawn/activación aparecen al procesar su origen.

Es exclusivamente presentación: motor, orden de robos, RNG y guardado atómico existentes se conservan. Las resoluciones automáticas se guardan completas desde SPAWN; una elección manual se guarda al aceptarla. Las derivadas, fijados y contadores del fondo no deben anticipar resultados durante la secuencia. Anular conserva su restauración completa. Cerrar, recargar o recibir una actualización externa cancela la secuencia transitoria y muestra la tanda guardada sin nuevos robos ni repetir la animación. Movimiento reducido omite esperas/giro, conservando pausas manuales y el guardado.

## Nivel de adrenalina: definición confirmada el 13/10/2026

Selector manual compacto en el centro superior de la pantalla principal. Título «Nivel de adrenalina», nombre del nivel en blanco sobre rectángulo con fondo del color correspondiente y flechas izquierda/derecha. Orden Azul / Amarillo / Naranja / Rojo, sin navegación circular; desactivar la flecha que excede un extremo. Controles táctiles y adaptación a teléfono/tablet.

Partida nueva en Azul; cambios guardados atómicamente y recuperables offline. Partidas previas sin campo de nivel se leen como Azul sin inventar niveles históricos ni modificar su guardado al consultar. La selección no roba, no cambia contadores y no incrementa durante SPAWN. El usuario la ajusta desde la pantalla principal durante el turno de jugadores; no se ofrece el selector en Aparición.

Cada nueva tanda registra el nivel vigente en SPAWN y lo conserva para sus cartas, derivadas, elecciones tardías y regeneraciones, incluso tras cerrar/reabrir. Cambiar el selector al cerrar afecta la siguiente tanda. Anular restaura también el nivel que había antes de SPAWN. Los topes automáticos usan el nivel y los topes guardados de la tanda, según el punto 4. Este selector no automatiza experiencia, eliminaciones ni estadísticas.

