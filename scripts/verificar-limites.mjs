import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {newGame,spawn} from '../dist/engine.js';
import {limitesIniciales} from '../dist/limites.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/';
await mkdir('docs/verificacion',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
async function abrir(semilla){
 const context=await browser.newContext({viewport:{width:844,height:390},reducedMotion:'reduce'});
 await context.addInitScript(({key,semilla})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));Math.random=()=>window.azarLimites?.shift()??0;},{key,semilla});
 const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(url);return {context,p};
}
const estado=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
const configurar=p=>p.getByRole('button',{name:'Configuración',exact:true}).click();
const revelar=async p=>{await p.locator('#spawn').click();await p.waitForFunction(()=>['eleccion','lista'].includes(document.querySelector('#batch-dialog').dataset.revelacion));};
const cerrar=async p=>{await p.locator('#batch-dialog [data-action="close"]').click();await p.waitForFunction(()=>!document.querySelector('#batch-dialog').open&&!document.querySelector('[data-action="adrenalina"][data-delta="1"]').disabled);};
try{
 const semilla=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion','asedio'],modoNigromantes:'sin-reposicion',limitesPorAdrenalina:limitesIniciales()},1);
 const {context,p}=await abrir(semilla);await configurar(p);
 assert.equal(await p.locator('#limits-config input').count(),8);
 for(const [mazo,niveles] of Object.entries(limitesIniciales()))for(const [nivel,valor] of Object.entries(niveles))assert.equal(await p.locator(`[name="limite-${mazo}-${nivel}"]`).inputValue(),String(valor));
 await p.locator('[name="limite-nigromantes-naranja"]').fill('3');assert.ok(await p.locator('#save-settings').isDisabled());assert.ok((await p.locator('#settings-errors').textContent()).includes('no pueden disminuir'));await p.locator('[name="limite-nigromantes-naranja"]').fill('2');
 await p.locator('[name="limite-abominaciones-azul"]').fill('0');assert.ok(await p.locator('#new-game').isDisabled());await p.locator('[name="limite-abominaciones-azul"]').fill('1');
 await p.locator('[name="limite-abominaciones-rojo"]').fill('');assert.ok(await p.locator('#save-settings').isDisabled());await p.locator('[name="limite-abominaciones-rojo"]').fill('4');
 await p.locator('[name="limite-abominaciones-rojo"]').evaluate(e=>e.blur());
 for(const [nombre,width,height] of [['escritorio',1440,900],['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568]]){
  await p.setViewportSize({width,height});await p.locator('#limits-config').scrollIntoViewIfNeeded();
  const fallos=await p.locator('#limits-config').evaluate(e=>[...e.querySelectorAll('input,th,.daily-level-name')].filter(n=>{const r=n.getBoundingClientRect();return r.left<0||r.right>innerWidth||n.scrollWidth>n.clientWidth+2;}).map(n=>n.textContent||n.name));assert.deepEqual(fallos,[]);
  assert.ok(await p.locator('#limits-config input').evaluateAll(ns=>ns.every(n=>n.getBoundingClientRect().height>=44)));
  await p.locator('#limits-config').screenshot({path:`docs/verificacion/limites-config-${nombre}.png`});
 }
 await p.setViewportSize({width:844,height:390});await p.locator('#settings-dialog [data-action="close"]').click();
 await revelar(p);assert.equal((await estado(p)).pins.length,1);assert.equal((await estado(p)).necro,1);assert.equal(await p.locator('#batch-grid .enemy-choices').count(),0);assert.ok((await p.locator('#batch-grid').textContent()).includes('Tope alcanzado: 1'));
 await p.screenshot({path:'docs/verificacion/limites-activacion-horizontal.png',fullPage:true});await cerrar(p);
 await configurar(p);for(const nivel of ['azul','amarillo','naranja','rojo'])await p.locator(`[name="limite-nigromantes-${nivel}"]`).fill('2');
 const antes=await estado(p);await p.locator('#save-settings').click();let s=await estado(p);assert.equal(s.config.limitesPorAdrenalina.nigromantes.azul,2);assert.equal(s.history[0].limitesEnemigos.nigromantes,1);assert.deepEqual(s.history,antes.history);
 await p.locator('#reopen').click();assert.equal(await p.locator('#batch-grid .enemy-choices').count(),0);await cerrar(p);
 await revelar(p);assert.equal((await estado(p)).history[1].limitesEnemigos.nigromantes,2);assert.ok(await p.locator('#batch-grid [data-action="elegir-nigromante"][data-value="spawn"]').isVisible());
 await p.locator('#batch-grid [data-action="elegir-nigromante"][data-value="spawn"]').click();await p.locator('#batch-dialog[data-revelacion="lista"]').waitFor();
 assert.equal((await estado(p)).pins.length,2);assert.equal(await p.locator('#batch-grid .enemy-choices').count(),0);assert.equal((await estado(p)).necro,2);await cerrar(p);
 await configurar(p);await p.locator('[name="limite-nigromantes-azul"]').fill('1');await p.locator('#save-settings').click();assert.equal((await estado(p)).pins.length,2);assert.equal((await estado(p)).history[1].limitesEnemigos.nigromantes,2);
 await revelar(p);assert.equal((await estado(p)).pins.length,2);assert.equal((await estado(p)).history[2].limitesEnemigos.nigromantes,1);assert.equal(await p.locator('#batch-grid .enemy-choices').count(),0);await cerrar(p);
 const guardado=await estado(p);await configurar(p);for(const nivel of ['azul','amarillo','naranja','rojo'])await p.locator(`[name="limite-nigromantes-${nivel}"]`).fill('3');
 await p.evaluate(()=>{window.setterLimites=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new DOMException('Quota','QuotaExceededError');};});await p.locator('#save-settings').click();assert.deepEqual(await estado(p),guardado);assert.ok(await p.locator('#settings-dialog').isVisible());await p.evaluate(()=>Storage.prototype.setItem=window.setterLimites);
 await p.locator('#settings-dialog [data-action="close"]').click();await p.locator('#confirm-actions [data-value="salir"]').click();assert.deepEqual(await estado(p),guardado);
 const otra=await context.newPage();otra.on('pageerror',e=>errores.push(e.message));await otra.goto(url);
 await configurar(p);await p.locator('[name="limite-nigromantes-amarillo"]').fill('1');await p.locator('#save-settings').click();await otra.waitForFunction(k=>JSON.parse(localStorage.getItem(k)).config.limitesPorAdrenalina.nigromantes.amarillo===1,key);assert.deepEqual(await estado(otra),await estado(p));await otra.close();
 await p.locator('#reopen').click();await p.locator('#anular-tanda').click();await p.locator('#confirm-actions [data-value="yes"]').click();assert.equal((await estado(p)).history.length,2);assert.equal((await estado(p)).config.limitesPorAdrenalina.nigromantes.azul,1);assert.equal((await estado(p)).config.limitesPorAdrenalina.nigromantes.amarillo,2);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});const offline=await estado(p);await context.setOffline(true);await p.reload();assert.deepEqual(await estado(p),offline);
 await revelar(p);assert.equal((await estado(p)).pins.length,2);assert.equal(await p.locator('#batch-grid .enemy-choices').count(),0);await cerrar(p);
 await configurar(p);assert.equal(await p.locator('[name="limite-nigromantes-amarillo"]').inputValue(),'2');await p.locator('#new-game').click();await p.locator('#confirm-actions [data-value="yes"]').click();assert.equal((await estado(p)).pins.length,0);assert.equal((await estado(p)).nivelAdrenalina,'azul');assert.equal((await estado(p)).config.limitesPorAdrenalina.nigromantes.amarillo,2);await context.close();
 // Ajustar el perfil no cambia la elección que quedó guardada en una tanda anterior.
 const altos=limitesIniciales();altos.abominaciones={azul:2,amarillo:2,naranja:2,rojo:2};
 const previa=newGame({easy:true,normal:true,threshold:0,selectedIds:['abominacion'],limitesPorAdrenalina:altos},2);spawn(previa,()=>0);previa.openBatch=false;
 const b=await abrir(previa);await configurar(b.p);for(const nivel of ['azul','amarillo','naranja','rojo'])await b.p.locator(`[name="limite-abominaciones-${nivel}"]`).fill('1');await b.p.locator('#save-settings').click();await b.p.locator('#reopen').click();
 await b.p.locator('#batch-grid [data-action="elegir-abominacion"][data-value="spawn"]').click();assert.equal((await estado(b.p)).pins.length,2);assert.equal((await estado(b.p)).history[0].limitesEnemigos.abominaciones,2);await cerrar(b.p);await revelar(b.p);assert.equal((await estado(b.p)).pins.length,2);assert.equal((await estado(b.p)).history[1].limitesEnemigos.abominaciones,1);await b.context.close();
 // Leer un guardado sin límites no escribe perfiles ni inventa topes históricos.
 const legado=newGame({easy:true,normal:true,threshold:0,selectedIds:['abominacion']},1);spawn(legado,()=>0);legado.openBatch=false;
 const c=await abrir(legado);assert.deepEqual(await estado(c.p),legado);await revelar(c.p);assert.equal((await estado(c.p)).history[0].limitesEnemigos,undefined);assert.equal((await estado(c.p)).history[1].limitesEnemigos.abominaciones,1);assert.equal((await estado(c.p)).pins.length,1);await c.context.close();
 assert.deepEqual(errores,[]);console.log('Topes: valores aprobados, monotonia/enteros, cinco tamaños, activacion automatica, pendientes, ajustes desde proxima tanda, presencia conservada, cuota, pestañas, anular, offline, nueva partida y legado.');
}finally{await browser.close();}
