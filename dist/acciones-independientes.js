// Acciones de revelación opcionales; su ausencia conserva las combinaciones históricas.
export const MODOS_ACCION=['siempre','probabilidad','nunca'];
export const CALCULOS_ACTIVACION=['independiente','juntos'];
const familias={nigromantes:['profanador','otros','spawn'],abominaciones:['activacion','spawn']};
const objeto=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
const porcentaje=n=>Number.isFinite(n)&&n>=0&&n<=100;
export function configuracionAccionesValida(config){
 const perfil=config.revelacionEnemigos;if(perfil===undefined)return true;
 if(!objeto(perfil)||Object.keys(perfil).some(k=>!Object.hasOwn(familias,k))||config.reglaNigromantes===undefined)return false;
 return Object.entries(perfil).every(([mazo,acciones])=>objeto(acciones)&&Object.keys(acciones).length===familias[mazo].length&&familias[mazo].every(nombre=>{
  const a=acciones[nombre],grupo=mazo==='nigromantes'&&nombre==='otros'||mazo==='abominaciones'&&nombre==='activacion';
  return objeto(a)&&MODOS_ACCION.includes(a.modo)&&porcentaje(a.probabilidad)&&Object.keys(a).every(k=>(nombre==='spawn'?['modo','probabilidad','incremento','maximo']:grupo?['modo','probabilidad','calcularPor']:['modo','probabilidad']).includes(k))&&(!grupo||a.calcularPor===undefined||CALCULOS_ACTIVACION.includes(a.calcularPor))&&(nombre!=='spawn'||porcentaje(a.incremento)&&porcentaje(a.maximo)&&a.maximo>=a.probabilidad);
 }));
}
export function perfilDesdeCombinacion(mazo,accion='azar'){
 accion=({estandar:'activacion',varios:'activacion-spawn',festival:'activacion-spawn'})[accion]??accion;
 const opcion=(modo,probabilidad=50)=>({modo,probabilidad});
 const azar=accion==='azar',spawn=accion.includes('spawn'),activa=accion.startsWith('activacion');
 const aparicion={...opcion(azar?'probabilidad':spawn?'siempre':'nunca',azar?50:100),incremento:0,maximo:100};
 if(mazo==='nigromantes')return {profanador:opcion(azar?'siempre':activa?'siempre':'nunca',100),otros:opcion(azar||accion.includes('azar')?'probabilidad':'nunca'),spawn:aparicion};
 return {activacion:opcion(azar?'probabilidad':activa?'siempre':'nunca'),spawn:aparicion};
}
export function probabilidadSpawnEnemigo(s,mazo,config=s.history.at(-1)?.configTanda??s.config){
 const actual=config.revelacionEnemigos?.[mazo]?.spawn;if(!actual)return 0;
 let p=null;
 // Reproducir solo el progreso de probabilidad, nunca los sorteos ya guardados.
 const eventos=s.history.flatMap(b=>b.slots.flatMap(t=>t.draws).filter(c=>!c.discarded&&!c.anulada&&c.revelacionIndependiente?.mazo===mazo).map(c=>({c,perfil:b.configTanda?.revelacionEnemigos?.[mazo]?.spawn}))).sort((a,b)=>a.c.uid-b.c.uid);
 for(const {c,perfil} of eventos){
  if(!perfil)continue;
  p=p===null?perfil.probabilidad:Math.min(perfil.maximo,p);
  const resultado=c.revelacionIndependiente.spawn.resultado;
  if(resultado==='spawn'||resultado==='prioridad')p=perfil.probabilidad;
  else if(resultado==='fallo')p=Math.min(perfil.maximo,p+perfil.incremento);
 }
 return Math.min(actual.maximo,p??actual.probabilidad);
}
function sortear(p,rng){
 if(p===0)return false;if(p===100)return true;
 const n=rng();if(!Number.isFinite(n)||n<0||n>=1)throw new Error('Aleatoriedad inválida');return n*100<p;
}
const probabilidad=a=>a.modo==='siempre'?100:a.modo==='nunca'?0:a.probabilidad;
export function resolverAccionesIndependientes(s,origen,mazo,candidatos,{limite=false,disponible=true}={},rng=Math.random){
 const config=s.history.at(-1)?.configTanda??s.config,perfil=config.revelacionEnemigos[mazo];
 const registro=origen.revelacionIndependiente={version:1,mazo,activaciones:[],spawn:{probabilidad:0,resultado:'nunca'}};
 origen.activaciones=[];
 const grupo=mazo==='nigromantes'?perfil.otros:perfil.activacion;
 let resultadoGrupo;
 for(const c of candidatos){
  const a=mazo==='nigromantes'?(c.cardId==='enemigo-nigromante-profanador'?perfil.profanador:perfil.otros):perfil.activacion;
  const p=probabilidad(a),conjunta=grupo.calcularPor==='juntos'&&(mazo==='abominaciones'||c.cardId!=='enemigo-nigromante-profanador');
  if(conjunta&&resultadoGrupo===undefined)resultadoGrupo=sortear(p,rng);
  const activada=conjunta?resultadoGrupo:sortear(p,rng);
  registro.activaciones.push({uid:c.uid,cardId:c.cardId,probabilidad:p,activada});
  if(activada)origen.activaciones.push({uid:c.uid,cardId:c.cardId,mazo});
 }
 const a=perfil.spawn,p=a.modo==='probabilidad'?probabilidadSpawnEnemigo(s,mazo,config):probabilidad(a);
 registro.spawn={probabilidad:p,resultado:a.modo==='nunca'?'nunca':limite||!disponible?'bloqueado':sortear(p,rng)?'spawn':'fallo'};
 if(registro.spawn.resultado==='bloqueado')registro.spawn.motivo=limite?'limite':'sin-candidatos';
 const aparece=registro.spawn.resultado==='spawn',activa=origen.activaciones.length>0;
 origen.accionEnemigo=aparece?(activa?'activacion-spawn':'spawn'):activa?'activacion':'sin-efecto';
 origen[mazo==='nigromantes'?'resolucionNigromante':'resolucionAbominacion']=aparece?'spawn':activa?'activacion':'sin-efecto';
 return aparece;
}
export function registrarAparicionPrioritaria(origen,mazo){
 origen.revelacionIndependiente={version:1,mazo,activaciones:[],spawn:{probabilidad:100,resultado:'prioridad'}};
}
export function validarResultadoIndependiente(c,b){
 const r=c.revelacionIndependiente;if(r===undefined)return true;
 const mazo=c.cardId==='nigromante'?'nigromantes':c.cardId==='abominacion'?'abominaciones':null;
 const perfil=b.configTanda?.revelacionEnemigos?.[mazo];
 if(!r||r.version!==1||r.mazo!==mazo||!perfil||b.configTanda[mazo==='nigromantes'?'reglaNigromantes':'reglaAbominaciones']!=='personalizado'||!Array.isArray(r.activaciones)||!Array.isArray(c.activaciones)||new Set(r.activaciones.map(a=>a.uid)).size!==r.activaciones.length)return false;
 if(r.activaciones.some(a=>!Number.isSafeInteger(a.uid)||a.uid>=c.uid||!porcentaje(a.probabilidad)||typeof a.activada!=='boolean'||a.probabilidad===0&&a.activada||a.probabilidad===100&&!a.activada))return false;
 if(r.activaciones.some(a=>a.probabilidad!==probabilidad(mazo==='nigromantes'?(a.cardId==='enemigo-nigromante-profanador'?perfil.profanador:perfil.otros):perfil.activacion)))return false;
 const grupo=mazo==='nigromantes'?perfil.otros:perfil.activacion;
 if(grupo.calcularPor==='juntos'&&new Set(r.activaciones.filter(a=>mazo==='abominaciones'||a.cardId!=='enemigo-nigromante-profanador').map(a=>a.activada)).size>1)return false;
 const elegidas=r.activaciones.filter(a=>a.activada).map(a=>a.uid);if(elegidas.length!==c.activaciones.length||c.activaciones.some(a=>!elegidas.includes(a.uid)))return false;
 const a=r.spawn;if(!a||!porcentaje(a.probabilidad)||!['spawn','fallo','bloqueado','nunca','prioridad'].includes(a.resultado))return false;
 if(a.resultado==='prioridad'){if(a.probabilidad!==100||r.activaciones.length)return false;}
 else if(perfil.spawn.modo==='nunca'){if(a.resultado!=='nunca'||a.probabilidad!==0)return false;}
 else if(a.resultado==='nunca'||perfil.spawn.modo==='siempre'&&a.probabilidad!==100||perfil.spawn.modo==='probabilidad'&&a.probabilidad>perfil.spawn.maximo)return false;
 if(a.resultado==='bloqueado'&&!['limite','sin-candidatos'].includes(a.motivo)||a.resultado!=='bloqueado'&&a.motivo!==undefined||a.resultado==='fallo'&&a.probabilidad===100||a.resultado==='spawn'&&a.probabilidad===0)return false;
 const campo=mazo==='nigromantes'?'resolucionNigromante':'resolucionAbominacion';
 if(c[campo]==='anulada')return true;
 const aparece=['spawn','prioridad'].includes(a.resultado),activa=elegidas.length>0;
 return c[campo]===(aparece?'spawn':activa?'activacion':'sin-efecto')&&c.accionEnemigo===(aparece?(activa?'activacion-spawn':'spawn'):activa?'activacion':'sin-efecto');
}
