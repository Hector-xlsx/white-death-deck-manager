# Correcciones de configuración durante la partida · 14/10/2026

Este cierre aplica las correcciones del usuario a las decisiones de `ITERACION_MODOS_ENEMIGOS.md`. Prevalece sobre su elección inicial de Estándar, aplicación a nueva partida y conservación de partidas de prueba anteriores. El usuario confirmó el fallback de una acción fija con spawn al completar cupo y autorizó modificar cartas/cajas durante la partida, sin recuperar trofeos derrotados al reactivar contenido.

## Decisiones vigentes

| Tema / pregunta | Resolución |
|---|---|
| ¿Modo inicial? | Personalizado en ambos mazos. Los otros modos conservan la alternativa de reglas originales. |
| ¿Cuándo aplicar modo, identidad estándar y contenido? | Guardar prepara la próxima tanda. El siguiente SPAWN adopta los cambios dentro de la misma acción guardada. Reabrir/reemplazar la tanda existente no adopta cambios pendientes. |
| ¿Qué pasa al cambiar a Estándar con varias abominaciones? | Conservarlas en juego y activar a todas las presentes sin otra aparición. Cuando no quede ninguna, aparece la elegida para Estándar. |
| ¿Qué pasa al cambiar a Estándar con adicionales de nigromante? | Conservarlos, impedir nuevas apariciones de adicionales y mantener prioridad del Profanador ausente. Con el Profanador presente se activa solo él. |
| ¿Se reinician topes al cambiar modo o iniciar partida? | No. Se guardan exactamente los valores personalizados y vuelven a usarse al regresar a Personalizado. Los defaults 0/0/1/1 y 1/2/3/4 se usan únicamente si faltaba configuración. No se resta automáticamente uno a valores ya guardados. |
| ¿Qué abominación elegir en Estándar? | La elegida entre las marcadas aptas; propuesta Kan si está seleccionada, otra apta si no, y Kan de Core como respaldo si no hay ninguna apta. |
| ¿Trofeos en Estándar? | No seleccionables; la interfaz los excluye y el constructor rechaza una selección explícita de trofeo. Si solo se seleccionaron trofeos, se usa Kan. |
| ¿Qué hacer con partidas de prueba anteriores? | Reinicio único al cargar esta revisión, eliminando progreso, presencia e historial de la partida activa y conservando configuración/selección/topes. Marca persistida `revisionReglas: 2` impide repetirlo. Si falla el almacenamiento no se acepta el reinicio ni se pierde el guardado previo. |
| ¿Qué pasa al quitar o agregar cartas/cajas? | Desde próxima tanda las quitadas dejan de participar y las nuevas se incorporan al mazo correspondiente. Los enemigos presentes no se retiran. Catálogos históricos conservan IDs/imágenes para consultar y validar resultados anteriores. |
| ¿Puede un trofeo derrotado volver al desmarcar/remarcar? | No. Su ubicación de trofeo permanece incluso deshabilitado; al reactivarlo no se libera al mazo. También se conserva si se deshabilitó mientras estaba presente y fue derrotado después. |
| ¿Qué hacer con cartas ordinarias reactivadas? | Se permite incorporarlas disponibles, salvo que estén presentes. Dos guardados de desmarcar/remarcar antes de SPAWN registran la reincorporación. |
| ¿Cuándo reiniciar secundarios? | Si no quedan candidatos activos y hay descartes activos, reponerlos. Nunca incluir identidades presentes o trofeos; una carta deshabilitada disponible no bloquea el reinicio. Con solo Core y Profanador presente no hay otro candidato. |
| ¿Acción fija con spawn y cupo completo? | Activación del Profanador sin nueva aparición, confirmado por el usuario. Al azar sigue excluyendo acciones con spawn antes del sorteo. |
| ¿Qué pasa con Daily Spawn al editar durante la partida? | Selección/habilitación y parámetros se aplican desde próxima tanda. Se conserva su catálogo histórico y puntos acumulados; cada tanda mantiene su configuración para no recalcular aportes pasados con nuevos incrementos. |

## Implementación

Nuevo `dist/configuracion-partida.js` separa preparar configuración, programarla y actualizar inventarios. El motor toma el respaldo antes de aplicar cambios pendientes: anular SPAWN restaura la configuración pendiente y todos los mazos anteriores. Cada tanda nueva guarda `configTanda` junto con modos, acciones, adrenalina y topes.

El general actualiza sus cantidades al cambiar composición, conservando restantes de cartas incluidas y dando sus copias confirmadas a cartas reincorporadas. Las excluidas no entran en sorteos; su ficha histórica sigue en el catálogo. Si la nueva composición agota todos los restantes, comienza un nuevo ciclo. Los secundarios mantienen catálogos de identidades usadas y `habilitadasIds` para separar candidatos actuales de referencias/presencia/trofeos. Esa conservación interna no vuelve elegible una carta quitada.

Guardar no ejecuta sorteos. El umbral mantiene su aplicación inmediata existente; modos, topes, dificultad, contenido, reposición y Daily se adoptan en próximo SPAWN. Los selectores principales muestran el modo previsto para la próxima tanda y se conserva la acción personalizada al alternar modos dentro de la misma partida. Iniciar una nueva partida limpia banderas pendientes e historial, preservando los valores de configuración que se muestran en el formulario.

La retirada normal de una secundaria con trofeo conserva su ubicación de trofeo. El cambio de contenido jamás la libera. La función manual de devolución al mazo existente no forma parte de este ajuste y conserva su confirmación/advertencia; este cierre no sustituye reglas especiales de otras identidades.

Archivos afectados: motor, catálogo, contenido, ambos resolutores secundarios, disponibilidad, Daily, validación, app e HTML; módulo de configuración nuevo, preparación/SW, metadatos de abominaciones, pruebas y documentación. El origen localhost, Excel, originales, datos de cantidades e IDs y `base-web/` permanecen intactos.

## Validación

- 13 pruebas originales antes de editar; batería funcional y de recursos más casos nuevos de `tests/configuracion-partida.test.js`. Se sustituyó la antigua prueba que permitía un trofeo en Estándar por su rechazo conforme a la nueva regla.
- 257/257 pruebas aprobadas, incluidas 21 nuevas: adopción diferida, presencia con Estándar, prioridad Profanador, topes preservados, quitar/agregar IDs/cajas, trofeos, reincorporaciones, ciclos activos, general, Daily y sus puntos, snapshots, reemplazos, anulación, reset único, cuota/concurrencia y recuperación.
- `scripts/verificar-configuracion-partida.mjs`: Chrome aislado, cinco tamaños, cambios durante partida, trofeos excluidos en Estándar y bloqueados al remarcar, presencia conservada, campos, falta de espacio, pestañas, recarga offline con cambios pendientes, anulación y nueva partida conservando topes. Capturas `config-partida-*.png`.
- `scripts/verificar-modos.mjs` adaptado a Personalizado inicial y reset único de pruebas; referencias, zoom, cartas completas, revelación diferida, historial y offline aprobados.
- No se modificó directamente el almacenamiento del navegador del usuario desde las pruebas; el reset autorizado se ejecutará al cargar la nueva revisión. No se probaron dispositivos físicos. Corrupción, compatibilidad por carta y tokens siguen pendientes.
