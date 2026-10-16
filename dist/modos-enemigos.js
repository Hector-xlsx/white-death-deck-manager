import {cartasTransformadas} from './reglas-cartas.js';
export const PROFANADOR='enemigo-nigromante-profanador';
export const MODOS_NIGROMANTES=['estandar','varios','personalizado'];
export const MODOS_ABOMINACION=['estandar','festival','personalizado'];
export const NOMBRES_MODOS={estandar:'Estándar',varios:'Varios nigromantes',festival:'Festival de abominaciones',personalizado:'Personalizado'};
export const ACCIONES_NIGROMANTES=['activacion','activacion-azar','spawn','activacion-spawn','activacion-azar-spawn'];
export const NOMBRES_ACCIONES_NIGROMANTES={activacion:'Activación del Profanador','activacion-azar':'Activación del Profanador + azar',spawn:'Spawn adicional','activacion-spawn':'Activación del Profanador + spawn','activacion-azar-spawn':'Activación del Profanador + azar + spawn',azar:'Al azar'};
export const esReglaNueva=s=>s.config.reglaNigromantes!==undefined;
export const tieneSpawn=accion=>accion==='spawn'||accion.endsWith('-spawn');
export const tieneAzarIndividual=accion=>accion==='activacion-azar'||accion==='activacion-azar-spawn';
export function elegirAzar(opciones,rng){const n=rng();if(!Number.isFinite(n)||n<0||n>=1)throw new Error('Aleatoriedad inválida');return opciones[Math.floor(n*opciones.length)];}
export function presentes(s,mazo){
 const activos=new Map(s.history.flatMap(b=>b.slots.flatMap(t=>t.draws.flatMap(c=>c[mazo]||[]))).filter(c=>!c.anulada&&!c.discarded).map(c=>[c.uid,c]));
 for(const c of cartasTransformadas(s))if(c.mazo===mazo&&!c.anulada&&!c.discarded)activos.set(c.uid,c);
 return s.pins.filter(p=>p.mazo===mazo&&activos.has(p.uid));
}
export const profanadorPresente=s=>presentes(s,'nigromantes').find(c=>c.cardId===PROFANADOR);
export function configModosValida(c){
 if((c.reglaNigromantes===undefined)!==(c.reglaAbominaciones===undefined))return false;
 if(c.reglaNigromantes!==undefined&&c.modoNigromantes===undefined)return false;
 if(c.reglaNigromantes!==undefined&&!MODOS_NIGROMANTES.includes(c.reglaNigromantes))return false;
 if(c.reglaAbominaciones!==undefined&&!MODOS_ABOMINACION.includes(c.reglaAbominaciones))return false;
 return c.abominacionEstandarId===undefined||typeof c.abominacionEstandarId==='string';
}
export function registrarActivaciones(s,origen,mazo,accion,rng){
 origen.activaciones=[];if(accion==='spawn')return;
 for(const c of presentes(s,mazo)){
  const activar=mazo==='abominaciones'||c.cardId===PROFANADOR||tieneAzarIndividual(accion)&&elegirAzar([true,false],rng);
  if(activar)origen.activaciones.push({uid:c.uid,cardId:c.cardId,mazo});
 }
}
export function activacionesValidas(s){
 const extracciones=new Map(s.history.flatMap(b=>b.slots.flatMap(t=>t.draws.flatMap(c=>[c,...(c.nigromantes||[]),...(c.abominaciones||[])]))).map(c=>[c.uid,c]));
 for(const c of cartasTransformadas(s))extracciones.set(c.uid,c);
 for(const b of s.history){
  if(esReglaNueva(s)&&(!b.reglasEnemigos||!b.accionesEnemigos))return false;
  if(b.reglasEnemigos!==undefined&&(!b.reglasEnemigos||!MODOS_NIGROMANTES.includes(b.reglasEnemigos.nigromantes)||!MODOS_ABOMINACION.includes(b.reglasEnemigos.abominaciones)))return false;
  if(b.configTanda&&(b.configTanda.reglaNigromantes!==b.reglasEnemigos?.nigromantes||b.configTanda.reglaAbominaciones!==b.reglasEnemigos?.abominaciones))return false;
  if(b.accionesEnemigos!==undefined&&(!b.accionesEnemigos||![...ACCIONES_NIGROMANTES,'azar'].includes(b.accionesEnemigos.nigromante)||!['activacion','spawn','activacion-spawn','azar'].includes(b.accionesEnemigos.abominacion)))return false;
  for(const c of b.slots.flatMap(t=>t.draws)){
   if(esReglaNueva(s)&&(c.resolucionNigromante==='pendiente'||c.resolucionAbominacion==='pendiente'))return false;
   if(c.sinCandidatos!==undefined&&typeof c.sinCandidatos!=='boolean')return false;
   if(c.activaciones===undefined)continue;
   if(!Array.isArray(c.activaciones)||new Set(c.activaciones.map(a=>a.uid)).size!==c.activaciones.length)return false;
   const mazo=c.cardId==='nigromante'?'nigromantes':c.cardId==='abominacion'?'abominaciones':null;
   if(!mazo||c.activaciones.some(a=>!Number.isSafeInteger(a.uid)||a.uid>=c.uid||a.mazo!==mazo||extracciones.get(a.uid)?.cardId!==a.cardId||extracciones.get(a.uid)?.mazo!==mazo))return false;
  }
 }
 return true;
}
