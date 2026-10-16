import {datos,idsSecundarios} from './catalogo.js';
import {accionPorDefecto,ACCIONES_ENEMIGOS,validarAccionEnemigo} from './acciones-enemigos.js';
import {crearSecundario,recalcularSecundario,archivarSecundaria as archivar,anularSecundaria,robarSecundario,validarDisponibilidad,disponiblesSecundario} from './secundarios.js';
import {contarEnemigos,aplicarLimite} from './limites.js';
import {registrarActivaciones,elegirAzar} from './modos-enemigos.js';

export const CARTAS_ABOMINACIONES=datos.enemigos.enemigos
 .filter(c=>datos.abominaciones.cartas_ids.includes(c.id)&&c.mazo_destino==='abominaciones'&&c.tipo_confirmado_por_usuario&&c.cantidad_inicial_mazo_secundario===1)
 .map(c=>({id:c.id,name:c.nombre,image:c.imagen_es||c.imagen_original,tipo:'abominacion',trofeo:c.trofeo===true}));
export const MODOS_ABOMINACIONES=['sin-reposicion','con-reposicion'];
export function crearMazoAbominaciones(modo='sin-reposicion',ids=CARTAS_ABOMINACIONES.map(c=>c.id)){
 if(!MODOS_ABOMINACIONES.includes(modo))throw new Error('Modo de abominaciones invalido');
 return crearSecundario(CARTAS_ABOMINACIONES.filter(c=>ids.includes(c.id)),modo);
}
export function extraccionesAbominaciones(s){
 return s.history.flatMap(b=>b.slots.flatMap(t=>t.draws.flatMap(c=>c.abominaciones||[])));
}
export function presenciaAbominacion(s){
 return contarEnemigos(s,'abominaciones')>0;
}
function recalcularMazo(s){
 recalcularSecundario(s,'abominaciones');
}
export function validarMazoAbominaciones(s){
 const m=s.abominaciones;
 if(!m)return !s.history.some(b=>b.slots.some(t=>t.draws.some(c=>c.abominaciones||c.resolucionAbominacion)));
 const rutas=new Set(datos.recursos.recursos.map(r=>r.ruta));
 if(![1,2].includes(m.version)||!validarDisponibilidad(s,'abominaciones')||!MODOS_ABOMINACIONES.includes(m.modo)||!Array.isArray(m.cartas)||!m.cartas.length||!Number.isSafeInteger(m.cycle)||m.cycle<1)return false;
 const ids=new Set(m.cartas.map(c=>c.id));
 if(m.dinamico){const esperados=idsSecundarios(s.config,'abominaciones');if(m.habilitadasIds.length!==esperados.length||esperados.some(id=>!m.habilitadasIds.includes(id)))return false;}
 else if(s.config.coleccionIds!==undefined||s.config.reglaNigromantes!==undefined){const esperados=idsSecundarios(s.config,'abominaciones');if(ids.size!==esperados.length||esperados.some(id=>!ids.has(id)))return false;}
 if(ids.size!==m.cartas.length||!m.cartas.every(c=>typeof c.id==='string'&&/^[a-z0-9-]+$/.test(c.id)&&typeof c.name==='string'&&rutas.has(c.image)&&c.tipo==='abominacion'))return false;
 for(const b of s.history)for(const t of b.slots)for(const c of t.draws){
  if(c.abominaciones!==undefined&&!Array.isArray(c.abominaciones))return false;
  if(!c.resolucionAbominacion){if(c.abominaciones)return false;continue;}
  if(!validarAccionEnemigo(c,'resolucionAbominacion'))return false;
  if(c.cardId!=='abominacion'||!['pendiente','activacion','spawn','anulada'].includes(c.resolucionAbominacion))return false;
  if(c.discarded!==(c.resolucionAbominacion==='anulada'))return false;
  const derivadas=c.abominaciones||[],activas=derivadas.filter(a=>!a.anulada);
  if(activas.length!==(c.resolucionAbominacion==='spawn'?1:0))return false;
  for(const a of derivadas){
if(!ids.has(a.cardId)||a.mazo!=='abominaciones'||a.origenUid!==c.uid||typeof a.anulada!=='boolean'||a.discarded!==a.anulada||!Number.isSafeInteger(a.cycle)||a.cycle<1||a.cycle>(m.version===2?m.cycle:extraccionesAbominaciones(s).length+1))return false;
  }
 }
 const porCiclo=new Set();
 for(const c of extraccionesAbominaciones(s).filter(c=>!c.anulada)){
  const clave=`${c.cycle}:${c.cardId}`;
  if(m.version===1&&m.modo==='sin-reposicion'&&porCiclo.has(clave))return false;
  if(m.version===1&&m.modo==='con-reposicion'&&c.cycle!==1)return false;
  porCiclo.add(clave);
 }
 const copia=structuredClone(s);recalcularMazo(copia);
 const esperado=copia.abominaciones;
 return esperado.cycle===m.cycle&&m.remaining&&Object.keys(m.remaining).length===ids.size&&Object.entries(esperado.remaining).every(([id,n])=>m.remaining[id]===n)&&!s.pins.some(p=>extraccionesAbominaciones(s).some(c=>c.uid===p.uid&&c.anulada));
}
export function anularAbominaciones(s,origen){
 if(!s.abominaciones||origen.cardId!=='abominacion')return;
 for(const c of origen.abominaciones||[])anularSecundaria(s,c);
 origen.resolucionAbominacion='anulada';
 if(s.pins.some(p=>p.uid===origen.uid))archivar(s,origen);
 recalcularMazo(s);
}
function robarSecundaria(s,origen,rng,accion='spawn'){
 const carta=robarSecundario(s,origen,'abominaciones',rng,s.config.reglaAbominaciones==='estandar'?s.config.abominacionEstandarId:null);
 if(!carta)return null;
 origen.resolucionAbominacion='spawn';
 origen.accionEnemigo=accion;
 return carta;
}
export function prepararAbominacion(s,origen,rng=Math.random){
 if(!s.abominaciones||origen.cardId!=='abominacion'||origen.discarded)return;
 origen.resolucionAbominacion='pendiente';
 if(s.config.reglaAbominaciones!==undefined){
  origen.activaciones=[];
  if(!presenciaAbominacion(s)){
   const c=robarSecundaria(s,origen,rng);if(!c)origen.sinCandidatos=true;return;
  }
  const modo=s.config.reglaAbominaciones;
  let accion=modo==='estandar'?'activacion':modo==='festival'?'activacion-spawn':s.history.at(-1)?.accionesEnemigos?.abominacion??s.accionesPredeterminadas?.abominacion??'azar';
  recalcularSecundario(s,'abominaciones');
  const disponible=disponiblesSecundario(s,'abominaciones').length>0,limitado=aplicarLimite(s,origen,'abominaciones');
  if(limitado||!disponible){accion='activacion';if(!disponible)origen.sinCandidatos=true;}
  else if(accion==='azar')accion=elegirAzar(ACCIONES_ENEMIGOS,rng);
  if(!ACCIONES_ENEMIGOS.includes(accion))throw new Error('Acción personalizada de abominaciones inválida');
  registrarActivaciones(s,origen,'abominaciones',accion,rng);
  origen.accionEnemigo=accion;
  if(accion==='activacion')origen.resolucionAbominacion='activacion';else robarSecundaria(s,origen,rng,accion);
  return;
 }
 if(aplicarLimite(s,origen,'abominaciones'))return;
 recalcularSecundario(s,'abominaciones');
 if(s.abominaciones.version===2&&!Object.values(s.abominaciones.remaining).some(n=>n===1)){origen.resolucionAbominacion='activacion';origen.accionEnemigo='activacion';return;}
 if(!presenciaAbominacion(s))robarSecundaria(s,origen,rng);
 else {const accion=accionPorDefecto(s,'abominacion',rng);if(accion!=='elegir')elegirAbominacion(s,origen.uid,accion,rng);}
}
function origenActual(s,uid){
 const origen=s.history.at(-1)?.slots.flatMap(t=>t.draws.slice(-1)).find(c=>c.uid===uid);
 if(!s.abominaciones||!origen||origen.discarded||origen.cardId!=='abominacion')throw new Error('Spawn de abominacion invalido');
 return origen;
}
export function elegirAbominacion(s,uid,opcion,rng=Math.random){
 const origen=origenActual(s,uid);
 if(!ACCIONES_ENEMIGOS.includes(opcion))throw new Error('Eleccion invalida');
 if(origen.resolucionAbominacion!=='pendiente')return;
 if(opcion==='activacion'){origen.resolucionAbominacion='activacion';origen.accionEnemigo=opcion;}
 else robarSecundaria(s,origen,rng,opcion);
}
export function regenerarAbominacion(s,uid,rng=Math.random){
 const carta=extraccionesAbominaciones(s).find(c=>c.uid===uid);
 if(!carta||carta.anulada)return;
 const origen=origenActual(s,carta.origenUid);
 anularSecundaria(s,carta);recalcularMazo(s);
 return robarSecundaria(s,origen,rng,origen.accionEnemigo??'activacion-spawn');
}
