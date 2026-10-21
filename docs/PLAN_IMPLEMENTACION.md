# Plan de implementación por capas

## Distribución y diagnóstico de Aparición · 21/10/2026

Tres vistas, acciones cuadradas, anulación en cabecera y detalles de probabilidades implementados/verificados; publicar para feedback físico según autorización vigente. Modernización de la batería antigua de anulación pendiente; cancelar/restaurar desde cabecera se verificó con semilla actual. Continúan pendientes los cambios de pantalla principal. Véase [APARICION_VISTAS_Y_DETALLES.md](APARICION_VISTAS_Y_DETALLES.md).

## Aparición compacta y General · 20/10/2026

Compactación con marcos uniformes, escala de Aparición y opciones directas de actualización/pantalla encendida en General implementadas y verificadas. Publicación autorizada para revisión en tablet; confirmar visualización y bloqueo real antes de extender el ajuste a la pantalla principal. Próximo alcance por elegir a partir del feedback físico. Detalle: [COMPACTACION_APARICION_Y_GENERAL.md](COMPACTACION_APARICION_Y_GENERAL.md).

## Exportación y feedback de mesa · 20/10/2026

Exportación JSON de partida/configuración y actualización manual desde Apariencia completadas y verificadas. Subida a GitHub y publicación automática autorizadas el 20/10/2026. Siguiente paso: comprobar el despliegue, extraer el archivo desde la tablet cuando esté disponible el botón, revisarlo junto a la imagen y elegir un ajuste visual concreto. Compactación, zoom independiente, intercambio de secciones y Última tanda plegable continúan como propuestas. Detalle en [EXPORTACION_Y_FEEDBACK_PRIMERA_PARTIDA.md](EXPORTACION_Y_FEEDBACK_PRIMERA_PARTIDA.md).

## Corrección de Revelación · 19/10/2026

Personalizado utiliza únicamente los controles nuevos Siempre / Por probabilidad / Nunca. Retirados «Configurar acciones independientes» y «Combinación anterior». «Calcular por: Independiente / Todos juntos» pertenece solo a activación adicional de abominaciones y otros nigromantes, excluyendo al Profanador. Perfiles guardados e historial conservados; perfiles futuros ausentes se completan al guardar configuración o al siguiente SPAWN. Este cierre sustituye las notas anteriores sobre mantener ambas alternativas. Detalle: [REVELACION_ACCIONES_INDEPENDIENTES.md](REVELACION_ACCIONES_INDEPENDIENTES.md).

## Revelación independiente y Calcular por · 19/10/2026 · Local

Implementados los perfiles independientes de nigromantes y abominaciones, aumento/máximo de Spawn, bloqueos sin activación forzada y condiciones desplegables. Calcular por permite sortear activaciones por enemigo o para todo el grupo; el Profanador mantiene su evaluación propia. 364 pruebas y QA en cinco tamaños, configuración, cuota, próxima tanda y recuperación offline. Sin publicación. Detalle: [REVELACION_ACCIONES_INDEPENDIENTES.md](REVELACION_ACCIONES_INDEPENDIENTES.md).

## Actualización visible y Death Notes · 19/10/2026

Implementados localmente y pendientes de publicación por indicación del usuario: aviso fijo de actualización manual conservando partidas y borradores de otras pestañas; Death Notes en nigromantes con una copia y configuración anterior preservada. 338 pruebas y 13 originales; QA de actualización y configuración. Alcance y primera transición desde la versión anterior: [ACTUALIZACION_Y_DEATH_NOTES.md](ACTUALIZACION_Y_DEATH_NOTES.md).

## Configuración organizada en pestañas · 19/10/2026

Interfaz autorizada con Contenido / Mazos / Apariencia. Secciones desplegables con resumen de configuración; acciones y topes junto al mazo correspondiente; Daily integrado enlaza a General y Spawn Especial. Guardar permanece visible en un pie fijo y Nueva partida se separa en un desplegable con su confirmación anterior. Ayudas largas plegables. Se conservan los controles originales, sus nombres y manejadores, los borradores entre pestañas y el guardado inmediato de acciones. Sin cambios al motor, reglas, datos o partidas.

Validación: 334/334 pruebas actuales y 13/13 originales; QA de Configuración, Especial, ocultación/puntaje, defaults Daily y vista de mesa. Navegación de teclado, cinco tamaños, guardado/cuota, confirmación de nueva partida y recarga offline. Sin dispositivos físicos. Subida a main y publicación automática autorizadas en esta solicitud. Detalle: [UI_CONFIGURACION.md](UI_CONFIGURACION.md).


## Spawn Especial · 18/10/2026

Implementadas las tres modalidades: integración directa anterior, disparadores virtuales (6 editables desde 1) y aparición adicional por probabilidad. Cantidades y reposición independientes; destinos General/Especial; orígenes elegibles seleccionables; intentos e incremento por carta o por tanda; límites generales o por adrenalina. Intento por tanda al final, incluida resolución tardía, con ubicación aleatoria guardada; sin elegibles cuenta como fallo. Daily independiente conserva una copia por identidad; integrado usa cantidades editables y excluye todas las copias de identidades presentes. Compensación opcional del motor sobre Core filtrado con enteros y vista previa. Sin nuevas cartas habilitadas ni cambios a originales.

Partidas anteriores se recuperan sin adoptar este modo. Guardar aplica en la próxima tanda; historial, resultados, pendientes y anulación conservados. Especificación, decisiones, implementación y pruebas: [SPAWN_ESPECIAL.md](SPAWN_ESPECIAL.md). Validación final: 334/334 pruebas actuales (27 nuevas de Especial) y 13/13 de base-web. Navegador en cinco tamaños, imagen final del disparador, configuración por set/carta, cuota, recuperación con dos pestañas y recarga offline. Versión preparada a85be97a605dd7bb. Sin dispositivos físicos. Implementación verificada localmente el 18/10. Subida a main autorizada por el usuario el 19/10/2026; el workflow existente publicará automáticamente si sus comprobaciones pasan.


## Defaults Daily, reinicio y visibilidad de puntaje · 18/10/2026

Corrección del marcador: scripts/verificar-ocultar-puntaje.mjs verifica las cuatro opciones, ausencia del marcador completo en cinco tamaños, restauración de temas y total acumulado, fallo de cuota sin cambios, compatibilidad con la preferencia anterior, historial intacto y recarga offline. Pasaron las 13 pruebas de base y las 10 de puntaje. Sin dispositivos físicos; cambio local pendiente de publicación.

Retirado el botón «Ocultar puntaje / Mostrar puntaje». El selector Apariencia tiene cuatro opciones: Kang, Dragón, Cabeza y «Ocultar marcador». Al guardar configuración, la cuarta opción oculta el marcador completo de la pantalla principal, incluida su imagen y su acceso táctil; no deja cifras ni máscara. El puntaje sigue acumulándose. Elegir cualquiera de las tres apariencias lo vuelve a mostrar con el total real y permite acceder nuevamente al panel de puntaje y zombis. Se conserva la preferencia booleana ocultarPuntaje, compatible con partidas anteriores; el último tema se mantiene al ocultar. Cerrar sin guardar conserva la selección anterior y el aviso habitual de cambios pendientes. Un fallo de almacenamiento conserva el estado anterior.

Perfil inicial Daily confirmado por captura del usuario: Azul base 5%/+1 punto; Amarillo 8%/+2; Naranja 12%/+3; Rojo 15%/+4. Se usa en arranque nuevo y formulario sin configuración previa. Preserva perfiles guardados y parámetros generales históricos, incluidos ceros explícitos, sin recalcular tandas existentes. Habilitar Daily sigue siendo elección del usuario. El reinicio anticipado inicial ya estaba en 20%; verificado en interfaz y conservado sin sobrescribir un umbral guardado.

Validación de la versión anterior (ocultación de cifras, sustituida por la corrección descrita arriba): dist/daily.js (perfil/formulario), app.js (arranque, máscara y botón), estado.js (preferencia booleana), index.html (control). Nuevas pruebas de defaults y preferencia. QA scripts/verificar-defaults-daily.mjs y verificar-ocultar-puntaje.mjs: cuatro perfiles, 20%, conservación de edición, marcadores/panel sin cifra expuesta, suma continua, cambio de tema, mostrar total real, guardado inmediato, cuota y recarga offline. Pasó regresión verificar-puntaje.mjs de tres temas/cinco tamaños/144 combinaciones de cifras. Última batería completa: 307/307. Sin dispositivos físicos. Versión preparada dcd4b41ef57c5626. Subida a main mediante el despliegue automático existente.


## Despliegue automático autorizado · 16/10/2026

El workflow .github/workflows/pages.yml se ejecuta ahora con cada push a main y conserva workflow_dispatch para ejecución manual. Se mantienen las 13 pruebas de base-web, la preparación de recursos, las 305 pruebas actuales y la dependencia publicar → comprobar-y-preparar: solo se publica si el trabajo previo termina correctamente. No cambian permisos, destino, entorno ni artefacto dist/. La subida de este cambio debe iniciar la primera ejecución automática, incluida la vista de mesa del commit anterior.

Esta decisión sustituye las instrucciones históricas inferiores que indicaban publicación exclusivamente manual. Los cambios a otras ramas no disparan este evento push.


## Vista de mesa simplificada · 16/10/2026

Retirados de la pantalla principal los resúmenes Daily/Próxima tanda y la información de ciclo/reinicio junto al mazo. Mazo general muestra porcentaje restante redondeado a entero (0% si no hay cartas elegibles) y conserva la barra con color de adrenalina. Retirado el pie «Tanda N · Z zonas iniciales» de Última tanda; el diálogo Aparición e Historial conservan su identificación.

Los selectores de acciones de Nigromante/Abominación se trasladan desde Última tanda a Configuración, en «Acciones de aparición». Conservan el guardado automático al seleccionar y aplicación a la siguiente tanda; una nota lo indica. Se mantienen las restricciones de modos oficiales y tanda en curso. No se modifican reglas, composición ni partidas.

Versión preparada: 47847e6c461f9bb7. Validación: 305/305 pruebas, más scripts/verificar-vista-mesa.mjs en cinco tamaños, porcentaje correcto, resúmenes/pie ausentes, selectores disponibles solo en Configuración, guardado automático, historial intacto, fallo de cuota conservando selección previa y recarga offline. Capturas vista-mesa-*.png revisadas. Sin dispositivos físicos.

Subida autorizada por el usuario al repositorio ya conectado Hector-xlsx/white-death-deck-manager, rama main. El workflow Pages existente es manual: subir código no publica automáticamente una nueva versión. Esta solicitud de subida no modifica el workflow ni la configuración de Pages.


## Publicación beta completada · 16/10/2026

Sitio: https://hector-xlsx.github.io/white-death-deck-manager/. Versión `ada49f64804d89a4`, commit desplegado `ccba96a`, Actions `38983701923` aprobado. Fuente GitHub Actions, workflow manual y etiqueta `noindex, nofollow`. Estado y validaciones en [PUBLICACION_GITHUB.md](PUBLICACION_GITHUB.md). Siguiente paso: pruebas físicas en teléfono/tablet y mesa; pendientes funcionales conservados, sin añadir reglas en esta publicación. Los cierres inferiores describen antecedentes anteriores a la publicación.

## Cierre y continuidad para GitHub/mesa · 16/10/2026

Guía consolidada: [CONTINUIDAD_GITHUB_Y_MESA.md](CONTINUIDAD_GITHUB_Y_MESA.md). Versión preparada 13d36a64c0299dd4; última suite completa 305/305 y QA posterior de fichas, sin dispositivos físicos ni Pages publicado. README y tabla de pendientes corregidos para evitar referencias obsoletas. Solo documentación en este cierre; no repositorio, push, publicación, cambios al código/Excel ni partidas. La próxima etapa se realizará cuando el usuario la solicite en el otro chat.


## Fichas básicas core completas · 16/10/2026

Añadidas las reglas textuales entregadas por el usuario para Caminante (1 Herida, Daño 1, 1 adrenalina), Bruto (1 Herida, Daño 2, 1 adrenalina) y Corredor (1 Herida, Daño 1, 1 adrenalina y regla de dos acciones con segunda activación después de la primera acción de todos los zombis). Mismo bloque de consulta con estilo de manual en detalle y Contenido, variantes Fácil/Estándar y cartas de activación de esas familias. Caminante y Bruto solo muestran atributos: no se inventa una sección de reglas vacía.

Selección básica limitada a cartas del mazo general; no se traslada la ficha básica a Daily o enemigos especiales solo por compartir categoría. Se preservan las fichas específicas previas, Profanador exclusivo y desplegable Kan. Datos/render en dist/fichas-zombis.js; PWA regenerada. No cambia motor, puntuación, adrenalina ni partidas.

QA verificar-fichas-zombis.mjs ampliado a seis tipos y sus variantes: detalle y Contenido, atributos de Bruto, regla de Corredor, ausencia de sección vacía, regresión de expansiones, cinco tamaños sin desbordamiento, guardado intacto y offline. Capturas ficha-*.png y revisión visual del Bruto. Sin prueba física ni repetición de batería de motor para este cambio de contenido.


## Reglas core por identidad · 16/10/2026

Texto del usuario incorporado a las fichas de consulta: Nigromante profanador (enemigo-nigromante-profanador) y Abominación Kan (enemigo-abominacion-kan), identificadas por ID y no por familia. Sus reglas se muestran directamente al abrir esas cartas. Los otros Nigromantes no heredan las reglas del Profanador. Las demás Abominaciones muestran un details cerrado inicialmente con «Ver reglas estándar de abominación White Death (Kan)» que despliega la ficha de Kan. Disponible tanto en zoom de carta como consulta desde Contenido.

Atributos: Profanador 1 Herida/Daño 1/1 adrenalina; Kan 1 Herida/Daño 3, Caldero o Fuego de dragón/5 adrenalina. Se conservan estructura de manual, referencias de páginas y sublista de consecuencias al eliminar al Profanador. Se limpiaron saltos de línea y el sujeto pegado por error al final: quien reorganiza su inventario tras recoger el arma es el Superviviente. No se automatizan reglas nuevas ni se alteran puntaje, presencia, corrupción, zonas o combate. Los puntos de adrenalina del texto del manual son distintos del score personalizado.

Cambios en dist/fichas-zombis.js (datos, selección por identidad y detalles), app.js/informacion.js (contexto de carta) y style.css (desplegable/sublistas). PWA regenerada. QA scripts/verificar-fichas-core.mjs: consulta de todas las identidades de enemigos del catálogo, exclusividad Profanador, Kan directo y desplegable inicialmente cerrado para las demás Abominaciones, atributos/sublistas, cinco tamaños sin desbordamiento y guardado intacto/offline. Pasó regresión verificar-fichas-zombis.mjs para los cinco Caminantes con reglas. Capturas ficha-core-*.png revisadas; sin dispositivos físicos. Cambio solo de contenido y presentación, sin repetir la batería de motor.


## Fichas de reglas de Caminantes · 16/10/2026

Añadida consulta textual de Caminante de terrorcota, Trepadores y Caminantes ballesteros al pie del detalle de carta y de su consulta desde Contenido. Aplica por tipo a las cinco cartas operativas (559, 565, 571, 577 y 580), sin duplicar reglas por dificultad. Fuente: texto entregado por el usuario en el chat; imágenes adjuntas solo como referencia de estructura, sin incorporarlas como recursos de la app.

Bloque de pergamino con título, atributos en negrita, viñetas, prioridades numeradas de Ballesteros y atención de Terrorcota. Se limpiaron cortes de línea y palabras partidas. La oración final truncada de Ballesteros se presenta como prohibición de salvación por armadura contra sus ataques, ya indicada por el texto entregado en Heridas. No se automatizan movimiento, ataques, regeneración de Terrorcota ni aparición/corrupción; no cambia puntaje ni guardado.

Datos y compositor compartido en dist/fichas-zombis.js, integrado en app.js e informacion.js; estilo en style.css y nuevo módulo incluido en scripts/preparar.mjs para offline/versionado. QA scripts/verificar-fichas-zombis.mjs: tres tipos/cinco cartas, detalle y Contenido, atributos y prioridades, cinco tamaños sin desbordamientos, guardado intacto, recarga offline. Capturas ficha-*.png revisadas en escritorio y móvil estrecho. No se repitió la batería de motor: es un cambio de contenido/presentación sin lógica de juego. Sin prueba en dispositivos físicos.


## Tabla de puntajes y turnos implementada · 16/10/2026

Fuente vigente: input referencia cartas.xlsx, hoja TABLA PUNTAJES, A1:G19. Instantánea con SHA-256 en dist/tabla-puntajes.js; Excel conservado sin modificaciones. Caminante/Bruto/Corredor al aparecer: 3/4/4; Daily al aparecer: 6, salvo Bake-Danuki. Abominación base 12 y Nigromante base 10 al ser eliminados; multiplicadores por turnos completados 0/1/2/3/4/5/6+: 5/4/3/2,5/2/1,5/1. Resultado Abominaciones: 60/48/36/30/24/18/12; Nigromantes: 50/40/30/25/20/15/10. La tabla de reeliminación ya existe y todos sus valores actuales son 1; se aplica como factor adicional desde la segunda eliminación de la misma presencia/forma.

Turnos: diferencia entre tandas principales aceptadas. Antes del siguiente SPAWN son 0; añadir zona, reemplazar o reabrir no incrementa. Una nueva extracción después de retirar al enemigo tiene nuevo uid, turno 0 y primera eliminación. Una reaparición que conserva presencia conserva antigüedad y cuenta una derrota más. Mumm-Ra vincula las formas: solo acumula mientras está en cada forma, pausa Nigromante durante Abominación y lo retoma al volver; una forma derrotada reinicia su reloj al regresar. Puede puntuar ambas formas en una misma ronda. Para reeliminación se cuenta por presencia vinculada y tipo/forma. Bake-Danuki siempre puntúa al retirarlo según la forma vigente: Caminante 3, Bruto/Corredor 4, Abominación usa la tabla y antigüedad desde su aparición original (incluye intervalos en otras formas).

Cada derrota nueva congela versión de fórmula, tipo, turnos, número de eliminación, base, ambos multiplicadores y puntos. Recarga no recalcula la derrota con otra tabla. Registros antiguos sin estos campos siguen válidos y conservan su ponderación anterior 25/12/5; no se reconstruyen derrotas ausentes. Los valores de apariciones generales/Daily se derivan de la tabla vigente. Anulación y cancelación de orígenes mantienen los filtros y respaldo ya existentes; guardado atómico sin duplicados ante fallo. Las correcciones no puntúan.

Implementado en tabla-puntajes.js y formula-puntaje.js, conectado a derrotas.js/puntaje.js y descripción del panel; ambos módulos incluidos en el precache PWA. No se modifica Excel ni se implementa cierre/historial de partidas. La variación por adrenalina continúa pendiente.

Validación: 305/305 pruebas. Nuevas pruebas por cada tramo y 6+, reinicio tras nueva aparición, antigüedad y segunda eliminación, factor de reeliminación distinto de 1 en prueba aislada (sin modificar fuente), pausa/reanudación y derrota doble de Mumm-Ra, todas las formas de Bake-Danuki, snapshots de puntos, legado, fórmula alterada, cuota, recarga, descarte y anulación. QA verificar-puntaje.mjs, verificar-puntos-derrota.mjs, verificar-zonas-pulso.mjs y verificar-reglas-cartas.mjs: interfaz/animación, cantidades, temas, cinco tamaños, reglas especiales, guardado y módulos nuevos offline. Contextos aislados, sin dispositivos físicos.


## Corrección vigente: momento de sumar puntos · 16/10/2026

Decisión explícita del usuario: Caminantes/variantes, Brutos, Corredores y Daily Spawn suman al aparecer, salvo Bake-Danuki. Abominaciones (25), Nigromantes (12) y Bake-Danuki (5, independientemente de su estandarte/dado) suman al confirmar su eliminación. Los zombis generados siguen contándose al aparecer y no disminuyen al retirar enemigos. Esta regla reemplaza los apartados anteriores donde todos los tipos puntuaban al aparecer.

Se añade derrotasEnemigos, registro opcional persistido de derrotas explícitas con uid, identidad, mazo, tanda, fecha y reaparición. Retirada normal desde En juego registra derrota; la derrota de Mumm-Ra Abominación registra puntos antes de volver a Nigromante; la reaparición confirmada de Chimimōryō registra una eliminación sin retirar su presencia. Cada nueva derrota confirmada con reaparición es un evento nuevo. Meng Huo ya recibió puntos al aparecer y no los vuelve a sumar al reubicarse. Cancelar/cerrar avisos, devolver al mazo, regenerar/descartar y transformaciones de corrección no registran derrotas. Operaciones internas de desfijado conservan su motivo de corrección por defecto.

Guardado atómico: fallos de almacenamiento o conflictos no suman ni retiran cartas. Anular tanda restaura los registros anteriores desde el respaldo existente. Puntaje ignora derrotas de extracciones anuladas/descartadas o transformaciones revertidas. No se duplican puntos al repetir la retirada de una presencia ya eliminada. Recarga no reproduce la eliminación ni el pulso.

Compatibilidad: guardados sin derrotasEnemigos son válidos. No se infieren derrotas antiguas desde Desfijados, ya que también incluye correcciones. El puntaje se recalcula con el criterio nuevo; por tanto, los puntos anteriores por aparición de Abominaciones/Nigromantes/Bake-Danuki dejan de sumarse y solo cuentan sus derrotas explícitas registradas desde esta corrección. Se conservan cartas, historial y cantidades.

Aún se usan los valores fijos 25/12/5. La fórmula por turnos, sus contadores independientes por forma, el cierre/historial de partidas y la puntuación de enemigos presentes al finalizar siguen pendientes en el punto 28; registrar una tanda de derrota no implementa todavía el cálculo de antigüedad.

Archivos: dist/derrotas.js, puntaje.js, engine.js, reglas-cartas.js, estado.js, app.js e index.html; scripts/preparar.mjs incorpora el nuevo módulo al precache/versionado. Validación: 299/299 pruebas, incluyendo derrotas frente a apariciones, reaparición, corrección, Bake-Danuki con cambio de tipo, descarte/anulación, recarga y fallo de guardado. QA verificar-zonas-pulso.mjs confirma cambios de puntaje en Mumm-Ra/Chimimōryō y exclusión de correcciones; verificar-puntos-derrota.mjs prueba Bake-Danuki, cuota, cantidad generada constante, registro único y recarga offline. Pasan verificar-puntaje.mjs y verificar-reglas-cartas.mjs. Contextos aislados; sin dispositivos físicos.


## Ajustes manuales por tipo · 16/10/2026

Se amplía el panel de puntaje/zombis a tres líneas: Caminantes, Brutos y Corredores. Cada una conserva su propio borrador editable, −1/+1/+5/+10 y Agregar; solo confirmar registra una entrada. Las cantidades variables de objetos/corrupción se ingresan según lo ocurrido en la mesa, sin deducirlas automáticamente ni implementar un contador de corrupción. Ponderaciones: Caminante 3, Bruto 4 y Corredor 4. El historial identifica el tipo.

Esta decisión reemplaza el supuesto previo de que todas las apariciones externas eran Caminantes. Los registros nuevos guardan tipo; los antiguos sin tipo siguen siendo Caminantes, conservando cantidades y puntos sin reescribirlos. Se mantiene la corrección negativa global existente, los límites de enteros y el guardado atómico. Fallo de guardado conserva el borrador y el estado anterior; abrir el panel reinicia los tres borradores a cero.

Implementación: dist/contador-zombis.js valida el tipo opcional y registra los tres tipos permitidos; dist/puntaje.js usa el peso correspondiente; dist/app.js, index.html y style.css muestran las tres líneas y el historial. Sin cambios a apariciones automáticas, reglas de cartas, rondas ni fórmula temporal.

Validado: 297/297 pruebas, con nueva cobertura de ajustes mixtos, corrección, legado sin tipo, rechazo de tipos desconocidos, recarga y fallo de almacenamiento. QA scripts/verificar-ajustes-tipos.mjs: borradores independientes, atajos, teclado, una entrada por confirmación, cantidades/puntos, historial tipado, cuota, cinco tamaños sin desbordamiento, recarga offline. Pasaron las regresiones verificar-puntaje.mjs y verificar-contador-zombis.mjs, adaptando sus selectores al formulario de Caminantes. Capturas ajustes-tipos-*.png. Contextos aislados; sin pruebas en dispositivos físicos.


## Zonas horizontales y pulso de puntaje · 16/10/2026

Aplicado: token estándar, menos, cantidad, más y token del Profanador forman una fila centrada verticalmente respecto de SPAWN, a su derecha. El token del Profanador es un indicador sin botones ni cantidad visible: opaco y gris cuando está ausente, activo cuando está presente. Se conserva el dato interno de zonas y la resolución existente. En partidas legadas el indicador refleja la presencia de zona guardada, sin migrar el estado. Hasta 600 px la fila pasa debajo de SPAWN para mantener controles táctiles y evitar desbordamiento.

Adrenalina conserva el centro de la página y el marcador hasta 300 px ocupa el centro entre ella y Configuración; en pantallas estrechas conserva su disposición debajo de adrenalina. Pulso visual: escala 1 a 1,1 en 750 ms y regreso en otros 750 ms, sin desplazar controles. Se dispara tras retirar normalmente una carta de En juego con guardado correcto, derrotar Mumm-Ra Abominación para invocar su Nigromante, confirmar la reaparición de Chimimōryō o la reubicación de Meng Huo y confirmar la derrota forzada de Chimimōryō. La retirada excepcional de Meng Huo desde su detalle es corrección y no dispara pulso. Tampoco cancelaciones, cerrar mensajes, descartar/regenerar, devolución al mazo ni transformación correctiva de Mumm-Ra. Una nueva animación sustituye a la anterior; movimiento reducido la omite y cancela la que esté en curso.

Solo presentación: no cambia puntajes ni implementa registro de derrotas, rondas, fórmula temporal, cierre o historial de partidas (pendiente 28). Las confirmaciones de reaparición mantienen las cartas en juego y no escriben nuevos eventos.

Verificación: 296/296 pruebas de motor como referencia previa; QA nuevo scripts/verificar-zonas-pulso.mjs en cinco tamaños, alineación de controles y centros, indicador con/sin Profanador, atajos de zonas, tres reglas especiales, cancelación, transformación de corrección, duración/escala reales, movimiento reducido y fallo de almacenamiento sin pulso ni retirada. Pasaron las regresiones verificar-reglas-cartas.mjs y verificar-puntaje.mjs, con recarga/offline y guardado aislado. Capturas zonas-pulso-*.png revisadas en navegador. Sin dispositivos físicos. Archivos de interfaz: dist/index.html, dist/style.css y dist/app.js; recursos PWA regenerados mediante preparar.mjs.


## Propuesta futura registrada: rondas, cierre e historial, 16/10/2026

Nuevo pendiente 28: registro por tipo y turnos de Abominaciones/Nigromantes, cierre con desglose y porcentaje de puntaje perfecto, e historial desde Configuración con rondas y cajas por nombre. Documentado en `PROPUESTA_CIERRE_E_HISTORIAL.md`. No se implementa en este paso; faltan fórmula, convención exacta de intervalos y tratamiento de salidas/cierre. El cálculo actual continúa intacto. Primero acordar/registrar eventos; luego fórmula y finalmente cierre/historial.


## Puntaje y zombis generados, 16/10/2026

Marcador Kang inicial, Dragón y Cabeza seleccionables. Botón y panel usan los recursos/vectoriales del ZIP del usuario; el panel muestra directamente puntaje y zombis, sustituyendo el total oculto anterior. Puntaje por aparición: Caminante/misma prioridad 3, Bruto 4, Corredor 4, Nigromante 12, Abominación 25 y Daily 5; extras manuales actuales y anteriores son Caminantes. Sin multiplicador por adrenalina. Transformaciones, reubicaciones y referencias no puntúan como nuevas apariciones. Detalle en `PUNTAJE.md`. 296/296 pruebas y QA de los tres temas, glifos, cinco tamaños, ajustes agrupados, cuota, guardado y offline. Sin prueba en dispositivos físicos.


## Apariciones adicionales: dos diseños, 15/10/2026

Configuración ofrece Minimalista / Cartas custom, con Minimalista inicial. Referencias de tamaño fijo, cantidad uniforme y texto contenido. PNG originales con +N y zona del enemigo en el pergamino inferior, sin repetir el título. Preferencia visual persistida y aplicada al guardar, sin resolver nuevamente efectos ni modificar contador. Detalle en `APARICIONES_ADICIONALES.md`. 290/290 pruebas y QA de ambos diseños en cinco tamaños, dimensiones comparadas con cartas normales, guardado y carga offline. Sin prueba física.


## Configuración compacta y reposición Daily, 15/10/2026

Dificultad horizontal; modo/reposición en columnas adaptables y tipografía uniforme. Contenido por caja contraído, checkbox general con estado parcial y contador, consulta visual de cada carta. Daily admite reposición al retirarse de En juego, manteniendo unicidad; cambios desde la próxima tanda y guardados anteriores sin conversión. Detalle en `CONFIGURACION_COMPACTA.md`. 289/289 pruebas y QA Chrome de cinco tamaños, guardado y consulta offline; sin prueba en dispositivos físicos.


## Iteración de reglas únicas completada: 15/10/2026

Alcance vigente y decisiones en `REGLAS_CARTAS_UNICAS.md`: Mumm-Ra, Chimimōryō, Meng Huo, Shakōki Dogū y acompañantes de Rakshasa. 284 pruebas aprobadas y QA de navegador en cinco tamaños, recarga y offline. Primer diseño de acompañantes con resúmenes +N; las imágenes de cartas del usuario quedan para comparación posterior. Bestias divinas continúa en espera. El punto 9 conserva revisión individual para otras reglas, sin automatizar movimiento/combate. Este cierre prevalece sobre los alcances históricos inferiores.


## Banderines Daily Spawn en Aparición y Última tanda: 15/10/2026

Pendiente 27 completado. Las siete identidades Daily muestran en la esquina superior izquierda el banderín de su familia de catálogo: Caminante azul, Bruto morado o Corredor ámbar. Se reutilizan recursos y geometría existentes (altura del 20%, margen de 4 px y corrección del lienzo transparente), sin duplicar insignias ni interceptar zoom o controles. Bake-Danuki conserva Caminante en su aparición inicial y el estandarte guardado por dado en su referencia especial final. No se aplica retrospectivamente su última transformación a imágenes de apariciones anteriores.

Solo presentación en miniHTML y cardHTML de Aparición; Historial ordinario conserva su presentación previa y la referencia de Bake-Danuki sigue mostrándose con su resultado histórico. Sin cambios al motor, sorteos, contador de zombis ni guardado. Servidor local reiniciado para revisión en http://127.0.0.1:8080/mazo/.

QA verificar-banderines-daily.mjs: las siete cartas y sus tres familias en las dos vistas, una sola insignia por carta, altura/proporción/posición, cinco tamaños, sin desbordamiento de página, zoom al pulsar sobre banderín, guardado intacto, Bake-Danuki sin zona y con un solo banderín según D6, recarga offline sin resorteo. Pasó también verificar-bake-danuki.mjs: orden final de la animación, historial, anular y recuperación de estandarte. Capturas daily-banderines-*.png. Sin pruebas en dispositivos físicos.

## Patrones de muro desde la puerta: 15/10/2026

Puerta central conservada. Desde la puerta hacia la derecha se repite caldero → liso → torre; desde la puerta hacia la izquierda se repite liso → torre → caldero. Caldero usa Muralla nevada con caldero, antorcha y estandarte-1.png; liso usa Sección de muro nevado liso-2.png; torre conserva Muralla nevada con torre y escalera.png. Tres ciclos por lado cubren el ancho máximo de la aplicación. El lado izquierdo invierte solo la dirección de disposición, no refleja ni deforma las ilustraciones.

Se conserva altura compacta de 37–52 px, la puerta centrada, escala proporcional de cada PNG y alas de igual ancho. Los tramos se anclan al centro y se recortan decorativamente en los extremos según el ancho, sin scrollbar de sección ni desbordamiento de página. Archivos originales preservados; dos recursos añadidos a preparación y precaché offline.

QA verificar-separador.mjs valida orden desde el centro, ciclos, proporciones naturales distintas (2173×724 liso, 2171×724 caldero, 2172×724 torre), uniones de elementos sin huecos, cobertura de ambos lados, centro de puerta, cinco tamaños, offline y guardado intacto. Pruebas de recursos 3/3 con copia idéntica a originales y caché. Capturas muralla-compuesta-*.png. Sin cambios de motor, reglas ni partidas.


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


## Estandartes de caminantes, brutos y corredores: 15/10/2026

Añadidos los tres PNG originales del usuario a las cartas fijadas en juego: azul (Estandarte del caminante zombi.png), morado (Zombi barrigón en estandarte morado.png) y ámbar (Estandarte ámbar del zombi corredor.png). Se reutiliza la presentación de abominaciones/nigromantes: esquina superior izquierda, altura visible del 20%, sin interceptar zoom ni controles. Solo CSS compensa el lienzo transparente medido; no se alteran PNG originales. Recursos y caché offline actualizados.

Para Daily Spawn se usa el tipo de la carta (caminantes/brutos/corredores), no el nombre del mazo Daily. Las variantes catalogadas como caminantes-terrorcota y caminantes-ballesteros usan el estandarte de caminante. No se inventa familia para tipos específicos sin correspondencia, como trepadores. Se conserva prioridad de los mazos de abominaciones y nigromantes. Desfijados sin estandarte; refijar lo restaura. Sin cambios de reglas, motor ni guardado.

QA verificar-distintivos.mjs: cinco familias en cinco tamaños, proporción original intacta y altura del 20%, zoom, desfijar/refijar, Daily de las tres familias y recursos offline. Prueba de recursos 3/3 con comparación de bytes y precaché de los nuevos archivos. Capturas distintivos-*.png en docs/verificacion; sin prueba en dispositivos físicos.


## Separador de puerta y muralla completado: 15/10/2026

Punto 12 completado con las dos imágenes originales del usuario, ambas de 2172×724: Puerta nevada con torres y calderos.png centrada, y Muralla nevada con torre y escalera.png repetida en los tramos izquierdo y derecho. Tres elementos decorativos independientes en Última tanda, con igual escala vertical y laterales de igual ancho; no se superpone una muralla debajo de la puerta. Altura responsive entre 74 y 104 px, sin deformar imágenes, sin interacción ni lectura redundante por accesibilidad. Se preservan archivos anteriores; nuevo contenido de UI y precaché offline actualizado.

Validación: verificar-separador.mjs en 1440/1024/844/390/320 px comprueba centro, proporción, uniones, repetición lateral, ausencia de desbordamiento, separador verde intacto, recarga offline y guardado sin modificaciones. Capturas muralla-compuesta-*.png y separador-muralla-*.png. 3/3 pruebas de recursos, incluidas copias idénticas a originales y rutas de caché. No se alteran motor, reglas ni datos de la partida.


## Contador de zombis generados: 15/10/2026

Punto 13 reformulado e implementado: botón Zombis a la derecha de adrenalina. Abre una ventana con total oculto siempre al abrir y control Mostrar/Ocultar, ajustes individuales −1/+1/+5/+10 e historial manual inverso, con unas cinco filas y scroll. El encabezado no publica el total. No requiere usuarios ni sesiones por jugador; cada pulsación queda como entrada con fecha, tanda y adrenalina, sin subtotal ni acumulado en el historial.

Conteo automático puro desde extracciones vigentes: cantidades numéricas del catálogo según la adrenalina congelada de cada tanda; cada identidad secundaria Daily/abominación/nigromante añade una unidad. No suma activaciones, referencias, descartes ni anulaciones, y retirar una miniatura/fijación no borra un zombi ya generado. Regenerar sustituye el aporte y anular tanda restaura el estado previo, incluidos los ajustes manuales posteriores al respaldo. Ajustes manuales solo corrigen/extras; no se descuentan bajas. Total no negativo. Asedio y otras cantidades no determinadas, acompañantes de reglas especiales y reposiciones como terracota se añaden manualmente: no se infieren reglas desde texto ni se automatiza el punto 9.

Persistencia: campo opcional ajustesZombis validado, guardados existentes sin campo aceptados y sin reinicio/migración destructiva; reconstrucción de totales sin guardar acumulados redundantes ni repetir RNG. Nueva partida reinicia el registro. Usa guardarAccion para guardar atómicamente, manejar cuota y detectar cambios de otra pestaña; respaldo de tanda incluye el registro. Mostrar/Ocultar es presentación local, se restablece a oculto al abrir y al recargar. Los ajustes no alteran catálogos ni mazos. Nuevo contador-zombis.js incluido en caché offline.

Validado: 13 pruebas originales; 264/264 pruebas de proyecto (7 nuevas de conteo, niveles, Daily, activación, regenerar, descartar, anular, validación y persistencia). Chrome en cinco tamaños con total oculto, sumas, corrección, historial scroll, recarga offline y nueva partida; fallo de cuota conserva estado. Regresión de configuración durante partida aprobada, incluidos cambios entre pestañas y anulación. Scripts verificar-contador-zombis.mjs y verificar-configuracion-partida.mjs; capturas contador-zombis-*.png. Sin dispositivos físicos. Estadísticas de eliminados, desgloses e identidades de jugadores no forman parte de esta implementación.


## Prioridad revisada: 15/10/2026

El usuario retira el pendiente 22, deja 5 y 8 en espera y mantiene 12 pendiente. Solicita implementar el contador directo del 13, con total oculto por defecto, ajustes rápidos e historial manual; falta confirmar si se suman automáticamente las cantidades conocidas de las cartas o si toda suma es manual. El detalle vigente está en DECISIONES_PENDIENTES.md. No se implementa corrupción ni Bestias divinas en este alcance.

## Vista de aparición actualizada: 14/10/2026

Punto 26 completado con los originales suministrados: marcador rojo con número blanco centrado sobre cada carta revelada en una zona estándar, y marcador verde sin número sobre las cartas de la zona del Profanador. Las secundarias y referencias de activación conservan el marcador de su zona real, independiente del tipo de enemigo. Misma identificación en Última tanda e Historial. Retirados encabezados textuales, líneas agrupadoras y flecha del nigromante hacia su zona; se conserva la flecha entre carta genérica y enemigo. No cambia el motor ni los datos de partida.

Validación: 13 pruebas originales; comprobación de tokens en cinco tamaños de Chrome, zoom, historial/última tanda, recarga offline y guardado intacto. Capturas en docs/verificacion/tokens-zonas-*.png; script scripts/verificar-zonas.mjs. Sin prueba en dispositivos físicos. Esta presentación prevalece sobre las descripciones históricas de líneas y segunda flecha.


## Correcciones de configuración completadas: 14/10/2026

El usuario corrigió y cerró las decisiones restantes: Personalizado inicial; modos, identidad estándar, selección de cartas y cajas desde próxima tanda; presencia y topes preservados; Kan de respaldo y trofeos excluidos de Estándar; trofeos derrotados no vuelven por desmarcar/remarcar; reinicio único de partidas de prueba anteriores. Fallback de acción fija al completar cupo confirmado. Implementación/contrato y evidencia en `CONFIGURACION_DURANTE_PARTIDA.md`. Este cierre prevalece sobre la decisión anterior de aplicar a nueva partida o conservar partidas de prueba. Corrupción (8), incompatibilidades (22) y tokens (26) siguen fuera de este trabajo.

## Iteración de modos completada: 14/10/2026

El usuario autorizó los puntos 1–13 del listado consolidado del chat y decisiones autónomas. Implementados modos, prioridad y espacio del Profanador, referencia visual de activación, zona propia diferida, azar y topes solo en Personalizado. Partidas anteriores preservadas; cambios de modo desde nueva partida. 236 pruebas y QA en cinco tamaños con recuperación offline, más regresiones de interfaz general, Daily por adrenalina y zonas legadas. Decisiones con pregunta/opción elegida y detalle funcional en `docs/ITERACION_MODOS_ENEMIGOS.md`; cierre en `IMPLEMENTACION_ACTUAL.md`.

Pendientes del registro completados: 16, 17, 19, 20 y 21; 18 absorbido. Quedan fuera corrupción (8, incorpora 23), revisión de abominaciones incompatibles (22), tokens (26), y 5, 6, 9, 12 y 13. El siguiente trabajo requiere indicación del usuario. Este cierre prevalece sobre los alcances históricos inferiores.

## Actualización documental: 14/10/2026

Pendiente 26 añadido: tokens sobre las cartas de SPAWN, estándar con número central y token de nigromante para la zona del Profanador; implementación visual posterior, recursos/dimensiones por definir. En Nigromantes Personalizado, Al azar excluye acciones con spawn al completar el cupo y sortea uniformemente entre las dos acciones de activación; el eventual 50% por cada adicional sigue siendo un segundo sorteo independiente. No cambia acciones fijas ni se implementa todavía. El 18 se integra en modos, el 23 en corrupción (8), y el 25 se retira junto al 24. Este registro prevalece sobre la revisión histórica inferior.

## Revisión de reglas registrada: 13/10/2026

El usuario solicitó agregar a pendientes el contraste entre las reglas compartidas y la aplicación, ordenado por prioridad de revisión. Los puntos 16–23 y 25 de `DECISIONES_PENDIENTES.md` cubren, en ese orden: prioridad/gestión del Profanador, zonas exclusivas del Profanador, resolución de acciones, Abominaciones normal, Festival, topes como regla de casa, compatibilidad de abominaciones, corrupción y Almenara. El usuario retiró el punto 24 y la revisión de nigromantes incompatibles del 22, aclarando que no se hicieron cartas para ellos. Se conserva la numeración existente. Se incluyen las decisiones abiertas de composición del mazo del Profanador y colocación/persistencia/retirada de sus zonas. Son revisiones pendientes; no se autorizó implementarlas.

Antes de implementar el punto 8, revisar zonas y evento de corrupción (17 y 23): el +1 por SPAWN propuesto anteriormente no equivale automáticamente a la entrada en una zona física sin corrupción. Los cierres inferiores siguen siendo evidencia del comportamiento construido, no certifican correspondencia con el reglamento recién compartido. Esta actualización es documental; no cambia código, datos, Excel, guardados ni el servidor local.

## Iteración completada: 13/10/2026

Implementados únicamente los puntos 1 a 3 del listado vigente de `docs/DECISIONES_PENDIENTES.md`:

1. Daily Spawn y configuración: probabilidad general, incremento por carta/tanda, enemigos únicos y persistencia compatible.
2. Spawns de expansiones con datos completos en el Excel; no habilitar Bestias divinas Aparición mientras falten sus datos.
3. Unificación visible de Fácil / Estándar según Excel, preservando compatibilidad con campos históricos.

Validación: 165 pruebas automatizadas, navegador en cinco tamaños y recuperación offline. Adrenalina, corrupción, reglas por carta única, limitadores, estadísticas y ajustes visuales siguen para etapas posteriores.

## Próxima iteración: alcance acordado, definiciones pendientes

El usuario seleccionó los puntos **4, 7, 8, 10, 11 y 14** del listado vigente: limitadores, selector de nivel de adrenalina, contador de corrupción, flecha adicional, agrupación visual por zona y revisión del margen superior de cartas con marco. Posteriormente añadió la implementación del punto **15**, con enfoque nuevo: base e incremento de Daily Spawn configurables por nivel de adrenalina, sustituyendo la condición de primera rotación.

Punto 15 completado: cuatro pares editables de base/incremento, modos carta/tanda y nivel congelado por tanda. El usuario confirmó conservar los puntos acumulados al cambiar de adrenalina, sumándolos a la nueva base; cada aparición reinicia el aumento y la tasa efectiva no supera el 100%. Los aportes conservan el incremento del nivel en que ocurrieron. Nuevos perfiles aplicados a una nueva partida; las partidas anteriores mantienen su tasa general y bytes al leer. Pasaron 186 pruebas y QA de Daily por nivel, Daily general, selector de adrenalina e interfaz general, con cinco tamaños y recarga offline. Sin pruebas en dispositivos físicos.

El punto 7 quedó confirmado e implementado: selector compacto en la parte superior central de la pantalla principal, título «Nivel de adrenalina», nombre blanco sobre fondo del color elegido y flechas izquierda/derecha. Partida nueva en Azul, persistencia local y extremos sin navegación circular. No accesible en Aparición y sin aumentos automáticos durante SPAWN. Nivel congelado por tanda; anular restaura el anterior a SPAWN. Guardados previos sin nivel siguen intactos y muestran Azul. Su cierre registró 173 pruebas y QA de navegador en cinco tamaños, incluida recarga offline; posteriormente se integraron Daily del punto 15 y topes del punto 4.

Punto 4 completado: límites exclusivamente por adrenalina, con cuatro topes independientes por familia y sin modo manual. Defaults confirmados: nigromantes 1/1/2/2 y abominaciones 1/2/3/4. Perfil editable de enteros positivos no decrecientes de Azul a Rojo; un ajuste inválido se rechaza sin modificar los otros colores. Al alcanzar el tope, el spawn se convierte en activación adicional sin consumo secundario ni nueva zona. Ajustes aplicados desde la próxima tanda; snapshot de sus topes conservado para elecciones tardías y regeneraciones. La presencia existente se conserva si el perfil editado o un retroceso de adrenalina deja el tope por debajo de ella.

Pasaron 203 pruebas, 17 nuevas sobre límites, y QA de topes en cinco tamaños, incluido offline, cuota, pestañas y adopción de guardados anteriores. Pasaron también QA de Daily por nivel, interfaz general y devolución/trofeos. El punto 4 no automatiza excepciones de cartas únicas: Mumm-Ra y otras identidades se abordarán en el punto 9 con condiciones/fuentes confirmadas.

Puntos 10, 11 y 14 completados: segunda flecha nigromante → nueva zona, agrupación con un título y línea inferior compartidos, nombres derivados calculados sin modificar IDs/etiquetas guardados y reserva superior ajustada según marco en el CSS activo. Se conservan las imágenes completas de 155 px, marcos, revelación progresiva y controles. Pasaron 211 pruebas (ocho nuevas), QA de zonas y marcos en cinco tamaños, revelación, límites, Daily por adrenalina e interfaz general, con recuperación offline y guardado intacto al renderizar. Sin pruebas en dispositivos físicos. De esta iteración queda el 8; definir reinicio/anulación del contador de corrupción antes de implementarlo.

Aceptación de esta iteración: no añadir enemigos por encima del límite; conservar los ya presentes; probar topes por adrenalina, nivel, Daily por nivel, reinicio, cadenas, cancelaciones, guardado y compatibilidad. Corrupción aumenta una vez por SPAWN con un nigromante ya en juego; definir reinicio y reversión al anular. Flechas y agrupación conservan IDs, relaciones y consumos. Revisar el margen superior en la versión activa antes de decidir un ajuste; comprobar los cambios visuales en teléfono horizontal/vertical y tablet. Estadísticas y reglas por identidad siguen fuera de alcance.

Para Bestias divinas, solicitar los datos faltantes antes de habilitar Aparición. Para reglas especiales, seleccionar las cartas a automatizar y confirmar sus fuentes/efectos; una marca de Excel no basta para declarar la regla programada.

## Etapa 0 · Base transferida

Leer código completo y documentación. Ejecutar las 13 pruebas existentes. Crear el proyecto de trabajo con copia de la base, manteniendo `base-web/` como referencia. Separar progresivamente módulos y datos, conservar IDs/formato compatible y el diseño.

Salida: mazo base, contadores, tandas, descartes/reemplazos, fijados/desfijados, historial y guardado recuperables. Probar servicio local, subruta de publicación, offline y recuperación. Preparar workflow estático sin activarlo ni publicar.

## Etapa 1 · Catálogo y referencias

Importar el inventario con estado de revisión. Mazo base confirmado; los demás incompletos no entran en el sorteo. Añadir secciones desplegables por Juego/Core/Expansión/Tipo, referencias `ⓘ`, originales/traducciones y vínculos de ayuda editables.

Pedir solo cantidades, procedencia y asociaciones necesarias. Completar expansión por expansión cuando los datos estén confirmados. No esperar a tener todos los juegos para terminar una primera expansión.

Salida: catálogo extensible, selección aplicable a nueva partida y referencias offline. Base sigue igual con su configuración actual.

## Etapa 2 · Abominaciones

Cerrar D01–D05, D08 y política de cancelación aplicable. Implementar catálogo/mazo secundario, presencia, modalidades, selección y representación sin añadir spawn. No automatizar reglas particulares que aún solo existen en imágenes.

Salida: primera carta selecciona enemigo, presencia cambia la resolución siguiente, elegir no consume dos veces, regenerar/descartar anula su selección/derivadas según decisión confirmada. Recuperación mantiene elecciones y fijados.

## Etapa 3 · Nigromantes

Flujo común cerrado e implementado el 8/10/2026: presencia por fijados, botones superpuestos, origen conservado y secundaria añadida. Todo nigromante nuevo, incluso el primero, auto-fija, aporta zona y roba general inmediatamente. Orden Zona 2/2-2/2-3; contador verde siempre igual a fijados válidos. Cadenas avanzan mediante elección; anulación por IDs de origen.

Salida: orden correcto, una sola aportación por spawn generado, selección secundaria independiente, anulación de descendientes sin tocar otros orígenes, recuperación sin nuevos robos. Política recursiva explícita y probada.

## Etapa 4 · Evolución posterior

Reposición avanzada y pesos variables de secundarios; especiales probabilísticos; comportamientos especiales verificados; nuevas dificultades; respaldos/editor de catálogo si se solicitan. El selector de adrenalina ya está implementado en el punto 7 de la iteración actual.

Diseñar cada funcionalidad con casos concretos antes de implementarla. Un modo avanzado no sustituye el general físico ni reactiva compensaciones por dificultad.

## Forma de trabajar

- Completar una capa funcional y verificable antes de agregar la siguiente.
- Resolver elecciones técnicas rutinarias sin entrevistas; preguntar reglas que cambien el juego.
- No dejar botones visuales que parezcan funcionales si su motor no existe.
- Al terminar cada capa: qué cambió, pruebas realizadas y pendientes concretos.
- Mantener commit o checkpoint local por etapa cuando haya repositorio de trabajo; no publicar por efecto lateral de preparar un workflow.

## Cierre de publicación

Cuando el usuario autorice GitHub/GitHub Pages, usar nombre/visibilidad de repositorio acordados, revisar rutas/base, activar Actions y publicar. No trasladar configuración privada de Sites. Los datos locales de una partida pertenecen al dominio del navegador y requieren exportación/importación para una migración.
