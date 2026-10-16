import http from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';

const require=createRequire(import.meta.url);
const {chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const raiz=fileURLToPath(new URL('../dist/',import.meta.url));
const salida=fileURLToPath(new URL('../outputs/publicacion/',import.meta.url));
const subruta='/white-death-deck-manager/';
const tipos={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
let servidor;
let url=process.env.MAZO_URL;
if(!url){
 servidor=http.createServer(async(req,res)=>{
  try{
   const ruta=new URL(req.url,'http://localhost').pathname;
   if(!ruta.startsWith(subruta)){res.writeHead(404);res.end();return;}
   const archivo=path.resolve(raiz,decodeURIComponent(ruta.slice(subruta.length))||'index.html');
   if(!archivo.startsWith(raiz)){res.writeHead(403);res.end();return;}
   const contenido=await readFile(archivo);
   res.writeHead(200,{'Content-Type':tipos[path.extname(archivo)]||'application/octet-stream','Cache-Control':'no-store'});
   res.end(contenido);
  }catch{res.writeHead(404);res.end();}
 });
 await new Promise(resolve=>servidor.listen(0,'127.0.0.1',resolve));
 url=`http://127.0.0.1:${servidor.address().port}${subruta}`;
}
await mkdir(salida,{recursive:true});
let navegador;
try{
 navegador=await chromium.launch({headless:true,channel:process.env.MAZO_NAVEGADOR||'chrome'});
 const contexto=await navegador.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
 const pagina=await contexto.newPage();
 const errores=[];
 pagina.on('pageerror',e=>errores.push(e.message));
 pagina.on('response',r=>{if(r.status()>=400)errores.push(`${r.status()} ${r.url()}`);});
 const respuesta=await pagina.goto(url);
 assert.equal(respuesta.status(),200);
 assert.equal(await pagina.title(),'Zombicide: White Death — Deck Manager');
 assert.equal(await pagina.locator('meta[name="robots"]').getAttribute('content'),'noindex, nofollow');
 await pagina.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:120000});
 const paquete=await pagina.evaluate(async()=>{
  const enlace=document.querySelector('link[rel="manifest"]').href;
  const manifest=await (await fetch(enlace)).json();
  const registro=await navigator.serviceWorker.ready;
  const version=(await import('./version.js')).VERSION_APP;
  return {manifest,enlace,scope:registro.scope,version};
 });
 assert.equal(paquete.manifest.name,'Zombicide: White Death — Deck Manager');
 assert.equal(new URL(paquete.manifest.start_url,paquete.enlace).href,url);
 assert.equal(new URL(paquete.manifest.scope,paquete.enlace).href,url);
 assert.equal(paquete.scope,url);
 await pagina.locator('#spawn').click();
 await pagina.locator('#batch-dialog').waitFor({state:'visible'});
 assert.ok(await pagina.evaluate(()=>JSON.parse(localStorage.getItem('white-death-gestor-v2')).sequence>=3));
 await pagina.locator('#batch-dialog button[data-action="close"]').click();
 await pagina.waitForFunction(()=>JSON.parse(localStorage.getItem('white-death-gestor-v2')).openBatch===false);
 const guardado=await pagina.evaluate(()=>localStorage.getItem('white-death-gestor-v2'));
 for(const [ancho,alto] of [[1440,900],[1024,768],[844,390],[390,844],[320,568]]){
  await pagina.setViewportSize({width:ancho,height:alto});
  assert.ok(await pagina.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),`Desbordamiento en ${ancho}×${alto}`);
  await pagina.screenshot({path:path.join(salida,`app-${ancho}.png`),fullPage:true});
 }
 await contexto.setOffline(true);
 await pagina.reload();
 await pagina.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:15000});
 const recuperado=await pagina.evaluate(()=>localStorage.getItem('white-death-gestor-v2'));
 if(recuperado!==guardado){
  const diferencias=(a,b,p='')=>{
   if(JSON.stringify(a)===JSON.stringify(b))return [];
   if(a&&b&&typeof a==='object'&&typeof b==='object')return [...new Set([...Object.keys(a),...Object.keys(b)])].flatMap(k=>diferencias(a[k],b[k],`${p}.${k}`));
   return [{campo:p,antes:a,despues:b}];
  };
  assert.fail(JSON.stringify(diferencias(JSON.parse(guardado),JSON.parse(recuperado))));
 }
 assert.equal(await pagina.title(),'Zombicide: White Death — Deck Manager');
 assert.equal(await pagina.locator('meta[name="robots"]').getAttribute('content'),'noindex, nofollow');
 assert.deepEqual(errores,[]);
 console.log(`Publicación verificada: ${url} · versión ${paquete.version}.`);
 console.log('Título, robots, manifest, scope PWA, carga de recursos, SPAWN, cinco tamaños y recarga offline con guardado intacto.');
}finally{
 if(navegador)await navegador.close();
 if(servidor)await new Promise(resolve=>servidor.close(resolve));
}
