import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {CATALOG,newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2';
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 const cartas=CATALOG.filter(c=>['caminantes','brutos','corredores','caminantes-terrorcota','trepadores','caminantes-ballesteros'].includes(c.tipo));assert.ok(cartas.length>5);
 for(const carta of cartas){
  const s=newGame({easy:true,normal:true,threshold:0,selectedIds:[carta.id],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival'},1);spawn(s,()=>0);s.openBatch=false;
  const ctx=await browser.newContext({viewport:{width:1024,height:768},reducedMotion:'reduce'});await ctx.addInitScript(({s,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{s,key});const p=await ctx.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');const antes=await p.evaluate(k=>localStorage.getItem(k),key);
  await p.locator('#last-preview [data-action="zoom"]').first().click();const ficha=p.locator('#zoom-dialog .ficha-zombi');assert.equal(await ficha.count(),1);assert.match(await ficha.textContent(),/Heridas que causa:.*Para eliminarlo:.*Adrenalina obtenida:/s);
  if(carta.tipo==='brutos')assert.match(await ficha.textContent(),/Para eliminarlo: Daño 2/);
  if(['caminantes','brutos'].includes(carta.tipo))assert.equal(await ficha.locator('.ficha-reglas-titulo').count(),0);
  if(carta.tipo==='corredores')assert.match(await ficha.textContent(),/dos acciones cada vez que se activan/);
  if(carta.tipo==='caminantes-ballesteros'){assert.equal(await ficha.locator('ol>li').count(),3);assert.match(await ficha.textContent(),/no se permiten tiradas de salvación por armadura/i);}
  if(carta.tipo==='caminantes-terrorcota')assert.match(await ficha.locator('.ficha-atencion').textContent(),/Reflejos de combate/);
  for(const [width,height] of [[1440,900],[1024,768],[844,390],[390,844],[320,568]]){await p.setViewportSize({width,height});assert.ok(await p.locator('#zoom-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth));assert.ok(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));await ficha.scrollIntoViewIfNeeded();if(width===1024||width===320)await p.locator('#zoom-dialog').screenshot({path:`docs/verificacion/ficha-${carta.id}-${width}.png`});}
  assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),antes);
  await p.locator('#zoom-dialog [data-action="close"]').click();
  // La consulta de Contenido usa el mismo bloque, aun sin una extracción.
  await p.evaluate(async id=>{const {iniciarInformacion}=await import('./informacion.js');const boton=document.createElement('button');boton.dataset.action='consulta-recurso';boton.dataset.id=id;document.body.append(boton);boton.click();boton.remove();},carta.id);
  assert.equal(await p.locator('#info-dialog .ficha-zombi').count(),1);assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),antes);await p.locator('#info-dialog [data-action="close"]').click();
  if(carta.tipo==='caminantes-terrorcota'){await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await ctx.setOffline(true);await p.reload();await p.locator('#last-preview [data-action="zoom"]').first().click();assert.equal(await p.locator('#zoom-dialog .ficha-zombi').count(),1);assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),antes);}
  await ctx.close();
 }
 assert.deepEqual(errores,[]);console.log('Fichas de seis tipos y variantes core/expansión: detalle y Contenido, atributos, prioridades, atención, cinco tamaños, guardado intacto y offline verificados.');
}finally{await browser.close();}
