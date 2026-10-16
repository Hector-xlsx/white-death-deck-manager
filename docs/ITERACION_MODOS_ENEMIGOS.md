# Iteración de modos de enemigos · 14/10/2026

**Revisión posterior:** el usuario corrigió las decisiones de inicio, aplicación de configuración y tratamiento de pruebas anteriores. El comportamiento vigente está en `CONFIGURACION_DURANTE_PARTIDA.md`: Personalizado inicial, modos/contenido desde próxima tanda, topes exactos conservados, Kan de respaldo y Estándar sin trofeos, reinicio único de pruebas y protección de trofeos al reactivar contenido. Las decisiones y pruebas inferiores registran la primera implementación.

## Alcance autorizado y resultado

El usuario autorizó implementar los puntos 1–13 del listado consolidado del chat y resolver autónomamente las decisiones restantes, dejando cada pregunta y opción elegida por escrito. Se implementaron modos, prioridad del Profanador, zonas y robos diferidos, referencias de activación, acciones personalizadas, azar, cupos y compatibilidad con partidas anteriores. La numeración 1–13 de ese listado no sustituye los IDs del registro de pendientes: este cierre corresponde a 16, 17, 19, 20 y 21, con el 18 integrado en los modos.

## Reglas implementadas

| Mazo / modo | Resolución |
|---|---|
| Nigromantes Estándar | Solo Profanador. Si falta, aparece; si está presente, se activa. |
| Nigromantes Varios | Si falta el Profanador, aparece él, aunque haya otros. Si está, se activa únicamente él y luego aparece otro del mazo. |
| Nigromantes Personalizado | Mantiene prioridad y espacio del Profanador; con él presente aplica la acción predefinida y los cupos de adicionales. |
| Abominaciones Estándar | Una identidad elegida entre las marcadas y disponibles en la colección. Sin presencia aparece; con presencia se activa. La selección de las otras identidades se conserva. |
| Abominaciones Festival | Sin presencia aparece una. Con presencia se activan todas y después aparece otra disponible. |
| Abominaciones Personalizado | Activación / spawn / ambos / azar, con topes por adrenalina. |

La pantalla principal muestra un valor fijo Estándar, Varios nigromantes o Festival de abominaciones para los modos oficiales. Personalizado ofrece las acciones, sin Elegir en el momento. Los modos de juego son independientes del selector histórico con/sin reposición.

Acciones personalizadas de nigromantes: Activación del Profanador; Activación del Profanador + azar; Spawn adicional; Activación del Profanador + spawn; Activación del Profanador + azar + spawn; Al azar. La opción general Al azar sortea uniformemente entre las cinco acciones (20% cada una) cuando todas se pueden cumplir. Al completar el cupo o agotar candidatos, excluye acciones con spawn antes de sortear: las dos restantes tienen 50% cada una. Una acción con azar individual activa al Profanador y efectúa después un sorteo independiente del 50% por cada adicional presente. Los resultados y destinatarios se guardan, sin repetir RNG por render o recarga.

Los topes solo rigen en Personalizado. Los cupos iniciales de adicionales son Azul 0 / Amarillo 0 / Naranja 1 / Rojo 1; el Profanador tiene un espacio independiente, conservando máximos totales potenciales 1/1/2/2. Abominaciones mantiene 1/2/3/4. Perfiles no decrecientes; adicionales admiten cero y abominaciones requieren al menos uno. Ajustar el perfil afecta la próxima tanda y conserva enemigos ya presentes, aunque excedan un nuevo cupo.

Solo el Profanador crea zona propia. El contador verde representa su zona, no el número total de nigromantes. Desfijarlo o devolverlo al mazo retira su presencia y la zona para las siguientes tandas; refijarlo la restaura. No se reescribe el historial de robos ya aceptados. Cancelar su origen anula su zona derivada y descendientes. Los otros nigromantes no crean zonas ni robos derivados.

En el motor se resuelven primero las zonas normales y luego las del Profanador. Una zona recién creada se encola y roba después de las zonas iniciales, dentro de la misma acción atómica SPAWN. En la revelación aparece boca abajo tras presentar al Profanador y se revela al final. Las activaciones adicionales nunca generan otro robo de zombis: su resultado físico y la corrupción siguen siendo responsabilidad de la mesa, hasta abordar el punto 8.

Cada activación muestra una referencia al enemigo existente con su sello, entre la genérica y la nueva aparición cuando corresponde. Las referencias tienen IDs visuales separados, permiten zoom y no ofrecen fijar/regenerar: no son extracciones, no consumen cartas ni aumentan presencia. Las activaciones de Festival muestran las referencias de todas las abominaciones afectadas. Historial y última tanda preservan los destinatarios guardados incluso si después se retira el enemigo.

## Decisiones resueltas sin intervención adicional

| Pregunta | Opción elegida | Motivo |
|---|---|---|
| ¿Modo inicial en una instalación sin partida? | Estándar para ambos mazos. | Inicio alineado con las reglas base. |
| ¿Cuándo cambian modo, identidad estándar y composición? | Al iniciar nueva partida. Guardar solo prepara la próxima configuración. | Evita reinterpretar presencia, catálogo e historial de una partida en curso. |
| ¿Qué pasa con partidas anteriores? | Sin cambios al leer: conservan reglas y elecciones históricas. Los nuevos modos llegan en una nueva partida explícita. | No borrar ni convertir silenciosamente enemigos o zonas existentes. |
| ¿Cómo convertir sus topes al preparar una partida con modos nuevos? | Restar el espacio reservado del Profanador, con mínimo cero, al perfil de nigromantes de la próxima configuración. Conservar el perfil activo anterior hasta reiniciar. | Mantiene los máximos totales acordados y distingue cupos nuevos de totales legados. |
| ¿Qué abominación se propone en Estándar? | Kan si está entre las seleccionadas disponibles; de lo contrario la primera seleccionada disponible. El usuario puede elegir otra. | Usa únicamente datos y selección existentes. Sin candidatos se bloquea el inicio. |
| ¿Puede desmarcarse el Profanador? | Participa obligatoriamente en los tres modos; en Contenido se muestra marcado y bloqueado. | Garantiza su prioridad y espacio reservado. Las preferencias de adicionales se conservan. |
| ¿Acción inicial de Personalizado? | Al azar. | Evita una elección durante el robo y mantiene la incertidumbre pedida. Puede fijarse otra antes de SPAWN. |
| ¿Puede cambiarse la acción durante una tanda? | Selector bloqueado con Aparición abierta; acción congelada por tanda. | Reemplazos y regeneraciones mantienen las condiciones de esa tanda. |
| ¿Cómo interactúa reposición con los nuevos modos? | Mantener ambos modos históricos y su exclusión de identidades presentes. Reutilizar el reinicio de descartes y las ubicaciones ya implementadas. | No duplicar miniaturas ni introducir otro contrato de mazo. |
| ¿Qué pasa si no queda otro nigromante disponible? | Al azar elimina acciones con spawn; una acción fija con spawn pasa a activación del Profanador y aviso de agotamiento. | Ejecutar una acción cumplible sin duplicados. |
| ¿Qué ocurre con una acción fija con spawn al alcanzar el cupo? | Activación del Profanador, sin nueva aparición. | Conserva el fallback acordado; el filtrado previo es específico de Al azar. |
| ¿Qué hace Festival si no quedan abominaciones elegibles? | Activa las presentes y muestra Sin enemigos disponibles, sin extraer otra. | Preserva unicidad, descartes y trofeos existentes. |
| ¿Qué hace Estándar si su abominación está agotada como trofeo y no hay presencia? | No revive la identidad; muestra Sin enemigos disponibles y no inventa destinatarios de activación. | Preserva la regla de trofeos ya implementada. La devolución manual conserva su confirmación existente. |
| ¿Diferir solo la imagen o también los efectos? | Diferir robo y resolución de la zona en el orden interno de SPAWN, guardando la tanda completa antes de mostrarla. | Cumple el orden funcional sin dejar una mutación pendiente que se repita al recargar. |

## Archivos y compatibilidad

Nuevo módulo `dist/modos-enemigos.js`. Integración en catálogo, contenido, motor, secundarios, ambos resolutores, límites, validación, presentación, revelación, app, HTML y CSS. Metadatos de reglas añadidos a ambos JSON secundarios; los campos anteriores describen el comportamiento legado. `scripts/preparar.mjs` precarga el nuevo módulo y regeneró catálogo, versión y SW. Los campos de regla son opcionales para reconocer guardados anteriores; leerlos no agrega modos ni reinterpreta su historial. No se cambiaron IDs históricos, imágenes originales, Excel, `base-web/`, origen ni almacenamiento del usuario.

## Validación y limitaciones

13 pruebas originales aprobadas antes de editar. La batería previa aprobó 210 pruebas funcionales; la preparación temporal fue bloqueada por permisos del sandbox y posteriormente se ejecutó con permiso ampliado. La batería final incluye los 211 casos anteriores y 25 nuevos de `tests/modos-enemigos.test.js`. Los nuevos casos cubren seis modos, prioridad, límites, cinco acciones, dos etapas de azar, snapshots, orden real de resolución, retiro/refijado, ciclos, falta de candidatos, trofeos, regeneración, cancelaciones, persistencia, cuota, concurrencia, recuperación y legado.

QA de navegador con Chrome aislado: `scripts/verificar-modos.mjs`, cinco tamaños 1440×900, 1024×768, 844×390, 390×844 y 320×568; selección obligatoria, modos fijos/personalizados, configuración diferida, selector estándar, perfil, referencias/zoom, revelación animada con carta pendiente, historial, última tanda, cuota, recarga offline y anulación. También se ejecutaron las verificaciones de interfaz general, Daily por adrenalina y agrupación de zonas legadas. Capturas `docs/verificacion/modos-config-*.png` y `modos-activacion-*.png`. Ancho del botón de carta conservado en 155 px (153 px de imagen dentro del borde existente). Sin validación en dispositivos físicos.

No implementados: corrupción (8, incluye 23), compatibilidad por carta (22), tokens (26), estadísticas ni reglas especiales adicionales. Puntos 24 y 25 retirados. No se publicó, no se creó repositorio y no se programó ni ejecutó apagado del equipo. El apagado mencionado por el usuario es una acción que él coordinará.
