// Generado desde scripts/sw-plantilla.js.
const VERSION_APP='34769111b55ae561';
const ARCHIVOS=["./","./index.html","./style.css","./app.js","./presentacion.js","./contenido.js","./engine.js","./abominaciones.js","./nigromantes.js","./secundarios.js","./catalogo.js","./catalogo-datos.js","./estado.js","./persistencia.js","./informacion.js","./pwa.js","./manifest.webmanifest","./icon.svg","./icon-192.png","./icon-512.png","./assets/471_Nigromante.png","./assets/461_Abominacion.png","./assets/474_Asedio_zombi.png","./assets/484_Activacion_adicional_Corredores.png","./assets/483_Activacion_adicional_Brutos.png","./assets/481_Activacion_adicional_Caminantes.png","./assets/451_Brutos.png","./assets/435_Brutos.png","./assets/444_Caminantes.png","./assets/429_Caminantes.png","./assets/455_Corredores.png","./assets/442_Corredores.png","./recursos/00 Cartas Apoyo Supervivientes/Accion_de_combate_a_distancia_demorada.png","./recursos/00 Cartas Apoyo Supervivientes/Acciones_de_Guardia.png","./recursos/00 Cartas Apoyo Supervivientes/Guardias.png","./recursos/01 Mazo Spawn - Juego base/429_Caminantes.png","./recursos/01 Mazo Spawn - Juego base/435_Brutos.png","./recursos/01 Mazo Spawn - Juego base/442_Corredores.png","./recursos/01 Mazo Spawn - Juego base/444_Caminantes.png","./recursos/01 Mazo Spawn - Juego base/451_Brutos.png","./recursos/01 Mazo Spawn - Juego base/455_Corredores.png","./recursos/01 Mazo Spawn - Juego base/461_Abominacion.png","./recursos/01 Mazo Spawn - Juego base/471_Nigromante.png","./recursos/01 Mazo Spawn - Juego base/474_Asedio_zombi.png","./recursos/01 Mazo Spawn - Juego base/481_Activacion_adicional_Caminantes.png","./recursos/01 Mazo Spawn - Juego base/483_Activacion_adicional_Brutos.png","./recursos/01 Mazo Spawn - Juego base/484_Activacion_adicional_Corredores.png","./recursos/02 Mazo Spawn - Expansiones/559_Caminantes_de_terrorcota.png","./recursos/02 Mazo Spawn - Expansiones/565_Trepadores.png","./recursos/02 Mazo Spawn - Expansiones/571_Trepadores.png","./recursos/02 Mazo Spawn - Expansiones/577_Caminantes_ballesteros.png","./recursos/02 Mazo Spawn - Expansiones/580_Caminantes_ballesteros.png","./recursos/02 Mazo Spawn - Expansiones/Bestias_divinas_Aparicion.png","./recursos/03 - Mazo Nigromante ESP/Carta Hannya traducida al español-1.png","./recursos/03 - Mazo Nigromante ESP/Carta Zombicide_ notas de muerte-7.png","./recursos/03 - Mazo Nigromante ESP/Carta de Bomoh en español-6.png","./recursos/03 - Mazo Nigromante ESP/Carta de Kaguya en español-2.png","./recursos/03 - Mazo Nigromante ESP/Carta de Mumm-Ra en español-3.png","./recursos/03 - Mazo Nigromante ESP/Carta de Tengu con reglas en español-4.png","./recursos/03 - Mazo Nigromante ESP/Gran_inquisidor_Innsmouth.png","./recursos/03 - Mazo Nigromante ESP/Nigromante_orco.png","./recursos/03 - Mazo Nigromante ESP/Nigromante_profanador.png","./recursos/03 - Mazo Nigromante ESP/Ostokar_el_palido.png","./recursos/03 - Mazo Nigromante ESP/Yuki-Onna con reglas en español-5.png","./recursos/04 - Mazo Abominaciones ESP/Abominacion_kan.png","./recursos/04 - Mazo Abominaciones ESP/Abominacion_orca.png","./recursos/04 - Mazo Abominaciones ESP/Bestias_divinas_Activacion.png","./recursos/04 - Mazo Abominaciones ESP/Carta Amaterasu en español-8.png","./recursos/04 - Mazo Abominaciones ESP/Carta Kijin de Zombicide-13.png","./recursos/04 - Mazo Abominaciones ESP/Carta Nian de Zombicide-16.png","./recursos/04 - Mazo Abominaciones ESP/Carta Qilin de Zombicide-17.png","./recursos/04 - Mazo Abominaciones ESP/Carta Sojobo de Zombicide en español-3.png","./recursos/04 - Mazo Abominaciones ESP/Carta Takemikazuchi en español-5.png","./recursos/04 - Mazo Abominaciones ESP/Carta Zombicide Kumiho en español-14.png","./recursos/04 - Mazo Abominaciones ESP/Carta Zombicide Susano-wo en español-4.png","./recursos/04 - Mazo Abominaciones ESP/Carta Zombicide_ Liebre Roja-1.png","./recursos/04 - Mazo Abominaciones ESP/Carta de Asura en español-9.png","./recursos/04 - Mazo Abominaciones ESP/Carta de Bishamon en español-10.png","./recursos/04 - Mazo Abominaciones ESP/Carta de Chimimōryō en español-11.png","./recursos/04 - Mazo Abominaciones ESP/Carta de Hachiman, reglas en español-12.png","./recursos/04 - Mazo Abominaciones ESP/Carta de Mumm-Ra en español-15.png","./recursos/04 - Mazo Abominaciones ESP/Carta de Toyol, reglas en español-6.png","./recursos/04 - Mazo Abominaciones ESP/Carta del Yeti en español-7.png","./recursos/04 - Mazo Abominaciones ESP/Dragon_nigromantico.png","./recursos/04 - Mazo Abominaciones ESP/Shakōki Dogū_ reglas en español-2.png","./recursos/05 - Custom Daily Spawn ESP/DU02 Rakshasa en español V2.png","./recursos/05 - Custom Daily Spawn ESP/DU01 Yaksha en español.png","./recursos/05 - Custom Daily Spawn ESP/DU03 Meng Huo en español.png","./recursos/05 - Custom Daily Spawn ESP/DU04 de Bruto en español.png","./recursos/05 - Custom Daily Spawn ESP/DU05 Onryo en español.png","./recursos/05 - Custom Daily Spawn ESP/DU06 Kappa en español.png","./recursos/05 - Custom Daily Spawn ESP/DU07 Bake-Danuki en español.png","./fichas-zombis.js","./tabla-puntajes.js","./formula-puntaje.js","./derrotas.js","./reglas-cartas.js","./apariciones-adicionales.js","./puntaje.js","./volteo.js","./contador-zombis.js","./bake-danuki.js","./revelacion.js","./acciones-enemigos.js","./acciones-independientes.js","./revelacion-ui.js","./daily.js","./especial.js","./especial-config.js","./especial-ui.js","./configuracion-ui.js","./adrenalina.js","./pantalla-completa.js","./exportacion.js","./limites.js","./modos-enemigos.js","./configuracion-partida.js","./recursos/Imagenes generales/Marcador de zonas de nigromante.png","./recursos/Imagenes generales/Marcador de zonas de estandar.png","./recursos/Imagenes generales/Franja modular de corrupción verde.png","./recursos/Imagenes generales/Muralla nevada con torre y escalera.png","./recursos/Imagenes generales/Sección de muro nevado liso-2.png","./recursos/Imagenes generales/Muralla nevada con caldero, antorcha y estandarte-1.png","./recursos/Imagenes generales/Puerta nevada con torres y calderos.png","./recursos/Imagenes generales/Contratapa Mazo - La tormenta oculta la horda.png","./recursos/Imagenes generales/Banderín rojo de abominación-2.png","./recursos/Imagenes generales/Estandarte esmeralda del nigromante-1.png","./recursos/Imagenes generales/Zombi barrigón en estandarte morado.png","./recursos/Imagenes generales/Estandarte del caminante zombi.png","./recursos/Imagenes generales/Estandarte ámbar del zombi corredor.png","./recursos/Imagenes generales/Ficha circular de horda zombi.png","./recursos/Imagenes generales/marcos_corregidos_280x437/marco_nigromante.png","./recursos/Imagenes generales/marcos_corregidos_280x437/marco_abominacion.png","./recursos/06 - Cartas Apariciones adicionales/caminante.png","./recursos/06 - Cartas Apariciones adicionales/bruto.png","./recursos/06 - Cartas Apariciones adicionales/corredor.png","./recursos/06 - Cartas Apariciones adicionales/Trepador-2.png","./recursos/06 - Cartas Apariciones adicionales/Guerrero de terracota animado-1.png","./recursos/06 - Cartas Apariciones adicionales/Caminante ballestero-1.png","./recursos/06 - Cartas Apariciones adicionales/Bruto custodio-2.png","./recursos/06 - Cartas Apariciones adicionales/Ninja del Pie-3.png","./recursos/Imagenes generales/contadores_puntaje/digits.js","./recursos/Imagenes generales/contadores_puntaje/score-counter.js","./recursos/Imagenes generales/contadores_puntaje/score-counter.css","./recursos/Imagenes generales/contadores_puntaje/themes.json","./recursos/Imagenes generales/contadores_puntaje/LICENSE_DIGITS.txt","./recursos/Imagenes generales/contadores_puntaje/assets/kang.png","./recursos/Imagenes generales/contadores_puntaje/assets/dragon.png","./recursos/Imagenes generales/contadores_puntaje/assets/cabeza.png","./version.js"];
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
