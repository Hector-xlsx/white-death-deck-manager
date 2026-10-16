export const CARPETAS_RECURSOS=[
 '00 Cartas Apoyo Supervivientes',
 '01 Mazo Spawn - Juego base',
 '02 Mazo Spawn - Expansiones',
 '03 - Mazo Nigromante ESP',
 '04 - Mazo Abominaciones ESP',
 '05 - Custom Daily Spawn ESP'
];
export function esRutaRecurso(ruta){
 if(typeof ruta!=='string')return false;
 const partes=ruta.split('/');
 return partes.length===3&&partes[0]==='recursos'&&CARPETAS_RECURSOS.includes(partes[1])&&
 !/[\u0000-\u001f<>:"|?*\\%]/.test(partes[2])&&/^[^.].*\.png$/i.test(partes[2]);
}
