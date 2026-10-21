import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {newGame,spawn,pinCard,unpinCard} from '../dist/engine.js';
const {chromium}=createRequire(import.meta.url)(process.env.MAZO_PLAYWRIGHT||'playwright');
const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'},1);
spawn(s,()=>0);s.openBatch=false;const carta=s.history[0].slots[0].draws[0];pinCard(s,carta);unpinCard(s,carta.uid);
const navegador=await chromium.launch({headless:true,channel:'chrome'});
try{
 const ctx=await navegador.newContext({viewport:{width:960,height:600},reducedMotion:'no-preference'});
 await ctx.addInitScript(s=>{if(!localStorage.getItem('white-death-gestor-v2'))localStorage.setItem('white-death-gestor-v2',JSON.stringify(s));},s);
 const p=await ctx.newPage(),errores=[];p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8095/mazo/');
 for(const [width,height] of [[960,600],[844,390],[390,844],[320,568]]){
  await p.setViewportSize({width,height});await p.mouse.move(0,0);
  for(const escala of [.75,1,1.25]){
   await p.locator('.board').evaluate((e,v)=>e.style.setProperty('--escala-mesa',v),escala);
   const estilos=await p.evaluate(()=>['reopen','open-inplay','toggle-desfijados'].map(id=>{const e=document.getElementById(id),s=getComputedStyle(e);return {css:[s.border,s.borderRadius,s.backgroundColor,s.color,s.fontWeight,s.padding],alto:e.getBoundingClientRect().height};}));
   assert.deepEqual(estilos[0].css,estilos[1].css);assert.deepEqual(estilos[0].css,estilos[2].css);assert.ok(estilos.every(e=>e.alto>=43.8));assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  }
 }
 await p.locator('.board').evaluate(e=>e.style.setProperty('--escala-mesa',1));await p.setViewportSize({width:960,height:600});
 await p.getByRole('button',{name:'Mostrar derrotados',exact:true}).click();assert.equal(await p.getByRole('button',{name:'Ocultar derrotados',exact:true}).count(),1);assert.match(await p.locator('#desfijados').textContent(),/Derrotados/);
 await mkdir('docs/verificacion',{recursive:true});await p.screenshot({path:'docs/verificacion/botones-mesa-unificados.png',fullPage:true});
 await p.evaluate(()=>{window.ritmo={apertura:null,revelacion:null};const d=document.getElementById('batch-dialog');new MutationObserver(()=>{if(d.open)window.ritmo.apertura??=performance.now();if(d.querySelector('.volteando'))window.ritmo.revelacion??=performance.now();}).observe(d,{childList:true,subtree:true,attributes:true});});
 await p.locator('#spawn').click();const bytes=await p.evaluate(()=>localStorage.getItem('white-death-gestor-v2'));await p.waitForFunction(()=>window.ritmo.revelacion!==null);const delta=await p.evaluate(()=>window.ritmo.revelacion-window.ritmo.apertura);assert.ok(delta>=380&&delta<1200,'Pausa medida: '+delta);assert.equal(await p.evaluate(()=>localStorage.getItem('white-death-gestor-v2')),bytes);
 await p.locator('#batch-dialog .close-button').click();await p.locator('#reopen').click();assert.equal(await p.locator('#batch-dialog').getAttribute('data-revelacion'),'lista');await p.locator('#batch-dialog .close-button').click();
 await p.emulateMedia({reducedMotion:'reduce'});await p.locator('#spawn').click();assert.equal(await p.locator('#batch-dialog').getAttribute('data-revelacion'),'lista');assert.deepEqual(errores,[]);await ctx.close();
 console.log(`Ritmo/botones: estilos idénticos, cuatro tamaños/tres escalas, controles táctiles, Mostrar/Ocultar derrotados, pausa ${Math.round(delta)} ms desde apertura, guardado intacto, reapertura inmediata y movimiento reducido.`);
}finally{await navegador.close();}
