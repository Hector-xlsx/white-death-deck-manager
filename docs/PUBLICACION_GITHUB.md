# Preparación de publicación beta · 16/10/2026

Estado: preparada y validada localmente; pendiente de crear el repositorio y publicar en GitHub Pages.

El usuario solicitó subir la aplicación a GitHub y usar Pages, con nombre **Zombicide: White Death — Deck Manager**, repositorio `white-death-deck-manager` y etiqueta `<meta name="robots" content="noindex, nofollow">` durante la beta.

La cuenta comprobada mediante el conector es `Hector-xlsx`. Destino previsto: https://github.com/Hector-xlsx/white-death-deck-manager. URL prevista, todavía sin publicación verificada: https://hector-xlsx.github.io/white-death-deck-manager/.

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

Sin pruebas en dispositivos físicos, Actions remoto ni sitio publicado todavía.

## Acceso pendiente y siguiente paso

El conector de GitHub permite consultar la cuenta y administrar contenidos, pero las herramientas disponibles no permiten crear repositorios ni configurar Pages. No había credencial CLI no interactiva y el navegador integrado solicitó inicio de sesión. El usuario indicó que tenía GitHub Desktop instalado: se comprobó allí la sesión de `Hector-xlsx` y se agregó la carpeta existente. La creación/subida se prepara desde Desktop, sin extraer sus credenciales.

El usuario confirmó explícitamente la visibilidad **pública**, para usar GitHub Pages gratis.

Pasos de publicación:

1. Crear `Hector-xlsx/white-death-deck-manager` con la visibilidad elegida, sin sustituir otro repositorio existente.
2. Subir los archivos revisados de la rama `main`.
3. Seleccionar GitHub Actions como fuente en Settings → Pages.
4. Ejecutar manualmente «Publicar White Death Deck Manager» y comprobar ambos trabajos.
5. Verificar el sitio real y registrar URL, commit, ejecución de Actions y versión publicada. Se puede reutilizar la comprobación con `MAZO_URL=https://hector-xlsx.github.io/white-death-deck-manager/` y `MAZO_PLAYWRIGHT` apuntando a la instalación existente.

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
