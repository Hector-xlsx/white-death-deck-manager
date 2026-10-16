import {fichaZombiHTML} from './fichas-zombis.js';
import {CATALOG,datos,escapar as esc,rutaRecurso,referenciasPorCarta,enColeccion,dificultadVisible} from './catalogo.js';
import {visiblesContenido,campoFiltro,resumenCaja} from './contenido.js';
const $=id=>document.getElementById(id);
const ordenAlfabetico=new Intl.Collator('es',{sensitivity:'base',numeric:true});
const tipos={nigromante:'Nigromantes',abominacion:'Abominaciones',asedio:'Asedio',brutos:'Brutos',caminantes:'Caminantes',corredores:'Corredores',trepadores:'Trepadores','caminantes-terrorcota':'Caminantes de terrorcota','caminantes-ballesteros':'Caminantes ballesteros'};
const entradas=new Map([
 ...datos.base.cartas.map(c=>[c.id,c]),
 ...datos.daily.cartas.map(c=>[c.id,c]),
 ...datos.enemigos.enemigos.map(c=>[c.id,c]),
 ...datos.expansiones.cartas.map(c=>[c.id,c]),
 ...datos.referencias.referencias.map(c=>[c.id,c])
]);
export function selectorColeccion(config){
 return datos.coleccion.cajas.map(c=>`<label class="check-row"><input type="checkbox" name="caja" value="${esc(c.id)}" ${config.coleccionIds.includes(c.id)?'checked':''} ${c.obligatoria?'disabled':''}><span>${esc(c.nombre)}</span>${c.obligatoria?'<small>Obligatoria</small>':''}</label>`).join('');
}
export function selectorContenido(config,filtro='zombies'){
 const campo=campoFiltro(filtro),ids=new Set(config[campo]),fichas=visiblesContenido(config,filtro);
 function fila(c){
  if(!c.operativa)return `<div class="content-row"><span class="content-name">${esc(c.nombre)}:</span><span class="content-controls"><small>Pendiente de implementación</small><input type="checkbox" disabled aria-label="${esc(c.nombre)}: pendiente de implementación"><button type="button" data-action="consulta-recurso" data-id="${esc(c.id)}" aria-label="Consultar ${esc(c.nombre)}" title="Consultar carta">ⓘ</button></span></div>`;
  return `<div class="content-row"><label class="content-name" for="contenido-${esc(c.id)}">${esc(c.nombre)}:</label><span class="content-controls">${c.obligatoria?'<small>Obligatoria</small>':''}<strong>${c.copias}</strong><input id="contenido-${esc(c.id)}" type="checkbox" name="carta" data-campo="${campo}" value="${esc(c.id)}" ${c.obligatoria||ids.has(c.id)?'checked':''} ${c.obligatoria?'disabled':''}><button type="button" data-action="consulta-recurso" data-id="${esc(c.id)}" aria-label="Consultar ${esc(c.nombre)}" title="Ver carta">ⓘ</button></span></div>`;
 }
 function filaTipo(tipo,cartas){
  const operativas=cartas.filter(c=>c.operativa),pendientes=cartas.filter(c=>!c.operativa);
  const opciones=operativas.sort((a,b)=>['Fácil','Normal'].indexOf(a.dificultad)-['Fácil','Normal'].indexOf(b.dificultad)).map(c=>`<label class="zombie-option"><span>${esc(dificultadVisible(c.dificultad))}</span><strong>${c.copias}</strong><input type="checkbox" name="carta" data-campo="${campo}" value="${esc(c.id)}" aria-label="${esc(c.nombre)} · ${esc(dificultadVisible(c.dificultad))} · ${c.copias} cartas" ${ids.has(c.id)?'checked':''}></label><button type="button" data-action="consulta-recurso" data-id="${esc(c.id)}" aria-label="Consultar ${esc(c.nombre)}" title="Ver carta">ⓘ</button>`).join('');
  const filaCompacta=opciones?`<div class="content-row zombie-row" role="group" aria-label="${esc(tipos[tipo]||tipo)}"><span class="zombie-type">${esc(tipos[tipo]||tipo)}:</span><div class="zombie-options">${opciones}</div></div>`:'';
  return filaCompacta+pendientes.map(fila).join('');
 }
 const grupos=datos.coleccion.cajas.map(caja=>{
  const cartas=fichas.filter(c=>c.cajaId===caja.id).sort((a,b)=>ordenAlfabetico.compare(a.nombre,b.nombre));if(!cartas.length)return '';
  const contenido=filtro==='zombies'?[...new Set(cartas.map(c=>c.tipo))].sort((a,b)=>ordenAlfabetico.compare(tipos[a]||a,tipos[b]||b)).map(tipo=>filaTipo(tipo,cartas.filter(c=>c.tipo===tipo))).join(''):cartas.map(fila).join('');
  const r=resumenCaja(config,filtro,caja.id);
  return `<details data-caja="${esc(caja.id)}"><summary><span>${esc(caja.nombre)}</span><span class="box-selection"><small data-caja-cuenta="${esc(caja.id)}">${r.marcadas} / ${r.total}</small><input type="checkbox" name="caja-contenido" value="${esc(caja.id)}" aria-label="Seleccionar todo ${esc(caja.nombre)}" ${r.completa?'checked':''} ${r.editable?'':'disabled'}></span></summary>${contenido}</details>`;
 }).join('');
 const ayudas=datos.referencias.referencias.filter(c=>!datos.coleccion.cartas.some(a=>a.id===c.id)||enColeccion(c.id,config)).sort((a,b)=>ordenAlfabetico.compare(a.titulo_sugerido,b.titulo_sugerido));
 return `${grupos||'<p class="field-note">No hay cartas de este tipo en las cajas habilitadas.</p>'}${filtro==='otros'?`<details><summary>Ayudas de reglas · ${ayudas.length}</summary>${ayudas.map(c=>`<div class="content-row"><span class="content-name">${esc(c.titulo_sugerido)}:</span><span class="content-controls"><small>${c.en_espera?'Apoyo de supervivientes · En espera':'Vínculos pendientes'}</small><button type="button" data-action="consulta-recurso" data-id="${esc(c.id)}" aria-label="Consultar ${esc(c.titulo_sugerido)}" title="Consultar referencia">ⓘ</button></span></div>`).join('')}</details>`:''}`;
}
function recursosFicha(c){
 const recursos=[];
 if(c.imagen_es)recursos.push({ruta:c.imagen_es,titulo:'Traducción al español · Por revisar'});
 const original=c.imagen_original||c.imagen;
 if(original)recursos.push({ruta:original,titulo:'Original suministrado'});
 for(const ruta of c.variantes_por_revisar||[])recursos.push({ruta,titulo:'Variante por revisar'});
 return recursos;
}
function mostrar(titulo,referencias){
 $('info-title').textContent=titulo;
 $('info-content').innerHTML=referencias.map(c=>`<section class="referencia"><h3>${esc(c.titulo_sugerido||c.nombre||c.nombre_sugerido)}</h3>${c.pendientes?`<p class="field-note">${c.pendientes.map(esc).join(' · ')}</p>`:''}<div class="referencias-imagenes">${recursosFicha(c).map(r=>`<button type="button" data-action="ampliar-recurso" data-ruta="${esc(r.ruta)}" data-titulo="${esc(r.titulo)}"><img src="${rutaRecurso(r.ruta)}" alt="${esc(c.titulo_sugerido||c.nombre||c.nombre_sugerido)} · ${esc(r.titulo)}" loading="lazy"><span>${esc(r.titulo)}</span></button>`).join('')}</div></section>`).join('');
 const tipo=CATALOG.find(f=>f.id===referencias[0]?.id)?.tipo??referencias[0]?.tipo_zombi_sugerido??referencias[0]?.tipo_zombi;
 $('info-content').insertAdjacentHTML('beforeend',fichaZombiHTML(tipo,referencias[0]));
 if(!$('info-dialog').open)$('info-dialog').showModal();
}
export function informacionCarta(id){
 const refs=referenciasPorCarta(id);if(!refs.length)return;
 mostrar(CATALOG.find(c=>c.id===id)?.name||id,refs);
}
export function iniciarInformacion(){
 document.addEventListener('click',e=>{
  const b=e.target.closest('button[data-action]');if(!b)return;
  if(b.dataset.action==='consulta-recurso'){
   const c=entradas.get(b.dataset.id);if(c)mostrar(c.nombre||c.nombre_sugerido||c.titulo_sugerido,[c]);
  }
  if(b.dataset.action==='ampliar-recurso'){
   $('resource-title').textContent=b.dataset.titulo;
   $('resource-image').src=rutaRecurso(b.dataset.ruta);$('resource-image').alt=b.dataset.titulo;
   if(!$('resource-dialog').open)$('resource-dialog').showModal();
  }
 });
}
