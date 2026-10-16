import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/',key='white-death-gestor-v2';
const semilla=newGame({easy:true,normal:true,threshold:0,modoNigromantes:'sin-reposicion'},1);
spawn(semilla,()=>0);semilla.openBatch=false;
const salida=new URL('../docs/verificacion/',import.meta.url);await mkdir(salida,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
const estado=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
const filtro=(p,v)=>p.locator(`[name="filtro-contenido"][value="${v}"]`).check();
const cerrar=p=>p.locator('#settings-dialog [data-action="close"]').click();
const confirmar=(p,v)=>p.locator(`#confirm-dialog [data-action="confirm"][data-value="${v}"]`).click();
try{
 const context=await browser.newContext({viewport:{width:844,height:390}});
 await context.addInitScript(({key,semilla})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));Math.random=()=>0;},{key,semilla});
 const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));
 await p.goto(url);await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 const antes=await estado(p);await p.locator('[data-action="settings"]').click();await filtro(p,'abominaciones');
 assert.equal(await p.locator('#content-selector input[name="carta"]:not(:disabled)').count(),20);
 for(const [nombre,viewport] of [['horizontal',{width:844,height:390}],['vertical',{width:390,height:844}],['estrecho',{width:320,height:568}],['tablet',{width:1024,height:768}]]){
  await p.setViewportSize(viewport);
  for(const categoria of ['zombies','abominaciones','nigromantes','otros']){
   await filtro(p,categoria);await p.locator('#content-selector').scrollIntoViewIfNeeded();
   assert.equal(await p.locator('#content-selector .check-row').count(),0);
   assert.ok(await p.locator('#content-selector .content-row').evaluateAll(filas=>filas.every(fila=>{
    const r=fila.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&fila.scrollWidth<=fila.clientWidth+1;
   })));
   if(categoria!=='zombies')assert.ok(await p.locator('#content-selector label.content-row').evaluateAll(filas=>filas.every(fila=>{
    const texto=fila.querySelector('.content-name').getBoundingClientRect(),input=fila.querySelector('input').getBoundingClientRect();
    return texto.right<=input.left&&fila.querySelector('.content-controls').lastElementChild.tagName==='INPUT';
   })));
   await p.screenshot({path:fileURLToPath(new URL(`contenido-unificado-${categoria}-${nombre}.png`,salida)),fullPage:true});
  }
 }
 await p.setViewportSize({width:844,height:390});await filtro(p,'abominaciones');
 await p.locator('.collection-section summary').click();
 assert.equal(await p.locator('[name="caja"][value="core"]').isDisabled(),true);
 for(const id of await p.locator('[name="caja"]:not(:disabled)').evaluateAll(inputs=>inputs.map(e=>e.value)))await p.locator(`[name="caja"][value="${id}"]`).uncheck();
 assert.equal(await p.locator('#content-selector input[name="carta"]').count(),1);
 assert.equal(await p.locator('[name="carta"][value="enemigo-abominacion-kan"]').isChecked(),true);
 await p.locator('[data-action="marcar-contenido"][data-value="no"]').click();
 assert.equal(await p.locator('#new-game').isDisabled(),true);assert.ok((await p.locator('#settings-errors').textContent()).includes('abominación'));
 await filtro(p,'nigromantes');assert.equal(await p.locator('#content-selector input[name="carta"]:checked').count(),1);
 await filtro(p,'otros');assert.equal(await p.locator('#content-selector input[name="carta"]:checked:disabled').count(),6);
 assert.equal(await p.locator('[data-action="marcar-contenido"][data-value="no"]').isDisabled(),true);
 await p.setViewportSize({width:1024,height:768});await p.locator('.content-filters').scrollIntoViewIfNeeded();
 await p.screenshot({path:fileURLToPath(new URL('contenido-otros-obligatorios.png',salida)),fullPage:true});
 await filtro(p,'zombies');await p.locator('[data-action="marcar-contenido"][data-value="no"]').click();
 assert.ok((await p.locator('#settings-summary').textContent()).includes('28 cartas'));
 await filtro(p,'abominaciones');await p.locator('[name="caja"][value="core-retrocompatibilidad"]').check();
 assert.equal(await p.locator('#content-selector input[name="carta"]:checked').count(),3);
 assert.equal(await p.locator('[name="carta"][value="enemigo-abominacion-kan"]').isChecked(),false);
 await p.locator('[name="caja"][value="core-retrocompatibilidad"]').uncheck();
 await p.locator('[data-action="marcar-contenido"][data-value="si"]').click();assert.equal(await p.locator('#new-game').isEnabled(),true);
 for(const [nombre,tamano] of [['horizontal',{width:844,height:390}],['vertical',{width:390,height:844}],['estrecho',{width:320,height:568}],['tablet',{width:1024,height:768}]]){
  await p.setViewportSize(tamano);await p.locator('.collection-section').scrollIntoViewIfNeeded();
  await p.screenshot({path:fileURLToPath(new URL(`coleccion-${nombre}.png`,salida)),fullPage:true});
  await p.locator('.content-filters').scrollIntoViewIfNeeded();
  assert.deepEqual(await p.locator('#settings-dialog').evaluate(d=>[...d.querySelectorAll('button,label,summary')].filter(e=>e.getClientRects().length).filter(e=>{const r=e.getBoundingClientRect();return r.left<0||r.right>innerWidth||e.scrollWidth>e.clientWidth+2;}).map(e=>e.textContent.trim())),[]);
  await p.screenshot({path:fileURLToPath(new URL(`contenido-${nombre}.png`,salida)),fullPage:true});
  await filtro(p,'zombies');await p.locator('#content-selector').scrollIntoViewIfNeeded();
  assert.equal(await p.locator('#content-selector .zombie-row').count(),3);
  assert.ok(await p.locator('#settings-dialog').evaluate(d=>d.getBoundingClientRect().width>=Math.min(800,innerWidth-28)-1));
  assert.ok(await p.locator('.zombie-row').evaluateAll(filas=>filas.every(fila=>{
   const opciones=[...fila.querySelectorAll('.zombie-option')],r=fila.getBoundingClientRect();
   const [facil,normal]=opciones.map(e=>e.getBoundingClientRect());
   return opciones[0].querySelector('span').textContent==='Fácil'&&opciones[1].querySelector('span').textContent==='Normal'&&r.left>=0&&r.right<=innerWidth&&facil.right<=normal.left&&Math.abs(facil.top-normal.top)<1&&fila.scrollWidth<=fila.clientWidth+1;
  })));
  await p.screenshot({path:fileURLToPath(new URL(`contenido-compacto-${nombre}.png`,salida)),fullPage:true});
  await filtro(p,'abominaciones');
 }
 await p.keyboard.press('Escape');assert.equal(await p.locator('#confirm-dialog').isVisible(),true);
 assert.equal(await p.locator('#confirm-actions button').count(),3);
 await confirmar(p,'volver');assert.equal(await p.locator('#settings-dialog').isVisible(),true);assert.deepEqual(await estado(p),antes);
 await cerrar(p);await confirmar(p,'guardar');await p.locator('#settings-dialog').waitFor({state:'hidden'});
 const guardado=await estado(p);assert.deepEqual(guardado.proximaConfig.coleccionIds,['core']);
 assert.equal(guardado.proximaConfig.selectedIds.length,6);assert.deepEqual(guardado.history,antes.history);
 assert.deepEqual(guardado.pins,antes.pins);assert.deepEqual(guardado.nigromantes,antes.nigromantes);assert.deepEqual(guardado.remaining,antes.remaining);
 await p.locator('[data-action="settings"]').click();await filtro(p,'otros');await cerrar(p);
 assert.equal(await p.locator('#confirm-dialog').isVisible(),false);
 await p.locator('#settings-dialog').waitFor({state:'hidden'});await p.locator('[data-action="settings"]').click();
 await p.locator('#modo-abominaciones').selectOption('con-reposicion');await cerrar(p);await confirmar(p,'salir');
 await p.locator('#settings-dialog').waitFor({state:'hidden'});assert.deepEqual(await estado(p),guardado);
 await context.setOffline(true);await p.reload();await p.locator('[data-action="settings"]').click();await filtro(p,'abominaciones');
 assert.equal(await p.locator('#content-selector input[name="carta"]:checked').count(),1);
 await p.locator('#new-game').click();await confirmar(p,'yes');await p.locator('#settings-dialog').waitFor({state:'hidden'});
 assert.equal((await estado(p)).nigromantes.cartas.length,1);assert.equal((await estado(p)).abominaciones.cartas.length,1);
 await p.locator('#spawn').click();assert.equal((await estado(p)).pins[0].cardId,'enemigo-nigromante-profanador');
 await p.locator('#batch-dialog [data-action="close"]').click();await p.waitForFunction(k=>!JSON.parse(localStorage.getItem(k)).openBatch,key);
 await p.locator('[data-action="settings"]').click();await filtro(p,'nigromantes');await p.locator('[data-action="marcar-contenido"][data-value="no"]').click();
 assert.equal(await p.locator('#new-game').isDisabled(),true);
 const sinRed=await estado(p);
 await p.evaluate(()=>{Storage.prototype.setItem=function(){throw new DOMException('Sin espacio','QuotaExceededError');};});
 await cerrar(p);await confirmar(p,'guardar');assert.equal(await p.locator('#settings-dialog').isVisible(),true);assert.deepEqual(await estado(p),sinRed);
 assert.deepEqual(errores,[]);await context.close();
 console.log('Contenido: 4 viewports, filtros, cajas, Core/Otros obligatorios, seleccion oculta, acciones masivas, salida sin guardar, persistencia, mazos congelados, offline y cuota comprobados.');
}finally{await browser.close();}
