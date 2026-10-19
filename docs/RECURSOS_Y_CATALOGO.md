# Recursos y catálogo

## Archivo frente a carta

El inventario contiene imágenes de cartas, referencias y variantes. No equivale al inventario físico de mazos. Cada archivo tiene ruta local, dimensiones y hash; los catálogos de juego necesitan además cantidad, dificultad, procedencia y reglas confirmadas.

El mazo base está validado en `datos/mazo_base.json`. Tiene las doce filas acordadas y la suma de 56. Los archivos PNG efectivos sustituyen la convención JPG inicial.

Los otros JSON mantienen pendientes explícitos. El usuario confirmó una copia por carta secundaria, su pertenencia por carpetas y que número/dificultad no aplican a esos mazos. El nombre de la caja, modalidades y reglas no confirmadas siguen pendientes. Las cantidades desconocidas de spawn de expansión permanecen en `null` y su sorteo deshabilitado.

## Organización

- `recursos/00 Cartas Apoyo Supervivientes/`: tres imágenes de apoyo, conservadas en standby.
- `recursos/01 Mazo Spawn - Juego base/`: doce imágenes del mazo base confirmado de 56 copias.
- `recursos/02 Mazo Spawn - Expansiones/`: seis recursos para el mazo general de expansiones.
- `recursos/03 - Mazo Nigromante ESP/`: once imágenes de cartas del mazo de nigromantes.
- `recursos/04 - Mazo Abominaciones ESP/`: veintiuna imágenes, con una sola imagen actual de Kijin.
- `datos/catalogo_recursos.json`: cada recurso físico y sus aliases; archivos idénticos en bytes se pueden compartir entre varios nombres de origen.
- `datos/catalogo_enemigos_borrador.json`: posibles enemigos, con originales/traducciones vinculados y pertenencia/mecanismo pendiente.
- `datos/cartas_expansion_pendientes.json`: cinco cartas numeradas y Bestias divinas Aparición, según la carpeta 02. Bestias divinas Activación pertenece a la carpeta 04 y ya no está en este inventario de spawn general.
- `datos/referencias_borrador.json`: ayudas consultables; vínculos concretos aún por confirmar.
- `datos/mazo_abominaciones.json`: catálogo operativo autorizado el 8/10/2026, separado de los borradores. 20 identidades, cantidad 1, modos y política de reinicio confirmados; sin reglas especiales automáticas. Bestias divinas Activación pendiente de entrada al sorteo.
- `datos/mazo_nigromantes.json`: once identidades, cantidad 1, reposición/reinicio según modo. Death Notes incorporada como nigromante de Frozen Fortress por confirmación del usuario el 19/10/2026, conservando su ID e imagen; ruido/daño en mesa. Véase `ACTUALIZACION_Y_DEATH_NOTES.md` para preservar selecciones anteriores.

Se conservan los nombres y las rutas elegidos por el usuario, con espacios y Unicode. La preparación admite únicamente esas cinco carpetas y nombres PNG controlados. Todos los archivos se verifican por SHA-256; sus píxeles no se modifican. Las tres carpetas anteriores ya no son dependencias de la app y pueden eliminarse de `recursos/`.

## Traducciones y variantes

Kijin conserva únicamente `Carta Kijin de Zombicide-13.png`, con el contenido actual suministrado por el usuario y listado en el Excel. La variante -18 se retiró del inventario y de la aplicación. Las partidas anteriores migran esa ruta sin cambiar la identidad, cantidad ni estado de la carta. Esto no automatiza sus reglas especiales.

Mumm-Ra nigromante y Mumm-Ra abominación tienen fichas distintas. Una traducción cuyo título se parece no se asocia a ambas por coincidencia de texto.

Las traducciones asistidas pueden contener errores gráficos o de texto. Usarlas como recurso para lectura y comparación; cualquier automatización necesita revisar regla y traducción exactas.

## Expansiones identificadas por imagen

Números recuperados: 559 Caminantes de terrorcota, 565 y 571 Trepadores, 577 y 580 Caminantes ballesteros. Se incluyen las imágenes, pero faltan cantidades por variante y procedencia/configuración final. No deducir que hay una sola copia porque solo se escaneó una imagen.

Bestias divinas Aparición está clasificada para spawn de expansiones y Activación para abominaciones. La automatización y cantidad de la carta de spawn siguen pendientes. No se agregan cartas al motor general por reorganizar imágenes.

Las miniaturas especiales Frozen Fortress se mencionaron como una funcionalidad futura. No hay un catálogo completo de sus siete entradas confirmado en esta entrega. No crear imágenes o cartas de spawn nuevas para llenar ese hueco.

## Datos mínimos recomendados

```json
{
  "id": "identificador-estable",
  "nombre": "Nombre visible",
  "clase": "spawn_general | enemigo | referencia",
  "tipo_zombi": "tipo confirmado o null",
  "juego_origen_id": null,
  "expansion_id": null,
  "cantidad_inicial": null,
  "dificultad": null,
  "imagen_original": "ruta local",
  "imagen_es": null,
  "referencias_ids": [],
  "regla_automatica_id": null,
  "datos_confirmados": false
}
```

Este esquema es orientativo y no redefine el formato antiguo. La partida almacena una instantánea de la composición y sus políticas. Una referencia puede no tener cantidad; eso no la convierte en una carta elegible para robo.

## Integridad

`catalogo_recursos.json` contiene los hashes y rutas vigentes de las 54 imágenes. El manifiesto de entrega conserva la descripción histórica del ZIP original. La prueba de preparación funciona sin las carpetas antiguas, manteniendo intactas las doce cartas de referencia en `base-web/`.
