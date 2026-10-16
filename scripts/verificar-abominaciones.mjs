import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {newGame} from '../dist/engine.js';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/';
const salida=new URL('../docs/verificacion/',import.meta.url);await mkdir(salida,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
const semilla=newGame({easy:true,normal:true,threshold:0,selectedIds:['abominacion'],modoAbominaciones:'sin-reposicion'},3);
const key='white-death-gestor-v2',errores=[];
const estado=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
try{
 const context=await browser.newContext({viewport:{width:844,height:390}});
 await context.addInitScript(({key,semilla})=>{
  if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));
  Math.random=()=>0;
 },{key,semilla});
 const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));
 await p.goto(url);await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 await p.locator('#spawn').click();
 await p.waitForFunction(()=>['eleccion','lista'].includes(document.querySelector('#batch-dialog').dataset.revelacion));
 assert.equal(await p.locator('#batch-grid article').count(),4);
 assert.deepEqual(await p.locator('#batch-grid .zone-label').allTextContents(),['Zona 1','Zona 1','Zona 2','Zona 3']);
 assert.equal(await p.locator('#batch-grid article').nth(1).locator('[data-action="discard"]').count(),0);
 assert.equal(await p.locator('#batch-grid .enemy-choices button').count(),3);
 assert.equal(await p.locator('#batch-grid .spawn-applied').count(),1);
 assert.equal(await p.locator('#batch-grid .reveal-pair').count(),1);
 assert.equal(await p.locator('#batch-grid article').nth(2).locator('.card-image img').evaluate(e=>getComputedStyle(e).filter),'none');
 const inicial=await estado(p);assert.equal(inicial.pins.length,1);
 for(const [nombre,tamano] of [['horizontal',{width:844,height:390}],['vertical',{width:390,height:844}],['estrecho',{width:320,height:568}],['tablet',{width:1024,height:768}]]){
  await p.setViewportSize(tamano);
  await p.locator('#batch-grid img').evaluateAll(async imgs=>Promise.all(imgs.map(i=>i.decode())));
  const fallos=await p.locator('#batch-grid').evaluate(grid=>[...grid.querySelectorAll('button,.zone-label,.card-label')].filter(e=>{
   const r=e.getBoundingClientRect();return r.left<0||r.right>innerWidth||e.scrollWidth>e.clientWidth+2;
  }).map(e=>e.textContent));assert.deepEqual(fallos,[]);
  assert.ok(await p.locator('#batch-grid img').evaluateAll(imgs=>imgs.every(i=>i.naturalWidth>0)));
  assert.ok(await p.locator('#batch-grid .reveal-pair').evaluateAll(pairs=>pairs.every(pair=>{
   const [a,b]=pair.querySelectorAll('.card-media'),ra=a.getBoundingClientRect(),rb=b.getBoundingClientRect();
   return Math.abs(ra.top-rb.top)<1&&ra.right<rb.left&&getComputedStyle(a,'::after').content!=='none';
  })));
  await p.screenshot({path:fileURLToPath(new URL(`abominaciones-${nombre}.png`,salida)),fullPage:true});
 }
 await p.setViewportSize({width:844,height:390});
 await p.reload();assert.deepEqual(await estado(p),inicial);
 await p.locator('#batch-grid article').nth(2).locator('[data-value="activacion"]').click();
 assert.equal((await estado(p)).pins.length,1);assert.equal(await p.locator('#batch-grid .activation-stamp').count(),1);
 assert.equal(await p.locator('#batch-grid article').nth(2).locator('.card-image img').evaluate(e=>getComputedStyle(e).filter),'none');
 await p.screenshot({path:fileURLToPath(new URL('activacion-sello.png',salida)),fullPage:true});
 await p.locator('#batch-grid [data-value="spawn"]').click();const dos=await estado(p);
 assert.equal(dos.pins.length,2);assert.equal(await p.locator('#batch-grid article').count(),5);
 assert.equal(await p.locator('#batch-grid .spawn-applied').count(),2);
 await p.reload();assert.deepEqual(await estado(p),dos);
 await p.locator('#batch-grid [data-action="regenerar-abominacion"]').first().click();
 const regenerado=await estado(p);assert.equal(regenerado.pins.length,2);assert.equal(regenerado.unpinned.length,1);
 assert.equal(regenerado.history[0].slots[0].draws[0].abominaciones.length,2);
 assert.deepEqual(regenerado.remaining,dos.remaining);
 await p.locator('#batch-grid article').nth(0).locator('[data-action="discard"]').click();
 const descartado=await estado(p);assert.equal(descartado.pins.length,1);assert.equal(descartado.unpinned.length,2);
 assert.equal(await p.locator('#batch-grid article').count(),4);
 await p.locator('#batch-grid [data-action="zoom"]').last().click();
 await p.locator('#zoom-content img').evaluate(i=>i.decode());
 assert.ok(await p.locator('#zoom-content img').evaluate(i=>i.naturalWidth>0));
 await p.keyboard.press('Escape');assert.ok(await p.locator('#batch-dialog').isVisible());
 await p.locator('#batch-dialog [data-action="close"]').click();
 await p.locator('[data-action="history"]').click();assert.equal(await p.locator('#history-list .discard-tag').filter({hasText:'Anulada'}).count(),2);
 assert.equal(await p.locator('#history-list [data-action="regenerar-abominacion"]').count(),0);
 await p.locator('#history-dialog [data-action="close"]').click();
 await p.locator('[data-action="settings"]').click();await p.locator('#modo-abominaciones').selectOption('con-reposicion');
 await p.locator('#save-settings').click();assert.equal((await estado(p)).abominaciones.modo,'sin-reposicion');
 await p.locator('[data-action="settings"]').click();assert.equal(await p.locator('#modo-abominaciones').inputValue(),'con-reposicion');
 await p.locator('#new-game').click();await p.locator('[data-action="confirm"][data-value="yes"]').click();
 assert.equal((await estado(p)).abominaciones.modo,'con-reposicion');assert.equal((await estado(p)).pins.length,0);
 await p.evaluate(()=>Math.random=()=>.4);
 await p.locator('#spawn').click();await p.locator('#batch-grid [data-value="spawn"]').first().click();
 const reposicion=await estado(p);assert.equal(reposicion.pins[0].cardId,reposicion.pins[1].cardId);
 await context.setOffline(true);await p.reload();assert.deepEqual(await estado(p),reposicion);
 await p.locator('#batch-grid [data-action="regenerar-abominacion"]').first().click();
 const offline=await estado(p);await p.reload();assert.deepEqual(await estado(p),offline);
 // Fallo de escritura despues del sorteo secundario: UI y bytes siguen intactos.
 await p.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Sin espacio','QuotaExceededError');};});
 await p.locator('#batch-grid [data-action="regenerar-abominacion"]').first().click();assert.deepEqual(await estado(p),offline);
 assert.deepEqual(errores,[]);
 await context.close();
 console.log('Abominaciones: 4 viewports, misma zona, elecciones, regeneracion, descarte, historial, modos, recarga, offline y cuota comprobados.');
}finally{await browser.close();}
