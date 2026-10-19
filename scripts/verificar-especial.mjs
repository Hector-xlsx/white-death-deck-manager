import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2',url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/';
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
const base={easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal','spawn-559','spawn-565'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'};
async function pagina(s){
 const ctx=await browser.newContext({viewport:{width:1024,height:768},reducedMotion:'reduce'});
 await ctx.addInitScript(({s,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));Math.random=()=>.99;},{s,key});
 const p=await ctx.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(url);return {ctx,p};
}
try{
 const {ctx,p}=await pagina(newGame(base,2));
 const abrir=()=>p.getByRole('button',{name:'Configuración',exact:true}).click();
 await abrir();assert.equal(await p.locator('[name="especial-modo"]').inputValue(),'directo');
 await p.locator('[name="especial-modo"]').selectOption('probabilidad');
 for(const n of ['azul','amarillo','naranja','rojo']){await p.locator(`[name="especial-base-${n}"]`).fill('100');await p.locator(`[name="especial-incremento-${n}"]`).fill('5');}
 await p.locator('[data-especial-cantidad="spawn-559"]').fill('2');await p.locator('[data-especial-set="spawn-565"]').selectOption('general');
 assert.equal(await p.locator('[data-especial-elegible="spawn-565"]').isChecked(),true);
 await p.locator('[name="especial-limite"]').fill('1');
 await p.locator('[name="especial-compensar"]').check();
 await p.locator('[name="dailyHabilitado"]').check();await p.locator('[name="especial-daily"]').selectOption('integrado');
 assert.equal(await p.locator('[data-especial-cantidad="daily-du01"]').count(),1);
 await p.locator('[data-especial-cantidad="daily-du01"]').fill('4');
 // Ocultar/mostrar Daily no debe perder cantidades editadas del borrador.
 await p.locator('[name="especial-daily"]').selectOption('independiente');assert.equal(await p.locator('[data-especial-cantidad="daily-du01"]').count(),0);
 await p.locator('[name="especial-daily"]').selectOption('integrado');assert.equal(await p.locator('[data-especial-cantidad="daily-du01"]').inputValue(),'4');
 await p.locator('[name="especial-daily"]').selectOption('independiente');await p.locator('[name="dailyHabilitado"]').uncheck();
 for(const [nombre,width,height] of [['escritorio',1440,900],['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568]]){
  await p.setViewportSize({width,height});await p.locator('#especial-config').scrollIntoViewIfNeeded();
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  assert.equal(await p.locator('#settings-dialog').evaluate(e=>e.scrollWidth>e.clientWidth+1),false);
  if(['horizontal','vertical'].includes(nombre))await p.screenshot({path:`docs/verificacion/especial-config-${nombre}.png`});
 }
 await p.locator('#save-settings').click();assert.equal(await p.locator('#settings-dialog').isVisible(),false);
 const conf=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).proximaConfig.spawnEspecial,key);assert.equal(conf.cantidades['spawn-559'],2);assert.equal(conf.destinos['spawn-565'],'general');assert.equal(conf.limite,1);
 await p.locator('#spawn').click();await p.locator('#batch-dialog').waitFor();await p.waitForFunction(()=>document.querySelectorAll('#batch-grid [inert]').length===0);
 const historial=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).history,key);
 const otra=await ctx.newPage();otra.on('pageerror',e=>errores.push(e.message));await otra.goto(url);assert.deepEqual(await otra.evaluate(k=>JSON.parse(localStorage.getItem(k)).history,key),historial);await p.locator('#batch-dialog .close-button').click();await otra.locator('#batch-dialog').waitFor({state:'hidden'});await p.locator('#reopen').click();await otra.locator('#batch-dialog').waitFor();assert.deepEqual(await otra.evaluate(k=>JSON.parse(localStorage.getItem(k)).history,key),historial);await otra.close();assert.equal(historial[0].slots.filter(t=>t.draws[0].especialIntento?.resultado==='spawn').length,1);
 assert.match(await p.locator('#batch-grid').textContent(),/Spawn Especial/);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await ctx.setOffline(true);await p.reload();assert.deepEqual(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).history,key),historial);
 await p.locator('#batch-dialog .close-button').click();await abrir();assert.equal(await p.locator('[name="especial-modo"]').inputValue(),'probabilidad');assert.equal(await p.locator('[data-especial-cantidad="spawn-559"]').inputValue(),'2');
 await p.locator('[data-especial-cantidad="spawn-559"]').fill('0');assert.equal(await p.locator('#save-settings').isDisabled(),true);await p.locator('[data-especial-cantidad="spawn-559"]').fill('3');
 const bytes=await p.evaluate(k=>localStorage.getItem(k),key);await p.evaluate(()=>{window.original=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('Quota');};});await p.locator('#save-settings').click();assert.equal(await p.locator('#settings-dialog').isVisible(),true);assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);await ctx.close();
 const trigger=newGame({...base,selectedIds:['caminantes-normal','spawn-559'],spawnEspecial:{modo:'disparadores',disparadores:6}},1);for(const id of Object.keys(trigger.remaining))trigger.remaining[id]=Number(id==='spawn-especial');
 const t=await pagina(trigger);await t.p.locator('#spawn').click();await t.p.waitForFunction(()=>document.querySelector('#batch-dialog')?.open&&document.querySelectorAll('#batch-grid [inert]').length===0);
 assert.equal(await t.p.locator('#batch-grid .draw-card').count(),1);assert.match(await t.p.locator('#batch-grid .card-image').getAttribute('aria-label'),/terrorcota/);assert.equal(await t.p.locator('#batch-grid .card-image img').getAttribute('src'),'./recursos/02 Mazo Spawn - Expansiones/559_Caminantes_de_terrorcota.png');
 await t.p.screenshot({path:'docs/verificacion/especial-disparador.png'});await t.p.locator('#batch-grid [data-action="discard"]').click();assert.equal(await t.p.locator('#batch-grid .draw-card.discarded').count(),1);await t.ctx.close();
 assert.deepEqual(errores,[]);console.log('Spawn Especial: configuración, cantidades, destinos, elegibilidad, Daily, límite, cinco tamaños, disparador con imagen final, descarte, cuota y recarga offline verificados.');
}finally{await browser.close();}
