const PREFIJO=`white-death-${encodeURIComponent(self.registration.scope)}-`;
const CACHE=PREFIJO+VERSION_APP;
// Conserva el paquete de cada pestaña hasta que esa pestaña decida recargar.
const META=PREFIJO+'clientes';
const ESPERA=new URL('__version_en_espera__',self.registration.scope).href;
const rutaCliente=id=>new URL('__version_cliente__/'+id,self.registration.scope).href;
let reparacionEnCurso=null;
async function versionCliente(id){return id?(await (await caches.open(META)).match(rutaCliente(id)))?.text():null;}
async function asignarVersion(id,version){if(id)await (await caches.open(META)).put(rutaCliente(id),new Response(version));}
async function limpiarVersiones(){
 if(self.registration.installing||self.registration.waiting||reparacionEnCurso)return;
 const clientes=await self.clients.matchAll({type:'window',includeUncontrolled:true});
 const ids=new Set(clientes.map(c=>c.id)),usadas=new Set([CACHE]),meta=await caches.open(META);
 const espera=await meta.match(ESPERA);if(espera)usadas.add(PREFIJO+await espera.text());
 for(const entrada of await meta.keys()){
  if(entrada.url===ESPERA)continue;
  const id=entrada.url.split('/').at(-1);
  if(!ids.has(id))await meta.delete(entrada);
  else usadas.add(PREFIJO+await (await meta.match(entrada)).text());
 }
 for(const key of await caches.keys())if(key.startsWith(PREFIJO)&&key!==META&&!usadas.has(key))await caches.delete(key);
}
const URLS=ARCHIVOS.map(p=>new URL(p,self.registration.scope).href);
const PERMITIDAS=new Set(URLS);
async function versionEnRed(){
 const respuesta=await fetch(new Request(new URL('version.js',self.registration.scope),{cache:'no-store'}));
 if(!respuesta.ok||respuesta.redirected)throw new Error('No se pudo comprobar la versión publicada');
 return (await respuesta.text()).match(/VERSION_APP\s*=\s*['"]([a-f0-9]{16})['"]/)?.[1];
}
function repararPaquete(){
 if(reparacionEnCurso)return reparacionEnCurso;
 reparacionEnCurso=(async()=>{
  const temporal=CACHE+'-reparacion';
  try{
   if(await versionEnRed()!==VERSION_APP)throw new Error('Hay una versión nueva: busca la actualización');
   const destino=await caches.open(CACHE),pendientes=await caches.open(temporal);
   for(const url of URLS)if(!await destino.match(url)){
    const respuesta=await fetch(new Request(url,{cache:'no-store'}));
    if(!respuesta.ok||respuesta.redirected)throw new Error('No se completó la descarga; revisa conexión y espacio');
    await pendientes.put(url,respuesta);
   }
   if(await versionEnRed()!==VERSION_APP)throw new Error('La versión publicada cambió durante la descarga: vuelve a intentar');
   for(const peticion of await pendientes.keys())await destino.put(peticion,await pendientes.match(peticion));
   if(!(await Promise.all(URLS.map(url=>destino.match(url)))).every(Boolean))throw new Error('El paquete sigue incompleto');
  }finally{await caches.delete(temporal);}
 })().finally(()=>{reparacionEnCurso=null;});
 return reparacionEnCurso;
}
async function paginaRecuperacion(){
 const url=new URL('recuperar.html',self.registration.scope);
 try{const respuesta=await fetch(new Request(url,{cache:'no-store'}));if(respuesta.ok&&!respuesta.redirected)return respuesta;}catch{}
 return new Response('<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Recuperar aplicación</title><h1>Falta parte de la aplicación offline</h1><p>Conecta el dispositivo a internet y vuelve a abrir esta página. No borres los datos del sitio: la partida se guarda por separado.</p><p><a href="'+url.href+'">Abrir recuperación</a></p></html>',{status:503,headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
}
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await (await caches.open(META)).put(ESPERA,new Response(VERSION_APP));
 try{
  if(await versionEnRed()!==VERSION_APP)throw new Error('La publicación cambió antes de iniciar la descarga');
  for(const url of URLS){
   const response=await fetch(new Request(url,{cache:'reload'}));
   if(!response.ok||response.redirected)throw new Error('Precarga incompleta');
   await cache.put(url,response);
  }
  if(await versionEnRed()!==VERSION_APP)throw new Error('La publicación cambió durante la descarga');
 }catch(error){await caches.delete(CACHE);throw error;}
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 await self.clients.claim();
 await limpiarVersiones();
})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||!PERMITIDAS.has(event.request.url))return;
 // Una version activa sirve su paquete completo, sin mezclar modulos de una actualizacion.
 event.respondWith((async()=>{
  const navegacion=event.request.mode==='navigate';
  const version=navegacion?VERSION_APP:await versionCliente(event.clientId)||VERSION_APP;
  if(navegacion)await asignarVersion(event.resultingClientId,VERSION_APP);
  const cache=await caches.open(PREFIJO+version),respuesta=await cache.match(event.request);
  if(respuesta)return respuesta;
  if(navegacion)return paginaRecuperacion();
  // Reparar solo la misma versión; nunca rellenar una pestaña antigua con módulos nuevos.
  if(version===VERSION_APP)try{await repararPaquete();const recuperada=await cache.match(event.request);if(recuperada)return recuperada;}catch{}
  return new Response('Recurso offline no disponible. Abre recuperar.html con conexión para recuperar la aplicación sin borrar la partida.',{status:503});
 })());
});
self.addEventListener('message',event=>{
 if(event.data?.tipo==='reparar-offline'){
  event.waitUntil((async()=>{try{await repararPaquete();event.ports[0]?.postMessage({ok:true,version:VERSION_APP});}catch(error){event.ports[0]?.postMessage({ok:false,error:error.message});}})());return;
 }
 if(event.data?.tipo==='activar-actualizacion'){
  event.waitUntil((async()=>{
   if(!/^[a-f0-9]{16}$/.test(event.data.versionAnterior))return;
   for(const cliente of await self.clients.matchAll({type:'window',includeUncontrolled:true})){
    if(cliente.url.startsWith(self.registration.scope)&&!await versionCliente(cliente.id))await asignarVersion(cliente.id,event.data.versionAnterior);
   }
   await self.skipWaiting();
  })());return;
 }
 if(event.data?.tipo!=='comprobar-offline')return;
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  const completa=(await Promise.all(URLS.map(url=>cache.match(url)))).every(Boolean);
  event.ports[0]?.postMessage({version:VERSION_APP,completa});
  await limpiarVersiones();
 })());
});
