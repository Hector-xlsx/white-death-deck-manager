import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/',key='white-death-gestor-v2';
const salida=new URL('../docs/verificacion/',import.meta.url);await mkdir(salida,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
const estado=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
const lista=p=>p.waitForFunction(()=>document.querySelector('#batch-dialog').dataset.revelacion==='lista');
function cartasVisuales(b){
 const cartas=[];
 function visitar(t){const c=t.draws.at(-1);cartas.push(c);for(const a of c.abominaciones||[])if(!a.anulada)cartas.push(a);for(const n of c.nigromantes||[])if(!n.anulada){cartas.push(n);visitar(b.slots.find(t=>t.id===n.spawnSlotId));}}
 for(const t of b.slots.filter(t=>t.kind!=='derivada'))visitar(t);return cartas;
}
try{
 for(const manual of [false,true]){
  // Perfil de prueba para ejercitar la cadena de tres nigromantes sin detenerla en el default Azul=1.
  const limitesPorAdrenalina={nigromantes:{azul:3,amarillo:3,naranja:3,rojo:3},abominaciones:{azul:2,amarillo:2,naranja:2,rojo:2}};
  const semilla=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion','asedio'],modoNigromantes:'sin-reposicion',limitesPorAdrenalina},1);
  let i=0;spawn(semilla,()=>i++<2?0:.99);semilla.normal=2;semilla.openBatch=false;semilla.accionesPredeterminadas={nigromante:manual?'elegir':'spawn',abominacion:'spawn'};
  const context=await browser.newContext({viewport:{width:844,height:390}});
  await context.addInitScript(({key,semilla})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));Math.random=()=>window.azarPrueba?.shift()??.99;},{key,semilla});
  const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(url);
  await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
  const antes=await estado(p);
  await p.evaluate(manual=>{
   window.azarPrueba=manual?[0,.4,0,.99]:[0,0,0,0,.99,.4,0,.99];window.insertadas=[];window.volteadas=[];const vistas=new Set(),giradas=new Set();
   new MutationObserver(()=>{for(const c of document.querySelectorAll('#batch-grid article')){const uid=Number(c.dataset.extraccion);if(!vistas.has(uid)){vistas.add(uid);window.insertadas.push({uid,t:performance.now()});}if(c.classList.contains('volteando')&&!giradas.has(uid)){giradas.add(uid);window.volteadas.push({uid,t:performance.now()});}}}).observe(document.querySelector('#batch-grid'),{childList:true,subtree:true});
  },manual);
  await p.locator('#spawn').click();await p.waitForFunction(()=>document.querySelector('#batch-grid .volteando'));
  const inicial=await estado(p),b=inicial.history.at(-1),raices=b.slots.filter(t=>t.kind!=='derivada').map(t=>t.draws.at(-1).uid);
  assert.equal(raices.length,3);assert.deepEqual(await p.locator('#batch-grid article').evaluateAll(cs=>cs.map(c=>Number(c.dataset.extraccion))),raices);
  assert.equal(await p.locator('#batch-grid .enemy-choices').count(),0);assert.equal(await p.locator('#batch-grid .spawn-applied').count(),0);
  assert.equal(await p.locator('#batch-grid .volteando').count(),1);assert.equal(await p.locator('#batch-grid .por-revelar').count(),2);assert.equal(await p.locator('#pins').evaluate(e=>getComputedStyle(e).visibility),'hidden');
  await p.screenshot({path:fileURLToPath(new URL(`procedural-${manual?'manual':'auto'}-iniciales.png`,salida))});
  if(manual){
   await p.waitForFunction(()=>document.querySelector('#batch-dialog').dataset.revelacion==='eleccion');
   assert.equal(await p.locator('#batch-grid article').count(),3);
   assert.equal(await p.locator('#batch-grid .por-revelar').count(),2);
   assert.equal(await p.locator('#batch-grid .enemy-choices').count(),1);assert.equal(await p.locator('#batch-grid [data-action="elegir-nigromante"]').count(),3);
   assert.deepEqual(await estado(p),inicial);
   await p.evaluate(()=>window.azarPrueba=[0,.99]);await p.locator('#batch-grid [data-action="elegir-nigromante"][data-value="spawn"]').click();
  }
  const resuelto=await estado(p),visual=cartasVisuales(resuelto.history.at(-1)),derivadas=visual.filter(c=>!raices.includes(c.uid)).map(c=>c.uid);
  assert.equal(derivadas.length,manual?3:5);const total=raices.length+derivadas.length;
  await p.waitForFunction(()=>document.querySelectorAll('#batch-grid article').length===4);
  assert.equal(await p.locator('#batch-grid .volteando').count(),1);
  assert.equal(await p.locator('#batch-grid .por-revelar').count(),2);
  await p.screenshot({path:fileURLToPath(new URL(`procedural-${manual?'manual':'auto'}-primer-enemigo.png`,salida))});
  await lista(p);assert.equal(await p.locator('#batch-grid article').count(),total);assert.equal(await p.locator('#batch-grid .volteando').count(),0);
  assert.deepEqual(await estado(p),resuelto);
  const insertadas=await p.evaluate(()=>window.insertadas);assert.deepEqual(insertadas.map(c=>c.uid),[...raices,...derivadas]);
  const extras=insertadas.slice(raices.length);assert.ok(extras.every((c,i)=>!i||c.t-extras[i-1].t>=400));
  const volteadas=await p.evaluate(()=>window.volteadas);assert.deepEqual(volteadas.map(c=>c.uid),visual.map(c=>c.uid));
  assert.ok(volteadas.every((c,i)=>!i||c.t-volteadas[i-1].t>=(raices.includes(volteadas[i-1].uid)?680:980)));assert.equal(await p.locator('#batch-grid .por-revelar').count(),0);
  assert.equal(await p.locator('#pins').evaluate(e=>getComputedStyle(e).visibility),'visible');
  for(const [nombre,viewport] of [['horizontal',{width:844,height:390}],['vertical',{width:390,height:844}],['estrecho',{width:320,height:568}],['tablet',{width:1024,height:768}]]){
   await p.setViewportSize(viewport);assert.ok(await p.locator('#batch-grid article').evaluateAll(cs=>cs.every(c=>{const r=c.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.width>0;})));
   await p.screenshot({path:fileURLToPath(new URL(`procedural-${manual?'manual':'auto'}-${nombre}.png`,salida)),fullPage:true});
  }
  await p.locator('#batch-dialog [data-action="close"]').click();await p.locator('#reopen').click();assert.equal(await p.locator('#batch-dialog').getAttribute('data-revelacion'),'lista');assert.equal(await p.locator('#batch-grid article').count(),total);
  await context.setOffline(true);await p.reload();assert.equal(await p.locator('#batch-dialog').getAttribute('data-revelacion'),'lista');assert.deepEqual(await estado(p),resuelto);
  await p.locator('#batch-dialog [data-action="close"]').click();
  await p.evaluate(()=>window.azarPrueba=[0,.99,.99,.99,.99,.99,.99]);await p.locator('#spawn').click();
  const durante=await estado(p);await p.reload();assert.equal(await p.locator('#batch-dialog').getAttribute('data-revelacion'),'lista');assert.deepEqual(await estado(p),durante);
  await p.locator('#batch-dialog [data-action="close"]').click();await p.locator('#spawn').click();
  await p.locator('#batch-dialog [data-action="close"]').click();await p.locator('#reopen').click();assert.equal(await p.locator('#batch-dialog').getAttribute('data-revelacion'),'lista');
  await p.locator('#batch-dialog [data-action="close"]').click();await p.emulateMedia({reducedMotion:'reduce'});await p.locator('#spawn').click();
  await p.waitForFunction(()=>['lista','eleccion'].includes(document.querySelector('#batch-dialog').dataset.revelacion));assert.equal(await p.locator('#batch-grid .volteando').count(),0);
  await p.locator('#batch-dialog [data-action="close"]').click();await p.emulateMedia({reducedMotion:'no-preference'});
  await p.waitForFunction(k=>!JSON.parse(localStorage.getItem(k)).openBatch,key);
  const antesAnular=await estado(p);await p.locator('#spawn').click();
  await p.locator('#anular-tanda').click();await p.locator('#confirm-dialog [data-action="confirm"][data-value="yes"]').click();
  await p.locator('#batch-dialog').waitFor({state:'hidden'});
  assert.deepEqual(await estado(p),{...antesAnular,respaldoTanda:null,openBatch:false});assert.equal(await p.locator('body.revelacion-procedural').count(),0);
  await p.locator('#spawn').click();const cierreFallido=await estado(p);
  await p.evaluate(()=>{window.escrituraOriginal=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new DOMException('Quota','QuotaExceededError');};});
  await p.locator('#batch-dialog [data-action="close"]').click();await p.locator('#batch-dialog').waitFor({state:'visible'});
  assert.equal(await p.locator('#batch-dialog').getAttribute('data-revelacion'),'lista');
  assert.equal(await p.locator('#batch-grid article').count(),cartasVisuales(cierreFallido.history.at(-1)).length);assert.deepEqual(await estado(p),cierreFallido);
  await p.evaluate(()=>Storage.prototype.setItem=window.escrituraOriginal);await p.locator('#batch-dialog [data-action="close"]').click();
  await p.waitForFunction(k=>!JSON.parse(localStorage.getItem(k)).openBatch,key);
  const antesCuota=await estado(p);await p.evaluate(()=>Storage.prototype.setItem=()=>{throw new DOMException('Quota','QuotaExceededError');});
  await p.locator('#spawn').click();assert.deepEqual(await estado(p),antesCuota);assert.equal(await p.locator('body.revelacion-procedural').count(),0);assert.equal(await p.locator('#batch-dialog').isVisible(),false);
  assert.ok(antes.history.length);await context.close();
 }
 assert.deepEqual(errores,[]);console.log('Revelación procedural: N reversos, cada inicial y su cadena antes de la siguiente, orden serial de todos los giros, pausa manual, guardado estable, recarga/cierre, cuota, anulación, movimiento reducido, offline y cuatro viewports.');
}finally{await browser.close();}
