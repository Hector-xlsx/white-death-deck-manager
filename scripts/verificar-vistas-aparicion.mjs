import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {newGame,spawn,anularTanda} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2';
let s;
if(process.env.MAZO_PARTIDA)s=JSON.parse(await readFile(process.env.MAZO_PARTIDA,'utf8')).partida;
else{
 s=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion','asedio'],modoNigromantes:'sin-reposicion',modoAbominaciones:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival'},3);
 for(const id of Object.keys(s.remaining))s.remaining[id]=1;const azar=[.99,0,0,0,.99];spawn(s,()=>azar.shift()??.99);
}s.openBatch=false;
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const ctx=await browser.newContext({viewport:{width:960,height:600},deviceScaleFactor:2,reducedMotion:'reduce'});
 await ctx.addInitScript(({s,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{s,key});
 const p=await ctx.newPage(),errores=[];p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8094/mazo/');await p.locator('#reopen').click();
 const bytes=await p.evaluate(k=>localStorage.getItem(k),key),ids=await p.locator('#batch-grid [data-extraccion]').evaluateAll(es=>es.map(e=>e.dataset.extraccion));
 assert.equal(await p.locator('#anular-tanda').evaluate(e=>Boolean(e.closest('.batch-tools'))),true);
 assert.equal(await p.locator('#batch-grid .card-label').count(),0);
 assert.equal(await p.locator('#batch-grid .appearance-details:visible').count(),0);
 const info=p.locator('#aparicion-detalles');await info.click();assert.equal(await info.getAttribute('aria-pressed'),'true');
 const b=s.history.at(-1);
 for(const c of b.slots.flatMap(t=>t.draws.slice(-1))){
  const carta=p.locator(`#batch-grid [data-extraccion="${c.uid}"]`);
  if(!await carta.count())continue;
  for(const [campo,nombre] of [['dailyIntento','Daily Spawn'],['especialIntento','Spawn especial']])if(c[campo])assert.match(await carta.locator('.appearance-details').textContent(),new RegExp(nombre+': '+c[campo].probabilidad.toLocaleString('es-CL',{maximumFractionDigits:2})+' %'));
 }
 await info.click();assert.equal(await info.getAttribute('aria-pressed'),'false');
 const vista=p.locator('#aparicion-vista'),scroll=p.locator('#batch-scroll');
 for(const [w,h] of [[1440,900],[960,600],[844,390],[390,844],[320,568]]){
  await p.setViewportSize({width:w,height:h});
  for(const modo of ['adaptativa','horizontal','vertical']){
   await vista.selectOption(modo);
   const posiciones=await p.locator('#batch-grid [data-extraccion]').evaluateAll(es=>es.map(e=>({x:e.getBoundingClientRect().x,y:e.getBoundingClientRect().y})));
   if(modo==='horizontal')assert.ok(posiciones.every(e=>Math.abs(e.y-posiciones[0].y)<1),'Una sola fila horizontal');
   if(modo==='vertical')assert.ok(posiciones.every(e=>Math.abs(e.x-posiciones[0].x)<1),'Una sola columna vertical');
   assert.deepEqual(await p.locator('#batch-grid [data-extraccion]').evaluateAll(es=>es.map(e=>e.dataset.extraccion)),ids);
   assert.equal(await p.locator('#batch-dialog').evaluate(e=>e.scrollWidth>e.clientWidth+1),false,`${w}: modal sin desbordamiento`);
   if(modo==='horizontal'&&w<=390)assert.equal(await scroll.evaluate(e=>e.scrollWidth>e.clientWidth),true,'Desplazamiento lateral interno');
  }
 }
 await p.setViewportSize({width:960,height:600});await vista.selectOption('adaptativa');
 for(const porcentaje of [75,95,100,110,125]){
  let actual=Number((await p.locator('#aparicion-escala').textContent()).replace('%',''));
  while(actual!==porcentaje){await p.locator(actual>porcentaje?'#aparicion-alejar':'#aparicion-acercar').click();actual+=actual>porcentaje?-5:5;}
  const botones=await p.locator('#batch-grid .card-actions button').evaluateAll(es=>es.map(e=>({ancho:e.getBoundingClientRect().width,alto:e.getBoundingClientRect().height})));
  assert.ok(botones.every(b=>Math.abs(b.ancho-b.alto)<.2&&b.ancho>=43.8),'Acciones cuadradas y táctiles en todas las escalas');
 }
 await p.locator('#aparicion-alejar').click({clickCount:5});await info.click();await p.screenshot({path:'docs/verificacion/aparicion-detalles.png'});await info.click();
 await vista.selectOption('horizontal');await p.screenshot({path:'docs/verificacion/aparicion-horizontal.png'});
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);
 await p.reload();assert.equal(await vista.inputValue(),'horizontal');assert.equal(await info.getAttribute('aria-pressed'),'false');assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);
 await p.locator('#batch-dialog [data-action="close"]').click();await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await ctx.setOffline(true);await p.reload();await p.locator('#reopen').click();assert.equal(await vista.inputValue(),'horizontal');await info.click();
 assert.deepEqual(errores,[]);await ctx.close();
 // Anulación desde cabecera: semilla vigente, cancelar intacto y confirmar restaura.
 const actual=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'},1);spawn(actual,()=>0);
 const esperado=structuredClone(actual);anularTanda(esperado);
 const ctxAnular=await browser.newContext({viewport:{width:960,height:600},reducedMotion:'reduce'});await ctxAnular.addInitScript(({key,actual})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(actual));},{key,actual});const paginaAnular=await ctxAnular.newPage();await paginaAnular.goto(process.env.MAZO_URL||'http://127.0.0.1:8094/mazo/');
 const leer=()=>paginaAnular.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);const antesAnular=await leer();
 await paginaAnular.locator('#anular-tanda').click();await paginaAnular.locator('#confirm-dialog [data-value="cancel"]').click();assert.deepEqual(await leer(),antesAnular);
 await paginaAnular.locator('#anular-tanda').click();await paginaAnular.locator('#confirm-dialog [data-value="yes"]').click();assert.deepEqual(await leer(),esperado);await ctxAnular.close();
 const porTanda=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal','spawn-559'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado',spawnEspecial:{modo:'probabilidad',base:37,incremento:10,frecuencia:'tanda'}},2);spawn(porTanda,()=>.99);assert.equal(porTanda.history[0].especialIntento.probabilidad,37);
 const ctxTanda=await browser.newContext({reducedMotion:'reduce'});await ctxTanda.addInitScript(({key,porTanda})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(porTanda));},{key,porTanda});const paginaTanda=await ctxTanda.newPage();await paginaTanda.goto(process.env.MAZO_URL||'http://127.0.0.1:8094/mazo/');await paginaTanda.locator('#aparicion-detalles').click();assert.match(await paginaTanda.locator('#batch-detalles-tanda').textContent(),/Spawn especial \(por tanda\): 37 %/);assert.equal(await paginaTanda.locator('#batch-grid .probability-detail').count(),0);await ctxTanda.close();
 console.log('Vistas de Aparición: cinco tamaños, tres distribuciones y orden intacto, desplazamiento lateral, botones cuadrados 75/95/100/110/125%, detalles históricos, preferencia, anulación/cancelación desde cabecera, guardado intacto y offline.');
}finally{await browser.close();}
