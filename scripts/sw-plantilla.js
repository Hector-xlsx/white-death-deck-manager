const PREFIJO=`white-death-${encodeURIComponent(self.registration.scope)}-`;
const CACHE=PREFIJO+VERSION_APP;
// Conserva el paquete de cada pestaña hasta que esa pestaña decida recargar.
const META=PREFIJO+'clientes';
const ESPERA=new URL('__version_en_espera__',self.registration.scope).href;
const rutaCliente=id=>new URL('__version_cliente__/'+id,self.registration.scope).href;
async function versionCliente(id){return id?(await (await caches.open(META)).match(rutaCliente(id)))?.text():null;}
async function asignarVersion(id,version){if(id)await (await caches.open(META)).put(rutaCliente(id),new Response(version));}
async function limpiarVersiones(){
 if(self.registration.installing||self.registration.waiting)return;
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
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 await (await caches.open(META)).put(ESPERA,new Response(VERSION_APP));
 try{
  for(const url of URLS){
   const response=await fetch(new Request(url,{cache:'reload'}));
   if(!response.ok||response.redirected)throw new Error('Precarga incompleta');
   await cache.put(url,response);
  }
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
  const respuesta=await (await caches.open(PREFIJO+version)).match(event.request);
  return respuesta||new Response('Recurso offline no disponible',{status:503});
 })());
});
self.addEventListener('message',event=>{
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
