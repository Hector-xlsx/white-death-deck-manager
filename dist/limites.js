import {datos} from './catalogo.js';
import {NIVELES_ADRENALINA} from './adrenalina.js';
import {PROFANADOR,profanadorPresente,presentes} from './modos-enemigos.js';
export const FAMILIAS_LIMITES=['nigromantes','abominaciones'];
const positivo=n=>Number.isSafeInteger(n)&&n>=1;
const objeto=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
export function limitesIniciales(moderno=false){const p=structuredClone(Object.fromEntries(FAMILIAS_LIMITES.map(mazo=>[mazo,datos[mazo].limites_por_adrenalina])));if(moderno)for(const n of NIVELES_ADRENALINA)p.nigromantes[n]--;return p;}
export function erroresLimites(perfil,moderno=false){
 if(perfil===undefined)return [];
 if(!objeto(perfil)||Object.keys(perfil).length!==2||FAMILIAS_LIMITES.some(mazo=>!objeto(perfil[mazo])||Object.keys(perfil[mazo]).length!==4||NIVELES_ADRENALINA.some(nivel=>!Number.isSafeInteger(perfil[mazo][nivel])||perfil[mazo][nivel]<(moderno&&mazo==='nigromantes'?0:1))))return ['Los límites por adrenalina deben incluir cuatro enteros por familia: adicionales desde 0 y abominaciones desde 1.'];
 return FAMILIAS_LIMITES.filter(mazo=>NIVELES_ADRENALINA.some((nivel,i)=>i>0&&perfil[mazo][nivel]<perfil[mazo][NIVELES_ADRENALINA[i-1]])).map(mazo=>`Los límites de ${mazo} no pueden disminuir de Azul a Rojo.`);
}
export const perfilLimitesValido=(perfil,moderno=false)=>erroresLimites(perfil,moderno).length===0;
export function topesDelNivel(perfil,nivel){return Object.fromEntries(FAMILIAS_LIMITES.map(mazo=>[mazo,perfil[mazo][nivel]]));}
export function adoptarLimites(s){
 // Una partida anterior adopta los topes en el siguiente SPAWN, sin modificar sus tandas previas.
 s.config.limitesPorAdrenalina??=limitesIniciales(s.config.reglaNigromantes!==undefined);
 s.proximaConfig.limitesPorAdrenalina??=structuredClone(s.config.limitesPorAdrenalina);
}
export function contarEnemigos(s,mazo){
 if(s.config.reglaNigromantes!==undefined)return presentes(s,mazo).length;
 const tipo=mazo==='nigromantes'?'nigromante':'abominacion';
 const cartas=new Map(s.history.flatMap(b=>b.slots.flatMap(t=>t.draws.flatMap(c=>[c,...(c[mazo]||[])]))).map(c=>[c.uid,c]));
 const ids=new Set(s[mazo]?.cartas.map(c=>c.id)||[]);
 return s.pins.filter(p=>{const c=cartas.get(p.uid);return c&&!c.discarded&&!c.anulada&&(c.cardId===tipo||ids.has(c.cardId));}).length;
}
export function aplicarLimite(s,origen,mazo){
 if(!FAMILIAS_LIMITES.includes(mazo))return false;
 const tope=s.history.at(-1)?.limitesEnemigos?.[mazo];
 const moderno=s.config.reglaNigromantes!==undefined;
 if(moderno){
  if(mazo==='nigromantes'&&(s.config.reglaNigromantes!=='personalizado'||!profanadorPresente(s)))return false;
  if(mazo==='abominaciones'&&s.config.reglaAbominaciones!=='personalizado')return false;
 }
 const cantidad=moderno&&mazo==='nigromantes'?presentes(s,mazo).filter(c=>c.cardId!==PROFANADOR).length:contarEnemigos(s,mazo);
 if(tope===undefined||cantidad<tope)return false;
 origen[mazo==='nigromantes'?'resolucionNigromante':'resolucionAbominacion']='activacion';
 origen.accionEnemigo='activacion';origen.activacionPorLimite=tope;
 return true;
}
export function resolverPendientesPorLimite(s,mazo,excluirUid){
 if(!FAMILIAS_LIMITES.includes(mazo))return;
 const campo=mazo==='nigromantes'?'resolucionNigromante':'resolucionAbominacion';
 for(const c of s.history.at(-1).slots.filter(t=>!t.anulada).flatMap(t=>t.draws.slice(-1)))if(c.uid!==excluirUid&&!c.discarded&&c[campo]==='pendiente')aplicarLimite(s,c,mazo);
}
export function tandaLimitesValida(b){
 const topes=b.limitesEnemigos;
 if(topes!==undefined&&(!objeto(topes)||Object.keys(topes).length!==2||!NIVELES_ADRENALINA.includes(b.nivelAdrenalina)||FAMILIAS_LIMITES.some(mazo=>!Number.isSafeInteger(topes[mazo])||topes[mazo]<(b.reglasEnemigos&&mazo==='nigromantes'?0:1))))return false;
 for(const c of b.slots.flatMap(t=>t.draws))if(c.activacionPorLimite!==undefined){
  const mazo=c.cardId==='nigromante'?'nigromantes':c.cardId==='abominacion'?'abominaciones':null;
  if(!mazo||!Number.isSafeInteger(c.activacionPorLimite)||c.activacionPorLimite<0||topes?.[mazo]!==c.activacionPorLimite||!['activacion','anulada'].includes(c[mazo==='nigromantes'?'resolucionNigromante':'resolucionAbominacion'])||!['activacion','activacion-azar'].includes(c.accionEnemigo))return false;
 }
 return true;
}
