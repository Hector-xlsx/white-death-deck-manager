import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {newGame} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/',key='white-death-gestor-v2';
const salida=new URL('../docs/verificacion/',import.meta.url);await mkdir(salida,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
const estado=p=>p.evaluate(k=>localStorage.getItem(k),key);
const esperar=p=>p.waitForFunction(()=>['eleccion','lista'].includes(document.querySelector('#batch-dialog').dataset.revelacion)&&!document.querySelector('#batch-grid .volteando'));
try{
 for(const [tipo,zonas] of [['nigromante',1],['abominacion',3]]){
  const semilla=newGame({easy:true,normal:true,threshold:0,selectedIds:[tipo],modoNigromantes:'sin-reposicion'},zonas);
  const context=await browser.newContext({viewport:{width:844,height:390}});
  await context.addInitScript(({key,semilla})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));Math.random=()=>0;},{key,semilla});
  const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(url);
  await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
  await p.locator('#spawn').click();
  assert.equal(await p.locator('#batch-grid .volteando .reveal-back').count(),1);
  assert.equal(await p.locator('#batch-grid .por-revelar').count(),zonas-1);
  assert.ok(await p.locator('#batch-grid .volteando').evaluateAll(async cartas=>(await Promise.all(cartas.map(async c=>{const reverso=c.querySelector('.reveal-back'),css=getComputedStyle(reverso),imagen=new Image();imagen.src=css.backgroundImage.slice(5,-2);await imagen.decode();return c.inert&&css.backgroundSize==='contain'&&imagen.naturalWidth>0&&imagen.src.includes('Contratapa')&&reverso.textContent==='';}))).every(Boolean)));
  const demoras=await p.locator('#batch-grid .volteando .reveal-front').evaluateAll(cs=>cs.map(c=>parseFloat(getComputedStyle(c).animationDelay)));
  assert.ok(demoras.every((d,i)=>!i||d>demoras[i-1]));
  await p.screenshot({path:fileURLToPath(new URL(`volteo-${tipo}-reversos.png`,salida))});
  const guardado=await estado(p);await esperar(p);assert.equal(await estado(p),guardado);
  assert.equal(await p.locator('#batch-grid [inert]').count(),await p.locator('#batch-grid .por-revelar').count());
  const anteriores=await p.locator('#batch-grid article').evaluateAll(cs=>cs.map(c=>c.dataset.extraccion));
  await p.locator(`#batch-grid [data-action="elegir-${tipo}"][data-value="spawn"]`).first().click();
  const nuevos=await p.locator('#batch-grid .volteando').evaluateAll(cs=>cs.map(c=>c.dataset.extraccion));
  assert.equal(nuevos.length,1);assert.ok(nuevos.every(id=>!anteriores.includes(id)));
  const elegido=await estado(p);await esperar(p);assert.equal(await estado(p),elegido);
  for(const [nombre,viewport] of [['horizontal',{width:844,height:390}],['vertical',{width:390,height:844}],['tablet',{width:1024,height:768}]]){
   await p.setViewportSize(viewport);await p.locator('#batch-grid img').evaluateAll(imgs=>Promise.all(imgs.map(i=>i.decode())));
   assert.ok(await p.locator('#batch-grid .card-media').evaluateAll(cs=>cs.every(c=>{const r=c.getBoundingClientRect();return r.width>0&&r.left>=0&&r.right<=innerWidth;})));
   await p.screenshot({path:fileURLToPath(new URL(`volteo-${tipo}-${nombre}.png`,salida)),fullPage:true});
  }
  await p.locator('#batch-dialog [data-action="close"]').click();await p.locator('#reopen').click();
  assert.equal(await p.locator('#batch-grid .volteando').count(),0);
  await p.reload();assert.equal(await p.locator('#batch-grid .volteando').count(),0);
  assert.equal(await estado(p),elegido);
  await p.locator('#batch-dialog [data-action="close"]').click();await p.locator('#spawn').click();
  await p.locator('#batch-dialog [data-action="close"]').click();await p.locator('#reopen').click();
  assert.equal(await p.locator('#batch-grid .volteando').count(),0);
  await p.locator('#batch-dialog [data-action="close"]').click();await p.emulateMedia({reducedMotion:'reduce'});
  await p.locator('#spawn').click();assert.equal(await p.locator('#batch-grid .volteando').count(),0);
  const antesOffline=await estado(p);await context.setOffline(true);await p.reload();assert.equal(await estado(p),antesOffline);
  await p.locator('#batch-dialog [data-action="close"]').click();await p.emulateMedia({reducedMotion:'no-preference'});await p.locator('#spawn').click();
  assert.ok(await p.locator('#batch-grid .reveal-back').first().evaluate(async e=>{const i=new Image();i.src=getComputedStyle(e).backgroundImage.slice(5,-2);await i.decode();return i.naturalWidth>0&&i.src.includes('Contratapa');}));
  await context.close();
 }
 assert.deepEqual(errores,[]);console.log('Contratapa y volteo automático/derivadas verificados, imagen íntegra, guardado estable, reapertura sin animación, movimiento reducido, tres tamaños y contratapa decodificada offline.');
}finally{await browser.close();}
