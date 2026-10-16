export const NIVELES_ADRENALINA=['azul','amarillo','naranja','rojo'];
export const NOMBRES_ADRENALINA={azul:'Azul',amarillo:'Amarillo',naranja:'Naranja',rojo:'Rojo'};
// La ausencia del campo en partidas anteriores equivale a Azul, sin reescribir su historial.
export const nivelAdrenalina=s=>s.nivelAdrenalina??'azul';
export function cambiarNivelAdrenalina(s,direccion){
 if(![-1,1].includes(direccion))throw new Error('Dirección de adrenalina inválida.');
 if(s.openBatch)throw new Error('Cierra Aparición para cambiar el nivel de adrenalina.');
 const actual=NIVELES_ADRENALINA.indexOf(nivelAdrenalina(s));
 if(actual<0)throw new Error('Nivel de adrenalina inválido.');
 const siguiente=actual+direccion;
 if(siguiente>=0&&siguiente<NIVELES_ADRENALINA.length)s.nivelAdrenalina=NIVELES_ADRENALINA[siguiente];
}
