import {VERSION_APP} from './version.js';
export async function prepararOffline(elemento){
 if(!('serviceWorker' in navigator)){elemento.textContent='Uso offline no disponible';return;}
 try{
  const reg=await navigator.serviceWorker.register('./sw.js');
  async function comprobar(){
   elemento.textContent=reg.waiting?'Actualización lista: cierra las pestañas de esta app':'Preparando uso offline…';
   const worker=navigator.serviceWorker.controller;
   if(!worker)return;
   const canal=new MessageChannel();
   const resultado=await new Promise(resolve=>{
    const temporizador=setTimeout(()=>resolve(null),8000);
    canal.port1.onmessage=e=>{clearTimeout(temporizador);resolve(e.data);};
    worker.postMessage({tipo:'comprobar-offline'},[canal.port2]);
   });
   canal.port1.close();
   if(resultado?.completa&&resultado.version===VERSION_APP)elemento.textContent=reg.waiting?'Offline · Actualización lista al cerrar las pestañas':'Disponible offline en este dispositivo';
   else if(resultado&&resultado.version!==VERSION_APP)elemento.textContent='Cierra las pestañas y vuelve a abrir para completar la actualización';
  }
  comprobar();navigator.serviceWorker.addEventListener('controllerchange',comprobar);
  reg.addEventListener('updatefound',()=>{const w=reg.installing;w?.addEventListener('statechange',()=>{if(w.state==='redundant')elemento.textContent='Descarga offline incompleta; vuelve a abrir con conexión';else if(w.state==='installed'||w.state==='activated')comprobar();});});
  window.addEventListener('pageshow',comprobar);window.addEventListener('online',comprobar);
 }catch{elemento.textContent='Uso offline no disponible; revisa la conexión y el espacio';}
}
