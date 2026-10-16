import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,isValid} from '../dist/engine.js';
import {configContenido} from '../dist/contenido.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',s=newGame(configContenido({easy:true,normal:true,threshold:0,modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado',dailyHabilitado:true}),1);
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});await context.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s});const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');await p.getByRole('button',{name:'Configuración',exact:true}).click();
 assert.equal(await p.locator('#content-selector details[open]').count(),0);
 const styles=await p.locator('#regla-abominaciones,#modo-abominaciones,#regla-nigromantes,#modo-nigromantes').evaluateAll(es=>es.map(e=>{const s=getComputedStyle(e);return [s.fontFamily,s.fontSize,s.minHeight];}));assert.ok(styles.every(s=>JSON.stringify(s)===JSON.stringify(styles[0])));
 const fila=await p.locator('.difficulty-options .check-row').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().top));assert.equal(fila[0],fila[1]);
 const modes=await p.locator('#regla-abominaciones,#modo-abominaciones').evaluateAll(es=>es.map(e=>e.getBoundingClientRect().top));assert.equal(modes[0],modes[1]);
 for(const [nombre,width,height] of [['escritorio',1440,900],['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568]]){
  await p.setViewportSize({width,height});await p.locator('#settings-dialog').evaluate(e=>e.scrollTop=0);assert.equal(await p.locator('#settings-dialog').evaluate(e=>e.scrollWidth>e.clientWidth+1),false);await p.locator('#settings-dialog').screenshot({path:`docs/verificacion/configuracion-compacta-${nombre}.png`});
 }
 await p.setViewportSize({width:1024,height:768});await p.locator('[name="filtro-contenido"][value="abominaciones"]').check();assert.equal(await p.locator('#content-selector details[open]').count(),0);
 const caja=p.locator('#content-selector details[data-caja="frozen-fortress"]'),check=caja.locator('[name="caja-contenido"]');
 await check.click();assert.equal(await caja.getAttribute('open'),null);assert.ok(!(await check.isChecked()));await caja.locator('summary').click();
 const carta=caja.locator('[name="carta"]').first();await carta.check();assert.equal(await check.evaluate(e=>e.indeterminate),true);assert.match(await caja.locator('[data-caja-cuenta]').textContent(),/^1 \/ /);
 await check.click();assert.ok(await check.isChecked());assert.equal(await check.evaluate(e=>e.indeterminate),false);assert.ok(await caja.evaluate(e=>e.open));assert.equal(await caja.locator('[name="carta"]:not(:checked)').count(),0);
 await caja.locator('[data-action="consulta-recurso"]').first().click();await p.locator('#info-dialog img').first().waitFor();assert.ok(await p.locator('#info-dialog img').first().evaluate(async e=>{await e.decode();return e.complete&&e.naturalWidth>0;}));await p.locator('#info-dialog [data-action="close"]').click();assert.ok(await caja.evaluate(e=>e.open));
 await check.click();assert.equal(await caja.locator('[name="carta"]:checked').count(),0);await check.click();
 await p.locator('#modo-daily').selectOption('con-reposicion');await p.locator('#save-settings').click();const despues=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);assert.equal(despues.proximaConfig.modoDaily,'con-reposicion');assert.equal(despues.daily.modo,'sin-reposicion');assert.ok(isValid(despues));
 await p.getByRole('button',{name:'Configuración',exact:true}).click();assert.equal(await p.locator('#content-selector details[open]').count(),0);assert.equal(await p.locator('#modo-daily').inputValue(),'con-reposicion');await p.locator('#settings-dialog [data-action="close"]').click();
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});const bytes=await p.evaluate(k=>localStorage.getItem(k),key);await context.setOffline(true);await p.reload();assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);await p.getByRole('button',{name:'Configuración',exact:true}).click();await p.locator('[name="filtro-contenido"][value="daily"]').check();await p.locator('#content-selector details').first().locator('summary').click();await p.locator('#content-selector [data-action="consulta-recurso"]').first().click();assert.ok(await p.locator('#info-dialog img').first().evaluate(async e=>{await e.decode();return e.complete&&e.naturalWidth>0;}));
 assert.deepEqual(errores,[]);console.log('Configuración: controles compactos, tipografía uniforme, cinco tamaños, cajas contraídas, selección completa/parcial/vacía, vista de carta, guardado diferido y consulta offline verificados.');await context.close();
}finally{await browser.close();}
