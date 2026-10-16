# Reglas por carta única · Iteración del 15/10/2026

## Alcance aprobado

Se automatizan efectos que modifican presencia, presentación y conteo. El movimiento, combate y ubicación de miniaturas se resuelven en la mesa. Bestias divinas, incluida su carta de Activación, permanece en espera. No se modifica el Excel ni se generan nuevas imágenes de cartas.

## Mumm-Ra

- Las dos formas están vinculadas en la configuración nueva o editada. Si no hay ninguna presente, ambas pueden participar en sus mazos correspondientes según el modo. Con una presente, ninguna forma puede seleccionarse como otra aparición ni refijarse simultáneamente.
- Al resolver una carta general de Nigromante en Varios/Personalizado, se registra si Mumm-Ra Nigromante ya estaba presente antes de esa carta. Su propia aparición no dispara transformación. Estándar no ejecuta este efecto, incluso si conserva un Mumm-Ra de un modo anterior.
- Primero se resuelven todas las cartas y sus activaciones. Al final de la tanda se cambia presencia a Abominación. Se muestra una pareja sin zona: Nigromante oscurecido, flecha y Abominación. Las referencias no generan otra aparición ni incrementan el contador.
- Transformaciones y apariciones específicas confirmadas pueden superar topes generales. La presencia resultante sí cuenta para bloquear apariciones ordinarias mientras no haya cupo. No se aplica esta excepción a un spawn normal ni se inventan excepciones para otras cartas.
- Derrotar la forma Abominación requiere confirmar «Invocar Mumm-Ra Nigromante». Cerrar el aviso conserva la forma actual. Solo el Profanador crea zona, por lo que esta sustitución no crea zona ni roba una general.
- El detalle del Nigromante presente ofrece «Pasar a Mumm-Ra Abominación» como corrección manual. Cada sustitución tiene una extracción nueva e historial propio. Repetir sobre el UID anterior no duplica efectos.
- Cancelar el origen revierte las transformaciones dependientes. Anular tanda recupera el respaldo completo. No se transforman las extracciones históricas al leer el guardado.

## Chimimōryō y Meng Huo

Chimimōryō, con Profanador presente y por tanto su zona activa, muestra la regla y «Reaparecer en la zona de nigromante más cercana». Confirmar conserva presencia. «Derrotar abominación» exige una segunda confirmación para retirarlo excepcionalmente. Sin la zona se retira normalmente. No se añade sello de activación ni se cuentan más zombis por reubicación.

Meng Huo muestra «Mover a la primera zona de aparición» al intentar derrotarlo y conserva su presencia. La corrección de una extracción equivocada se realiza regenerando su Daily o descartando/regenerando la carta general de origen. El detalle no ofrece la devolución ordinaria al mazo. Por petición posterior del usuario, el detalle de Meng Huo presente ofrece «Retirar Meng Huo»: recuerda su regla y exige confirmar «Sí, retirar» como excepción manual. Cancelar conserva presencia; confirmar lo mueve a Desfijados y respeta el modo de reposición Daily, sin descontar el contador de generados. Verificados cancelación, confirmación y recarga con el QA de reglas.

## Shakōki Dogū y Rakshasa

- Con Shakōki presente antes de resolver una aparición general positiva, se registra un acompañante de ese tipo exacto. Fácil/Estándar de una misma familia se agrupan. Terracota, Trepadores y Ballesteros conservan tipos separados; no hay una lista cerrada de tres familias.
- Asedio aporta un Caminante aunque la cantidad general siga siendo variable y de registro manual. Activaciones adicionales, Abominaciones y Nigromantes no aportan. Daily Spawn y los propios acompañantes no disparan la regla.
- Al final de la tanda aparecen tarjetas de resumen «+N / tipo / En la zona de Shakōki Dogū», agrupadas por tipo. No tienen zona, controles de extracción ni sello de activación. El movimiento físico y la condición de estar solo para derrotarlo siguen en la mesa.
- Cada nueva aparición de Rakshasa registra tres Caminantes acompañantes y muestra un resumen propio «+3 Caminantes / Acompañan a Rakshasa». El contador suma Rakshasa y sus tres acompañantes. No se crean tres enemigos fijados ni se ocupa el mazo general.
- El contador deriva los aportes de las extracciones vigentes. Regenerar o cancelar elimina los anteriores y conserva solo los aceptados. Cancelar una aparición de Shakōki también invalida los aportes que dependían de esa instancia. Derrotarlo después no borra zombis ya generados.
- Los Daily históricos sin la nueva marca conservan su conteo anterior. No se reinterpretan ni escriben guardados al consultar.

## Decisiones de presentación

Todos los mensajes que usan la confirmación compartida tienen una X «Cerrar mensaje sin aceptar». La X y Escape descartan la acción pendiente sin ejecutar su callback ni cambiar el guardado. Incluye Mumm-Ra Abominación, reapariciones de Chimimōryō y Meng Huo, retirada excepcional y las confirmaciones generales. QA verifica cierre y reapertura antes de aceptar, además del segundo aviso de Chimimōryō y la conservación del detalle de Meng Huo.

Primera iteración con resúmenes HTML de cantidad, tipo y destino. Posteriormente se añadió la elección Minimalista / Cartas custom con las imágenes del usuario, cantidad y destino superpuestos; contrato en `APARICIONES_ADICIONALES.md`. Las referencias adicionales siguen la secuencia final de revelación; Bake-Danuki mantiene su tirada y referencia propias al cierre.

## Validación

- Antes de editar: 272/272 pruebas. Al cierre: 284/284, incluidas 12 nuevas sobre transformaciones, topes, modos, cancelación, variantes, acompañantes, integridad, recarga y cuota.
- `scripts/verificar-reglas-cartas.mjs`: diálogos reales, sustitución y corrección de Mumm-Ra, Chimimōryō con excepción confirmada, Meng Huo, resúmenes, historial, cinco tamaños de Chrome y recuperación offline. Contextos aislados, sin cambiar la partida del usuario.
- Evidencia visual: `docs/verificacion/reglas-cartas-*.png`. Sin pruebas en dispositivos físicos.

Los metadatos de automatización en JSON describen únicamente este alcance. El Excel conserva sus marcas anteriores y no certifica por sí solo qué está implementado.
