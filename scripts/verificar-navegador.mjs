import {createRequire} from 'node:module';
import {mkdir,readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {datos} from '../dist/catalogo.js';
import {newGame} from '../dist/engine.js';
const dimensiones=async ruta=>{const b=await readFile(new URL(`../${ruta}`,import.meta.url));return{width:b.readUInt32BE(16),height:b.readUInt32BE(20)};};
const dimensionesNigromante=await dimensiones('recursos/Imagenes generales/Marcador de zonas de nigromante.png');
const dimensionesNormal=await dimensiones('recursos/Imagenes generales/Marcador de zonas de estandar.png');
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const origen=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/';
const salida=new URL('../docs/verificacion/',import.meta.url);
await mkdir(salida,{recursive:true});
const browser=await chromium.launch({headless:true,channel:process.env.MAZO_NAVEGADOR||'chrome'});
const errores=[];
const estado=page=>page.evaluate(()=>JSON.parse(localStorage.getItem('white-death-gestor-v2')));
async function sinDesbordamiento(page){
 await page.locator('.necro-marker').evaluate(async e=>{await e.decode();});
 assert.ok(await page.locator('.necro-marker').evaluate((e,d)=>{
  const r=e.closest('.zone-marker-frame').getBoundingClientRect(),c=e.closest('.counter').getBoundingClientRect();
  return e.naturalWidth===d.width&&e.naturalHeight===d.height&&r.width>0&&r.height>0&&r.left>=c.left&&r.right<=c.right+1;
 },dimensionesNigromante));
 assert.ok(await page.locator('.console').evaluate(e=>{
  const [a,b]=[...e.querySelectorAll('.zone-marker-frame')].map(e=>e.getBoundingClientRect());
  const [n,m]=[...e.querySelectorAll('.counter output')].map(e=>e.getBoundingClientRect());
  return Math.abs(a.top-b.top)<1&&Math.abs(a.width-b.width)<1&&Math.abs(a.height-b.height)<1&&Math.abs(n.top-m.top)<1&&[...e.querySelectorAll('.zone-marker')].every(i=>getComputedStyle(i).objectFit==='fill');
 }));
 const fallos=await page.evaluate(()=>{
  const pantalla=document.documentElement.clientWidth;
  const dialogos=[...document.querySelectorAll('dialog[open]')];
  const superficie=dialogos.at(-1)||document.querySelector('main');
  const items=[...superficie.querySelectorAll('button,input,output,h1,h2,summary')].filter(e=>e.getClientRects().length);
  return items.filter(e=>{if(e.closest('.last-strip,.pin-strip'))return false;const r=e.getBoundingClientRect();return r.left<-1||r.right>pantalla+1||e.scrollWidth>e.clientWidth+2;}).map(e=>({texto:e.textContent.trim(),tag:e.tagName}));
 });assert.deepEqual(fallos,[]);
}
try{
 const context=await browser.newContext({viewport:{width:844,height:390}});
 await context.addInitScript(semilla=>{if(!localStorage.getItem('white-death-gestor-v2'))localStorage.setItem('white-death-gestor-v2',JSON.stringify(semilla));Math.random=()=>0;},newGame());
 const page=await context.newPage();page.on('pageerror',e=>errores.push(e.message));
 await page.goto(origen);
 await page.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:60000});
 await sinDesbordamiento(page);await page.screenshot({path:fileURLToPath(new URL('telefono-horizontal.png',salida)),fullPage:true});
 await page.locator('#spawn').click();await page.locator('#batch-dialog').waitFor({state:'visible'});
 const primero=await estado(page);assert.equal(primero.sequence,3);
 await page.reload();await page.locator('#batch-dialog').waitFor({state:'visible'});assert.deepEqual(await estado(page),primero);
 await page.locator('#batch-dialog [data-action="pin"]').first().click();
 await page.locator('#batch-dialog [data-action="replace"]').first().click();
 assert.equal((await estado(page)).sequence,4);
 await page.locator('#batch-dialog [data-action="discard"]').first().click();const descarte=await estado(page);
 assert.equal(await page.locator('#batch-dialog [data-action="add-zone"][data-kind="normal"]').count(),0);
 assert.equal(await page.locator('#anular-tanda').isEnabled(),true);
 await page.locator('#batch-dialog [data-action="add-zone"][data-kind="necro"]').click();
 assert.equal((await estado(page)).normal,3);assert.equal((await estado(page)).necro,1);
 await page.locator('#batch-dialog [data-action="zoom"]').first().click();
 await page.keyboard.press('Escape');assert.equal(await page.locator('#batch-dialog').isVisible(),true);assert.equal(await page.locator('#zoom-dialog').isVisible(),false);
 await page.locator('#batch-dialog [data-action="close"]').click();
 await page.locator('[data-action="settings"]').click();
 assert.equal(await page.locator('#content-selector .zombie-row').filter({hasText:'Brutos:'}).count(),1);
 await page.locator('input[name="carta"][value="brutos-normal"]').uncheck();
 await page.locator('#save-settings').click();assert.equal((await estado(page)).initial['brutos-normal'],4);assert.equal((await estado(page)).proximaConfig.selectedIds.includes('brutos-normal'),false);
 await page.locator('[data-action="settings"]').click();assert.equal(await page.locator('input[name="carta"][value="brutos-normal"]').isChecked(),false);
 await page.locator('[name="filtro-contenido"][value="otros"]').check();
 await page.locator('#content-selector summary').filter({hasText:/^Ayudas de reglas/}).click();
 await page.locator('[data-action="consulta-recurso"][data-id="referencia-death-notes"]').click();
 const antesInfo=await estado(page);
 await page.locator('#info-content [data-action="ampliar-recurso"]').first().click();
 await page.keyboard.press('Escape');assert.equal(await page.locator('#info-dialog').isVisible(),true);
 await page.locator('#info-dialog [data-action="close"]').click();assert.equal(await page.locator('#settings-dialog').isVisible(),true);assert.deepEqual(await estado(page),antesInfo);
 await page.locator('#settings-dialog [data-action="close"]').click();
 for(const [nombre,viewport] of [['telefono-vertical',{width:390,height:844}],['telefono-estrecho',{width:320,height:568}],['tablet',{width:1024,height:768}]]){
  await page.setViewportSize(viewport);await sinDesbordamiento(page);
  await page.screenshot({path:fileURLToPath(new URL(`${nombre}.png`,salida)),fullPage:true});
  await page.locator('[data-action="reopen"]').click();await sinDesbordamiento(page);
  await page.screenshot({path:fileURLToPath(new URL(`${nombre}-aparicion.png`,salida)),fullPage:true});
  const imagenes=await page.locator('#batch-grid img').evaluateAll(imgs=>imgs.every(i=>i.complete&&i.naturalWidth>0));assert.ok(imagenes);
  await page.locator('#batch-dialog [data-action="close"]').click();
 }
 await context.setOffline(true);
 const todos=await page.evaluate(async rutas=>{
  for(const ruta of rutas){const r=await fetch(`./${ruta}`);if(!r.ok)return {ruta,status:r.status};const blob=await r.blob();const bitmap=await createImageBitmap(blob);if(!bitmap.width)return {ruta};bitmap.close();}
  return {ok:true};
 },datos.recursos.recursos.map(r=>r.ruta));assert.deepEqual(todos,{ok:true});
 assert.ok(await page.evaluate(async d=>{
  const r=await fetch('./recursos/Imagenes generales/Marcador de zonas de nigromante.png');
  const bitmap=await createImageBitmap(await r.blob());const correcto=r.ok&&bitmap.width===d.width&&bitmap.height===d.height;bitmap.close();return correcto;
 },dimensionesNigromante));
 assert.ok(await page.evaluate(async d=>{
  const r=await fetch('./recursos/Imagenes generales/Marcador de zonas de estandar.png');
  const bitmap=await createImageBitmap(await r.blob());const correcto=r.ok&&bitmap.width===d.width&&bitmap.height===d.height;bitmap.close();return correcto;
 },dimensionesNormal));
 await page.locator('#spawn').click();const sinRed=await estado(page);await page.reload();await page.locator('#batch-dialog').waitFor({state:'visible'});assert.deepEqual(await estado(page),sinRed);
 await page.locator('#batch-dialog [data-action="close"]').click();await page.locator('[data-action="history"]').click();assert.ok(await page.locator('.history-group').count());await page.locator('#history-dialog [data-action="close"]').click();
 await page.locator('[data-action="settings"]').click();await page.locator('#new-game').click();await page.locator('[data-action="confirm"][data-value="cancel"]').click();assert.deepEqual(await estado(page),{...sinRed,openBatch:false});
 await page.locator('#settings-dialog [data-action="close"]').click();
 await context.setOffline(false);
 // La simulacion de cuota se aplica al prototipo usado por la UI real.
 await page.evaluate(()=>{window.escrituraOriginal=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Sin espacio','QuotaExceededError');};});
 const antesFallo=await estado(page);await page.locator('#spawn').click();assert.deepEqual(await estado(page),antesFallo);assert.equal(await page.locator('#batch-dialog').isVisible(),false);
 await page.evaluate(()=>Storage.prototype.setItem=window.escrituraOriginal);
 const segunda=await context.newPage();await segunda.goto(origen);
 await page.locator('[data-action="counter"][data-kind="normal"][data-delta="1"]').click();await segunda.waitForFunction(n=>document.getElementById('normal-count').textContent===String(n),antesFallo.normal+1);
 await segunda.close();await context.close();
 const migracion=await browser.newContext();const vieja=JSON.parse(await readFile(new URL('../datos/ejemplo_partida_v1_SINTETICO.json',import.meta.url),'utf8'));
 await migracion.addInitScript(v=>{if(!localStorage.getItem('white-death-mvp-v1'))localStorage.setItem('white-death-mvp-v1',JSON.stringify(v));},vieja);
 const mp=await migracion.newPage();mp.on('pageerror',e=>errores.push(e.message));await mp.goto(origen);await mp.locator('#batch-dialog').waitFor({state:'visible'});
 assert.equal((await estado(mp)).sequence,3);assert.equal((await estado(mp)).version,2);assert.deepEqual(await mp.evaluate(()=>JSON.parse(localStorage.getItem('white-death-mvp-v1'))),vieja);
 await migracion.close();
 assert.deepEqual(errores,[]);
 console.log(`Navegador: subruta, 4 tamanos, acciones, recuperacion, cuota, pestañas, migracion y ${datos.recursos.recursos.length} imagenes offline comprobados.`);
}finally{await browser.close();}
