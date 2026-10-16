# Reglas de trabajo · Gestor de mazos Zombicide

## Propósito y prioridades

Aplicación de apoyo a partidas físicas, para teléfono y tablet, con prioridad horizontal, offline y guardado local. Interfaz en español. Desarrollo incremental y funcional. Conserva el diseño que ya le gustó al usuario.

Lee primero `PROMPT_CODEX.md`, `docs/ESPECIFICACION_FUNCIONAL.md`, `docs/DECISIONES_PENDIENTES.md`, `docs/PLAN_IMPLEMENTACION.md` y `docs/ESTADO_BASE_Y_MIGRACION.md`.

## Fuentes y datos

- `base-web/` es una copia de referencia funcional. Conserva esa copia; prepara el proyecto de trabajo aparte o en la raíz mediante una copia explícita.
- `datos/mazo_base.json` contiene los datos acordados de las 56 cartas. Preserva sus IDs para migrar las partidas existentes.
- El nombre de una imagen, su número impreso y el número de archivos no son cantidades de copias.
- `null`, `pendiente` y `tipo_sugerido` representan información no confirmada. Nunca conviertas `null` en 1 ni habilites automáticamente cartas incompletas.
- Revisa discrepancias entre catálogo e imagen; comunícalas antes de cambiar cantidades o reglas.
- Usa los originales y las traducciones suministrados. No generes cartas, textos de reglas o números faltantes.
- Las traducciones de imagen son recursos de referencia y requieren revisión; no son una fuente suficiente para automatizar reglas especiales.
- Si hace falta una regla oficial que no está en el material, consulta una fuente primaria o pide el manual correspondiente. Separa reglas oficiales, reglas de casa y decisiones técnicas.

## Alcance

- Ejecuta las etapas acordadas; no añadas sincronización, cuentas, backend, multijugador ni seguimiento de combate.
- Reposiciones/pesos adaptativos de mazos secundarios y aparición probabilística de zombis especiales quedan documentados como evolución futura.
- Las propuestas en `DECISIONES_PENDIENTES.md` no están aprobadas. Pregunta únicamente las decisiones de reglas necesarias para la siguiente etapa. Continúa el trabajo independiente mientras se aclaran.
- No establezcas reglas de casa por analogía con otro juego.
- Preparar un workflow no significa publicar. No crees repositorios, hagas push, cambies la privacidad o despliegues sin una instrucción del usuario que autorice esas acciones.

## Implementación

- Reutiliza la base estática y sus patrones. Justifica un cambio de stack por una necesidad concreta; evita migraciones completas solo por preferencia.
- Variables, tipos y funciones nuevas en español cuando sea razonable. Mantén IDs y campos históricos necesarios para compatibilidad.
- Separa catálogo, motor de mazos, resolución de efectos, persistencia e interfaz. Usa IDs estables en vez de posiciones de arrays.
- Motor comprobable con RNG inyectable. Ningún sorteo o cambio de estado durante el render.
- Una acción aceptada se guarda completa; ante fallo de almacenamiento, conserva el estado anterior. No registres imágenes en base64 dentro de la partida.
- No borres partidas ante un error, cambio de versión o catálogo incompleto. Implementa validación y migraciones explícitas.
- Cancelaciones derivadas, botones de elección y aportes a contadores deben ser idempotentes y soportar recargas.
- Las rutas de recursos, manifest y service worker deben funcionar en la subruta de un repositorio de GitHub Pages.
- No copies credenciales, configuración privada del alojamiento, historial Git o variables de entorno al nuevo proyecto.
- HTML creado desde datos debe escapar texto. Los recursos de referencia admiten rutas locales controladas, no HTML arbitrario.

## Verificación y entrega

- Ejecuta las 13 pruebas existentes antes de refactorizar. Añade pruebas significativas para las cadenas, cancelaciones, modos de enemigo y migración.
- Verifica offline real, recuperación con ventanas abiertas, móvil horizontal/vertical y tablet en navegador cuando el entorno lo permita. Distingue comprobaciones automáticas de verificaciones visuales.
- Actualiza documentación, datos y pruebas al cambiar una regla. Reporta lo completado y lo pendiente sin decir que una función está terminada si faltan datos o verificaciones.
- No repitas baterías completas sin cambios que lo justifiquen.
