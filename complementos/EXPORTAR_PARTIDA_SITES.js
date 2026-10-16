/*
 * Respaldo voluntario: ejecutar en la consola del navegador estando en
 * la web original de White Death. No modifica localStorage ni envía datos.
 * El archivo resultante debe validarse/migrarse antes de importarlo.
 */
(() => {
  const clavePartida = 'white-death-mvp-v1';
  const contenido = localStorage.getItem(clavePartida);
  if (!contenido) throw new Error('No hay una partida guardada con la clave esperada en este dominio.');
  const partida = JSON.parse(contenido);
  if (partida.version !== 1 || !Array.isArray(partida.history)) {
    throw new Error('El formato no es el v1 esperado. Conserva los datos y revisa el formato antes de exportar.');
  }
  const archivo = new Blob([JSON.stringify(partida, null, 2)], { type: 'application/json' });
  const urlArchivo = URL.createObjectURL(archivo);
  const enlace = document.createElement('a');
  enlace.href = urlArchivo;
  enlace.download = `white-death-partida-v1-${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
  document.body.append(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(urlArchivo), 1000);
})();
