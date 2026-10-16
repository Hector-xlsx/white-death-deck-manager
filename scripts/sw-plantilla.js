const PREFIJO=`white-death-${encodeURIComponent(self.registration.scope)}-`;
const CACHE=PREFIJO+VERSION_APP;
const URLS=ARCHIVOS.map(p=>new URL(p,self.registration.scope).href);
const PERMITIDAS=new Set(URLS);
self.addEventListener('install',event=>event.waitUntil((async()=>{
 const cache=await caches.open(CACHE);
 try{
  for(const url of URLS){
   const response=await fetch(new Request(url,{cache:'reload'}));
   if(!response.ok||response.redirected)throw new Error('Precarga incompleta');
   await cache.put(url,response);
  }
 }catch(error){await caches.delete(CACHE);throw error;}
})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith(PREFIJO)&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||!PERMITIDAS.has(event.request.url))return;
 // Una version activa sirve su paquete completo, sin mezclar modulos de una actualizacion.
 event.respondWith(caches.open(CACHE).then(cache=>cache.match(event.request)).then(cached=>cached||new Response('Recurso offline no disponible',{status:503})));
});
self.addEventListener('message',event=>{
 if(event.data?.tipo!=='comprobar-offline')return;
 event.waitUntil((async()=>{
  const cache=await caches.open(CACHE);
  const completa=(await Promise.all(URLS.map(url=>cache.match(url)))).every(Boolean);
  event.ports[0]?.postMessage({version:VERSION_APP,completa});
 })());
});
