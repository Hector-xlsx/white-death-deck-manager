import {detalleDerrota,detallePuntajeValido} from './formula-puntaje.js';
import {BAKE_DANUKI} from './bake-danuki.js';
// Registro explícito: desfijar para corregir no equivale a derrotar.
export function registrarDerrota(s,uid,{reaparicion=false,fecha=Date.now()}={}){
 const c=s.pins.find(c=>c.uid===uid);
 if(!c||!(['abominaciones','nigromantes'].includes(c.mazo)||c.mazo==='daily'&&c.cardId===BAKE_DANUKI)||c.anulada||c.discarded)return false;
 const registros=s.derrotasEnemigos??=[];
 if(!reaparicion&&registros.some(r=>r.uid===uid&&!r.reaparicion))return false;
 const detalle=detalleDerrota(s,c,derrotasVigentes(s));
 registros.push({...detalle,id:registros.length+1,uid,cardId:c.cardId,mazo:c.mazo,tanda:s.history.at(-1)?.number??0,fecha,reaparicion});
 return true;
}
export function derrotasValidas(registros){
 return registros===undefined||Array.isArray(registros)&&registros.every((r,i)=>r&&r.id===i+1&&Number.isSafeInteger(r.uid)&&r.uid>0&&typeof r.cardId==='string'&&(['abominaciones','nigromantes'].includes(r.mazo)||r.mazo==='daily'&&r.cardId===BAKE_DANUKI)&&Number.isSafeInteger(r.tanda)&&r.tanda>=0&&Number.isSafeInteger(r.fecha)&&r.fecha>=0&&typeof r.reaparicion==='boolean'&&detallePuntajeValido(r));
}
export function derrotasVigentes(s){
 const cartas=new Map();
 for(const b of s.history)for(const t of b.slots){if(t.anulada)continue;for(const c of t.draws){if(c.anulada||c.discarded)continue;for(const a of [...(c.abominaciones||[]),...(c.nigromantes||[]),...(c.daily||[])])if(!a.anulada&&!a.discarded)cartas.set(a.uid,a);}}
 for(const e of s.transformacionesMummRa||[])if(cartas.has(e.anteriorUid)&&!e.carta.anulada&&!e.carta.discarded)cartas.set(e.carta.uid,e.carta);
 return (s.derrotasEnemigos||[]).filter(r=>{const c=cartas.get(r.uid);return c?.cardId===r.cardId&&c.mazo===r.mazo;});
}

export function bakeDanukiAparecidos(s){
 const ids=new Set();
 for(const b of s.history)for(const t of b.slots)if(!t.anulada)for(const c of t.draws)if(!c.anulada&&!c.discarded)for(const d of c.daily||[])if(d.cardId===BAKE_DANUKI&&!d.anulada&&!d.discarded)ids.add(d.uid);
 return ids.size;
}
