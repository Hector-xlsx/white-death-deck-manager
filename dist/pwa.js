import {VERSION_APP} from './version.js';
export async function prepararOffline(elemento,{puedeActualizar=()=>true,puedeActualizarConfiguracion=puedeActualizar}={}){
 const buscar=document.getElementById('buscar-actualizacion'),estado=document.getElementById('actualizacion-estado');
 const informar=texto=>{if(estado)estado.textContent=texto;};
 if(!('serviceWorker' in navigator)){elemento.textContent='Uso offline no disponible';informar('Este navegador no permite comprobar actualizaciones desde aquí.');if(buscar)buscar.disabled=true;return;}
 try{
  const reg=await navigator.serviceWorker.register('./sw.js');
  const aviso=document.getElementById('actualizacion-disponible'),boton=document.getElementById('actualizar-app'),mensaje=document.getElementById('actualizacion-mensaje');
  let recargar=false,versionDistinta=false,temporizadorActualizacion;
  function habilitar(){boton.disabled=false;if(buscar)buscar.disabled=false;}
  function mostrarActualizacion(){if(aviso)aviso.hidden=!(reg.waiting||versionDistinta);}
  function activar(desdeConfiguracion=false){
   if(!(desdeConfiguracion?puedeActualizarConfiguracion():puedeActualizar())){
    if(desdeConfiguracion)informar('Guarda o descarta los cambios de configuración y cierra los otros paneles antes de actualizar.');
    else mensaje.textContent='Guarda o cierra los paneles abiertos antes de actualizar.';
    habilitar();return;
   }
   mensaje.textContent='Aplicando actualización…';informar('Aplicando actualización…');boton.disabled=true;if(buscar)buscar.disabled=true;
   if(!reg.waiting){location.reload();return;}
   recargar=true;
   temporizadorActualizacion=setTimeout(()=>{
    recargar=false;habilitar();mensaje.textContent='No se pudo activar la actualización. Puedes volver a intentarlo.';informar(mensaje.textContent);
   },15000);
   reg.waiting.postMessage({tipo:'activar-actualizacion',versionAnterior:VERSION_APP});
  }
  boton?.addEventListener('click',()=>activar());
  buscar?.addEventListener('click',async()=>{
   if(!puedeActualizarConfiguracion()){informar('Guarda o descarta los cambios de configuración y cierra los otros paneles antes de actualizar.');return;}
   buscar.disabled=true;informar('Buscando y descargando actualizaciones…');
   try{
    if(!reg.waiting&&!versionDistinta){
     if(!navigator.onLine){informar('Sin conexión: no se pueden buscar versiones nuevas. La partida se conserva.');habilitar();return;}
     await reg.update();
     const instalando=reg.installing;
     if(instalando)await new Promise((resolve,reject)=>{
      const terminar=()=>{
       if(!['installed','activated','redundant'].includes(instalando.state))return;
       clearTimeout(limite);instalando.removeEventListener('statechange',terminar);
       if(instalando.state==='redundant')reject(new Error('Descarga incompleta'));else resolve();
      };
      const limite=setTimeout(()=>{instalando.removeEventListener('statechange',terminar);reject(new Error('Tiempo agotado'));},30000);
      instalando.addEventListener('statechange',terminar);terminar();
     });
    }
    await comprobar();
    if(reg.waiting||versionDistinta)activar(true);
    else{informar('No hay actualizaciones pendientes.');habilitar();}
   }catch{informar('No se pudo comprobar o descargar la actualización. Revisa la conexión y vuelve a intentarlo. La partida se conserva.');habilitar();}
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
 }catch{elemento.textContent='Uso offline no disponible; revisa la conexión y el espacio';informar('No se pudo preparar la búsqueda de actualizaciones. Recarga la página para reintentar.');if(buscar)buscar.disabled=true;}
}
