import {registrarDerrota} from './derrotas.js';
import {datos,idsSecundarios} from './catalogo.js';
import {recalcularSecundario,archivarSecundaria,retirarSecundaria} from './secundarios.js';

export const MUMM_N='enemigo-mumm-ra',MUMM_A='enemigo-mumm-ra-abominacion';
export const SHAKOKI='enemigo-shakoki-dogu',CHIMIMORYO='enemigo-chimimoryo',MENG_HUO='daily-du03',RAKSHASA='daily-du02';
export const esMumm=id=>id===MUMM_N||id===MUMM_A;
export const cartasTransformadas=s=>(s.transformacionesMummRa||[]).map(e=>e.carta);
export function mummOcupado(s,id){return esMumm(id)&&s.pins.some(p=>esMumm(p.cardId));}
function extracciones(s){return [...s.history.flatMap(b=>b.slots.flatMap(t=>t.draws.flatMap(c=>[c,...(c.abominaciones||[]),...(c.nigromantes||[]),...(c.daily||[])]))),...cartasTransformadas(s)];}
function asegurarForma(s,id,mazo){
 const ficha=datos.enemigos.enemigos.find(c=>c.id===id);
 const m=s[mazo];if(!m)throw new Error('El mazo de destino no está disponible.');
 if(!m.cartas.some(c=>c.id===id)){
  m.habilitadasIds??=idsSecundarios(s.config,mazo);m.dinamico=true;
  m.cartas.push({id,name:ficha.nombre,image:ficha.imagen_es||ficha.imagen_original,tipo:mazo==='nigromantes'?'nigromante':'abominacion',...(mazo==='abominaciones'?{trofeo:false}:{})});
  m.remaining[id]=1;
 }
 return m;
}
// Una transformación cambia presencia, no es otra aparición ni consume un cupo.
export function transformarMummRa(s,uid,{origenUid=null,motivo='correccion'}={}){
 const anterior=s.pins.find(c=>c.uid===uid&&esMumm(c.cardId));if(!anterior)return null;
 const id=anterior.cardId===MUMM_N?MUMM_A:MUMM_N,mazo=id===MUMM_N?'nigromantes':'abominaciones';
 const m=asegurarForma(s,id,mazo);
 if(motivo==='derrota')registrarDerrota(s,uid);
 archivarSecundaria(s,anterior);retirarSecundaria(s,anterior);
 const carta={uid:++s.sequence,cardId:id,mazo,origenUid:anterior.uid,cycle:m.cycle,discarded:false,anulada:false};
 delete m.descarte[id];delete m.trofeos[id];m.remaining[id]=0;
 (s.transformacionesMummRa??=[]).push({anteriorUid:anterior.uid,origenUid,tanda:s.history.at(-1).number,motivo,carta});
 s.pins.push({...carta});recalcularSecundario(s,mazo);return carta;
}
// Revertir dependencias antes de cancelar una carta conserva su identidad anterior.
export function revertirTransformaciones(s,uid){
 for(const b of s.history)for(const c of b.slots.flatMap(t=>t.draws))if(c.aporteShakoki?.uid===uid)c.aporteShakoki.anulada=true;
 const eventos=s.transformacionesMummRa||[];
 const afectados=new Set([uid]);
 for(const e of eventos)if(afectados.has(e.anteriorUid)||e.origenUid===uid)afectados.add(e.carta.uid);
 for(const e of [...eventos].reverse())if(!e.carta.anulada&&afectados.has(e.carta.uid)){
  const anterior=extracciones(s).find(c=>c.uid===e.anteriorUid);
  const estaba=s.pins.some(p=>p.uid===e.carta.uid);
  s.pins=s.pins.filter(p=>p.uid!==e.carta.uid);s.unpinned=(s.unpinned||[]).filter(p=>p.uid!==e.carta.uid);
  e.carta.anulada=true;e.carta.discarded=true;
  const m=s[e.carta.mazo];delete m.descarte[e.carta.cardId];m.remaining[e.carta.cardId]=1;
  if(estaba&&anterior&&!anterior.anulada){
   const a=s[anterior.mazo];delete a.descarte[anterior.cardId];a.remaining[anterior.cardId]=0;
   s.unpinned=s.unpinned.filter(p=>p.uid!==anterior.uid);s.pins.push({...anterior});
  }
 }
 if(afectados.size>1)for(const mazo of ['abominaciones','nigromantes'])if(s[mazo])recalcularSecundario(s,mazo);
}
export function prepararReglasCarta(s,c){
 const mumm=s.pins.find(p=>p.cardId===MUMM_N&&!p.anulada&&!p.discarded);
 if(c.cardId==='nigromante'&&mumm&&['varios','personalizado'].includes(s.config.reglaNigromantes))c.transformarMummUid=mumm.uid;
 const shako=s.pins.find(p=>p.cardId===SHAKOKI&&!p.anulada&&!p.discarded);
 if(!shako)return;
 const ficha=s.catalogo.cartas.find(f=>f.id===c.cardId),tipo=ficha?.tipo;
 if(c.cardId.startsWith('activacion-')||['abominacion','nigromante'].includes(tipo))return;
 if(tipo==='asedio')c.aporteShakoki={uid:shako.uid,tipo:'caminantes',cantidad:1};
 else if(tipo&&typeof ficha.levels?.[['azul','amarillo','naranja','rojo'].indexOf(s.history.at(-1).nivelAdrenalina)]==='number'&&ficha.levels[['azul','amarillo','naranja','rojo'].indexOf(s.history.at(-1).nivelAdrenalina)]>0)c.aporteShakoki={uid:shako.uid,tipo:tipo.replace(/-(normal|facil)$/,''),cantidad:1};
}
export function cerrarReglasCarta(s){
 const b=s.history.at(-1);if(!b)return;
 for(const c of b.slots.filter(t=>!t.anulada).flatMap(t=>t.draws.slice(-1)))if(!c.discarded&&c.transformarMummUid){
  const p=s.pins.find(p=>p.uid===c.transformarMummUid&&p.cardId===MUMM_N);
  if(p)transformarMummRa(s,p.uid,{origenUid:c.uid,motivo:'aparicion'});
 }
}
export function aportesTanda(b){
 const aportes=new Map();
 const sumar=(tipo,cantidad,destino)=>{const clave=destino+'-'+tipo,anterior=aportes.get(clave);if(anterior)anterior.cantidad+=cantidad;else aportes.set(clave,{tipo,cantidad,destino});};
 for(const t of b.slots)if(!t.anulada)for(const c of t.draws)if(!c.discarded&&!c.anulada){
  if(c.aporteShakoki&&!c.aporteShakoki.anulada)sumar(c.aporteShakoki.tipo,1,'Shakōki Dogū');
  for(const d of c.daily||[])if(d.cardId===RAKSHASA&&d.acompanantesRakshasa===3&&!d.anulada&&!d.discarded)sumar('caminantes',3,'Rakshasa');
 }
 return [...aportes.values()];
}
export function referenciasReglas(s,b){
 const items=[],slot={id:`efectos-${b.number}`,kind:'referencia',zone:''};
 for(const e of s.transformacionesMummRa||[])if(e.tanda===b.number&&!e.carta.anulada){
  const a=extracciones(s).find(c=>c.uid===e.anteriorUid);
  items.push({c:{...a,uid:`m-desde-${e.carta.uid}`,referenciaUid:a.uid,referenciaEspecial:true,transformacionDesde:true},slot,zone:''});
  items.push({c:{...e.carta,uid:`m-hasta-${e.carta.uid}`,referenciaUid:e.carta.uid,referenciaEspecial:true,transformacionHasta:true},slot,zone:''});
 }
 for(const [i,a] of aportesTanda(b).entries())items.push({c:{...a,uid:`aporte-${b.number}-${i}`,mazo:'referencia',referenciaEspecial:true,referenciaAporte:true},slot,zone:''});
 return items;
}
export function validarReglasCartas(s){
 if(s.transformacionesMummRa!==undefined&&!Array.isArray(s.transformacionesMummRa))return false;
 const robos=extracciones(s),mapa=new Map(robos.map(c=>[c.uid,c]));
 if(robos.some(c=>c.acompanantesRakshasa!==undefined&&(c.cardId!==RAKSHASA||c.mazo!=='daily'||c.acompanantesRakshasa!==3)))return false;
 if(s.transformacionesMummRa?.length&&s.pins.filter(p=>esMumm(p.cardId)).length>1)return false;
 for(const e of s.transformacionesMummRa||[]){
  const a=mapa.get(e.anteriorUid),c=e.carta,b=s.history[e.tanda-1];
  if(!a||!esMumm(a.cardId)||!c||!esMumm(c.cardId)||c.cardId===a.cardId||c.origenUid!==a.uid||c.uid<=a.uid||!b||!['aparicion','derrota','correccion'].includes(e.motivo)||c.mazo!==(c.cardId===MUMM_N?'nigromantes':'abominaciones')||!Number.isSafeInteger(c.cycle)||c.cycle<1||c.cycle>s[c.mazo]?.cycle||typeof c.anulada!=='boolean'||c.discarded!==c.anulada)return false;
  if(e.motivo==='aparicion'&&!b.slots.some(t=>t.draws.some(o=>o.uid===e.origenUid&&o.transformarMummUid===a.uid)))return false;
 }
 for(const b of s.history)for(const c of b.slots.flatMap(t=>t.draws)){
  if(c.transformarMummUid!==undefined&&(c.cardId!=='nigromante'||mapa.get(c.transformarMummUid)?.cardId!==MUMM_N||c.transformarMummUid>=c.uid||!['varios','personalizado'].includes(b.reglasEnemigos?.nigromantes)))return false;
  const a=c.aporteShakoki;
  if(a!==undefined&&(!a||a.cantidad!==1||mapa.get(a.uid)?.cardId!==SHAKOKI||a.uid>=c.uid||typeof a.tipo!=='string'||!s.catalogo.cartas.some(f=>f.tipo?.replace(/-(normal|facil)$/,'')===a.tipo)||c.cardId.startsWith('activacion-')||['abominacion','nigromante'].includes(s.catalogo.cartas.find(f=>f.id===c.cardId)?.tipo)))return false;
 }
 return true;
}
