import {CATALOG,componer,idsSecundarios,enColeccion} from './catalogo.js';
import {opcionesEspecial,especialActivo,dailyIntegrado,cantidadEspecial,esCartaConfigurable,ID_DISPARADOR,destinoCartaEspecial} from './especial-config.js';
import {disponiblesSecundario,recalcularSecundario,robarSecundario,anularSecundaria} from './secundarios.js';
import {prepararReglasCarta} from './reglas-cartas.js';

const suma=m=>Object.values(m).reduce((a,b)=>a+b,0);
const configTanda=s=>s.history.at(-1)?.configEspecial??s.config;
export function cartasEspecial(config){
 const incluidas=new Set(config.selectedIds??CATALOG.map(c=>c.id)),o=opcionesEspecial(config);
 return CATALOG.filter(c=>esCartaConfigurable(c)&&incluidas.has(c.id)&&enColeccion(c.id,config)&&(!c.difficulty||(c.difficulty==='Fácil'?config.easy:config.normal))&&destinoCartaEspecial(config,c)==='especial');
}
export function erroresEspecial(config){
 if(!especialActivo(config))return [];
 if(!cartasEspecial(config).length&&!(dailyIntegrado(config)&&idsSecundarios(config,'daily').length))return ['Selecciona al menos una carta para Spawn Especial.'];
 if(opcionesEspecial(config).compensar){
  const core=CATALOG.filter(c=>c.expansionId==='core-white-death'),base=componer({...config,spawnEspecial:undefined},core);
  if(!core.some(c=>!['nigromante','abominacion','asedio'].includes(c.tipo)&&base[c.id]>0))return ['Para compensar el motor selecciona al menos una carta del Core fuera del motor.'];
 }
 return [];
}
export function crearEspecial(config){
 const initial=Object.fromEntries(cartasEspecial(config).map(c=>[c.id,cantidadEspecial(config,c)]));
 return {version:1,reposicion:opcionesEspecial(config).reposicion,initial,remaining:{...initial},cycle:1};
}
export function adoptarEspecial(s){
 if(!especialActivo(s.config))return;
 const nuevo=crearEspecial(s.config);
 nuevo.cycle=s.especial?.cycle??1;
 if(s.especial&&s.especial.reposicion===nuevo.reposicion){
  nuevo.cycle=s.especial.cycle;
  for(const [id,n] of Object.entries(nuevo.initial))if(s.especial.initial[id]===n)nuevo.remaining[id]=s.especial.remaining[id];
 }
 s.especial=nuevo;
}
export function idsElegiblesEspecial(config){
 const o=opcionesEspecial(config),general=componer(config);
 return CATALOG.filter(c=>Object.hasOwn(general,c.id)&&(o.elegibles?o.elegibles.includes(c.id):!c.id.startsWith('activacion-')&&!['nigromante','abominacion'].includes(c.tipo))).map(c=>c.id);
}
function azarValido(rng){const n=rng();if(!Number.isFinite(n)||n<0||n>=1)throw new Error('Aleatoriedad inválida.');return n;}
export function candidatosEspecial(s){
 if(!s.especial)return [];
 const config=configTanda(s),o=opcionesEspecial(config),m=s.especial;
 const integrado=dailyIntegrado(config)&&s.daily;
 const dailyDisponibles=integrado?disponiblesSecundario(s,'daily').length:0;
 if(!suma(m.remaining)&&!dailyDisponibles){
  if(integrado)recalcularSecundario(s,'daily',{reiniciarIntegrado:true});
  if(suma(m.initial)){m.remaining={...m.initial};m.cycle++;}
 }
 const candidatos=Object.entries(m.remaining).filter(([,q])=>q>0).map(([id,q])=>({id,q,daily:false}));
 if(dailyIntegrado(config)&&s.daily){
  recalcularSecundario(s,'daily');
  for(const c of disponiblesSecundario(s,'daily'))candidatos.push({id:c.id,q:o.cantidades[c.id]??1,daily:true});
 }
 return candidatos;
}
function robarEspecial(s,c,rng){
 const candidatos=candidatosEspecial(s),o=opcionesEspecial(configTanda(s));
 if(!candidatos.length){c.sinCandidatos=true;return null;}
 let boleto=Math.floor(azarValido(rng)*candidatos.reduce((n,a)=>n+a.q,0));
 const elegida=candidatos.find(a=>{boleto-=a.q;return boleto<0;});
 let carta;
 if(elegida.daily){
  carta=robarSecundario(s,c,'daily',rng,elegida.id);
 }else{
  const m=s.especial;
  carta={uid:++s.sequence,cardId:elegida.id,mazo:'especial',origenUid:c.uid,cycle:m.cycle,discarded:false,anulada:false};
  (c.especial??=[]).push(carta);
  if(o.reposicion==='sin-reposicion')m.remaining[elegida.id]--;
  prepararReglasCarta(s,carta);
 }
 if(carta){carta.spawnEspecial=true;carta.disparadorEspecial=c.cardId===ID_DISPARADOR;delete c.sinCandidatos;}
 return carta;
}
export function puntosEspecial(s){
 let puntos=0;
 for(const b of s.history){
  const eventos=[...b.slots.flatMap(t=>t.draws.filter(c=>!c.discarded&&!c.anulada).map(c=>c.especialIntento).filter(Boolean)),...(b.especialIntento&&(!b.especialIntento.origenUid||b.slots.some(t=>!t.anulada&&t.draws.some(c=>c.uid===b.especialIntento.origenUid&&!c.discarded&&!c.anulada)))?[b.especialIntento]:[])].sort((a,b)=>a.orden-b.orden);
  for(const e of eventos)if(e.resultado==='spawn')puntos=0;else if(e.resultado==='fallo')puntos=Math.min(100,puntos+e.incremento);
 }
 return puntos;
}
export function probabilidadEspecial(s){
 const config=configTanda(s),o=opcionesEspecial(config),nivel=s.history.at(-1)?.nivelAdrenalina??s.nivelAdrenalina??'azul';
 const perfil=o.porNivel?.[nivel]??o;
 return Math.min(100,perfil.base+puntosEspecial(s));
}
function intentar(s,c,rng,porTanda=false){
 const b=s.history.at(-1),o=opcionesEspecial(configTanda(s)),perfil=o.porNivel?.[b.nivelAdrenalina]??o;
 const limite=o.limitesPorNivel?o.limitesPorNivel[b.nivelAdrenalina]:o.limite;
 const anteriores=b.slots.flatMap(t=>t.draws).filter(c=>!c.discarded&&!c.anulada&&c.especialIntento?.resultado==='spawn').length;
 const evento={probabilidad:probabilidadEspecial(s),incremento:perfil.incremento,resultado:'fallo',orden:++s.sequence};
 if(porTanda)b.especialIntento=evento;else c.especialIntento=evento;
 if(limite!==null&&anteriores>=limite){evento.resultado='limite';return;}
 if(!c){evento.sinElegibles=true;return;}
 if(!candidatosEspecial(s).length){evento.resultado='bloqueado';evento.probabilidad=0;return;}
 const acierto=evento.probabilidad===100||evento.probabilidad>0&&azarValido(rng)*100<evento.probabilidad;
 if(acierto){evento.resultado='spawn';const carta=robarEspecial(s,c,rng);evento.resultadoUid=carta.uid;evento.origenUid=c.uid;}
}
export function prepararEspecial(s,c,rng){
 const config=configTanda(s);if(!especialActivo(config))return;
 const o=opcionesEspecial(config);
 if(c.cardId===ID_DISPARADOR){robarEspecial(s,c,rng);return;}
 if(o.modo==='probabilidad'&&o.frecuencia==='carta'&&idsElegiblesEspecial(config).includes(c.cardId)&&!c.especialIntento)intentar(s,c,rng);
}
export function cerrarEspecial(s,rng){
 const b=s.history.at(-1);if(!b||b.especialIntento)return;
 const config=configTanda(s),o=opcionesEspecial(config);
 if(o.modo!=='probabilidad'||o.frecuencia!=='tanda')return;
 const vigentes=b.slots.filter(t=>!t.anulada).map(t=>t.draws.at(-1)).filter(c=>!c.discarded&&!c.anulada);
 if(vigentes.some(c=>c.resolucionNigromante==='pendiente'||c.resolucionAbominacion==='pendiente'))return;
 const ids=idsElegiblesEspecial(config),aptas=vigentes.filter(c=>ids.includes(c.cardId));
 const origen=aptas.length?aptas[Math.floor(azarValido(rng)*aptas.length)]:null;
 intentar(s,origen,rng,true);
}
export function anularEspecial(s,c){
 for(const a of c.especial||[])if(!a.anulada){
  a.anulada=true;a.discarded=true;
  s.pins=s.pins.filter(p=>p.uid!==a.uid);s.unpinned=s.unpinned.filter(p=>p.uid!==a.uid);
  if(s.especial?.cycle===a.cycle&&opcionesEspecial(configTanda(s)).reposicion==='sin-reposicion'&&s.especial.initial[a.cardId])s.especial.remaining[a.cardId]=Math.min(s.especial.initial[a.cardId],s.especial.remaining[a.cardId]+1);
 }
}
export function regenerarEspecial(s,uid,rng=Math.random){
 const b=s.history.at(-1),c=b?.slots.flatMap(t=>t.draws.slice(-1)).find(c=>!c.discarded&&!c.anulada&&[...(c.especial||[]),...(c.daily||[])].some(a=>a.uid===uid&&a.spawnEspecial&&!a.anulada));
 if(!c)throw new Error('Solo se puede regenerar un Especial de la última tanda.');
 anularEspecial(s,c);
 for(const d of c.daily||[])if(d.spawnEspecial&&!d.anulada)anularSecundaria(s,d);
 recalcularSecundario(s,'daily');
 return robarEspecial(s,c,rng);
}
export function validarEspecial(s){
 if(especialActivo(s.config)&&!s.especial)return false;
 const m=s.especial;
 if(m&&(!['con-reposicion','sin-reposicion'].includes(m.reposicion)||!Number.isSafeInteger(m.cycle)||m.cycle<1||m.version!==1||!m.initial||!m.remaining||Object.keys(m.initial).length!==Object.keys(m.remaining).length||!Object.entries(m.initial).every(([id,n])=>CATALOG.some(c=>c.id===id&&esCartaConfigurable(c))&&Number.isSafeInteger(n)&&n>0&&Number.isSafeInteger(m.remaining[id])&&m.remaining[id]>=0&&m.remaining[id]<=n)))return false;
 if(especialActivo(s.config)&&m.reposicion!==opcionesEspecial(s.config).reposicion)return false;
 if(especialActivo(s.config)){const esperado=crearEspecial(s.config).initial;if(Object.keys(m.initial).length!==Object.keys(esperado).length||!Object.entries(esperado).every(([id,n])=>m.initial[id]===n))return false;}
 for(const b of s.history){
  const config=b.configEspecial??b.configTanda??s.config,o=opcionesEspecial(config),mapa=new Map(b.slots.flatMap(t=>t.draws).map(c=>[c.uid,c]));
  const eventos=[...(b.especialIntento?[b.especialIntento]:[])];
  for(const c of mapa.values()){
   if(c.especial!==undefined&&!Array.isArray(c.especial))return false;
   const resultados=[...(c.especial||[]),...(c.daily||[]).filter(d=>d.spawnEspecial)];
   if(resultados.filter(a=>!a.anulada&&!a.discarded).length>1)return false;
   if(resultados.some(a=>a.uid<=c.uid||c.discarded&&!a.anulada))return false;
   if(c.especialIntento)eventos.push(c.especialIntento);
   for(const a of c.especial||[])if(!especialActivo(config)||!cartasEspecial(config).some(f=>f.id===a.cardId)||a.mazo!=='especial'||a.origenUid!==c.uid||a.spawnEspecial!==true||a.disparadorEspecial!==(c.cardId===ID_DISPARADOR)||typeof a.anulada!=='boolean'||a.discarded!==a.anulada||!Number.isSafeInteger(a.cycle)||a.cycle<1||a.cycle>(m?.cycle??0))return false;
   if(c.especialIntento&&(o.modo!=='probabilidad'||o.frecuencia!=='carta'||!idsElegiblesEspecial(config).includes(c.cardId)))return false;
   if(resultados.length&&c.cardId!==ID_DISPARADOR&&!c.especialIntento&&b.especialIntento?.origenUid!==c.uid)return false;
  }
  if(b.especialIntento&&(o.modo!=='probabilidad'||o.frecuencia!=='tanda'))return false;
  if(new Set(eventos.map(e=>e.orden)).size!==eventos.length)return false;
  for(const e of eventos){
   if(!e||!Number.isFinite(e.probabilidad)||e.probabilidad<0||e.probabilidad>100||!Number.isFinite(e.incremento)||e.incremento<0||e.incremento>100||!['spawn','fallo','bloqueado','limite'].includes(e.resultado)||!Number.isSafeInteger(e.orden)||e.orden<1||e.orden>s.sequence)return false;
   if(e.resultado==='spawn'){
    const c=mapa.get(e.origenUid);if(!c||![...(c.especial||[]),...(c.daily||[])].some(a=>a.uid===e.resultadoUid&&a.spawnEspecial))return false;
   }
  }
 }
 return true;
}
