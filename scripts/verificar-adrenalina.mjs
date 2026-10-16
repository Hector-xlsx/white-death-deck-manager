import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/';
await mkdir('docs/verificacion',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
async function crearContexto(semilla){
 const context=await browser.newContext({viewport:{width:844,height:390},reducedMotion:'reduce'});
 await context.addInitScript(({key,semilla})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));},{key,semilla});
 const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(url);
 return {context,p};
}
try{
 const {context,p}=await crearContexto(newGame({easy:true,normal:true,threshold:0,selectedIds:['asedio'],modoNigromantes:'sin-reposicion'},1));
 const estado=()=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 const subir=p.getByRole('button',{name:'Subir nivel de adrenalina',exact:true}),bajar=p.getByRole('button',{name:'Bajar nivel de adrenalina',exact:true});
 assert.equal(await p.locator('#adrenalina-label').textContent(),'Nivel de adrenalina');assert.ok(await bajar.isDisabled());
 const antes=await estado();await subir.click();assert.equal((await estado()).nivelAdrenalina,'amarillo');
 assert.deepEqual({...await estado(),nivelAdrenalina:'azul'},antes);
 await p.reload();assert.equal(await p.locator('#nivel-adrenalina').textContent(),'Amarillo');await bajar.click();
 const fondos=new Set();
 for(const [i,nombre] of ['Azul','Amarillo','Naranja','Rojo'].entries()){
  assert.equal(await p.locator('#nivel-adrenalina').textContent(),nombre);
  assert.equal(await p.locator('#nivel-adrenalina').evaluate(e=>getComputedStyle(e).color),'rgb(255, 255, 255)');
  fondos.add(await p.locator('#nivel-adrenalina').evaluate(e=>getComputedStyle(e).backgroundColor));
  await p.locator('.adrenalina-selector').screenshot({path:`docs/verificacion/adrenalina-color-${nombre.toLowerCase()}.png`});
  if(i<3)await subir.click();
 }
 assert.equal(fondos.size,4);assert.ok(await subir.isDisabled());
 await p.setViewportSize({width:924,height:390});
 await p.evaluate(()=>{
  const comparacion=document.createElement('div');comparacion.id='adrenalina-comparacion';
  comparacion.style.cssText='display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:20px;background:#172632;width:884px';
  for(const [i,nivel] of ['azul','amarillo','naranja','rojo'].entries()){
   const selector=document.querySelector('.adrenalina-selector').cloneNode(true);selector.style.gridColumn='auto';selector.style.gridRow='auto';
   const output=selector.querySelector('output');output.dataset.nivel=nivel;output.textContent=nivel[0].toUpperCase()+nivel.slice(1);
   const botones=selector.querySelectorAll('button');botones[0].disabled=i===0;botones[1].disabled=i===3;comparacion.append(selector);
  }
  document.body.append(comparacion);
 });
 await p.locator('#adrenalina-comparacion').screenshot({path:'docs/verificacion/adrenalina-colores.png'});
 await p.locator('#adrenalina-comparacion').evaluate(e=>e.remove());
 await p.setViewportSize({width:844,height:390});
 for(let i=0;i<3;i++)await bajar.click();assert.ok(await bajar.isDisabled());
 for(const [nombre,width,height] of [['escritorio',1440,900],['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568]]){
  await p.setViewportSize({width,height});
  const medidas=await p.locator('.brand').evaluate(e=>{
   const selector=e.querySelector('.adrenalina-selector').getBoundingClientRect();
   const botones=[...e.querySelectorAll('button')].map(b=>b.getBoundingClientRect());
   const elementos=[...e.querySelectorAll('.wordmark,.test-tag,.adrenalina-selector,.settings-button')].filter(n=>n.getClientRects().length).map(n=>n.getBoundingClientRect());
   const solapados=elementos.some((a,i)=>elementos.slice(i+1).some(b=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1));
   return {centrado:Math.abs((selector.left+selector.right)/2-innerWidth/2)<2,botones:botones.every(b=>b.width>=44&&b.height>=44),dentro:elementos.every(r=>r.left>=0&&r.right<=innerWidth),solapados,ancho:document.documentElement.scrollWidth<=innerWidth};
  });assert.deepEqual(medidas,{centrado:true,botones:true,dentro:true,solapados:false,ancho:true});
  await p.screenshot({path:`docs/verificacion/adrenalina-${nombre}.png`,fullPage:true});
  if(nombre==='horizontal')await p.locator('.brand').screenshot({path:'docs/verificacion/adrenalina-encabezado.png'});
 }
 await p.setViewportSize({width:844,height:390});await subir.focus();await p.keyboard.press('Enter');
 assert.equal(await p.locator('#nivel-adrenalina').textContent(),'Amarillo');
 await p.locator('#spawn').click();await p.locator('#batch-dialog[data-revelacion="lista"]').waitFor();
 assert.equal((await estado()).nivelAdrenalina,'amarillo');assert.equal((await estado()).history[0].nivelAdrenalina,'amarillo');
 assert.equal(await p.locator('#batch-dialog .adrenalina-selector').count(),0);assert.ok(await subir.isDisabled());
 await p.locator('#batch-dialog [data-action="close"]').click();await subir.click();
 assert.equal((await estado()).nivelAdrenalina,'naranja');assert.equal((await estado()).history[0].nivelAdrenalina,'amarillo');
 await p.locator('#reopen').click();assert.equal((await estado()).history[0].nivelAdrenalina,'amarillo');
 await p.locator('#anular-tanda').click();await p.locator('#confirm-actions [data-value="yes"]').click();
 assert.equal((await estado()).nivelAdrenalina,'amarillo');assert.equal((await estado()).history.length,0);
 const otra=await context.newPage();otra.on('pageerror',e=>errores.push(e.message));await otra.goto(url);
 await subir.click();await otra.locator('#nivel-adrenalina[data-nivel="naranja"]').waitFor();await bajar.click();await otra.locator('#nivel-adrenalina[data-nivel="amarillo"]').waitFor();await otra.close();
 const guardado=await estado();await p.evaluate(()=>{window.guardarOriginal=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new DOMException('Quota','QuotaExceededError');};});
 await subir.click();assert.deepEqual(await estado(),guardado);assert.equal(await p.locator('#nivel-adrenalina').textContent(),'Amarillo');assert.ok((await p.locator('#toast').textContent()).includes('No se pudo guardar'));
 await p.evaluate(()=>Storage.prototype.setItem=window.guardarOriginal);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 await context.setOffline(true);await p.reload();assert.equal(await p.locator('#nivel-adrenalina').textContent(),'Amarillo');await subir.click();assert.equal((await estado()).nivelAdrenalina,'naranja');
 await p.getByRole('button',{name:'Configuración',exact:true}).click();await p.locator('#new-game').click();await p.locator('#confirm-actions [data-value="yes"]').click();
 assert.equal((await estado()).nivelAdrenalina,'azul');assert.equal(await p.locator('#nivel-adrenalina').textContent(),'Azul');await context.close();
 const legado=newGame();spawn(legado,()=>.99);legado.openBatch=false;delete legado.nivelAdrenalina;delete legado.history[0].nivelAdrenalina;delete legado.respaldoTanda.estado.nivelAdrenalina;
 const viejo=await crearContexto(legado);assert.equal(await viejo.p.locator('#nivel-adrenalina').textContent(),'Azul');assert.deepEqual(await viejo.p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key),legado);await viejo.context.close();
 assert.deepEqual(errores,[]);
 console.log('Adrenalina: cuatro fondos y texto blanco, cinco viewports, centro y botones 44px, teclado, extremos, guardado, SPAWN sin incremento, nivel por tanda, anular, dos pestañas, cuota, recarga offline, nueva partida y legado intacto.');
}finally{await browser.close();}
