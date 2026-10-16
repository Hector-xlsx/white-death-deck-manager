# Integrar los tres contadores de puntaje

Objetivo: ofrecer Dragón, Cabeza y Kang como apariencias del mismo contador. El puntaje es un único dato del estado de la partida. Cambiar la apariencia no modifica ese dato.

## Archivos de entrega

- `assets/dragon.png`, `assets/cabeza.png`, `assets/kang.png`: fondos base sin cifras.
- `digits.js`: trazados vectoriales de los caracteres `0–9`, `+` y `−` en tres estilos: bloque angular para Dragón, bloque redondeado para Cabeza y remates clásicos para Kang. Evita elegir una fuente diferente o depender de fuentes del dispositivo.
- `score-counter.js`: compositor, paletas, posición, autoajuste de cifras y API para actualizar puntaje y tema.
- `score-counter.css`: posicionamiento y comportamiento del botón.
- `themes.json`: dimensiones, cajas útiles y paletas por tema.
- `instrucciones/dragon.md`, `cabeza.md`, `kang.md`: instrucciones específicas.
- `demo.html`: prueba funcional local. Abrir después de descomprimir; no requiere Internet ni instalación.
- `previews/`: ejemplos obtenidos con el renderizador real del paquete, usando `+999`.
- `LICENSE_DIGITS.txt`: licencia de los trazados derivados de las fuentes DejaVu.

## Qué apariencia se está reproduciendo

Los números de las primeras propuestas eran parte de una ilustración generada, no texto de una fuente identificable. Este paquete incluye una recreación reproducible de su tratamiento: oro, bisel, contorno y profundidad en Dragón y Cabeza; tinta oscura y filo dorado en Kang. No promete una coincidencia píxel a píxel con las letras pintadas originales. La referencia visual implementable son las vistas previas nuevas, renderizadas con el código adjunto.

No elegir Arial, Roboto ni otra fuente al azar para sustituir los trazados. Para convertir esto a React/TypeScript, conservar los paths y las capas SVG suministradas; puede adaptarse el contenedor y la gestión del estado.

## Integración mínima

```html
<link rel="stylesheet" href="score-counter.css">
<div id="puntaje"></div>
<script src="digits.js"></script>
<script src="score-counter.js"></script>
<script>
  const contador = ScoreCounter.create(document.querySelector('#puntaje'), {
    theme: 'kang',
    value: 999,
    showPlus: false,
    width: 280,
    assetBase: './assets/',
    onClick() { /* abrir el menú de puntaje existente */ }
  });
  // Cuando cambie el estado real:
  contador.setValue(1250);
  contador.setTheme('dragon');
</script>
```

El componente no calcula ni persiste puntos: recibe el puntaje real de la aplicación. `setValue` acepta enteros seguros o cadenas de enteros de hasta 16 cifras. El signo positivo es opcional mediante `showPlus`; los negativos muestran su signo. Las cifras largas reducen su escala uniformemente para quedar dentro de la caja, sin recortar ni abreviar el valor.

Para representar bonificaciones transitorias, usar `showPlus: true` con su valor. Para el total acumulado, normalmente `showPlus: false`. El `+999` de las pruebas no es parte del PNG.

## Imagen y coordenadas

Mantener la proporción nativa del PNG: `width:100%; height:auto`. El SVG del número ocupa exactamente el mismo rectángulo que la imagen y comparte su `viewBox`. No usar `object-fit: contain` dentro de un rectángulo de otra proporción ni posicionar los números respecto de un elemento con padding.

La imagen de Cabeza tiene una cavidad negra opaca bajo las cifras; solo su exterior es transparente. No borrar ese negro como si fuera un fondo a recortar.

## Apariencia seleccionable o aleatoria

Valores válidos: `dragon`, `cabeza`, `kang`.

- Si el usuario elige un tema, conservar esa elección con el mecanismo de preferencias de la aplicación.
- Si se incorpora «Aleatorio por partida», sortear una sola vez al iniciar la partida y guardar el resultado en su estado. No volver a sortear cada vez que cambien los puntos ni en cada render.
- El cambio visual debe conservar el mismo puntaje, callback y función de apertura de menú.
- La vista previa accesible del botón se actualiza como `Puntaje: 1250`; las ilustraciones y glifos son decorativos para el lector de pantalla.

## Verificación en la aplicación

Probar 0, 9, 99, 999, 1000, 99999 y un valor negativo, con y sin signo positivo. Revisar un ancho de cabecera de 180, 280 y 420 px. Comprobar foco de teclado y apertura del menú. Validar sobre fondo claro y oscuro: la boca debe permanecer negra y los exteriores transparentes. La cifra debe cambiar sin cambiar de tema, salvo una selección explícita.
