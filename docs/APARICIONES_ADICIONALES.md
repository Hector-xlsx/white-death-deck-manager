# Presentación de apariciones adicionales · 15/10/2026

Al final de Configuración se puede elegir Minimalista (valor inicial) o Cartas custom. La preferencia opcional `modoAparicionAdicional` se guarda en la configuración y se aplica visualmente al guardar, también a las referencias históricas. No vuelve a resolver cartas, cambiar presencias, contar zombis ni repetir sorteos. Guardados anteriores sin el campo conservan Minimalista.

Los dos diseños usan la misma caja y proporción que las cartas normales (280/437), tanto en Aparición como en Última tanda e Historial. La cantidad conserva su tamaño entre cartas de una misma vista; número, tipo y destino tienen espacios definidos y no aumentan la altura de la tarjeta. Las miniaturas escalan el texto con el ancho de su carta. Nombres largos, como Caminantes de terracota, se distribuyen dentro de su espacio.

Cartas custom reutiliza los PNG suministrados de `recursos/06 - Cartas Apariciones adicionales/`: Caminante, Bruto, Corredor, Trepador, Terracota y Caminante ballestero. Se conserva su título integrado y se superpone solo +N y «Zona de [enemigo]» en el pergamino inferior. Su conjunto queda centrado en torno al 84,5% vertical indicado por CONFIGURACION.txt. Rakshasa muestra +3 y Zona de Rakshasa; Shakōki muestra el agregado por tipo y su zona. Las imágenes originales no se modifican.

Se incluyen también los recursos de Bruto custodio y Ninja del Pie en la preparación offline, sin habilitar tipos de aparición ni reglas de juego que todavía no estén en el catálogo. Un tipo futuro sin imagen asociada conserva el resumen minimalista.

Implementación: `dist/apariciones-adicionales.js`, `dist/app.js`, `dist/style.css`, `dist/index.html`, validación opcional en `dist/estado.js` y empaquetado en `scripts/preparar.mjs`. Recursos nuevos copiados a dist y precargados por el service worker.

Validación: 290/290 pruebas; nueva prueba de preferencia, compatibilidad, guardado y conservación de historia/contador. La prueba de preparación verifica copias idénticas y precarga. `scripts/verificar-apariciones-adicionales.mjs` comprueba seis familias y Rakshasa, ambos diseños, dimensiones iguales a cartas normales, cantidad uniforme y texto contenido en Aparición/Última tanda, cinco tamaños, guardado sin resolver efectos y recarga offline. Pasó también la regresión de reglas únicas. Capturas `docs/verificacion/apariciones-*.png`; inspección visual de ambas presentaciones. Sin pruebas en dispositivos físicos.
