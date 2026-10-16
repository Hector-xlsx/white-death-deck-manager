import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
import {BAKE_DANUKI} from '../dist/bake-danuki.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival',dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',selectedDailyIds:[BAKE_DANUKI]},1);spawn(s,()=>0);s.openBatch=false;
 const uid=s.pins.find(c=>c.cardId===BAKE_DANUKI).uid;
 const ctx=await browser.newContext({viewport:{width:844,height:390},reducedMotion:'reduce'});await ctx.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s});const p=await ctx.newPage();await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');
 const puntos=async n=>assert.match(await p.locator('#open-zombies').getAttribute('aria-label'),new RegExp(`Puntaje: ${n}\\.`));await puntos(12);
 await p.locator('#open-zombies').click();assert.equal(await p.locator('#zombies-total').textContent(),'5');await p.locator('#zombies-dialog [data-action="close"]').click();
 await p.evaluate(()=>{window.originalGuardar=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('Cuota');};});await p.locator(`#pins [data-action="unpin"][data-uid="${uid}"]`).click();await puntos(12);await p.evaluate(()=>Storage.prototype.setItem=window.originalGuardar);
 await p.locator(`#pins [data-action="unpin"][data-uid="${uid}"]`).click();await puntos(15);await p.locator('#open-zombies').click();assert.equal(await p.locator('#zombies-total').textContent(),'5');assert.equal(await p.locator('#score-total').textContent(),'15');
 const registros=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).derrotasEnemigos,key);assert.equal(registros.length,1);assert.equal(registros[0].cardId,BAKE_DANUKI);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await ctx.setOffline(true);await p.reload();await puntos(15);assert.equal(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).derrotasEnemigos.length,key),1);await ctx.close();
 console.log('Bake-Danuki: 12 al aparecer, 15 al derrotar, 5 zombis generados constantes, cuota sin puntos, registro único, recarga y módulos offline verificados.');
}finally{await browser.close();}
