import {crearEspecial,prepararEspecial,cerrarEspecial,anularEspecial} from './especial.js';
import {especialActivo,dailyIntegrado,DISPARADOR_ESPECIAL} from './especial-config.js';
import {registrarDerrota} from './derrotas.js';
import {prepararReglasCarta,cerrarReglasCarta,revertirTransformaciones,transformarMummRa,mummOcupado,MUMM_A,MENG_HUO,CHIMIMORYO} from './reglas-cartas.js';
export {transformarMummRa};
import {CATALOG,componer,normalizarConfig,idsSecundarios} from './catalogo.js';
import {erroresContenido} from './contenido.js';
import {ACCIONES_ENEMIGOS} from './acciones-enemigos.js';
import {crearMazoAbominaciones,prepararAbominacion,anularAbominaciones} from './abominaciones.js';
import {crearMazoNigromantes,prepararNigromante,seleccionarNigromante,anularNigromantes,sincronizarNigromantes} from './nigromantes.js';
import {extraccionesSecundarias,recalcularSecundario,anularSecundaria,retirarSecundaria,devolverSecundaria} from './secundarios.js';
import {crearMazoDaily,prepararDaily,anularDaily,abrirTandaDaily,cerrarTandaDaily} from './daily.js';
import {nivelAdrenalina} from './adrenalina.js';
import {bakeDanukiEnJuego,registrarBakeDanuki} from './bake-danuki.js';
import {topesDelNivel} from './limites.js';
import {PROFANADOR,profanadorPresente} from './modos-enemigos.js';
import {REVISION_REGLAS,prepararConfiguracion,programarConfiguracion,aplicarConfiguracionPendiente} from './configuracion-partida.js';
export {programarConfiguracion};
export function actualizarPartidaDePrueba(s){
 if(s.revisionReglas===REVISION_REGLAS)return false;
 const config=prepararConfiguracion({...s.config,...s.proximaConfig,reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'});
 if(!idsSecundarios(config,'abominaciones').length)config.selectedAbominacionesIds=['enemigo-abominacion-kan'];
 const nueva=newGame(config,s.normal,0);
 for(const k of Object.keys(s))delete s[k];Object.assign(s,nueva);
 return true;
}
export {regenerarDaily} from './daily.js';
import {elegirAbominacion as resolverAbominacion,regenerarAbominacion as renovarAbominacion} from './abominaciones.js';
export function elegirAbominacion(s,uid,opcion,rng=Math.random){const n=resolverAbominacion(s,uid,opcion,rng);cerrarEspecial(s,rng);return n;}
export function regenerarAbominacion(s,uid,rng=Math.random){const n=renovarAbominacion(s,uid,rng);cerrarEspecial(s,rng);return n;}
export {CATALOG};
export {isValid} from './estado.js';
export const total = values => Object.values(values).reduce((a,b)=>a+b,0);
export function newGame(config={easy:true,normal:true,threshold:20}, normal=3, necro=0) {
 config=normalizarConfig(config);
 const errores=erroresContenido(config);if((config.coleccionIds!==undefined||config.dailyHabilitado||config.reglaNigromantes!==undefined||config.spawnEspecial!==undefined)&&errores.length)throw new Error(errores.join(' '));
 if(config.reglaNigromantes!==undefined)config=prepararConfiguracion(config);
 const initial=componer(config);
 const nigromantes=config.modoNigromantes===undefined?null:crearMazoNigromantes(config.modoNigromantes,idsSecundarios(config,'nigromantes'));
 const daily=config.dailyHabilitado?crearMazoDaily(config):null;
 return {version:2,...(config.reglaNigromantes!==undefined?{revisionReglas:REVISION_REGLAS}:{}),nivelAdrenalina:'azul',config,proximaConfig:structuredClone(config),catalogo:{version:2,cartas:structuredClone(especialActivo(config)?[...CATALOG,DISPARADOR_ESPECIAL]:CATALOG)},abominaciones:crearMazoAbominaciones(config.modoAbominaciones,idsSecundarios(config,'abominaciones')),...(nigromantes?{nigromantes}:{}),...(daily?{daily}:{}),...(especialActivo(config)?{especial:crearEspecial(config)}:{}),initial,remaining:{...initial},normal,necro:nigromantes?0:necro,history:[],pins:[],unpinned:[],cycle:1,sequence:0,openBatch:false,respaldoTanda:null};
}
export function draw(s,rng=Math.random) {
 if(!total(s.remaining)) s.remaining={...s.initial};
 const count=total(s.remaining); if(!count) throw new Error('Mazo vacío');
 const azar=rng();if(!Number.isFinite(azar)||azar<0||azar>=1)throw new Error('Aleatoriedad inválida');
 let ticket=Math.floor(azar*count), selected;
 for(const [id,n] of Object.entries(s.remaining)) { if(ticket<n){selected=id;break;} ticket-=n; }
 if(!selected) throw new Error('Selección inválida');
 s.remaining[selected]--;
 const card={uid:++s.sequence,cardId:selected,discarded:false,cycle:s.cycle};
 const left=total(s.remaining), size=total(s.initial);
 if(left===0 || left/size*100<s.config.threshold){s.remaining={...s.initial};s.cycle++;}
 return card;
}
export function spawn(s,rng=Math.random) {
 const bakeDanukiInicial=bakeDanukiEnJuego(s);
 sincronizarNigromantes(s);
 const count=s.normal+s.necro; if(count===0) return null;
 if(!total(s.initial))throw new Error('Mazo vacío');
 const {respaldoTanda:anterior,...sinRespaldo}=s;
 s.respaldoTanda={numero:s.history.length+1,estado:structuredClone(sinRespaldo)};
 aplicarConfiguracionPendiente(s);
 const batch={number:s.history.length+1,date:Date.now(),normal:s.normal,necro:s.necro,nivelAdrenalina:nivelAdrenalina(s),slots:[]};
 if(s.config.limitesPorAdrenalina)batch.limitesEnemigos=topesDelNivel(s.config.limitesPorAdrenalina,batch.nivelAdrenalina);
 const cola=[];
 if(s.config.reglaNigromantes!==undefined){
  batch.reglasEnemigos={nigromantes:s.config.reglaNigromantes,abominaciones:s.config.reglaAbominaciones};
  batch.configTanda=structuredClone(s.config);
  batch.accionesEnemigos={nigromante:s.accionesPredeterminadas?.nigromante??'azar',abominacion:s.accionesPredeterminadas?.abominacion??'azar'};
 }
 if(especialActivo(s.config))batch.configEspecial=structuredClone(s.config);
 s.history.push(batch);
 abrirTandaDaily(s);
 for(let i=0;i<count;i++){
  const carta=draw(s,rng);
  batch.slots.push({id:`t${batch.number}-z${i+1}`,zone:i<s.normal?`Zona ${i+1}`:`Nigromante ${i-s.normal+1}`,kind:i<s.normal?'normal':'necro',draws:[carta]});
  prepararGeneral(s,carta,rng,0,cola);
 }
 for(const {origen,secundaria} of cola)robarZonaNigromante(s,origen,secundaria,rng);
 cerrarReglasCarta(s);cerrarTandaDaily(s);cerrarEspecial(s,rng);registrarBakeDanuki(batch,bakeDanukiInicial,rng);s.openBatch=true;return batch;
}
export function puedeAnularTanda(s,numero=s.history.at(-1)?.number){
 return Boolean(s.respaldoTanda&&s.respaldoTanda.numero===numero&&s.history.at(-1)?.number===numero);
}
export function anularTanda(s,numero=s.history.at(-1)?.number){
 if(!puedeAnularTanda(s,numero))throw new Error('La tanda no tiene un respaldo anterior disponible.');
 const anterior=structuredClone(s.respaldoTanda.estado);
 for(const campo of Object.keys(s))delete s[campo];
 Object.assign(s,anterior,{openBatch:false,respaldoTanda:null});
}
export function replaceCard(s,batchNumber,slotIndex,rng=Math.random) {
 const slot=posicionActual(s,batchNumber,slotIndex);
 abrirTandaDaily(s);
 slot.draws.at(-1).discarded=true;anularEfectos(s,slot.draws.at(-1));
 const carta=draw(s,rng);slot.draws.push(carta);prepararGeneral(s,carta,rng);
 cerrarReglasCarta(s);cerrarTandaDaily(s);cerrarEspecial(s,rng);
}
export function discardCard(s,batchNumber,slotIndex,rng=Math.random) {
 const slot=posicionActual(s,batchNumber,slotIndex);
 slot.draws.at(-1).discarded=true;
 anularEfectos(s,slot.draws.at(-1));cerrarEspecial(s,rng);
}
export function addZoneCard(s,batchNumber,kind,rng=Math.random) {
 if(!['normal','necro'].includes(kind))throw new Error('Tipo de zona inválido');
 if(s.nigromantes&&kind==='necro')throw new Error('Las zonas de nigromante dependen de los fijados');
 const batch=s.history.at(-1)?.number===batchNumber?s.history.at(-1):null;
 if(!batch)throw new Error('Tanda inválida');
 abrirTandaDaily(s);
 const card=draw(s,rng);
 const number=batch.slots.filter(slot=>slot.kind===kind).length+1;
 batch[kind]=(batch[kind]||0)+1;s[kind]++;
 batch.slots.push({id:`t${batch.number}-z${batch.slots.length+1}`,zone:kind==='normal'?`Zona ${number}`:`Nigromante ${number}`,kind,draws:[card]});
 prepararGeneral(s,card,rng);
 cerrarReglasCarta(s);cerrarTandaDaily(s);cerrarEspecial(s,rng);
 return card;
}
export function pinCard(s,card) {
 if(card.anulada)return;
 if(s.pins.some(c=>c.uid===card.uid))return;
 if(mummOcupado(s,card.cardId))throw new Error('Una forma de Mumm-Ra ya está en juego.');
 const m=s[card.mazo];
 if(m?.version===2){
  if(s.pins.some(c=>c.mazo===card.mazo&&c.cardId===card.cardId)){const error=new Error('Este enemigo ya está en juego.');error.code='ENEMIGO_EN_JUEGO';throw error;}
  delete m.descarte[card.cardId];delete m.trofeos[card.cardId];m.remaining[card.cardId]=0;
 }
 s.unpinned=(s.unpinned||[]).filter(c=>c.uid!==card.uid);
 s.pins.push({...card});
 if(m&&card.mazo!=='especial')recalcularSecundario(s,card.mazo);
 sincronizarNigromantes(s);
}
export function unpinCard(s,uid,subtractSpawn=false,forzar=false,motivo='correccion') {
 const card=s.pins.find(c=>c.uid===uid);if(!card)return;
 if(!forzar&&(card.cardId===MENG_HUO||s.config.reglaNigromantes!==undefined&&(card.cardId===MUMM_A||card.cardId===CHIMIMORYO&&profanadorPresente(s))))throw new Error('Este enemigo requiere resolver su regla antes de retirarlo.');
 if(motivo==='derrota')registrarDerrota(s,uid);
 s.pins=s.pins.filter(c=>c.uid!==uid);
 s.unpinned=[{...card},...(s.unpinned||[]).filter(c=>c.uid!==uid)];
 retirarSecundaria(s,card);
 if(s.nigromantes)sincronizarNigromantes(s);
 else if(subtractSpawn&&card.cardId==='nigromante')s.necro=Math.max(0,s.necro-1);
}
export function volverAlMazo(s,uid){devolverSecundaria(s,uid);sincronizarNigromantes(s);}
function posicionActual(s,numero,id){
 const tanda=s.history.at(-1);
 if(tanda?.number!==numero)throw new Error('Solo se puede modificar la última tanda');
 const posicion=typeof id==='number'?tanda.slots[id]:tanda.slots.find(t=>t.id===id);
 if(!posicion||posicion.anulada)throw new Error('Zona inválida');
 return posicion;
}
function posicionOrigen(s,uid){
 const b=s.history.at(-1),t=b?.slots.find(t=>!t.anulada&&t.draws.at(-1).uid===uid);
 if(!t||t.draws.at(-1).discarded)throw new Error('Origen invalido');
 return {b,t,c:t.draws.at(-1)};
}
function robarZonaNigromante(s,origen,secundaria,rng,profundidad=0,cola=null){
 if(s.config.reglaNigromantes!==undefined){
  if(secundaria.cardId!==PROFANADOR)return;
  if(cola){cola.push({origen,secundaria});return;}
 }
 if(profundidad>=100){const error=new Error('La cadena automática de nigromantes no termina. Cambia a Elegir en el momento y vuelve a intentar.');error.code='CADENA_AUTOMATICA';throw error;}
 const {b,t}=posicionOrigen(s,origen.uid),c=draw(s,rng);
 const derivada={id:`t${b.number}-d${c.uid}`,zone:`${t.zone}-3`,kind:'derivada',origenUid:secundaria.uid,anulada:false,draws:[c]};
 if(s.config.reglaNigromantes!==undefined)derivada.diferida=true;
 secundaria.spawnSlotId=derivada.id;
 if(s.config.reglaNigromantes!==undefined)b.slots.push(derivada);else b.slots.splice(b.slots.indexOf(t)+1,0,derivada);
 prepararGeneral(s,c,rng,profundidad+1);
}
function prepararGeneral(s,c,rng,profundidad=0,cola=null){
 prepararReglasCarta(s,c);
 prepararEspecial(s,c,rng);
 if(!dailyIntegrado(s.config)&&c.cardId!=='spawn-especial')prepararDaily(s,c,rng);
 prepararAbominacion(s,c,rng);
 const n=prepararNigromante(s,c,rng);
 if(n)robarZonaNigromante(s,c,n,rng,profundidad,cola);
}
function anularDependientes(s,uid){
 for(const b of s.history)for(const t of b.slots.filter(t=>t.kind==='derivada'&&t.origenUid===uid&&!t.anulada)){
  t.anulada=true;
  for(const c of t.draws){c.anulada=true;c.discarded=true;anularEfectos(s,c);}
 }
}
function anularEfectos(s,c){
 revertirTransformaciones(s,c.uid);
 for(const n of c.nigromantes||[])anularDependientes(s,n.uid);
 anularNigromantes(s,c);anularAbominaciones(s,c);
 anularDaily(s,c);anularEspecial(s,c);
 if(c.anulada)unpinCard(s,c.uid);
 sincronizarNigromantes(s);
}
export function elegirNigromante(s,uid,opcion,rng=Math.random){
 const {c}=posicionOrigen(s,uid);
 if(!s.nigromantes||c.cardId!=='nigromante'||!ACCIONES_ENEMIGOS.includes(opcion))throw new Error('Eleccion de nigromante invalida');
 if(c.resolucionNigromante!=='pendiente')return;
 abrirTandaDaily(s);
 if(opcion==='activacion'){c.resolucionNigromante='activacion';c.accionEnemigo=opcion;}
 else {const n=seleccionarNigromante(s,c,rng,opcion);if(n)robarZonaNigromante(s,c,n,rng);}
 cerrarReglasCarta(s);cerrarTandaDaily(s);cerrarEspecial(s,rng);
}
export function regenerarNigromante(s,uid,rng=Math.random){
 const anterior=extraccionesSecundarias(s,'nigromantes').find(n=>n.uid===uid);
 if(!anterior||anterior.anulada)return;
 const {c}=posicionOrigen(s,anterior.origenUid);
 abrirTandaDaily(s);
 anularDependientes(s,anterior.uid);anularSecundaria(s,anterior);
 recalcularSecundario(s,'nigromantes');sincronizarNigromantes(s);
 const n=seleccionarNigromante(s,c,rng,c.accionEnemigo??'activacion-spawn');if(n)robarZonaNigromante(s,c,n,rng);cerrarTandaDaily(s);cerrarEspecial(s,rng);return n;
}
