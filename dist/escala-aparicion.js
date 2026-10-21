export function iniciarEscalaAparicion(notificar=()=>{}){
 let escala=100;
 const menos=document.getElementById('aparicion-alejar'),mas=document.getElementById('aparicion-acercar'),valor=document.getElementById('aparicion-escala'),grid=document.getElementById('batch-grid');
 const pintar=()=>{grid.style.setProperty('--escala-aparicion',escala/100);valor.textContent=escala+'%';menos.disabled=escala<=75;mas.disabled=escala>=125;};
 menos.addEventListener('click',()=>{escala=Math.max(75,escala-5);pintar();});
 mas.addEventListener('click',()=>{escala=Math.min(125,escala+5);pintar();});pintar();
 const vista=document.getElementById('aparicion-vista'),detalles=document.getElementById('aparicion-detalles'),dialogo=document.getElementById('batch-dialog');
 const clave='white-death-vista-aparicion-v1',opciones=['adaptativa','horizontal','vertical'];
 try{const guardada=localStorage.getItem(clave);if(opciones.includes(guardada))vista.value=guardada;}catch{}
 const aplicarVista=()=>{grid.dataset.vista=vista.value;};aplicarVista();
 vista.addEventListener('change',()=>{aplicarVista();try{localStorage.setItem(clave,vista.value);}catch{notificar('No se pudo guardar la vista elegida. Se conserva durante esta sesión.');}});
 detalles.addEventListener('click',()=>{
  const visible=detalles.getAttribute('aria-pressed')!=='true';detalles.setAttribute('aria-pressed',String(visible));dialogo.dataset.detalles=String(visible);
  detalles.title=visible?'Ocultar detalles de Aparición':'Mostrar probabilidades registradas y resultados de Aparición';
 });dialogo.dataset.detalles='false';
}
