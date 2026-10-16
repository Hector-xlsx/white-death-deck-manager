import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const browser=await chromium.launch({headless:true,channel:'chrome'}),key='white-death-gestor-v2';
try{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival'},3);
 s.ajustesZombis=[{id:1,delta:1,fecha:1,tanda:0,nivel:'azul'}];
 const ctx=await browser.newContext({viewport:{width:1024,height:768}});await ctx.addInitScript(({s,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{s,key});const p=await ctx.newPage(),errores=[];p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');await p.locator('#open-zombies').click();
 assert.equal(await p.locator('.zombie-adjustment-row').count(),3);assert.match(await p.locator('#zombies-log').textContent(),/Caminantes/);
 const fila=t=>p.locator(`form[data-tipo="${t}"]`);
 await fila('caminantes').locator('input').fill('3');await fila('brutos').locator('[data-delta="1"]').click();await fila('brutos').locator('[data-delta="1"]').click();await fila('corredores').locator('input').fill('1');
 assert.equal(await p.locator('#zombies-total').textContent(),'1');assert.equal(await p.locator('#score-total').textContent(),'3');
 for(const t of ['caminantes','brutos','corredores'])await fila(t).getByRole('button',{name:'Agregar',exact:true}).click();
 assert.equal(await p.locator('#zombies-total').textContent(),'7');assert.equal(await p.locator('#score-total').textContent(),'24');assert.equal(await p.locator('#zombies-log li').count(),4);
 await fila('brutos').locator('input').fill('-1');await fila('brutos').locator('input').press('Enter');assert.equal(await p.locator('#score-total').textContent(),'20');assert.equal(await p.locator('#zombies-total').textContent(),'6');
 await p.evaluate(()=>{window.setItemAnterior=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw Error('Quota');};});await fila('corredores').locator('input').fill('2');await fila('corredores').getByRole('button',{name:'Agregar',exact:true}).click();assert.equal(await fila('corredores').locator('input').inputValue(),'2');assert.equal(await p.locator('#score-total').textContent(),'20');await p.evaluate(()=>{Storage.prototype.setItem=window.setItemAnterior;});
 for(const [width,height] of [[1440,900],[1024,768],[844,390],[390,844],[320,568]]){await p.setViewportSize({width,height});assert.ok(!await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth));assert.ok(await p.locator('#zombies-dialog').evaluate(e=>e.scrollWidth<=e.clientWidth));await p.locator('#zombies-dialog').screenshot({path:`docs/verificacion/ajustes-tipos-${width}.png`});}
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});const antes=await p.evaluate(k=>localStorage.getItem(k),key);await ctx.setOffline(true);await p.reload();await p.locator('#open-zombies').click();assert.equal(await p.locator('#score-total').textContent(),'20');assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),antes);assert.match(await p.locator('#zombies-log').textContent(),/Corredores/);assert.match(await p.locator('#zombies-log').textContent(),/Brutos/);assert.deepEqual(errores,[]);await ctx.close();
 console.log('Tres tipos: borradores independientes, teclado/atajos, puntos, legado, historial, cuota, cinco tamaños, recarga y offline verificados.');
}finally{await browser.close();}
