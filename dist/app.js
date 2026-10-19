import {iniciarConfiguracionUI,actualizarConfiguracionUI,leerElegiblesDailyUI} from './configuracion-ui.js';
import {configuracionRevelacionActual} from './acciones-independientes.js';
import {cargarRevelacionUI,leerRevelacionUI} from './revelacion-ui.js';
import {iniciarEspecialUI,leerEspecialUI,actualizarEspecialUI} from './especial-ui.js';
import {regenerarEspecial} from './especial.js';
import {ID_DISPARADOR,dailyIntegrado} from './especial-config.js';
import {fichaZombiHTML} from './fichas-zombis.js';
import {registrarDerrota} from './derrotas.js';
import {resumenPuntaje,PUNTOS_ZOMBI} from './puntaje.js';
import {aporteHTML as pintarAporte} from './apariciones-adicionales.js';
import {referenciasReglas,transformarMummRa,MUMM_N,MUMM_A,MENG_HUO,CHIMIMORYO} from './reglas-cartas.js';
import {profanadorPresente} from './modos-enemigos.js';
import {tipoActualBakeDanuki,referenciaBakeDanuki} from './bake-danuki.js';
import {resumenZombis,ajustarZombis,NOMBRES_AJUSTE} from './contador-zombis.js';
import {CATALOG,newGame,spawn,replaceCard,discardCard,addZoneCard,pinCard,unpinCard,total,isValid,elegirAbominacion,regenerarAbominacion,elegirNigromante,regenerarNigromante,regenerarDaily,puedeAnularTanda,anularTanda,volverAlMazo} from './engine.js';
import {escapar as esc,referenciasPorCarta,rutaRecurso,componer,normalizarConfig,idsSecundarios,dificultadVisible,nombreVisible} from './catalogo.js';
import {perfilDailyInicial,parametrosDailyFormulario} from './daily.js';
import {KEY,recuperar,guardarAccion} from './persistencia.js';
import {selectorContenido,selectorColeccion,iniciarInformacion,informacionCarta} from './informacion.js';
import {configContenido,marcarContenido,visiblesContenido,erroresContenido,firmaContenido,marcarCaja,resumenCaja,seleccionarContenido} from './contenido.js';
import {prepararOffline} from './pwa.js';
import {estadoVisualSpawn,agruparRevelaciones,tieneActivacionAdicional,etiquetasZonas,agruparZonas} from './presentacion.js';
import {NOMBRES_ACCIONES} from './acciones-enemigos.js';
import {DURACION_ACTIVACION} from './volteo.js';
import {crearRevelacion,avanzarRevelacion} from './revelacion.js';
import {NIVELES_ADRENALINA,NOMBRES_ADRENALINA,nivelAdrenalina,cambiarNivelAdrenalina} from './adrenalina.js';
import {FAMILIAS_LIMITES,limitesIniciales,adoptarLimites} from './limites.js';
import {PROFANADOR} from './modos-enemigos.js';
import {referenciasActivacion} from './presentacion.js';
import {programarConfiguracion,actualizarPartidaDePrueba} from './engine.js';
import {REVISION_REGLAS} from './configuracion-partida.js';
import {disponiblesSecundario} from './secundarios.js';
import {datos} from './catalogo.js';
const $=id=>document.getElementById(id);
iniciarConfiguracionUI();
const marcadorPuntaje=window.ScoreCounter.create($('score-counter-host'),{theme:'kang',value:0,width:180,assetBase:'./recursos/Imagenes generales/contadores_puntaje/assets/'});
marcadorPuntaje.element.id='open-zombies';marcadorPuntaje.element.dataset.action='zombis';marcadorPuntaje.element.title='Puntaje y zombis generados';
let ultimoTemaPuntaje='kang',ultimoPuntaje=0;

// Depuración temporal: desactivar antes de preparar la versión final.
const DEBUG_DAILY_SPAWN=true;
let catalog=Object.fromEntries(CATALOG.map(c=>[c.id,c]));
let state=newGame(configuracionRevelacionActual({easy:true,normal:true,threshold:20,modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado',abominacionEstandarId:'enemigo-abominacion-kan',dailyPorNivel:perfilDailyInicial(),limitesPorAdrenalina:limitesIniciales(true)})),storageBlocked=false,guardadoObservado=null;
try{guardadoObservado=localStorage.getItem(KEY);state=recuperar(localStorage)||state;guardadoObservado=localStorage.getItem(KEY);}
catch(e){storageBlocked=true;$('status-alert').hidden=false;$('status-alert').textContent='No se pudo recuperar la partida guardada. Inicia una nueva partida desde Configuración para continuar.';}
if(!storageBlocked&&state.revisionReglas!==REVISION_REGLAS){
 try{state=guardarAccion(state,s=>actualizarPartidaDePrueba(s),localStorage,{esperado:guardadoObservado});guardadoObservado=JSON.stringify(state);}
 catch{storageBlocked=true;$('status-alert').hidden=false;$('status-alert').textContent='No se pudo reiniciar la partida de prueba. El guardado anterior sigue intacto.';}
}
let toastTimer,confirmAction,visibleBatch=null,zoomUid=null;
let mostrarDesfijados=false,zoomEnJuego=100;
let anulacionPendiente=false;
let borradorContenido=null,firmaConfiguracionInicial=null,filtroContenido='zombies';
let volteos=new Map(),temporizadoresVolteo=[];
let revelacion=null,temporizadorRevelacion;

const movimientoReducido=window.matchMedia('(prefers-reduced-motion: reduce)');
let pulsoPuntaje=null;
function pulsarPuntaje(){
 pulsoPuntaje?.cancel();
 if(movimientoReducido.matches)return;
 pulsoPuntaje=$('score-counter-host').animate([
  {transform:'scale(1)',offset:0,easing:'ease-in-out'},
  {transform:'scale(1.1)',offset:.5,easing:'ease-in-out'},
  {transform:'scale(1)',offset:1}
 ],{duration:1500});
}
movimientoReducido.addEventListener('change',e=>{if(e.matches)pulsoPuntaje?.cancel();});
function idsVisibles(){const b=state.history.at(-1);return b?cartasTanda(b).map(({c})=>c.uid):[];}
function terminarVolteos(){
 clearTimeout(temporizadorRevelacion);revelacion=null;document.body.classList.remove('revelacion-procedural');
 for(const timer of temporizadoresVolteo)clearTimeout(timer);
 temporizadoresVolteo=[];volteos.clear();
 for(const carta of $('batch-grid').querySelectorAll('.volteando,.por-revelar')){carta.classList.remove('volteando','por-revelar');carta.inert=false;}
}
movimientoReducido.addEventListener('change',e=>{if(e.matches){terminarVolteos();if($('batch-dialog').open)renderBatch();}});
function prepararRevelacion(anteriores,inicial=false,previa=null){
 const b=state.history.at(-1);if(!b)return;
 const items=cartasTanda(b),ahora=performance.now();
 if(inicial){terminarVolteos();revelacion=crearRevelacion(items,b.number,ahora,{reducida:movimientoReducido.matches});}
 else if(!revelacion){
  const pendientes=new Set((previa?cartasTanda(previa):[]).filter(({c})=>(c.resolucionNigromante||c.resolucionAbominacion)==='pendiente').map(({c})=>c.uid));
  const porResolver=items.filter(({c})=>pendientes.has(c.uid)&&tieneActivacionAdicional(c)).map(({c})=>c.uid);
  if(porResolver.length||items.some(({c})=>!anteriores.includes(c.uid)))revelacion=crearRevelacion(items,b.number,ahora,{conocidos:anteriores,porResolver,reducida:movimientoReducido.matches});
 }
 if(!revelacion)return;
 document.body.classList.add('revelacion-procedural');
 avanzarPresentacion();
}
function avanzarPresentacion(){
 if(!revelacion)return;
 const b=state.history.find(b=>b.number===revelacion.numero);if(!b){terminarVolteos();return;}
 const ahora=performance.now(),paso=avanzarRevelacion(revelacion,cartasTanda(b),ahora);
 if(paso.revelar!==undefined)volteos.set(paso.revelar,{inicio:ahora,duracion:paso.demora});
 if(paso.terminada){revelacion=null;document.body.classList.remove('revelacion-procedural');}
}
function toast(text){$('toast').textContent=text;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2800);}
function commit(fn,{recover=false,animar=false,procedural=false,celebrar=false}={}){
 if(storageBlocked&&!recover){toast('Inicia una nueva partida desde Configuración para continuar.');return false;}
 const next=state;
 const anteriores=animar?idsVisibles():[];
 try{state=guardarAccion(next,fn,localStorage,{esperado:guardadoObservado});guardadoObservado=JSON.stringify(state);storageBlocked=false;$('status-alert').hidden=true;$('save-status').textContent='Guardado local';if(animar||procedural)prepararRevelacion(anteriores,procedural,next.history.at(-1));else if(revelacion)avanzarPresentacion();render();if(celebrar)pulsarPuntaje();return true;}
 catch(e){
  if(e.code==='PARTIDA_CAMBIADA'){
   try{terminarVolteos();state=recuperar(localStorage)||state;guardadoObservado=localStorage.getItem(KEY);render();toast('La partida cambió en otra pestaña. Repite la acción.');return false;}catch{storageBlocked=true;}
  }
$('save-status').textContent='No se pudo guardar';toast(['CADENA_AUTOMATICA','ENEMIGO_EN_JUEGO'].includes(e.code)?e.message:'No se pudo guardar el cambio. Libera espacio o habilita el almacenamiento y vuelve a intentar.');return false;
 }
}
function openDialog(id){if(!$(id).open)$(id).showModal();}
function closeDialog(id,{forzar=false}={}){if(id==='confirm-dialog')confirmAction=null;if(id==='settings-dialog'&&!forzar&&hayCambiosConfiguracion()){confirmarSalidaConfiguracion();return;}$(id).close();}
function entry(uid){for(const b of state.history)for(const slot of b.slots)for(const c of slot.draws){if(c.uid===uid)return c;const secundaria=[...(c.abominaciones||[]),...(c.nigromantes||[]),...(c.daily||[]),...(c.especial||[])].find(a=>a.uid===uid);if(secundaria)return secundaria;}return state.pins.find(c=>c.uid===uid)||state.unpinned.find(c=>c.uid===uid);}
function imagenCarta(c){const card=catalog[c.cardId];return c.mazo||card.rutaImagen?rutaRecurso(card.rutaImagen??card.image):`./assets/${card.image}`;}
function cartasTanda(b,historico=false){
 const items=[],finales=[],etiquetas=etiquetasZonas(b);
 function visitar(t){
  if(!historico&&t.anulada)return;
  const zone=etiquetas.get(t.id)??t.zone;
  for(const c of historico?t.draws:t.draws.slice(-1)){
   if(c.cardId!==ID_DISPARADOR||![...(c.especial||[]),...(c.daily||[])].length)items.push({c,slot:t,zone});
   for(const a of c.especial||[])if(historico||!a.anulada||c.discarded&&a===c.especial.at(-1))(b.especialIntento?finales:items).push({c:a,slot:t,zone});
   for(const a of referenciasActivacion(c))items.push({c:a,slot:t,zone});
   for(const d of c.daily||[])if(historico||!d.anulada||c.discarded&&d.disparadorEspecial&&d===c.daily.at(-1))(d.spawnEspecial&&b.especialIntento?finales:items).push({c:d,slot:t,zone});
   for(const a of c.abominaciones||[])if(historico||!a.anulada)items.push({c:a,slot:t,zone});
   for(const n of c.nigromantes||[])if(historico||!n.anulada){
    items.push({c:n,slot:t,zone});
    const derivada=b.slots.find(p=>p.id===n.spawnSlotId);if(derivada&&!b.reglasEnemigos)visitar(derivada);
   }
  }
 }
 for(const t of b.slots.filter(t=>b.reglasEnemigos||t.kind!=='derivada'))visitar(t);
 items.push(...finales);
 items.push(...referenciasReglas(state,b));
 const bake=referenciaBakeDanuki(state,b);if(bake)items.push(bake);
 return items;
}
function isPinned(uid){return state.pins.some(c=>c.uid===uid);}
function showConfirm(title,message,buttons,fn){$('confirm-title').textContent=title;$('confirm-message').textContent=message;$('confirm-actions').innerHTML=buttons.map(b=>`<button data-action="confirm" data-value="${b.value}" class="${b.primary?'primary':''}">${b.label}</button>`).join('');confirmAction=fn;openDialog('confirm-dialog');}
const pinIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 3 8 0-1 6 4 4v2H5v-2l4-4-1-6ZM12 15v6"/></svg>';
const refreshIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4v6h-6M4 20v-6h6M4 10a8 8 0 0 1 13-5l3 5M20 14a8 8 0 0 1-13 5l-3-5"/></svg>';
const trashIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/></svg>';
function pinButton(c){const pinned=isPinned(c.uid),label=`${pinned?'Desfijar':'Fijar'} ${catalog[c.cardId].name}`;return `<button data-action="pin" data-uid="${c.uid}" class="${pinned?'active':''}" aria-label="${esc(label)}" title="${esc(label)}" aria-pressed="${pinned}" ${c.anulada?'disabled':''}>${pinIcon}</button>`;}
const selloActivacion='<span class="activation-stamp" role="status" aria-label="Activación adicional aplicada"><span>Activación</span><span>adicional</span></span>';
const MARCOS_ENEMIGOS={nigromantes:'marcos_corregidos_280x437/marco_nigromante.png',abominaciones:'marcos_corregidos_280x437/marco_abominacion.png'};
function marcoEnemigo(c){
 const archivo=!c.anulada&&MARCOS_ENEMIGOS[c.mazo];
 return archivo?`<span class="enemy-frame enemy-frame-${c.mazo}" aria-hidden="true"><img src="${esc('./recursos/Imagenes generales/'+archivo)}" alt=""></span>`:'';
}
function marcadorZonaHTML(slot,zone,c){
 if(c?.referenciaEspecial||c?.referenciaBakeDanuki||c?.referenciaActivacion&&['abominaciones','nigromantes'].includes(c.mazo))return '<span class="spawn-zone-space" aria-hidden="true"></span>';
 const normal=slot.kind==='normal';
 const numero=normal?slot.zone.match(/^Zona\s+(\d+)$/)?.[1]:null;
 const archivo=normal?'Marcador de zonas de estandar.png':'Marcador de zonas de nigromante.png';
 return '<span class="spawn-zone-token" role="img" aria-label="'+esc(zone)+'"><img src="'+esc('./recursos/Imagenes generales/'+archivo)+'" alt="">'+(numero?'<span class="spawn-zone-number" aria-hidden="true">'+numero+'</span>':'')+'</span>';
}
function estandarteHTML(tipo){
 const d=DISTINTIVOS_ENEMIGOS[tipo];
 return d?'<span class="enemy-tag enemy-tag-'+tipo+'" role="img" aria-label="'+d.nombre+'"><img src="'+esc('./recursos/Imagenes generales/'+d.archivo)+'" alt="" aria-hidden="true"></span>':'';
}
function banderinDailyHTML(c){
 if(c.mazo!=='daily'||c.anulada)return '';
 return estandarteHTML(c.referenciaBakeDanuki?c.tipoBakeDanuki:catalog[c.cardId]?.tipo);
}
function resultadoBakeHTML(c){return c.referenciaBakeDanuki?'<span class="bake-die-result">Dado '+c.dadoBakeDanuki+' · '+DISTINTIVOS_ENEMIGOS[c.tipoBakeDanuki].nombre+'</span>':'';}
function aporteHTML(c,mini=false){return pintarAporte(c,state.proximaConfig.modoAparicionAdicional??state.config.modoAparicionAdicional??'minimalista',mini);}

function miniHTML(c,zone,slot){
 if(c.referenciaAporte)return aporteHTML(c,true);
 if(c.cardId===ID_DISPARADOR)return `<div class="last-mini">${marcadorZonaHTML(slot,zone,c)}<p class="especial-concepto">Spawn Especial<br>Sin candidatos disponibles</p></div>`;
 const card=catalog[c.cardId],visual=estadoVisualSpawn(c);
return `<div class="last-mini ${c.discarded?'discarded':''} ${visual==='spawn'||visual==='activacion'||c.transformacionDesde?'spawn-applied':''}" data-extraccion="${c.uid}">${marcadorZonaHTML(slot,zone,c)}<div class="mini-media"><button data-action="zoom" data-uid="${c.referenciaUid??c.uid}" aria-label="Ampliar ${esc(card.name)}"><img src="${esc(imagenCarta(c))}" alt="${esc(card.name)}">${marcoEnemigo(c)}${banderinDailyHTML(c)}${c.discarded?'<span class="discard-cross" aria-hidden="true">×</span>':''}${tieneActivacionAdicional(c)&&c.activaciones===undefined?selloActivacion:''}</button></div>${resultadoBakeHTML(c)}<small class="visually-hidden">${esc(zone)}</small></div>`;
}
function gruposZonaHTML(items,pintar,mini=false){
 return agruparZonas(items).map(grupo=>{
  const cartas=agruparRevelaciones(grupo.items).map(pareja=>{
   const contenido=pareja.map(pintar).join('');
   return pareja.length===2?`<div class="${mini?'last-reveal-pair':'reveal-pair'}" role="group" aria-label="Spawn aplicado y enemigo revelado">${contenido}</div>`:contenido;
  }).join('');
  return `<section class="${mini?'last-zone-group':'zone-group'}" aria-label="${esc(grupo.nombre)}" data-zona="${esc(grupo.slot.id)}" data-tipo="${esc(grupo.slot.kind)}"><div class="${mini?'last-zone-cards':'zone-group-cards'}">${cartas}</div></section>`;
 }).join('');
}
function cartasHTML(b,historico=false){
 const items=cartasTanda(b,historico).filter(({c})=>historico||!revelacion||revelacion.numero!==b.number||revelacion.visibles.has(c.uid));
 return gruposZonaHTML(items,({c,slot,zone})=>cardHTML(c,zone,historico?'history':'batch',b.number,slot.id,slot.kind!=='normal',slot));
}
function cardHTML(c,zone='',actions=false,batch=0,slot=0,necro=false,zonaSlot=null){
 if(c.referenciaAporte)return aporteHTML(c);
 if(c.cardId===ID_DISPARADOR)return `<article class="draw-card" data-extraccion="${c.uid}">${zonaSlot?marcadorZonaHTML(zonaSlot,zone,c):''}<p class="especial-concepto">Spawn Especial<br>Sin candidatos disponibles</p>${actions==='batch'?`<button data-action="replace" data-batch="${batch}" data-slot="${slot}">Regenerar</button><button data-action="discard" data-batch="${batch}" data-slot="${slot}">Descartar</button>`:''}</article>`;
 const secuencia=actions==='batch'&&revelacion?.numero===batch?revelacion:null;
 const bloqueada=secuencia&&(secuencia.espera===null||(!secuencia.resueltas.has(c.uid)&&!c.mazo&&secuencia.espera!==c.uid));
 const card=catalog[c.cardId];
 const info=referenciasPorCarta(c.cardId).length?`<button data-action="info" data-id="${c.cardId}" aria-label="Información de ${esc(card.name)}" title="Información de la carta">ⓘ</button>`:'';
 const secundaria=Boolean(c.mazo)&&!c.disparadorEspecial,nigromante=c.mazo==='nigromantes'||c.cardId==='nigromante';
 const regenerar=c.spawnEspecial?'regenerar-especial':c.mazo==='daily'?'regenerar-daily':nigromante?'regenerar-nigromante':'regenerar-abominacion';
 const controls=actions&&!c.referenciaEspecial&&!c.referenciaActivacion&&!c.referenciaBakeDanuki?`<div class="card-actions">${pinButton(c)}${actions==='batch'?`<button data-action="${secundaria?regenerar:'replace'}" data-uid="${c.uid}" data-batch="${batch}" data-slot="${slot}" aria-label="${secundaria?'Regenerar':'Descartar y regenerar'} ${esc(card.name)}" title="${secundaria?'Regenerar enemigo':'Descartar y robar otra'}">${refreshIcon}</button>${secundaria?'':`<button data-action="discard" data-batch="${batch}" data-slot="${slot}" class="discard-button" aria-label="Descartar ${esc(card.name)} sin robar otra" title="Descartar sin robar otra" ${c.discarded?'disabled':''}>${trashIcon}</button>`}`:''}${info}</div>`:'';
 const pendiente=(c.resolucionAbominacion||c.resolucionNigromante)==='pendiente';
 const eleccion=actions==='batch'&&!c.discarded&&pendiente&&(!secuencia||secuencia.espera===c.uid)?`<div class="enemy-choices">${['activacion','spawn','activacion-spawn'].map(opcion=>`<button data-action="${nigromante?'elegir-nigromante':'elegir-abominacion'}" data-uid="${c.uid}" data-value="${opcion}">${esc(NOMBRES_ACCIONES[opcion])}</button>`).join('')}</div>`:'';
 const visual=secuencia&&!secuencia.resueltas.has(c.uid)?'ninguno':estadoVisualSpawn(c);
 const volteo=actions==='batch'?volteos.get(c.uid):undefined;
 const activacion=secuencia?.activacion?.uid===c.uid?secuencia.activacion:null;
 const sello=(c.referenciaActivacion&&(!secuencia||secuencia.resueltas.has(c.uid))||visual!=='ninguno'&&c.activaciones===undefined)&&tieneActivacionAdicional(c)?activacion?`<span class="activation-animation" style="--activacion-duracion:${DURACION_ACTIVACION}ms;--activacion-demora:${activacion.inicio-performance.now()}ms">${selloActivacion}</span>`:selloActivacion:'';
 const volteando=volteo!==undefined&&volteo.inicio+volteo.duracion>performance.now();
 const porRevelar=secuencia&&!secuencia.reveladas.has(c.uid);
 const debugDaily=DEBUG_DAILY_SPAWN&&actions==='batch'&&!porRevelar&&c.dailyIntento?`<span class="debug-daily" title="Probabilidad de Daily Spawn usada para esta carta"> - ${esc(c.dailyIntento.probabilidad.toLocaleString('es-CL',{maximumFractionDigits:2}))}%</span>`:'';
 const avisoLimite=c.activacionPorLimite!==undefined&&(visual!=='ninguno'||actions==='history')?`<p class="resolution-tag">Tope alcanzado: ${esc(c.activacionPorLimite)}</p>`:'';
 const resultadoIndependiente=c.revelacionIndependiente&&!c.discarded&&!porRevelar?`<p class="resolution-tag">${c.resolucionNigromante==='sin-efecto'||c.resolucionAbominacion==='sin-efecto'?'Sin efecto':`${c.activaciones?.length??0} activaciones adicionales`}${c.revelacionIndependiente.spawn.resultado==='bloqueado'?` · Spawn bloqueado: ${c.revelacionIndependiente.spawn.motivo==='limite'?'tope alcanzado':'sin candidatos'}`:c.revelacionIndependiente.spawn.resultado==='fallo'?' · Sin Spawn adicional':''}</p>`:'';
 return `<article class="draw-card ${c.discarded?'discarded':''} ${visual==='spawn'||visual==='activacion'||c.transformacionDesde?'spawn-applied':''} ${volteando?'volteando':''} ${porRevelar?'por-revelar':''} ${bloqueada?'resolucion-bloqueada':''}" ${volteando||porRevelar?'inert':''} ${volteando?`style="--volteo-demora:${volteo.inicio-performance.now()}ms;--volteo-duracion:${volteo.duracion}ms"`:''} data-extraccion="${c.uid}">${zonaSlot?marcadorZonaHTML(zonaSlot,zone,c):''}<span class="zone-label visually-hidden ${necro?'necro-zone':''}" ${visual==='spawn'||visual==='activacion'?'title="Efecto aplicado"':''}>${esc(zone)}</span><div class="card-media"><div class="reveal-front"><button class="card-image" data-action="zoom" data-uid="${c.referenciaUid??c.uid}" aria-label="Ampliar ${esc(card.name)}"><img src="${esc(imagenCarta(c))}" alt="${esc(card.name)}" loading="${volteando?'eager':'lazy'}">${actions==='batch'?marcoEnemigo(c):''}${actions==='batch'||c.referenciaBakeDanuki?banderinDailyHTML(c):''}${c.discarded?'<span class="discard-cross" aria-hidden="true">×</span>':''}${sello}</button>${eleccion}</div><div class="reveal-back" aria-hidden="true"></div></div>${controls}<p class="card-label">${esc(card.name)}${c.spawnEspecial?' · Spawn Especial':''}${c.referenciaActivacion?' · Activación':''}${debugDaily}${resultadoBakeHTML(c)}</p>${avisoLimite}${resultadoIndependiente}${c.sinCandidatos?'<p class="resolution-tag">Sin enemigos disponibles · Sin nueva aparición</p>':''}${c.discarded?`<p class="discard-tag">${c.anulada?secundaria?'Anulada · Devuelta al mazo':'Anulada · Sin efecto':'Descartada · Sin efecto'}</p>`:''}</article>`;
}
const DISTINTIVOS_ENEMIGOS={abominaciones:{archivo:'Banderín rojo de abominación-2.png',nombre:'Abominación'},nigromantes:{archivo:'Estandarte esmeralda del nigromante-1.png',nombre:'Nigromante'},caminantes:{archivo:'Estandarte del caminante zombi.png',nombre:'Caminante'},brutos:{archivo:'Zombi barrigón en estandarte morado.png',nombre:'Bruto'},corredores:{archivo:'Estandarte ámbar del zombi corredor.png',nombre:'Corredor'}};
function savedCardHTML(reference,archived=false){
 const c=entry(reference.uid)||reference,card=catalog[c.cardId];
 const tipo=tipoActualBakeDanuki(state,c)??(['abominaciones','nigromantes'].includes(c.mazo)?c.mazo:({abominacion:'abominaciones',nigromante:'nigromantes'}[card.tipo]??(card.tipo?.startsWith('caminantes-')?'caminantes':card.tipo))),distintivo=!archived&&DISTINTIVOS_ENEMIGOS[tipo];
 const tag=distintivo?`<span class="enemy-tag enemy-tag-${tipo}" role="img" aria-label="${distintivo.nombre}"><img src="${esc('./recursos/Imagenes generales/'+distintivo.archivo)}" alt="" aria-hidden="true"></span>`:'';
 return `<div class="pinned-card ${archived?'archived-card':''}"><button class="image-button" data-action="zoom" data-uid="${c.referenciaUid??c.uid}" aria-label="Ampliar ${esc(card.name)}"><img src="${esc(imagenCarta(c))}" alt="${esc(card.name)}" loading="lazy">${tag}</button><button class="unpin ${archived?'repin':''}" data-action="${archived?'pin':'unpin'}" data-uid="${c.uid}" title="${c.anulada?'Anulada':archived?'Volver a fijar':'Desfijar'} ${esc(card.name)}" aria-label="${archived?'Volver a fijar':'Desfijar'} ${esc(card.name)}" ${c.anulada?'disabled':''}>${archived?pinIcon:'×'}</button><small>${esc(card.name)}${c.anulada?' · Anulada':''}</small></div>`;}


function distribuirEnJuego(){
 if(!$('inplay-dialog').open)return;
 const galeria=$('inplay-gallery'),ancho=280*zoomEnJuego/100;
 const filas=Math.max(1,Math.min(state.pins.length,Math.floor((galeria.clientHeight-16+18)/(ancho*437/280+54+18))));
 galeria.style.setProperty('--inplay-card-width',ancho+'px');
 galeria.style.setProperty('--inplay-columns',Math.max(1,Math.ceil(state.pins.length/filas)));
 galeria.style.setProperty('--inplay-rows',filas);
}
function renderEnJuego(){
 $('inplay-percent').textContent=zoomEnJuego+'%';
 for(const b of document.querySelectorAll('[data-action="zoom-en-juego"]'))b.disabled=Number(b.dataset.delta)<0?zoomEnJuego<=25:zoomEnJuego>=200;
 $('inplay-gallery').innerHTML=state.pins.length?state.pins.map(c=>savedCardHTML(c)).join(''):'<div class="empty-state"><strong>No hay cartas en juego.</strong><p>Fija cartas para consultarlas aquí.</p></div>';
 distribuirEnJuego();
}

function renderFijados(){
 if($('inplay-dialog').open)renderEnJuego();
 const boton=$('toggle-desfijados');
 boton.textContent=mostrarDesfijados?'Ocultar desfijados':'Mostrar desfijados';
 boton.setAttribute('aria-expanded',String(mostrarDesfijados));
 const vacio=!state.pins.length&&(!mostrarDesfijados||!state.unpinned.length);
 $('pins').innerHTML=`${state.pins.map(c=>savedCardHTML(c)).join('')}<div id="desfijados" class="unpinned-strip" ${mostrarDesfijados&&state.unpinned.length?'':'hidden'}>${state.unpinned.length?`<div class="unpinned-divider"><span>Desfijados</span><small>${state.unpinned.length}</small></div>${state.unpinned.map(c=>savedCardHTML(c,true)).join('')}`:''}</div>${vacio?`<div class="empty-state"><p>${state.unpinned.length?'No hay cartas fijadas.':'Fija una carta durante una aparición para tenerla aquí.'}</p></div>`:''}`;
}


const filasAjuste=[...document.querySelectorAll('.zombie-adjustment-row')];
function actualizarCantidadZombis(fila){
 if(!fila){for(const f of filasAjuste)actualizarCantidadZombis(f);return;}
 const campo=fila.querySelector('input'),texto=campo.value.trim(),cantidad=Number(texto),total=resumenZombis(state).total,puntos=PUNTOS_ZOMBI[fila.dataset.tipo];
 const entero=texto!==''&&Number.isSafeInteger(cantidad);
 const fuera=entero&&(total+cantidad<0||!Number.isSafeInteger(total+cantidad)||!Number.isSafeInteger(cantidad*puntos)||!Number.isSafeInteger(resumenPuntaje(state).total+cantidad*puntos));
 const error=texto!==''&&!entero?'Ingresa un número entero.':fuera?'Este ajuste supera el conteo permitido.':'';
 const mensaje=fila.querySelector('.field-error');mensaje.textContent=error;mensaje.hidden=!error;
 fila.querySelector('[type="submit"]').disabled=storageBlocked||!entero||cantidad===0||fuera;
 campo.disabled=storageBlocked;
 return entero&&cantidad!==0&&!fuera&&!storageBlocked;
}
for(const fila of filasAjuste){
 fila.querySelector('input').addEventListener('input',()=>actualizarCantidadZombis(fila));
 fila.addEventListener('submit',e=>{
  e.preventDefault();if(!actualizarCantidadZombis(fila))return;
  const campo=fila.querySelector('input'),cantidad=Number(campo.value);
  if(commit(s=>ajustarZombis(s,cantidad,Date.now(),fila.dataset.tipo))){campo.value='0';actualizarCantidadZombis();}
 });
}

function renderContadorZombis(){
 const resumen=resumenZombis(state),puntaje=resumenPuntaje(state),tema=state.proximaConfig.temaPuntaje??state.config.temaPuntaje??'kang';
 if(tema!==ultimoTemaPuntaje){marcadorPuntaje.setTheme(tema);ultimoTemaPuntaje=tema;}
 const oculto=state.proximaConfig.ocultarPuntaje??state.config.ocultarPuntaje??false;
 if(puntaje.total!==ultimoPuntaje){marcadorPuntaje.setValue(puntaje.total);ultimoPuntaje=puntaje.total;}
 $('score-counter-host').hidden=oculto;
 marcadorPuntaje.element.setAttribute('aria-label',`Puntaje: ${puntaje.total}. Abrir puntaje y zombis generados`);
 $('zombies-total').textContent=String(resumen.total);
 $('score-total').textContent=String(puntaje.total);
 const recurso=window.ScoreCounter.themes[tema];
 $('score-dialog-display').innerHTML=`<img class="score-counter__base" src="./recursos/Imagenes generales/contadores_puntaje/assets/${recurso.file}" alt="">${window.ScoreCounter.renderScoreSvg(tema,puntaje.total)}`;
 $('score-dialog-display').setAttribute('aria-label',`Puntaje: ${puntaje.total}`);
 $('score-variable-note').hidden=resumen.variables===0;
 $('score-variable-note').textContent=`${resumen.variables} ${resumen.variables===1?'aparición con cantidad variable':'apariciones con cantidad variable'}: agrega sus zombis manualmente en la fila del tipo correspondiente.`;

 for(const b of document.querySelectorAll('[data-action="zombis-ajuste"]'))b.disabled=storageBlocked;
 actualizarCantidadZombis();
 const registros=state.ajustesZombis||[];
 $('zombies-log').innerHTML=registros.slice().reverse().map(r=>'<li><strong>'+(r.delta>0?'+':'')+r.delta+'</strong><span>'+esc(new Date(r.fecha).toLocaleString('es-CL',{timeZone:'America/Santiago',day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'}))+'<small>'+esc(NOMBRES_AJUSTE[r.tipo??'caminantes'])+' · Tanda '+r.tanda+' · '+esc(NOMBRES_ADRENALINA[r.nivel])+'</small></span></li>').join('');
 $('zombies-empty').hidden=registros.length>0;
}

function render(){
 renderContadorZombis();
 const nivel=nivelAdrenalina(state),indice=NIVELES_ADRENALINA.indexOf(nivel);
 $('nivel-adrenalina').textContent=NOMBRES_ADRENALINA[nivel];$('nivel-adrenalina').dataset.nivel=nivel;$('deck-progress').dataset.nivel=nivel;
 for(const boton of document.querySelectorAll('[data-action="adrenalina"]'))boton.disabled=storageBlocked||state.openBatch||(Number(boton.dataset.delta)<0?indice===0:indice===NIVELES_ADRENALINA.length-1);

 catalog=Object.fromEntries([...state.catalogo.cartas,...(state.abominaciones?.cartas||[]),...(state.nigromantes?.cartas||[]),...(state.daily?.cartas||[])].map(c=>[c.id,{...c,name:nombreVisible(c.name)}]));
 const size=total(state.initial),left=total(state.remaining),count=state.normal+state.necro;
 $('normal-count').textContent=state.normal;$('necro-count').textContent=state.necro;
 const profanadorEnJuego=state.nigromantes?Boolean(profanadorPresente(state)):state.necro>0;
 const indicador=$('profanador-indicator'),descripcion=profanadorEnJuego?'Profanador en juego: zona de nigromante activa':'Profanador fuera de juego: sin zona de nigromante';
 indicador.classList.toggle('inactive',!profanadorEnJuego);indicador.setAttribute('aria-label',descripcion);indicador.title=descripcion;
 $('spawn-label').textContent=`Revelar ${count} ${count===1?'carta':'cartas'}`;$('spawn').disabled=!count||!size||storageBlocked;
 document.querySelectorAll('[data-action="counter"][data-delta="-1"]').forEach(b=>b.disabled=state[b.dataset.kind]===0);
 document.querySelectorAll('[data-action="counter"][data-kind="necro"]').forEach(b=>b.hidden=Boolean(state.nigromantes));
 const extraNigromante=document.querySelector('[data-action="add-zone"][data-kind="necro"]');extraNigromante.parentElement.hidden=Boolean(state.nigromantes);
 $('deck-count').textContent=`${size?Math.round(left/size*100):0}%`;
 $('deck-count').setAttribute('aria-label',`${size?Math.round(left/size*100):0}% del mazo general restante`);$('deck-progress').style.width=`${size?left/size*100:0}%`;

 $('history-count').textContent=state.history.length;$('pin-count').textContent=state.pins.length;
 const batch=state.history.at(-1);$('reopen').hidden=!batch;
 $('last-preview').innerHTML=batch?`<div class="last-strip">${gruposZonaHTML(cartasTanda(batch),({c,zone,slot})=>miniHTML(c,zone,slot),true)}</div>`:'<div class="empty-state"><strong>El mazo está listo.</strong><p>Pulsa SPAWN para revelar una carta por zona.</p></div>';
 renderFijados();
 if($('batch-dialog').open)renderBatch();if($('history-dialog').open)renderHistory();

}
function renderBatch(){const b=state.history.find(b=>b.number===visibleBatch)||state.history.at(-1);if(!b)return;visibleBatch=b.number;$('batch-dialog').dataset.revelacion=revelacion?.fase??'lista';$('batch-title').textContent=`Tanda ${b.number} · ${b.normal+b.necro} zonas iniciales`;$('batch-grid').innerHTML=cartasHTML(b);programarVolteos();const anular=$('anular-tanda');anular.disabled=storageBlocked||!puedeAnularTanda(state,b.number);anular.title=anular.disabled?'Esta tanda no tiene un respaldo anterior disponible':'Volver al estado anterior a SPAWN';}
function programarVolteos(){
 clearTimeout(temporizadorRevelacion);
 if(revelacion&&revelacion.espera===null)temporizadorRevelacion=setTimeout(()=>{avanzarPresentacion();if($('batch-dialog').open)renderBatch();},Math.max(0,revelacion.hasta-performance.now()));
 for(const timer of temporizadoresVolteo)clearTimeout(timer);
 temporizadoresVolteo=[];
 for(const [uid,{inicio,duracion}] of volteos){
  const carta=$('batch-grid').querySelector(`[data-extraccion="${uid}"]`),restante=inicio+duracion-performance.now();
  if(!carta||restante<=0){volteos.delete(uid);continue;}
  temporizadoresVolteo.push(setTimeout(()=>{carta.classList.remove('volteando');carta.inert=false;volteos.delete(uid);},restante));
 }
}
function renderHistory(){$('history-list').innerHTML=state.history.length?[...state.history].reverse().map(b=>`<section class="history-group"><div class="history-heading"><h3>Tanda ${b.number}</h3><small>${new Date(b.date).toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'})} · ${b.normal+b.necro} zonas iniciales</small></div><div class="history-cards">${cartasHTML(b,true)}</div></section>`).join(''):'<div class="empty-state"><p>Las cartas aparecerán aquí después de la primera tanda.</p></div>';}
function showBatch(){visibleBatch=state.history.at(-1)?.number;if(!visibleBatch)return;if(!state.openBatch&&!commit(s=>s.openBatch=true))return;renderBatch();openDialog('batch-dialog');}
function zoom(uid){
 const c=entry(uid);if(!c)return;zoomUid=uid;const card=catalog[c.cardId];
 $('zoom-title').textContent=card.name;
 const colors=['#72b6ff','#f4db68','#f6a565','#f08080'],names=['Azul','Amarillo','Naranja','Rojo'];
 $('zoom-content').innerHTML=`<div class="zoom-content"><img src="${esc(imagenCarta(c))}" alt="${esc(card.name)}"><div><span class="eyebrow">${esc(c.mazo==='daily'?'DAILY SPAWN':c.mazo?`MAZO DE ${c.mazo.toUpperCase()}`:dificultadVisible(card.difficulty)||'MAZO GENERAL')}</span>${card.idCarta?`<p>ID carta: ${esc(card.idCarta)}</p>`:''}${card.reglas?`<p class="daily-rules">${esc(card.reglas)}</p>`:''}${card.levels?`<h3>Nivel de adrenalina</h3><div class="level-list">${card.levels.map((n,i)=>`<div class="level-row"><span class="level-name" style="--level:${colors[i]}">${names[i]}</span><strong>${esc(n)}</strong></div>`).join('')}</div><p class="zoom-note">${typeof card.levels[0]==='number'?'Cantidad de zombis que aparecen por nivel.':'Activa el tipo de zombi indicado, excepto en azul.'}</p>`:'<p class="zoom-note">Resuelve el efecto de esta carta en la mesa según las reglas de tu partida.</p>'}${c.discarded?`<p class="discard-tag">${c.anulada?c.mazo?'Anulada · Devuelta al mazo':'Anulada · Sin efecto':'Descartada · Sin efecto'}</p>`:''}</div></div>`;
 $('zoom-content').querySelector('.zoom-content').insertAdjacentHTML('beforeend',fichaZombiHTML(card.tipo,{id:c.cardId,mazo:c.mazo}));
 openDialog('zoom-dialog');
 if(c.cardId===MENG_HUO&&isPinned(uid)){
  const boton=document.createElement('button');boton.className='danger-button';boton.textContent='Retirar Meng Huo';
  boton.addEventListener('click',()=>{
   showConfirm('¿Retirar Meng Huo?','Su regla indica que, cuando vaya a ser eliminado, debes colocarlo en la primera zona de aparición en su lugar. ¿Deseas retirarlo de En juego como excepción manual?',[{value:'no',label:'Cancelar'},{value:'si',label:'Sí, retirar',primary:true}],v=>{
    if(v==='si'&&commit(s=>unpinCard(s,uid,false,true))){closeDialog('zoom-dialog');toast('Meng Huo retirado de En juego.');}
   });
  });
  $('zoom-content').querySelector('.zoom-content>div').append(boton);
 }
 if(c.cardId===MUMM_N&&isPinned(uid)){
  const boton=document.createElement('button');boton.className='secondary-button';boton.textContent='Pasar a Mumm-Ra Abominación';
  boton.addEventListener('click',()=>{if(commit(s=>transformarMummRa(s,uid))){closeDialog('zoom-dialog');toast('Mumm-Ra transformado.');}});
  $('zoom-content').querySelector('.zoom-content>div').append(boton);
 }
 if(c.mazo&&!c.anulada&&state[c.mazo]?.version===2&&c.cardId!==MUMM_A&&c.cardId!==MENG_HUO&&!(c.cardId===CHIMIMORYO&&profanadorPresente(state))){
  const nombreMazo=c.mazo==='daily'?'Daily Spawn':`de ${c.mazo}`;
  const boton=document.createElement('button');boton.className='secondary-button';boton.textContent=`Volver a agregar al mazo ${nombreMazo}`;
  boton.addEventListener('click',()=>{
   const advertencia=card.trofeo?' Si esta abominación ya fue derrotada, no debe volver a agregarse al mazo de abominaciones porque tiene trofeo.':'';
   showConfirm('Volver a agregar al mazo',`¿Estás seguro de que deseas volver a agregar ${c.mazo==='daily'?'este Daily':c.mazo==='abominaciones'?'esta abominación':'este nigromante'} al mazo ${nombreMazo}?${advertencia}`,[{value:'si',label:'Sí, volver a agregar',primary:true},{value:'no',label:'Cancelar'}],v=>{if(v==='si'&&commit(s=>volverAlMazo(s,uid))){closeDialog('zoom-dialog');toast('Carta devuelta al mazo.');}});
  });
  $('zoom-content').querySelector('.zoom-content>div').append(boton);
 }
}
function unpin(uid){const c=state.pins.find(c=>c.uid===uid);if(!c)return;
 const remove=(s,subtract=false,forzar=false)=>unpinCard(s,uid,subtract,forzar,'derrota');
 if(c.cardId===MUMM_A){
  showConfirm('Mumm-Ra Abominación','OJO: al ser derrotado Mumm-Ra Abominación, aparece Mumm-Ra Nigromante en la zona de aparición más cercana.',[{value:'invocar',label:'Invocar Mumm-Ra Nigromante',primary:true}],v=>{if(v==='invocar')commit(s=>transformarMummRa(s,uid,{motivo:'derrota'}),{celebrar:true});});return;
 }
 if(c.cardId===MENG_HUO){
  showConfirm('Meng Huo','Cuando Meng Huo vaya a ser eliminado, colócalo en la primera zona de aparición en su lugar.',[{value:'reaparecer',label:'Mover a la primera zona de aparición',primary:true}],v=>{if(v==='reaparecer')pulsarPuntaje();});return;
 }
 if(c.cardId===CHIMIMORYO&&profanadorPresente(state)){
  showConfirm('Chimimōryō','Al ser eliminado, Chimimōryō reaparece en la zona de aparición de Nigromante o Profanador más cercana. Si no existe ninguna, no reaparece.',[{value:'reaparecer',label:'Reaparecer en la zona de nigromante más cercana',primary:true},{value:'derrotar',label:'Derrotar abominación'}],v=>{
   if(v==='reaparecer')commit(s=>registrarDerrota(s,uid,{reaparicion:true}),{celebrar:true});
   if(v==='derrotar')showConfirm('¿Derrotar abominación?','¿Estás seguro de que deseas sacar de juego esta abominación aunque haya una zona de aparición de nigromante en juego?',[{value:'no',label:'No'},{value:'si',label:'Sí, derrotar',primary:true}],r=>{if(r==='si')commit(s=>remove(s,false,true),{celebrar:true});});
  });return;
 }
 if(!state.nigromantes&&c.cardId==='nigromante'&&state.necro>0)showConfirm('Desfijar nigromante','¿Deseas quitar un spawn de nigromante?',[{value:'yes',label:'Sí, quitar uno',primary:true},{value:'no',label:'No, mantener'},{value:'cancel',label:'Cancelar'}],v=>{if(v!=='cancel')commit(s=>remove(s,v==='yes'),{celebrar:true});});
 else commit(s=>remove(s),{celebrar:true});
}
function settings(){
 borradorContenido=configContenido(state.proximaConfig);filtroContenido='zombies';
 const f=$('settings-form');f.elements.easy.checked=state.proximaConfig.easy;f.elements.normal.checked=state.proximaConfig.normal;f.elements.threshold.value=state.config.threshold;
 const limites=state.proximaConfig.limitesPorAdrenalina??state.config.limitesPorAdrenalina??limitesIniciales();
 for(const mazo of FAMILIAS_LIMITES)for(const nivel of NIVELES_ADRENALINA)f.elements[`limite-${mazo}-${nivel}`].value=mazo==='nigromantes'&&state.proximaConfig.reglaNigromantes===undefined?limites[mazo][nivel]:limites[mazo][nivel];
 f.elements.reglaNigromantes.value=state.proximaConfig.reglaNigromantes??'personalizado';
 f.elements.reglaAbominaciones.value=state.proximaConfig.reglaAbominaciones??'personalizado';
 borradorContenido.abominacionEstandarId=state.proximaConfig.abominacionEstandarId;
 actualizarAbominacionEstandar();
 for(const [mazo,campo] of [['abominaciones','modoAbominaciones'],['nigromantes','modoNigromantes']]){
  f.elements[campo].value=state.proximaConfig[campo]||'sin-reposicion';const m=state[mazo];
  $(`${mazo}-status`).textContent=m?`${disponiblesSecundario(state,mazo).length} / ${m.habilitadasIds?.length??m.cartas.length} · Ciclo ${m.cycle} · ${m.modo==='con-reposicion'?'Con reposición':'Sin reposición'}`:'Disponible al iniciar una nueva partida';
 }
 f.elements.dailyHabilitado.checked=Boolean(state.proximaConfig.dailyHabilitado);
 f.elements.modoDaily.value=state.proximaConfig.modoDaily??'sin-reposicion';
 f.elements.modoAparicionAdicional.value=state.proximaConfig.modoAparicionAdicional??'minimalista';
 iniciarEspecialUI(state.proximaConfig);
 cargarRevelacionUI(state.proximaConfig,state.accionesPredeterminadas);
 $('daily-elegibles').replaceChildren();$('daily-elegibles').dataset.firma='';
 f.elements.temaPuntaje.value=(state.proximaConfig.ocultarPuntaje??state.config.ocultarPuntaje??false)?'oculto':state.proximaConfig.temaPuntaje??state.config.temaPuntaje??'kang';
 for(const nivel of NIVELES_ADRENALINA){const p=parametrosDailyFormulario(state.proximaConfig,nivel);f.elements[`dailyBase-${nivel}`].value=p.base;f.elements[`dailyIncremento-${nivel}`].value=p.incremento;}
 f.elements.dailyIncrementoPor.value=state.proximaConfig.dailyIncrementoPor??'tanda';
 document.querySelector('[name="filtro-contenido"][value="zombies"]').checked=true;
 renderContenido();updateSettings();firmaConfiguracionInicial=firmaContenido(draftConfig());openDialog('settings-dialog');
}
function draftConfig(){
 const f=$('settings-form'),valor=n=>f.elements[n].value===''?NaN:Number(f.elements[n].value);
 const dailyPorNivel=Object.fromEntries(NIVELES_ADRENALINA.map(nivel=>[nivel,{base:valor(`dailyBase-${nivel}`),incremento:valor(`dailyIncremento-${nivel}`)}]));
 const limitesPorAdrenalina=Object.fromEntries(FAMILIAS_LIMITES.map(mazo=>[mazo,Object.fromEntries(NIVELES_ADRENALINA.map(nivel=>[nivel,valor(`limite-${mazo}-${nivel}`)]))]));
 return normalizarConfig({...borradorContenido,revelacionEnemigos:leerRevelacionUI(),dailyElegibles:leerElegiblesDailyUI(borradorContenido),spawnEspecial:leerEspecialUI(borradorContenido),easy:f.elements.easy.checked,normal:f.elements.normal.checked,threshold:Number(f.elements.threshold.value),modoAbominaciones:f.elements.modoAbominaciones.value,modoNigromantes:f.elements.modoNigromantes.value,reglaNigromantes:f.elements.reglaNigromantes.value,reglaAbominaciones:f.elements.reglaAbominaciones.value,abominacionEstandarId:f.elements.abominacionEstandarId.value,dailyHabilitado:f.elements.dailyHabilitado.checked,modoDaily:f.elements.modoDaily.value,modoAparicionAdicional:f.elements.modoAparicionAdicional.value,temaPuntaje:f.elements.temaPuntaje.value==='oculto'?(state.proximaConfig.temaPuntaje??state.config.temaPuntaje??'kang'):f.elements.temaPuntaje.value,ocultarPuntaje:f.elements.temaPuntaje.value==='oculto',dailyPorNivel,dailyIncrementoPor:f.elements.dailyIncrementoPor.value,limitesPorAdrenalina});
}
function actualizarAbominacionEstandar(){
 const selector=$('abominacion-estandar'),actual=selector.value||borradorContenido.abominacionEstandarId;
 const cartas=visiblesContenido(borradorContenido,'abominaciones').filter(c=>borradorContenido.selectedAbominacionesIds.includes(c.id)&&!datos.enemigos.enemigos.find(a=>a.id===c.id)?.trofeo);
 if(!cartas.length)cartas.push({id:'enemigo-abominacion-kan',nombre:'Abominación kan'});
 selector.innerHTML=cartas.map(c=>`<option value="${esc(c.id)}">${esc(c.nombre)}</option>`).join('');
 selector.value=cartas.some(c=>c.id===actual)?actual:cartas.find(c=>c.id==='enemigo-abominacion-kan')?.id??cartas[0]?.id??'';
}
function actualizarResumenCajas(){
 const config=draftConfig();
 for(const input of $('content-selector').querySelectorAll('[name="caja-contenido"]')){
  const r=resumenCaja(config,filtroContenido,input.value);input.checked=r.completa;input.indeterminate=r.parcial;input.disabled=!r.editable;
  input.setAttribute('aria-checked',r.parcial?'mixed':String(r.completa));
  $('content-selector').querySelector(`[data-caja-cuenta="${input.value}"]`).textContent=`${r.marcadas} / ${r.total}`;
 }
}
function renderContenido(conservarAbiertos=false){
 const abiertos=conservarAbiertos?[...$('content-selector').querySelectorAll('details[open][data-caja]')].map(d=>d.dataset.caja):[];
 $('collection-selector').innerHTML=selectorColeccion(borradorContenido);
 $('content-selector').innerHTML=selectorContenido(draftConfig(),filtroContenido);
 for(const d of $('content-selector').querySelectorAll('details[data-caja]'))d.open=abiertos.includes(d.dataset.caja);
 actualizarResumenCajas();
 const editable=visiblesContenido(borradorContenido,filtroContenido).some(c=>c.operativa&&!c.obligatoria);
 for(const b of document.querySelectorAll('[data-action="marcar-contenido"]'))b.disabled=!editable;
}
function updateSettings(){
 const config=draftConfig(),errores=erroresContenido(config),f=$('settings-form');
 actualizarEspecialUI(config);
 $('threshold-label').textContent=`${config.threshold}%`;
 $('settings-summary').textContent=`Mazo general: ${total(componer(config))} cartas · Abominaciones: ${idsSecundarios(config,'abominaciones').length} · Nigromantes: ${idsSecundarios(config,'nigromantes').length} · Daily Spawn: ${config.dailyHabilitado?idsSecundarios(config,'daily').length:0}`;
 $('settings-errors').textContent=errores.join(' ');$('settings-errors').hidden=!errores.length;
 $('save-settings').disabled=storageBlocked||errores.length>0;$('new-game').disabled=storageBlocked||errores.length>0;
 $('abominacion-estandar-label').hidden=config.reglaAbominaciones!=='estandar';f.elements.abominacionEstandarId.disabled=config.reglaAbominaciones!=='estandar';
 const personalizado={nigromantes:config.reglaNigromantes==='personalizado',abominaciones:config.reglaAbominaciones==='personalizado'};
 for(const mazo of ['nigromantes','abominaciones']){
  $(`config-limites-${mazo}`).hidden=!personalizado[mazo];
  for(const nivel of NIVELES_ADRENALINA){const input=f.elements[`limite-${mazo}-${nivel}`];input.min=mazo==='nigromantes'?'0':'1';input.disabled=!personalizado[mazo];}
 }
 for(const input of document.querySelectorAll('.daily-settings input,.daily-settings select'))input.disabled=!config.dailyHabilitado||dailyIntegrado(config);
 $('daily-config').querySelector('.daily-settings').hidden=dailyIntegrado(config);
 actualizarConfiguracionUI(config);
}
function hayCambiosConfiguracion(){return $('settings-dialog').open&&firmaConfiguracionInicial!==null&&firmaContenido(draftConfig())!==firmaConfiguracionInicial;}
function guardarConfiguracion(){const config=draftConfig();if(commit(s=>programarConfiguracion(s,config))){firmaConfiguracionInicial=firmaContenido(config);toast('Configuración guardada. Modos y contenido se aplicarán a la próxima tanda.');closeDialog('settings-dialog',{forzar:true});}}
function confirmarSalidaConfiguracion(){
 showConfirm('¿Deseas salir sin guardar?','Hay cambios sin guardar en la configuración.',[{value:'salir',label:'Sí, salir'},{value:'volver',label:'No, volver'},{value:'guardar',label:'Guardar configuración',primary:true}],v=>{if(v==='salir')closeDialog('settings-dialog',{forzar:true});else if(v==='guardar')guardarConfiguracion();});
}
$('settings-dialog').addEventListener('cancel',e=>{e.preventDefault();closeDialog('settings-dialog');});
$('settings-dialog').addEventListener('close',()=>{if(!$('settings-dialog').open){borradorContenido=null;firmaConfiguracionInicial=null;}});
$('threshold').addEventListener('input',updateSettings);
 $('especial-config').addEventListener('input',e=>{if(e.target.matches('input'))updateSettings();});
for(const input of document.querySelectorAll('.daily-settings input'))input.addEventListener('input',updateSettings);
for(const input of document.querySelectorAll('.limit-settings input'))input.addEventListener('input',updateSettings);
$('content-selector').addEventListener('click',e=>{if(e.target.closest('[name="caja-contenido"]'))e.stopPropagation();});
$('settings-form').addEventListener('change',e=>{
 const input=e.target;
 if(input.name==='caja'){const ids=new Set(borradorContenido.coleccionIds);if(input.checked)ids.add(input.value);else ids.delete(input.value);borradorContenido=normalizarConfig({...borradorContenido,coleccionIds:[...ids]});renderContenido();}
 if(input.name==='carta'){borradorContenido=seleccionarContenido(draftConfig(),filtroContenido,[input.value],input.checked);actualizarResumenCajas();}
 if(input.name==='caja-contenido'){borradorContenido=marcarCaja(draftConfig(),filtroContenido,input.value,input.checked);renderContenido(true);actualizarAbominacionEstandar();}
 if(input.name==='filtro-contenido'){filtroContenido=input.value;renderContenido();}
 if(input.name==='carta'||input.name==='caja')actualizarAbominacionEstandar();updateSettings();
});
$('save-settings').addEventListener('click',guardarConfiguracion);
$('settings-form').addEventListener('input',e=>{if(e.target.name?.startsWith('revelacion-'))updateSettings();});
$('settings-form').addEventListener('submit',e=>{e.preventDefault();const config=draftConfig();showConfirm('¿Iniciar nueva partida?','Se borrarán el historial, los fijados, los desfijados y las zonas de nigromante de la partida actual.',[{value:'cancel',label:'Cancelar'},{value:'yes',label:'Iniciar partida',primary:true}],v=>{if(v!=='yes')return;const zones=state.normal;if(commit(s=>{const nueva=newGame(config,zones,0);for(const k of Object.keys(s))delete s[k];Object.assign(s,nueva);},{recover:true})){for(const d of document.querySelectorAll('dialog[open]'))d.close();visibleBatch=null;toast('Nueva partida lista.');}});});
function revealBatch(){if(state.normal+state.necro===0)throw new Error('No hay zonas de aparición.');const previousCycle=state.cycle;if(!commit(s=>{adoptarLimites(s);const config=s.configuracionPendiente?s.proximaConfig:s.config;if(!config.revelacionEnemigos?.nigromantes||!config.revelacionEnemigos?.abominaciones)programarConfiguracion(s,configuracionRevelacionActual(config,s.accionesPredeterminadas));spawn(s);},{procedural:true}))throw new Error($('toast').textContent||'No se pudo guardar la tanda.');showBatch();if(state.cycle>previousCycle)toast('El mazo se ha reiniciado.');return state.history.at(-1);}
function confirmarAnulacion(){
 const numero=visibleBatch,guardado=guardadoObservado;
 if(!puedeAnularTanda(state,numero))return;
 showConfirm('¿Anular esta tanda?',`Se eliminará la tanda ${numero} y se restaurarán los mazos, fijados, desfijados y contadores anteriores a SPAWN.`,[{value:'cancel',label:'Cancelar'},{value:'yes',label:'Anular tanda',primary:true}],v=>{
  if(v!=='yes')return;
  if(guardadoObservado!==guardado){toast('La partida cambió. Revisa la tanda antes de anularla.');return;}
  if(commit(s=>anularTanda(s,numero))){closeDialog('batch-dialog');visibleBatch=null;toast('Tanda anulada. Ajusta las zonas antes de revelar otra.');}
 });
 anulacionPendiente=true;
}
$('spawn').addEventListener('click',()=>{try{revealBatch();}catch(e){toast(e.message);}});

document.addEventListener('click',e=>{
 const b=e.target.closest('button[data-action]');if(!b)return;
 if(b.dataset.action==='ver-en-juego'){zoomEnJuego=100;openDialog('inplay-dialog');renderEnJuego();$('inplay-gallery').scrollTo(0,0);return;}
 if(b.dataset.action==='zoom-en-juego'){zoomEnJuego=Math.max(25,Math.min(200,zoomEnJuego+Number(b.dataset.delta)));$('inplay-percent').textContent=zoomEnJuego+'%';for(const boton of document.querySelectorAll('[data-action="zoom-en-juego"]'))boton.disabled=Number(boton.dataset.delta)<0?zoomEnJuego<=25:zoomEnJuego>=200;distribuirEnJuego();return;}
 if(b.dataset.action==='zombis'){for(const f of filasAjuste)f.querySelector('input').value='0';renderContadorZombis();openDialog('zombies-dialog');return;}
 if(b.dataset.action==='zombis-ajuste'){const campo=b.closest('form').querySelector('input'),actual=Number(campo.value);campo.value=String((Number.isSafeInteger(actual)?actual:0)+Number(b.dataset.delta));actualizarCantidadZombis();return;}
 if(b.dataset.action==='adrenalina'){if(!document.querySelector('dialog[open]'))commit(s=>cambiarNivelAdrenalina(s,Number(b.dataset.delta)));return;}
 if(b.dataset.action==='alternar-desfijados'){mostrarDesfijados=!mostrarDesfijados;renderFijados();return;}
 if(b.dataset.action==='anular-tanda'){confirmarAnulacion();return;}
 if(b.dataset.action==='marcar-contenido'){borradorContenido=marcarContenido(draftConfig(),filtroContenido,b.dataset.value==='si');renderContenido();actualizarAbominacionEstandar();updateSettings();return;}
 if(b.dataset.action==='elegir-abominacion')commit(s=>elegirAbominacion(s,Number(b.dataset.uid),b.dataset.value),{animar:true});
 if(b.dataset.action==='regenerar-abominacion')commit(s=>regenerarAbominacion(s,Number(b.dataset.uid)),{animar:true});
 if(b.dataset.action==='elegir-nigromante')commit(s=>elegirNigromante(s,Number(b.dataset.uid),b.dataset.value),{animar:true});
 if(b.dataset.action==='regenerar-nigromante')commit(s=>regenerarNigromante(s,Number(b.dataset.uid)),{animar:true});
 if(b.dataset.action==='regenerar-especial')commit(s=>regenerarEspecial(s,Number(b.dataset.uid)),{animar:true});
 if(b.dataset.action==='regenerar-daily')commit(s=>regenerarDaily(s,Number(b.dataset.uid)),{animar:true});
});
document.addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(!b)return;const d=b.dataset;switch(d.action){case'info':informacionCarta(d.id);break;case'counter':commit(s=>s[d.kind]=Math.max(0,s[d.kind]+Number(d.delta)));break;case'settings':settings();break;case'history':renderHistory();openDialog('history-dialog');break;case'reopen':showBatch();break;case'close':closeDialog(d.target);break;case'zoom':zoom(Number(d.uid));break;case'pin':{const uid=Number(d.uid);if(isPinned(uid))unpin(uid);else{const c=entry(uid);if(c&&commit(s=>pinCard(s,c)))toast('Carta fijada.');}break;}case'unpin':unpin(Number(d.uid));break;case'add-zone':{const cycle=state.cycle;if(commit(s=>addZoneCard(s,visibleBatch,d.kind)))toast(state.cycle>cycle?'Zona añadida. El mazo se ha reiniciado.':'Zona y carta añadidas a la tanda.');break;}case'discard':if(commit(s=>discardCard(s,Number(d.batch),d.slot)))toast('Carta descartada sin robar otra.');break;case'replace':{const cycle=state.cycle;if(commit(s=>replaceCard(s,Number(d.batch),d.slot)))toast(state.cycle>cycle?'Carta reemplazada. El mazo se ha reiniciado.':'Carta descartada y reemplazada.');break;}case'confirm':{const action=confirmAction;confirmAction=null;closeDialog('confirm-dialog');action?.(d.value);break;}}});
$('batch-dialog').addEventListener('close',()=>{terminarVolteos();if(state.openBatch&&!commit(s=>s.openBatch=false)){renderBatch();openDialog('batch-dialog');}});
$('confirm-dialog').addEventListener('cancel',()=>{confirmAction=null;});
$('confirm-dialog').addEventListener('close',()=>{anulacionPendiente=false;});
window.addEventListener('storage',e=>{if(e.key===KEY&&anulacionPendiente){confirmAction=null;closeDialog('confirm-dialog');anulacionPendiente=false;}});
window.addEventListener('storage',e=>{if(e.key!==KEY)return;terminarVolteos();guardadoObservado=e.newValue;try{if(!e.newValue)throw new Error('Guardado eliminado');let incoming=JSON.parse(e.newValue);if(!isValid(incoming))throw new Error('Guardado inválido');if(incoming.revisionReglas!==REVISION_REGLAS){incoming=guardarAccion(incoming,s=>actualizarPartidaDePrueba(s),localStorage,{esperado:e.newValue});guardadoObservado=JSON.stringify(incoming);}state=incoming;storageBlocked=false;$('status-alert').hidden=true;render();if(state.openBatch)showBatch();else closeDialog('batch-dialog');toast('Partida actualizada desde otra pestaña.');}catch{storageBlocked=true;$('status-alert').hidden=false;$('status-alert').textContent='El guardado cambió y no pudo recuperarse. El progreso anterior sigue visible.';render();}});
const observadorEnJuego=new ResizeObserver(distribuirEnJuego);observadorEnJuego.observe($('inplay-gallery'));
iniciarInformacion();render();if(state.openBatch&&state.history.length)showBatch();
prepararOffline($('offline-status'),{puedeActualizar:()=>!storageBlocked&&!document.querySelector('dialog[open]')});

// Optional browser agent interface uses the same actions and local state as the UI.
if(document.modelContext?.registerTool){
 const lifetime=new AbortController();
 const validateEmpty=input=>{if(!input||typeof input!=='object'||Array.isArray(input)||Object.keys(input).length)throw new Error('Se requiere un objeto vacío.');};
 const summary=()=>({normalZones:state.normal,necromancerZones:state.necro,remaining:total(state.remaining),initial:total(state.initial),cycle:state.cycle,batches:state.history.length,pinnedCards:state.pins.map(c=>catalog[c.cardId].name)});
 const definitions=[
  {name:'read_game_state',title:'Consultar partida',description:'Consulta contadores, mazo, tandas y cartas fijadas de la partida local actual.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true,untrustedContentHint:false},execute(input){validateEmpty(input);return summary();}},
  {name:'reveal_spawn_batch',title:'Revelar tanda',description:'Consume una carta por zona, guarda la tanda en el historial local y abre sus cartas, igual que SPAWN.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:false,untrustedContentHint:false},execute(input){validateEmpty(input);const batch=revealBatch();return {batch:batch.number,cards:batch.slots.map(slot=>({zone:slot.zone,name:catalog[slot.draws.at(-1).cardId].name})),...summary()};}}
 ];
 for(const definition of definitions){try{Promise.resolve(document.modelContext.registerTool(definition,{signal:lifetime.signal})).catch(()=>{});}catch{}}
 window.addEventListener('pagehide',event=>{if(!event.persisted)lifetime.abort();},{once:true});
}
