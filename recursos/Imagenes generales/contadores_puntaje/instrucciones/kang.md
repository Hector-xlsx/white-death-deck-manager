# Contador Kang

Fondo: assets/kang.png. PNG de 1984 × 793 px, sin números.

Dígitos de remates anchos de estilo clásico, relleno marrón casi negro, borde dorado y filo marfil, con leve textura. El número queda sobre la madera, a la derecha de Kang y debajo de su mano elevada.

## Ubicación medida

Caja útil del número en coordenadas de la imagen: x=865, y=354, ancho=930, alto=300.
Estos límites incluyen los bordes y la extrusión. Centrar el conjunto completo y reducirlo uniformemente si supera la caja. No estirar cifras ni cambiar el alto por separado.

## Paleta exacta de la implementación

- Degradado vertical: superior #48200c; 22% #311105; 52% #1c0802; 83% #260b02; inferior #431a06.
- Contorno exterior: #6e3a1a.
- Borde: #e2a84c.
- Filo de luz: #fff0b5.
- Extrusión: #693b1e.

## Cifras y efectos

Usar glyphStyle="medieval" de digits.js y el renderizador de score-counter.js. El trazado viene incluido, no se debe buscar otra fuente ni depender de fuentes instaladas.
Las capas se dibujan en este orden: extrusión (desplazamiento 12,23), contorno exterior (94), borde de color (65), filo claro (34), cara con degradado y contorno fino (12). Todas esas medidas están en unidades vectoriales del glifo, cuya altura de referencia es 1000, y se escalan juntas.
La textura usa feTurbulence (fractalNoise, frecuencia 0.075, dos octavas, semilla 7), recortada al interior y mezclada mediante soft-light.

## Ejemplo

```js
const contador = ScoreCounter.create(document.querySelector('#puntaje'), {
  theme: 'kang', value: 999, showPlus: true, assetBase: './assets/', width: 280
});
contador.setValue(1250);
```

La referencia final reproducible es previews/kang_demo.png. Está renderizada con este mismo código. La muestra original de generación tenía letras pintadas; no existe una fuente exacta extraíble de ella. Esta implementación recrea su tratamiento visual con trazados estables y efectos definidos.
