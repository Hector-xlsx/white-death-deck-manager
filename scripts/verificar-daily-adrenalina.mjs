import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/';
const perfil={azul:{base:20,incremento:20},amarillo:{base:30,incremento:5},naranja:{base:10,incremento:10},rojo:{base:40,incremento:15}};
const semilla=newGame({easy:true,normal:true,threshold:0,selectedIds:['asedio'],dailyHabilitado:true,dailyBase:20,dailyIncremento:20,dailyIncrementoPor:'carta',modoNigromantes:'sin-reposicion'},1);
spawn(semilla,()=>.99);semilla.openBatch=false;
await mkdir('docs/verificacion',{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 const context=await browser.newContext({viewport:{width:844,height:390},reducedMotion:'reduce'});
 await context.addInitScript(({key,semilla})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));Math.random=()=>.65;},{key,semilla});
 const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(url);
 const estado=()=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 const status=()=>p.locator('#daily-active-status').textContent();
 const subir=p.getByRole('button',{name:'Subir nivel de adrenalina',exact:true});
 const cerrar=async()=>{await p.locator('#batch-dialog [data-action="close"]').click();await p.waitForFunction(()=>!document.querySelector('[data-action="adrenalina"][data-delta="1"]').disabled);};
 const revelar=async()=>{await p.locator('#spawn').click();await p.locator('#batch-dialog[data-revelacion="lista"]').waitFor();};
 assert.deepEqual(await estado(),semilla);assert.ok((await status()).includes('40%'));
 await p.getByRole('button',{name:'Configuración',exact:true}).click();
 for(const nivel of Object.keys(perfil)){
  assert.equal(await p.locator(`[name="dailyBase-${nivel}"]`).inputValue(),'20');assert.equal(await p.locator(`[name="dailyIncremento-${nivel}"]`).inputValue(),'20');
  await p.locator(`[name="dailyBase-${nivel}"]`).fill(String(perfil[nivel].base));await p.locator(`[name="dailyIncremento-${nivel}"]`).fill(String(perfil[nivel].incremento));
 }
 await p.locator('[name="dailyBase-rojo"]').fill('101');assert.ok(await p.locator('#save-settings').isDisabled());assert.ok(await p.locator('#new-game').isDisabled());await p.locator('[name="dailyBase-rojo"]').fill('40');
 await p.locator('[name="dailyIncremento-azul"]').fill('');assert.ok(await p.locator('#new-game').isDisabled());await p.locator('[name="dailyIncremento-azul"]').fill('20');
 await p.locator('#settings-dialog [data-action="close"]').click();assert.ok(await p.locator('#confirm-dialog').isVisible());await p.locator('#confirm-actions [data-value="volver"]').click();
 const bytes=await estado();await p.evaluate(()=>{window.originalSet=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new DOMException('Quota','QuotaExceededError');};});
 await p.locator('#save-settings').click();assert.deepEqual(await estado(),bytes);assert.ok(await p.locator('#settings-dialog').isVisible());await p.evaluate(()=>Storage.prototype.setItem=window.originalSet);
 await p.locator('#save-settings').click();assert.equal((await estado()).config.dailyPorNivel,undefined);assert.deepEqual((await estado()).proximaConfig.dailyPorNivel,perfil);assert.ok((await status()).includes('40%'));
 await p.reload();await p.getByRole('button',{name:'Configuración',exact:true}).click();
 for(const nivel of Object.keys(perfil)){assert.equal(await p.locator(`[name="dailyBase-${nivel}"]`).inputValue(),String(perfil[nivel].base));assert.equal(await p.locator(`[name="dailyIncremento-${nivel}"]`).inputValue(),String(perfil[nivel].incremento));}
 for(const [nombre,width,height] of [['escritorio',1440,900],['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568]]){
  await p.setViewportSize({width,height});await p.locator('#daily-config').scrollIntoViewIfNeeded();
  const fallos=await p.locator('#daily-config').evaluate(e=>[...e.querySelectorAll('input,select,th,.daily-level-name')].filter(n=>{const r=n.getBoundingClientRect();return r.left<0||r.right>innerWidth||n.scrollWidth>n.clientWidth+2;}).map(n=>n.textContent||n.name));assert.deepEqual(fallos,[]);
  await p.locator('#daily-config').screenshot({path:`docs/verificacion/daily-adrenalina-config-${nombre}.png`});
 }
 await p.setViewportSize({width:844,height:390});await p.locator('#new-game').click();await p.locator('#confirm-actions [data-value="yes"]').click();
 assert.deepEqual((await estado()).config.dailyPorNivel,perfil);assert.equal((await estado()).history.length,0);assert.ok((await status()).includes('20%'));
 await revelar();assert.equal((await estado()).history[0].slots[0].draws[0].dailyIntento.probabilidad,20);await cerrar();assert.ok((await status()).includes('40%'));
 await subir.click();assert.ok((await status()).includes('50%'));await p.locator('#daily-active-status').screenshot({path:'docs/verificacion/daily-adrenalina-50.png'});
 await revelar();assert.equal((await estado()).history[1].slots[0].draws[0].dailyIntento.probabilidad,50);await cerrar();assert.ok((await status()).includes('55%'));
 await subir.click();assert.ok((await status()).includes('35%'));await p.locator('#reopen').click();await p.locator('#batch-grid [data-action="replace"]').first().click();
 let actual=await estado();assert.equal(actual.history[1].nivelAdrenalina,'amarillo');assert.equal(actual.history[1].slots[0].draws.at(-1).dailyIntento.probabilidad,50);await cerrar();assert.ok((await status()).includes('35%'));
 await p.locator('#reopen').click();await p.locator('#anular-tanda').click();await p.locator('#confirm-actions [data-value="yes"]').click();assert.equal((await estado()).nivelAdrenalina,'amarillo');assert.equal((await estado()).history.length,1);assert.ok((await status()).includes('50%'));
 await p.evaluate(()=>{let i=0;const azar=[.65,0,.5];Math.random=()=>azar[i++]??.65;});await revelar();assert.equal((await estado()).pins.length,1);await cerrar();assert.ok((await status()).includes('30%'));
 const otra=await context.newPage();otra.on('pageerror',e=>errores.push(e.message));await otra.goto(url);await subir.click();await otra.locator('#nivel-adrenalina[data-nivel="naranja"]').waitFor();assert.ok((await otra.locator('#daily-active-status').textContent()).includes('10%'));await otra.close();
 const guardado=await estado();await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await context.setOffline(true);await p.reload();assert.deepEqual(await estado(),guardado);assert.ok((await status()).includes('10%'));
 await p.getByRole('button',{name:'Configuración',exact:true}).click();assert.equal(await p.locator('[name="dailyIncremento-rojo"]').inputValue(),'15');await p.locator('#settings-dialog [data-action="close"]').click();
 await subir.click();assert.ok((await status()).includes('40%'));assert.deepEqual(errores,[]);await context.close();
 console.log('Daily por adrenalina: ocho inputs, legado y configuracion futura, validacion y cuota, cambios sin guardar, cinco tamaños, 40→50→55→35%, tanda congelada y regeneracion, anular, aparicion reinicia aumento, pestañas y recarga offline.');
}finally{await browser.close();}
