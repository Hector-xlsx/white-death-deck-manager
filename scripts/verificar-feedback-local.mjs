import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',s=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'},3);
s.nivelAdrenalina='amarillo';spawn(s,()=>0);s.openBatch=false;s.nivelAdrenalina='naranja';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const ctx=await browser.newContext({viewport:{width:960,height:600},reducedMotion:'reduce'});
 await ctx.addInitScript(({s,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{s,key});
 const p=await ctx.newPage(),errores=[];p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8095/mazo/');
 assert.equal(await p.locator('#reopen').textContent(),'Ver');assert.equal(await p.locator('#open-inplay').textContent(),'Ampliar');
 assert.deepEqual(await p.locator('.inplay-heading').evaluate(e=>[...e.children].map(n=>n.id||n.tagName)),['H2','open-inplay','toggle-desfijados']);
 assert.equal(await p.locator('#reopen').evaluate(e=>e.previousElementSibling.tagName),'H2');
 for(const [width,height] of [[1440,900],[960,600],[844,390],[390,844],[320,568]]){
  await p.setViewportSize({width,height});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.locator('#reopen').click();assert.equal(await p.locator('#batch-adrenalina').textContent(),'Amarillo');
  assert.equal(await p.locator('#batch-adrenalina').getAttribute('data-nivel'),'amarillo');
  assert.equal(await p.locator('#batch-dialog').evaluate(e=>e.scrollWidth>e.clientWidth+1),false);
  await p.locator('#batch-dialog [data-action="close"]').click();
  await p.getByRole('button',{name:'Configuración',exact:true}).click();
  for(const tab of ['General','Contenido','Mazos','Apariencia']){
   await p.getByRole('tab',{name:tab,exact:true}).click();assert.equal(await p.locator('#config-nueva-partida').isVisible(),tab==='General');
  }
  await p.locator('#settings-dialog .close-button').click();
 }
 await p.setViewportSize({width:960,height:600});await p.locator('#reopen').click();
 await mkdir('docs/verificacion',{recursive:true});await p.screenshot({path:'docs/verificacion/feedback-adrenalina-tablet.png'});
 await p.locator('#batch-dialog [data-action="close"]').click();
 await p.locator('#spawn').click();assert.equal(await p.locator('#batch-adrenalina').textContent(),'Naranja');
 await p.locator('#batch-grid [data-action="replace"]').first().click();
 await p.locator('#anular-tanda').click();await p.locator('#confirm-dialog [data-value="yes"]').click();
 const estado=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 assert.equal(estado.history.length,1);const eventos=estado.registroActividad.eventos;
 assert.ok(eventos.some(e=>e.tipo==='spawn'&&e.tanda===2));assert.ok(eventos.some(e=>e.tipo==='cambio-cartas'));assert.equal(eventos.at(-1).tipo,'tanda-anulada');
 assert.ok(eventos.every(e=>Number.isFinite(e.fecha)));assert.ok(eventos.at(-1).cambios.some(c=>c.ruta.join('/')==='history/1'&&c.antes.slots[0].draws.length===2));
 await p.getByRole('button',{name:'Historial',exact:true}).click();
 const descarga=p.waitForEvent('download');await p.locator('#exportar-partida').click();const archivo=await descarga;
 const stream=await archivo.createReadStream();let contenido='';for await(const bytes of stream)contenido+=bytes.toString();assert.deepEqual(JSON.parse(contenido).partida.registroActividad,estado.registroActividad);
 await p.locator('#history-dialog .close-button').click();await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 await ctx.setOffline(true);await p.reload();assert.deepEqual(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).registroActividad,key),estado.registroActividad);
 assert.deepEqual(errores,[]);await ctx.close();console.log('Feedback local: cinco tamaños, insignia histórica, orden y formato de botones, nueva partida solo General, SPAWN/reemplazo/anulación con timestamp, exportación y recuperación offline.');
}finally{await browser.close();}
