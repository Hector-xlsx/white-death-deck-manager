# Exportación y feedback de la primera partida

Fecha del registro: 20/10/2026. Partida física de dos jugadores, cada uno con tres personajes; uso en tablet horizontal. Observaciones del usuario, no una sesión física verificada por Codex.

## Implementado localmente: exportación JSON

Acceso: **Historial → Exportar partida (JSON)**. Descarga voluntaria en el navegador, disponible offline después de preparar la PWA. El archivo se puede adjuntar al chat para analizarlo. No envía correo ni datos a servidores. No incorpora cuentas, credenciales, backend ni sincronización.

Formato `white-death-partida`, `versionExportacion: 1`: versión de la aplicación, fecha ISO UTC, estado completo en `partida` y referencias de catálogo de enemigos, Daily y colección. Incluye configuración vigente y próxima configuración guardada, historial y niveles registrados por tanda, descartes/reemplazos/derivadas, fijados/desfijados, mazos, contadores, ajustes y respaldo de anulación existente. Las imágenes se conservan como rutas, no como archivos ni base64.

No exporta borradores del formulario. No reconstruye acciones físicas ni zombis manuales sin registrar; si quedó seleccionado amarillo al llegar físicamente a naranja, el archivo conserva amarillo. No es una auditoría de todos los clics: las tandas anuladas se retiran del historial y una nueva partida reemplaza la anterior. Exportar antes de iniciar otra para conservarla. No incluye un importador ni promete restauración automática desde este archivo.

La exportación no guarda, migra, sortea ni modifica la partida. Verifica formato válido y que el guardado no haya cambiado respecto al estado visible; ante conflicto entre pestañas avisa y no descarga un estado desactualizado. Un problema de recuperación bloquea la exportación normal para no presentar una partida inicial como si fuera la recuperada. El aviso de descarga indica revisar los archivos del dispositivo: el navegador controla el guardado final.

Cambios: `dist/exportacion.js`, integración en `dist/app.js` e `index.html`, precarga en `scripts/preparar.mjs` y regeneración de `dist/sw.js`/`version.js`. Pruebas en `tests/exportacion.test.js` y `scripts/verificar-exportacion.mjs`.

Validación: 13/13 pruebas originales y 369/369 actuales. Descarga real JSON comparada con el guardado completo; configuración pendiente, descartes, desfijados y respaldo conservados; partida vacía y rechazo de formato inválido; cinco tamaños (1440×900, 1024×768, 844×390, 390×844, 320×568); cuota simulada sin escrituras; conflicto de pestaña; recarga offline y nueva descarga. Captura `docs/verificacion/exportacion-tablet.png` revisada visualmente. QA con Chrome local y datos sintéticos; sin tablet física, Safari real ni datos de la partida del usuario. No se publicó ni se hizo push.

## Actualización desde Apariencia: implementada localmente

Actualización posterior autorizada e implementada localmente: Configuración → Apariencia → Actualizar aplicación → Buscar y aplicar actualización. Busca, descarga y aplica en la pestaña actual conservando el guardado. No descarta borradores: indica guardarlos o descartarlos y permite reintentar desde Configuración sin necesidad de cerrar todas las ventanas. Con conexión ausente o descarga fallida informa y mantiene la versión actual; una versión ya descargada puede aplicarse offline. QA ampliado en `scripts/verificar-actualizacion.mjs` con cinco tamaños, búsquedas sin cambios, una pulsación desde búsqueda hasta recarga, dos pestañas y borradores protegidos. Captura `docs/verificacion/actualizacion-apariencia.png` revisada. Primera carga del botón mediante el aviso anterior; no actualiza GitHub ni publica los cambios locales.

## Feedback recopilado: propuestas sin implementar

- Preservar SPAWN sencillo y consulta de cartas/reglas. Pantalla completa funcionó bien según el usuario.
- Puntaje accesorio para uso casual; se mantuvo oculto y no se ingresaron zombis manuales. No se propone exigirlos ni eliminar el cálculo existente.
- Adrenalina se pierde al desplazar la pantalla. Explorar ubicarla sobre el contador de zonas, centrada encima del número. El olvido de naranja no permite inferir qué tandas debieron usarlo.
- Aparición: modos horizontal con desplazamiento lateral, vertical y adaptativo actual. Son opciones de presentación por evaluar.
- Eliminar de la pantalla principal barra/porcentaje y rótulo Mazo general; retirar texto del pie y aviso permanente de disponibilidad offline. No eliminar la capacidad offline ni los avisos de error/actualización por esta propuesta.
- Integrar Última tanda/Ver cartas en el separador de muralla, y En juego/ojo/Mostrar desfijados en el de corrupción. Reducir separaciones entre zona y carta y entre cartas y separadores. Preservar inicialmente el tamaño de las cartas.
- Reagrupar Historial junto a Configuración y pantalla completa para aprovechar la altura.
- Aparición: encabezado en una fila cuando quepa, con Aparición, número de tanda y zonas iniciales. Retirar explicación permanente o trasladarla a ayuda opcional.
- Problema observado: se ven zonas y cartas, pero los botones quedan fuera de la altura visible. Evaluar primero compactación; después zoom de ±5 % independiente para pantalla principal y Aparición. Lupa junto al cierre en Aparición. No se ha definido mínimo/máximo, persistencia ni tratamiento exacto de controles al escalar. Configuración por resoluciones no seleccionada; se prefiere explorar ajuste sencillo a gusto del jugador.
- Nuevas alternativas para la pantalla principal: intercambiar Última tanda y En juego, dejando En juego en la sección intermedia; añadir un control plegable junto al título Última tanda para consultarla solo cuando sea necesario. Pueden combinarse, pero aún no se eligió distribución ni estado inicial del plegado.
- Desfijados permitió recuperar un nigromante retirado por error. Conservar esta recuperación. El ojo de En juego no se usó en esta partida; no implica retirar esa función.

## Siguiente paso

El 20/10/2026 el usuario autorizó subir ambos cambios a GitHub, lo que activa el workflow existente de Pages en `main`. Las menciones anteriores a «sin publicar» describen la validación local previa. Tras verificar el despliegue, descargar el JSON desde el dispositivo que guarda la partida y adjuntarlo al chat. La copia local del proyecto no contiene automáticamente los datos del navegador de la tablet. Revisar el archivo junto al feedback y la imagen de la tablet que el usuario indicó que aportará; todavía no se ha recibido esa imagen. Elegir una propuesta visual concreta antes de implementarla. Mantener separados los cambios de interfaz pendientes y la exportación ya construida. La partida local de localhost no se transfiere automáticamente al dominio de Pages.
