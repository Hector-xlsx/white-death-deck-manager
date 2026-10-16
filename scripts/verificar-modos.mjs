import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {newGame,spawn,isValid} from '../dist/engine.js';
import {limitesIniciales} from '../dist/limites.js';
import {PROFANADOR} from '../dist/modos-enemigos.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/';
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
await mkdir('docs/verificacion',{recursive:true});
const sizes=[['escritorio',1440,900],['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568]];
const config={easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion','asedio'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival',abominacionEstandarId:'enemigo-abominacion-kan',selectedNigromantesIds:['enemigo-ostokar-el-palido','enemigo-bomoh'],selectedAbominacionesIds:['enemigo-abominacion-kan','enemigo-abominacion-orca'],limitesPorAdrenalina:limitesIniciales(true)};
function sembrar(s,id){for(const c of Object.keys(s.remaining))s.remaining[c]=Number(c===id);}
async function abrir(semilla,reducida=true){
 const context=await browser.newContext({viewport:{width:844,height:390},reducedMotion:reducida?'reduce':'no-preference'});
 await context.addInitScript(({key,semilla})=>{if(semilla&&!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));Math.random=()=>window.azarModos?.shift()??.99;},{key,semilla});
 const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(url);return {context,p};
}
const estado=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
const ajustes=p=>p.getByRole('button',{name:'Configuración',exact:true}).click();
const cerrar=async p=>{await p.locator('#batch-dialog [data-action="close"]').click();await p.waitForFunction(k=>!JSON.parse(localStorage.getItem(k)).openBatch,key);};
try{
 const {context,p}=await abrir(null);await ajustes(p);
 assert.equal(await p.locator('#regla-nigromantes').inputValue(),'personalizado');assert.equal(await p.locator('#regla-abominaciones').inputValue(),'personalizado');assert.equal(await p.locator('#abominacion-estandar').inputValue(),'enemigo-abominacion-kan');assert.ok(await p.locator('#limits-config').isVisible());
 await p.locator('#regla-nigromantes').selectOption('personalizado');await p.locator('#regla-abominaciones').selectOption('personalizado');assert.ok(await p.locator('#limits-config').isVisible());
 await p.locator('[name="filtro-contenido"][value="nigromantes"]').check();assert.ok(await p.locator(`[name="carta"][value="${PROFANADOR}"]`).isChecked());assert.ok(await p.locator(`[name="carta"][value="${PROFANADOR}"]`).isDisabled());
 assert.equal(await p.locator('[name="limite-nigromantes-azul"]').inputValue(),'0');
 for(const [nombre,width,height] of sizes){
  await p.setViewportSize({width,height});await p.locator('#limits-config').scrollIntoViewIfNeeded();
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const fuera=await p.locator('#settings-form select,#limits-config input').evaluateAll(ns=>ns.filter(n=>n.getClientRects().length).filter(n=>{const r=n.getBoundingClientRect();return r.left<0||r.right>innerWidth;}).map(n=>n.name));assert.deepEqual(fuera,[]);
  await p.locator('#settings-dialog').screenshot({path:`docs/verificacion/modos-config-${nombre}.png`});
 }
 await p.setViewportSize({width:844,height:390});await p.locator('[name="limite-nigromantes-azul"]').fill('-1');assert.ok(await p.locator('#save-settings').isDisabled());await p.locator('[name="limite-nigromantes-azul"]').fill('0');
 await p.locator('#regla-abominaciones').selectOption('festival');assert.ok(await p.locator('#abominacion-estandar-label').isHidden());await p.locator('#regla-abominaciones').selectOption('estandar');assert.ok(await p.locator('#abominacion-estandar-label').isVisible());
 await p.locator('#abominacion-estandar').selectOption('enemigo-abominacion-orca');
 await p.locator('#new-game').click();await p.locator('#confirm-actions [data-value="yes"]').click();let s=await estado(p);assert.ok(isValid(s));assert.equal(s.config.abominacionEstandarId,'enemigo-abominacion-orca');assert.equal(s.abominaciones.cartas.length,1);
 assert.equal(await p.locator('#accion-nigromante option').count(),6);assert.equal(await p.locator('#accion-nigromante option[value="elegir"]').count(),0);assert.equal(await p.locator('#accion-abominacion option').count(),1);assert.equal(await p.locator('#accion-abominacion').inputValue(),'estandar');
 await p.locator('#accion-nigromante').selectOption('activacion-azar-spawn');assert.equal((await estado(p)).accionesPredeterminadas.nigromante,'activacion-azar-spawn');
 // Guardar un modo nuevo conserva la tanda actual y prepara la siguiente.
 await ajustes(p);await p.locator('#regla-nigromantes').selectOption('varios');await p.locator('#save-settings').click();s=await estado(p);assert.equal(s.config.reglaNigromantes,'personalizado');assert.equal(s.proximaConfig.reglaNigromantes,'varios');assert.equal(s.accionesPredeterminadas.nigromante,'activacion-azar-spawn');
 // Fallo de cuota no guarda parcialmente configuración ni cierra el formulario.
 await ajustes(p);await p.locator('#regla-abominaciones').selectOption('festival');const antes=await estado(p);
 await p.evaluate(()=>{window.setAnterior=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new DOMException('quota','QuotaExceededError');};});await p.locator('#save-settings').click();assert.deepEqual(await estado(p),antes);assert.ok(await p.locator('#settings-dialog').isVisible());await p.evaluate(()=>Storage.prototype.setItem=window.setAnterior);
 await p.locator('#settings-dialog [data-action="close"]').click();await p.locator('#confirm-actions [data-value="salir"]').click();await context.close();
 const semilla=newGame(config,2);sembrar(semilla,'nigromante');spawn(semilla,()=>.99);semilla.openBatch=false;sembrar(semilla,'nigromante');
 const vista=await abrir(semilla),q=vista.p;await q.evaluate(()=>window.azarModos=[0,.99,0,.99,0,.99]);await q.locator('#spawn').click();await q.locator('#batch-dialog[data-revelacion="lista"]').waitFor();s=await estado(q);assert.ok(isValid(s));
 assert.equal(await q.locator('#batch-grid .enemy-choices').count(),0);
 assert.equal(await q.locator('#batch-grid .draw-card[data-extraccion^="a-"] .activation-stamp').count(),3);assert.equal(await q.locator('#batch-grid .draw-card:not([data-extraccion^="a-"]) .activation-stamp').count(),0);
 assert.equal(s.necro,1);assert.equal(s.pins.filter(c=>c.mazo==='nigromantes').length,3);
 const fuente=s.history[1].slots[0].draws[0],ref=`a-${fuente.uid}-${fuente.activaciones[0].uid}`;
 assert.equal(await q.locator(`[data-extraccion="${ref}"] .card-actions`).count(),0);
 await q.locator(`[data-extraccion="${ref}"] .card-image`).click();assert.ok(await q.locator('#zoom-title').filter({hasText:'Profanador'}).isVisible());await q.locator('#zoom-dialog [data-action="close"]').click();
 const congelado=await estado(q);
 for(const [nombre,width,height] of sizes){await q.setViewportSize({width,height});await q.locator('#batch-grid').screenshot({path:`docs/verificacion/modos-activacion-${nombre}.png`});assert.equal(await q.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(await q.locator('#batch-grid .card-image').evaluateAll(ns=>ns.map(n=>({nombre:n.alt,ancho:n.getBoundingClientRect().width})).filter(n=>Math.abs(n.ancho-155)>=1)),[]);assert.deepEqual(await estado(q),congelado);}
 await q.setViewportSize({width:844,height:390});await cerrar(q);
 await q.locator('[data-action="history"]').click();assert.ok(await q.locator('#history-list .activation-stamp').count()>0);await q.locator('#history-dialog [data-action="close"]').click();assert.ok(await q.locator('#last-preview .activation-stamp').count()>0);
 await q.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});const guardado=await estado(q);await vista.context.setOffline(true);await q.reload();assert.deepEqual(await estado(q),guardado);assert.equal(await q.locator('#accion-nigromante').inputValue(),'varios');
 await q.locator('#reopen').click();assert.equal(await q.locator('#batch-grid .enemy-choices').count(),0);await q.locator('#anular-tanda').click();await q.locator('#confirm-actions [data-value="yes"]').click();assert.equal((await estado(q)).history.length,1);assert.ok(isValid(await estado(q)));await vista.context.close();
 // Revelación real: la derivada espera boca abajo y se revela después de las normales.
 const animada=newGame(config,2);sembrar(animada,'nigromante');const anim=await abrir(animada,false),r=anim.p;await r.locator('#spawn').click();const b=(await estado(r)).history[0],uidNormal=b.slots[1].draws[0].uid,uidFinal=b.slots.at(-1).draws[0].uid;
 await r.locator(`#batch-grid [data-extraccion="${uidFinal}"].por-revelar`).waitFor({timeout:15000});assert.ok(await r.locator(`#batch-grid [data-extraccion="${uidNormal}"].volteando`).isVisible());
 await r.locator('#batch-dialog[data-revelacion="lista"]').waitFor({timeout:25000});assert.equal(await r.locator(`#batch-grid [data-extraccion="${uidFinal}"].por-revelar`).count(),0);assert.ok(isValid(await estado(r)));await anim.context.close();
 // Guardado de pruebas anterior se reinicia una vez conservando configuración.
 const viejo=newGame({easy:true,normal:true,threshold:0,modoNigromantes:'sin-reposicion'},1);const legacy=await abrir(viejo);assert.equal((await estado(legacy.p)).revisionReglas,2);assert.equal((await estado(legacy.p)).config.reglaNigromantes,'personalizado');const actualizado=await estado(legacy.p);await legacy.p.reload();assert.deepEqual(await estado(legacy.p),actualizado);await legacy.context.close();
 assert.deepEqual(errores,[]);console.log('Modos: configuración, cinco tamaños, prioridad, referencias/zoom, revelación diferida, límites, cuota, legado, historial, anulación y recuperación offline aprobados.');
}finally{await browser.close();}
