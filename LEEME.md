# Gestor de mazos Zombicide · Paquete para Codex

Preparado el 6 de octubre de 2026, hora de Chile. Este paquete reúne la aplicación de prueba existente, el prompt de desarrollo, las reglas iteradas y los recursos recuperados. Las ampliaciones todavía no están implementadas en la copia de la web.

## Cómo empezar

1. Descomprime el ZIP y abre esta carpeta como proyecto en Codex.
2. Pega el contenido completo de `PROMPT_CODEX.md` en un nuevo hilo de trabajo.
3. Codex debe leer `AGENTS.md` y la documentación, ejecutar las pruebas de la base y trabajar por las etapas indicadas. Las preguntas de reglas pendientes deben resolverse antes de implementar el comportamiento afectado; el resto del proyecto puede avanzar.

No hace falta pegar todas las conversaciones anteriores. Este paquete conserva las decisiones y distingue los acuerdos de las propuestas.

## Contenido

| Ruta | Uso |
|---|---|
| `PROMPT_CODEX.md` | Instrucciones completas para empezar el desarrollo. |
| `AGENTS.md` | Reglas de trabajo específicas del proyecto. |
| `docs/ESPECIFICACION_FUNCIONAL.md` | Comportamiento del producto, interfaz y ampliaciones. |
| `docs/DECISIONES_PENDIENTES.md` | Reglas abiertas y propuestas explícitamente no confirmadas. |
| `docs/PLAN_IMPLEMENTACION.md` | Etapas y condiciones para avanzar. |
| `docs/CRITERIOS_ACEPTACION.md` | Casos que deben verificarse. |
| `docs/ESTADO_BASE_Y_MIGRACION.md` | Código recuperado, almacenamiento y traslado desde Sites. |
| `docs/RECURSOS_Y_CATALOGO.md` | Cómo completar catálogos sin inventar datos. |
| `datos/` | Mazo base validado, inventarios y borradores de expansión/enemigos. |
| `recursos/` | Escaneos originales, traducciones y variantes por revisar. |
| `base-web/` | Copia funcional de la web actual, con sus pruebas. |
| `complementos/` | Ejemplo de publicación y exportación manual de la partida. |
| `MANIFIESTO_ENTREGA.json` | Inventario de archivos con hashes SHA-256. |

## Probar la web actual

Desde esta carpeta:

```bash
cd base-web
npm test
```

Para abrir la interfaz, vuelve a la carpeta del paquete y ejecuta:

```bash
python -m http.server 8080 --bind 127.0.0.1 --directory base-web/dist
```

Abre `http://127.0.0.1:8080/`. La copia no requiere instalar dependencias ni compilar. Necesita un navegador moderno y una versión de Node que soporte `node --test` para las pruebas. No abras `index.html` mediante `file://`, porque utiliza módulos JavaScript y service worker.

## Qué está validado

La base contiene 12 tipos de carta y 56 copias. Se ejecutaron y pasaron sus 13 pruebas del motor durante la preparación. No se ha verificado visualmente esta copia en un navegador durante esta entrega. Los catálogos nuevos son borradores; disponer de una imagen no confirma cantidades, expansiones ni reglas automáticas.

El sitio existente sigue siendo la referencia visual: https://white-death-pruebas.hector-xlsx.chatgpt.site . Su acceso permanece como estaba. Este paquete no publica cambios ni crea un repositorio nuevo.

Las partidas guardadas no se copian automáticamente entre el dominio de Sites y GitHub Pages. Consulta `docs/ESTADO_BASE_Y_MIGRACION.md` si quieres trasladar una partida.
