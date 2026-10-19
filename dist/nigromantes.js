import {datos,idsSecundarios} from './catalogo.js';
import {accionPorDefecto,validarAccionEnemigo} from './acciones-enemigos.js';
import {crearSecundario,extraccionesSecundarias,recalcularSecundario,anularSecundaria,archivarSecundaria,robarSecundario,MODOS_SECUNDARIOS,validarDisponibilidad,disponiblesSecundario} from './secundarios.js';
import {contarEnemigos,aplicarLimite} from './limites.js';
import {PROFANADOR,presentes,profanadorPresente,ACCIONES_NIGROMANTES,tieneSpawn,elegirAzar,registrarActivaciones} from './modos-enemigos.js';
import {resolverAccionesIndependientes,registrarAparicionPrioritaria} from './acciones-independientes.js';

export const CARTAS_NIGROMANTES=datos.enemigos.enemigos
 .filter(c=>datos.nigromantes.cartas_ids.includes(c.id)&&c.mazo_destino==='nigromantes'&&c.tipo_confirmado_por_usuario&&c.cantidad_inicial_mazo_secundario===1)
 .map(c=>({id:c.id,name:c.nombre,image:c.imagen_es||c.imagen_original,tipo:'nigromante'}));
export const crearMazoNigromantes=(modo,ids=CARTAS_NIGROMANTES.map(c=>c.id))=>crearSecundario(CARTAS_NIGROMANTES.filter(c=>ids.includes(c.id)),modo);
export function contarNigromantes(s){
 return contarEnemigos(s,'nigromantes');
}
export function sincronizarNigromantes(s){if(s.nigromantes)s.necro=s.config.reglaNigromantes!==undefined?Number(Boolean(profanadorPresente(s))):contarNigromantes(s);}
export function seleccionarNigromante(s,origen,rng,accion='spawn'){
 const c=robarSecundario(s,origen,'nigromantes',rng,s.config.reglaNigromantes!==undefined&&!profanadorPresente(s)?PROFANADOR:null);
 if(!c)return null;
 origen.resolucionNigromante='spawn';origen.accionEnemigo=accion;sincronizarNigromantes(s);return c;
}
export function prepararNigromante(s,origen,rng){
 if(!s.nigromantes||origen.cardId!=='nigromante'||origen.discarded)return null;
 origen.resolucionNigromante='pendiente';
 if(s.config.reglaNigromantes!==undefined)return prepararNigromanteModerno(s,origen,rng);
 if(aplicarLimite(s,origen,'nigromantes'))return null;
 recalcularSecundario(s,'nigromantes');
 if(s.nigromantes.version===2&&!Object.values(s.nigromantes.remaining).some(n=>n===1)){origen.resolucionNigromante='activacion';origen.accionEnemigo='activacion';return null;}
 if(contarNigromantes(s)===0)return seleccionarNigromante(s,origen,rng);
 const accion=accionPorDefecto(s,'nigromante',rng);
 if(accion==='elegir')return null;
 if(accion==='activacion'){origen.resolucionNigromante='activacion';origen.accionEnemigo=accion;return null;}
 return seleccionarNigromante(s,origen,rng,accion);
}
function prepararNigromanteModerno(s,origen,rng){
 const profanador=profanadorPresente(s),modo=s.config.reglaNigromantes;
 origen.activaciones=[];
 const independiente=modo==='personalizado'&&s.config.revelacionEnemigos?.nigromantes;
 if(!profanador){const c=seleccionarNigromante(s,origen,rng);if(c&&independiente)registrarAparicionPrioritaria(origen,'nigromantes');return c;}
 let accion=modo==='estandar'?'activacion':modo==='varios'?'activacion-spawn':s.history.at(-1)?.accionesEnemigos?.nigromante??s.accionesPredeterminadas?.nigromante??'azar';
 const tope=s.history.at(-1)?.limitesEnemigos?.nigromantes;
 const lleno=modo==='personalizado'&&tope!==undefined&&presentes(s,'nigromantes').filter(c=>c.cardId!==PROFANADOR).length>=tope;
 recalcularSecundario(s,'nigromantes');
 const disponible=disponiblesSecundario(s,'nigromantes').some(c=>c.id!==PROFANADOR);
 if(independiente){
  if(resolverAccionesIndependientes(s,origen,'nigromantes',presentes(s,'nigromantes'),{limite:lleno,disponible},rng))return seleccionarNigromante(s,origen,rng,origen.accionEnemigo);
  return null;
 }
 if(accion==='azar')accion=elegirAzar(ACCIONES_NIGROMANTES.filter(a=>!tieneSpawn(a)||!lleno&&disponible),rng);
 if(!ACCIONES_NIGROMANTES.includes(accion))throw new Error('Acción personalizada de nigromantes inválida');
 if(tieneSpawn(accion)&&(lleno||!disponible)){accion='activacion';if(lleno)origen.activacionPorLimite=tope;else origen.sinCandidatos=true;}
 registrarActivaciones(s,origen,'nigromantes',accion,rng);
 origen.accionEnemigo=accion;
 if(tieneSpawn(accion))return seleccionarNigromante(s,origen,rng,accion);
 origen.resolucionNigromante='activacion';return null;
}
export function anularNigromantes(s,origen){
 if(!s.nigromantes||origen.cardId!=='nigromante')return;
 for(const c of origen.nigromantes||[])anularSecundaria(s,c);
 origen.resolucionNigromante='anulada';
 if(s.pins.some(c=>c.uid===origen.uid))archivarSecundaria(s,origen);
 recalcularSecundario(s,'nigromantes');sincronizarNigromantes(s);
}
export function validarNigromantes(s){
 const m=s.nigromantes;
 if(m===undefined)return !s.history.some(b=>b.slots.some(t=>t.kind==='derivada'||t.draws.some(c=>c.nigromantes||c.resolucionNigromante)));
 const rutas=new Set(datos.recursos.recursos.map(r=>r.ruta));
 if(!m||![1,2].includes(m.version)||!validarDisponibilidad(s,'nigromantes')||!MODOS_SECUNDARIOS.includes(m.modo)||!Array.isArray(m.cartas)||!m.cartas.length||!Number.isSafeInteger(m.cycle)||m.cycle<1)return false;
 if(s.config.modoNigromantes!==m.modo)return false;
 const ids=new Set(m.cartas.map(c=>c.id)),robos=extraccionesSecundarias(s,'nigromantes');
 if(m.dinamico){const esperados=idsSecundarios(s.config,'nigromantes');if(m.habilitadasIds.length!==esperados.length||esperados.some(id=>!m.habilitadasIds.includes(id)))return false;}
 else if(s.config.coleccionIds!==undefined||s.config.reglaNigromantes!==undefined){const esperados=idsSecundarios(s.config,'nigromantes');if(ids.size!==esperados.length||esperados.some(id=>!ids.has(id)))return false;}
 if(ids.size!==m.cartas.length||!m.cartas.every(c=>typeof c.id==='string'&&/^[a-z0-9-]+$/.test(c.id)&&typeof c.name==='string'&&c.tipo==='nigromante'&&rutas.has(c.image)))return false;
 for(const b of s.history){
  const padres=new Map(b.slots.flatMap(t=>t.draws.flatMap(c=>(c.nigromantes||[]).map(n=>[n.uid,{n,t}]))));
  for(const t of b.slots){
   if(t.kind==='derivada'){
    const padre=padres.get(t.origenUid);
    if(!padre||padre.n.spawnSlotId!==t.id||typeof t.anulada!=='boolean'||t.anulada!==padre.n.anulada||t.zone!==`${padre.t.zone}-3`)return false;
    if(t.anulada&&t.draws.some(c=>!c.anulada||!c.discarded))return false;
   }
   for(const c of t.draws){
    if(c.nigromantes!==undefined&&!Array.isArray(c.nigromantes))return false;
    if(!c.resolucionNigromante){if(c.nigromantes)return false;continue;}
    if(!validarAccionEnemigo(c,'resolucionNigromante'))return false;
    if(c.cardId!=='nigromante'||!['pendiente','activacion','spawn','anulada','sin-efecto'].includes(c.resolucionNigromante)||c.discarded!==(c.resolucionNigromante==='anulada'))return false;
    if(c.resolucionNigromante==='sin-efecto'&&!c.revelacionIndependiente)return false;
    if((c.nigromantes||[]).filter(n=>!n.anulada).length!==(c.resolucionNigromante==='spawn'?1:0))return false;
    for(const n of c.nigromantes||[]){
if(!ids.has(n.cardId)||n.mazo!=='nigromantes'||n.origenUid!==c.uid||typeof n.anulada!=='boolean'||n.discarded!==n.anulada||!Number.isSafeInteger(n.cycle)||n.cycle<1||n.cycle>(m.version===2?m.cycle:robos.length+1))return false;
     const derivada=b.slots.find(p=>p.id===n.spawnSlotId);
     if(s.config.reglaNigromantes!==undefined&&n.cardId!==PROFANADOR){if(n.spawnSlotId!==undefined)return false;}
     else if(!derivada||derivada.kind!=='derivada'||derivada.origenUid!==n.uid||b.slots.indexOf(derivada)<=b.slots.indexOf(t))return false;
    }
   }
  }
 }
 const ciclos=new Set();
 for(const c of robos.filter(n=>!n.anulada)){
  const key=`${c.cycle}:${c.cardId}`;
  if(m.version===1&&(m.modo==='sin-reposicion'&&ciclos.has(key)||m.modo==='con-reposicion'&&c.cycle!==1))return false;
  ciclos.add(key);
 }
 const copia=structuredClone(s);recalcularSecundario(copia,'nigromantes');
 return copia.nigromantes.cycle===m.cycle&&m.remaining&&Object.keys(m.remaining).length===ids.size&&Object.entries(copia.nigromantes.remaining).every(([id,n])=>m.remaining[id]===n)&&s.necro===(s.config.reglaNigromantes!==undefined?Number(Boolean(profanadorPresente(s))):contarNigromantes(s))&&!s.pins.some(p=>robos.some(c=>c.uid===p.uid&&c.anulada));
}
