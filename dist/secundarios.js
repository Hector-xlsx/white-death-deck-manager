import {dailyIntegrado} from './especial-config.js';
import {cartasTransformadas,mummOcupado,revertirTransformaciones} from './reglas-cartas.js';
import {aplicarLimite,resolverPendientesPorLimite} from './limites.js';
export const MODOS_SECUNDARIOS=['sin-reposicion','con-reposicion'];
export function disponiblesSecundario(s,mazo){
 const m=s[mazo];if(!m)return [];
 const ids=new Set(m.habilitadasIds??m.cartas.map(c=>c.id));
 return m.cartas.filter(c=>ids.has(c.id)&&m.remaining[c.id]===1&&(s.config.reglaNigromantes===undefined||!mummOcupado(s,c.id)));
}
export function extraccionesSecundarias(s,mazo){
 return [...s.history.flatMap(b=>b.slots.flatMap(t=>t.draws.flatMap(c=>c[mazo]||[]))),...cartasTransformadas(s).filter(c=>c.mazo===mazo)];
}
export function crearSecundario(cartas,modo='sin-reposicion'){
 if(!MODOS_SECUNDARIOS.includes(modo))throw new Error('Modo secundario invalido');
 return {version:2,modo,cartas:structuredClone(cartas),remaining:Object.fromEntries(cartas.map(c=>[c.id,1])),descarte:{},trofeos:{},cycle:1};
}
export function validarDisponibilidad(s,mazo){
 const m=s[mazo];if(m.version!==2)return true;
 const ids=new Set(m.cartas.map(c=>c.id)),robos=extraccionesSecundarias(s,mazo);
 if(m.dinamico!==undefined&&typeof m.dinamico!=='boolean'||m.habilitadasIds!==undefined&&!m.dinamico)return false;
 if(m.dinamico&&(!Array.isArray(m.habilitadasIds)||new Set(m.habilitadasIds).size!==m.habilitadasIds.length||m.habilitadasIds.some(id=>!ids.has(id))))return false;
 if(!m.descarte||!m.trofeos||typeof m.descarte!=='object'||typeof m.trofeos!=='object'||Array.isArray(m.descarte)||Array.isArray(m.trofeos)||m.cartas.some(c=>c.trofeo!==undefined&&typeof c.trofeo!=='boolean'))return false;
 for(const campo of ['descarte','trofeos'])for(const [id,uid] of Object.entries(m[campo]))if(!ids.has(id)||!robos.some(c=>c.cardId===id&&c.uid===uid&&!c.anulada)||campo==='trofeos'&&!m.cartas.find(c=>c.id===id).trofeo)return false;
 return m.cartas.every(c=>{
  const fijada=s.pins.some(p=>p.mazo===mazo&&p.cardId===c.id);
  return [0,1].includes(m.remaining[c.id])&&Number(fijada)+Number(Object.hasOwn(m.descarte,c.id))+Number(Object.hasOwn(m.trofeos,c.id))+m.remaining[c.id]===1;
 });
}
export function migrarSecundario(s,mazo,trofeos=[]){
 const m=s[mazo];if(!m||m.version!==1)return;
 m.version=2;m.descarte={};m.trofeos={};
 for(const c of m.cartas)c.trofeo=trofeos.includes(c.id);
 for(const c of extraccionesSecundarias(s,mazo).filter(c=>!c.anulada))if(!s.pins.some(p=>p.mazo===mazo&&p.cardId===c.cardId)){
  if(trofeos.includes(c.cardId))m.trofeos[c.cardId]=c.uid;
  else if(!m.remaining[c.cardId])m.descarte[c.cardId]=c.uid;
 }
 recalcularSecundario(s,mazo);
}
export function recalcularSecundario(s,mazo,{reiniciarIntegrado=false}={}){
 const m=s[mazo];if(!m)return;
 if(m.version===2){
  if(mazo==='daily'&&m.modo==='con-reposicion')for(const id of Object.keys(m.descarte))if(!s.pins.some(p=>p.mazo===mazo&&p.cardId===id)){
   delete m.descarte[id];m.remaining[id]=1;
  }
  for(const p of s.pins.filter(p=>p.mazo===mazo))m.remaining[p.cardId]=0;
  for(const id of [...Object.keys(m.descarte),...Object.keys(m.trofeos)])m.remaining[id]=0;
  const activos=m.habilitadasIds??m.cartas.map(c=>c.id),descartes=Object.keys(m.descarte).filter(id=>activos.includes(id));
  if((mazo!=='daily'||!dailyIntegrado(s.config)||reiniciarIntegrado)&&activos.length&&activos.every(id=>m.remaining[id]===0)&&descartes.length){
   for(const id of descartes){m.remaining[id]=1;delete m.descarte[id];}
   m.cycle++;
  }
  return;
 }
 const vigentes=extraccionesSecundarias(s,mazo).filter(c=>!c.anulada);
 m.remaining=Object.fromEntries(m.cartas.map(c=>[c.id,1]));
 if(m.modo==='con-reposicion'){m.cycle=1;return;}
 // Conservar los ciclos de otros robos aceptados al devolver una carta antigua.
 m.cycle=vigentes.reduce((c,a)=>Math.max(c,a.cycle),1);
 for(const c of vigentes.filter(c=>c.cycle===m.cycle))m.remaining[c.cardId]=0;
 if(Object.values(m.remaining).every(n=>n===0)){
  m.cycle++;m.remaining=Object.fromEntries(m.cartas.map(c=>[c.id,1]));
 }
}
export function archivarSecundaria(s,c){
 s.pins=s.pins.filter(p=>p.uid!==c.uid);
 s.unpinned=[{...c},...(s.unpinned||[]).filter(p=>p.uid!==c.uid)];
}
export function anularSecundaria(s,c){
 if(c.anulada)return;
 revertirTransformaciones(s,c.uid);
 c.anulada=true;c.discarded=true;archivarSecundaria(s,c);
 const m=s[c.mazo];if(m?.version===2){
  for(const campo of ['descarte','trofeos'])if(m[campo][c.cardId]===c.uid)delete m[campo][c.cardId];
  if(!Object.hasOwn(m.trofeos,c.cardId)&&!Object.hasOwn(m.descarte,c.cardId)&&!s.pins.some(p=>p.mazo===c.mazo&&p.cardId===c.cardId))m.remaining[c.cardId]=1;
 }
}
export function retirarSecundaria(s,c){
 const m=s[c.mazo];if(m?.version!==2||c.anulada||s.pins.some(p=>p.mazo===c.mazo&&p.cardId===c.cardId))return;
 const trofeo=m.cartas.find(a=>a.id===c.cardId)?.trofeo;
 delete m.descarte[c.cardId];delete m.trofeos[c.cardId];
 m[trofeo?'trofeos':'descarte'][c.cardId]=c.uid;m.remaining[c.cardId]=0;recalcularSecundario(s,c.mazo);
}
export function devolverSecundaria(s,uid){
 const c=['abominaciones','nigromantes','daily'].flatMap(mazo=>extraccionesSecundarias(s,mazo)).find(c=>c.uid===uid&&!c.anulada);
 if(!c||s[c.mazo]?.version!==2)throw new Error('Carta secundaria no disponible para devolver.');
 for(const p of [...s.pins].filter(p=>p.mazo===c.mazo&&p.cardId===c.cardId))archivarSecundaria(s,p);
 const m=s[c.mazo];delete m.descarte[c.cardId];delete m.trofeos[c.cardId];m.remaining[c.cardId]=1;
}
export function robarSecundario(s,origen,mazo,rng,elegidoId=null){
 if(aplicarLimite(s,origen,mazo))return null;
 recalcularSecundario(s,mazo);
 const m=s[mazo];
 if(elegidoId==='enemigo-nigromante-profanador'&&!s.pins.some(p=>p.mazo===mazo&&p.cardId===elegidoId)){
  delete m.descarte[elegidoId];delete m.trofeos[elegidoId];m.remaining[elegidoId]=1;
 }
 const disponibles=disponiblesSecundario(s,mazo).filter(c=>!elegidoId||c.id===elegidoId);
 if(!disponibles.length){if(mazo!=='daily'){origen[mazo==='abominaciones'?'resolucionAbominacion':'resolucionNigromante']='activacion';origen.accionEnemigo='activacion';}return null;}
 const azar=elegidoId?0:rng();if(!Number.isFinite(azar)||azar<0||azar>=1)throw new Error('Aleatoriedad invalida');
 const seleccion=disponibles[Math.floor(azar*disponibles.length)];
 const carta={uid:++s.sequence,cardId:seleccion.id,discarded:false,anulada:false,cycle:m.cycle,origenUid:origen.uid,mazo};
 if(mazo==='daily'&&seleccion.id==='daily-du02')carta.acompanantesRakshasa=3;
 origen[mazo]??=[];origen[mazo].push(carta);s.pins.push({...carta});
 recalcularSecundario(s,mazo);resolverPendientesPorLimite(s,mazo,origen.uid);return carta;
}
