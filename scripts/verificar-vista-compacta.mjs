import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2';
const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado',dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta'},12);spawn(s,()=>0);s.openBatch=false;
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});await context.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s});const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');const original=await p.evaluate(k=>localStorage.getItem(k),key);
 for(const [n,width,height] of [['escritorio',1440,900],['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568]]){
  await p.setViewportSize({width,height});await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
  const r=await p.locator('#last-preview .last-strip').evaluate(e=>{const cs=getComputedStyle(e),r=e.getBoundingClientRect(),imgs=[...e.querySelectorAll('.mini-media')].map(n=>n.getBoundingClientRect()),section=e.closest('.last-section').getBoundingClientRect();return {overflowX:cs.overflowX,overflowY:cs.overflowY,scroll:e.scrollWidth,client:e.clientWidth,contained:imgs.every(i=>i.left>=r.left-.5&&i.right<=r.right+.5&&i.bottom<=section.bottom),filas:new Set(imgs.map(i=>Math.round(i.top))).size};});assert.equal(r.overflowX,'visible');assert.equal(r.overflowY,'visible');assert.ok(r.scroll<=r.client+1);assert.ok(r.contained);assert.ok(r.filas>1);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.ok(await p.evaluate(()=>document.documentElement.scrollHeight>innerHeight));
  const h=await p.locator('.wall-separator').evaluate(e=>e.getBoundingClientRect().height);assert.ok(Math.abs(h-Math.max(37,Math.min(52,width*.04)))<.1);
  if(width>=844){const a=await p.locator('#daily-active-status').boundingBox(),b=await p.locator('#enemy-limits-status').boundingBox();assert.ok(Math.abs(a.y-b.y)<1);}
  await p.screenshot({path:`docs/verificacion/ultima-tanda-sin-scroll-${n}.png`,fullPage:true});assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),original);
 }
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await context.setOffline(true);await p.reload();assert.equal(await p.locator('#last-preview .last-mini').count(),19);assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),original);assert.deepEqual(errores,[]);console.log('Resumen una fila desde 844px, muralla al 50%, 19 cartas en filas sin scroll interno ni desbordamiento, cinco tamaños, página crece, offline y partida intacta.');
}finally{await browser.close();}
