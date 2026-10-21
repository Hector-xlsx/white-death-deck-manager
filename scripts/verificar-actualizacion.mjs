import http from 'node:http';
import path from 'node:path';
import {readFile,mkdir} from 'node:fs/promises';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
import {abrirSeccionesConfiguracion} from './ayuda-configuracion.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const raiz=path.resolve('dist'),versiones=['1111111111111111','2222222222222222','3333333333333333','4444444444444444','5555555555555555'];
let fase=0,fallarDescarga=false;
const tipos={'.js':'text/javascript','.html':'text/html','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.webmanifest':'application/manifest+json'};
const servidor=http.createServer(async(req,res)=>{
 try{
  const u=new URL(req.url,'http://localhost'),rel=decodeURIComponent(u.pathname.slice('/mazo/'.length))||'index.html',archivo=path.resolve(raiz,rel);
  if(u.pathname==='/control.html'){res.writeHead(200,{'Content-Type':'text/html'});res.end('<!DOCTYPE html><title>Control de prueba</title>');return;}
  if(!u.pathname.startsWith('/mazo/')||!archivo.startsWith(raiz+path.sep))throw Error('Ruta inválida');
  if(fallarDescarga&&rel==='icon.svg'){res.writeHead(503);res.end();return;}
  let bytes=await readFile(archivo);
  if(rel==='version.js')bytes=Buffer.from(`export const VERSION_APP='${versiones[fase]}';`);
  if(rel==='sw.js')bytes=Buffer.from(bytes.toString().replace(/const VERSION_APP='[a-f0-9]+';/,`const VERSION_APP='${versiones[fase]}';`));
  res.writeHead(200,{'Content-Type':tipos[path.extname(archivo)]||'application/octet-stream','Cache-Control':'no-store'});res.end(bytes);
 }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>servidor.listen(0,'127.0.0.1',resolve));
const url=`http://127.0.0.1:${servidor.address().port}/mazo/`,key='white-death-gestor-v2',errores=[];
const browser=await chromium.launch({headless:true,channel:process.env.MAZO_NAVEGADOR||'chrome'});
try{
 const ctx=await browser.newContext({viewport:{width:1024,height:768}});
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'},1);spawn(s,()=>0);s.openBatch=false;
 let bytes=JSON.stringify(s);
 await ctx.addInitScript(({key,bytes})=>{if(!localStorage.getItem(key))localStorage.setItem(key,bytes);},{key,bytes});
 const p=await ctx.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(url);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 bytes=await p.evaluate(k=>localStorage.getItem(k),key);
 assert.equal(JSON.parse(bytes).history.length,1);
 assert.equal(await p.locator('#actualizacion-disponible').isVisible(),false);
 // Búsqueda explícita desde General: sin cambios, offline y borrador protegido.
 await p.getByRole('button',{name:'Configuración',exact:true}).click();
 await p.getByRole('tab',{name:'General',exact:true}).click();
 const buscar=p.locator('#buscar-actualizacion'),estado=p.locator('#actualizacion-estado');
 await buscar.click();await estado.filter({hasText:'No hay actualizaciones pendientes'}).waitFor();
 await ctx.setOffline(true);await buscar.click();await estado.filter({hasText:'Sin conexión'}).waitFor();await ctx.setOffline(false);
 await abrirSeccionesConfiguracion(p,'Apariencia',['puntaje']);await p.locator('#tema-puntaje').selectOption('dragon');await p.getByRole('tab',{name:'General',exact:true}).click();
 await buscar.click();assert.match(await estado.textContent(),/Guarda o descarta/);assert.equal(await p.locator('#tema-puntaje').inputValue(),'dragon');
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);
 await p.getByRole('tab',{name:'Apariencia',exact:true}).click();await p.locator('#tema-puntaje').selectOption('kang');await p.locator('#settings-dialog .close-button').click();
 await p.getByRole('button',{name:'Configuración',exact:true}).click();
 await abrirSeccionesConfiguracion(p,'Contenido',['cartas']);
 await p.locator('[name="filtro-contenido"][value="nigromantes"]').check();
 const muerte=p.locator('#content-selector .content-row').filter({hasText:'Death Notes:'});
 await muerte.locator('xpath=ancestor::details[1]').evaluate(e=>e.open=true);
 assert.equal(await muerte.locator('input[name="carta"]').isEnabled(),true);
 await muerte.getByRole('button',{name:/Consultar/}).click();
 assert.equal(await p.locator('#info-title').textContent(),'Death Notes');assert.equal(await p.locator('#info-content img').count(),1);
 await p.locator('#info-dialog [data-action="close"]').click();
 await p.locator('[name="filtro-contenido"][value="otros"]').check();
 assert.equal(await p.locator('#content-selector [data-id="referencia-death-notes"]').count(),0);
 await p.locator('#settings-dialog .close-button').click();
 const otra=await ctx.newPage();otra.on('pageerror',e=>errores.push(e.message));await otra.goto(url);
 await otra.getByRole('button',{name:'Configuración',exact:true}).click();
 await abrirSeccionesConfiguracion(otra,'Apariencia',['puntaje']);await otra.locator('#tema-puntaje').selectOption('dragon');
 fase=1;
 await p.evaluate(async()=>{await (await navigator.serviceWorker.getRegistration()).update();});
 await p.locator('#actualizacion-disponible').waitFor({state:'visible',timeout:90000});
 await p.reload();await p.locator('#actualizacion-disponible').waitFor({state:'visible'});
 assert.equal(await p.evaluate(async()=>(await import('./version.js')).VERSION_APP),versiones[0]);
 for(const [w,h] of [[1440,900],[1024,768],[844,390],[390,844],[320,568]]){
  await p.setViewportSize({width:w,height:h});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const b=await p.locator('#actualizar-app').boundingBox();assert.ok(b&&b.width>=44&&b.height>=44&&b.y>=0&&b.y+b.height<=h);
 }
 await mkdir('docs/verificacion',{recursive:true});await p.screenshot({path:'docs/verificacion/aviso-actualizacion.png',fullPage:true});
 // Un panel abierto puede contener un borrador: el botón no lo descarta.
 await p.getByRole('button',{name:'Configuración',exact:true}).click();
 await p.evaluate(()=>document.getElementById('actualizar-app').click());
 assert.match(await p.locator('#actualizacion-mensaje').textContent(),/Guarda o cierra/);
 assert.equal(await p.evaluate(async()=>Boolean((await navigator.serviceWorker.getRegistration()).waiting)),true);
 await p.getByRole('tab',{name:'General',exact:true}).click();
 for(const [w,h] of [[1440,900],[1024,768],[844,390],[390,844],[320,568]]){
  await p.setViewportSize({width:w,height:h});await buscar.scrollIntoViewIfNeeded();const b=await buscar.boundingBox();assert.ok(b&&b.width>=44&&b.height>=44&&b.x>=0&&b.x+b.width<=w);
 }
 await p.setViewportSize({width:1024,height:768});await p.screenshot({path:'docs/verificacion/actualizacion-general.png'});
 await Promise.all([p.waitForEvent('load'),buscar.click()]);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 assert.equal(await p.evaluate(async()=>(await import('./version.js')).VERSION_APP),versiones[1]);
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);
 // La otra pestaña conserva su borrador y sus módulos de la versión anterior.
 assert.equal(await otra.locator('#settings-dialog').isVisible(),true);
 assert.equal(await otra.locator('#tema-puntaje').inputValue(),'dragon');
 assert.equal(await otra.evaluate(async()=>await (await fetch('./version.js')).text()),`export const VERSION_APP='${versiones[0]}';`);
 await otra.locator('#save-settings').click();
 const guardado=await p.evaluate(k=>localStorage.getItem(k),key);
 await otra.locator('#actualizacion-disponible').waitFor({state:'visible'});
 await Promise.all([otra.waitForEvent('load'),otra.locator('#actualizar-app').click()]);
 await otra.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor();
 assert.equal(await otra.evaluate(async()=>(await import('./version.js')).VERSION_APP),versiones[1]);
 assert.equal(await otra.evaluate(k=>localStorage.getItem(k),key),guardado);
 // Segunda actualización: comprobar offline no puede borrar el paquete en espera.
 fase=2;await p.evaluate(async()=>{await (await navigator.serviceWorker.getRegistration()).update();});
 await p.locator('#actualizacion-disponible').waitFor({state:'visible',timeout:90000});
 await p.evaluate(()=>window.dispatchEvent(new Event('online')));
 await ctx.setOffline(true);
 await Promise.all([p.waitForEvent('load'),p.locator('#actualizar-app').click()]);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor();
 assert.equal(await p.evaluate(async()=>(await import('./version.js')).VERSION_APP),versiones[2]);
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),guardado);
 await ctx.setOffline(false);fase=3;fallarDescarga=true;
 await p.getByRole('button',{name:'Configuración',exact:true}).click();await p.getByRole('tab',{name:'General',exact:true}).click();await buscar.click();
 await estado.filter({hasText:'No se pudo comprobar o descargar'}).waitFor({timeout:45000});assert.equal(await buscar.isEnabled(),true);
 await p.locator('#offline-status').filter({hasText:'Descarga offline incompleta'}).waitFor({timeout:90000});
 assert.equal(await p.evaluate(async()=>Boolean((await navigator.serviceWorker.getRegistration()).waiting)),false);
 assert.equal(await p.locator('#actualizacion-disponible').isVisible(),false);
 await ctx.setOffline(true);await p.reload();
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor();
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),guardado);
 // También se conserva la activación automática al cerrar las ventanas.
 await ctx.setOffline(false);fallarDescarga=false;
 await p.evaluate(async()=>{await (await navigator.serviceWorker.getRegistration()).update();});
 await p.locator('#actualizacion-disponible').waitFor({state:'visible',timeout:90000});
 const control=await ctx.newPage();await control.goto(new URL('/control.html',url).href);
 await p.close();await otra.close();
 await control.waitForFunction(async()=>{const r=await navigator.serviceWorker.getRegistration('/mazo/');return r?.active?.state==='activated'&&!r.waiting;},{},{timeout:20000});
 const final=await ctx.newPage();await final.goto(url);
 await final.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor();
 assert.equal(await final.evaluate(async()=>(await import('./version.js')).VERSION_APP),versiones[3]);
 assert.equal(await final.evaluate(k=>localStorage.getItem(k),key),guardado);
 await final.waitForFunction(async()=>{
  const paquetes=(await caches.keys()).filter(k=>k.startsWith('white-death-')&&!k.endsWith('-clientes'));
  return paquetes.length===1&&paquetes[0].endsWith('4444444444444444');
 });
 // Una sola pulsación busca, descarga y aplica una versión que aún no estaba en espera.
 fase=4;await final.getByRole('button',{name:'Configuración',exact:true}).click();await final.getByRole('tab',{name:'General',exact:true}).click();
 await Promise.all([final.waitForEvent('load'),final.locator('#buscar-actualizacion').click()]);
 await final.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 assert.equal(await final.evaluate(async()=>(await import('./version.js')).VERSION_APP),versiones[4]);
 assert.equal(await final.evaluate(k=>localStorage.getItem(k),key),guardado);
 assert.deepEqual(errores,[]);await ctx.close();
 console.log('Actualización: Death Notes seleccionable y consultable, aviso y cinco tamaños, protección de paneles, dos pestañas y borrador conservados, paquetes independientes, actualizaciones sucesivas, activación offline, descarga fallida y activación automática sin pérdida de partida.');
}finally{await browser.close();await new Promise(resolve=>servidor.close(resolve));}
