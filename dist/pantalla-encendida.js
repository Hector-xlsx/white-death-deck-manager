const CLAVE='white-death-pantalla-encendida-v1';

export function iniciarPantallaEncendida(casilla,estado,{navegador=navigator,documento=document,almacen}={}){
 let bloqueo=null,solicitando=false;
 const mensaje=texto=>estado.textContent=texto;
 try{almacen??=globalThis.localStorage;casilla.checked=almacen.getItem(CLAVE)==='si';}catch{casilla.checked=false;}
 if(!navegador.wakeLock?.request){casilla.checked=false;casilla.disabled=true;mensaje('Este navegador no permite mantener la pantalla encendida desde la aplicación.');return;}
 async function liberar(){
  const anterior=bloqueo;bloqueo=null;
  if(anterior&&!anterior.released)try{await anterior.release();}catch{mensaje('El navegador no pudo liberar la solicitud de pantalla encendida.');}
 }
 async function solicitar(){
  if(!casilla.checked||documento.visibilityState!=='visible'||solicitando)return;
  if(bloqueo&&!bloqueo.released)return;
  solicitando=true;mensaje('Solicitando mantener la pantalla encendida…');
  try{
   const nuevo=await navegador.wakeLock.request('screen');
   if(!casilla.checked||documento.visibilityState!=='visible'){await nuevo.release();return;}
   bloqueo=nuevo;mensaje('Activo: la pantalla se mantiene encendida mientras esta página esté visible.');
   nuevo.addEventListener('release',()=>{
    if(bloqueo!==nuevo)return;bloqueo=null;
    mensaje(casilla.checked?'Suspendido por el navegador. Se reintentará al volver a la página; también puedes desmarcar y marcar la opción.':'Desactivado.');
   });
  }catch{mensaje('El navegador no permitió mantener la pantalla encendida. Puedes desmarcar y marcar para reintentar; revisa el ahorro de batería.');}
  finally{solicitando=false;}
 }
 casilla.addEventListener('change',async()=>{
  let guardada=true;try{almacen.setItem(CLAVE,casilla.checked?'si':'no');}catch{guardada=false;}
  if(casilla.checked)await solicitar();else{await liberar();mensaje('Desactivado.');}
  if(!guardada)mensaje(estado.textContent+' No se pudo guardar la preferencia; solo se aplica a esta sesión.');
 });
 documento.addEventListener('visibilitychange',()=>{
  if(documento.visibilityState==='visible')solicitar();
  else{liberar();if(casilla.checked)mensaje('En pausa mientras la página no está visible.');}
 });
 mensaje('Desactivado.');if(casilla.checked)solicitar();
}
