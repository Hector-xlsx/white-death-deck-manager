import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
import {datos} from '../dist/catalogo.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2';
const browser=await chromium.launch({headless:true,channel:'chrome'}),kan='enemigo-abominacion-kan',prof='enemigo-nigromante-profanador';
try{
 const ctx=await browser.newContext({viewport:{width:1024,height:768},reducedMotion:'reduce'});const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['abominacion'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'estandar',abominacionEstandarId:kan},1);spawn(s,()=>0);s.openBatch=false;await ctx.addInitScript(({s,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{s,key});const p=await ctx.newPage(),errores=[];p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');const antes=await p.evaluate(k=>localStorage.getItem(k),key);
 await p.locator(`#pins [data-action="zoom"]`).first().click();assert.equal(await p.locator('#zoom-dialog .ficha-zombi').count(),1);assert.equal(await p.locator('#zoom-dialog details.reglas-estandar-abominacion').count(),0);assert.match(await p.locator('#zoom-dialog .ficha-zombi').textContent(),/Adrenalina obtenida: 5 puntos/);await p.locator('#zoom-dialog [data-action="close"]').click();
 for(const c of datos.enemigos.enemigos){
  await p.evaluate(id=>{const b=document.createElement('button');b.dataset.action='consulta-recurso';b.dataset.id=id;document.body.append(b);b.click();b.remove();},c.id);
  const ficha=p.locator('#info-dialog .ficha-zombi'),desplegable=p.locator('#info-dialog .reglas-estandar-abominacion');
  if(c.id===kan||c.id===prof){assert.equal(await ficha.count(),1);assert.equal(await desplegable.count(),0);}
  else if(c.mazo_destino==='abominaciones'){assert.equal(await desplegable.count(),1);assert.equal(await desplegable.getAttribute('open'),null);assert.equal(await ficha.isVisible(),false);await desplegable.locator('summary').click();assert.ok(await ficha.isVisible());assert.match(await ficha.textContent(),/Abominación Kan/);}
  else assert.equal(await ficha.count(),0);
  if(c.id===prof){assert.equal(await ficha.locator('ul ul>li').count(),2);assert.match(await ficha.textContent(),/este Superviviente puede reorganizar/);assert.match(await ficha.textContent(),/su Zona de aparición no se mueve/);}
  if([kan,prof,'enemigo-chimimoryo'].includes(c.id))for(const [width,height] of [[1440,900],[1024,768],[844,390],[390,844],[320,568]]){await p.setViewportSize({width,height});await ficha.scrollIntoViewIfNeeded();assert.ok(await p.locator('#info-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth));if(width===1024||width===320)await p.locator('#info-dialog').screenshot({path:`docs/verificacion/ficha-core-${c.id}-${width}.png`});}
  await p.locator('#info-dialog [data-action="close"]').click();
 }
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),antes);await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await ctx.setOffline(true);await p.reload();await p.locator('#pins [data-action="zoom"]').first().click();assert.match(await p.locator('#zoom-dialog .ficha-zombi').textContent(),/Abominación Kan/);assert.deepEqual(errores,[]);await ctx.close();console.log('Reglas core: Kan directo, Profanador exclusivo, desplegable cerrado en otras abominaciones, todos los nigromantes excluidos, cinco tamaños, guardado intacto y offline verificados.');
}finally{await browser.close();}
