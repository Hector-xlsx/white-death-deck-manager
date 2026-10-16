# Prompt completo para Codex · Gestor de mazos de Zombicide

Quiero que desarrolles una aplicación web de apoyo a mis partidas físicas de Zombicide. Partiremos de White Death y prepararemos la estructura para Green Horde y las expansiones que tengo. Ya existe una versión de prueba funcional cuya interfaz me gusta. En este proyecto encontrarás su código completo, cartas reales y documentación.

Trabaja por capas, conserva lo que funciona y avanza hasta completar cada etapa autorizada. El objetivo de esta petición es implementar la base y las ampliaciones detalladas aquí. Las funcionalidades marcadas como futuras forman parte del diseño esperado, pero no debes implementarlas todas de una vez. Las reglas pendientes necesitan aclaración antes de programar su resultado; puedes avanzar en las partes independientes.

## 1. Lectura y fuentes

Lee completos:

- `AGENTS.md`.
- `docs/ESPECIFICACION_FUNCIONAL.md`.
- `docs/DECISIONES_PENDIENTES.md`.
- `docs/PLAN_IMPLEMENTACION.md`.
- `docs/CRITERIOS_ACEPTACION.md`.
- `docs/ESTADO_BASE_Y_MIGRACION.md` y `docs/RECURSOS_Y_CATALOGO.md`.
- `datos/mazo_base.json` y los demás inventarios de `datos/`.
- `base-web/dist/index.html`, `style.css`, `app.js`, `engine.js`, `sw.js`, `manifest.webmanifest`, `base-web/package.json`, `base-web/tests/engine.test.js` y el README original.

La copia `base-web/` es una referencia de partida: ejecuta sus pruebas y conserva la copia original para comparar. Crea el proyecto de trabajo desde esa base. No reconstruyas solo una apariencia ni sustituyas funciones por simulaciones visuales. La versión original es JavaScript con módulos, HTML y CSS; su carpeta `dist/` contiene archivos escritos directamente y no requiere compilación.

Referencia visual publicada: https://white-death-pruebas.hector-xlsx.chatgpt.site . Si no puedes acceder al sitio privado, trabaja con los archivos incluidos. No necesitas las credenciales de Sites para ejecutar la copia.

Si las imágenes y los datos entregados discrepan, señala el conflicto. No inventes objetos, cantidades, reglas, expansiones ni enemigos. Una imagen digitalizada no equivale a una copia de una carta en el mazo.

## 2. Producto y límites

- Aplicación para usar durante una partida física en teléfono y tablet; la vista horizontal es la principal.
- UI y documentación en español, con controles táctiles cómodos y pocos pasos para revelar cartas.
- Desarrollo con Codex y código preparado para GitHub/GitHub Pages. No publiques ni crees repositorios sin una petición específica para ello.
- Aplicación estática/PWA con lógica ejecutada en el navegador, sin necesidad de backend.
- Offline después de la descarga inicial completa de la app y sus recursos.
- Guardado automático local: cerrar, recargar, volver desde segundo plano o reinstalar una actualización de la app no debe provocar que se vuelva a sortear lo ya resuelto. No prometas conservar datos si el usuario borra el almacenamiento del navegador.
- Sin sincronización entre dispositivos ni partida compartida en vivo.
- No gestiona posiciones, salud, movimientos ni combate de las miniaturas. Las reglas especiales pueden consultarse; se automatizan solo los efectos definidos para el gestor.
- Conserva el aspecto actual: fondo oscuro, acentos fríos, verde para zonas de nigromante, cartas completas y franja de fijados.

## 3. Mazo general validado

El mazo base tiene 12 tipos y 56 copias. Usa los IDs existentes y los nombres reales de imagen. Los cuatro niveles están en orden Azul, Amarillo, Naranja, Rojo.

| Tipo | Copias | Dificultad | Azul; Amarillo; Naranja; Rojo | Imagen |
|---|---:|---|---|---|
| Nigromante | 9 | Sin categoría | Consultar carta | `471_Nigromante.png` |
| Abominación | 6 | Sin categoría | Consultar carta | `461_Abominacion.png` |
| Asedio zombi | 9 | Sin categoría | Consultar carta | `474_Asedio_zombi.png` |
| Activación adicional corredor | 1 | Sin categoría | Sin efecto; Activación; Activación; Activación | `484_Activacion_adicional_Corredores.png` |
| Activación adicional brutos | 1 | Sin categoría | Sin efecto; Activación; Activación; Activación | `483_Activacion_adicional_Brutos.png` |
| Activación adicional caminantes | 2 | Sin categoría | Sin efecto; Activación; Activación; Activación | `481_Activacion_adicional_Caminantes.png` |
| Brutos normal | 4 | Normal | 4; 4; 6; 8 | `451_Brutos.png` |
| Brutos fácil | 4 | Fácil | 2; 2; 6; 8 | `435_Brutos.png` |
| Caminantes normal | 6 | Normal | 4; 6; 8; 10 | `444_Caminantes.png` |
| Caminantes fácil | 6 | Fácil | 2; 4; 6; 8 | `429_Caminantes.png` |
| Corredores normal | 4 | Normal | 4; 4; 6; 8 | `455_Corredores.png` |
| Corredores fácil | 4 | Fácil | 2; 2; 6; 8 | `442_Corredores.png` |

Fácil está confirmado para 429, 435 y 442. No derives dificultades de números de carta. Los nombres `.jpg` propuestos al principio se sustituyeron por los PNG reales; usa los archivos efectivos incluidos.

Representa cada tipo con cantidad inicial y cantidad restante. La selección aleatoria usa el número de copias restantes: `P(carta i) = restantes_i / suma_restantes`. Al revelar se consume exactamente una copia. No hay reposición en el mazo general dentro de un ciclo.

Las casillas de dificultad incluyen o excluyen Fácil y Normal. Las cartas sin categoría permanecen incluidas. Elimina las cartas desmarcadas sin compensar cantidades, sin duplicar cartas elegibles y sin mantener artificialmente proporciones. Con ambas categorías incluidas son 56 cartas; con una sola son 42; sin ambas son 28. No agregues una categoría Difícil funcional hasta tener cartas clasificadas en ella.

Los filtros y la composición del mazo se aplican al iniciar una partida nueva. Los contadores se pueden ajustar durante el juego. Mantén el cambio del umbral durante la partida que ya admite la base.

## 4. Reinicio anticipado

- Umbral configurable de 0% a 99%, inicialmente 20%.
- El denominador es el total inicial del mazo después de aplicar su configuración.
- Después de cada robo, si `restantes / total_inicial * 100 < umbral`, restaura las cantidades iniciales de las cartas incluidas e incrementa el ciclo.
- La comparación es estricta: igualdad con el umbral no reinicia.
- Al quedar 0 cartas, reinicia siempre, incluso con umbral 0%.
- Comprueba la condición después de cada extracción, también en tandas, reemplazos, cartas adicionales y robos derivados del mazo general.
- Conserva historial, fijados, desfijados, contadores, elecciones y la tanda abierta.
- El reinicio del mazo general no reinicia los secundarios ni revierte estados en tablero.
- Cada extracción conserva el ciclo al que perteneció, aunque justo después se reinicie.

## 5. Interfaz principal

- SPAWN grande a la izquierda.
- Contador de zonas normales en el área central superior, con pequeños botones `+` y `−` debajo.
- Contador separado de zonas de nigromante en verde, mostrado `+0`, con sus controles debajo.
- Engranaje circular de configuración arriba a la derecha y acceso al historial en el sector derecho.
- Estado del mazo y acceso a la última tanda.
- Franja inferior con Fijados a la izquierda y Desfijados a su derecha.
- Adaptación vertical sin controles fuera de pantalla; no obligues al usuario a rotar el dispositivo.

Los contadores son enteros y no pueden ser negativos. Con ambos en cero, SPAWN no revela cartas ni crea una tanda vacía.

## 6. Aparición, tandas y acciones

Cada pulsación de SPAWN crea una **Tanda** numerada; no la llames Turno, porque puede haber varias tandas dentro del mismo turno real.

Se revelan tantas cartas generales como la suma de los contadores, primero normales y después de nigromante. Las cartas aparecen en una ventana superpuesta con fondo translúcido, adaptadas al espacio y con desplazamiento cuando haga falta. Pulsar una imagen abre el zoom encima; su X cierra el zoom y vuelve a la tanda. Otra X cierra Aparición.

Cada carta tiene acciones compactas por icono con texto accesible y tooltip:

1. **Fijar/desfijar**.
2. **Regenerar**: descartar la actual y robar otra para la misma posición. La original sigue consumida y queda con una X roja en el historial, marcada sin efecto. El reemplazo consume otra copia.
3. **Descartar sin robar**: marcar la carta sin efecto, mantener la posición y no extraer otra. No es una descarga de archivo; el término usado inicialmente fue aclarado y la base implementa descarte.
4. **Información `ⓘ`**, cuando esa carta tenga referencias vinculadas; consultar no cambia la partida.

Descartar de nuevo la misma carta no consume ni cambia nada. Regenerar no crea otra tanda. Las mutaciones de Aparición afectan la tanda actual; el historial permite consultar y fijar, no reescribir tandas anteriores.

Al final de Aparición hay dos botones `+`: blanco/normal y verde/nigromante. Cada uno roba una carta general adicional, incrementa únicamente su contador y la añade a la tanda actual. Numeración independiente por tipo: después de tres zonas normales el blanco crea **Zona 4**. El verde mantiene su secuencia de zonas de nigromante. Los controles del encabezado solo ajustan contadores; no roban inmediatamente.

Guarda robos e historial al revelar, sin esperar a cerrar ventanas. Reabrir o recuperar la última tanda nunca roba otra vez.

## 7. Historial y fijados

- Historial visual con imágenes, desplazamiento vertical y agrupación por Tanda; lo más reciente primero.
- Conserva orden, tipo de zona, carta original, reemplazos y descartes con X roja.
- También permite fijar o desfijar una carta, por si se olvidó durante Aparición.
- Fijación por instancia de extracción: la misma carta de catálogo puede aparecer varias veces y cada extracción tiene su ID. Fijar dos veces la misma instancia no la duplica.
- Al desfijar, no borres la referencia: muévela a la derecha, a la primera posición de Desfijados. Conserva los demás en su orden y permite volver a fijarla.
- Pulsar una miniatura abre imagen/reglas ampliadas. La X permite desfijar sin abrirla.
- Desfijar un nigromante con contador verde mayor que 0 pregunta «¿Deseas quitar un spawn de nigromante?»: Sí resta 1; No mantiene; Cancelar conserva todo. Si ya está en 0, omite la pregunta.
- Fijar o volver a fijar no aumenta por sí mismo un contador.
- Los desfijados nunca se consideran enemigos presentes.

Cambio de alcance solicitado: un nigromante fijado se tomará como presente en tablero para decidir la próxima aparición. Esto debe distinguir una referencia de enemigo de otras cartas de apoyo; consulta las decisiones pendientes para fijación automática, abominaciones y referencias genéricas antiguas.

## 8. Juegos, expansiones y catálogo

La configuración para seleccionar contenido tendrá secciones desplegables:

**Juego → Core / cada expansión → tipo de zombi → cartas o enemigos disponibles.**

Juegos contemplados: White Death y Green Horde. Evita mezclar reglas automáticamente entre ellos. Incorporar una abominación de otro juego a una partida no debe añadir todas las cartas o reglas del Core de ese juego.

Se deben poder elegir los contenidos y enemigos que tengo disponibles. Guarda la configuración. Mantén filtros de dificultad separados de la pertenencia a juego/expansión. Usa IDs estables y composición de mazo calculada desde las cartas elegidas; una carta repetida en varias etiquetas no se suma dos veces.

Las expansiones, copias y algunos tipos del inventario aún necesitan validación. No inventes nombres de expansión ni habilites sorteos con cantidades desconocidas. Puedes mostrar el recurso como referencia y preparar su ficha de datos. Si Green Horde no tiene aún datos de spawn suficientes, su estructura queda disponible como contenido pendiente, sin ofrecer un mazo ficticio jugable.

La categoría Core/expansión es procedencia; la dificultad Fácil/Normal/Difícil es otro eje. No etiquetes una imagen como difícil solo por venir de una expansión.

## 9. Mazos secundarios de nigromantes y abominaciones

Crea catálogos y estados de mazo independientes del general. La carta general dispara la resolución; una extracción secundaria selecciona el enemigo concreto. Registra ambos IDs aunque solo se muestre una de las imágenes.

Sin un nigromante presente, la aparición genérica muestra la carta del nigromante seleccionado en su lugar. Para abominaciones se pide un funcionamiento similar.

Cuando ya haya un enemigo presente, admite configuración independiente para nigromantes y abominaciones:

- **Activación adicional**: conservar la carta genérica y mostrar un botón/indicador sobrepuesto de activación; no extraer un enemigo nuevo.
- **Nuevo enemigo**: selección del mazo secundario según el modo configurado. Para nigromantes, la opción más reciente solicitada se llama **Activación adicional + Nigromante adicional**: no omitas la activación del existente.
- **Elección del jugador**: sobre la carta genérica aparecen dos botones. Nigromantes: **Activación adicional** y **Activación adicional + Nigromante adicional**. Abominaciones: botones equivalentes de activación y aparición, con la redacción/efecto conjunto por confirmar.

La selección secundaria solo ocurre cuando hace falta un enemigo nuevo. No consumas una carta secundaria al mostrar las dos opciones, al ampliar, al fijar o al recargar. La elección se guarda y no se ejecuta dos veces por doble pulsación.

La existencia de varios enemigos no tiene un límite numérico acordado. No añadas un límite arbitrario. Si una regla depende de identidad o de cuántos enemigos hay, debe contar instancias activas y tener un comportamiento explícito. No deduzcas cuántas miniaturas físicas tengo de cuántas imágenes existen.

Reposición, agotamiento, cantidades/pesos iniciales y auto-fijación de los secundarios todavía están abiertos. Implementa las decisiones confirmadas y deja el resto visible en documentación; no adoptes una propuesta como si estuviera aprobada.

## 10. Nigromante adicional y cartas derivadas

Caso solicitado: la carta de nigromante aparece en **Zona 2**, ya hay uno en juego y el jugador elige **Activación adicional + Nigromante adicional**.

El orden visual es:

1. **Zona 2**: carta genérica original con la resolución de activación registrada.
2. **Zona 2-2**: enemigo concreto extraído del mazo de nigromantes.
3. **Zona 2-3**: carta general para la nueva zona de aparición del nigromante.
4. Continúan Zona 3 y las demás que estaban después.

Inserta las derivadas junto al origen y desplaza las siguientes; no las envíes al final del grupo. `2-2` es una carta de enemigo, no otra zona persistente. `2-3` sí representa el robo asociado al nuevo spawn; la política de su aporte al contador debe cerrar la decisión correspondiente.

Esta expansión de tres cartas se pidió específicamente para **Activación adicional + Nigromante adicional**. No la apliques automáticamente a la primera aparición cuando no hay ninguno ni a una activación simple. Define aparte cuándo se actualiza el contador en la primera aparición.

Las abominaciones tienen funcionamiento similar de activación/selección y pueden mostrar una derivada de enemigo junto al origen cuando corresponda; no generan una nueva zona ni un robo del mazo general por esa razón.

Si se descarta o regenera la carta original, retira de la vista de Aparición todos sus descendientes: enemigo nuevo y robos de zonas generadas, incluyendo descendientes de descendientes si se permiten cadenas. La original mantiene el descarte con X o el reemplazo, según la acción. No retires cartas que pertenecen a otros orígenes.

Conserva relaciones estables de origen y descendencia en los datos. No uses exclusivamente `slotIndex` porque las inserciones cambian posiciones. Usa, por ejemplo, IDs de evento, raíz, padre, zona persistente y aporte al contador. Las etiquetas `Zona 2-2` y `Zona 2-3` son presentación, no claves.

Consulta `DECISIONES_PENDIENTES.md` antes de implementar devolución de copias, destino histórico de anuladas, baja de fijados, reversión del contador o cadenas recursivas. Son reglas funcionales abiertas. Prepara el motor para que la cancelación sea atómica e idempotente.

No fuerces a resolver simultáneamente todos los efectos antes de que el jugador pueda fijar o elegir. Conserva el orden de resolución y guarda el resultado de cada elección. Acordar auto-fijación o resolución secuencial evita que varias cartas de la misma tanda usen una presencia en tablero desactualizada.

## 11. Información y reglas por carta

Incluye `ⓘ` solo cuando haya contenido vinculado. Abre un menú/ventana especial para esa carta con sus imágenes de apoyo y reglas. Soporta varias referencias por carta, cartas compartidas entre varios tipos y traducción/original cuando estén disponibles.

Ejemplos solicitados: apoyo de reglas del nigromante y reglas especiales de zombis de expansiones. Hay recursos de guardias, bestias divinas y acción de combate a distancia demorada; su asociación exacta requiere revisión.

Consultar información no consume cartas, no fija, no cambia porcentajes ni contadores. Cerrar vuelve a la ventana desde la que se abrió. Las imágenes deben conservar proporciones y poder ampliarse.

Al principio los recursos se cargan como archivos del repositorio con un manifiesto de relaciones. Una interfaz de subida de archivos, un editor de cartas o reconocimiento OCR automático no están solicitados para esta etapa. No dependas de URLs temporales para la app offline.

Las reglas especiales de enemigos pueden usar manejadores separados solo cuando su comportamiento esté validado. No conviertas todo el texto de una carta en lógica automática ni simules decisiones de mesa. Para efectos no implementados, proporciona la referencia y resolución manual explícita.

## 12. Persistencia, compatibilidad y PWA

Guarda composición/configuración de la partida, cantidades iniciales/restantes de cada mazo, ciclos, contadores, historial, IDs, fijados/desfijados, última tanda, elecciones pendientes/resueltas, relaciones de derivación y aportes de spawn que finalmente se acuerden.

- Versiona el estado y migra el formato anterior; la clave original es `white-death-mvp-v1`.
- No guardes imágenes dentro del estado, solo IDs/rutas de catálogo.
- Una actualización del catálogo no cambia el mazo de una partida iniciada sin una migración o confirmación explícita.
- Aplica cada acción sobre una copia del estado, valida y guarda antes de mostrar éxito. Ante un fallo, no publiques un estado parcialmente aplicado.
- Recupera Aparición y elecciones pendientes sin ejecutar de nuevo extracciones.
- Nueva partida requiere confirmación: borra progreso, historial, fijados/desfijados; conserva configuración y zonas normales, vuelve las de nigromante a 0 y reinicia los mazos participantes.
- Usa recursos locales, manifest y service worker compatibles con GitHub Pages bajo `/nombre-repositorio/`.
- La indicación offline debe corresponder a recursos realmente disponibles; prueba todas las cartas y referencias incluidas sin red.
- No cambies la versión activa del código en medio de una partida por un `skipWaiting` que mezcle formatos incompatibles. Define y prueba el procedimiento de actualización.
- El almacenamiento de Sites no se traslada por cambiar de dominio. Una importación/exportación JSON de respaldo es un complemento propuesto para migración, no sincronización.

## 13. Arquitectura y pruebas

Mantén el stack actual mientras sea suficiente. Separa como mínimo catálogo/composición, motor general y secundario, resolución/cancelación de efectos, persistencia/migración e interfaz. Evita un único archivo con todas las reglas nuevas y dependencias pesadas que no aporten.

Motor con aleatoriedad inyectable para pruebas reproducibles. Sortea únicamente en acciones aceptadas. No realices simulaciones Monte Carlo como única prueba del robo físico: verifica tickets/cantidades exactamente.

Prueba los casos de `docs/CRITERIOS_ACEPTACION.md`, incluyendo umbral estricto, ciclos dentro de la tanda, acciones repetidas, orden de derivadas, cancelación de subárboles, contadores sin doble resta, fijados como presencia, resolución repetida tras recarga y compatibilidad con estado anterior.

Haz comprobaciones en teléfono horizontal, teléfono vertical y tablet. Comprueba rutas en una subcarpeta y uso offline real. Si el entorno impide alguna verificación, indícalo; no la des por hecha.

## 14. Desarrollo por etapas

1. **Migración/base**: ejecutar pruebas, establecer el proyecto de trabajo, preservar interfaz y todas las funciones actuales; verificar PWA y compatibilidad. No añadir reglas nuevas todavía.
2. **Catálogo e información**: inventarios, relaciones, secciones Juego/Core/Expansión/Tipo y botón `ⓘ`; integrar cartas de expansión solo con cantidades y clasificación confirmadas.
3. **Abominaciones**: mazo secundario, presencia acordada, configuración de modalidades y cancelación de derivadas de enemigo; resolver pendientes aplicables antes de codificar.
4. **Nigromantes**: presencia por fijados, botones sobrepuestos, inserción Zona 2-2 / 2-3, estados de resolución y cancelación completa; cubrir cadenas y aportes con pruebas.
5. **Evolución posterior**: implementar únicamente cuando la pida el usuario; consulta el backlog siguiente.

Tras cada etapa, informa qué funciona, qué se verificó y qué decisión o dato falta para la siguiente. No repitas preguntas que ya estén resueltas en los archivos o el hilo.

## 15. Backlog esperado, sin activarlo por defecto

- Reposición configurable por mazo secundario: con/sin reposición, reinicio y exclusión de enemigos no disponibles.
- Pesos ajustables por enemigo; posibilidad de reducir a la mitad el peso tras cada aparición, manteniendo mazos independientes.
- Zombis especiales dentro de un grupo del tipo correspondiente: caminante/bruto/corredor, con probabilidad configurable, reposición y tasas constantes o variables; posibilidad de aumentar la tasa después de intentos sin especial.
- Sus tasas se evalúan solo con un nivel/grupo que realmente haga aparecer zombis: selector de adrenalina y política de sustitución/adición necesitan diseño antes de esta etapa.
- Reglas automáticas especiales por identidad de enemigo, documentadas y verificadas individualmente.
- Categoría Difícil cuando el catálogo tenga datos; no requiere compensación de proporciones.
- Selector de adrenalina, respaldos/importación y herramientas de edición de catálogo si se solicitan.

En el mazo general se descartó la propuesta inicial de compensar cantidades por dificultad: no la reintroduzcas al construir capas futuras.

## 16. Entregable que espero de tu trabajo

Una aplicación funcional que preserve la base y añada las etapas confirmadas, con imágenes reales, catálogos editables, pruebas del motor, documentación actualizada y preparación de publicación estática. Incluye instrucciones para ejecutar localmente y para usar GitHub Pages cuando lo autorice.

Empieza leyendo los archivos y ejecutando las pruebas. Luego resume brevemente el estado encontrado y las decisiones que bloquean la siguiente etapa. Resuelve elecciones técnicas rutinarias por tu criterio, pero no cierres reglas de casa pendientes sin mi respuesta. Continúa con la migración y los complementos que no dependen de esas reglas.
