import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2';
let s;
if(process.env.MAZO_PARTIDA)s=JSON.parse(await readFile(process.env.MAZO_PARTIDA,'utf8')).partida;
else{
 s=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion','asedio'],modoNigromantes:'sin-reposicion',modoAbominaciones:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival'},3);
 for(const id of Object.keys(s.remaining))s.remaining[id]=1;const azar=[.99,0,0,0,.99];spawn(s,()=>azar.shift()??.99);
}s.openBatch=false;
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const ctx=await browser.newContext({viewport:{width:960,height:600},reducedMotion:'reduce'});await ctx.addInitScript(({s,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{s,key});
 const p=await ctx.newPage(),errores=[];p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8095/mazo/');
 const bytes=await p.evaluate(k=>localStorage.getItem(k),key),plegar=p.locator('#toggle-ultima-tanda');
 assert.equal(await p.locator('.test-tag').count(),0);assert.equal(await p.locator('.deck-status').isVisible(),false);assert.equal(await p.locator('.board>footer').count(),0);
 assert.equal(await p.locator('.pin-section').evaluate(e=>Boolean(e.compareDocumentPosition(document.querySelector('.last-section'))&Node.DOCUMENT_POSITION_FOLLOWING)),true);
 assert.equal(await plegar.getAttribute('aria-expanded'),'false');assert.equal(await p.locator('#last-preview').isVisible(),false);assert.equal(await p.locator('#reopen').isVisible(),true);
 await plegar.click();assert.equal(await p.locator('#last-preview').isVisible(),true);await plegar.click();
 for(const [w,h] of [[1440,900],[960,600],[844,390],[390,844],[320,568]]){
  await p.setViewportSize({width:w,height:h});
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Ancho ${w}`);
  const posiciones=await p.evaluate(()=>{
   const adrenalina=document.querySelector('.adrenalina-selector').getBoundingClientRect(),contador=document.getElementById('normal-count').getBoundingClientRect(),herramientas=[...document.querySelectorAll('.brand-window-tools>button')].map(e=>e.getBoundingClientRect());
   return {desvio:Math.abs(adrenalina.x+adrenalina.width/2-contador.x-contador.width/2),encima:adrenalina.bottom<=contador.top+1,herramientas:herramientas.map(r=>({x:r.x,y:r.y,width:r.width,height:r.height}))};
  });assert.ok(posiciones.desvio<1&&posiciones.encima,'Adrenalina centrada encima del contador');assert.ok(posiciones.herramientas.every(r=>Math.abs(r.y-posiciones.herramientas[0].y)<1&&r.x>=0&&r.x+r.width<=w&&r.height>=44));
  if(w===960||w===390)await p.screenshot({path:`docs/verificacion/principal-compacta-${w}.png`,fullPage:true});
 }
 await p.setViewportSize({width:960,height:600});await p.locator('#mesa-zoom-toggle').click();
 for(const [width,height] of [[960,600],[844,390],[320,568]]){await p.setViewportSize({width,height});for(const porcentaje of [75,95,100,110,125]){
  let actual=Number((await p.locator('#mesa-escala').textContent()).replace('%',''));while(actual!==porcentaje){await p.locator(actual>porcentaje?'#mesa-alejar':'#mesa-acercar').click();actual+=actual>porcentaje?-5:5;}
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,`Escala ${porcentaje}`);
  const tactiles=await p.locator('.brand-window-tools>button,.adrenalina-controls>button,.pinned-card>.unpin').evaluateAll(es=>es.map(e=>({w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})));
  assert.ok(tactiles.filter(r=>r.w>0||r.h>0).every(r=>r.w>=43.8&&r.h>=43.8),'Controles táctiles '+porcentaje+': '+JSON.stringify(tactiles));
 }}
 await p.setViewportSize({width:960,height:600});await p.locator('#mesa-acercar').focus();await p.keyboard.press('Escape');assert.equal(await p.locator('#mesa-zoom-toggle').getAttribute('aria-expanded'),'false');await p.locator('#reopen').click();
 assert.equal(await p.locator('#aparicion-escala').textContent(),'100%');assert.ok(Math.abs((await p.locator('#batch-grid .card-image').first().boundingBox()).width-155)<.2,'Aparición no hereda zoom principal');
 const vista=p.locator('#aparicion-vista');assert.equal(await vista.getAttribute('data-vista'),'adaptativa');assert.equal(await vista.locator('rect').count(),9);
 for(const modo of ['horizontal','vertical','adaptativa']){await vista.click();assert.equal(await vista.getAttribute('data-vista'),modo);assert.equal(await p.locator('#batch-grid').getAttribute('data-vista'),modo);}
 await vista.focus();await p.keyboard.press('Enter');assert.equal(await vista.getAttribute('data-vista'),'horizontal');await p.keyboard.press('Space');assert.equal(await vista.getAttribute('data-vista'),'vertical');
 await p.locator('#batch-dialog [data-action="close"]').click();await p.waitForFunction(k=>!JSON.parse(localStorage.getItem(k)).openBatch,key);assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);
 await p.getByRole('button',{name:'Historial',exact:true}).click();assert.equal(await p.locator('#history-dialog').isVisible(),true);await p.locator('#history-dialog .close-button').click();
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await ctx.setOffline(true);await p.reload();assert.equal(await plegar.getAttribute('aria-expanded'),'false');assert.equal(await p.locator('#mesa-escala').textContent(),'100%');await p.locator('#reopen').click();assert.equal(await vista.getAttribute('data-vista'),'vertical');await p.locator('#batch-dialog [data-action="close"]').click();await p.waitForFunction(k=>!JSON.parse(localStorage.getItem(k)).openBatch,key);assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);
 assert.deepEqual(errores,[]);await ctx.close();console.log('Principal compacta: cinco tamaños, orden En juego/Última tanda plegable, separadores, adrenalina centrada, Historial, zoom independiente/táctil, iconos cíclicos/teclado/preferencia, guardado intacto y offline.');
}finally{await browser.close();}
