export function iniciarPantallaCompleta(boton,avisar){
 const documento=boton.ownerDocument,raiz=documento.documentElement;
 const activa=()=>Boolean(documento.fullscreenElement||documento.webkitFullscreenElement);
 function actualizar(){
  const dentro=activa(),texto=dentro?'Salir de pantalla completa':'Entrar en pantalla completa';
  boton.title=texto;boton.setAttribute('aria-label',texto);boton.setAttribute('aria-pressed',String(dentro));
  boton.querySelector('path').setAttribute('d',dentro?'M8 3v5H3m13-5v5h5M3 16h5v5m8 0v-5h5':'M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5');
 }
 boton.addEventListener('click',async()=>{
  const salir=activa(),destino=salir?documento:raiz;
  const accion=salir?(documento.fullscreenElement?documento.exitFullscreen:documento.webkitExitFullscreen):(raiz.requestFullscreen||raiz.webkitRequestFullscreen);
  const permitido=documento.fullscreenEnabled??documento.webkitFullscreenEnabled;
  if(!accion||!salir&&permitido===false){avisar('Este navegador no permite activar la pantalla completa.');return;}
  boton.disabled=true;
  try{await accion.call(destino);}
  catch{avisar(salir?'No se pudo salir de pantalla completa. Puedes usar el control del navegador.':'No se pudo activar la pantalla completa. Puedes volver a intentarlo.');}
  finally{boton.disabled=false;actualizar();}
 });
 documento.addEventListener('fullscreenchange',actualizar);
 documento.addEventListener('webkitfullscreenchange',actualizar);
 actualizar();
}
