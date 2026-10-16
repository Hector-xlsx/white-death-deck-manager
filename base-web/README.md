# White Death · Gestor de mazos de prueba

MVP de apoyo para teléfono y tablet, con prioridad horizontal. Aplicación estática sin dependencias ni servicios de datos externos.

- Catálogo suministrado por Héctor: 12 tipos, 56 copias. Escaneos originales suministrados por tipo; valores de adrenalina consultables al ampliar.
- Extracciones sin reposición ponderadas por copias restantes.
- Filtros Fácil/Normal aplicados al iniciar nueva partida; 28 cartas sin dificultad siempre incluidas.
- Umbral estricto de reinicio comprobado después de cada carta. 0% reinicia al agotarse. El reinicio conserva el historial y contadores.
- Una tanda por pulsación de SPAWN, con zonas normales y de nigromante según sus contadores manuales.
- Cambiar una carta consume otra copia, conserva la anterior marcada sin efecto en el historial y no añade una tanda.
- Fijados por extracción; desfijar un nigromante pregunta si se resta una zona cuando el contador es mayor que cero.
- Guardado transaccional en localStorage, recuperación de última tanda abierta, configuración, mazo, fijados y contadores.
- PWA con precarga de recursos y cartas mediante service worker para uso offline una vez completada su instalación. El acceso inicial al sitio privado requiere conexión e inicio de sesión de Sites.

La aplicación no decide los efectos en la mesa ni aumenta automáticamente zonas. Mazos secundarios, reglas de enemigos concretos, modos de activación y zombis especiales quedan para versiones futuras.

## Validación

`npm test` comprueba catálogo, filtros, selección por copias, agotamiento, umbral estricto, reinicio dentro de una tanda, reemplazos y serialización de partida.

Archivos servidos: `dist/`. No requiere compilación. No se ha realizado verificación visual en navegador en este entorno.

Interfaz WebMCP opcional: consultar partida y revelar tanda usan las mismas acciones. No se dispone de un contexto de navegador permitido para validar su registro aquí; los navegadores sin soporte continúan por la interfaz normal.

## Ajustes de Aparición y referencias

Acciones compactas por símbolos: fijar, regenerar y descartar sin robar. El descarte no devuelve copias al mazo ni cambia las zonas. Los botones adicionales normal/blanco y nigromante/verde roban una carta en la tanda actual y aumentan su contador; las zonas continúan numeradas dentro de esa tanda. El historial permite fijar cualquier extracción. Las referencias desfijadas se guardan a la derecha, con la más reciente primero y opción de volver a fijar. Las partidas del formato anterior siguen siendo compatibles.

## Cartas originales

Las 12 imágenes PNG se conservan sin modificaciones. Fácil: 429 Caminantes, 435 Brutos, 442 Corredores. Normal: 444 Caminantes, 451 Brutos, 455 Corredores. El resto se vincula por su nombre y número (461, 471, 474, 481, 483 y 484). Las imágenes de demostración se retiraron; los IDs de cartas y el formato de partida siguen siendo compatibles.
