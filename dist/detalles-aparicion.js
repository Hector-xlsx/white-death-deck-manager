import {escapar} from './catalogo.js';

const resultados={spawn:'Aparición',fallo:'Sin aparición',bloqueado:'Sin cartas disponibles',limite:'Sin intento: máximo de apariciones alcanzado'};
function linea(nombre,intento){
 if(!intento||!Number.isFinite(intento.probabilidad))return '';
 const porcentaje=intento.probabilidad.toLocaleString('es-CL',{maximumFractionDigits:2});
 return `<p class="probability-detail">${escapar(nombre)}: ${escapar(porcentaje)} % · ${escapar(intento.sinElegibles?'Sin intento: no hay cartas elegibles':resultados[intento.resultado]??'Resultado no registrado')}</p>`;
}
// Solo snapshots de la extracción: nunca consulta la probabilidad actual del motor.
export function detallesProbabilidadesHTML(c){
 return linea('Daily Spawn',c.dailyIntento)+linea('Spawn especial',c.especialIntento);
}
export function detallesTandaHTML(b){return linea('Spawn especial (por tanda)',b.especialIntento);}
