import {validarEspecial} from './especial.js';
import {registroActividadValido} from './registro-actividad.js';
import {configEspecialValida,DISPARADOR_ESPECIAL} from './especial-config.js';
import {derrotasValidas} from './derrotas.js';
import {resumenPuntaje} from './puntaje.js';
import {cartasTransformadas,validarReglasCartas} from './reglas-cartas.js';
import {MODOS_APARICION_ADICIONAL} from './apariciones-adicionales.js';
import {CATALOG,CATALOGO_BASE,componer,normalizarConfig,datos,IDS_OTROS} from './catalogo.js';
import {validarDaily,configDailyValida} from './daily.js';
import {MODOS_ABOMINACIONES,validarMazoAbominaciones} from './abominaciones.js';
import {validarNigromantes} from './nigromantes.js';
import {OPCIONES_ENEMIGOS} from './acciones-enemigos.js';
import {migrarSecundario} from './secundarios.js';
import {NIVELES_ADRENALINA} from './adrenalina.js';
import {ajustesZombisValidos} from './contador-zombis.js';
import {validarBakeDanuki} from './bake-danuki.js';
import {perfilLimitesValido,tandaLimitesValida} from './limites.js';
import {configModosValida,activacionesValidas,ACCIONES_NIGROMANTES} from './modos-enemigos.js';

const entero=(v,min=0)=>Number.isSafeInteger(v)&&v>=min;
const mismoMapa=(a,b)=>a&&b&&Object.keys(a).length===Object.keys(b).length&&Object.entries(a).every(([k,v])=>b[k]===v);
function configValida(c,ids){
 if(c)for(const [campo,opciones] of [['coleccionIds',datos.coleccion.cajas.map(c=>c.id)],['selectedAbominacionesIds',datos.abominaciones.cartas_ids],['selectedNigromantesIds',datos.nigromantes.cartas_ids],['selectedDailyIds',datos.daily.cartas_ids]]){
  if(c[campo]!==undefined&&(!Array.isArray(c[campo])||new Set(c[campo]).size!==c[campo].length||c[campo].some(id=>!opciones.includes(id))))return false;
 }
 if(c?.coleccionIds!==undefined&&(!c.coleccionIds.includes('core')||!IDS_OTROS.every(id=>c.selectedIds?.includes(id))))return false;
 return c&&configEspecialValida(c,CATALOG,datos.daily.cartas_ids)&&(c.ocultarPuntaje===undefined||typeof c.ocultarPuntaje==='boolean')&&(c.temaPuntaje===undefined||['kang','dragon','cabeza'].includes(c.temaPuntaje))&&(c.modoAparicionAdicional===undefined||MODOS_APARICION_ADICIONAL.includes(c.modoAparicionAdicional))&&typeof c.easy==='boolean'&&typeof c.normal==='boolean'&&Number.isFinite(c.threshold)&&c.threshold>=0&&c.threshold<=99&&
 Array.isArray(c.selectedIds)&&new Set(c.selectedIds).size===c.selectedIds.length&&c.selectedIds.every(id=>ids.has(id))&&
 (c.modoAbominaciones===undefined||MODOS_ABOMINACIONES.includes(c.modoAbominaciones))&&
 (c.modoNigromantes===undefined||MODOS_ABOMINACIONES.includes(c.modoNigromantes))&&configDailyValida(c)&&configModosValida(c)&&perfilLimitesValido(c.limitesPorAdrenalina,c.reglaNigromantes!==undefined)&&
 (c.reglaAbominaciones!=='estandar'||datos.abominaciones.cartas_ids.includes(c.abominacionEstandarId));
}
export function isValid(s){
 try{
  if(!registroActividadValido(s?.registroActividad))return false;
  if(!s||!s.config||![1,2].includes(s.version)||!Array.isArray(s.history)||!Array.isArray(s.pins))return false;
  if(!derrotasValidas(s.derrotasEnemigos)||!ajustesZombisValidos(s.ajustesZombis))return false;
  if(s.nivelAdrenalina!==undefined&&!NIVELES_ADRENALINA.includes(s.nivelAdrenalina))return false;
  if(s.revisionReglas!==undefined&&s.revisionReglas!==2)return false;
  for(const k of ['configuracionPendiente','configuracionDinamica'])if(s[k]!==undefined&&typeof s[k]!=='boolean')return false;
  if(s.reincorporacionesPendientes!==undefined){
   const r=s.reincorporacionesPendientes;
   if(!s.configuracionPendiente||!r||typeof r!=='object'||Array.isArray(r))return false;
   for(const [mazo,valores] of Object.entries(r)){
    const opciones=mazo==='general'?[...CATALOG,DISPARADOR_ESPECIAL].map(c=>c.id):datos[mazo]?.cartas_ids;
    if(!['general','abominaciones','nigromantes','daily'].includes(mazo)||!Array.isArray(valores)||new Set(valores).size!==valores.length||valores.some(id=>!opciones.includes(id)))return false;
   }
  }
  if(s.accionesPredeterminadas!==undefined&&(!s.accionesPredeterminadas||typeof s.accionesPredeterminadas!=='object'||Array.isArray(s.accionesPredeterminadas)||Object.keys(s.accionesPredeterminadas).some(k=>!['abominacion','nigromante'].includes(k))||Object.entries(s.accionesPredeterminadas).some(([k,v])=>!(s.config.reglaNigromantes!==undefined?(k==='nigromante'?[...ACCIONES_NIGROMANTES,'azar']:['activacion','spawn','activacion-spawn','azar']):OPCIONES_ENEMIGOS).includes(v))))return false;
  const cartas=s.version===1?CATALOGO_BASE:s.catalogo?.cartas;
  if(!Array.isArray(cartas)||!cartas.length||!entero(s.version===1?1:s.catalogo.version,1))return false;
  const ids=new Set(cartas.map(c=>c.id));
  if(ids.size!==cartas.length||!cartas.every(c=>typeof c.id==='string'&&/^[a-z0-9-]+$/.test(c.id)&&typeof c.name==='string'&&entero(c.copies,1)&&[null,'Fácil','Normal'].includes(c.difficulty)&&(/^[\w-]+\.png$/.test(c.image)||c.id===DISPARADOR_ESPECIAL.id&&c.image===DISPARADOR_ESPECIAL.image&&c.rutaImagen===DISPARADOR_ESPECIAL.rutaImagen)))return false;
  if(!cartas.every(c=>c.levels===undefined||(Array.isArray(c.levels)&&c.levels.length===4&&c.levels.every(n=>typeof n==='string'||entero(n)))))return false;
  if(!cartas.every(c=>c.rutaImagen===undefined||c.id===DISPARADOR_ESPECIAL.id&&c.rutaImagen===DISPARADOR_ESPECIAL.rutaImagen&&c.image===DISPARADOR_ESPECIAL.image||datos.recursos.recursos.some(r=>r.ruta===c.rutaImagen&&r.ruta.split('/').at(-1)===c.image)))return false;
  const config=s.version===1?normalizarConfig(s.config):s.config;
  if(!configValida(config,ids)||!configValida(s.version===1?config:s.proximaConfig,new Set(CATALOG.map(c=>c.id))))return false;
  if(!['normal','necro','sequence'].every(k=>entero(s[k]))||!entero(s.cycle,1)||typeof s.openBatch!=='boolean')return false;
  const expected=componer(config,cartas);
  if(!mismoMapa(s.initial,expected)||!s.remaining||!mismoMapa(Object.fromEntries(Object.keys(s.remaining).map(k=>[k,s.initial[k]])),s.initial))return false;
  if(!Object.entries(expected).every(([id,n])=>entero(s.remaining[id])&&s.remaining[id]<=n))return false;
  const extracciones=new Map(),slots=new Set();
  for(const [i,b] of s.history.entries()){
   if(b.number!==i+1||!Number.isFinite(b.date)||!entero(b.normal)||!entero(b.necro)||!Array.isArray(b.slots)||!b.slots.length)return false;
   if(!tandaLimitesValida(b))return false;
   if(b.configTanda!==undefined&&!configValida(b.configTanda,ids))return false;
   if(b.configEspecial!==undefined&&!configValida(b.configEspecial,ids))return false;
   if(b.nivelAdrenalina!==undefined&&!NIVELES_ADRENALINA.includes(b.nivelAdrenalina))return false;
   if(b.normal!==b.slots.filter(t=>t.kind==='normal').length||b.necro!==b.slots.filter(t=>t.kind==='necro').length)return false;
   for(const t of b.slots){
    if(!['normal','necro','derivada'].includes(t.kind)||typeof t.zone!=='string'||!Array.isArray(t.draws)||!t.draws.length)return false;
    if(s.version===2){if(typeof t.id!=='string'||!(t.kind==='derivada'?/^t\d+-d\d+$/:/^t\d+-z\d+$/).test(t.id)||slots.has(t.id))return false;slots.add(t.id);}
    for(const c of t.draws){
     if(!entero(c.uid,1)||c.uid>s.sequence||extracciones.has(c.uid)||!(s.configuracionDinamica?ids.has(c.cardId):Object.hasOwn(s.initial,c.cardId))||typeof c.discarded!=='boolean'||!entero(c.cycle,1)||c.cycle>s.cycle)return false;
     extracciones.set(c.uid,c);
     if(c.anulada!==undefined&&(typeof c.anulada!=='boolean'||c.anulada&&(!c.discarded||!t.anulada)))return false;
     for(const a of [...(c.abominaciones||[]),...(c.nigromantes||[]),...(c.daily||[]),...(c.especial||[])]){
      if(!entero(a.uid,1)||a.uid>s.sequence||extracciones.has(a.uid))return false;
      extracciones.set(a.uid,a);
     }
    }
    if(t.draws.slice(0,-1).some(c=>!c.discarded))return false;
   }
  }
  for(const c of cartasTransformadas(s)){
   if(!entero(c.uid,1)||c.uid>s.sequence||extracciones.has(c.uid))return false;
   extracciones.set(c.uid,c);
  }
  if(!validarReglasCartas(s))return false;
  if(s.openBatch&&!s.history.length)return false;
  if(s.respaldoTanda!==undefined&&s.respaldoTanda!==null){
   const r=s.respaldoTanda;
   if(s.version!==2||!entero(r.numero,1)||r.numero!==s.history.length||!r.estado||Object.hasOwn(r.estado,'respaldoTanda'))return false;
   if(r.estado.version!==2||!isValid(r.estado)||r.estado.history.length!==r.numero-1||r.estado.sequence>s.sequence)return false;
  }
  if(!validarMazoAbominaciones(s))return false;
  if(!validarNigromantes(s))return false;
  if(!activacionesValidas(s))return false;
  if(!validarBakeDanuki(s))return false;
  if(!validarDaily(s)||!validarEspecial(s))return false;
  if(s.version===2)resumenPuntaje(s);
  if(s.unpinned!==undefined&&!Array.isArray(s.unpinned))return false;
  const referencias=[...s.pins,...(s.unpinned||[])];
  if(new Set(referencias.map(c=>c.uid)).size!==referencias.length)return false;
  return referencias.every(c=>{const original=extracciones.get(c.uid);return original&&original.cardId===c.cardId;});
 }catch{return false;}
}
export function migrarEstado(entrada){
 const s=structuredClone(entrada);
 // Solo se sustituye la ruta retirada de Kijin; el resto del guardado sigue validandose.
 function actualizarImagen(estado){
  if(!estado||typeof estado!=='object')return;
  for(const c of estado.abominaciones?.cartas||[])if(c.id==='enemigo-kijin'&&c.image==='recursos/04 - Mazo Abominaciones ESP/Carta Kijin con corrección tipográfica-18.png')c.image=datos.enemigos.enemigos.find(c=>c.id==='enemigo-kijin').imagen_es;
  if(estado.respaldoTanda?.estado)actualizarImagen(estado.respaldoTanda.estado);
 }
 actualizarImagen(s);
 // El catálogo crece, pero los defaults implícitos de partidas anteriores no.
 function conservarNigromantes(estado){
  if(!estado||typeof estado!=='object')return;
  if(estado.nigromantes?.cartas&&!estado.nigromantes.cartas.some(c=>c.id==='referencia-death-notes')){
   for(const config of [estado.config,estado.proximaConfig,...(estado.history||[]).flatMap(b=>[b.configTanda,b.configEspecial])]){
    if(config&&config.selectedNigromantesIds===undefined)config.selectedNigromantesIds=datos.nigromantes.cartas_ids.filter(id=>id!=='referencia-death-notes');
   }
  }
  if(estado.respaldoTanda?.estado)conservarNigromantes(estado.respaldoTanda.estado);
 }
 conservarNigromantes(s);
 if(!isValid(s))throw new Error('Partida invalida; se conserva el guardado original.');
 if(s.version===2){
  const trofeos=datos.enemigos.enemigos.filter(c=>c.trofeo===true).map(c=>c.id);
  migrarSecundario(s,'abominaciones',trofeos);migrarSecundario(s,'nigromantes');
  if(s.respaldoTanda)s.respaldoTanda.estado=migrarEstado(s.respaldoTanda.estado);
  if(!isValid(s))throw new Error('No se pudo migrar el mazo secundario; se conserva el guardado original.');
  return s;
 }
 s.version=2;s.config=normalizarConfig(s.config);s.proximaConfig=structuredClone(s.config);
 s.catalogo={version:1,cartas:structuredClone(CATALOGO_BASE)};s.unpinned??=[];
 for(const b of s.history)for(const [i,t] of b.slots.entries())t.id=`t${b.number}-z${i+1}`;
 if(!isValid(s))throw new Error('No se pudo migrar la partida.');
 return s;
}
