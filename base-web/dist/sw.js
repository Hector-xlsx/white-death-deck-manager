const CACHE='white-death-v3-real-cards';
const FILES=["./", "./index.html", "./style.css", "./app.js", "./engine.js", "./manifest.webmanifest", "./icon.svg", "./icon-192.png", "./icon-512.png", "./assets/471_Nigromante.png", "./assets/461_Abominacion.png", "./assets/474_Asedio_zombi.png", "./assets/484_Activacion_adicional_Corredores.png", "./assets/483_Activacion_adicional_Brutos.png", "./assets/481_Activacion_adicional_Caminantes.png", "./assets/451_Brutos.png", "./assets/435_Brutos.png", "./assets/444_Caminantes.png", "./assets/429_Caminantes.png", "./assets/455_Corredores.png", "./assets/442_Corredores.png"];
const ALLOWED=new Set(FILES.map(p=>new URL(p,self.registration.scope).href));
self.addEventListener('install',event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(FILES)).then(()=>self.skipWaiting())));
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith('white-death-')&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET'||!ALLOWED.has(event.request.url))return;
 const url=new URL(event.request.url);
 if(event.request.mode==='navigate'||/\.(?:js|css)$/.test(url.pathname)){
  event.respondWith(fetch(event.request).then(response=>{
   if(response.ok&&!response.redirected){const copy=response.clone();event.waitUntil(caches.open(CACHE).then(cache=>cache.put(event.request,copy)));}
   return response;
  }).catch(()=>caches.match(event.request)));
 }else event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request)));
});
