import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,spawn,isValid} from '../dist/engine.js';
import {CATALOG} from '../dist/catalogo.js';
import {SHAKOKI,RAKSHASA} from '../dist/reglas-cartas.js';
import {IMAGENES_APARICIONES} from '../dist/apariciones-adicionales.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2';
const tipos=Object.keys(IMAGENES_APARICIONES),cartas=tipos.map(tipo=>CATALOG.find(c=>c.tipo===tipo&&typeof c.levels?.[0]==='number'));assert.ok(cartas.every(Boolean));
const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['abominacion',...cartas.map(c=>c.id)],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival',selectedAbominacionesIds:[SHAKOKI],dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',selectedDailyIds:[RAKSHASA]},1);
for(const id of Object.keys(s.remaining))s.remaining[id]=id==='abominacion'?1:0;spawn(s,()=>0);
s.normal=cartas.length;for(const id of Object.keys(s.remaining))s.remaining[id]=cartas.some(c=>c.id===id)?1:0;spawn(s,()=>0);assert.ok(isValid(s));
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});await ctx.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s});const p=await ctx.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');await p.locator('#batch-dialog[data-revelacion="lista"]').waitFor();
 const original=await p.evaluate(k=>{const s=JSON.parse(localStorage.getItem(k));return {history:s.history,pins:s.pins,sequence:s.sequence};},key);
 async function comprobar(selector){
  const resultados=await p.locator(`${selector} .extra-zombies-body`).evaluateAll(es=>es.map(e=>{
   const q=e.querySelector('.extra-quantity'),t=e.querySelector('.extra-text'),r=e.getBoundingClientRect(),b=t.getBoundingClientRect();
   return {w:r.width,h:r.height,font:getComputedStyle(q).fontSize,texto:t.scrollHeight<=t.clientHeight+1,dentro:b.left>=r.left&&b.right<=r.right&&b.bottom<=r.bottom};
  }));const referencia=await p.locator(selector==='#batch-grid'?'#batch-grid .draw-card:not(.extra-zombies) .card-image':'#last-preview .last-mini:not(.extra-zombies) button').first().boundingBox();assert.ok(Math.abs(resultados[0].w-referencia.width)<1&&Math.abs(resultados[0].h-referencia.height)<1);assert.ok(resultados.length>=6);assert.ok(resultados.every(r=>Math.abs(r.w-resultados[0].w)<1&&Math.abs(r.h-resultados[0].h)<1&&r.font===resultados[0].font&&r.texto&&r.dentro),JSON.stringify(resultados));
 }
 for(const modo of ['minimalista','cartas-custom']){
  if(modo==='cartas-custom'){
   await p.locator('#batch-dialog [data-action="close"]').click();await p.getByRole('button',{name:'Configuración',exact:true}).click();await p.locator('#modo-aparicion-adicional').selectOption(modo);await p.locator('#save-settings').click();await p.locator('#reopen').click();await p.locator('#batch-dialog[data-revelacion="lista"]').waitFor();
   await p.locator('#batch-grid .extra-custom-image').evaluateAll(es=>{for(const e of es)e.loading='eager';return Promise.all(es.map(e=>e.decode()));});
  }
  for(const [nombre,width,height] of [['escritorio',1440,900],['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568]]){
   await p.setViewportSize({width,height});await comprobar('#batch-grid');await comprobar('#last-preview');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.locator('#batch-grid .extra-zombies').last().scrollIntoViewIfNeeded();await p.locator('#batch-dialog').screenshot({path:`docs/verificacion/apariciones-${modo}-${nombre}.png`});
  }
 }
 const actual=await p.evaluate(k=>{const s=JSON.parse(localStorage.getItem(k));return {history:s.history,pins:s.pins,sequence:s.sequence};},key);assert.deepEqual(actual,original);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await ctx.setOffline(true);await p.reload();await p.locator('#batch-dialog[data-revelacion="lista"]').waitFor();await p.locator('#batch-grid .extra-custom-image').evaluateAll(es=>{for(const e of es)e.loading='eager';return Promise.all(es.map(e=>e.decode()));});await comprobar('#batch-grid');assert.equal(await p.locator('#batch-grid .extra-custom').count(),7);assert.deepEqual(errores,[]);await ctx.close();
 console.log('Apariciones: seis familias y Rakshasa, dos diseños, cantidades y dimensiones uniformes, texto contenido, cinco tamaños, cambio sin resolver efectos y recarga offline verificados.');
}finally{await browser.close();}
