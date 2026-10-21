# Implementación actual

## Recuperación de paquete offline · 21/10/2026

Incidente reportado con internet: pantalla Recurso offline no disponible. Condición reproducida con worker anterior y paquete ausente; causa específica en tablet no confirmada. Página autónoma `recuperar.html`, reparación de misma versión sin mezclar módulos ni borrar datos, explicación de recuperación sin red y verificación de versión durante instalación. 398 pruebas de aplicación y 13 originales, QA del rescate desde worker anterior y regresión de actualización aprobados. Versión `257f0abfd06e07b6`. Detalle: [RECUPERACION_OFFLINE.md](RECUPERACION_OFFLINE.md).

## Máximo Daily por tanda · 21/10/2026 · Publicación autorizada

Daily Spawn incorpora máximo general o por nivel, vacío sin límite, aplicable a independiente e integrado. Cupo congelado por tanda, pausa de intentos/incrementos, cancelación/regeneración y registro preservados; historial y configuraciones existentes sin máximo se conservan. 398 pruebas de aplicación y 13 originales, QA de Daily/Configuración/Especial y offline aprobados. Versión `20323e0d95b5b4e2`. El usuario autorizó subir y apagar el equipo tras verificar la publicación. Detalle: [DAILY_LIMITES.md](DAILY_LIMITES.md).

## Publicación del lote autorizada · 21/10/2026

El usuario autorizó subir a GitHub el lote local acumulado: lanzadores, feedback de mesa, registro exportable, actualización desde General, etiquetas Base/Avanzado, destinos y cantidades del Core/expansiones y nuevos valores iniciales. Esta autorización sustituye las indicaciones de mantenerlo local que figuran en los apartados históricos inferiores. Se utiliza `main` y su workflow existente de pruebas y publicación en Pages. Validación local vigente: 390 pruebas de aplicación y 13 originales; QA descrito en los documentos de cada ajuste. Versión preparada `1a752bc0680f2356`.

## Comunes y activaciones configurables; nuevos valores iniciales · 21/10/2026 · Solo local

Destino y copias incluye Caminantes, Brutos, Corredores y sus activaciones adicionales en los dos modos de Especial. General y cantidades originales por defecto; grupos de activación separados, variantes/filtros conservados, motor excluido, historial y anulación preservados. Arranque sin configuración: puntaje oculto y cartas de acompañantes, conservando preferencias existentes. 390 pruebas de aplicación y 13 originales, QA de Especial/defaults e imágenes/zoom aprobados. Versión `1a752bc0680f2356`. Mantener local, sin publicar. Detalle vigente al inicio de [SPAWN_ESPECIAL.md](SPAWN_ESPECIAL.md).

## Destinos en Cartas Spawn especial · 21/10/2026 · Solo local

Mazos → Mazo general y mazo especial → Cartas Spawn especial permite elegir General/Especial por set y por carta, igual que la modalidad probabilística. Copias es el total configurado por carta: 6 → 8 significa ocho copias, no catorce. Destinos y composición se adoptan en la próxima tanda; se conserva el historial y la anulación. Configuraciones anteriores de disparadores mantienen su interpretación hasta guardar las nuevas opciones mediante la marca explícita `destinosEnDisparadores`. Daily integrado conserva su destino especial. 384/384 pruebas aprobadas; QA de destinos por grupo/carta, caso mixto, cantidad ocho, próxima tanda, cinco tamaños, cuota y recuperación offline. Versión local `e99c54d147b880c7`. No subir a GitHub.

## Feedback de tablet y registro · 21/10/2026 · Solo local

Insignia histórica de adrenalina en Aparición; botones Ver/Ampliar/Desfijados junto a sus títulos; nueva partida exclusivamente en General. Registro exportable de cambios guardados con timestamps, conservado al anular y sin reconstruir actividad anterior. Actualización manual espera la disponibilidad de la versión instalada. Usuario confirma pantalla encendida en tablet. Mantener este lote y los lanzadores locales sin subir a GitHub. Detalle y validación: [FEEDBACK_LOCAL_REGISTRO_Y_ADRENALINA.md](FEEDBACK_LOCAL_REGISTRO_Y_ADRENALINA.md).

## Autorización de carga conjunta · 21/10/2026

El usuario autorizó subir el lote de pantalla principal compacta y selector por iconos a GitHub. Sustituye la indicación anterior de mantenerlo solo local. Se conserva el workflow de pruebas y publicación automática en `main`; no se añaden otros cambios funcionales.

## Pantalla principal e iconos · 21/10/2026 · Solo local, sin subir

Selector cíclico por iconos en Aparición; pantalla principal compacta con Historial agrupado, adrenalina sobre contador, En juego primero con muralla y Última tanda plegable después con corrupción. Última tanda cerrada inicialmente; Ver cartas disponible. Barra/rótulos secundarios retirados visualmente, estados internos conservados. Zoom principal independiente 75–125 %, 5 %, controles táctiles y diálogos sin escalar. 376 pruebas y QA de cinco tamaños/escalas, guardado/offline, iconos, marcos, exportación y pantalla completa aprobados. **El usuario pidió no subir a GitHub todavía; esperar autorización para una carga conjunta.** Detalle: [PANTALLA_PRINCIPAL_COMPACTA.md](PANTALLA_PRINCIPAL_COMPACTA.md).

## Aparición: vistas y detalles · 21/10/2026

Acciones cuadradas con tamaño táctil constante, Anular tanda en cabecera, selector Adaptativa/Horizontal/Vertical y botón ⓘ para detalles históricos de Daily Spawn/Spawn especial y resultados. Nombres inferiores retirados solo de Aparición. Vista guardada en dispositivo, independiente de la partida; detalles ocultos inicialmente. No cambia sorteos ni reglas y conserva reserva uniforme de marcos. 376 pruebas y QA de tres modos/cinco tamaños, cinco escalas, anulación del formato vigente, probabilidades por carta/tanda, marcos y offline aprobados. Publicación autorizada para revisión en tablet. Detalle y límite del verificador histórico: [APARICION_VISTAS_Y_DETALLES.md](APARICION_VISTAS_Y_DETALLES.md).

## Aparición compacta y General · 20/10/2026

Encabezado compacto, explicación permanente retirada y reserva uniforme de marcos reducida a 36/40 px manteniendo cartas de 155 px al 100 %. Escala de Aparición 75–125 %, pasos de 5 %, controles táctiles conservados. Nueva pestaña General: actualización directa con descripción lateral y preferencia de pantalla encendida con detección de soporte, estados y recuperación al volver a la página. No cambia partidas ni reglas. 373 pruebas y QA de Configuración, actualización, marcos y seis tamaños con copia aislada de la partida facilitada, incluido offline. Wake lock simulado; validación física pendiente. Publicación autorizada. Detalle y propuestas futuras: [COMPACTACION_APARICION_Y_GENERAL.md](COMPACTACION_APARICION_Y_GENERAL.md). Este traslado de actualización prevalece sobre su ubicación anterior en Apariencia.

## Subida autorizada · 20/10/2026

El usuario autorizó subir la exportación JSON y el control de actualización desde Apariencia al repositorio conectado, rama `main`, con publicación automática mediante el workflow existente. Las secciones siguientes registran las verificaciones locales previas. No se implementan propuestas de compactación, zoom ni cambio de orden de secciones. Los datos guardados en localhost y Pages siguen separados por origen.

## Actualización desde Apariencia · 20/10/2026 · Local

Configuración → Apariencia → Actualizar aplicación incorpora Buscar y aplicar actualización. Comprueba explícitamente el service worker, espera la descarga y aplica la versión completa recargando solo esta pestaña, sin cerrar Configuración previamente. Bloquea la aplicación si hay borradores sin guardar, almacenamiento bloqueado u otros diálogos abiertos; revalida esas condiciones al terminar la búsqueda. Informa ausencia de cambios, falta de conexión y fallo recuperable de descarga. Conserva el aviso de actualización anterior y la protección de otras pestañas. 369/369 pruebas actuales y QA de actualización ampliado: búsqueda/descarga/aplicación en una pulsación, versión ya pendiente, cinco tamaños, borradores, dos pestañas, offline y descarga fallida, sin pérdida de partida. Sin dispositivo físico ni publicación. Para acceder por primera vez al botón debe cargarse esta versión usando el mecanismo de actualización anterior.

## Exportación de partida y configuración · 20/10/2026 · Local

Historial incorpora Exportar partida (JSON): estado completo, configuración vigente/pendiente, versión, fecha y referencias de catálogo, sin imágenes embebidas ni envíos externos. No modifica la partida; rechaza formato inválido o conflicto de pestaña y funciona offline. No incluye borradores, importación ni acciones físicas sin registrar. 369/369 pruebas actuales y 13/13 originales; descarga real, cinco tamaños, cuota sin escrituras, conflicto y recarga offline verificados en Chrome. Sin tablet física ni publicación. Uso, límites y propuestas de compactación aún sin implementar en [EXPORTACION_Y_FEEDBACK_PRIMERA_PARTIDA.md](EXPORTACION_Y_FEEDBACK_PRIMERA_PARTIDA.md).

## Pantalla completa · 19/10/2026

Botón junto a Configuración para entrar/salir de pantalla completa mediante un gesto del usuario. Cambia su icono y nombre accesible, refleja salidas realizadas desde el navegador y mantiene los controles táctiles de al menos 44 px. La solicitud utiliza el documento completo para conservar acceso a diálogos. No guarda preferencias ni modifica la partida, no se activa automáticamente al abrir y no fuerza la instalación de la PWA. Si falta soporte o el navegador rechaza la solicitud, muestra un aviso recuperable. Compatibilidad por detección de API estándar/WebKit.

Verificación: scripts/verificar-pantalla-completa.mjs comprueba entrada/salida real en Chrome, salida externa, Configuración dentro de pantalla completa, cinco tamaños sin solapes, API no permitida, rechazo, variante WebKit simulada, guardado intacto y recarga offline. Regresiones de vista de mesa y Configuración aprobadas; capturas de tablet y teléfono revisadas. Sin verificación en el tablet físico ni en Safari real. El nuevo módulo se incluye en el paquete offline.

## Revisión de claridad · 19/10/2026

Textos de configuración y avisos revisados para explicar los mazos, topes, intentos, porcentajes y tandas sin depender del desarrollo. Ajustes solo de presentación; reglas, valores internos y guardados conservados. Ejemplos, alcance y propuestas separadas en [REVISION_TEXTOS_INTERFAZ.md](REVISION_TEXTOS_INTERFAZ.md).

## Corrección de Revelación · 19/10/2026

Personalizado utiliza únicamente los controles nuevos Siempre / Por probabilidad / Nunca. Retirados «Configurar acciones independientes» y «Combinación anterior». «Calcular por: Independiente / Todos juntos» pertenece solo a activación adicional de abominaciones y otros nigromantes, excluyendo al Profanador. Perfiles guardados e historial conservados; perfiles futuros ausentes se completan al guardar configuración o al siguiente SPAWN. Este cierre sustituye las notas anteriores sobre mantener ambas alternativas. Detalle: [REVELACION_ACCIONES_INDEPENDIENTES.md](REVELACION_ACCIONES_INDEPENDIENTES.md).

## Revelación con acciones independientes · 19/10/2026 · Implementado localmente

Título, introducción y condiciones plegables; acciones Siempre/Por probabilidad/Nunca para Profanador, otros nigromantes y Spawn, con aumento y máximo de Spawn. Un bloqueo ya no fuerza una activación al utilizar el perfil nuevo. Primera aparición y modos fijados se conservan. Nuevos perfiles opcionales y resultados persistidos, sin conversión automática de guardados. Abominaciones tiene esquema equivalente. «Calcular por: Independiente / Todos juntos» define el sorteo de activación de los otros nigromantes y las abominaciones; el Profanador permanece separado. 364 pruebas y QA de configuración/revelación en cinco tamaños, guardado y offline. Detalle: [REVELACION_ACCIONES_INDEPENDIENTES.md](REVELACION_ACCIONES_INDEPENDIENTES.md). Sin publicar.

## Reglas de consulta plegables · 19/10/2026 · Local

La ficha del Profanador queda inicialmente contraída con «Ver reglas: nigromante profanador». Las consultas de nigromantes añaden «Ver reglas: jugar con varios nigromantes» y las de abominaciones «Ver reglas: Festival de abominaciones», ambos contraídos. Texto suministrado por el usuario, con palabras partidas por salto de línea reunidas. Disponible en consulta y detalle de carta mediante el render compartido. No altera modos, sorteos, guardado ni automatiza Corrupción/movimiento/combate. Sustituye la nota histórica de Profanador mostrado directamente. QA de reglas core: todos los enemigos, apertura/cierre, listas, cinco tamaños, almacenamiento intacto y offline. Sin publicar.

## Ajustes de configuración y porcentaje Daily · 19/10/2026 · Local

Nombres de mazos y Cartas Spawn especial, cantidades plegables con consulta de imagen, máximo general sin columna de límites por adrenalina, descripción de modo/funcionamiento/reposición y elegibilidad Daily seleccionable. Cambiar de adrenalina mantiene el porcentaje actual; el incremento usa el nivel de la tanda y la base cambia al aparecer Daily. 341 pruebas y QA en cinco tamaños, guardado y offline. Sin publicar. Detalle y alcance histórico: [AJUSTES_CONFIGURACION_Y_DAILY.md](AJUSTES_CONFIGURACION_Y_DAILY.md).

## Actualización visible y Death Notes · 19/10/2026 · Local, sin publicar

Aviso fijo «Nueva versión disponible» con «Actualizar ahora», protección de paneles y guardado, recarga de la pestaña solicitante y conservación del paquete de las demás pestañas. Comprobación al abrir/volver/conectar y cada cinco minutos de uso visible. Death Notes pasa de ayuda a nigromante seleccionable de Frozen Fortress, una copia, conservando ID e imagen; ruido/daño en mesa. Los guardados anteriores conservan su selección y composición. Este cierre sustituye las referencias históricas inferiores a Death Notes pendiente y a cierre obligatorio de ventanas para futuras actualizaciones. Detalle y validación: [ACTUALIZACION_Y_DEATH_NOTES.md](ACTUALIZACION_Y_DEATH_NOTES.md).

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


## Publicación beta en GitHub Pages · 16/10/2026

Publicada [Zombicide: White Death — Deck Manager](https://hector-xlsx.github.io/white-death-deck-manager/) desde el repositorio público `Hector-xlsx/white-death-deck-manager`. Nombre solicitado y etiqueta robots `noindex, nofollow` incorporados. Versión `ada49f64804d89a4`, commit desplegado `ccba96a`, ejecución Actions `38983701923`: preparación y publicación aprobadas, incluidas 13 pruebas originales y 305 actuales en Linux. QA local previo de subruta exacta en cinco tamaños, persistencia/offline y actualización con pestañas abiertas. Fuente Pages corregida por el usuario a GitHub Actions; el workflow sigue siendo manual. Evidencia, validación del sitio y límites en [PUBLICACION_GITHUB.md](PUBLICACION_GITHUB.md). No cambian reglas ni partidas.

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


## Puntaje y zombis generados, 16/10/2026

Marcador Kang inicial, Dragón y Cabeza seleccionables. Botón y panel usan los recursos/vectoriales del ZIP del usuario; el panel muestra directamente puntaje y zombis, sustituyendo el total oculto anterior. Puntaje por aparición: Caminante/misma prioridad 3, Bruto 4, Corredor 4, Nigromante 12, Abominación 25 y Daily 5; extras manuales actuales y anteriores son Caminantes. Sin multiplicador por adrenalina. Transformaciones, reubicaciones y referencias no puntúan como nuevas apariciones. Detalle en `PUNTAJE.md`. 296/296 pruebas y QA de los tres temas, glifos, cinco tamaños, ajustes agrupados, cuota, guardado y offline. Sin prueba en dispositivos físicos.


## Apariciones adicionales: dos diseños, 15/10/2026

Configuración ofrece Minimalista / Cartas custom, con Minimalista inicial. Referencias de tamaño fijo, cantidad uniforme y texto contenido. PNG originales con +N y zona del enemigo en el pergamino inferior, sin repetir el título. Preferencia visual persistida y aplicada al guardar, sin resolver nuevamente efectos ni modificar contador. Detalle en `APARICIONES_ADICIONALES.md`. 290/290 pruebas y QA de ambos diseños en cinco tamaños, dimensiones comparadas con cartas normales, guardado y carga offline. Sin prueba física.


## Configuración compacta y reposición Daily, 15/10/2026

Dificultad horizontal; modo/reposición en columnas adaptables y tipografía uniforme. Contenido por caja contraído, checkbox general con estado parcial y contador, consulta visual de cada carta. Daily admite reposición al retirarse de En juego, manteniendo unicidad; cambios desde la próxima tanda y guardados anteriores sin conversión. Detalle en `CONFIGURACION_COMPACTA.md`. 289/289 pruebas y QA Chrome de cinco tamaños, guardado y consulta offline; sin prueba en dispositivos físicos.


## Reglas por carta única, 15/10/2026

Implementados Mumm-Ra en sus dos formas (transformación diferida, unicidad vinculada, derrota y corrección), avisos de reaparición de Chimimōryō y Meng Huo, acompañantes por tipo de Shakōki Dogū y +3 Caminantes de Rakshasa. Las referencias finales no tienen zona ni activación. Los acompañantes se suman al contador, con cancelación/regeneración y guardado atómico. Las transformaciones específicas pueden superar topes; las apariciones normales siguen limitadas por la presencia resultante. Bestias divinas permanece en espera.

Contrato y decisiones en `REGLAS_CARTAS_UNICAS.md`. 284/284 pruebas (12 nuevas); QA Chrome en cinco tamaños, historial, diálogos, recarga y offline con partidas aisladas. Metadatos JSON actualizados solo para el alcance implementado; Excel e imágenes originales intactos. Sin comprobación en dispositivos físicos.


## Banderines Daily Spawn en Aparición y Última tanda: 15/10/2026

Pendiente 27 completado. Las siete identidades Daily muestran en la esquina superior izquierda el banderín de su familia de catálogo: Caminante azul, Bruto morado o Corredor ámbar. Se reutilizan recursos y geometría existentes (altura del 20%, margen de 4 px y corrección del lienzo transparente), sin duplicar insignias ni interceptar zoom o controles. Bake-Danuki conserva Caminante en su aparición inicial y el estandarte guardado por dado en su referencia especial final. No se aplica retrospectivamente su última transformación a imágenes de apariciones anteriores.

Solo presentación en miniHTML y cardHTML de Aparición; Historial ordinario conserva su presentación previa y la referencia de Bake-Danuki sigue mostrándose con su resultado histórico. Sin cambios al motor, sorteos, contador de zombis ni guardado. Servidor local reiniciado para revisión en http://127.0.0.1:8080/mazo/.

QA verificar-banderines-daily.mjs: las siete cartas y sus tres familias en las dos vistas, una sola insignia por carta, altura/proporción/posición, cinco tamaños, sin desbordamiento de página, zoom al pulsar sobre banderín, guardado intacto, Bake-Danuki sin zona y con un solo banderín según D6, recarga offline sin resorteo. Pasó también verificar-bake-danuki.mjs: orden final de la animación, historial, anular y recuperación de estandarte. Capturas daily-banderines-*.png. Sin pruebas en dispositivos físicos.


## Barra del mazo por adrenalina: 15/10/2026

La barra de cartas restantes usa el mismo color del selector de adrenalina: Azul, Amarillo, Naranja o Rojo. El ancho sigue indicando disponibilidad del mazo. Verificado en Chrome con contexto aislado: los cuatro colores calculados coinciden con el selector y el color del nivel se recupera al recargar. No cambia cálculo de disponibilidad ni reglas.

## Patrón simétrico de muro: 15/10/2026

Puerta central conservada. Ambos lados repiten caldero → torre desde el centro hacia afuera, sin tramo liso en la secuencia. Cinco ciclos por lado garantizan cobertura del ancho máximo. Izquierda y derecha tienen las mismas piezas, escala y distancia a la puerta; se conserva altura compacta de 37–52 px y recursos originales.

Verificar-separador.mjs comprueba orden, cobertura, uniones y simetría geométrica de cada tramo en cinco tamaños; offline y partida intacta aprobados. Capturas muralla-compuesta-*.png. Esta secuencia sustituye la anterior de tres tramos distintos por lado.


## Galería En juego centrada: 15/10/2026

El conjunto de cartas se centra vertical y horizontalmente dentro del área disponible de la ventana mediante align-content/justify-content safe center. Si el zoom o la cantidad supera el espacio, el eje correspondiente vuelve a inicio para conservar acceso a todas las cartas mediante desplazamiento, sin ocultar las primeras fuera del área alcanzable. Cabecera y controles permanecen arriba.

QA verificar-galeria-en-juego.mjs ampliado con medición de centro en ambos ejes y de primeros extremos accesibles al desbordar, a 50/100/200% y en cinco tamaños; regresión de controles, zoom, varias filas, offline, partida intacta y sincronización entre pestañas aprobada. Solo CSS, sin cambios en reglas ni guardado.


## Patrones de muro desde la puerta: 15/10/2026

Puerta central conservada. Desde la puerta hacia la derecha se repite caldero → liso → torre; desde la puerta hacia la izquierda se repite liso → torre → caldero. Caldero usa Muralla nevada con caldero, antorcha y estandarte-1.png; liso usa Sección de muro nevado liso-2.png; torre conserva Muralla nevada con torre y escalera.png. Tres ciclos por lado cubren el ancho máximo de la aplicación. El lado izquierdo invierte solo la dirección de disposición, no refleja ni deforma las ilustraciones.

Se conserva altura compacta de 37–52 px, la puerta centrada, escala proporcional de cada PNG y alas de igual ancho. Los tramos se anclan al centro y se recortan decorativamente en los extremos según el ancho, sin scrollbar de sección ni desbordamiento de página. Archivos originales preservados; dos recursos añadidos a preparación y precaché offline.

QA verificar-separador.mjs valida orden desde el centro, ciclos, proporciones naturales distintas (2173×724 liso, 2171×724 caldero, 2172×724 torre), uniones de elementos sin huecos, cobertura de ambos lados, centro de puerta, cinco tamaños, offline y guardado intacto. Pruebas de recursos 3/3 con copia idéntica a originales y caché. Capturas muralla-compuesta-*.png. Sin cambios de motor, reglas ni partidas.


## Ficha de acceso al contador de zombis: 15/10/2026

El botón situado a la derecha de adrenalina usa el PNG original Ficha circular de horda zombi.png, conservado sin editar, a 64×64 px y object-fit:contain. Sustituye el texto Zombis/Ver contador; mantiene nombre accesible y tooltip Contador de zombis generados, foco y área táctil de 64 px. Incorporado a preparación y caché offline. Sin cambios al conteo ni al registro de ajustes.

Verificación de contador ampliada: decodificación y proporción de la ficha en cinco tamaños, apertura y flujo completo de ajustes, sin overflow de página y recarga offline; capturas contador-icono-*.png. Pruebas de recursos 3/3 con copia idéntica al original y precaché.


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


## Marcos corregidos del ZIP: 15/10/2026

Integrados los PNG originales marco_abominacion.png y marco_nigromante.png de recursos/Imagenes generales/marcos_corregidos_280x437/. Se conserva el ZIP y sus siete archivos (PNG, SVG, instrucciones y comprobación) sin alterar los originales anteriores. Se eligió PNG: 1120×1748, transparencia, unos 0,50/0,59 MB; los SVG contienen imagen rasterizada incrustada y pesan unos 2,37/2,23 MB, sin ventaja para estos tamaños.

Abertura centrada de 560×874 en (280,437), marco al 200% con proporción 280:437 y centro al 50% en ambos ejes. Sustituye los ajustes 152%/142% y las compensaciones de centro anteriores. Se respeta la proporción del área interior de la carta sin que el borde de 1 px del botón la deforme; ancho exterior conservado en 155 px en Aparición y 104 px en Última tanda. Recursos nuevos incorporados a preparación y caché offline. Sin cambios de motor, cartas ni guardados.

QA scripts/verificar-marcos.mjs comprueba los cuatro bordes de abertura contra carta (tolerancia 0,15 px), transparencia, dimensiones PNG, adornos visibles sin solaparse con tokens/botones, filas mixtas, ambos marcos y cinco tamaños, zoom y recarga offline. Pasó verificar-activacion-sin-zona.mjs para ambas familias, gris y token. Prueba de recursos actualizada a las rutas nuevas, manteniendo comparación de bytes con originales. Capturas marcos-aparicion-*.png y marcos-ultima-tanda-*.png; sin dispositivos físicos. Esta sección prevalece sobre las calibraciones históricas inferiores.


## Gris de cartas originales resueltas: 14/10/2026

Por confirmación del usuario, la carta genérica original y su token quedan grises y al 75% de opacidad tanto si generan spawn como si resuelven solo activación adicional. Las cartas representativas del enemigo activado conservan color, marco y sello, sin token de zona. Se aplica en Aparición, Última tanda e Historial mediante las clases de presentación existentes; no cambia el motor ni los resultados guardados.

Validación ampliada en scripts/verificar-activacion-sin-zona.mjs: Abominaciones/Nigromantes en Estándar y Festival/Varios, solo activación y activación más spawn; original y token grises, referencia a color, alineación en cinco tamaños y recarga intacta. Este criterio sustituye la distinción anterior que coloreaba el origen de activación.


## Activaciones de abominación y nigromante sin zona: 14/10/2026

Las referencias visuales de activación adicional de abominaciones y nigromantes (referenciaActivacion y mazo abominaciones/nigromantes) ya no muestran token de zona, en Aparición, Última tanda e Historial. Conservan carta, sello de activación y espacio vacío de 54/36 px para no alterar las filas. Las apariciones nuevas y las cartas genéricas conservan su token; las referencias de activación del Profanador y otros nigromantes reciben el mismo tratamiento. No altera motor, sorteos ni guardados.

Verificado con scripts/verificar-activacion-sin-zona.mjs: activación seguida de aparición nueva para ambas familias, cinco tamaños, centros alineados, historial y recarga con estado intacto.


## Segunda fila de Aparición corregida: 14/10/2026

Los contenedores de zona y sus listas pasan a display:contents solo en Aparición. Una cuadrícula común de columnas de 219 px gobierna los saltos, con separación de 18 px; cada pareja genérica/enemigo ocupa dos columnas si caben, y una columna vertical si no. La flecha se orienta según el ancho real del contenedor mediante container query, sin depender del ancho de pantalla. Así no hay filas independientes dentro de cada zona; etiquetas largas debajo de los botones no desplazan otros grupos de una misma fila. Se conserva reserva vertical uniforme, tokens y centrado de los marcos.

QA scripts/verificar-marcos.mjs exige varias filas y compara sus centros y botones, con ambos marcos y cartas sin marco, en cinco tamaños. Pasó también scripts/verificar-zonas.mjs (historial, tokens, zoom, recarga y offline). No cambia estado ni motor.


## Alineación entre zonas corregida: 14/10/2026

La reserva vertical dependía del marco presente en cada grupo de zona (8/51/62 px), por lo que cartas y botones de grupos vecinos quedaban a distintas alturas. Se usa una reserva uniforme de 62 px en Aparición y 42 px en Última tanda, también para cartas sin marco; se elimina la excepción móvil y la diferencia entre revelación en curso y finalizada. Marcadores de la misma fila alineados, centros de imágenes alineados y botones alineados, sin depender del texto inferior ni del tipo de marco. Se conserva el centrado por abertura de cada marco.

Regresión ampliada en scripts/verificar-marcos.mjs con tres zonas mixtas (normal sin marco, Profanador y abominación), verificando centros y botones por fila con tolerancia de 1 px, tanto Aparición como Última tanda en cinco tamaños. También pasó scripts/verificar-zonas.mjs: tokens, historial, zoom y offline; sin cambios de motor ni guardado. Las capturas marcos-aparicion-*.png muestran el ajuste.


## Debug temporal de Daily Spawn: 14/10/2026

En Aparición, el nombre de cada carta con intento de Daily guardado añade « - x%». Usa dailyIntento.probabilidad: la probabilidad empleada para resolver esa carta, no la tasa posterior al fallo ni la del final de la tanda. Se muestra al revelarse; sin intentos (Daily apagado o cartas no elegibles), sin sufijo. No añade el texto a Historial, Última tanda ni secundarias. No cambia sorteos ni guardados.

Control de retirada: DEBUG_DAILY_SPAWN en dist/app.js; desactivarlo para la versión final. Validación scripts/verificar-debug-daily.mjs: progresión 20/40/60, éxito 100%, tasa 0%, Daily desactivado, recarga sin resorteo y tamaños 320/844 px. Captura docs/verificacion/debug-daily.png.


## Centrado visual de marcos: 14/10/2026

Los marcos verde de nigromante y rojo de abominación se alinean por el centro de su abertura transparente, no por el lienzo completo del PNG, cuyos márgenes superior e inferior difieren. La corrección proporcional de CSS se aplica tanto a Aparición como a Última tanda, incluidas las referencias de activación que usan esos marcos. Originales, tamaño de cartas, motor y guardado conservados.

Validado con scripts/verificar-marcos.mjs: abertura y carta coinciden en ambos ejes con tolerancia de 0,5 px, en cinco tamaños y las dos vistas; marcos completos, zoom y offline. También pasó scripts/verificar-zonas.mjs para conservar tokens, centrado de números y separación de controles. Capturas marcos-aparicion-*.png y marcos-ultima-tanda-*.png en docs/verificacion. No probado en dispositivos físicos.


## Vista de aparición actualizada: 14/10/2026

Punto 26 completado con los originales suministrados: marcador rojo con número blanco centrado sobre cada carta revelada en una zona estándar, y marcador verde sin número sobre las cartas de la zona del Profanador. Las secundarias y referencias de activación conservan el marcador de su zona real, independiente del tipo de enemigo. Misma identificación en Última tanda e Historial. Retirados encabezados textuales, líneas agrupadoras y flecha del nigromante hacia su zona; se conserva la flecha entre carta genérica y enemigo. El marcador completo, incluido su número, recibe el mismo gris y opacidad del 75% que la carta original al quedar su spawn aplicado; también en Última tanda e Historial. No cambia el motor ni los datos de partida.

Validación: 13 pruebas originales y 257/257 pruebas del proyecto; regresión de modos y comprobación de tokens en cinco tamaños de Chrome, zoom, historial/última tanda, recarga offline y guardado intacto. Capturas en docs/verificacion/tokens-zonas-*.png; script scripts/verificar-zonas.mjs. Sin prueba en dispositivos físicos. Esta presentación prevalece sobre las descripciones históricas de líneas y segunda flecha.


## Configuración durante partida y correcciones: 14/10/2026

Aplicadas las correcciones del usuario: Personalizado inicial en ambos mazos, modos/identidad/contenido/cajas editables desde próxima tanda, conservación de enemigos presentes al pasar a Estándar y de los topes exactos al volver a Personalizado o iniciar partida. Solo el Profanador puede volver a aparecer en Estándar de nigromantes; abominaciones presentes se activan hasta quedar vacío. Estándar excluye trofeos y usa Kan de Core si no hay ninguna candidata apta seleccionada. Acciones fijas con spawn al completar cupo pasan a activación del Profanador, confirmado.

Se implementó configuración pendiente e inventarios activos con catálogo histórico conservado. Quitar una carta/caja la excluye del sorteo, sin quitar sus enemigos presentes ni invalidar historial. Reactivar ordinarias puede devolver disponibilidad; trofeos derrotados siguen bloqueados, incluso si se deshabilitaron antes de derrotarlos. Reinicio secundario utiliza solo descartes activos, excluyendo presentes y trofeos. General y Daily también admiten cambios de contenido; Daily mantiene los aportes de cada tanda con su propia configuración. Anular SPAWN restaura ajustes pendientes y mazos anteriores.

El usuario autorizó descartar las partidas de prueba anteriores. Al cargar una partida sin `revisionReglas: 2`, la app la reinicia una vez manteniendo configuración, selección, topes y zonas normales. Se guarda la nueva partida antes de aceptar el reinicio; cuota conserva el estado previo. No se vuelven a reiniciar partidas de esta revisión ni se modificó directamente el almacenamiento del usuario durante QA.

Detalle, decisiones y archivos: `CONFIGURACION_DURANTE_PARTIDA.md`. Nuevo módulo `dist/configuracion-partida.js`, precargado en el paquete `9b8b2614fa3eb846`; 56 copias base y 60 recursos. Validación: 13 pruebas originales previas, 257/257 pruebas aprobadas, incluidas 21 nuevas de configuración dinámica, QA de configuración y modos en cinco tamaños, cuota, pestañas, recarga offline, anulación, nueva partida y reset único. Capturas `config-partida-*.png`; dispositivos físicos pendientes. Los registros inferiores son históricos y sus decisiones sustituidas no rigen esta revisión.

## Modos de enemigos y Profanador: 14/10/2026

Implementados los puntos 1–13 del listado consolidado autorizado por el usuario: modos Estándar / Varios / Personalizado de nigromantes y Estándar / Festival / Personalizado de abominaciones; prioridad y espacio del Profanador, referencias de activación, acciones sin elección durante el robo, azar en dos etapas, topes exclusivos de Personalizado y zona del Profanador resuelta al final. Corresponden a pendientes 16, 17, 19, 20 y 21, con 18 integrado.

Cada aparición ausente del Profanador lo elige obligatoriamente. Solo él crea una zona y aporta al contador verde; retirarlo elimina su zona para tandas posteriores, sin borrar robos históricos. Las nuevas zonas se encolan tras resolver las iniciales dentro de la misma acción guardada; su carta permanece boca abajo en la presentación hasta el final. Activarlo no provoca otro robo. Los adicionales no crean zonas. Estándar solo incluye al Profanador; Varios activa únicamente al Profanador y luego roba otro candidato.

Personalizado permite cinco acciones de nigromantes más Al azar, sin Elegir en el momento. Azar general 20% por acción elegible con cupo; sin cupo/candidatos excluye spawn y sortea entre dos activaciones al 50%. Azar individual posterior 50% independiente por adicional presente. Resultados, destinatarios y acciones predeterminadas se guardan por tanda. Referencias visuales con sello y zoom no consumen ni fijan enemigos nuevos. Festival activa todas las abominaciones presentes y luego roba otra; Estándar usa una identidad escogida de la selección de colección, conservando las demás preferencias.

Topes solo Personalizado: adicionales 0/0/1/1 con espacio reservado del Profanador (máximos totales 1/1/2/2), abominaciones 1/2/3/4. Perfiles no decrecientes. Ajustes desde próxima tanda; modos y selección desde nueva partida. Instalación nueva inicia Estándar; guardados anteriores se leen intactos y conservan su comportamiento hasta un reinicio explícito. No se actualizaron partidas del usuario ni se cambiaron origen, recursos originales, Excel o `base-web/`.

Preguntas resueltas autónomamente, opciones elegidas, contrato funcional y archivos afectados: **`docs/ITERACION_MODOS_ENEMIGOS.md`**. Nuevo módulo `dist/modos-enemigos.js`; integración en motor, secundarios, catálogo, contenido, límites, validación, presentación, revelación e interfaz. Metadatos de ambos mazos actualizados y paquete preparado `cc84732d9a79907e`, 56 copias base y 60 recursos.

Validación final: **236/236 pruebas**, incluidas 25 nuevas. Las 13 originales pasaron antes de modificar. QA `verificar-modos.mjs` aprobado en cinco tamaños con selección obligatoria, controles, configuración futura, referencias/zoom, azar, revelación animada diferida, historial, última tanda, cuota, legado, anulación y recuperación offline. También aprobados `verificar-navegador.mjs`, `verificar-daily-adrenalina.mjs` y `verificar-zonas.mjs`; no se repitieron los scripts históricos de límites que ejercitan elecciones legadas como si fueran configuración actual. Imágenes y marcos conservados; botón de carta de 155 px, imagen de 153 px dentro del borde existente. Capturas `modos-config-*.png` y `modos-activacion-*.png`; revisadas visualmente configuración estrecha y activación en escritorio. No se probaron dispositivos físicos.

Corrupción (8, incorpora 23), incompatibilidad de abominaciones (22), tokens visuales (26), estadísticas y otras reglas especiales siguen pendientes. 24 y 25 retirados. Próximo paso sugerido: revisión específica de corrupción o compatibilidad, sin autorización implícita de implementación. Los registros inferiores son cierres históricos.

## Zonas, derivación y marcos: 13/10/2026

Puntos 10, 11 y 14 completados. Aparición, historial y última tanda agrupan las cartas de cada zona bajo un título y una línea inferior compartidos. Una aparición secundaria amplía su grupo; la nueva zona usa `Zona 1 nigromante`, seguida por `Zona 1 nigromante 2` en cadenas. Las zonas verdes mantienen `Nigromante 1`; sus derivadas usan `Nigromante 1 · nueva zona`. Las etiquetas visibles se calculan desde IDs y relaciones de origen; no se cambian etiquetas almacenadas, sorteos, consumos, contadores ni persistencia.

Se conserva la flecha genérica → nigromante y se añade nigromante → carta general de la zona creada por él. Las conexiones usan IDs de extracción y zona, aparecen solo cuando ambos extremos están revelados y desaparecen al cancelar su origen. En filas apiladas rodean los grupos por los espacios libres; el SVG no intercepta botones. Redimensionar o renderizar recalcula geometría sin modificar la partida.

La revisión del punto 14 confirmó una reserva uniforme de 62 px en el CSS activo. Ahora cada grupo reserva 62 px con marco de nigromante, 51 px con abominación y 8 px sin marco. Las cartas sin marco apiladas en teléfono usan 8 px; durante la revelación procedural se mantiene una reserva uniforme que evita anticipar el tipo pendiente. Última tanda reserva 42/34/8 px según el marco. Las imágenes principales conservan 155 px de ancho, las miniaturas 102 px dentro de su botón de 104 px y todos los marcos permanecen completos. No se modificaron imágenes originales ni se atribuyó el espacio a caché antigua.

Archivos: `dist/presentacion.js`, `dist/app.js`, `dist/style.css`, `tests/zonas.test.js` y `scripts/verificar-zonas.mjs`; adaptadas las comprobaciones existentes de marcos y revelación a títulos compartidos y topes explícitos de sus escenarios. Preparación regeneró catálogo, versión y SW: paquete `1fa1267e096e5030`, 56 copias base y 60 recursos. Datos, motor, Excel, referencia `base-web/`, origen y almacenamiento del usuario preservados.

Validación: las 13 pruebas originales pasaron antes del cambio; 211/211 al finalizar, incluidas ocho nuevas sobre agrupación, nombres, relaciones, revelación, cancelación y rutas de flechas. `verificar-zonas.mjs` pasó en cinco tamaños (1440×900, 1024×768, 844×390, 390×844, 320×568): cadenas, una cabecera/línea por grupo, marcos completos, ausencia de desbordamiento horizontal y cruces de flechas sobre imágenes, historial, última tanda, zoom, revelación progresiva, estado intacto al redimensionar, cuota, cancelación, anulación y recarga offline. También pasaron `verificar-marcos.mjs`, `verificar-revelacion.mjs`, `verificar-limites.mjs`, `verificar-daily-adrenalina.mjs` y `verificar-navegador.mjs` en Chrome aislado. La comprobación inicial de marcos tuvo una aserción estricta de miniatura; se ajustó a decodificación de imagen y tolerancia inferior a un píxel, sin cambiar su tamaño. Capturas `docs/verificacion/zonas-cadena.png` y `zonas-anidadas-*.png`, con revisión visual de la cadena. Sin pruebas en dispositivos físicos.

De la iteración acordada queda únicamente el punto 8, contador de corrupción; concretar reinicio y reversión al anular antes de implementarlo. Los puntos 5, 6, 9, 12 y 13 permanecen fuera de esta iteración. Los registros inferiores describen cierres anteriores.

## Topes por adrenalina: 13/10/2026

Punto 4 completado: topes exclusivamente por nivel de adrenalina, sin modo ni contador de tope manual. Defaults confirmados por el usuario: nigromantes 1/1/2/2 y abominaciones 1/2/3/4. Configuración permite editar ocho enteros positivos y exige un perfil no decreciente de Azul a Rojo por familia. Un error bloquea guardar/iniciar sin ajustar otros colores silenciosamente. Tabla común al diseño de Daily; en teléfono estrecho abrevia encabezados conservando las etiquetas accesibles completas. En la pantalla principal se muestran los topes para la próxima tanda.

Guardar configuración actualiza solo el perfil de topes de la partida actual y su próxima configuración; el resto del contenido conserva la aplicación a nueva partida. Cada SPAWN guarda `limitesEnemigos` con los dos topes concretos de su nivel. La tanda ya creada mantiene su snapshot incluso tras cambiar perfil/adrenalina, reabrir, regenerar o elegir. Al alcanzar/superar el tope de una familia, su genérica se resuelve como activación adicional, con sello y aviso de tope, sin RNG de acción/secundario, consumo secundario ni nueva zona. Al completar un tope por una elección, otros pendientes de esa familia se resuelven como activación sin nuevo sorteo.

El conteo usa fijados válidos, incluidas referencias genéricas históricas válidas; no cuenta desfijados/anulados ni enemigos de la otra familia. La monotonía es una regla del perfil: retroceder de adrenalina o editarlo todavía puede dejar presencia por encima de un tope. Se conservan esas instancias y nuevas apariciones solo vuelven a permitirse estando por debajo. Desfijado, devolución, trofeos y regeneración conservan sus reglas; no se eliminan enemigos al editar un perfil. Anular restaura perfiles/presencia anteriores a SPAWN; guardado y rechazo de pestañas desactualizadas permanecen atómicos.

Compatibilidad: `limitesPorAdrenalina` es opcional en configuraciones anteriores. Leer no cambia bytes ni asigna topes a tandas históricas. La UI adopta los defaults en la siguiente acción SPAWN si faltaba perfil, y guarda esa adopción junto con la tanda. Tandas antiguas sin snapshot conservan sus resoluciones previas. `newGame` con configuración explícita conserva esos parámetros; la UI siempre incluye el perfil al crear una nueva partida. El perfil elegido se mantiene al reiniciar, mientras adrenalina vuelve a Azul.

Cambios: nuevo `dist/limites.js`, integración en `dist/engine.js`, `dist/secundarios.js`, `dist/nigromantes.js` y `dist/abominaciones.js`, copia/validación en `dist/catalogo.js`, `dist/contenido.js` y `dist/estado.js`, más encabezado/configuración/presentación en `dist/app.js`, `dist/index.html` y `dist/style.css`. Defaults y procedencia registrados en `datos/mazo_nigromantes.json` y `datos/mazo_abominaciones.json`. `scripts/preparar.mjs` precarga el módulo y regeneró catálogo, versión y SW: paquete `21649d413d22dacc`, 56 copias base y 60 recursos. Sin cambios al Excel, imágenes originales, origen o almacenamiento del usuario.

Validación: 13 pruebas originales y 186 de referencia antes de editar; 203/203 al finalizar, incluidas 17 nuevas en `tests/limites.test.js`. Cubren ambos modos secundarios, cuatro niveles, independencia, cadenas, elecciones/pendientes, ajustes diferidos, bajada de nivel, presencia conservada, regeneración, descarte, anulación, cuota, pestaña desactualizada, legado y validación de perfiles/snapshots/marcas. `scripts/verificar-limites.mjs` pasó en Chrome aislado: ocho valores aprobados, enteros/monotonía, cinco tamaños (1440×900, 1024×768, 844×390, 390×844, 320×568), activación automática, pendientes, ajustes desde próxima tanda, cuota, sincronización, anulación, offline, nueva partida y legado. Pasaron también QA de Daily por nivel, interfaz general y devolución/trofeos. Capturas `limites-config-*.png` y `limites-activacion-horizontal.png`; revisión visual de tabla en tablet y teléfono estrecho. Sin prueba en dispositivos físicos.

Excepciones por identidad, como la transformación de Mumm-Ra bajo condiciones todavía por confirmar, quedan para el punto 9 y no se automatizaron. De la iteración acordada quedan 8, 10, 11 y 14. Los registros inferiores describen cierres anteriores.

## Daily Spawn por adrenalina: 13/10/2026

Punto 15 completado con el enfoque confirmado por el usuario: cuatro pares de base (%) e incremento (puntos), uno por Azul / Amarillo / Naranja / Rojo. Tabla editable en Configuración, modo por carta/tanda conservado y nota de aplicación a una nueva partida. El indicador de Daily en la pantalla principal muestra nivel y probabilidad efectiva.

Cambiar de adrenalina conserva los puntos acumulados y los suma a la base del nuevo nivel: 20% + 20 puntos en Azul pasa a 30% + 20 puntos = 50% en Amarillo. Cada fallo aporta el incremento del nivel guardado en su tanda; los aportes antiguos no se recalculan con otro incremento. Una aparición reinicia el aumento a cero; tasa efectiva limitada al 100%, sin perder el incremento ganado si se baja a una base menor. Los puntos se reconstruyen desde intentos vigentes, sin duplicar aportes al cerrar/reabrir, y se acotan a 100 (suficiente para toda base no negativa). No hay condición ligada a rotaciones.

Compatibilidad: perfil opcional `dailyPorNivel` en configuración. Partidas anteriores sin perfil conservan exactamente el cálculo general previo, incluido su tope y cancelaciones, sin reescribir bytes al leer. El formulario replica los valores generales previos en los cuatro niveles; guardar cambia solo `proximaConfig`, y una partida nueva adopta el perfil. Sin configuración previa: 0/0 por nivel y Daily desactivado. Cada tanda usa su adrenalina congelada para intentos, regeneraciones y elecciones tardías, aunque el selector de la pantalla principal haya cambiado. Anular restaura nivel, probabilidad, configuración y mazos.

Cambios: `dist/daily.js` (validación, parámetros y acumulación), `dist/catalogo.js` (copia del perfil), `dist/contenido.js` (validación del formulario), `dist/app.js`, `dist/index.html` y `dist/style.css`. `datos/mazo_daily.json` registra procedencia y política aprobadas como configuración del gestor, sin atribuirlas a reglas oficiales ni cambiar cartas/copias. Preparación regeneró catálogo, versión y SW: paquete `bfce25f5e873f3d1`, 56 copias base y 60 recursos. Excel, imágenes originales, `base-web/`, origen y almacenamiento del usuario conservados.

Validación: 173 pruebas de referencia antes del cambio y 186/186 después, con 13 nuevas en `tests/daily-adrenalina.test.js`. Cubren cambio de base con puntos conservados, incremento por carta/tanda y por nivel histórico, aparición/reset, 0/100, bloqueo sin candidatos, cancelaciones, regeneración, elección tardía, anulación, cuota, configuración futura, compatibilidad y validación del perfil. `scripts/verificar-daily-adrenalina.mjs` pasó en Chrome aislado: ocho campos, errores/vacíos, guardado y cambios pendientes, cuota, cinco tamaños, 40→50→55→35%, nivel congelado, regeneración, anulación, aparición/reset, pestañas y recarga offline. Pasaron también QA de Daily, selector de adrenalina e interfaz general. Capturas `daily-adrenalina-config-*.png` y `daily-adrenalina-50.png`; tabla revisada visualmente en tablet y teléfono estrecho. Los valores 20/20, 30/5, 10/10 y 40/15 de las capturas son ejemplos de prueba, no defaults ni cambios a la configuración del usuario. Sin verificación en dispositivos físicos.

Los puntos 7 y 15 están completados. De la iteración acordada siguen pendientes 4, 8, 10, 11 y 14. Los registros siguientes conservan los cierres previos y no sustituyen este estado.

## Selector de adrenalina: 13/10/2026

Implementado el selector del punto 7: «Nivel de adrenalina» en el centro superior de la pantalla principal, nombre en blanco sobre fondo Azul / Amarillo / Naranja / Rojo y flechas para retroceder/avanzar. Extremos desactivados y controles de 44 px. En teléfono estrecho ocupa una segunda fila del encabezado, manteniéndose centrado.

Cambio manual, guardado atómico y sin consumo de cartas. No existe control dentro de Aparición ni incremento automático durante SPAWN. Partida nueva inicia en Azul. `nivelAdrenalina` en la partida es opcional para compatibilidad; su ausencia se interpreta como Azul sin modificar guardados anteriores al leer. Las nuevas tandas guardan su propio `nivelAdrenalina`, compartido por todas sus cartas/derivadas; no se asignan niveles ficticios a tandas históricas sin este campo. Anular restaura el nivel anterior a SPAWN mediante el respaldo existente. Los valores inválidos se rechazan también en tandas y respaldos.

Archivos funcionales: nuevo `dist/adrenalina.js`, encabezado y estilos, integración en `dist/app.js`, creación de partida/tanda en `dist/engine.js`, validación en `dist/estado.js` y precarga en `scripts/preparar.mjs`. Preparación generó el paquete `3da9e20332b9bf2e` con el módulo incluido en el service worker.

Validación: las 13 pruebas originales pasaron; las 165 de referencia pasaron, con la prueba de recursos repetida fuera del aislamiento por un error EPERM de Windows. Después del cambio pasaron 173/173, incluidas ocho nuevas en `tests/adrenalina.test.js`. `scripts/verificar-adrenalina.mjs` comprobó cuatro fondos y nombre blanco, cinco tamaños (1440×900, 1024×768, 844×390, 390×844 y 320×568), centrado, ausencia de solapamientos/desbordamientos, teclado, extremos, guardado, SPAWN sin incremento, nivel por tanda, anulación, dos pestañas, cuota, recarga offline, nueva partida y legado sin cambiar bytes. Capturas en `docs/verificacion/adrenalina-*.png`; revisión visual de horizontal, teléfono estrecho y Amarillo. Chrome aislado; sin tocar el almacenamiento del usuario ni probar dispositivos físicos.

También pasó `scripts/verificar-navegador.mjs`: subruta, cuatro tamaños, acciones generales, recuperación, cuota, pestañas, migración y las 60 imágenes offline. La comparación `adrenalina-colores.png` reúne los cuatro estados visuales del mismo control; `adrenalina-encabezado.png` muestra su ubicación real en horizontal.

El alcance acordado continúa siendo 4, 7, 8, 10, 11 y 14. Solo el selector del punto 7 se completó en este cambio. La integración con límites automáticos pertenece al punto 4 y necesita sus valores/reglas pendientes. El punto 15 permanece para después. Los registros inferiores describen cierres anteriores.

## Daily Spawn y expansiones: 13/10/2026

- Implementados los puntos 1 a 3 del listado vigente. El Excel se leyó sin modificarlo, incluida la hoja actual `Mazo Custom Daily Spawn`; su campo de reglas programables se conserva como información, no automatiza reglas particulares.
- Daily Spawn: siete identidades únicas de Frozen Fortress, Rakshasa DU02, mazo independiente sin reposición. Se añade al origen elegible, incluido Asedio, y se fija automáticamente. Los enemigos en juego no entran en robos ni reinicios; sin candidatos la probabilidad efectiva es 0 y no hay activación adicional.
- Configuración: habilitación, cartas, base e incremento 0–100%, aumento por carta o tanda. Inicialmente desactivado con valores 0/0 y modo tanda. Los cambios se aplican a la próxima partida; no alteran el catálogo congelado de la partida guardada.
- Probabilidad por carta: fallo incrementa, aparición vuelve a base. Por tanda: incremento único si no aparece ningún Daily; incluye cadenas y elecciones posteriores sin duplicar aportes. Sin candidatos al inicio no aumenta; con candidatos una tanda sin cartas elegibles sí aumenta. Máximo 100%.
- Cancelar/regenerar el origen devuelve el Daily y retira el intento anterior; regenerar el secundario no vuelve a sortear probabilidad. Anular tanda restaura el estado previo completo. Devolución manual y refijado actualizan las ubicaciones del mazo. Recargar/renderizar no sortea.
- Cinco fichas de spawn de expansión habilitadas: 24 copias. Core conserva sus 56; con las cinco seleccionadas son 80. Bestias divinas Aparición sigue incompleta. Fácil / Estándar es visible; Normal interno permanece por compatibilidad.
- Catálogo y precarga: 60 imágenes clasificadas en 00–05. Preparación valida rutas e identidades. `datos/mazo_base.json`, `base-web/`, imágenes originales y partidas del usuario se conservan.
- Validación: 144 pruebas de referencia antes de editar, 165 al finalizar (21 nuevas). Chrome aislado en 1440×900, 1024×768, 844×390, 390×844 y 320×568; configuración, selección, presentación intercalada, devolución/refijado, fallo de cuota, anulación, partida anterior de 56 copias y recarga sin red. También pasó la regresión de devolución de abominaciones, trofeos y nigromantes.
- Límites: no se probaron dispositivos físicos. Las reglas especiales por identidad y los puntos 4 a 14 siguen pendientes. Sin publicación ni cambios de origen; servidor local en http://127.0.0.1:8080/mazo/.

Los registros documentales e históricos siguientes describen estados anteriores y no sustituyen este cierre.

### Decisiones y valores iniciales

Las reglas confirmadas por el usuario son: probabilidad general sin filtro por tipo, un intento por carta elegible, Asedio incluido, Daily añadido al spawn, unicidad estricta, incremento configurable por carta/tanda, reinicio a base tras aparición y tope de 100%. Rakshasa conserva DU02 por indicación expresa.

La desactivación inicial y los valores 0/0 con modo tanda son una decisión técnica conservadora, no una regla oficial ni probabilidades recomendadas. Los ejemplos 10% y +15 puntos no se convirtieron en defaults. Las reglas particulares del texto de cada enemigo no se ejecutan automáticamente.

### Evidencia de verificación

Paquete preparado al cierre: `240b9e1ea8d58199`. Comandos ejecutados con el Node y Playwright instalados en el entorno:

```sh
node scripts/preparar.mjs
node --test tests/*.test.js
node scripts/verificar-daily.mjs
node scripts/verificar-devolucion.mjs
```

Resultados: preparación correcta de 56 copias base y 60 recursos; 165/165 pruebas sin fallos; ambas verificaciones de navegador aprobadas. `tests/daily.test.js` cubre las 21 pruebas nuevas. Las capturas `docs/verificacion/daily-config-*.png`, `daily-opciones-*.png` y `daily-aparicion-*.png` conservan la evidencia visual; se revisaron opciones horizontal/estrecha y aparición estrecha. El último pase de Daily corresponde al paquete indicado arriba.

### Limitaciones y recuperación

- Navegador Chrome de escritorio en contextos aislados; los tamaños móvil/tablet son emulación de viewport, no prueba física ni validación en Safari/Firefox.
- Offline comprobado mediante navegador sin red tras precarga. No equivale a una prueba física de modo avión o instalación PWA en un dispositivo.
- Fallo de cuota simulado; no se llenó ni modificó el almacenamiento real del usuario. El cierre forzado del sistema operativo no se probó.
- Se verificaron automatizadamente compatibilidad, invariantes y selección; las probabilidades no se validaron mediante un estudio estadístico de largas partidas.
- No se repitieron todos los scripts históricos de navegador: se ejecutaron Daily y devolución, además de la batería automatizada completa.
- Excel y recursos fuente no se editaron. No hay sincronización, transferencia entre orígenes ni publicación nueva. La actualización del paquete no añade cartas retroactivamente a una partida existente.
- Para activar la versión PWA nueva, cerrar todas las pestañas de la app y abrir nuevamente el mismo origen. No borrar el almacenamiento. Daily debe habilitarse y configurarse antes de iniciar una nueva partida.

### Siguiente paso

No hay otra implementación autorizada por este cierre. La propuesta de siguiente etapa está en `docs/PLAN_IMPLEMENTACION.md`: confirmar alcance y valores de los limitadores antes de programarlos, considerando su dependencia del selector de adrenalina. Bestias divinas y reglas particulares requieren datos/reglas confirmados. Los puntos 4 a 14 siguen pendientes, sin orden de implementación nuevo aprobado.

Esta actualización de documentación no cambia código, datos, Excel ni paquete servido. No se repitieron pruebas de ejecución por cambios exclusivamente documentales; los resultados anteriores son evidencia de la implementación, no pruebas nuevas de este cierre.

## Estado documental del 13/10/2026

Actualizado el listado vigente de `docs/DECISIONES_PENDIENTES.md` y la siguiente iteración en `docs/PLAN_IMPLEMENTACION.md`. Se registran Daily Spawn, integración de expansiones, Fácil/Estándar, limitadores de ambas familias, adrenalina, corrupción, estadísticas, reglas por carta única y ajustes visuales. Próxima implementación limitada a los tres primeros puntos. La aclaración de activación adicional al alcanzar el límite de nigromantes cierra ese comportamiento, pero el limitador no está implementado todavía. Ningún cambio en app, Excel, imágenes, guardados ni service worker por esta actualización.

Los apartados inferiores son registros históricos de implementación y verificación; sus pendientes iniciales no sustituyen el listado vigente.

Fecha: 6 de octubre de 2026, hora de Chile. Este documento describe la copia de trabajo y no cambia las decisiones de reglas pendientes ni el estado histórico de la entrega original.

Actualización del 7 de octubre de 2026: recursos reorganizados para usar exclusivamente las carpetas `00–04` suministradas por el usuario. Catálogos y precarga apuntan a los 54 archivos actuales. Las tres carpetas antiguas de `recursos/` pueden eliminarse; no fueron borradas por Codex. Se limpiaron únicamente sus copias generadas de `dist/recursos/`. El Excel y `base-web/` se mantienen intactos.

La preparación se comprobó en una copia temporal sin carpetas fuente antiguas. Se conservaron IDs/cantidades base, una copia por carta secundaria y la asociación existente entre las dos imágenes de Kijin. Los modos secundarios no se implementaron ni se activaron por este cambio.

## Abominaciones: actualización del 8 de octubre de 2026

Implementado en `dist/abominaciones.js`, integrado con motor, persistencia e interfaz. El catálogo operativo explícito es `datos/mazo_abominaciones.json`; los inventarios de referencia conservan sus pendientes de reglas/procedencia y no habilitan por sí mismos ningún otro mazo.

- 20 identidades confirmadas, cantidad 1, sin dificultad/número. Kijin usa la imagen corregida sin sumar su variante. Bestias divinas Activación permanece como ayuda, pendiente de confirmación de entrada al sorteo.
- Configuración con/sin reposición; sin reposición inicialmente, reinicio obligatorio al agotarse. Catálogo y modo congelados al empezar nueva partida.
- Sin presencia válida: conservar spawn y añadir secundaria auto-fijada inmediatamente después, con la misma etiqueta de zona. Con presencia: dos botones superpuestos, activación simple o activación + spawn.
- Fijados válidos, incluidas genéricas antiguas sin identidad concreta, cuentan como presencia de abominación. Desfijados/descartados/anulados no. No se deduce inventario físico ni límite de miniaturas.
- Descarta/regenera origen: consumo general conservado, secundarias devueltas y desfijadas. Regenerar secundaria devuelve anterior antes de sortear. No tiene descarte propio.
- Anulados consultables en historial y Desfijados, sin posibilidad de refijar. IDs/parentesco persistidos; elecciones y cancelaciones idempotentes. No hay sorteos durante render.
- Devolver tras agotamiento revierte el reinicio si no hay robos posteriores. Si ya los hubo, conserva esos ciclos/elecciones: no devuelve otra copia de una identidad consumida por un origen vigente del ciclo actual.
- Estado secundario versionado opcional en partida v2. Guardados v1/v2 anteriores se recuperan intactos y siguen con su composición previa; necesitan nueva partida para activar secundarios. No se asignan enemigos retroactivos.

Validado: 43/43 pruebas completas (15 nuevas de abominaciones), preparación/hash de 54 recursos, QA general y QA de abominaciones en Chrome. Ambos scripts usan 844x390, 390x844, 320x568 y 1024x768. Capturas `abominaciones-*.png`; revisión visual de horizontal y teléfono estrecho. Elecciones, devolución, auto-fijado, zoom, historial, cambio de modo, recarga y cuota fallida comprobados; acciones secundarias y recuperación probadas realmente sin red.

Actualización PWA también comprobada con una abominación fijada y otra elección pendiente: espera al cierre de pestañas, conserva ambas al activar y permite recuperar sin red sin nuevos sorteos.

No se modificó el Excel ni `base-web/`. Pendiente: campo de input para impedir reaparición por regla específica, Bestias divinas Activación, motor de nigromantes y pruebas en dispositivos físicos.

## Nigromantes: segunda actualización del 8 de octubre de 2026

Implementados `dist/nigromantes.js` y `datos/mazo_nigromantes.json`, integrados en motor, persistencia y UI. `dist/secundarios.js` comparte la selección uniforme, reposición, devolución y archivo de referencias con abominaciones para evitar dos políticas distintas. Se preservaron IDs y el formato opcional versionado de partida v2.

- Diez identidades, una copia; Death Notes conservada como referencia sin reglas/sorteo confirmados. Dos modos configurables y reinicio obligatorio al agotarse.
- Primera aparición mantiene genérica, auto-fija enemigo y roba inmediatamente una general para su spawn. Orden origen, sufijo -2 enemigo, sufijo -3 general; cadenas anidadas preservan origen mediante IDs.
- Con presencia: Activación adicional o Activación adicional + Nigromante adicional. La última selecciona, fija y roba general una vez. Otra general de nigromante queda pendiente para elegir, evitando bucles automáticos.
- Contador verde calculado desde nigromantes fijados válidos; controles manuales verdes ocultos y rechazados en el motor nuevo. Desfijar/refijar ajusta sin preguntas ni otro robo de aparición. Una genérica válida fijada se cuenta sin asignarle identidad ficticia; referencias anuladas/descartadas no dan presencia.
- Tanda captura las zonas iniciales. Nuevos enemigos atienden su propio spawn inmediato y aportan a futuras tandas, sin duplicar robos en la actual.
- Cancelar/regenerar origen devuelve/desfija todos sus secundarios, incluso abominaciones dentro del árbol. Generales del árbol mantienen consumo y quedan anuladas en historial. Regenerar secundaria anula/devuelve su árbol antes de seleccionar y robar por el nuevo enemigo.
- Partidas anteriores sin estado `nigromantes` conservan su mazo y contador manual, incluidos v1 migrados. La UI inicia nuevas partidas con ambos secundarios y cero nigromantes. No hay sorteos ni correcciones retroactivas de guardados antiguos.

Validado: 61/61 pruebas (18 nuevas de nigromantes); QA de nigromantes, regresión de abominaciones y QA general en Chrome a 844x390, 390x844, 320x568 y 1024x768. Capturas `nigromantes-*.png`, revisión visual horizontal y teléfono estrecho. Probadas cadenas, orden, cancelación/regeneración, contador, modos congelados, pestañas, cuota fallida y acciones/recuperación offline. Actualización PWA comprobada con nigromantes fijados y cadena pendiente, sin nuevos sorteos al activar. Preparación conserva hashes de los 54 recursos y las imágenes de `base-web/`.

Pendiente: Death Notes/Bestias divinas Activación, vínculos de ayuda, reglas particulares por enemigo/campo de reaparición, expansión general con datos completos y pruebas físicas en dispositivos. No se modificó Excel, `AGENTS.md` ni `base-web/`; no se publicó.

## Etapa de migración/base

Implementada en la raíz, con `dist/`, `tests/`, `scripts/` y `package.json`. `base-web/` se conservó sin cambios. Se preservan el estilo, los IDs de catálogo, las cartas reales y las funciones del mazo general. La UI usa IDs estables de posición; las extracciones mantienen sus `uid` históricos. El motor conserva RNG inyectable y la comparación estricta del umbral después de cada robo.

`estado.js` valida cantidades, configuración, catálogo congelado, contadores, IDs únicos, ciclos y referencias. `persistencia.js` migra v1 y escribe v2 en otra clave, conservando el original. Las acciones se clonan, validan y guardan antes de publicarlas. Las pestañas desactualizadas se detectan antes de ejecutar robos. No hay importador desde otro dominio ni identidades de enemigo inventadas durante la migración.

El service worker incluye la lista de recursos y versión en su propio archivo generado. Precarga completa antes de activarse; sirve siempre el paquete de su versión. No usa `skipWaiting`; una actualización espera al cierre de todos sus clientes. La UI comprueba la integridad del paquete y la coincidencia de versión antes de indicar disponibilidad offline.

## Etapa de catálogo e información

Implementadas las partes independientes de datos pendientes:

- Catálogo generado de `datos/mazo_base.json`, conservando las 56 copias y la clasificación confirmada.
- Selector White Death → Core → Tipo → Carta, con configuración de próxima partida persistida. Los filtros de dificultad permanecen separados. Selección por ID sin doble inclusión y prevención de partidas sin cartas elegibles.
- Green Horde y Frozen Fortress visibles como contenido pendiente, sin asignaciones inventadas.
- Inventarios consultables de la colección: 30 fichas de enemigos, 6 recursos de spawn de expansión y 6 ayudas, cubriendo los 54 archivos clasificados. Los tipos secundarios y una copia por carta están confirmados por el usuario. Caja/procedencia específica y reglas siguen pendientes; las cantidades de spawn desconocidas permanecen en `null`.
- Consulta de original/traducción/variantes, zoom y retorno al contexto anterior. Textos escapados y rutas restringidas al inventario local.
- Botón de información por extracción condicionado a relaciones confirmadas. No hay vínculos confirmados en los JSON suministrados, por lo que todavía no aparece en las cartas de partida.

Esta etapa está parcialmente completada: faltan asociaciones de ayudas, procedencias/cantidades/clasificación de expansión y su validación. El cambio de catálogo inicial no activó secundarios; abominaciones se agregó en la actualización del 8/10 documentada arriba.

## Verificación

### Colección y filtros de contenido: 9 de octubre de 2026

Se implementaron Colección desplegable y filtros exclusivos Zombis / Abominaciones / Nigromantes / Otros. Seis grupos de caja confirmados por la columna `caja` del Excel, con 51 asociaciones por ID en `datos/coleccion.json`. Core siempre marcado/bloqueado; Core retrocompatibilidad independiente. Deshabilitar una caja oculta sus fichas y las excluye de los mazos de la próxima partida; las preferencias individuales se conservan para reactivar la caja.

Los seis tipos de Otros (spawns de nigromante/abominación, asedio y activaciones) quedan siempre marcados/bloqueados en configuraciones guardadas con este selector, con sus 28 copias históricas. Las acciones masivas solo afectan el filtro y cajas habilitadas, sin quitar obligatorias ni activar fichas pendientes. Hay selección real de las 20 abominaciones y 10 nigromantes; cada nueva partida congela el subconjunto elegido. Guardar preferencias no cambia mazos, cartas fijadas ni sorteos actuales. El umbral sigue aplicándose inmediatamente, como antes.

Inicio de partida bloqueado con mensaje si un mazo secundario requerido queda vacío; el borrador incompleto es guardable. X/Escape con cambios ofrece Sí, salir / No, volver / Guardar configuración. Solo cambiar filtro no dispara aviso. Fallo de guardado mantiene el menú y el borrador. Configuraciones antiguas permanecen intactas hasta guardar/iniciar explícitamente; no se fuerza Otros retroactivamente sobre la partida vigente. La anulación de tanda conserva su restauración completa.

Excel original actualizado únicamente en 12 celdas `base` a `Core`. Edición y render verificados con Artifact Tool; paquete nativo preservado para no perder metadatos. Comparación de todas las celdas y partes ZIP: solo difiere `xl/sharedStrings.xml`; las demás partes, estilos y hojas conservan sus bytes. Copia anterior en `outputs/01a1142a-4e79-7c51-853a-0d21efa10a6c/input referencia cartas.antes-core.xlsx`. `scripts/importar-coleccion.py` lee el Excel para generar asociaciones de caja; no importa cantidades/reglas de expansiones ni modifica el Excel.

Archivos principales: `datos/coleccion.json`, `dist/contenido.js`, `catalogo.js`, `engine.js`, `abominaciones.js`, `nigromantes.js`, `estado.js`, `informacion.js`, `app.js`, `index.html`, `style.css` y preparación PWA. `base-web/` intacto. Se añadió el módulo a la precarga y se verifican IDs de caja/carta y cobertura de las cartas operativas al preparar.

Pasaron las 93 pruebas completas (14 nuevas de selección/colección), tres pruebas de recursos después de reforzar la preparación, QA general, abominaciones, nigromantes y actualización PWA. `scripts/verificar-contenido.mjs` comprobó cuatro viewports, casillas obligatorias, preferencias ocultas, acciones masivas, las tres salidas del menú, nueva composición congelada, recarga, offline real y cuota fallida. Capturas `contenido-*.png`, `coleccion-*.png` y `contenido-otros-obligatorios.png`; revisión visual de teléfono estrecho y tablet. Se adaptó el QA de imágenes a las dimensiones de los PNG actuales suministrados, conservándolos sin alterar.

Pendiente fuera de alcance: incorporación funcional de los seis spawns de expansión y sus reglas particulares. Siguen consultables por caja/filtro con casillas deshabilitadas; el dato de caja no los habilita automáticamente. Death Notes, Bestias divinas y las ayudas siguen como consulta. Las limitaciones de pruebas en dispositivos físicos permanecen.

### Marcador normal y alineación: 9 de octubre de 2026

«Zonas normales» se sustituyó por el marcador rojo `recursos/Imagenes generales/Marcador de zonas de estandar.png` (2061x763), con texto alternativo y copia exacta del original. Los dos contadores comparten filas estables para marcador, número y controles. Se reserva la fila inferior aunque los botones verdes estén ocultos, conservando la alineación. Ambas imágenes se muestran completas, con sus proporciones originales.

Cambios acotados a `dist/index.html`, `dist/style.css` y preparación offline; motor/partida sin cambios. Las tres pruebas de recursos verificaron ambos PNG y su precarga. QA general y nigromantes comprobaron cuatro viewports, alineación de marcadores/números con controles verdes visibles y ocultos, y carga offline de ambos marcadores. Capturas principales actualizadas; revisión visual de horizontal y teléfono estrecho.

### Marcador de zonas de nigromante: 9 de octubre de 2026

La etiqueta visible del contador verde se sustituyó por `recursos/Imagenes generales/Marcador de zonas de nigromante.png`, conservando texto alternativo accesible, proporción e imagen completa. Contador y botones mantienen su lógica. Imagen original de 1908x824 copiada sin alterar bytes a `dist/`; preparación y precarga offline incluyen este recurso de interfaz aparte de los 54 recursos del catálogo, sin incorporarlo a ningún mazo.

Cambios en `dist/index.html`, `dist/style.css` y `scripts/preparar.mjs`. Pasaron las tres pruebas de recursos, incluida copia exacta del PNG e inclusión en el service worker. QA general en Chrome comprobó carga y límites del marcador en cuatro viewports, recarga y decodificación real sin red; revisión visual de horizontal y teléfono estrecho. Capturas principales actualizadas en `docs/verificacion/`. Motor, partida, Excel y `base-web/` sin modificaciones.

### Anular la última tanda: 9 de octubre de 2026

El botón normal «Añadir zona» se sustituyó por «Anular tanda», con confirmación. La restauración devuelve exactamente el estado previo a SPAWN: cantidades y ciclos de los tres mazos, configuración, contadores, historial y fijados/desfijados. Incluye reemplazos, descartes y cadenas secundarias. Cierra Aparición y deja la anterior como última tanda; si era la primera, vuelve a la vista inicial.

El campo opcional `respaldoTanda` de v2 guarda una sola instantánea validada, sin otra instantánea dentro. Persiste al cerrar, reabrir, recargar y modificar la tanda; el siguiente SPAWN lo reemplaza. Anular lo consume, por lo que no habilita anulaciones sucesivas de tandas anteriores. Una nueva partida lo limpia. Las tandas anteriores a esta actualización no reciben un respaldo ficticio: botón deshabilitado hasta el siguiente SPAWN, sin reiniciar la partida.

Motor en `dist/engine.js`, validación en `dist/estado.js`, botón/confirmación en `dist/app.js` e `index.html`; PWA regenerada. Las acciones conservan el contrato de escritura atómica. Una confirmación pendiente se cierra al cambiar la partida en otra pestaña. El respaldo duplica aproximadamente el estado de partida guardado, no imágenes; un fallo de cuota mantiene el estado previo completo.

Pasaron las 79 pruebas completas, incluidas 12 nuevas de anulación. `scripts/verificar-anular-tanda.mjs` verificó cuatro viewports, primera/última tanda, cancelación, aparición de ambos enemigos, devoluciones, reapertura, recarga, offline, cuota y confirmación desactualizada entre pestañas. QA general, abominaciones, nigromantes y actualización PWA también pasaron; capturas `anular-tanda-*.png`, revisión visual de teléfono estrecho. La actualización preservó la partida con su respaldo y recuperación offline. Motor anterior y secundarias cubiertos por la batería completa. Excel y `base-web/` sin cambios. Las limitaciones de dispositivos físicos siguen vigentes.

### Mostrar u ocultar desfijados: 9 de octubre de 2026

El texto «Tus cartas a mano» se sustituyó por el botón alterno «Ocultar desfijados» / «Mostrar desfijados». Solo oculta la franja de desfijados y su separador; los fijados siguen visibles y las referencias no se eliminan. La elección se mantiene durante la sesión, incluso después de fijar/desfijar, y al recargar se muestran de nuevo. No se cambia el formato de guardado ni se escribe la partida por alternar la vista.

Cambios acotados a `dist/index.html`, `dist/app.js` y `dist/style.css`, con paquete PWA regenerado. `scripts/verificar-desfijados.mjs` comprobó cuatro viewports, alternancia, bytes de partida intactos, fijados visibles, estado vacío, refijación y uso offline. Capturas `desfijados-ocultos-*.png`; revisión visual de teléfono estrecho. Motor, Excel y `base-web/` sin cambios.

### Señales visuales de resolución: 8 de octubre de 2026

La presentación distingue el spawn aplicado de su enemigo revelado: etiqueta de zona tachada, imagen genérica en gris y flecha entre ambas imágenes. El par permanece junto en móvil y tablet. Una elección pendiente conserva el color; activación adicional muestra un sello sobre la imagen, sin gris ni flecha. Se aplica en Aparición, última tanda e historial, sin cambiar el estado guardado, sorteos, fijados ni contadores. El zoom conserva la imagen original para consulta.

Funciones puras en `dist/presentacion.js`, integración en `dist/app.js` y estilos en `dist/style.css`; módulo incluido en la precarga offline. Pasaron las 67 pruebas completas, incluidas seis nuevas de presentación, y las aserciones visuales de los dos scripts de navegador. Ambos comprobaron cuatro viewports, elecciones, cadenas, recarga, offline y cuota. Capturas actualizadas en `docs/verificacion/`, incluido `activacion-sello.png`. No se modificaron el Excel, el motor ni `base-web/`.

- Antes de editar: 13/13 pruebas originales pasaron en `base-web/` usando Node incluido en el entorno.
- Copia de trabajo: 28 pruebas de motor, catálogo, migración, guardado y recursos. Incluyen fallo de cuota, JSON corrupto, IDs duplicados, referencias huérfanas, configuración futura, instantánea de catálogo, conflicto entre pestañas y generación sin carpetas antiguas.
- Preparación: hashes de las 54 imágenes vigentes verificados, rutas vinculadas existentes, imágenes base iguales en bytes a la referencia. No se encontró discrepancia entre cantidades/IDs del motor base y el catálogo suministrado. No se revisaron las reglas ni traducciones para automatizarlas.
- Chrome mediante Playwright: 844×390, 390×844, 320×568 y 1024×768. Comprobaciones de desbordamiento y carga de imágenes; capturas en `docs/verificacion/`. Revisión visual de teléfono horizontal/vertical y Aparición de teléfono/tablet, conservando la imagen completa.
- UI: SPAWN, reemplazo, descarte, fijación, botones adicionales, configuración persistida, ayuda/zoom y Escape sobre la ventana superior. Nueva partida cancelada conserva progreso; nueva partida confirmada aplica selección, conserva normales y reinicia zonas de nigromante.
- Recuperación: recarga con Aparición abierta conserva cantidades/IDs; v1 sintético migra sin sobrescribir su clave; fallo de cuota real simulado en Storage no publica la tanda.
- Pestañas: un cambio guardado llega a otra pestaña del mismo origen. No es sincronización entre dispositivos.
- Offline real de navegador: contexto sin red, recarga, robos, historial y decodificación de las 54 imágenes locales, incluidas rutas con espacios y Unicode; rutas bajo `/mazo/`.
- Actualización: servidor temporal con dos versiones; la nueva espera al cierre de pestañas, la recarga sirve el paquete anterior y al activar se mantiene la partida y su recuperación sin red.

Estas comprobaciones usan viewports de escritorio emulados; no sustituyen pruebas en dispositivos físicos, instalación como PWA en Android/iOS, suspensión real del sistema ni borrado de datos del navegador.

## Pendientes para continuar

Asociaciones de las seis ayudas a cartas concretas. Para abominaciones: Bestias divinas Activación y futuro campo para impedir reaparición por regla particular. Pesos adaptativos y restricciones de miniaturas requieren un alcance separado; no bloquean el flujo aprobado.

El flujo común de nigromantes y las decisiones D06, D07, D09 y D13 quedaron resueltos en la segunda actualización del 8/10. Sus reglas particulares y Death Notes no están automatizadas.

Publicación preparada mediante ejemplo inactivo. No se creó repositorio ni se modificó el sitio de referencia. El servidor local queda en http://127.0.0.1:8080/mazo/ .
## Volteo de cartas en prueba

SPAWN presenta las cartas con reverso negro y signo de pregunta y las voltea automáticamente en orden visual, con 240 ms entre inicios y 420 ms de giro. Las secundarias y generales derivadas de una elección también se animan, sin repetir las cartas anteriores. La animación es transitoria: no cambia el motor, los consumos ni el guardado inmediato. Cerrar/reabrir o recuperar la tanda muestra el resultado sin repetirla. Se respeta la preferencia de movimiento reducido. Los selectores de acción por defecto siguen pendientes de confirmación y no forman parte de este cambio.

Validado: cuatro pruebas de planificación, seis de presentación y tres de recursos. `scripts/verificar-volteo.mjs` comprueba reversos, secuencia, derivadas, guardado estable, cierre/reapertura, recarga, movimiento reducido y tres tamaños de pantalla en Chrome aislado. También pasaron las verificaciones completas de navegador de abominaciones y nigromantes, incluyendo offline, cuota y cuatro viewports. Capturas en `docs/verificacion/volteo-*.png`. No se probaron dispositivos físicos.

## Acciones por defecto: 9/10/2026

Las cinco opciones quedaron confirmadas e implementadas; sustituye el pendiente indicado en el apartado de volteo. Selectores nativos compactos junto a Última tanda; se apilan en teléfono estrecho. Preferencias opcionales en `accionesPredeterminadas`, resultados por carta en `accionEnemigo`; guardados anteriores intactos con elección manual por defecto. Spawn puro y combinado comparten el robo pero tienen registro/sello distintos. Cambiar selector es una acción atómica y no resuelve pendientes ya mostrados. Abominaciones y nigromantes comparten opciones/azar validado en `dist/acciones-enemigos.js`, incluido offline. Animación sigue siendo visual.

Protección técnica contra recursión automática infinita: abortar toda la acción a los 100 niveles de cadena, sin guardar consumos o fijados parciales. Se muestra un mensaje para cambiar a elección manual; no se impone un límite de miniaturas ni se omiten reglas. Anular restaura la preferencia anterior a SPAWN. Pesos adaptativos/dificultad no implementados.

Pasaron 111 pruebas completas, incluidas 14 nuevas de acciones. `scripts/verificar-acciones-enemigos.mjs` comprobó opciones, independencia, no modificación retroactiva, recarga/offline, elección manual, sellos, derivadas animadas, cuota y cuatro viewports. Capturas `acciones-*.png` revisadas en móvil estrecho y horizontal. No se probaron dispositivos físicos.

## Separador verde de prueba: 9/10/2026

La franja modular suministrada se usa como fondo repetido horizontalmente en `pin-section::before`, entre Última tanda y Fijados, sustituyendo la línea simple. Alto visible 36 px, imagen proporcionada a 96 px de alto y centrada para mostrar la banda central sin modificar el PNG. Transparencia conservada; sin interacción ni cambios de partida. Recurso copiado/precargado por `scripts/preparar.mjs`. Pasaron tres pruebas de recursos y `scripts/verificar-separador.mjs`: cuatro viewports, imagen decodificada, repetición, geometría, offline y guardado intacto. Capturas `separador-*.png` revisadas en horizontal y teléfono estrecho. No se probaron dispositivos físicos.

## Tamaño común de marcadores: 9/10/2026

Ambos marcadores usan un marco visible de 160 x 56 px, con ancho reducido por igual si el espacio disponible es menor. El espacio de encabezado permanece de 70 px para conservar la alineación de contadores. CSS compensa los márgenes transparentes de los PNG actuales: estándar (191,136)-(1991,632) en 2181 x 721; nigromante (69,105)-(1840,719) en 1908 x 824, medidos con alfa >=128. Los originales no se modifican; si se sustituyen por imágenes con otros márgenes, revisar estas compensaciones. QA de navegador comprueba igualdad de ancho/alto y alineación en cuatro viewports, recuperación, cuota, pestañas y offline. Capturas horizontal y estrecha revisadas visualmente.

## Separador de muralla: 9/10/2026

Muralla nevada con almenas suministrada por el usuario como fondo `repeat-x` en `last-section::before`, después del estado del mazo y antes del título Última tanda. Alto visible 44 px, PNG centrado y proporcionado a 104 px de alto, sin modificar el original. La franja verde se conserva entre Última tanda y Fijados. Recurso incluido en preparación y caché offline. Pasaron las tres pruebas de recursos y el QA ampliado `scripts/verificar-separador.mjs`, con cuatro viewports, ambos recursos decodificados, geometría, offline y guardado intacto. Capturas `separador-muralla-*.png` revisadas en horizontal y teléfono estrecho; sin validación en dispositivos físicos.

## Configuración compacta: 9/10/2026

Ventana de configuración ampliada a 860 px, limitada por el viewport. Zombis comunes del Core muestran una fila por tipo, sin desplegable interior: tipo seguido de Fácil y Normal, cada uno con cantidad y checkbox al final. La dificultad se toma del campo confirmado del catálogo, no del nombre. En pantalla estrecha el nombre pasa a una línea superior; las dos opciones conservan su orden y se acomodan sin desbordar. Filtros en cuatro columnas desde 640 px. Cajas siguen desplegables; recursos pendientes y demás filtros conservan su funcionamiento. IDs, cantidades, selección, guardado y motor sin cambios.

Pasaron 17 pruebas focalizadas, incluidas tres nuevas en `tests/contenido-compacto.test.js`, y QA de contenido y general en Chrome aislado: cuatro viewports, ancho ampliado, opciones horizontales, selecciones/cajas, salida sin guardar, cuota, recarga y offline. Capturas `contenido-compacto-*.png` revisadas en horizontal y teléfono estrecho. No se probaron dispositivos físicos ni se repitió la batería completa por este cambio visual.

## Desfijados ocultos por defecto: 9/10/2026

La aplicación inicia con los desfijados ocultos y botón Mostrar desfijados (`aria-expanded=false`), también al recargar. Alternar sigue siendo un estado visual de la sesión y no modifica el guardado. Las cartas desfijadas se conservan y se pueden mostrar/refijar. QA específico pasó en cuatro viewports, incluyendo alternancia, refijación, recarga offline y bytes de partida intactos. La prueba de nigromantes ahora abre explícitamente la franja antes de refijar.

## Proporciones de Última tanda: 9/10/2026

Título a 24 px y Ver cartas a 16 px con área táctil de al menos 108 x 44 px. Etiquetas de enemigos a la izquierda de cada selector, alineadas verticalmente, sin estirar selectores en pantallas grandes. Selectores de hasta 200 px, suficientes para la opción visible más larga; ambos usan los mismos anchos y pueden reducirse en teléfono estrecho. En escritorio todo queda en una fila; hasta 1000 px los selectores pasan a una fila inferior, envolviéndose en teléfono sin separar etiqueta y control. No cambia ninguna opción, acción ni persistencia.

QA de acciones por defecto ampliado a cinco viewports (incluido escritorio 1440 x 900), con medidas de texto de las cinco opciones, alineación de etiquetas, título/botón, guardado, cuota y offline. Capturas `acciones-*.png` revisadas en horizontal, teléfono estrecho y escritorio. Sin validación en dispositivos físicos.

## Formato horizontal de todo el contenido: 9/10/2026

El formato compacto es común a todas las cajas y los cuatro filtros, no solo al Core: nombre, información confirmada/cantidad y casilla al final. Zombis comunes conservan Fácil antes de Normal; abominaciones y nigromantes muestran su copia única sin dificultad; Otros conserva cantidad y obligatoriedad. Expansiones pendientes aparecen como filas, sin desplegable por tipo, cantidades inventadas o habilitación. Ayudas usan la misma estructura visual con estado y botón de consulta, sin casillas ficticias. Desplegables de cajas/ayudas conservados. Sin cambios en motor, datos ni selección.

Pasaron 20 pruebas focalizadas, incluidas tres nuevas que comprueban el formato de secundarios, Otros y pendientes. QA de contenido ampliado a los cuatro filtros con todas las cajas habilitadas y cuatro viewports, además de selección, guardado, cuota y offline; QA general también pasó. Capturas `contenido-unificado-*.png` revisadas en tablet, horizontal y teléfono estrecho. No se repitió la batería completa ni se probaron dispositivos físicos.

## Revelación procedural: 9/10/2026

Implementada como presentación transitoria en `dist/revelacion.js`, sin modificar motor ni formato guardado. Primero N iniciales, luego inserciones individuales en orden visual y profundidad. Se completa cada cadena antes del siguiente origen; elecciones solo en el pendiente actual. Marcas y acciones se difieren visualmente. Durante la presentación se ocultan las miniaturas/fijados y contadores del fondo que podrían adelantar resultados. En una pausa manual siguen disponibles las acciones del origen actual y de cartas ya resueltas.

Cada derivada espera los 420 ms de volteo de la anterior. Iniciales conservan el intervalo de 240 ms. Cerrar, recargar, actualizar desde otra pestaña o activar movimiento reducido cancela los temporizadores y muestra el resultado guardado sin repetirlo. Guardado automático completo desde SPAWN; manual al elegir; movimientos de presentación no escriben estado ni sortean. Si el cierre no puede guardarse, se reabre la tanda completa. Anular durante la secuencia limpia la presentación y restaura el estado previo.

Pasaron las 124 pruebas completas, con siete nuevas de orden/visibilidad/pausas en `tests/revelacion.test.js`. QA `scripts/verificar-revelacion.mjs`: automático con cadena anidada, manual, inserciones medidas una a una, fondo sin spoilers, cuatro viewports, recarga/cierre durante secuencia, anulación, cuota, movimiento reducido y offline. También pasaron QA de abominaciones, nigromantes y volteo, adaptados a esperar las etapas. Capturas `procedural-*.png` revisadas en iniciales y primera inserción. No se probaron dispositivos físicos.

## Contratapa suministrada: 9/10/2026

La imagen «Contratapa Mazo - La tormenta oculta la horda.png» sustituye al reverso negro con signo de pregunta en iniciales y derivadas. Fondo CSS centrado con `contain`, sin estirar/recortar ni modificar el original. Copia íntegra y precarga offline por preparación; sin cambios a presentación procedural, reglas o guardado. Pasaron tres pruebas de recursos y QA de volteo con imagen decodificada, tres viewports, movimiento reducido, recuperación y decodificación offline de la contratapa. Capturas de reversos de abominación/nigromante revisadas visualmente. No se repitió la batería completa ni se probaron dispositivos físicos por este cambio de recurso.

## Resolución intercalada por carta: revisión del 9/10/2026

Ubicaciones de secundarios y devolución del 12/10/2026: versión 2 del mazo secundario mantiene `remaining`, `descarte` y `trofeos`, con fijados como presencia. Ya no se reinician identidades en juego; si todo está fijado/retirado, el spawn se resuelve como activación adicional. Confirmados por Excel tres trofeos: Amaterasu, Hachiman y Red Hare. La X derrota: normales al descarte, trofeos fuera del sorteo; habilidad/superviviente siguen en la mesa. Botón de devolución en detalle para ambos mazos, confirmación universal y aviso específico para trofeos. Aceptar desfija; refijar excluye del sorteo; nigromante sincroniza su contador sin borrar la general histórica. Cancelaciones/regeneraciones no equivalen a derrota; anular tanda conserva respaldo completo. Migración explícita de secundarios v1, conservando duplicados históricos sin crear nuevos.

Verificación: 142 pruebas completas aprobadas, 13 nuevas sobre ubicaciones, trofeos, fallback, devolución, refijado, contadores, migración (incluidos trofeos ya desfijados) y cuota. Pruebas antiguas de ciclos/duplicación se conservan explícitamente para v1. QA `scripts/verificar-devolucion.mjs`: normal, trofeo y nigromante, confirmación/cancelación, advertencias, desfijado/refijado, cuota y recarga offline. Sin prueba física en dispositivos. Expansiones de spawn e interfaz Fácil/Estándar siguen pendientes de integración; este cambio se limita a secundarios.

Problema previo de recursos detectado: Kijin corregido -18 falta en recursos y Kijin -13 tiene contenido distinto del inventario. Preparación conserva únicamente copias existentes en dist que coincidan exactamente con SHA-256 inventariado, con advertencia; no modifica ni restaura los originales del usuario. Prueba de preparación también valida estos respaldos, manteniendo el error si ninguna copia coincide. Este pendiente de Kijin quedó resuelto por la confirmación posterior descrita abajo.

## Kijin: imagen única actual (12/10/2026)

El usuario confirmó que dejó una sola imagen y fila actual. El Excel apunta a `04 - Mazo Abominaciones ESP/Carta Kijin de Zombicide-13.png`; el archivo actual tiene 1004x1566 píxeles, 2087774 bytes y SHA-256 `037bc13b2ea3b3c04d61cf41d05c4c9bd482b978a82334c54b27985793481b7c`. Revisado visualmente. Se actualizó el catálogo a esa ruta, sin variantes, conservando `enemigo-kijin` y cantidad 1. La entrada -18 y su copia publicada se retiraron. No se modifica el Excel ni las reglas especiales.

El inventario y precarga contienen ahora 53 recursos clasificados; preparación copia exactamente la imagen actual sin advertencias. La migración sustituye exclusivamente la ruta antigua de Kijin en el mazo guardado y su respaldo de tanda, sin alterar historial, fijados ni disponibilidad. Las rutas desconocidas siguen rechazándose. Validación: 144/144 pruebas, incluidos dos casos nuevos de migración; `scripts/verificar-kijin.mjs` comprobó en Chrome aislado imagen actual, partida con ruta antigua, detalle y recarga offline. Sin cambios en el almacenamiento ni pestañas del usuario y sin prueba física en dispositivos.

Encabezado del 11/10/2026: Configuración reemplaza visualmente a «Guardado local» y se retira de las herramientas junto a los contadores. Estado de guardado conservado como región accesible no visible; errores continúan en avisos visibles. CSS adaptable a 320 px, con etiqueta de mazo en segunda fila y engranaje a la derecha. Verificado en Chrome aislado a 1440, 844, 390 y 320 px: sin solapamientos, botón táctil, apertura/cierre y aviso por fallo de cuota. Captura de 320 px revisada; sin cambios a persistencia. El limitador de nigromantes permanece pendiente de aclarar su comportamiento al alcanzar el máximo.

Corrección de marcos del 11/10/2026: se sustituyen por «Marco arcano verde para carta necromántica-1.png» y «Marco rojo fracturado para carta-2.png». La carta ya no se reduce: área de botón de 155 px en Aparición, imagen completa en flujo normal y miniatura de 104 px en Última tanda. Marcos exteriores proporcionales (152% verde, 142% rojo), con espacio adicional horizontal/vertical, sin invadir etiquetas ni controles. Aparición usa filas flexibles y parejas verticales en pantallas estrechas, con flecha descendente; no se modifica motor, revelación ni guardado. Los originales antiguos se conservan en recursos, pero la app y su precarga usan los nuevos. Esta corrección sustituye el criterio anterior de encajar carta y marco dentro de una sola carta. Pasaron tres pruebas de recursos y QA de marcos en cinco tamaños, incluidos 320 px, zoom y offline; se verifican medidas completas y separación de etiquetas/controles. Capturas de tablet y móvil estrecho revisadas. Sin prueba en dispositivos físicos.

Marcos de enemigos: «Marco esmeralda para carta nigromante-1.png» y «Marco carmesí de energía para Abominación-2.png» en secundarias de Aparición y miniaturas de Última tanda. Asignación por mazo, sin marcos en spawn generales, historial o En juego. Marco completo y carta completa dentro de su abertura, ambos con `contain` para conservar proporción; el marco sigue el área de carta centrada cuando el botón es más ancho. La carta se reduce visualmente para mostrar la decoración completa, sin recortar contenido; el zoom conserva su imagen original. Superposición decorativa sin interceptar clics, dentro del frente animado para no anticipar el enemigo mientras está boca abajo. PNG originales intactos, incluidos en preparación y caché offline. Sin cambios de tiempos, reglas o guardado.

Validación de marcos: tres pruebas de recursos aprobadas, copias íntegras incluidas en SW; QA `scripts/verificar-marcos.mjs` verifica ambos tipos, cuatro viewports, Aparición y Última tanda, zoom y decodificación offline. QA de volteo también aprobado: derivadas, guardado estable, reapertura sin repetir, movimiento reducido y tres tamaños. Capturas de Aparición en tablet y Última tanda horizontal revisadas. No se repitió batería completa ni se probaron dispositivos físicos.

Distintivos en En juego: nigromantes con «Estandarte esmeralda del nigromante-1.png» y abominaciones con «Banderín rojo de abominación-2.png». Asignación por `mazo` o tipo confirmado del catálogo, nunca por nombre. Solo en cartas actualmente fijadas, no en historial, miniaturas ni desfijados. Altura visible del 20% del área de imagen de la carta, margen izquierdo de 4 px y superior de 0 px. Ventana CSS compensa márgenes transparentes de los PNG sin alterar los originales ni deformar su proporción. Superposición no intercepta clics ni modifica la hitbox de desfijar. Recursos de interfaz controlados e incluidos por preparación en la caché offline.

Validación de distintivos: tres pruebas de recursos aprobadas, incluida copia íntegra de ambos archivos. QA `scripts/verificar-distintivos.mjs` confirma ambos tipos (incluido Ostokar), dimensiones, posiciones, proporción, cuatro viewports, zoom, desfijar y decodificación offline. Captura de tablet revisada visualmente. Sin cambios de motor, reglas o guardado; no se repitió la batería completa ni se probaron dispositivos físicos.

Ajuste visual de En juego: el botón de desfijar muestra solo la X junto a la esquina superior derecha, sin círculo, fondo ni borde. Conserva área táctil de 44 x 44 px, título accesible y foco de teclado visible. Cambio acotado a `.unpin:not(.repin)` en `dist/style.css`; el botón de volver a fijar conserva su aspecto. QA `scripts/verificar-desfijar.mjs`: escritorio, móvil horizontal/vertical y tablet, geometría de la X, hitbox, hover transparente, foco y acción persistida tras recarga. Sin cambios de reglas ni motor; no se repitió la batería completa por este ajuste CSS ni se probaron dispositivos físicos.

Actualización posterior de tiempos: las iniciales giran durante 700 ms; las secundarias y las generales derivadas durante 1000 ms. La activación adicional se presenta con sello animado y espera exclusiva de 1000 ms. En combinado se termina esa etapa antes de insertar/girar el enemigo; no cambia motor, RNG ni guardado. Las elecciones tras reabrir usan el mismo orden sin repetir giros anteriores. Movimiento reducido omite estas esperas.

Validación de tiempos: 129 pruebas completas aprobadas, cinco nuevas sobre duración/activación combinada/reapertura/reducido. QA de acciones por defecto comprueba duraciones CSS de 0.7 s y 1 s, fase exclusiva de activación, enemigo ausente durante ella, elección combinada tras reapertura y guardado estable para ambos tipos. QA procedural comprueba intervalos por tipo, cadenas, pausa manual, cuatro viewports, cuota, anulación, recarga/cierre y offline. Sin verificación en dispositivos físicos. Los párrafos siguientes conservan el registro de la implementación previa de 420 ms.

Se conservan los N reversos iniciales, pero ahora se voltea/resuelve cada origen y toda su cadena antes de voltear el siguiente. Sustituye el comportamiento anterior de voltear todas las iniciales primero. `reveladas` en el plan visual distingue cartas visibles por el reverso de las que ya iniciaron su giro. Clase `por-revelar` mantiene contratapa, nombre oculto e inactividad en las iniciales siguientes. Todos los giros son seriales de 420 ms; no se adelanta el segundo origen mientras haya derivadas o una elección pendiente del primero. Motor, RNG, guardados y reapertura sin repetir permanecen intactos.

Las siete pruebas de planificación se actualizaron y pasaron las 124 pruebas completas. QA procedural verifica el orden real de todos los volteos (iniciales y derivadas), con cadena anidada, pausa manual que mantiene las siguientes boca abajo, cuatro viewports, cuota, anulación, cierres/recarga y offline. QA de volteo/contratapa también pasó. Capturas de primera inserción y reversos iniciales revisadas. El servidor local, que estaba apagado, se inició oculto en el mismo origen `http://127.0.0.1:8080/mazo/`; no se cambió el origen ni la partida del usuario. Sin prueba en dispositivos físicos.


