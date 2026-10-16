import {filaPuntaje} from './formula-puntaje.js';
import {derrotasVigentes,bakeDanukiAparecidos} from './derrotas.js';
import {desgloseGenerados} from './contador-zombis.js';
export const TEMAS_PUNTAJE=['kang','dragon','cabeza'];
export const PUNTOS_ZOMBI={caminantes:filaPuntaje('caminantes').base,brutos:filaPuntaje('brutos').base,corredores:filaPuntaje('corredores').base,nigromantes:filaPuntaje('nigromantes').base,abominaciones:filaPuntaje('abominaciones').base,daily:filaPuntaje('daily').base};
export const NOMBRES_PUNTAJE={caminantes:'Caminante / misma prioridad',brutos:'Bruto',corredores:'Corredor',nigromantes:'Nigromante',abominaciones:'Abominación',daily:'Daily Spawn'};
export function grupoPuntaje(tipo){
 if(tipo==='trepadores'||tipo?.startsWith('caminantes-'))return 'caminantes';
 return Object.hasOwn(PUNTOS_ZOMBI,tipo)?tipo:null;
}
// Comunes/Daily al aparecer; Abominaciones, Nigromantes y Bake-Danuki al derrotarlos.
export function resumenPuntaje(s){
 const {porTipo}=desgloseGenerados(s);
 let automaticos=0,manuales=0,derrotas=0,sinClasificar=0;
 for(const [tipo,cantidad] of Object.entries(porTipo)){
  const grupo=grupoPuntaje(tipo);if(['abominaciones','nigromantes'].includes(grupo))continue;if(grupo)automaticos=sumarSeguro(automaticos,(grupo==='daily'?cantidad-bakeDanukiAparecidos(s):cantidad)*PUNTOS_ZOMBI[grupo]);else if(cantidad)sinClasificar++;
 }
 for(const r of s.ajustesZombis||[])manuales=sumarSeguro(manuales,r.delta*PUNTOS_ZOMBI[r.tipo??'caminantes']);
 for(const r of derrotasVigentes(s))derrotas=sumarSeguro(derrotas,r.puntos??({abominaciones:25,nigromantes:12,daily:5}[r.mazo]));
 return {automaticos,manuales,derrotas,total:Math.max(0,sumarSeguro(sumarSeguro(automaticos,manuales),derrotas)),sinClasificar};
}
function sumarSeguro(actual,aporte){if(!Number.isSafeInteger(aporte)||!Number.isSafeInteger(actual+aporte))throw new Error('El puntaje supera el rango de enteros permitido.');return actual+aporte;}
