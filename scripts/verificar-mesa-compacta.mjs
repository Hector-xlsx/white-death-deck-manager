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
}
s.openBatch=false;
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const ctx=await browser.newContext({viewport:{width:1024,height:600},reducedMotion:'reduce'});
 await ctx.addInitScript(({s,key})=>{
  if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));
  window.solicitudesPantalla=0;window.liberacionesPantalla=0;window.rechazarPantalla=false;
  Object.defineProperty(navigator,'wakeLock',{configurable:true,value:{request:async()=>{
   window.solicitudesPantalla++;if(window.rechazarPantalla)throw new Error('Sin permiso');
   const b=Object.assign(new EventTarget(),{released:false});b.release=async()=>{b.released=true;window.liberacionesPantalla++;b.dispatchEvent(new Event('release'));};return b;
  }}});
 },{s,key});
 const p=await ctx.newPage(),errores=[];p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8093/mazo/');
 const guardado=await p.evaluate(k=>localStorage.getItem(k),key);
 await p.getByRole('button',{name:'Configuración',exact:true}).click();await p.getByRole('tab',{name:'General',exact:true}).click();
 const despertar=p.locator('#mantener-pantalla'),estado=p.locator('#pantalla-estado');assert.equal(await p.locator('#buscar-actualizacion').isVisible(),true);
 assert.equal(await p.locator('#buscar-actualizacion').evaluate(e=>Boolean(e.closest('details'))),false);
 await despertar.check();await estado.filter({hasText:'Activo:'}).waitFor();assert.equal(await p.evaluate(()=>window.solicitudesPantalla),1);
 await p.reload();await p.getByRole('button',{name:'Configuración',exact:true}).click();await p.getByRole('tab',{name:'General',exact:true}).click();await estado.filter({hasText:'Activo:'}).waitFor();assert.equal(await despertar.isChecked(),true);assert.equal(await p.evaluate(()=>window.solicitudesPantalla),1);
 await p.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'hidden'});document.dispatchEvent(new Event('visibilitychange'));});
 await p.waitForFunction(()=>window.liberacionesPantalla===1);
 await p.evaluate(()=>{Object.defineProperty(document,'visibilityState',{configurable:true,value:'visible'});document.dispatchEvent(new Event('visibilitychange'));});await estado.filter({hasText:'Activo:'}).waitFor();assert.equal(await p.evaluate(()=>window.solicitudesPantalla),2);
 await despertar.uncheck();await estado.filter({hasText:'Desactivado'}).waitFor();
 await p.evaluate(()=>window.rechazarPantalla=true);await despertar.check();await estado.filter({hasText:'no permitió'}).waitFor();await despertar.uncheck();
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),guardado);
 await p.screenshot({path:'docs/verificacion/general-tablet.png'});
 await p.locator('#settings-dialog .close-button').click();await p.locator('#reopen').click();
 const guardadoAbierto=await p.evaluate(k=>localStorage.getItem(k),key);
 assert.equal(await p.locator('#batch-dialog .dialog-note').count(),0);
 assert.ok(await p.locator('#batch-grid .enemy-frame').count());
 const posiciones=()=>p.locator('#batch-grid .draw-card').evaluateAll(es=>es.map(e=>({token:e.querySelector('.spawn-zone-token,.spawn-zone-space').getBoundingClientRect().top,imagen:e.querySelector('.card-image').getBoundingClientRect().top,acciones:e.querySelector('.card-actions')?.getBoundingClientRect().top})));
 const antes=await posiciones();await p.locator('#batch-grid .enemy-frame').evaluateAll(es=>es.forEach(e=>e.remove()));assert.deepEqual(await posiciones(),antes,'Sin marcos se conserva exactamente la geometría');
 await p.reload();await p.locator('#batch-grid .enemy-frame').first().waitFor();
 for(const [w,h] of [[1440,900],[1024,600],[1024,768],[844,390],[390,844],[320,568]]){
  await p.setViewportSize({width:w,height:h});
  assert.equal(await p.locator('#batch-dialog').evaluate(e=>e.scrollWidth>e.clientWidth+1),false,`Desbordamiento ${w}`);
  const filas=await posiciones();for(const fila of filas){const iguales=filas.filter(f=>Math.abs(f.token-fila.token)<1);assert.ok(iguales.every(f=>Math.abs(f.imagen-fila.imagen)<1&&Math.abs(f.acciones-fila.acciones)<1),'Marcos y cartas normales alineados');}
  if(w===1024){const primera=await p.locator('#batch-grid .card-actions').first().boundingBox();assert.ok(primera.y+primera.height<=h-8,'Botones de primera fila visibles en tablet');}
  await p.locator('#aparicion-alejar').click();assert.equal(await p.locator('#aparicion-escala').textContent(),'95%');
  const acciones=await p.locator('#batch-grid .card-actions button').evaluateAll(es=>es.map(e=>e.getBoundingClientRect()));assert.ok(acciones.every(r=>r.height>=43.9&&r.width>=43.9));
  await p.locator('#aparicion-acercar').click();
  if(w===1024&&h===600)await p.screenshot({path:'docs/verificacion/aparicion-compacta-tablet.png'});
 }
 await p.locator('#aparicion-acercar').click({clickCount:5});assert.equal(await p.locator('#aparicion-escala').textContent(),'125%');assert.equal(await p.locator('#aparicion-acercar').isDisabled(),true);
 assert.equal(await p.locator('#batch-dialog').evaluate(e=>e.scrollWidth>e.clientWidth+1),false);
 for(let i=0;i<10;i++)await p.locator('#aparicion-alejar').click();assert.equal(await p.locator('#aparicion-escala').textContent(),'75%');assert.equal(await p.locator('#aparicion-alejar').isDisabled(),true);
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),guardadoAbierto);
 await p.locator('#batch-dialog [data-action="close"]').click();await p.getByRole('button',{name:'Configuración',exact:true}).click();await p.getByRole('tab',{name:'General',exact:true}).click();
 // La preferencia continúa desmarcada y los controles generales están disponibles offline.
 await p.locator('#settings-dialog .close-button').click();await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await ctx.setOffline(true);await p.reload();await p.getByRole('button',{name:'Configuración',exact:true}).click();await p.getByRole('tab',{name:'General',exact:true}).click();assert.equal(await despertar.isChecked(),false);assert.equal(await p.locator('#buscar-actualizacion').isVisible(),true);
 assert.deepEqual(errores,[]);await ctx.close();console.log('Mesa compacta: General directo, wake lock simulado/rechazo/pausa/recuperación, seis tamaños, reserva estable con/sin marco, botones visibles en tablet, escala 75–125%, guardado intacto y offline.');
}finally{await browser.close();}
