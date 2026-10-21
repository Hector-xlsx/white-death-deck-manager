import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {newGame,spawn,pinCard,unpinCard} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/',key='white-death-gestor-v2';
const semilla=newGame();
const tanda=spawn(semilla,()=>.99);
for(const slot of tanda.slots.slice(0,2))pinCard(semilla,slot.draws[0]);
unpinCard(semilla,tanda.slots[1].draws[0].uid);semilla.openBatch=false;
const salida=new URL('../docs/verificacion/',import.meta.url);await mkdir(salida,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const context=await browser.newContext();
 await context.addInitScript(({key,semilla})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));},{key,semilla});
 const p=await context.newPage(),errores=[];p.on('pageerror',e=>errores.push(e.message));
 await p.goto(url);await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 const bytes=await p.evaluate(k=>localStorage.getItem(k),key);
 assert.equal(await p.locator('.pin-section h2').textContent(),'En juego 1');
 assert.equal(await p.locator('#toggle-desfijados').textContent(),'Mostrar derrotados');
 assert.equal(await p.locator('#toggle-desfijados').getAttribute('aria-expanded'),'false');
 assert.equal(await p.locator('#desfijados').isVisible(),false);
 await p.locator('#toggle-desfijados').click();
 for(const [nombre,tamano] of [['horizontal',{width:844,height:390}],['vertical',{width:390,height:844}],['estrecho',{width:320,height:568}],['tablet',{width:1024,height:768}]]){
  await p.setViewportSize(tamano);
  assert.equal(await p.locator('#desfijados .archived-card:visible').count(),1);
  await p.locator('#toggle-desfijados').click();
  assert.equal(await p.locator('#toggle-desfijados').textContent(),'Mostrar derrotados');
  assert.equal(await p.locator('#toggle-desfijados').getAttribute('aria-expanded'),'false');
  assert.equal(await p.locator('#desfijados').isVisible(),false);
  assert.equal(await p.locator('#pins > .pinned-card:visible').count(),1);
  assert.ok(await p.locator('.pin-section .section-title').evaluate(e=>[...e.children].every(c=>{
   const r=c.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&c.scrollWidth<=c.clientWidth+1;
  })));
  await p.locator('.pin-section').screenshot({path:fileURLToPath(new URL(`desfijados-ocultos-${nombre}.png`,salida))});
  await p.locator('#toggle-desfijados').click();
  assert.equal(await p.locator('#toggle-desfijados').textContent(),'Ocultar derrotados');
  assert.equal(await p.locator('#desfijados .archived-card:visible').count(),1);
  assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);
 }
 await p.locator('#toggle-desfijados').click();
 await p.locator('#pins > .pinned-card [data-action="unpin"]').click();
 assert.equal(await p.locator('#desfijados').isVisible(),false);
 assert.equal(await p.locator('#pins .empty-state').textContent(),'No hay cartas fijadas.');
 await p.locator('#toggle-desfijados').click();assert.equal(await p.locator('#desfijados .archived-card:visible').count(),2);
 await p.locator('#desfijados [data-action="pin"]').first().click();
 assert.equal(await p.locator('#pins > .pinned-card:visible').count(),1);
 assert.equal(await p.locator('#desfijados .archived-card:visible').count(),1);
 await context.setOffline(true);await p.reload();
 assert.equal(await p.locator('#toggle-desfijados').textContent(),'Mostrar derrotados');
 assert.equal(await p.locator('#desfijados').isVisible(),false);
 const sinRed=await p.evaluate(k=>localStorage.getItem(k),key);
 await p.locator('#toggle-desfijados').click();assert.equal(await p.locator('#desfijados').isVisible(),true);
 await p.locator('#toggle-desfijados').click();assert.equal(await p.locator('#desfijados').isVisible(),false);
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),sinRed);
 assert.deepEqual(errores,[]);await context.close();
 console.log('Desfijados: alternancia, 4 viewports, bytes intactos, fijados visibles, refijacion y offline comprobados.');
}finally{await browser.close();}
