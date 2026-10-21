// Presentación común sin reconstruir controles ni cambiar sus valores.
let secuencia=0;
export function compactarConfiguracion(raiz){
 for(const label of raiz.querySelectorAll('label')){
  if(!label.querySelector(':scope>select,:scope>input[type="number"]'))continue;
  label.classList.add('config-control');
  for(const nodo of [...label.childNodes])if(nodo.nodeType===3&&nodo.textContent.trim()){
   const texto=document.createElement('span');texto.className='config-etiqueta';texto.textContent=nodo.textContent.trim();nodo.replaceWith(texto);
  }
 }
 for(const detalle of [...raiz.querySelectorAll('details.config-help')]){
  const titulo=detalle.querySelector('summary').textContent;
  detalle.querySelector('summary').remove();crearAyuda(detalle,titulo,[...detalle.childNodes]);
 }
 const excluidos='#settings-summary,#settings-errors,#actualizacion-estado,#pantalla-estado,#proteccion-estado,#nigromantes-status,#abominaciones-status,#especial-composicion';
 for(const nota of [...raiz.querySelectorAll('.field-note')]){
  if(nota.matches(excluidos)||nota.closest('.config-ayuda,.config-new-game,#content-selector,#collection-selector,#especial-cartas')||nota.tagName==='SMALL')continue;
  const label=nota.closest('label'),contenedor=nota.parentElement;
  const titulo=label?.querySelector('.config-etiqueta')?.textContent||contenedor.querySelector(':scope>legend,:scope>h3')?.textContent||'Información';
  crearAyuda(nota,titulo,[nota]);
 }
 for(const ayuda of raiz.querySelectorAll('.config-ayuda')){
  const nota=ayuda.querySelector('.config-globo>.field-note:only-child');if(nota)ayuda.hidden=nota.hidden;
 }
}
function crearAyuda(referencia,titulo,nodos){
 const ayuda=document.createElement('span'),boton=document.createElement('button'),globo=document.createElement('span');
 ayuda.className='config-ayuda';boton.type='button';boton.className='config-info';boton.textContent='ⓘ';boton.setAttribute('aria-label',`Información: ${titulo}`);boton.setAttribute('aria-expanded','false');
 globo.id=`config-ayuda-${++secuencia}`;globo.className='config-globo';globo.hidden=true;globo.setAttribute('role','note');boton.setAttribute('aria-controls',globo.id);
 const anterior=referencia.previousElementSibling;
 referencia.before(ayuda);ayuda.append(boton,globo);globo.append(...nodos);
 // Acercar las explicaciones al control correspondiente, sin mover avisos de estado.
 if(anterior?.matches('label,h3'))anterior.append(ayuda);
 else if(anterior?.matches('.enemy-mode-row,.daily-options-row'))anterior.querySelector('label:last-child')?.append(ayuda);
 else if(anterior?.tagName==='TABLE')anterior.querySelector('caption:not(.visually-hidden)')?.append(ayuda);
 if(referencia.tagName==='DETAILS')referencia.remove();
 boton.addEventListener('click',e=>{
  e.preventDefault();const abrir=globo.hidden;cerrarAyudas(ayuda.closest('dialog'));globo.hidden=!abrir;boton.setAttribute('aria-expanded',String(abrir));
  if(abrir){
   const zona=ayuda.closest('.config-panels').getBoundingClientRect(),ancla=ayuda.getBoundingClientRect(),arriba=ancla.top-zona.top,abajo=zona.bottom-ancla.bottom;
   globo.style.top=abajo>=arriba?'100%':'auto';globo.style.bottom=abajo>=arriba?'auto':'100%';globo.style.maxHeight=`${Math.min(220,Math.max(80,Math.max(arriba,abajo)-12))}px`;
   globo.style.left='0px';const r=globo.getBoundingClientRect(),limites=ayuda.closest('dialog').getBoundingClientRect();
   globo.style.left=`${Math.min(0,limites.right-12-r.right)+Math.max(0,limites.left+12-r.left)}px`;
  }
 });
}
function cerrarAyudas(raiz){
 for(const globo of raiz.querySelectorAll('.config-globo')){globo.hidden=true;globo.previousElementSibling.setAttribute('aria-expanded','false');}
}
export function iniciarAyudasConfiguracion(dialog){
 dialog.addEventListener('click',e=>{if(!e.target.closest('.config-ayuda'))cerrarAyudas(dialog);});
 dialog.addEventListener('keydown',e=>{if(e.key==='Escape'&&dialog.querySelector('.config-globo:not([hidden])')){e.preventDefault();e.stopImmediatePropagation();const boton=dialog.querySelector('.config-info[aria-expanded="true"]');cerrarAyudas(dialog);boton?.focus();}},true);
 dialog.addEventListener('close',()=>cerrarAyudas(dialog));
 dialog.querySelector('#config-tabs').addEventListener('click',()=>cerrarAyudas(dialog));
}
