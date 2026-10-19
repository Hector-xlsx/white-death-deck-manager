import {VERSION_APP} from './version.js';
export async function prepararOffline(elemento,{puedeActualizar=()=>true}={}){
 if(!('serviceWorker' in navigator)){elemento.textContent='Uso offline no disponible';return;}
 try{
  const reg=await navigator.serviceWorker.register('./sw.js');
  const aviso=document.getElementById('actualizacion-disponible'),boton=document.getElementById('actualizar-app'),mensaje=document.getElementById('actualizacion-mensaje');
  let recargar=false,versionDistinta=false,temporizadorActualizacion;
  function mostrarActualizacion(){if(aviso)aviso.hidden=!(reg.waiting||versionDistinta);}
  boton?.addEventListener('click',()=>{
   if(!puedeActualizar()){mensaje.textContent='Guarda o cierra los paneles abiertos antes de actualizar.';return;}
   mensaje.textContent='Aplicando actualización…';boton.disabled=true;
   if(!reg.waiting){location.reload();return;}
   recargar=true;
   temporizadorActualizacion=setTimeout(()=>{
    recargar=false;boton.disabled=false;mensaje.textContent='No se pudo activar la actualización. Puedes volver a intentarlo.';
   },15000);
   reg.waiting.postMessage({tipo:'activar-actualizacion',versionAnterior:VERSION_APP});
  });
  async function comprobar(){
   mostrarActualizacion();
   elemento.textContent=reg.waiting?'Nueva versión lista para actualizar':'Preparando uso offline…';
   const worker=navigator.serviceWorker.controller;
   if(!worker)return;
   const canal=new MessageChannel();
   const resultado=await new Promise(resolve=>{
    const temporizador=setTimeout(()=>resolve(null),8000);
    canal.port1.onmessage=e=>{clearTimeout(temporizador);resolve(e.data);};
    worker.postMessage({tipo:'comprobar-offline'},[canal.port2]);
   });
   canal.port1.close();
   versionDistinta=Boolean(resultado&&resultado.version!==VERSION_APP);mostrarActualizacion();
   if(resultado?.completa&&resultado.version===VERSION_APP)elemento.textContent=reg.waiting?'Offline · Nueva versión disponible':'Disponible offline en este dispositivo';
   else if(versionDistinta)elemento.textContent='Nueva versión disponible · Pulsa Actualizar ahora';
  }
  comprobar();navigator.serviceWorker.addEventListener('controllerchange',()=>{if(recargar){clearTimeout(temporizadorActualizacion);location.reload();}else comprobar();});
  reg.addEventListener('updatefound',()=>{const w=reg.installing;w?.addEventListener('statechange',()=>{if(w.state==='redundant')elemento.textContent='Descarga offline incompleta; vuelve a abrir con conexión';else if(w.state==='installed'||w.state==='activated')comprobar();});});
  function buscarActualizacion(){comprobar();if(navigator.onLine)reg.update().catch(()=>{});}
  window.addEventListener('pageshow',buscarActualizacion);window.addEventListener('online',buscarActualizacion);
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')buscarActualizacion();});
  setInterval(()=>{if(document.visibilityState==='visible'&&navigator.onLine)buscarActualizacion();},5*60*1000);
 }catch{elemento.textContent='Uso offline no disponible; revisa la conexión y el espacio';}
}
