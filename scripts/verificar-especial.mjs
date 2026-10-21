import {abrirSeccionesConfiguracion} from './ayuda-configuracion.mjs';
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
 const {ctx,p}=await pagina(newGame(base,2));p.setDefaultTimeout(15000);
 const abrir=async()=>{await p.getByRole('button',{name:'Configuración',exact:true}).click();await abrirSeccionesConfiguracion(p,'Mazos',['general','daily']);};
 await abrir();assert.equal(await p.locator('[name="especial-modo"]').inputValue(),'directo');
 await p.locator('[name="especial-modo"]').selectOption('probabilidad');
 for(const n of ['azul','amarillo','naranja','rojo']){await p.locator(`[name="especial-base-${n}"]`).fill('100');await p.locator(`[name="especial-incremento-${n}"]`).fill('5');}
 await p.locator('[data-especial-cantidad="spawn-559"]').evaluate(e=>e.closest('details').open=true);
 await p.locator('[data-especial-set="spawn-565"]').evaluate(e=>e.closest('details').open=true);
 await p.locator('[data-especial-cantidad="spawn-559"]').fill('2');await p.locator('[data-especial-set="spawn-565"]').selectOption('general');
 assert.equal(await p.locator('[data-especial-elegible="spawn-565"]').isChecked(),true);
 await p.locator('[name="especial-limite"]').fill('1');
 await p.locator('[name="especial-compensar"]').check();
 await p.locator('[name="dailyHabilitado"]').check();await p.locator('[name="especial-daily"]').selectOption('integrado');
 assert.equal(await p.locator('[data-especial-cantidad="daily-du01"]').count(),1);
 await p.locator('[data-especial-cantidad="daily-du01"]').evaluate(e=>e.closest('details').open=true);
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
 assert.match(await p.locator('#batch-grid').textContent(),/Spawn especial/i);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await ctx.setOffline(true);await p.reload();assert.deepEqual(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).history,key),historial);
 await p.locator('#batch-dialog .close-button').click();await abrir();assert.equal(await p.locator('[name="especial-modo"]').inputValue(),'probabilidad');assert.equal(await p.locator('[data-especial-cantidad="spawn-559"]').inputValue(),'2');
 await p.locator('[data-especial-cantidad="spawn-559"]').evaluate(e=>e.closest('details').open=true);
 await p.locator('[data-especial-cantidad="spawn-559"]').fill('0');assert.equal(await p.locator('#save-settings').isDisabled(),true);await p.locator('[data-especial-cantidad="spawn-559"]').fill('3');
 const bytes=await p.evaluate(k=>localStorage.getItem(k),key);await p.evaluate(()=>{window.original=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('Quota');};});await p.locator('#save-settings').click();assert.equal(await p.locator('#settings-dialog').isVisible(),true);assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);await ctx.close();
 const trigger=newGame({...base,selectedIds:['caminantes-normal','spawn-559'],spawnEspecial:{modo:'disparadores',disparadores:6}},1);for(const id of Object.keys(trigger.remaining))trigger.remaining[id]=Number(id==='spawn-especial');
 const t=await pagina(trigger);await t.p.locator('#spawn').click();await t.p.waitForFunction(()=>document.querySelector('#batch-dialog')?.open&&document.querySelectorAll('#batch-grid [inert]').length===0);
 assert.equal(await t.p.locator('#batch-grid .draw-card').count(),1);assert.match(await t.p.locator('#batch-grid .card-image').getAttribute('aria-label'),/terrorcota/);assert.equal(await t.p.locator('#batch-grid .card-image img').getAttribute('src'),'./recursos/02 Mazo Spawn - Expansiones/559_Caminantes_de_terrorcota.png');
 await t.p.screenshot({path:'docs/verificacion/especial-disparador.png'});await t.p.locator('#batch-grid [data-action="discard"]').click();assert.equal(await t.p.locator('#batch-grid .draw-card.discarded').count(),1);await t.ctx.close();
 // Destinos también en Cartas Spawn especial: grupo, excepción por carta y ocho copias totales.
 const d=await pagina(newGame({...base,selectedIds:[...base.selectedIds,'spawn-571']},1)),pd=d.p;
 await pd.getByRole('button',{name:'Configuración',exact:true}).click();await abrirSeccionesConfiguracion(pd,'Mazos',['general']);
 await pd.locator('[name="especial-modo"]').selectOption('disparadores');
 const grupo=pd.locator('[data-especial-set="spawn-565,spawn-571"]');await grupo.evaluate(e=>e.closest('details').open=true);await grupo.selectOption('general');
 assert.equal(await pd.locator('[data-especial-destino="spawn-565"]').inputValue(),'general');assert.equal(await pd.locator('[data-especial-destino="spawn-571"]').inputValue(),'general');
 await pd.locator('[data-especial-destino="spawn-571"]').selectOption('especial');assert.equal(await grupo.inputValue(),'mixto');
 await pd.locator('[data-especial-cantidad="spawn-565"]').fill('8');
 for(const [width,height] of [[1024,768],[844,390],[390,844],[320,568]]){await pd.setViewportSize({width,height});assert.equal(await pd.locator('#settings-dialog').evaluate(e=>e.scrollWidth>e.clientWidth+1),false);}
 await pd.setViewportSize({width:1024,height:768});await pd.screenshot({path:'docs/verificacion/especial-destinos-disparadores.png'});
 await pd.locator('#save-settings').click();let guardado=await pd.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 assert.equal(guardado.proximaConfig.spawnEspecial.destinosEnDisparadores,true);assert.equal(guardado.proximaConfig.spawnEspecial.cantidades['spawn-565'],8);assert.equal(guardado.initial['spawn-565'],6);
 await pd.locator('#spawn').click();guardado=await pd.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 assert.equal(guardado.initial['spawn-565'],8);assert.equal(guardado.especial.initial['spawn-565'],undefined);assert.equal(guardado.especial.initial['spawn-571'],6);
 await pd.locator('#batch-dialog [data-action="close"]').click();await pd.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await d.ctx.setOffline(true);await pd.reload();
 await pd.getByRole('button',{name:'Configuración',exact:true}).click();await abrirSeccionesConfiguracion(pd,'Mazos',['general']);await grupo.evaluate(e=>e.closest('details').open=true);assert.equal(await grupo.inputValue(),'mixto');assert.equal(await pd.locator('[data-especial-cantidad="spawn-565"]').inputValue(),'8');await d.ctx.close();
 // Core: defaults en General, traslados por grupo/activación y visualización real de carta básica.
 for(const modo of ['disparadores','probabilidad']){
  const core=await pagina(newGame({...base,selectedIds:undefined},1)),pc=core.p;
  await pc.getByRole('button',{name:'Configuración',exact:true}).click();await abrirSeccionesConfiguracion(pc,'Mazos',['general']);await pc.locator('[name="especial-modo"]').selectOption(modo);
  for(const id of ['caminantes-normal','corredores-normal','brutos-normal','activacion-brutos'])assert.equal(await pc.locator(`[data-especial-destino="${id}"]`).inputValue(),'general');
  const brutos=pc.locator('[data-especial-set="brutos-normal,brutos-facil"]');await brutos.evaluate(e=>e.closest('details').open=true);await brutos.selectOption('especial');
  assert.equal(await pc.locator('[data-especial-destino="activacion-brutos"]').inputValue(),'general');
  await pc.locator('[data-especial-destino="activacion-brutos"]').evaluate(e=>e.closest('details').open=true);await pc.locator('[data-especial-destino="activacion-brutos"]').selectOption('especial');
  await pc.locator('[data-especial-cantidad="corredores-normal"]').evaluate(e=>e.closest('details').open=true);await pc.locator('[data-especial-cantidad="corredores-normal"]').fill('8');
  if(modo==='probabilidad')for(const nivel of ['azul','amarillo','naranja','rojo'])await pc.locator(`[name="especial-base-${nivel}"]`).fill('100');
  for(const [width,height] of [[1024,768],[844,390],[390,844],[320,568]]){await pc.setViewportSize({width,height});assert.equal(await pc.locator('#settings-dialog').evaluate(e=>e.scrollWidth>e.clientWidth+1),false);}
  await pc.locator('#save-settings').click();
  await pc.evaluate(({key,modo})=>{const s=JSON.parse(localStorage.getItem(key));for(const id of Object.keys(s.remaining))s.remaining[id]=Number(id==='caminantes-normal');localStorage.setItem(key,JSON.stringify(s));Math.random=()=>.5;},{key,modo});
  await pc.reload();await pc.evaluate(()=>Math.random=()=>.5);await pc.locator('#spawn').click();await pc.waitForFunction(()=>document.querySelector('#batch-dialog')?.open&&document.querySelectorAll('#batch-grid [inert]').length===0);
  const estado=await pc.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);assert.equal(estado.initial['corredores-normal'],8);assert.equal(estado.initial['brutos-normal'],undefined);assert.equal(estado.initial['activacion-brutos'],undefined);
  assert.ok(await pc.locator('#batch-grid .card-image img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0)));
  if(modo==='probabilidad'){
   assert.ok(estado.history[0].slots.some(t=>t.draws[0].especial?.some(c=>c.cardId.startsWith('brutos-'))));
   await pc.locator('#batch-grid [data-action="zoom"]').last().click();assert.equal(await pc.locator('#zoom-content img').evaluate(e=>e.complete&&e.naturalWidth>0),true);await pc.locator('#zoom-dialog .close-button').click();
  }
  await core.ctx.close();
 }
 // Arranque sin configuración guardada: nuevos defaults, sin imponerlos a partidas previas.
 const limpio=await browser.newContext();const inicio=await limpio.newPage();await inicio.goto(url);
 assert.equal(await inicio.locator('#score-counter-host').isVisible(),false);await inicio.getByRole('button',{name:'Configuración',exact:true}).click();await abrirSeccionesConfiguracion(inicio,'Apariencia',['apariciones','puntaje']);
 assert.equal(await inicio.locator('#tema-puntaje').inputValue(),'oculto');assert.equal(await inicio.locator('#modo-aparicion-adicional').inputValue(),'cartas-custom');await limpio.close();
 assert.deepEqual(errores,[]);console.log('Spawn Especial: configuración, cantidades, destinos, elegibilidad, Daily, límite, cinco tamaños, disparador con imagen final, descarte, cuota y recarga offline verificados.');
}finally{await browser.close();}
