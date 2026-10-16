# Contador Dragón

Fondo: assets/dragon.png. PNG de 1984 × 793 px, sin números.

Dígitos de bloque compactos, dorado claro en la parte superior y ámbar en la inferior, contorno casi negro, borde de bronce, filo claro y extrusión oscura. El número queda en el humo de la parte derecha; no debe cubrir la cabeza ni las llamas inferiores.

## Ubicación medida

Caja útil del número en coordenadas de la imagen: x=1020, y=178, ancho=815, alto=305.
Estos límites incluyen los bordes y la extrusión. Centrar el conjunto completo y reducirlo uniformemente si supera la caja. No estirar cifras ni cambiar el alto por separado.

## Paleta exacta de la implementación

- Degradado vertical: superior #fff2b6; 22% #ffe08c; 52% #f0b64f; 83% #d88e29; inferior #f6c667.
- Contorno exterior: #170803.
- Borde: #c77920.
- Filo de luz: #fff1bb.
- Extrusión: #56230a.

## Cifras y efectos

Usar glyphStyle="angular" de digits.js y el renderizador de score-counter.js. El trazado viene incluido, no se debe buscar otra fuente ni depender de fuentes instaladas.
Las capas se dibujan en este orden: extrusión (desplazamiento 12,23), contorno exterior (94), borde de color (65), filo claro (34), cara con degradado y contorno fino (12). Todas esas medidas están en unidades vectoriales del glifo, cuya altura de referencia es 1000, y se escalan juntas.
La textura usa feTurbulence (fractalNoise, frecuencia 0.075, dos octavas, semilla 7), recortada al interior y mezclada mediante soft-light.

## Ejemplo

```js
const contador = ScoreCounter.create(document.querySelector('#puntaje'), {
  theme: 'dragon', value: 999, showPlus: true, assetBase: './assets/', width: 280
});
contador.setValue(1250);
```

La referencia final reproducible es previews/dragon_demo.png. Está renderizada con este mismo código. La muestra original de generación tenía letras pintadas; no existe una fuente exacta extraíble de ella. Esta implementación recrea su tratamiento visual con trazados estables y efectos definidos.
