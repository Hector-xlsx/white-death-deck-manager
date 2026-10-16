# Comprobaciones del paquete

- Los tres PNG base no contienen el puntaje de muestra.
- Se verificaron las dimensiones de imagen y la transparencia exterior de cada archivo.
- El área útil de la boca tiene alfa 255. El centro es negro; los dientes conservan su ilustración y no se eliminan al comprobar el color del visor.
- Se verificaron 60 combinaciones de tema, signo y valor, incluidos todos los dígitos, valores largos y negativos. Los trazados y sus contornos se ajustan dentro de cada caja útil.
- Los identificadores de los gradientes, trazados y filtros no se repiten entre instancias.
- El renderizador rechaza entradas inválidas y los ejemplos no contienen valores NaN o infinitos.
- Las vistas previas PNG se renderizaron con el mismo generador SVG de score-counter.js, mediante Inkscape.
- No se completó una ejecución automatizada en navegador: el entorno no disponía de un navegador instalado y la descarga del navegador de prueba falló. La comprobación de DOM, apertura del menú e integración con el estado real debe hacerse en la aplicación anfitriona siguiendo INSTRUCCIONES_CODEX.md.
