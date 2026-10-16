# Criterios de aceptación

## Contador de zombis generados: 15/10/2026

Punto 13 reformulado e implementado: botón Zombis a la derecha de adrenalina. Abre una ventana con total oculto siempre al abrir y control Mostrar/Ocultar, ajustes individuales −1/+1/+5/+10 e historial manual inverso, con unas cinco filas y scroll. El encabezado no publica el total. No requiere usuarios ni sesiones por jugador; cada pulsación queda como entrada con fecha, tanda y adrenalina, sin subtotal ni acumulado en el historial.

Conteo automático puro desde extracciones vigentes: cantidades numéricas del catálogo según la adrenalina congelada de cada tanda; cada identidad secundaria Daily/abominación/nigromante añade una unidad. No suma activaciones, referencias, descartes ni anulaciones, y retirar una miniatura/fijación no borra un zombi ya generado. Regenerar sustituye el aporte y anular tanda restaura el estado previo, incluidos los ajustes manuales posteriores al respaldo. Ajustes manuales solo corrigen/extras; no se descuentan bajas. Total no negativo. Asedio y otras cantidades no determinadas, acompañantes de reglas especiales y reposiciones como terracota se añaden manualmente: no se infieren reglas desde texto ni se automatiza el punto 9.

Persistencia: campo opcional ajustesZombis validado, guardados existentes sin campo aceptados y sin reinicio/migración destructiva; reconstrucción de totales sin guardar acumulados redundantes ni repetir RNG. Nueva partida reinicia el registro. Usa guardarAccion para guardar atómicamente, manejar cuota y detectar cambios de otra pestaña; respaldo de tanda incluye el registro. Mostrar/Ocultar es presentación local, se restablece a oculto al abrir y al recargar. Los ajustes no alteran catálogos ni mazos. Nuevo contador-zombis.js incluido en caché offline.

Validado: 13 pruebas originales; 264/264 pruebas de proyecto (7 nuevas de conteo, niveles, Daily, activación, regenerar, descartar, anular, validación y persistencia). Chrome en cinco tamaños con total oculto, sumas, corrección, historial scroll, recarga offline y nueva partida; fallo de cuota conserva estado. Regresión de configuración durante partida aprobada, incluidos cambios entre pestañas y anulación. Scripts verificar-contador-zombis.mjs y verificar-configuracion-partida.mjs; capturas contador-zombis-*.png. Sin dispositivos físicos. Estadísticas de eliminados, desgloses e identidades de jugadores no forman parte de esta implementación.


## Vista de aparición actualizada: 14/10/2026

Punto 26 completado con los originales suministrados: marcador rojo con número blanco centrado sobre cada carta revelada en una zona estándar, y marcador verde sin número sobre las cartas de la zona del Profanador. Las secundarias y referencias de activación conservan el marcador de su zona real, independiente del tipo de enemigo. Misma identificación en Última tanda e Historial. Retirados encabezados textuales, líneas agrupadoras y flecha del nigromante hacia su zona; se conserva la flecha entre carta genérica y enemigo. No cambia el motor ni los datos de partida.

Validación: 13 pruebas originales; comprobación de tokens en cinco tamaños de Chrome, zoom, historial/última tanda, recarga offline y guardado intacto. Capturas en docs/verificacion/tokens-zonas-*.png; script scripts/verificar-zonas.mjs. Sin prueba en dispositivos físicos. Esta presentación prevalece sobre las descripciones históricas de líneas y segunda flecha.


## Modos de enemigos (14/10/2026)

- Seis modos seleccionables; Personalizado por defecto en ambos mazos. Guardar prepara modos, identidad y contenido para próxima tanda, conservando la tanda existente y enemigos presentes.
- Profanador obligatorio/prioritario, incluso con cupo completo de adicionales. Estándar no incluye otros nigromantes; Varios activa únicamente al Profanador y luego aparece otro candidato.
- Adicionales sin zona. Contador verde igual a presencia del Profanador; retiro/refijado actualiza la zona sin borrar historial. Cancelación del origen revierte su árbol de derivación.
- Robo/resolución de la nueva zona del Profanador después de las iniciales; en animación espera boca abajo. Activación no dispara otro robo de zombis.
- Referencias con sello sobre los destinatarios, zoom y sin acciones que creen nuevas instancias; historial/última tanda coherentes. Sin doble contabilización.
- Personalizado sin Elegir en el momento. Acciones congeladas por tanda y controles bloqueados durante Aparición; regeneraciones/reemplazos no adoptan cambios posteriores.
- Nigromantes: cinco acciones, azar general uniforme y azar del 50% independiente por adicional. Sin cupo/candidatos no se sortean acciones con spawn; resultados persistidos sin RNG por recarga/render.
- Topes exclusivos de Personalizado: adicionales 0/0/1/1 con espacio separado del Profanador y abominaciones 1/2/3/4. Perfil no decreciente y presencia conservada si excede un nuevo tope.
- Estándar de abominaciones permite escoger una apta marcada en colección, excluye trofeos y respalda con Kan si no hay ninguna. Con varias presentes al cambiar de modo, solo activa hasta quedar vacío. Festival activa todas antes de la aparición.
- Retirar una carta/caja excluye candidatos, no presencia ni referencias históricas. Reactivar un trofeo derrotado nunca lo devuelve al mazo; reinicio usa únicamente descartes activos. Valores personalizados se conservan al alternar modos e iniciar nueva partida.
- Partidas de prueba anteriores se reinician una vez con configuración conservada y guardado atómico; recargas siguientes conservan la nueva partida. Cuota, concurrencia, anulación y offline mantienen sus garantías, incluidos ajustes pendientes.
- QA en cinco tamaños con cartas/marcos completos y controles dentro del viewport; dispositivo físico pendiente. Corrupción, compatibilidad por carta y tokens fuera del cambio.

## Presentación de zonas y marcos (puntos 10, 11 y 14)

- Una cabecera y línea inferior por grupo de zona en Aparición, historial y última tanda; las secundarias amplían el mismo grupo.
- Nombres derivados calculados desde relaciones estables, sin sufijos visibles -2/-3 ni cambios de IDs, etiquetas almacenadas, consumos o estado al renderizar/redimensionar.
- Flecha general → nigromante conservada y flecha nigromante → general de su nueva zona visible solo cuando ambos extremos han sido revelados. Cadenas y cancelaciones mantienen las relaciones correctas.
- Flechas sin cruces sobre imágenes/marcos ni interferencia con botones, tanto en filas como apiladas. Sin desbordamiento horizontal en los cinco tamaños verificados.
- Reserva superior según marco y escala; durante la revelación no anticipa el tipo de carta. Imágenes principales de 155 px y miniaturas de 102 px completas, marcos sin recortes y controles accesibles.
- Recarga offline conserva presentación y partida; rechazo por cuota y anulación mantienen las garantías existentes. Navegador aislado verificado; dispositivos físicos pendientes.

Los casos de ampliación se concretan con las decisiones aprobadas antes de programarse. Este listado no autoriza las propuestas de reglas pendientes.

## A. Base y mazo general

| ID | Caso | Resultado |
|---|---|---|
| A01 | Partida nueva con Fácil y Normal | 12 tipos, 56 copias; restantes = iniciales. |
| A02 | Solo Normal / solo Fácil | 42 copias en ambos casos; excluidas no se sortean. |
| A03 | Sin Fácil ni Normal | 28 copias sin categoría. |
| A04 | Recorrer los 56 tickets de una primera extracción | Cada tipo recibe exactamente sus copias iniciales de tickets. |
| A05 | 56 robos con umbral 0 | Cantidades reveladas coinciden con el mazo; después se reinicia una vez. |
| A06 | Mazo de 28, umbral 25%, quedan 7 | No se reinicia por igualdad. |
| A07 | Caso anterior, siguiente robo deja 6 | Reinicia; extracción conserva ciclo anterior. |
| A08 | Reinicio dentro de una tanda de varias zonas | Las siguientes cartas usan el nuevo ciclo; no se pierde tanda ni contadores. |
| A09 | Regenerar | Original consumida/descartada; consume una nueva; misma zona/tanda. |
| A10 | Descartar sin robar, repetido dos veces | No hay consumo extra ni cambio de contador; X roja persistente. |
| A11 | Regenerar una posición ya descartada | Nueva extracción válida en la posición; historial conserva previas. |
| A12 | Tres zonas normales; `+` blanco en Aparición | Zona 4, una copia consumida y contador normal = 4. |
| A13 | `+` verde en Aparición | Una copia general consumida; aumenta solo contador verde y su secuencia. |
| A14 | `+`/`−` del encabezado | Solo ajusta contador; nunca negativo; no roba. |
| A15 | Ambos contadores en 0 | SPAWN no crea tanda vacía ni consume cartas. |
| A16 | Contadores 3 normales y 2 nigromante | Tanda de cinco cartas con tipos y orden correctos. |
| A17 | Cambiar dificultad en configuración | No altera la partida vigente; sí la nueva. |
| A18 | Cambiar umbral durante partida | Cambia evaluación para siguientes robos; no borra registros. |
| A19 | Reinicio anticipado | No reinicia secundarios ni borra presencia/fijados/elecciones. |
| A20 | Composición futura completamente vacía | No sortea una carta ficticia; UI explica falta de cartas elegibles. |

## B. Referencias e interfaz

| ID | Caso | Resultado |
|---|---|---|
| B01 | Fijar dos veces misma extracción | Una referencia, sin consumo. |
| B02 | Dos extracciones distintas del mismo tipo | Instancias independientes. |
| B03 | Desfijar A y después C | Fijados restantes a la izquierda; Desfijados C, A. |
| B04 | Re-fijar C | Sale de Desfijados; queda una referencia activa. |
| B05 | Desfijar nigromante con verde = 0 | Sin pregunta; contador sigue en 0. |
| B06 | Verde > 0: Sí / No / Cancelar | Resta 1 / conserva / no realiza ningún cambio. |
| B07 | Fijar desde historial | Misma instancia y comportamiento que Aparición. |
| B08 | Abrir/cerrar zoom e información | No roba ni cambia contadores/presencia; vuelve al contexto previo. |
| B09 | Carta con varias ayudas | `ⓘ` muestra todas sus referencias y zoom funciona. |
| B10 | Carta sin ayuda | No muestra una acción de información vacía. |
| B11 | Muchos fijados/descendientes | Controles accesibles con desplazamiento; imagen completa. |
| B12 | Teléfono horizontal, vertical y tablet | Sin recortes de controles, foco/labels correctos y áreas táctiles utilizables. |
| B13 | Cerrar ventana superior con X/Escape | No cierra también la tanda subyacente. |

## C. Catálogo y contenido

| ID | Caso | Resultado |
|---|---|---|
| C01 | Desplegar Juego/Core/Expansión/Tipo | Solo muestra entradas de ese grupo, conservando selección. |
| C02 | Imagen con cantidad pendiente | Puede consultarse; no participa en sorteo. |
| C03 | Carta con dos etiquetas de selección | No suma sus copias dos veces. |
| C04 | Enemigo de otro juego seleccionado | No añade por eso todo el Core del juego de origen. |
| C05 | Green Horde sin datos completos | No ofrece un mazo de cantidades inventadas. |
| C06 | Actualizar catálogo durante partida guardada | Mantiene composición/versionado o solicita migración explícita. |
| C07 | Traducción y original | Rutas correctas y versiones conservadas; no se declara automatizada una regla por OCR. |
| C08 | Dos formas de Mumm-Ra | IDs separados; no selección confundida por un nombre parecido. |

## D. Secundarios y presencia, tras cerrar decisiones

| ID | Caso | Resultado |
|---|---|---|
| D01 | No hay enemigo del tipo presente | Se muestra selección concreta; conserva origen general; sin segunda copia general por sustituir imagen. |
| D02 | Hay presencia, opción de activación | No roba secundaria; conserva genérica y registra resolución. |
| D03 | Elección con dos botones visibles | No consume secundaria hasta elegir aparición. |
| D04 | Doble pulsación en opción / recarga después de elegir | La resolución ocurre una sola vez. |
| D05 | Nigromante activo vs desfijado | Solo fijados/presencia aprobada afectan resolución. |
| D06 | Carta descartada/anulada conservada como referencia | No ejecuta efectos ni cuenta como enemigo válido. |
| D07 | Abominación nueva | Nunca aumenta contador verde ni crea robo general extra. |
| D08 | Sin candidatos secundarios elegibles | Mensaje y resolución pendiente; no consumo/fijado inventado. |
| D09 | Agotamiento de secundario | Cumple el modo aprobado y no restaura el general. |
| D10 | Varias genéricas del mismo tipo en una tanda | La presencia evaluada en cada resolución refleja acciones ya aceptadas; no reevalúa lo resuelto. |
| D11 | Fijación automática o manual | Cumple D01 de pendientes; fijación no añade otra zona. |
| D12 | Regla especial no automatizada | Referencia y resolución manual; no promete movimientos simulados. |

## E. Derivadas, después de cerrar su política

| ID | Caso | Resultado |
|---|---|---|
| E01 | Opción conjunta en Zona 2 con nigromante presente | Orden Zona 2 → Zona 2-2 enemigo → Zona 2-3 general → Zona 3. |
| E02 | Activación simple en Zona 2 | No extrae enemigo ni crea Zona 2-3. |
| E03 | Primera aparición sin presencia | No añade por analogía el bloque 2-2/2-3 reservado al caso conjunto. |
| E04 | Insertar derivadas delante de otras cartas | IDs y acciones de las siguientes siguen apuntando a la carta correcta. |
| E05 | Descartar origen | Se retira solo su subárbol de Aparición; original con X. |
| E06 | Regenerar origen | Anula subárbol anterior, conserva original en historial y coloca nueva extracción sin duplicar efectos. |
| E07 | Dos orígenes con derivados | Cancelar uno conserva el otro completo. |
| E08 | Cancelar dos veces el mismo origen | No hay segunda devolución/descuento/anulación. |
| E09 | Spawn generado ya reducido/desfijado | No se resta dos veces ni queda negativo. |
| E10 | Fijado descendiente de origen cancelado | Cumple política D12 y no queda presencia huérfana. |
| E11 | Robo Zona 2-3 cruza el umbral general | Reinicio correcto; conserva relación padre/raíz y secundario. |
| E12 | Cadenas anidadas | Política aprobada de recursión/confirmación; cancelación del subárbol completo. |
| E13 | Nueva tanda después de generar un spawn | Cuenta solo zonas persistentes acordadas; la carta secundaria no es una zona. |
| E14 | Recargar a mitad de elección/derivación | Restituye exactamente el árbol y pendiente, sin ejecutar sorteos nuevos. |
| E15 | Cancelación tras ajustes manuales | Cumple política de aportes aprobada; conserva ajustes de otros orígenes. |

## F. Persistencia y entrega

| ID | Caso | Resultado |
|---|---|---|
| F01 | Cerrar/reabrir/recargar durante Aparición | Misma tanda, IDs y restantes; no roba otra vez. |
| F02 | Fallo de almacenamiento durante acción | Conserva estado previo; no muestra éxito de una acción incompleta. |
| F03 | Estado v1 guardado con/sin `unpinned` | Migra sin perder historial/fijados ni inventar identidades. |
| F04 | JSON corrupto/estructura inválida | Error recuperable; no sobrescribe automáticamente los datos existentes. |
| F05 | Confirmar/cancelar nueva partida | Reinicia lo acordado / conserva íntegro el progreso. |
| F06 | Publicación en `/repositorio/` | Todos los módulos, imágenes, manifest y SW funcionan dentro de la subruta. |
| F07 | Sin red tras descarga completa | SPAWN, historial, zoom, referencias y recuperación funcionan. |
| F08 | Actualizar app con partida vieja | No mezcla versiones de código/estado ni borra progreso. |
| F09 | Respaldo importado desde Sites, si se implementa | Validación y confirmación antes de reemplazar; mantiene IDs y cartas de v1. |
| F10 | Abrir copia local del paquete | Base funcional y pruebas existentes pasan; no requiere credenciales de Sites. |

## G. Abominaciones aprobadas el 8/10/2026

- Primera aparición conserva la general y añade una secundaria auto-fijada con la misma zona.
- Siguientes spawns con presencia muestran las dos elecciones; activación no roba y doble pulsación no duplica resolución.
- Sin reposición recorre identidades y reinicia al agotarse. Con reposición permite repetición. General independiente.
- Descartar/regenerar origen devuelve y desfija solo sus secundarias; nunca devuelve la general.
- Secundaria sin descarte; regeneración devuelve anterior y no consume general. Se permite salir la misma identidad.
- Cancelación del último robo agotado restaura el ciclo si no hay robos posteriores; cancelación antigua no duplica una identidad consumida por otro origen del ciclo vigente.
- Desfijados/anulados no dan presencia; anulados no pueden volver a fijarse, pero quedan consultables.
- Recarga, cuota fallida y actualización no repiten sorteos ni pierden relaciones. v1/v2 antiguos conservan su partida sin activar secundarios retroactivos.
- Cambiar modo se aplica en una nueva partida, conservando modo/catálogo vigente hasta entonces.

El reporte de comprobaciones y las limitaciones se mantienen en IMPLEMENTACION_ACTUAL.md. El bloque H concreta los criterios vigentes de nigromantes.

## H. Nigromantes aprobados el 8/10/2026

- Primera aparición conserva origen, fija secundaria y roba general inmediata de su zona nueva; orden origen/enemigo/spawn.
- Activación adicional no roba. Opción conjunta selecciona/fija y roba una general una sola vez, también dentro de cadenas.
- Otro nigromante en el spawn derivado requiere elección; no inicia un bucle automático.
- Contador siempre coincide con fijados válidos. Desfijar/refijar ajusta sin preguntas y sin repetir sorteo resuelto.
- Sin controles manuales de contador/zona verde en partidas nuevas. Normales conservan sus controles.
- Nuevas tandas usan las zonas presentes al comenzar; las apariciones de esa tanda se atienden con sus robos inmediatos sin duplicarlos.
- Cancelar un origen devuelve/desfija todo su árbol secundario, incluidas abominaciones; no devuelve generales ni afecta otros orígenes.
- Secundaria sin descarte; regenerar anula árbol anterior y genera nuevo enemigo/spawn con la misma regla.
- Historial, recarga, cuota fallida, pestañas y offline conservan parentesco, elecciones y contador. Catálogo/modo congelados; antiguos v1/v2 permanecen intactos hasta nueva partida.
- Misma reposición/reinicio de abominaciones. Reglas particulares/Death Notes no se automatizan por imágenes.

## I. Presentación de spawn resuelto

- Spawn con enemigo revelado: zona tachada, imagen gris y flecha hacia su secundaria; ambas cartas permanecen juntas en pantallas estrechas.
- Elección pendiente: imagen sin filtro ni sello. Activación adicional: sello sobre la imagen, sin gris ni flecha.
- Las señales se recuperan desde la resolución guardada; renderizar, consultar historial o recargar no roba ni modifica contadores.

## J. Anular tanda aprobado el 9/10/2026

- «Anular tanda» reemplaza el botón normal de añadir zona en Aparición y requiere confirmación. Cancelar conserva la tanda.
- Confirmar restaura todo el estado previo a SPAWN, incluidos cantidades/ciclos de los tres mazos, fijados, desfijados, contadores e historial; no deja referencias nuevas de la tanda anulada.
- Cierra Aparición; la anterior pasa a ser la última tanda o queda la vista inicial si no existía otra. Se pueden ajustar zonas y revelar de nuevo.
- Funciona al reabrir la última tanda, después de recargar y offline. Se mantiene un único respaldo, sin anular tandas anteriores sucesivamente.
- Una tanda antigua sin respaldo permanece intacta, con anulación deshabilitada. El siguiente SPAWN crea el respaldo sin exigir nueva partida.
- Cuota fallida conserva todo, incluido el respaldo. Datos corruptos no se borran. Cambios externos invalidan la confirmación abierta.

## K. Colección y selección de contenido

- Core obligatorio; base normalizado a Core en el Excel. Core retrocompatibilidad conserva un grupo distinto.
- Colección filtra cajas con checkboxes; las cartas de una caja deshabilitada no se muestran ni participan en la próxima partida.
- Cuatro filtros de selección única: Zombis, Abominaciones, Nigromantes y Otros. Cambiar filtro/caja no borra otras selecciones.
- Marcar/desmarcar todo actúa solo sobre el filtro actual y las cartas operativas, no obligatorias, de las cajas habilitadas. No habilita expansiones o ayudas pendientes.
- Otros conserva sus seis tipos y 28 copias marcados/bloqueados, también al desmarcar todos los zombis comunes.
- Selección de secundarios por ID y catálogo congelado al iniciar; la partida actual no cambia al guardar preferencias.
- Inicio bloqueado y motivo visible si un mazo secundario necesario queda vacío; borrador guardable.
- X y Escape con cambios ofrecen salir, volver o guardar. Solo cambiar el filtro no pide confirmación. Cuota fallida conserva partida y borrador.

## L. Volteo automático

- SPAWN muestra la contratapa suministrada, completa y sin distorsión, con giro automático en orden visual, sin clic para revelar.
- Elecciones de spawn animan solo los enemigos y generales derivados nuevos; no repiten las cartas anteriores.
- Nombre y controles de la carta quedan ocultos e inactivos durante su volteo.
- Guardado completo antes de la animación; finalizarla no cambia cantidades, historial ni fijados.
- Cerrar/reabrir y recargar muestran el resultado sin volver a animar ni robar.
- Movimiento reducido omite el giro. Diseño verificado en móvil horizontal/vertical y tablet en navegador.

## M. Acciones por defecto

- Dos selectores independientes con cinco opciones y valor inicial Elegir en el momento.
- Azar uniforme entre activación, spawn y combinado; RNG inyectable, sin sorteos al renderizar ni recuperar.
- Sin presencia se genera enemigo automáticamente. Con presencia, spawn puro no muestra sello de activación; combinado sí.
- Nigromantes nuevos siempre fijados, una zona por fijado y robo general inmediato, incluso en aparición automática por defecto.
- Cambios aplicados a futuras apariciones sin alterar historial, pendientes anteriores, consumos o fijados al cambiar selector.
- Elección manual con tres acciones idempotentes; derivadas nuevas conservan volteo automático.
- Guardado/recarga/offline conservan preferencia y resultado. Fallo de cuota conserva selección anterior.
- Cadenas automáticas interminables abortan atomicamente con mensaje, sin pérdida de partida.

## N. Presentación procedural

- Ubicaciones de secundarios: fijados fuera del sorteo, descarte reciclable y trofeos retirados. Sin candidatos, activación adicional sin nueva carta o zona.
- Devolución desde detalle siempre confirmada; advertencia de trofeo solo para los tres casos confirmados. Desfija al devolver y retira del mazo al refijar; sin borrar generales derivadas ya jugadas.
- Guardado atómico, cuota fallida sin cambios, recarga/offline y anulación restauran ubicaciones y contadores. Migración conserva partidas e historial anteriores sin sorteo.

- Iniciales: 700 ms por giro. Secundarias y generales derivadas: 1000 ms por giro.
- Activación: sello animado y espera propia de 1000 ms, antes del enemigo en acciones combinadas; no solapar ni repetir las dos etapas. Verificar también elección tras reabrir.

- Primera fase con exactamente N iniciales según zonas de la tanda; ninguna derivada ni hueco anunciado.
- Voltear y resolver cada inicial, con toda su cadena, antes de voltear la siguiente; las restantes conservan su contratapa y quedan inactivas.
- Resolver de izquierda a derecha en profundidad: enemigo, general de su zona y su cadena, antes del siguiente origen inicial.
- Insertar y voltear una nueva carta a la vez; solo el pendiente actual muestra opciones manuales.
- No adelantar marcas, fijados, miniaturas o contadores del fondo durante la presentación.
- Presentación no consume ni guarda por sí misma; automático guardado desde SPAWN, manual guardado al elegir.
- Cerrar/recargar/actualización externa cancela temporizadores; reabrir muestra el guardado sin repetir robos ni animación.
- Anular durante presentación restaura todo. Fallo de guardado conserva partida; fallo al cerrar reabre la tanda completa.
- Movimiento reducido omite animación y mantiene elección manual.

## Daily Spawn, expansiones y clasificación

- Daily contiene siete identidades únicas, DU02 para Rakshasa, una copia por identidad y caja Frozen Fortress. Ningún enemigo en juego puede repetirse al reiniciar el mazo.
- Cada spawn elegible, incluido Asedio, intenta la probabilidad general; no lo hacen activaciones adicionales ni genéricas de abominación/nigromante. Daily se añade y se fija, sin sustituir zombis ni generar activación adicional al agotarse.
- Incrementos por carta/tanda, reinicio a base tras aparición, máximo 100%, probabilidad efectiva 0 sin candidatos y ausencia de sorteos durante render/recarga.
- Cancelaciones, regeneración, cadenas, devolución/refijado y anulación preservan ubicaciones y probabilidad; fallo de almacenamiento conserva el estado anterior.
- Cinco expansiones completas suman 24 copias; selección por caja/dificultad y selección masiva solo afectan cartas disponibles. Bestias divinas incompleta no entra al sorteo.
- Estándar visible, Normal interno compatible. Partidas previas mantienen su composición congelada. Cambios de Daily se aplican a una nueva partida.

## Selector de adrenalina

- «Nivel de adrenalina» centrado en el encabezado; nombre blanco sobre fondo del color correspondiente y flechas de 44 px, sin solapamientos ni desbordamiento en los cinco tamaños de navegador.
- Partida nueva en Azul, recorrido Azul / Amarillo / Naranja / Rojo; extremos desactivados y teclado operativo.
- Cambio manual guardado sin consumos, nuevos sorteos, modificaciones de historial ni incrementos durante SPAWN. El selector no existe en Aparición y no es accesible detrás del diálogo modal.
- Tanda registra su nivel en SPAWN y conserva ese valor para cartas iniciales, cadenas, elecciones tardías y regeneraciones, aunque se cambie el nivel en la pantalla principal tras cerrar.
- Anular tanda recupera el nivel anterior a SPAWN. Recarga/offline y pestañas del mismo origen conservan el nivel; fallo de cuota conserva tanto estado como presentación anteriores.
- Partidas antiguas sin nivel muestran Azul sin alterar sus bytes al leer ni asignar un nivel ficticio a tandas antiguas. Valores inválidos en partida, tanda o respaldo se rechazan sin borrar datos.
- Integración con topes automáticos completada en el punto 4; estadísticas permanecen fuera de esta etapa. Validación en dispositivos físicos pendiente.

## Daily Spawn por adrenalina

- Configuración muestra cuatro niveles con base (%) e incremento (puntos) editables, ocho entradas accesibles de 0 a 100. Valores inválidos o vacíos bloquean el guardado/inicio. Mantiene selección por colección y modo de incremento por carta/tanda.
- Cambiar de nivel conserva el aumento acumulado y lo suma a la nueva base: 40% (Azul, base 20 + aumento 20) pasa a 50% (Amarillo, base 30 + aumento 20). Cada aporte conserva el incremento del nivel en que ocurrió, sin recalcularlo al cambiar de nivel.
- Una aparición reinicia el aumento a cero; tasa efectiva máxima 100%. El tope no elimina los puntos ganados que pueden volver a observarse al bajar a un nivel con base menor. Sin candidatos: tasa efectiva 0, sin RNG ni duplicados.
- Por carta, incremento por cada fallo elegible; por tanda, incremento único cuando no hubo aparición y se cumplen las condiciones vigentes. Elecciones tardías y cadenas no duplican el incremento.
- Reabrir/regenerar/continuar una tanda usa su nivel guardado, aunque el selector haya cambiado tras cerrar. Historial y probabilidades ya sorteadas se conservan.
- Cancelar/regenerar elimina los aportes de intentos anulados; anular restaura nivel, probabilidad, configuración y mazos. Cuota fallida conserva estado/bytes anteriores.
- Partidas con tasa general mantienen exactamente su progresión y bytes al leer. El formulario repite sus valores anteriores en los cuatro niveles; guardar aplica a la próxima partida y no convierte retroactivamente la actual. Sin valores anteriores: 0/0 por nivel y Daily desactivado.
- Recarga offline y pestañas del mismo origen conservan configuración/probabilidad. Tabla usable en teléfono horizontal/vertical, 320 px y tablet. No altera copias, imágenes, reglas individuales ni políticas de rotación.

## Topes de enemigos por adrenalina

- Defaults confirmados: nigromantes 1/1/2/2 y abominaciones 1/2/3/4. Ocho entradas accesibles y táctiles en Configuración; sin modo/counter de tope manual durante la partida.
- Enteros positivos no decrecientes por familia. Vacíos, cero, fracciones y perfiles decrecientes bloquean guardado/inicio con mensaje; ningún ajuste silencioso de los otros niveles.
- SPAWN registra los dos topes del nivel activo por tanda. Ajustar el perfil se aplica a la siguiente, conservando la tanda abierta/reabierta, sus pendientes y regeneraciones.
- Al alcanzar/superar el tope, genérica muestra activación adicional y aviso «Tope alcanzado», sin RNG secundario/azar de acción, consumo secundario ni zona derivada. Una elección que completa el tope resuelve otros pendientes de esa familia sin nuevas elecciones o sorteos.
- Ambas familias independientes y con conteo desde fijados válidos. Enemigos ya presentes se conservan al bajar adrenalina o editar perfiles; las nuevas apariciones se reanudan solo estando por debajo del tope. Desfijado/devolución/regeneración/cancelaciones conservan sus reglas y la trazabilidad histórica.
- Anular restaura presencia, perfiles y respaldo anteriores; cuota fallida y pestañas desactualizadas no aceptan acciones parciales ni ejecutan RNG antes de detectar conflicto.
- Guardados previos intactos al leer. Próximo SPAWN en UI adopta defaults si faltaba perfil; tandas antiguas no reciben topes retroactivos. Validar perfiles, snapshots y marcas de activación también en respaldos.
- Chrome aislado: cinco tamaños, nombres abreviados en teléfono estrecho con etiquetas accesibles completas, sin desbordamientos, recarga offline y sincronización entre pestañas. Pruebas físicas pendientes. Excepciones de identidad fuera de este punto.

