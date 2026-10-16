import {TABLA_PUNTAJES} from './tabla-puntajes.js';
import {BAKE_DANUKI,tipoActualBakeDanuki} from './bake-danuki.js';

export function filaPuntaje(tipo,turnos=0){
 const filas=TABLA_PUNTAJES.filas.filter(f=>f.tipo===tipo);
 if(!filas.length)throw new Error('Tipo sin puntaje: '+tipo);
 return filas.find(f=>f.turnos===null)||filas.findLast(f=>f.turnos<=turnos)||filas[0];
}
const entero=v=>Number.isSafeInteger(v)&&v>=0;
function cadenaPresencia(s,uid){
 const cadena=[],vistos=new Set();
 while(uid&&!vistos.has(uid)){
  vistos.add(uid);
  const e=(s.transformacionesMummRa||[]).find(e=>e.carta.uid===uid&&!e.carta.anulada);
  if(e){cadena.unshift({uid,tanda:e.tanda,tipo:e.carta.mazo});uid=e.anteriorUid;continue;}
  for(const b of s.history)for(const z of b.slots)for(const c of z.draws)for(const a of [...(c.abominaciones||[]),...(c.nigromantes||[]),...(c.daily||[])])if(a.uid===uid)cadena.unshift({uid,tanda:b.number,tipo:a.mazo});
  break;
 }
 return cadena;
}
export function detalleDerrota(s,c,registros){
 const cadena=cadenaPresencia(s,c.uid);
 if(!cadena.length)throw new Error('No se pudo determinar la aparición del enemigo.');
 const tipo=c.cardId===BAKE_DANUKI?tipoActualBakeDanuki(s,c):c.mazo;
 const ids=new Set(cadena.map(p=>p.uid)),numero=registros.filter(r=>ids.has(r.uid)&&(r.tipoPuntaje??r.mazo)===tipo).length+1;
 let turnos=0;
 if(c.cardId===BAKE_DANUKI)turnos=s.history.at(-1).number-cadena[0].tanda;
 else for(let i=0;i<cadena.length;i++){
  const tramo=cadena[i];if(tramo.tipo!==tipo)continue;
  turnos+=(cadena[i+1]?.tanda??s.history.at(-1).number)-tramo.tanda;
  // La forma derrotada termina su reloj. Volver a ella inicia uno nuevo.
  if(i<cadena.length-1&&registros.some(r=>r.uid===tramo.uid&&!r.reaparicion))turnos=0;
 }
 const fila=filaPuntaje(tipo,turnos),factorReeliminacion=numero>=2?fila.reeliminacion:1;
 const puntos=fila.base*fila.multiplicador*factorReeliminacion;
 if(!entero(turnos)||!entero(numero)||!Number.isFinite(puntos)||puntos<0)throw new Error('Cálculo de puntaje inválido.');
 return {versionPuntaje:2,tipoPuntaje:tipo,turnosEnJuego:turnos,numeroEliminacion:numero,puntosBase:fila.base,multiplicadorTurnos:fila.multiplicador,multiplicadorReeliminacion:factorReeliminacion,puntos};
}
export function detallePuntajeValido(r){
 if(r.versionPuntaje===undefined)return ['tipoPuntaje','turnosEnJuego','numeroEliminacion','puntosBase','multiplicadorTurnos','multiplicadorReeliminacion','puntos'].every(k=>r[k]===undefined);
 return r.versionPuntaje===2&&['caminantes','brutos','corredores','abominaciones','nigromantes'].includes(r.tipoPuntaje)&&entero(r.turnosEnJuego)&&entero(r.numeroEliminacion)&&r.numeroEliminacion>=1&&['puntosBase','multiplicadorTurnos','multiplicadorReeliminacion','puntos'].every(k=>Number.isFinite(r[k])&&r[k]>=0)&&r.puntos===r.puntosBase*r.multiplicadorTurnos*r.multiplicadorReeliminacion;
}
