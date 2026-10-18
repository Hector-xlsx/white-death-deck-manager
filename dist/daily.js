import {datos,idsSecundarios} from './catalogo.js';
import {crearSecundario,recalcularSecundario,robarSecundario,extraccionesSecundarias,anularSecundaria,validarDisponibilidad,disponiblesSecundario} from './secundarios.js';
import {NIVELES_ADRENALINA,nivelAdrenalina} from './adrenalina.js';
export const CARTAS_DAILY=datos.daily.cartas.map(c=>({id:c.id,idCarta:c.id_carta,name:c.nombre,image:c.imagen,tipo:c.tipo_zombi,reglas:c.reglas_texto,trofeo:false}));
const porcentajeValido=n=>Number.isFinite(n)&&n>=0&&n<=100;
function nivelesDailyValidos(niveles){
 return niveles!==null&&typeof niveles==='object'&&!Array.isArray(niveles)&&Object.keys(niveles).length===4&&NIVELES_ADRENALINA.every(nivel=>{
  const p=niveles[nivel];return p!==null&&typeof p==='object'&&!Array.isArray(p)&&Object.keys(p).length===2&&porcentajeValido(p.base)&&porcentajeValido(p.incremento);
 });
}
export function configDailyValida(c){
 return (c.modoDaily===undefined||['sin-reposicion','con-reposicion'].includes(c.modoDaily))&&
 (c.dailyHabilitado===undefined||typeof c.dailyHabilitado==='boolean')&&
 ['dailyBase','dailyIncremento'].every(k=>c[k]===undefined||porcentajeValido(c[k]))&&
 (c.dailyPorNivel===undefined||nivelesDailyValidos(c.dailyPorNivel))&&
 (c.dailyIncrementoPor===undefined||['carta','tanda'].includes(c.dailyIncrementoPor));
}
// Perfil inicial del formulario; los valores históricos siguen calculándose sin cambios.
export function perfilDailyInicial(){
 const valores=[[5,1],[8,2],[12,3],[15,4]];
 return Object.fromEntries(NIVELES_ADRENALINA.map((nivel,i)=>[nivel,{base:valores[i][0],incremento:valores[i][1]}]));
}
export function parametrosDailyFormulario(config,nivel){
 return config.dailyPorNivel!==undefined||config.dailyBase!==undefined||config.dailyIncremento!==undefined?parametrosDaily(config,nivel):perfilDailyInicial()[nivel];
}
export function parametrosDaily(config,nivel){return config.dailyPorNivel?.[nivel]??{base:config.dailyBase??0,incremento:config.dailyIncremento??0};}
export function crearMazoDaily(config){return crearSecundario(CARTAS_DAILY.filter(c=>idsSecundarios(config,'daily').includes(c.id)),config.modoDaily??'sin-reposicion');}
export function elegibleDaily(s,c){
 const ficha=s.catalogo.cartas.find(a=>a.id===c.cardId);
 return !c.mazo&&ficha&&!ficha.id.startsWith('activacion-')&&!['abominacion','nigromante'].includes(ficha.tipo)&&
 (ficha.tipo==='asedio'||ficha.levels?.some(n=>typeof n==='number'&&n>0));
}
// Reconstruir desde resultados guardados permite cancelar un origen sin repetir sorteos.
export function puntosAcumuladosDaily(s){
 let puntos=0;
 for(const b of s.history){
  const config=b.configTanda??s.config,incremento=parametrosDaily(config,b.nivelAdrenalina??'azul').incremento;
  const cartas=b.slots.flatMap(t=>t.draws).filter(c=>!c.discarded&&!c.anulada).sort((a,b)=>a.uid-b.uid);
  let aparecio=false;
  for(const c of cartas){
   const intento=c.dailyIntento;if(!intento||intento.resultado==='bloqueado')continue;
   if(intento.resultado==='spawn'){puntos=0;aparecio=true;}
   else if(config.dailyIncrementoPor==='carta')puntos=Math.min(100,puntos+incremento);
  }
  if(config.dailyIncrementoPor!=='carta'&&b.dailyCerrada&&!aparecio&&!b.dailyBloqueada)puntos=Math.min(100,puntos+incremento);
 }
 return puntos;
}
export function probabilidadDaily(s,nivel=nivelAdrenalina(s)){
 if(s.config.dailyPorNivel||s.configuracionDinamica)return Math.min(100,parametrosDaily(s.config,nivel).base+puntosAcumuladosDaily(s));
 // Las partidas con configuración general conservan exactamente su progresión anterior.
 const base=s.config.dailyBase??0,incremento=s.config.dailyIncremento??0;
 let p=base;
 for(const b of s.history){
  const cartas=b.slots.flatMap(t=>t.draws).filter(c=>!c.discarded&&!c.anulada).sort((a,b)=>a.uid-b.uid);
  let aparecio=false;
  for(const c of cartas){
   const intento=c.dailyIntento;if(!intento||intento.resultado==='bloqueado')continue;
   if(intento.resultado==='spawn'){p=base;aparecio=true;}
   else if(s.config.dailyIncrementoPor==='carta')p=Math.min(100,p+incremento);
  }
  if(s.config.dailyIncrementoPor!=='carta'&&b.dailyCerrada&&!aparecio&&!b.dailyBloqueada)p=Math.min(100,p+incremento);
 }
 return p;
}
export function probabilidadEfectivaDaily(s){return s.config.dailyHabilitado&&disponiblesSecundario(s,'daily').length?probabilidadDaily(s):0;}
export function abrirTandaDaily(s){
 if(!s.daily||!s.config.dailyHabilitado)return;
 const b=s.history.at(-1);b.dailyCerrada=false;
 b.dailyBloqueada??=!disponiblesSecundario(s,'daily').length;
}
export function cerrarTandaDaily(s){if(s.daily&&s.config.dailyHabilitado)s.history.at(-1).dailyCerrada=true;}
export function prepararDaily(s,c,rng){
 if(!s.daily||!s.config.dailyHabilitado||!elegibleDaily(s,c)||c.dailyIntento)return;
 recalcularSecundario(s,'daily');
 const disponibles=disponiblesSecundario(s,'daily').length>0,p=disponibles?probabilidadDaily(s,s.history.at(-1).nivelAdrenalina??'azul'):0;
 if(!disponibles){c.dailyIntento={probabilidad:0,resultado:'bloqueado'};return;}
 let acierto=p===100;
 if(p>0&&p<100){const azar=rng();if(!Number.isFinite(azar)||azar<0||azar>=1)throw new Error('Aleatoriedad invalida');acierto=azar*100<p;}
 c.dailyIntento={probabilidad:p,resultado:acierto?'spawn':'fallo'};
 if(acierto)robarSecundario(s,c,'daily',rng);
}
export function anularDaily(s,c){
 for(const a of c.daily||[])anularSecundaria(s,a);
 if(s.daily)recalcularSecundario(s,'daily');
}
export function regenerarDaily(s,uid,rng=Math.random){
 const anterior=extraccionesSecundarias(s,'daily').find(c=>c.uid===uid);
 if(!anterior||anterior.anulada)return;
 const b=s.history.at(-1),origen=b?.slots.flatMap(t=>t.draws.slice(-1)).find(c=>c.uid===anterior.origenUid&&!c.discarded&&!c.anulada);
 if(!origen)throw new Error('Solo se puede regenerar un Daily de la ultima tanda.');
 anularSecundaria(s,anterior);recalcularSecundario(s,'daily');
 return robarSecundario(s,origen,'daily',rng);
}
export function validarDaily(s){
 if(!s.daily)return !s.config.dailyHabilitado&&!s.history.some(b=>b.dailyCerrada!==undefined||b.dailyBloqueada!==undefined||b.slots.some(t=>t.draws.some(c=>c.daily!==undefined||c.dailyIntento!==undefined)));
 const m=s.daily,ids=m?.dinamico?m.cartas.map(c=>c.id):idsSecundarios(s.config,'daily'),rutas=new Set(datos.recursos.recursos.map(r=>r.ruta));
 if(!m.dinamico&&!s.config.dailyHabilitado||m.version!==2||!['sin-reposicion','con-reposicion'].includes(m.modo)||m.modo!==(s.config.modoDaily??'sin-reposicion')||!Array.isArray(m.cartas)||!m.cartas.length||!Number.isSafeInteger(m.cycle)||m.cycle<1||!validarDisponibilidad(s,'daily'))return false;
 if(m.dinamico){const esperados=s.config.dailyHabilitado?idsSecundarios(s.config,'daily'):[];if(m.habilitadasIds.length!==esperados.length||esperados.some(id=>!m.habilitadasIds.includes(id)))return false;}
 if(m.cartas.length!==ids.length||new Set(m.cartas.map(c=>c.id)).size!==ids.length||m.cartas.some(c=>!ids.includes(c.id)||!rutas.has(c.image)||typeof c.name!=='string'||c.trofeo!==false||!['caminantes','brutos','corredores'].includes(c.tipo)))return false;
 if(Object.keys(m.remaining).length!==ids.length||Object.keys(m.trofeos).length)return false;
 for(const b of s.history){
  if(!m.dinamico||b.configTanda?.dailyHabilitado||b.dailyCerrada!==undefined||b.dailyBloqueada!==undefined)if(typeof b.dailyCerrada!=='boolean'||typeof b.dailyBloqueada!=='boolean')return false;
  for(const c of b.slots.flatMap(t=>t.draws)){
   if(c.daily!==undefined&&!Array.isArray(c.daily))return false;
   const a=c.dailyIntento,robos=c.daily||[],vigentes=robos.filter(n=>!n.anulada);
   if(a){
    if(!elegibleDaily(s,c)||!Number.isFinite(a.probabilidad)||a.probabilidad<0||a.probabilidad>100||!['spawn','fallo','bloqueado'].includes(a.resultado)||a.resultado==='bloqueado'&&a.probabilidad!==0)return false;
    if(vigentes.length!==(a.resultado==='spawn'&&!c.discarded&&!c.anulada?1:0))return false;
   }else if(robos.length)return false;
   for(const n of robos)if(!ids.includes(n.cardId)||n.mazo!=='daily'||n.origenUid!==c.uid||typeof n.anulada!=='boolean'||n.discarded!==n.anulada||!Number.isSafeInteger(n.cycle)||n.cycle<1||n.cycle>m.cycle)return false;
  }
 }
 const robos=extraccionesSecundarias(s,'daily');
 const fijados=s.pins.filter(p=>p.mazo==='daily');
 return new Set(fijados.map(p=>p.cardId)).size===fijados.length&&fijados.every(p=>robos.some(n=>n.uid===p.uid&&n.cardId===p.cardId&&!n.anulada&&!n.discarded));
}
