import http from 'node:http';
import path from 'node:path';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame} from '../dist/engine.js';
const {chromium}=createRequire(import.meta.url)(process.env.MAZO_PLAYWRIGHT||'playwright');
const raiz=path.resolve('dist'),original=execFileSync('git',['show','e7c9763:scripts/sw-plantilla.js'],{encoding:'utf8'}),actual=await readFile('scripts/sw-plantilla.js','utf8');
const generada=await readFile('dist/sw.js','utf8'),archivos=generada.match(/const ARCHIVOS=(\[[^\n]+\]);/)[1];
const versiones=['1111111111111111','2222222222222222','3333333333333333'];let fase=0,fallar=false;
const tipos={'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const servidor=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url,'http://localhost');if(!url.pathname.startsWith('/mazo/'))throw Error('Ruta');
 const rel=decodeURIComponent(url.pathname.slice(6))||'index.html',archivo=path.resolve(raiz,rel);if(!archivo.startsWith(raiz+path.sep))throw Error('Ruta');
 if(fallar&&rel==='icon.svg'){res.writeHead(503);res.end('Fallo simulado');return;}
 let bytes=await readFile(archivo);
 if(rel==='version.js')bytes=Buffer.from(`export const VERSION_APP='${versiones[fase]}';`);
 if(rel==='sw.js')bytes=Buffer.from(`const VERSION_APP='${versiones[fase]}';\nconst ARCHIVOS=${archivos};\n${fase===0?original:actual}`);
 res.writeHead(200,{'Content-Type':tipos[path.extname(archivo)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
}catch{res.writeHead(404);res.end();}});
await new Promise(resolve=>servidor.listen(0,'127.0.0.1',resolve));const url=`http://127.0.0.1:${servidor.address().port}/mazo/`,key='white-death-gestor-v2';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const ctx=await browser.newContext({viewport:{width:960,height:600},reducedMotion:'reduce'}),s=newGame({easy:true,normal:true,threshold:20,modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'},3);
 await ctx.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s});
 const p=await ctx.newPage();await p.goto(url);const offline=()=>p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await offline();
 const bytes=await p.evaluate(k=>localStorage.getItem(k),key);
 const conservar=async()=>assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);
 const quitarPaquete=()=>p.evaluate(async()=>{const r=await navigator.serviceWorker.ready,pref='white-death-'+encodeURIComponent(r.scope)+'-';for(const k of await caches.keys())if(k.startsWith(pref)&&!k.endsWith('clientes'))await caches.delete(k);});
 await quitarPaquete();const perdida=await p.reload();assert.equal(perdida.status(),503);assert.equal(await p.locator('body').textContent(),'Recurso offline no disponible');await conservar();
 // La página de rescate esquiva la lista del worker antiguo y actualiza sin borrar la partida.
 fase=1;await p.goto(new URL('recuperar.html',url).href);
 for(const [width,height] of [[960,600],[390,844],[320,568]]){await p.setViewportSize({width,height});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);}
 await Promise.all([p.waitForURL(url,{timeout:90000}),p.locator('#recuperar').click()]);await offline();await conservar();
 assert.equal(await p.evaluate(async()=>(await import('./version.js')).VERSION_APP),versiones[1]);
 // Módulo ausente: reparación de la misma versión sin mezclar archivos.
 await p.evaluate(async()=>{const r=await navigator.serviceWorker.ready,pref='white-death-'+encodeURIComponent(r.scope)+'-';await (await caches.open(pref+'2222222222222222')).delete(new URL('app.js',r.scope).href);});
 await p.reload();await offline();await conservar();
 // Paquete completo expulsado: rescate online y reparación, sin nueva versión.
 await quitarPaquete();await p.reload();await p.locator('#recuperar').waitFor();await conservar();
 await Promise.all([p.waitForURL(url),p.locator('#recuperar').click()]);await offline();await conservar();
 // Descarga fallida conserva datos y permite reintentar; sin red hay explicación útil.
 await quitarPaquete();await p.goto(new URL('recuperar.html',url).href);fallar=true;await p.locator('#recuperar').click();await p.locator('#estado').filter({hasText:/No se completó la descarga/}).waitFor();assert.equal(await p.locator('#recuperar').isEnabled(),true);await conservar();
 await ctx.setOffline(true);await p.goto(url);assert.match(await p.locator('body').textContent(),/Conecta el dispositivo a internet/);await conservar();
 await ctx.setOffline(false);fallar=false;await p.goto(new URL('recuperar.html',url).href);await Promise.all([p.waitForURL(url),p.locator('#recuperar').click()]);await offline();
 // Si la web cambió de versión, el worker no rellena el módulo antiguo con uno nuevo.
 await p.evaluate(async()=>{const r=await navigator.serviceWorker.ready,pref='white-death-'+encodeURIComponent(r.scope)+'-';await (await caches.open(pref+'2222222222222222')).delete(new URL('app.js',r.scope).href);});fase=2;
 assert.equal(await p.evaluate(async()=> (await fetch('./app.js')).status),503);
 await p.goto(new URL('recuperar.html',url).href);await Promise.all([p.waitForURL(url,{timeout:90000}),p.locator('#recuperar').click()]);await offline();await conservar();
 assert.equal(await p.evaluate(async()=>(await import('./version.js')).VERSION_APP),versiones[2]);await ctx.setOffline(true);await p.reload();await offline();await conservar();await ctx.close();
 console.log('Recuperación: fallo antiguo reproducido, rescate con worker anterior, actualización, reparación total/parcial, descarga fallida/reintento, aviso sin red, aislamiento de versiones, móvil/tablet y partida intacta/offline.');
}finally{await browser.close();await new Promise(resolve=>servidor.close(resolve));}
