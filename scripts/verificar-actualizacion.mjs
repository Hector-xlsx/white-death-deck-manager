import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import assert from 'node:assert/strict';
import {newGame} from '../dist/engine.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const raiz=fileURLToPath(new URL('../dist/',import.meta.url));
let nueva=false;
const versionNueva='prueba-actualizacion-v2';
const server=http.createServer(async(req,res)=>{
 try{
  if(req.url==='/control.html'){res.writeHead(200,{'Content-Type':'text/html'});res.end('<!DOCTYPE html><title>Control de prueba</title>');return;}
  const relativa=decodeURIComponent(new URL(req.url,'http://localhost').pathname.slice('/mazo/'.length))||'index.html';
  const archivo=path.join(raiz,relativa);
  let bytes=await readFile(archivo);
  if(nueva&&['sw.js','version.js'].includes(relativa))bytes=Buffer.from(bytes.toString().replace(/const VERSION_APP='[^']+'/,`const VERSION_APP='${versionNueva}'`));
  const tipo=archivo.endsWith('.js')?'text/javascript':archivo.endsWith('.css')?'text/css':archivo.endsWith('.html')?'text/html':archivo.endsWith('.png')?'image/png':'application/octet-stream';
  res.writeHead(200,{'Content-Type':tipo,'Cache-Control':'no-store'});res.end(bytes);
 }catch{res.writeHead(404);res.end();}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const origen=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({headless:true,channel:process.env.MAZO_NAVEGADOR||'chrome'});
try{
 const contexto=await browser.newContext();
 await contexto.addInitScript(semilla=>{
  if(!localStorage.getItem('white-death-gestor-v2'))localStorage.setItem('white-death-gestor-v2',JSON.stringify(semilla));
  Math.random=()=>0;
 },newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion'],modoNigromantes:'sin-reposicion'},2));
 const page=await contexto.newPage();await page.goto(`${origen}/mazo/`);
 await page.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:60000});
 await page.locator('#spawn').click();
 const estado=await page.evaluate(()=>localStorage.getItem('white-death-gestor-v2'));
 const antigua=await page.evaluate(async()=> (await import('./version.js')).VERSION_APP);
 nueva=true;
 await page.evaluate(async()=>{window.registroPrueba=await navigator.serviceWorker.getRegistration();await window.registroPrueba.update();});
 await page.waitForFunction(()=>window.registroPrueba.waiting?.state==='installed',{},{timeout:60000});
 assert.equal(await page.evaluate(async()=> (await import('./version.js')).VERSION_APP),antigua);
 await page.reload();await page.locator('#batch-dialog').waitFor({state:'visible'});
 assert.equal(await page.evaluate(async()=> (await import('./version.js')).VERSION_APP),antigua);
 assert.equal(await page.evaluate(()=>localStorage.getItem('white-death-gestor-v2')),estado);
 const control=await contexto.newPage();await control.goto(`${origen}/control.html`);
 await page.close();
 await control.evaluate(async()=>window.registroPrueba=await navigator.serviceWorker.getRegistration('/mazo/'));
 await control.waitForFunction(()=>window.registroPrueba.active?.state==='activated'&&!window.registroPrueba.waiting,{},{timeout:15000});
 const paquete=await control.evaluate(async()=>{
  const canal=new MessageChannel();const resultado=await new Promise(resolve=>{canal.port1.onmessage=e=>resolve(e.data);window.registroPrueba.active.postMessage({tipo:'comprobar-offline'},[canal.port2]);});canal.port1.close();return resultado;
 });assert.deepEqual(paquete,{version:versionNueva,completa:true});
 const actualizada=await contexto.newPage();await actualizada.goto(`${origen}/mazo/`);
 await actualizada.locator('#batch-dialog').waitFor({state:'visible'});
 assert.equal(await actualizada.evaluate(async()=> (await import('./version.js')).VERSION_APP),versionNueva);
 assert.equal(await actualizada.evaluate(()=>localStorage.getItem('white-death-gestor-v2')),estado);
 await contexto.setOffline(true);await actualizada.reload();await actualizada.locator('#batch-dialog').waitFor({state:'visible'});
 assert.equal(await actualizada.evaluate(()=>localStorage.getItem('white-death-gestor-v2')),estado);
 console.log('Actualizacion: espera al cierre de pestañas, conserva paquete anterior al recargar y mantiene partida/offline tras activar.');
}finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
