# Zombicide: White Death — Deck Manager

Aplicación estática en español para partidas físicas. Conserva la interfaz y el motor de White Death, con 12 tipos y 56 copias. La carpeta `base-web/` permanece intacta como referencia; la aplicación de trabajo está en `dist/`.

## Ejecutar

Con Node moderno, desde la raíz:

```sh
npm run preparar
npm test
npm start
```

Abre http://127.0.0.1:8080/mazo/ . El servidor sirve deliberadamente una subruta para comprobar la compatibilidad con Pages. No hay dependencias de producción ni compilación del código de la interfaz. `preparar` genera el catálogo y el service worker desde los JSON y verifica/copia las imágenes sin modificar sus píxeles. Hay que ejecutarlo después de cambiar datos o código servido.

Si Node no está en PATH, en esta máquina:

```powershell
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/preparar.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test tests/*.test.js
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/servir.mjs
```

El puerto se cambia con `MAZO_PUERTO`. Se necesita HTTP local o HTTPS para los módulos y la PWA; abrir el HTML como archivo no es suficiente.

## Estado

Beta publicada: [Zombicide: White Death — Deck Manager](https://hector-xlsx.github.io/white-death-deck-manager/). Versión `ada49f64804d89a4`; **305/305** pruebas de aplicación y 13 originales aprobadas también en GitHub Actions. Repositorio público [Hector-xlsx/white-death-deck-manager](https://github.com/Hector-xlsx/white-death-deck-manager). Evidencia de publicación en [docs/PUBLICACION_GITHUB.md](docs/PUBLICACION_GITHUB.md); antecedentes y pruebas en mesa en [docs/CONTINUIDAD_GITHUB_Y_MESA.md](docs/CONTINUIDAD_GITHUB_Y_MESA.md).

Estado vigente en [docs/IMPLEMENTACION_ACTUAL.md](docs/IMPLEMENTACION_ACTUAL.md), fórmula en [docs/PUNTAJE.md](docs/PUNTAJE.md) y pendientes en [docs/DECISIONES_PENDIENTES.md](docs/DECISIONES_PENDIENTES.md). Puntaje temporal y derrotas implementados; ajustes manuales separados de Caminantes/Brutos/Corredores. Fichas de reglas core y expansiones disponibles. Tokens/marcos/separador/banderines completados; compatibilidad de Abominaciones (22) retirada por el usuario. Siguen pendientes 5, 6, 8/23, revisión restante del 9 y cierre/historial del 28. Los puntos siguientes describen capacidades y antecedentes; prevalecen esos documentos vigentes.

- Mazo general, tandas, reemplazos, descartes, contadores, historial, fijados y desfijados funcionales.
- Nivel de adrenalina manual en el encabezado, nombre blanco sobre fondo del color seleccionado, flechas sin navegación circular y nueva partida en Azul. Guardado local, nivel congelado por tanda y restauración al anular; sin incremento durante SPAWN ni selector dentro de Aparición. Partidas antiguas sin el campo muestran Azul sin inventar niveles históricos.
- Modos de nigromantes Estándar / Varios / Personalizado y abominaciones Estándar / Festival / Personalizado. Personalizado inicial en ambos. Modo, selección y cajas se pueden cambiar durante partida y se aplican desde próxima tanda; enemigos presentes conservados. Estándar de abominaciones excluye trofeos y usa Kan como respaldo si no hay otra apta. Las partidas de prueba previas se reinician una vez al cargar esta revisión, conservando configuración y topes. Detalle vigente: `docs/CONFIGURACION_DURANTE_PARTIDA.md`.
- Topes solo Personalizado: adicionales 0/0/1/1 más el espacio reservado del Profanador (máximos totales potenciales 1/1/2/2), abominaciones 1/2/3/4. Perfiles no decrecientes, ajustes desde próxima tanda y snapshots para regeneraciones/reemplazos. Presencia existente conservada si supera el cupo. Nigromantes personalizados: cinco acciones más azar; azar filtra spawn sin cupo/candidatos y después aplica, cuando corresponde, 50% independiente por adicional. Destinatarios y resultados persistidos.
- Anular la última tanda desde Aparición o al reabrirla: confirmación y restauración completa al estado previo a SPAWN. Un único respaldo persistido; la tanda anterior no se puede anular a continuación. Tandas antiguas sin respaldo se conservan, y el próximo SPAWN habilita la anulación.
- Selección por carta en White Death → Core → Tipo. Dificultad y selección se adoptan en próximo SPAWN; el umbral mantiene su aplicación inmediata. Las cartas incluidas conservan restantes; las retiradas dejan de sortearse sin invalidar historial.
- Colección por caja y cinco filtros: Zombis, Abominaciones, Nigromantes, Daily Spawn y Otros. Core y las cartas de Otros son obligatorios; Core retrocompatibilidad es independiente. Selección masiva limitada al filtro y cajas habilitadas. Selección de enemigos desde próxima tanda; quitar/remarcar trofeos derrotados no los libera. Advertencia al salir sin guardar y validación de candidatos, con Kan de respaldo en Estándar.
- Mazo de abominaciones con/sin reposición, aparición auto-fijada y devoluciones al anular/regenerar. Estándar activa la identidad elegida; Festival activa todas y luego roba otra disponible. Trofeos/agotamiento no reviven ni duplican enemigos. Reglas especiales individuales restantes pendientes.
- Profanador obligatorio y prioritario en los tres modos nuevos. Solo él crea zona y aporta al contador verde; retirarlo elimina su zona para siguientes tandas. Robo y resolución de su zona al final, con carta boca abajo durante la revelación de las demás. Varios activa únicamente al Profanador y después aparece otro. Referencias de activación con sello/zoom no consumen cartas ni aumentan presencia.
- Daily Spawn operativo: siete identidades únicas de Frozen Fortress, base/incremento editables por adrenalina y aumento por carta o tanda. Cambiar de nivel conserva los puntos acumulados; aparición reinicia el aumento y tasa máxima 100%. Devolución/refijado y cancelaciones conservados. Inicialmente desactivado con 0/0 por nivel; ajustes desde próxima tanda, conservando los aportes históricos con sus parámetros originales. Reglas especiales individuales pendientes.
- Cinco fichas de spawn de expansión operativas, 24 copias adicionales seleccionables; Core conserva 56. Fácil / Estándar visible, con Normal interno por compatibilidad. Bestias divinas Aparición sigue incompleta y fuera del sorteo.
- Recursos de la colección organizados en las carpetas `00–05`: 60 imágenes clasificadas.
- Zonas con título único y línea inferior compartida en Aparición, historial y última tanda. Flechas de genérica a nigromante y de este a su nueva zona; nombres derivados sin sufijos visibles -2/-3. Relaciones y etiquetas guardadas intactas. Espacio superior ajustado por marco, conservando imágenes completas de 155 px.
- Información por carta preparada para vínculos confirmados. Actualmente ninguno está confirmado: las ayudas se consultan desde Configuración, sin asignarlas por inferencia.
- Migración automática de v1 en el mismo origen, validación y guardado antes de publicar cada acción. El guardado anterior se conserva en su clave original.
- Precarga completa de los 60 recursos clasificados más app, iconos y cartas base. El indicador offline comprueba el paquete completo de la versión activa.

La preparación ya no lee `recursos/originales`, `recursos/traducciones_es` ni `recursos/variantes_por_revisar`. Esas carpetas del paquete anterior se pueden eliminar; `base-web/` se conserva como referencia. El Excel permanece como referencia editable y no fue modificado durante esta reorganización.

Abominaciones utiliza las 20 identidades confirmadas, una copia de Kijin con imagen corregida; nigromantes utiliza 10 identidades. Bestias divinas Activación y Death Notes siguen como referencias sin automatización ni entrada al sorteo confirmada. El Excel no fue modificado. Consultar una ficha no ejecuta sus reglas.

## Guardado y actualizaciones

La partida v2 usa `white-death-gestor-v2`; la migración lee `white-death-mvp-v1` sin reemplazarla. Una partida guarda la composición y una instantánea del catálogo. Una actualización no cambia sus cantidades. Un error de lectura bloquea las mutaciones hasta iniciar una partida nueva con confirmación; no hay limpieza automática. El fallo de escritura conserva el estado anterior. Las pestañas del mismo origen reciben las acciones guardadas; una pestaña desactualizada rechaza su acción antes de sortear y permite repetirla sobre la partida actual.

El usuario autorizó reiniciar las partidas de prueba anteriores: la app guarda una partida nueva con configuración conservada y marca de revisión, sin repetir el reset en recargas posteriores. Guardar cambios durante una partida prepara próxima tanda; su adopción, mazos y respaldo se guardan atómicamente con SPAWN. Las tandas anteriores conservan su configuración y referencias, incluso si se retiró contenido. Los catálogos secundarios conservan las identidades históricas y separan candidatos habilitados de presencia, descartes y trofeos. Desfijar/refijar al Profanador ajusta su zona sin repetir robos resueltos.

Una actualización PWA queda esperando mientras haya pestañas de la app abiertas. Recargar conserva el paquete activo completo. Cierra todas las pestañas de la app y vuelve a abrir para activar la nueva versión; los datos locales permanecen. La descarga necesita conexión y espacio suficientes. Borrar el almacenamiento del navegador elimina la partida y la precarga.

Las partidas de Sites no aparecen en este origen local ni en Pages. El importador de respaldos sigue pendiente de solicitud.

## Validación

Las 13 pruebas originales se ejecutaron antes de editar. Las 236 previas más 21 de configuración durante partida suman 257 pruebas aprobadas. Cubren motor, catálogo, secundarios, cadenas, presentación, cancelación, persistencia, migración, adrenalina, probabilidades, límites, modos, prioridad, azar, referencias, robos diferidos, inventarios activos, trofeos, cambios de configuración y reset único. Una prueba prepara la app en una copia temporal con las carpetas `00–05`. Las comprobaciones de navegador usan Playwright y Chrome instalados en el entorno, sin añadirlos a la aplicación:

```powershell
$env:MAZO_PLAYWRIGHT = 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules\playwright'
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-navegador.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-abominaciones.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-nigromantes.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-anular-tanda.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-desfijados.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-desfijar.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-distintivos.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-marcos.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-zonas.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-modos.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-configuracion-partida.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-devolucion.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-daily.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-daily-adrenalina.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-adrenalina.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-limites.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-contenido.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-volteo.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-revelacion.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-acciones-enemigos.mjs
& 'C:\Users\hecto\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' scripts/verificar-actualizacion.mjs
```

Los scripts de interfaz requieren el servidor local. `verificar-actualizacion.mjs` crea un servidor temporal y simula dos versiones sin editar los archivos publicados. `MAZO_PLAYWRIGHT` permite indicar otra instalación; `MAZO_NAVEGADOR` permite usar otro canal Chromium compatible. Evidencias y límites en `docs/IMPLEMENTACION_ACTUAL.md`.

## GitHub Pages

Actualización 16/10/2026: el workflow activo publica automáticamente al subir cambios a `main`, después de preparar recursos y aprobar las pruebas. También conserva **Run workflow** manual. Los apartados históricos inferiores de preparación inicial no describen este estado vigente.

Workflow preparado en `.github/workflows/pages.yml`, con ejecución manual. Comprueba la base original y la aplicación antes de publicar exclusivamente `dist/`. Configurar Pages con GitHub Actions y ejecutar «Publicar White Death Deck Manager» después de subir los archivos.

Publicación beta del 16/10/2026 completada mediante GitHub Actions, después de seleccionar esa fuente en Pages. Nombre solicitado y etiqueta `noindex, nofollow` incluidos. Versión `ada49f64804d89a4`, commit desplegado `ccba96a`; [ejecución aprobada](https://github.com/Hector-xlsx/white-death-deck-manager/actions/runs/38983701923). La web y el repositorio son públicos; la etiqueta no constituye control de acceso. Las partidas de localhost/Sites no se transfieren automáticamente a este origen. Detalle, validaciones y límites en [PUBLICACION_GITHUB.md](docs/PUBLICACION_GITHUB.md).
