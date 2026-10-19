# Actualización visible y Death Notes · 19/10/2026

Cambios autorizados y preparados localmente. Sin commit, push ni publicación en esta etapa.

## Actualizar ahora

Cuando termina de descargarse una versión completa, aparece un aviso fijo en la pantalla con el botón «Actualizar ahora». No aparece durante una descarga incompleta. Se comprueban novedades al abrir, volver a la aplicación, recuperar conexión y cada cinco minutos mientras la página está visible y conectada.

El botón activa el paquete descargado y recarga solamente la pestaña que lo solicita. La partida permanece en el mismo almacenamiento local. Si hay un panel abierto o el guardado está bloqueado, se pide guardarlo/cerrarlo antes de continuar; no se descartan borradores ni se fuerza su guardado. Si la activación no responde en quince segundos se permite reintentar.

Las otras pestañas reciben el aviso y conservan sus paneles, borradores y recursos de la versión anterior hasta que decidan recargar. El service worker guarda la versión asociada a cada cliente en una caché de metadatos y conserva los paquetes que todavía estén en uso. La siguiente comprobación offline o activación elimina paquetes sin clientes, sin borrar un paquete que se esté descargando o esperando. Los archivos de cada página proceden de un único paquete. Se mantiene la activación automática cuando se cierran todas las ventanas de la aplicación.

La descarga requiere conexión y espacio; una versión ya descargada se puede activar offline. Una descarga fallida conserva la versión activa. No se borra almacenamiento de partidas.

**Primera llegada de este cambio:** la versión publicada anterior aún no contiene el botón. Para recibir esta primera versión puede ser necesario cerrar/reabrir las ventanas una última vez. Las actualizaciones siguientes ya dispondrán del aviso visible. Este cambio no actualiza retroactivamente el código de una página antigua.

## Death Notes

Confirmación del usuario: incorporar Death Notes como nigromante seleccionable de Frozen Fortress, una copia, con los mecanismos de aparición, reposición, fijación, regeneración y descarte de los demás nigromantes. Se conserva su ID histórico `referencia-death-notes`, su asociación de colección y su imagen; el prefijo del ID no determina su tipo.

Se traslada su ficha de ayudas al catálogo de enemigos y se incluye en `mazo_nigromantes.json`: once identidades. Su imagen se consulta desde la fila de nigromantes y las apariciones. Ruido y daño se resuelven en mesa; no se automatizan efectos de combate ni se infieren reglas desde la traducción.

Las selecciones explícitas de partidas existentes no cambian. Para los guardados antiguos con selección implícita, la recuperación hace explícitas las diez identidades anteriores, también en el respaldo de anulación y las configuraciones históricas, sin añadir Death Notes ni volver a sortear. La recuperación no sobrescribe los bytes originales. Puede seleccionarse en Configuración → Contenido → Nigromantes → Frozen Fortress y guardarse para la próxima tanda. Las partidas nuevas con selección predeterminada y Frozen Fortress habilitado la incluyen.

## Validación

- 338/338 pruebas del proyecto y 13/13 originales. Nuevas pruebas de catálogo/colección, aparición, fijación, anulación, recuperación y defaults antiguos; conteos existentes ajustados al catálogo ampliado.
- `scripts/verificar-actualizacion.mjs`: Chrome aislado, Death Notes seleccionable y consultable, ausencia de duplicado en ayudas, cinco tamaños de pantalla, aviso visible, protección de paneles, partida con historial, dos pestañas, conservación de borradores y paquetes, actualizaciones sucesivas, activación offline, descarga fallida y activación automática al cerrar ventanas.
- `scripts/verificar-configuracion.mjs`: regresión de configuración, teclado, borradores, guardado, cinco tamaños, cuota y offline.
- Captura local `docs/verificacion/aviso-actualizacion.png`. Sin validación en dispositivos físicos ni en la web publicada.
