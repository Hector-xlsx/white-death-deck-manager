# Contador Cabeza

Fondo: assets/cabeza.png. PNG de 1947 × 808 px, sin números.

Dígitos de bloque compactos, oro cálido con filo marfil, borde de bronce y extrusión oscura. El número queda dentro de la boca entre los dientes. La cavidad tiene respaldo negro opaco en el PNG; no se usa transparencia como fondo del visor.

## Ubicación medida

Caja útil del número en coordenadas de la imagen: x=600, y=424, ancho=745, alto=218.
Estos límites incluyen los bordes y la extrusión. Centrar el conjunto completo y reducirlo uniformemente si supera la caja. No estirar cifras ni cambiar el alto por separado.

## Paleta exacta de la implementación

- Degradado vertical: superior #fff3c4; 22% #ffe5a1; 52% #f2c15f; 83% #d99b38; inferior #f3cb76.
- Contorno exterior: #160802.
- Borde: #a96320.
- Filo de luz: #fff1c5.
- Extrusión: #623008.

## Cifras y efectos

Usar glyphStyle="block" de digits.js y el renderizador de score-counter.js. El trazado viene incluido, no se debe buscar otra fuente ni depender de fuentes instaladas.
Las capas se dibujan en este orden: extrusión (desplazamiento 12,23), contorno exterior (94), borde de color (65), filo claro (34), cara con degradado y contorno fino (12). Todas esas medidas están en unidades vectoriales del glifo, cuya altura de referencia es 1000, y se escalan juntas.
La textura usa feTurbulence (fractalNoise, frecuencia 0.075, dos octavas, semilla 7), recortada al interior y mezclada mediante soft-light.

## Ejemplo

```js
const contador = ScoreCounter.create(document.querySelector('#puntaje'), {
  theme: 'cabeza', value: 999, showPlus: true, assetBase: './assets/', width: 280
});
contador.setValue(1250);
```

La referencia final reproducible es previews/cabeza_demo.png. Está renderizada con este mismo código. La muestra original de generación tenía letras pintadas; no existe una fuente exacta extraíble de ella. Esta implementación recrea su tratamiento visual con trazados estables y efectos definidos.
