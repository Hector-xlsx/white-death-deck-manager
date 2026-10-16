# Estado de la base y migración

## Alcance de este registro

Los apartados siguientes describen la base recuperada y la migración inicial, no el estado actual de la aplicación. El cierre vigente del 13/10/2026 está en `docs/IMPLEMENTACION_ACTUAL.md`: Daily Spawn, cinco spawns de expansión y Fácil / Estándar implementados; 165 pruebas, verificación de navegador y recarga offline. Las limitaciones y el siguiente paso propuesto se detallan allí y en `docs/PLAN_IMPLEMENTACION.md`.

La copia `base-web/` se conserva como referencia histórica. Las partidas existentes mantienen su composición congelada; Daily y nuevas selecciones se aplican al iniciar otra partida. Se conserva el origen local y no se transfieren automáticamente datos entre Sites, localhost o Pages.

## Código recuperado

Sitio: https://white-death-pruebas.hector-xlsx.chatgpt.site

Versión de publicación consultada: 3. Commit de fuente recuperado: `d4ccbe677403906c4f5e8dcd76bf4cafff58d868`.

`base-web/` conserva los archivos servidos, pruebas, package.json y README de esa fuente. Los archivos de código y las doce cartas coinciden en bytes con la fuente recuperada. No se incluye historial Git, credenciales ni configuración privada del alojamiento.

```text
base-web/
  package.json
  README.md
  tests/engine.test.js
  dist/
    index.html
    style.css
    app.js
    engine.js
    sw.js
    manifest.webmanifest
    icon.svg
    icon-192.png
    icon-512.png
    assets/ (12 PNG)
```

Esta estructura es un inventario de rutas. `dist/` es la carpeta servida y contiene fuente escrita directamente; no existe una fuente TypeScript/React oculta ni una compilación que haya que reconstruir.

## Funciones encontradas

- Motor general de copias restantes, 12 tipos, filtros y reinicio estricto.
- Dos contadores y tandas con slots normales/nigromante.
- Reemplazo, descarte sin robo y adición de zona/carta por color.
- Fijados, desfijados y pregunta de resta de spawn.
- Historial, zoom, guardado y recuperación.
- PWA con precarga de las 12 imágenes.
- Interfaz WebMCP opcional ya existente para consulta y SPAWN; no necesita habilitarse ni ampliarse para la migración.

No implementa todavía secundarios, presencia por fijados, información por carta, expansiones, árboles de derivación ni pesos variables.

## Resultado de verificación

Se ejecutó `npm test` sobre la copia de fuente original y pasaron 13 de 13 pruebas, sin fallos. Verificado con Node `v24.19.0` en el entorno de preparación.

No se ha ejecutado QA visual ni prueba de modo avión en navegador para esta entrega. El README original también distingue esas comprobaciones. Las pruebas originales permanecen incluidas.

## Formato de partida anterior

Clave localStorage: `white-death-mvp-v1`.

Campos encontrados: `version=1`, `config` (`easy`, `normal`, `threshold`), `initial`, `remaining`, `normal`, `necro`, `history`, `pins`, `unpinned` opcional, `cycle`, `sequence`, `openBatch`.

Cada tanda contiene `number`, `date`, `normal`, `necro` y `slots`. Cada slot tiene `zone`, `kind` y `draws`; cada extracción tiene `uid`, `cardId`, `discarded` y `cycle`. Los fijados conservan el ID de extracción. Los IDs de catálogo del mazo base deben mantenerse.

La base usa `slotIndex` para varias acciones. Eso es suficiente en su estructura actual, pero no para insertar subárboles con posiciones variables: la ampliación debe migrar a IDs estables.

La validación original es básica. Mejorar al extender: unicidad global de extracciones, integridad de referencias, tipos/contadores, `sequence` coherente, relaciones padre/raíz, ciclos válidos y reglas de configuración. No inventar una identidad de enemigo para un fijado genérico.

## Transferencia de partida entre dominios

La copia de fuente no contiene la partida real del usuario. El almacenamiento local pertenece al origen del navegador, por lo que Sites y GitHub Pages no comparten automáticamente el mismo localStorage.

Como complemento se entrega `complementos/EXPORTAR_PARTIDA_SITES.js`. El usuario puede ejecutarlo voluntariamente en la consola del navegador, estando en el sitio original, para descargar el JSON de la clave anterior. Ese script no envía datos a un servidor ni modifica la partida.

La app ampliada deberá implementar/autorizar un importador antes de recibir esa partida: validar estructura, migrar v1, previsualizar y confirmar sustitución del estado local. Hasta entonces, conservar el JSON como respaldo y no copiarlo manualmente sobre una estructura nueva sin validar.

No se necesita que el usuario revele su partida para desarrollar: los tests usan estados sintéticos. No añadir sincronización para resolver esta migración.

## Publicación preparada

`complementos/github-pages.yml.example` es un ejemplo inactivo para una aplicación estática con `dist/` en la raíz del nuevo proyecto. Incluye las pruebas antes de publicar y solo dispara manualmente (`workflow_dispatch`). Si el proyecto final usa otra ruta o compilación, adaptarlo.

Fuente primaria consultada el 7 de octubre de 2026 UTC: [GitHub Docs · Using custom workflows with GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages). La guía consultada usa checkout v6, configure-pages v5, upload-pages-artifact v4 y deploy-pages v4. Revalidar versiones si se publica mucho después.

Preparar el archivo no activa Pages ni autoriza push/deployment. Al publicarlo, confirmar nombre y visibilidad del repositorio y revisar los accesos deseados del sitio. El sitio privado actual no vuelve privado automáticamente un futuro sitio de Pages.

## Service worker

La base precarga archivos relativos a su scope y usa `skipWaiting`/`clients.claim`. Las rutas relativas facilitan subrutas; verificarlo después de cambiar estructura. Revisar actualización de código/estado para impedir que un formato nuevo sustituya en mitad de partida el código viejo.

Al ampliar recursos, decidir estrategia de precarga completa o descarga explícita por contenido elegido. Un mensaje Disponible offline no debe mostrarse si faltan cartas/reglas de la configuración actual.
