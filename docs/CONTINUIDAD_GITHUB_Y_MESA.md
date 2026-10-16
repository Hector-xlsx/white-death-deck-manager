# Continuidad: GitHub y pruebas en mesa · 16/10/2026

## Punto de partida verificado

- Carpeta de trabajo: C:/Users/hecto/OneDrive/Escritorio/Aplicaciones/Mazo White death.
- Aplicación estática/PWA en dist/, sin backend ni cuentas. base-web/ es referencia conservada.
- Versión preparada actual: 13d36a64c0299dd4 (dist/version.js).
- URL local: http://127.0.0.1:8080/mazo/. scripts/servir.mjs escucha en 127.0.0.1:8080; localhost del PC no es una URL accesible desde otro teléfono.
- No existe .git en esta carpeta. No se creó repositorio remoto, no hubo push ni publicación en este cierre.
- No hay .github/workflows/pages.yml activo. complementos/github-pages.yml.example es un ejemplo inactivo, con ejecución manual y artifact dist/.
- Este cierre modifica solo documentación: no código, Excel, imágenes, guardados ni configuración.

## Qué leer al comenzar el próximo chat

1. AGENTS.md y las fuentes de proyecto que indica.
2. IMPLEMENTACION_ACTUAL.md: lo vigente está al comienzo; los apartados antiguos son antecedentes.
3. DECISIONES_PENDIENTES.md: tabla vigente con numeración preservada.
4. PUNTAJE.md: fórmula y excepciones actuales.
5. Este archivo y PLAN_IMPLEMENTACION.md para la siguiente etapa.

No reiniciar el proyecto desde base-web/ ni reconstruir la interfaz. Antes de publicar, inspeccionar el estado real de archivos/Git y confirmar destino con el usuario en ese chat.

## Comportamiento vigente que debe conservarse

- Modos de Nigromantes Estándar/Varios/Personalizado y Abominaciones Estándar/Festival/Personalizado; Personalizado inicial. Modos, contenido y topes ajustables durante partida desde próxima tanda, sin eliminar enemigos presentes.
- Solo el Profanador crea zona propia; prioridad si está ausente y resolución de su zona al final. El indicador verde es presencia, sin contador visible ni botones. Zonas estándar: token rojo, menos, cantidad, más; todo en fila junto a SPAWN y debajo en pantallas estrechas.
- Adrenalina centrada en la página. Marcador de puntaje hasta 300 px entre adrenalina y Configuración; adaptación móvil y pulso 10% en 750+750 ms al confirmar derrota, respetando movimiento reducido.
- Tokens encima de cartas; sin token en referencias de activación o transformación. Cartas originales y token se opacan cuando el efecto se representa mediante otra carta. Marcos corregidos, alineación entre filas, banderines Daily y separador de muralla con puerta central.
- Consulta ampliada de todas las cartas En juego, zoom por pasos de 5% y tarjetas centradas. Configuración compacta, contenido contraído con checkbox parcial/total y orden alfabético; Daily con/sin reposición y unicidad en juego.
- Mumm-Ra vincula ambas formas en Contenido y no permite coexistencia. Transformación posterior a la resolución; derrota de Abominación vuelve a Nigromante. Chimimōryō y Meng Huo tienen sus avisos/reaparición y excepciones de retirada, siempre cancelables con X.
- Shakōki y Rakshasa muestran acompañantes; modos Minimalista/Cartas custom. Bake-Danuki presente al iniciar SPAWN muestra al final la referencia D6 persistida, sin zona.
- Panel de puntaje con ajustes manuales separados de Caminantes/Brutos/Corredores: atajos solo preparan el borrador; Agregar registra una entrada tipada. Historial manual visible y cantidades automáticas conocidas.

## Puntaje vigente y fuente

Fuente: input referencia cartas.xlsx → TABLA PUNTAJES, A1:G19. No se modificó el Excel. La instantánea con hash de origen está en dist/tabla-puntajes.js; guardar otra versión del Excel no actualiza por sí solo la app preparada.

| Tipo | Momento | Base |
|---|---|---:|
| Caminante y misma prioridad | Aparición | 3 |
| Bruto | Aparición | 4 |
| Corredor | Aparición | 4 |
| Daily, salvo Bake-Danuki | Aparición | 6 |
| Abominación | Derrota | 12 |
| Nigromante | Derrota | 10 |

Abominación/Nigromante: multiplicadores por turnos completados 0/1/2/3/4/5/6+: 5/4/3/2,5/2/1,5/1. Turno 0 termina al siguiente SPAWN principal. Una nueva aparición tras salir de juego reinicia; reaparición sin retirada conserva antigüedad y aplica el factor adicional de reeliminación desde segunda derrota (todos los factores actuales son 1).

Mumm-Ra pausa el reloj de Nigromante mientras está en Abominación y lo retoma al volver. Una forma derrotada reinicia su reloj si reaparece; ambas formas pueden puntuar en una ronda. Bake-Danuki siempre puntúa al retirarse según forma: Caminante 3, Bruto/Corredor 4, Abominación base 12 por antigüedad desde aparición original. Cada derrota nueva guarda el cálculo; las antiguas sin detalle conservan los valores históricos 25/12/5. No inferir derrotas de antiguos desfijados. Sin multiplicador por adrenalina.

## Fichas de consulta recién incorporadas

- Core: Caminante, Bruto, Corredor (regla de dos acciones), Kan y Profanador.
- Expansiones: Caminante de terrorcota, Trepadores y Caminantes ballesteros.
- Mismo estilo de manual al pie del detalle y desde Contenido. Caminante/Bruto sin encabezado de reglas vacío.
- Profanador solo en su identidad. Kan directo; otras Abominaciones con «Ver reglas estándar de abominación White Death (Kan)», cerrado inicialmente.
- Las fichas de consulta no automatizan movimiento, ataques, regeneración de Terrorcota ni corrupción. Adrenalina del manual y score personalizado son conceptos distintos.

## Evidencia y límites

La última batería completa de motor aprobó 305/305 al incorporar la fórmula temporal. Después solo se cambiaron fichas de consulta/presentación y documentación; no se repitió esa batería por esos cambios.

QA de navegador aislado: verificar-puntaje.mjs, verificar-puntos-derrota.mjs, verificar-zonas-pulso.mjs, verificar-reglas-cartas.mjs y, después de las fichas, verificar-fichas-core.mjs y verificar-fichas-zombis.mjs. Incluye cinco tamaños (1440×900, 1024×768, 844×390, 390×844, 320×568), guardado intacto, fallos de almacenamiento según cada alcance, recarga/offline y capturas en docs/verificacion/. Las capturas PNG están excluidas por .gitignore. No se probaron dispositivos físicos ni GitHub Pages publicado.

## Preparación de GitHub/Pages en el siguiente chat

1. Acordar cuenta, repositorio, visibilidad y si se quiere solo subir fuentes o también publicar Pages. Crear/subir/publicar son acciones para la siguiente solicitud, no realizadas aquí.
2. Inspeccionar archivos a versionar. Preservar recursos originales, base-web/ y el Excel; evitar incluir logs/archivos temporales. Revisar volumen del repositorio y archivos generados sin borrar originales por iniciativa propia.
3. Ejecutar los comandos existentes: npm run preparar y npm test. En esta máquina, si Node no está en PATH, usar las rutas documentadas en README.md. La preparación puede cambiar la versión si cambian archivos servidos.
4. Revisar el ejemplo de workflow y las versiones vigentes de las acciones antes de activarlo; no dar el ejemplo por un despliegue ya probado. Con autorización de Pages, copiar/adaptar el ejemplo a .github/workflows/pages.yml y configurar Pages para GitHub Actions. El ejemplo prepara recursos, ejecuta tests, empaqueta dist/ y publica con disparo manual.
5. Verificar la URL real con la subruta del repositorio, carga de imágenes/módulos, manifest, service worker y descarga offline completa. Registrar URL, versión, resultado y cualquier ajuste.
6. El origen de Pages tendrá su propio almacenamiento. No transferir ni prometer migración automática de las partidas de localhost/Sites: exportar/importar respaldos sigue pendiente.

## Pruebas en mesa propuestas

- Abrir con conexión, esperar «Disponible offline», cerrar/reabrir y comprobar versión. Probar teléfono/tablet reales, orientación horizontal y vertical, y modo sin conexión.
- Partida corta: cambiar adrenalina/modo/contenido entre tandas; comprobar aplicación desde próxima tanda y conservación de presencias/topes.
- Profanador: prioridad, token verde, aparición de su zona al final y retirada de zona al derrotarlo.
- Puntaje: Abominación recién aparecida no suma; derrotada en turno 0 suma 60, Nigromante 50. Tras un SPAWN más: 48/40. En 6+: 12/10. Corrección/cancelación no suma; anular restaura.
- Daily ordinario suma 6 al aparecer. Bake-Danuki no suma hasta retirada y usa la forma guardada. Reapariciones y Mumm-Ra: comprobar pausas/reanudación y derrotas por forma; recargar no repite sorteos ni puntos.
- Ajustes de objetos: preparar cantidades independientes de los tres tipos, confirmar con Agregar y revisar una entrada por ajuste. Total de generados no baja al derrotar.
- Abrir fichas de cada familia y comprobar textos largos, X, scroll, desplegable Kan y ausencia de reglas Profanador en otros Nigromantes.
- Anotar para cada incidencia: dispositivo/navegador, versión, modo/adrenalina, pasos exactos, esperado/obtenido y captura. No borrar almacenamiento para resolver una incidencia sin preservar lo necesario y autorización.

## Pendientes que continúan

- 5: Bestias divinas, en espera de reglas/recursos completos.
- 6: ayudas vinculadas, incluidas Death Notes.
- 8/23: corrupción, en espera; reevaluar con contador de generados.
- 9: otras reglas especiales se revisan individualmente; no automatizar por analogía.
- 28: finalizar partida, máximo perfecto/porcentaje, desglose de cierre e historial de partidas con rondas/cajas. Fórmula temporal y derrotas ya implementadas.
- Retirar el porcentaje de depuración Daily antes de la versión final (DEBUG_DAILY_SPAWN). En pruebas permanece por solicitud anterior.
- Respaldo exportable/importable y eventual multiplicador por adrenalina sin implementación aprobada.

## Mensaje sugerido para retomar

«Continúa en esta carpeta. Lee AGENTS.md, docs/CONTINUIDAD_GITHUB_Y_MESA.md, docs/IMPLEMENTACION_ACTUAL.md y docs/PUNTAJE.md. Quiero preparar la subida a GitHub y las pruebas en mesa conservando el comportamiento actual. Primero verifica archivos, destino del repositorio y alcance de publicación; diferencia subir fuentes de habilitar Pages y documenta la URL/versión y las pruebas realizadas».
