import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {newGame,total} from '../dist/engine.js';
import {CATALOGO_BASE} from '../dist/catalogo.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/';
await mkdir('docs/verificacion',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
async function dimensiones(p){
 const fallos=await p.evaluate(()=>{
  const d=[...document.querySelectorAll('dialog[open]')].at(-1),superficie=d||document.querySelector('main');
  return [...superficie.querySelectorAll('button,input,select,h2,legend,.daily-settings label,.content-filters label')].filter(e=>e.getClientRects().length&&!e.closest('.pin-strip,.last-strip')).filter(e=>{const r=e.getBoundingClientRect();return r.left<-1||r.right>innerWidth+1||e.scrollWidth>e.clientWidth+2;}).map(e=>e.textContent.trim());
 });assert.deepEqual(fallos,[]);
}
try{
 const semilla=newGame({easy:true,normal:true,threshold:0,selectedIds:['asedio']},1);
 const context=await browser.newContext({viewport:{width:844,height:390}});
 await context.addInitScript(({key,semilla})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));Math.random=()=>.99;},{key,semilla});
 const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(url);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 const estado=()=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 await p.getByRole('button',{name:'Configuración',exact:true}).click();
 assert.equal(await p.locator('[name="dailyHabilitado"]').isChecked(),false);
 assert.equal(await p.locator('[name="dailyBase-azul"]').inputValue(),'0');
 await p.locator('[name="dailyHabilitado"]').check();
 for(const nivel of ['azul','amarillo','naranja','rojo']){await p.locator(`[name="dailyBase-${nivel}"]`).fill('100');await p.locator(`[name="dailyIncremento-${nivel}"]`).fill('15');}
 await p.locator('[name="dailyIncrementoPor"]').selectOption('carta');
 await p.locator('[name="filtro-contenido"][value="daily"]').check();
 assert.equal(await p.locator('#content-selector [name="carta"]').count(),7);
 await p.locator('[data-action="marcar-contenido"][data-value="no"]').click();assert.ok(await p.locator('#new-game').isDisabled());
 await p.locator('[data-action="marcar-contenido"][data-value="si"]').click();assert.ok(await p.locator('#new-game').isEnabled());
 await p.locator('.collection-section summary').click();await p.locator('[name="caja"][value="frozen-fortress"]').uncheck();
 assert.equal(await p.locator('#content-selector [name="carta"]').count(),0);assert.ok(await p.locator('#new-game').isDisabled());
 await p.locator('[name="caja"][value="frozen-fortress"]').check();
 await p.locator('[name="filtro-contenido"][value="zombies"]').check();assert.equal(await p.locator('#content-selector [name="carta"]').count(),11);
 assert.ok((await p.locator('#content-selector').textContent()).includes('Estándar'));assert.ok(!(await p.locator('#content-selector').textContent()).includes('Normal'));
 await p.locator('[data-action="marcar-contenido"][data-value="si"]').click();
 for(const [n,w,h] of [['desktop',1440,900],['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568]]){
  await p.setViewportSize({width:w,height:h});await dimensiones(p);
  await p.screenshot({path:`docs/verificacion/daily-config-${n}.png`,fullPage:true});
  await p.locator('.daily-settings').scrollIntoViewIfNeeded();await dimensiones(p);
  await p.screenshot({path:`docs/verificacion/daily-opciones-${n}.png`,fullPage:true});
 }
 await p.setViewportSize({width:844,height:390});
 await p.locator('#new-game').click();await p.locator('#confirm-actions [data-value="yes"]').click();
 let actual=await estado();assert.equal(total(actual.initial),80);assert.equal(actual.daily.cartas.length,7);assert.equal(actual.config.dailyPorNivel.azul.base,100);
 await p.locator('#spawn').click();assert.equal(await p.locator('#batch-grid .draw-card').count(),1);
 await p.locator('#batch-dialog[data-revelacion="lista"]').waitFor({timeout:15000});
 assert.equal(await p.locator('#batch-grid .draw-card').count(),2);actual=await estado();assert.equal(actual.pins.length,1);
 assert.ok(actual.history[0].slots[0].draws[0].cardId.startsWith('spawn-'));
 assert.equal(actual.history[0].slots[0].draws[0].daily.length,1);
 for(const imagen of await p.locator('#batch-grid .card-image>img').all()){await imagen.evaluate(i=>i.decode());assert.ok(await imagen.evaluate(i=>i.naturalWidth>0));}
 assert.equal(await p.locator('#batch-grid [data-action="discard"]').count(),1);
 for(const [n,w,h] of [['horizontal',844,390],['estrecho',320,568],['tablet',1024,768]]){
  await p.setViewportSize({width:w,height:h});await dimensiones(p);await p.screenshot({path:`docs/verificacion/daily-aparicion-${n}.png`,fullPage:true});
 }
 await p.locator('#batch-dialog [data-action="close"]').click();await p.locator('#pins .image-button').click();
 await p.getByRole('button',{name:'Volver a agregar al mazo Daily Spawn',exact:true}).click();
 assert.ok(!(await p.locator('#confirm-message').textContent()).includes('trofeo'));
 await p.locator('#confirm-actions [data-value="si"]').click();assert.equal((await estado()).pins.length,0);
 await p.locator('#toggle-desfijados').click();await p.locator('#desfijados .repin').click();actual=await estado();assert.equal(actual.pins.length,1);assert.equal(actual.daily.remaining[actual.pins[0].cardId],0);
 const antes=await estado();await p.evaluate(()=>{window.setter=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new DOMException('Quota','QuotaExceededError');};});
 await p.locator('#spawn').click();assert.deepEqual(await estado(),antes);await p.evaluate(()=>Storage.prototype.setItem=window.setter);
 await context.setOffline(true);await p.reload();assert.deepEqual(await estado(),antes);await p.locator('#pins .image-button').click();await p.locator('#zoom-content img').evaluate(i=>i.decode());assert.ok(await p.locator('#zoom-content img').evaluate(i=>i.naturalWidth>0));
 await p.locator('#zoom-dialog [data-action="close"]').click();await p.getByRole('button',{name:'Configuración',exact:true}).click();await p.locator('[name="dailyHabilitado"]').uncheck();
 await p.locator('#new-game').click();await p.locator('#confirm-actions [data-value="yes"]').click();assert.equal((await estado()).daily,undefined);assert.equal((await estado()).history.length,0);
 await context.close();
 const viejo=newGame();viejo.catalogo={version:1,cartas:structuredClone(CATALOGO_BASE)};
 const legado=await browser.newContext();await legado.addInitScript(({key,viejo})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(viejo));},{key,viejo});
 const pagina=await legado.newPage();pagina.on('pageerror',e=>errores.push(e.message));await pagina.goto(url);assert.deepEqual(await pagina.evaluate(k=>JSON.parse(localStorage.getItem(k)),key),viejo);
 assert.equal(await pagina.locator('#deck-count').textContent(),'56 / 56');await legado.close();
 assert.deepEqual(errores,[]);console.log('Daily: configuracion, coleccion, expansiones, Estándar, cinco viewports, revelacion, unicidad, devolucion/refijado, cuota, offline, desactivar y legado sin cambios.');
}finally{await browser.close();}
