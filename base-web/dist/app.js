import {CATALOG,newGame,spawn,replaceCard,discardCard,addZoneCard,pinCard,unpinCard,total,isValid} from './engine.js';
const KEY='white-death-mvp-v1';
const $=id=>document.getElementById(id);
const catalog=Object.fromEntries(CATALOG.map(c=>[c.id,c]));
let state=newGame(),storageBlocked=false;
try{const saved=localStorage.getItem(KEY);if(saved){const parsed=JSON.parse(saved);if(!isValid(parsed))throw new Error('Datos inválidos');state={...parsed,unpinned:parsed.unpinned||[]};}}
catch(e){storageBlocked=true;$('status-alert').hidden=false;$('status-alert').textContent='No se pudo recuperar la partida guardada. Inicia una nueva partida desde Configuración para continuar.';}
let toastTimer,confirmAction,visibleBatch=null,zoomUid=null;
function toast(text){$('toast').textContent=text;$('toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').classList.remove('visible'),2800);}
function commit(fn,{recover=false}={}){
 if(storageBlocked&&!recover){toast('Inicia una nueva partida desde Configuración para continuar.');return false;}
 const next=structuredClone(state);
 try{fn(next);localStorage.setItem(KEY,JSON.stringify(next));state=next;storageBlocked=false;$('status-alert').hidden=true;$('save-status').textContent='Guardado local';render();return true;}
 catch(e){$('save-status').textContent='No se pudo guardar';toast('No se pudo guardar el cambio. Libera espacio o habilita el almacenamiento y vuelve a intentar.');return false;}
}
function openDialog(id){if(!$(id).open)$(id).showModal();}
function closeDialog(id){$(id).close();}
function entry(uid){for(const b of state.history)for(const slot of b.slots){const c=slot.draws.find(c=>c.uid===uid);if(c)return c;}return state.pins.find(c=>c.uid===uid)||state.unpinned.find(c=>c.uid===uid);}
function isPinned(uid){return state.pins.some(c=>c.uid===uid);}
function showConfirm(title,message,buttons,fn){$('confirm-title').textContent=title;$('confirm-message').textContent=message;$('confirm-actions').innerHTML=buttons.map(b=>`<button data-action="confirm" data-value="${b.value}" class="${b.primary?'primary':''}">${b.label}</button>`).join('');confirmAction=fn;openDialog('confirm-dialog');}
const pinIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m8 3 8 0-1 6 4 4v2H5v-2l4-4-1-6ZM12 15v6"/></svg>';
const refreshIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4v6h-6M4 20v-6h6M4 10a8 8 0 0 1 13-5l3 5M20 14a8 8 0 0 1-13 5l-3-5"/></svg>';
const trashIcon='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7M14 10v7"/></svg>';
function pinButton(c){const pinned=isPinned(c.uid),label=`${pinned?'Desfijar':'Fijar'} ${catalog[c.cardId].name}`;return `<button data-action="pin" data-uid="${c.uid}" class="${pinned?'active':''}" aria-label="${label}" title="${label}" aria-pressed="${pinned}">${pinIcon}</button>`;}
function cardHTML(c,zone='',actions=false,batch=0,slot=0,necro=false){
 const card=catalog[c.cardId];
 const controls=actions?`<div class="card-actions">${pinButton(c)}${actions==='batch'?`<button data-action="replace" data-batch="${batch}" data-slot="${slot}" aria-label="Descartar ${card.name} y robar otra" title="Descartar y robar otra">${refreshIcon}</button><button data-action="discard" data-batch="${batch}" data-slot="${slot}" class="discard-button" aria-label="Descartar ${card.name} sin robar otra" title="Descartar sin robar otra" ${c.discarded?'disabled':''}>${trashIcon}</button>`:''}</div>`:'';
 return `<article class="draw-card ${c.discarded?'discarded':''}"><span class="zone-label ${necro?'necro-zone':''}">${zone}</span><button class="card-image" data-action="zoom" data-uid="${c.uid}" aria-label="Ampliar ${card.name}"><img src="./assets/${card.image}" alt="${card.name}" loading="lazy">${c.discarded?'<span class="discard-cross" aria-hidden="true">×</span>':''}</button>${controls}<p class="card-label">${card.name}</p>${c.discarded?'<p class="discard-tag">Descartada · Sin efecto</p>':''}</article>`;
}
function savedCardHTML(reference,archived=false){const c=entry(reference.uid)||reference,card=catalog[c.cardId];return `<div class="pinned-card ${archived?'archived-card':''}"><button class="image-button" data-action="zoom" data-uid="${c.uid}" aria-label="Ampliar ${card.name}"><img src="./assets/${card.image}" alt="${card.name}" loading="lazy"></button><button class="unpin ${archived?'repin':''}" data-action="${archived?'pin':'unpin'}" data-uid="${c.uid}" title="${archived?'Volver a fijar':'Desfijar'} ${card.name}" aria-label="${archived?'Volver a fijar':'Desfijar'} ${card.name}">${archived?pinIcon:'×'}</button><small>${card.name}</small></div>`;}

function render(){
 const size=total(state.initial),left=total(state.remaining),count=state.normal+state.necro;
 $('normal-count').textContent=state.normal;$('necro-count').textContent=`+${state.necro}`;
 $('spawn-label').textContent=`Revelar ${count} ${count===1?'carta':'cartas'}`;$('spawn').disabled=!count||storageBlocked;
 document.querySelectorAll('[data-action="counter"][data-delta="-1"]').forEach(b=>b.disabled=state[b.dataset.kind]===0);
 $('deck-count').textContent=`${left} / ${size}`;$('deck-progress').style.width=`${left/size*100}%`;
 $('deck-meta').textContent=`Ciclo ${state.cycle} · ${state.config.threshold===0?'Reinicio al agotar el mazo':`Reinicio bajo el ${state.config.threshold}%`}`;
 $('history-count').textContent=state.history.length;$('pin-count').textContent=state.pins.length;
 const batch=state.history.at(-1);$('reopen').hidden=!batch;
 $('last-preview').innerHTML=batch?`<div class="last-strip">${batch.slots.map(slot=>{const c=slot.draws.at(-1),card=catalog[c.cardId];return `<div class="last-mini ${c.discarded?'discarded':''}"><button data-action="zoom" data-uid="${c.uid}" aria-label="Ampliar ${card.name}"><img src="./assets/${card.image}" alt="${card.name}">${c.discarded?'<span class="discard-cross" aria-hidden="true">×</span>':''}</button><small>${slot.zone}</small></div>`;}).join('')}</div><small>Tanda ${batch.number} · ${batch.slots.length} cartas</small>`:'<div class="empty-state"><strong>El mazo está listo.</strong><p>Pulsa SPAWN para revelar una carta por zona.</p></div>';
 $('pins').innerHTML=state.pins.length||state.unpinned.length?`${state.pins.map(c=>savedCardHTML(c)).join('')}${state.unpinned.length?`<div class="unpinned-divider"><span>Desfijados</span><small>${state.unpinned.length}</small></div>${state.unpinned.map(c=>savedCardHTML(c,true)).join('')}`:''}`:'<div class="empty-state"><p>Fija una carta durante una aparición para tenerla aquí.</p></div>';
 if($('batch-dialog').open)renderBatch();if($('history-dialog').open)renderHistory();
}
function renderBatch(){const b=state.history.find(b=>b.number===visibleBatch)||state.history.at(-1);if(!b)return;visibleBatch=b.number;$('batch-title').textContent=`Tanda ${b.number} · ${b.slots.length} cartas`;$('batch-grid').innerHTML=b.slots.map((slot,i)=>cardHTML(slot.draws.at(-1),slot.zone,'batch',b.number,i,slot.kind==='necro')).join('');}
function renderHistory(){$('history-list').innerHTML=state.history.length?[...state.history].reverse().map(b=>`<section class="history-group"><div class="history-heading"><h3>Tanda ${b.number}</h3><small>${new Date(b.date).toLocaleTimeString('es-CL',{hour:'2-digit',minute:'2-digit'})} · ${b.slots.length} zonas</small></div><div class="history-cards">${b.slots.flatMap(slot=>slot.draws.map(c=>cardHTML(c,slot.zone,'history',0,0,slot.kind==='necro'))).join('')}</div></section>`).join(''):'<div class="empty-state"><p>Las cartas aparecerán aquí después de la primera tanda.</p></div>';}
function showBatch(){visibleBatch=state.history.at(-1)?.number;if(!visibleBatch)return;renderBatch();openDialog('batch-dialog');if(!state.openBatch)commit(s=>s.openBatch=true);}
function zoom(uid){const c=entry(uid);if(!c)return;zoomUid=uid;const card=catalog[c.cardId];$('zoom-title').textContent=card.name;const colors=['#72b6ff','#f4db68','#f6a565','#f08080'];const names=['Azul','Amarillo','Naranja','Rojo'];$('zoom-content').innerHTML=`<div class="zoom-content"><img src="./assets/${card.image}" alt="${card.name}"><div><span class="eyebrow">${card.difficulty||'MAZO GENERAL'}</span>${card.levels?`<h3>Nivel de adrenalina</h3><div class="level-list">${card.levels.map((n,i)=>`<div class="level-row"><span class="level-name" style="--level:${colors[i]}">${names[i]}</span><strong>${n}</strong></div>`).join('')}</div><p class="zoom-note">${typeof card.levels[0]==='number'?'Cantidad de zombis que aparecen por nivel.':'Activa el tipo de zombi indicado, excepto en azul.'}</p>`:'<p class="zoom-note">Resuelve el efecto de esta carta en la mesa según las reglas de tu partida.</p>'}${c.discarded?'<p class="discard-tag">Descartada · Sin efecto</p>':''}<p class="field-note">Carta original</p></div></div>`;openDialog('zoom-dialog');}
function unpin(uid){const c=state.pins.find(c=>c.uid===uid);if(!c)return;
 const remove=(s,subtract=false)=>unpinCard(s,uid,subtract);
 if(c.cardId==='nigromante'&&state.necro>0)showConfirm('Desfijar nigromante','¿Deseas quitar un spawn de nigromante?',[{value:'yes',label:'Sí, quitar uno',primary:true},{value:'no',label:'No, mantener'},{value:'cancel',label:'Cancelar'}],v=>{if(v!=='cancel')commit(s=>remove(s,v==='yes'));});
 else commit(s=>remove(s));
}
function settings(){const f=$('settings-form');f.elements.easy.checked=state.config.easy;f.elements.normal.checked=state.config.normal;f.elements.threshold.value=state.config.threshold;updateSettings();openDialog('settings-dialog');}
function draftConfig(){const f=$('settings-form');return{easy:f.elements.easy.checked,normal:f.elements.normal.checked,threshold:Number(f.elements.threshold.value)};}
function updateSettings(){const config=draftConfig();$('threshold-label').textContent=`${config.threshold}%`;$('settings-summary').textContent=`Mazo de la nueva partida: ${total(newGame(config).initial)} cartas`;$('save-settings').disabled=storageBlocked;}
$('threshold').addEventListener('input',updateSettings);$('settings-form').addEventListener('change',updateSettings);
$('save-settings').addEventListener('click',()=>{const config=draftConfig();if(commit(s=>s.config.threshold=config.threshold)){toast('Umbral guardado. Los filtros se aplicarán en una nueva partida.');closeDialog('settings-dialog');}});
$('settings-form').addEventListener('submit',e=>{e.preventDefault();const config=draftConfig();showConfirm('¿Iniciar nueva partida?','Se borrarán el historial, los fijados, los desfijados y las zonas de nigromante de la partida actual.',[{value:'cancel',label:'Cancelar'},{value:'yes',label:'Iniciar partida',primary:true}],v=>{if(v!=='yes')return;const zones=state.normal;if(commit(s=>Object.assign(s,newGame(config,zones,0)),{recover:true})){for(const d of document.querySelectorAll('dialog[open]'))d.close();visibleBatch=null;toast('Nueva partida lista.');}});});
function revealBatch(){if(state.normal+state.necro===0)throw new Error('No hay zonas de aparición.');const previousCycle=state.cycle;if(!commit(s=>spawn(s)))throw new Error('No se pudo guardar la tanda.');showBatch();if(state.cycle>previousCycle)toast('El mazo se ha reiniciado.');return state.history.at(-1);}
$('spawn').addEventListener('click',()=>{try{revealBatch();}catch(e){toast(e.message);}});
document.addEventListener('click',e=>{const b=e.target.closest('button[data-action]');if(!b)return;const d=b.dataset;switch(d.action){case'counter':commit(s=>s[d.kind]=Math.max(0,s[d.kind]+Number(d.delta)));break;case'settings':settings();break;case'history':renderHistory();openDialog('history-dialog');break;case'reopen':showBatch();break;case'close':closeDialog(d.target);break;case'zoom':zoom(Number(d.uid));break;case'pin':{const uid=Number(d.uid);if(isPinned(uid))unpin(uid);else{const c=entry(uid);if(c&&commit(s=>pinCard(s,c)))toast('Carta fijada.');}break;}case'unpin':unpin(Number(d.uid));break;case'add-zone':{const cycle=state.cycle;if(commit(s=>addZoneCard(s,visibleBatch,d.kind)))toast(state.cycle>cycle?'Zona añadida. El mazo se ha reiniciado.':'Zona y carta añadidas a la tanda.');break;}case'discard':if(commit(s=>discardCard(s,Number(d.batch),Number(d.slot))))toast('Carta descartada sin robar otra.');break;case'replace':{const cycle=state.cycle;if(commit(s=>replaceCard(s,Number(d.batch),Number(d.slot))))toast(state.cycle>cycle?'Carta reemplazada. El mazo se ha reiniciado.':'Carta descartada y reemplazada.');break;}case'confirm':{const action=confirmAction;confirmAction=null;closeDialog('confirm-dialog');action?.(d.value);break;}}});
$('batch-dialog').addEventListener('close',()=>{if(state.openBatch)commit(s=>s.openBatch=false);});
window.addEventListener('storage',e=>{if(e.key!==KEY||!e.newValue)return;try{const incoming=JSON.parse(e.newValue);if(isValid(incoming)){state={...incoming,unpinned:incoming.unpinned||[]};render();toast('Partida actualizada desde otra pestaña.');}}catch{}});
render();if(state.openBatch&&state.history.length)showBatch();
if('serviceWorker' in navigator){navigator.serviceWorker.register('./sw.js').then(async reg=>{function status(){if(reg.active&&navigator.serviceWorker.controller)$('offline-status').textContent='Disponible offline en este dispositivo';else $('offline-status').textContent='Preparando uso offline…';}status();navigator.serviceWorker.addEventListener('controllerchange',status);reg.addEventListener('updatefound',()=>{const w=reg.installing;w?.addEventListener('statechange',status);});}).catch(()=>{$('offline-status').textContent='Uso offline no disponible en este navegador';});}else{$('offline-status').textContent='Uso offline no disponible en este navegador';}

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
