export function iniciarEscalaAparicion(notificar=()=>{}){
 let escala=100;
 const menos=document.getElementById('aparicion-alejar'),mas=document.getElementById('aparicion-acercar'),valor=document.getElementById('aparicion-escala'),grid=document.getElementById('batch-grid');
 const pintar=()=>{grid.style.setProperty('--escala-aparicion',escala/100);valor.textContent=escala+'%';menos.disabled=escala<=75;mas.disabled=escala>=125;};
 menos.addEventListener('click',()=>{escala=Math.max(75,escala-5);pintar();});
 mas.addEventListener('click',()=>{escala=Math.min(125,escala+5);pintar();});pintar();
 const vista=document.getElementById('aparicion-vista'),detalles=document.getElementById('aparicion-detalles'),dialogo=document.getElementById('batch-dialog');
 const clave='white-death-vista-aparicion-v1',opciones=['adaptativa','horizontal','vertical'];
 let modo='adaptativa';
 const iconos={adaptativa:'<svg viewBox="0 0 24 24" aria-hidden="true" class="vista-grid">'+[3,10,17].flatMap(y=>[3,10,17].map(x=>`<rect x="${x}" y="${y}" width="4" height="4" rx=".5"/>`)).join('')+'</svg>',horizontal:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2" y="9" width="20" height="6" rx="1"/></svg>',vertical:'<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="9" y="2" width="6" height="20" rx="1"/></svg>'};
 const nombres={adaptativa:'Adaptativa',horizontal:'Horizontal',vertical:'Vertical'};
 try{const guardada=localStorage.getItem(clave);if(opciones.includes(guardada))modo=guardada;}catch{}
 const aplicarVista=()=>{grid.dataset.vista=modo;vista.dataset.vista=modo;vista.innerHTML=iconos[modo];const siguiente=opciones[(opciones.indexOf(modo)+1)%opciones.length];vista.setAttribute('aria-label',`Vista ${nombres[modo]}. Cambiar a ${nombres[siguiente]}`);vista.title=`Vista ${nombres[modo]} · Pulsar para cambiar a ${nombres[siguiente]}`;};aplicarVista();
 vista.addEventListener('click',()=>{modo=opciones[(opciones.indexOf(modo)+1)%opciones.length];aplicarVista();try{localStorage.setItem(clave,modo);}catch{notificar('No se pudo guardar la vista elegida. Se conserva durante esta sesión.');}});
 detalles.addEventListener('click',()=>{
  const visible=detalles.getAttribute('aria-pressed')!=='true';detalles.setAttribute('aria-pressed',String(visible));dialogo.dataset.detalles=String(visible);
  detalles.title=visible?'Ocultar detalles de Aparición':'Mostrar probabilidades registradas y resultados de Aparición';
 });dialogo.dataset.detalles='false';
}
