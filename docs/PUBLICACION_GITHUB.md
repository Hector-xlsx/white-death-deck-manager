# Publicación beta · 16/10/2026

## Actualización preparada: vista de mesa · 16/10/2026

Versión 47847e6c461f9bb7: principal sin resúmenes de depuración ni pie de Última tanda, porcentaje de mazo restante y acciones de enemigos en Configuración. 305/305 pruebas y QA verificar-vista-mesa.mjs. Subida a main solicitada por el usuario; el workflow de Pages permanece manual y no se despacha como parte de esta subida. La evidencia de publicación inferior corresponde a la versión beta anterior.

Estado: aplicación publicada en GitHub Pages; preparación y despliegue aprobados.

El usuario solicitó subir la aplicación a GitHub y usar Pages, con nombre **Zombicide: White Death — Deck Manager**, repositorio `white-death-deck-manager` y etiqueta `<meta name="robots" content="noindex, nofollow">` durante la beta.

La cuenta comprobada mediante el conector y GitHub Desktop es `Hector-xlsx`. Repositorio público: https://github.com/Hector-xlsx/white-death-deck-manager. Sitio: https://hector-xlsx.github.io/white-death-deck-manager/.

Commit desplegado: `ccba96aed71a0b8e25b635626a9de951b3f3c84a`. [Ejecución de publicación aprobada](https://github.com/Hector-xlsx/white-death-deck-manager/actions/runs/38983701923), trabajos `comprobar-y-preparar` y `publicar` correctos. El despliegue confirmó la URL indicada. Los ajustes documentales posteriores no cambian el paquete servido ni necesitan otro despliegue.

## Preparación realizada

- `dist/index.html`: título solicitado y etiqueta robots en el HTML inicial.
- `dist/manifest.webmanifest`: nombre completo de la aplicación; mantiene rutas relativas y nombre corto White Death.
- `dist/version.js` y `dist/sw.js`: regenerados mediante el comando existente. Versión `ada49f64804d89a4`.
- `.github/workflows/pages.yml`: workflow manual que usa Node 24, comprueba las 13 pruebas originales, prepara recursos, ejecuta las pruebas de la aplicación y publica exclusivamente `dist/` mediante GitHub Actions. No publica automáticamente al subir cambios.
- Git inicializado en la carpeta local, rama `main`. Se conservan `base-web/`, recursos originales y datos de referencia.
- `.gitignore`: excluye secretos `.env`, logs/capturas de verificación, `outputs/`, el Excel de referencia y el manifiesto histórico de entrega. Los archivos locales se conservan; el Excel no es necesario para preparar la app ni ejecutar las pruebas, que utilizan las instantáneas en código/JSON.
- `scripts/verificar-publicacion.mjs`: comprobación de subruta exacta, metadatos, PWA, SPAWN, tamaños y recuperación offline. Usa Playwright del entorno; no incorpora dependencias a la aplicación.

No se modificaron reglas, cantidades, imágenes ni partidas del usuario. Las pruebas de navegador utilizan contextos aislados.

## Validación realizada

- `node --test --test-reporter=dot base-web/tests/engine.test.js`: 13 aprobadas.
- `node scripts/preparar.mjs`: 56 copias base, 60 recursos clasificados, versión `ada49f64804d89a4`.
- `node --test --test-reporter=spec tests/*.test.js`: 305/305 aprobadas, sin fallos. Salida local en `outputs/pruebas-publicacion.txt`.
- `scripts/verificar-publicacion.mjs`: Chrome, servidor temporal bajo `/white-death-deck-manager/`; título, robots, manifest y scope correctos, recursos sin HTTP 4xx/5xx, SPAWN persistido, cinco tamaños 1440×900 / 1024×768 / 844×390 / 390×844 / 320×568 sin desbordamiento horizontal, recarga offline sin cambios al guardado. Capturas en `outputs/publicacion/`; revisada visualmente la de 844 px.
- `scripts/verificar-actualizacion.mjs`: conserva paquete anterior mientras hay pestañas abiertas y conserva partida/offline al activar la nueva versión.

Los primeros intentos de navegador dentro del aislamiento fallaron con `ERR_NETWORK_ACCESS_DENIED`. Las verificaciones finales se ejecutaron fuera de ese aislamiento y aprobaron. La nueva comprobación espera a que se guarde el cierre de la tanda antes de comparar el guardado tras recargar.

Verificados en GitHub los archivos `dist/version.js`, `dist/index.html` y el workflow: versión y título correctos, etiqueta robots presente. También aprobaron en el runner Linux de Actions las 13 pruebas originales, las 305 de la aplicación, la preparación del catálogo/recursos, el empaquetado y el despliegue. Sin pruebas en dispositivos físicos.

Validación final del sitio público: `scripts/verificar-publicacion.mjs` con `MAZO_URL=https://hector-xlsx.github.io/white-death-deck-manager/` aprobó en Chrome aislado. HTTP 200, versión `ada49f64804d89a4`, título, etiqueta robots, manifest y scope correctos; imágenes/módulos cargados, SPAWN persistido, cinco tamaños sin desbordamiento y recarga sin conexión con el mismo guardado. Salida en `outputs/verificacion-pages-publicado.txt` y capturas en `outputs/publicacion/app-*.png` (actualizadas con el sitio real). La prueba no toca las partidas del navegador habitual del usuario.

Siguiente paso: abrir esta URL en teléfono/tablet reales, esperar «Disponible offline» antes de desconectar y realizar las pruebas de mesa de CONTINUIDAD_GITHUB_Y_MESA.md. Las comprobaciones automatizadas de escritorio no sustituyen esa prueba física.

## Publicación y próximos despliegues

La creación del repositorio y subida inicial se realizaron mediante GitHub Desktop, con la sesión de `Hector-xlsx` comprobada y sin extraer sus credenciales. Los reintentos de publicación se ejecutaron mediante el conector de GitHub.

El usuario confirmó explícitamente la visibilidad **pública**, para usar GitHub Pages gratis.

Pasos completados:

1. Completado: crear `Hector-xlsx/white-death-deck-manager` público, sin sustituir otro repositorio existente.
2. Completado: subir los archivos revisados de la rama `main` mediante GitHub Desktop.
3. Completado por el usuario: seleccionar GitHub Actions como fuente en Settings → Pages.
4. Completado: ejecutar «Publicar White Death Deck Manager» y comprobar ambos trabajos aprobados.
5. URL, commit y ejecución registrados arriba. Para comprobar el sitio se usa `MAZO_URL=https://hector-xlsx.github.io/white-death-deck-manager/` y `MAZO_PLAYWRIGHT` apuntando a la instalación existente.

Los primeros intentos fallaron con `Get Pages site failed / Not Found` al preparar Pages. El usuario cambió Source de «Deploy from a branch» a «GitHub Actions» y proporcionó capturas de la configuración; tras ese cambio el reintento aprobó sin modificar código ni workflow. El control de Chrome no pudo verificar la URL en este entorno; la validación y los reintentos finales se realizaron mediante API/conector. No se accedió a la autenticación de Google.

Para versiones futuras: preparar los cambios, probar, subir a `main` y ejecutar manualmente el workflow. No volver a activar Pages ni crear otro workflow desde los botones Configure. Una subida de código por sí sola no despliega con esta configuración.

Para retirar la publicación, desactivar Pages desde el repositorio. Para volver a una versión anterior, publicar nuevamente un commit previamente verificado, sin borrar el almacenamiento del navegador.

## Alcance de privacidad

`noindex` indica a los buscadores que respeten la directiva que no incluyan esta página en sus resultados; `nofollow` les indica que no sigan sus enlaces. No establece contraseña, permisos ni una garantía de invisibilidad. La app y los recursos servidos siguen accesibles por URL. No se añade un bloqueo `Disallow` de rastreo que impida a los buscadores leer la etiqueta.

GitHub Pages en una cuenta Free requiere un repositorio público. Con Pro o superior puede publicarse desde un repositorio privado, pero eso por sí solo no vuelve privada la web. No se contrata ni cambia un plan en esta preparación.

Las partidas de localhost o Sites no se transfieren automáticamente a Pages: cada origen tiene su propio almacenamiento. No se implementó un importador en esta tarea.

Fuentes oficiales consultadas:

- [GitHub: crear un sitio Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/creating-a-github-pages-site).
- [GitHub: workflows propios para Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).
- [GitHub: setup-node](https://github.com/actions/setup-node).
- [Google: especificación de robots meta](https://developers.google.com/search/docs/crawling-indexing/robots-meta-tag).
