import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {newGame} from '../dist/engine.js';
import {abrirSeccionesConfiguracion as secciones} from './ayuda-configuracion.mjs';
const {chromium}=createRequire(import.meta.url)(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const ctx=await browser.newContext({viewport:{width:1024,height:768},reducedMotion:'reduce'});
 const s=newGame({easy:true,normal:true,threshold:0,modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado',dailyHabilitado:true,dailyBase:100,dailyIncremento:10,dailyIncrementoPor:'carta'},3);
 await ctx.addInitScript(({s,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));Math.random=()=>.99;},{s,key});
 const p=await ctx.newPage(),errores=[];p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8095/mazo/');
 const abrir=async()=>{await p.getByRole('button',{name:'Configuración',exact:true}).click();await secciones(p,'Mazos',['daily']);};await abrir();
 assert.equal(await p.locator('#daily-limite').inputValue(),'');assert.equal(await p.locator('#daily-limite-tipo').isEnabled(),true);
 await p.locator('#daily-limite').fill('0');assert.equal(await p.locator('#save-settings').isDisabled(),true);await p.locator('#daily-limite').fill('1');
 await p.locator('#daily-limite-tipo').selectOption('nivel');for(const [nivel,v] of [['azul','1'],['amarillo','2'],['naranja',''],['rojo','3']])await p.locator(`#daily-limite-${nivel}`).fill(v);
 assert.equal(await p.locator('#daily-limite-general').isVisible(),false);
 for(const [width,height] of [[1440,900],[1024,768],[844,390],[390,844],[320,568]]){await p.setViewportSize({width,height});assert.equal(await p.locator('#settings-dialog').evaluate(e=>e.scrollWidth>e.clientWidth+1),false);await p.locator('#daily-limites').scrollIntoViewIfNeeded();}
 await p.setViewportSize({width:1024,height:768});await mkdir('docs/verificacion',{recursive:true});await p.screenshot({path:'docs/verificacion/daily-limites-tablet.png'});
 await p.locator('#save-settings').click();let estado=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);assert.deepEqual(estado.proximaConfig.dailyLimitesPorNivel,{azul:1,amarillo:2,naranja:null,rojo:3});
 await p.locator('#spawn').click();await p.waitForFunction(()=>document.querySelector('#batch-dialog')?.open&&document.querySelectorAll('#batch-grid [inert]').length===0);
 estado=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);assert.equal(estado.history[0].slots.flatMap(t=>t.draws.flatMap(c=>c.daily||[])).filter(c=>!c.anulada).length,1);
 await p.locator('#aparicion-detalles').click();assert.match(await p.locator('#batch-grid').textContent(),/máximo de apariciones alcanzado/);
 await p.locator('#batch-dialog .close-button').click();await abrir();await p.locator('#daily-limite-tipo').selectOption('general');assert.equal(await p.locator('#daily-limite').inputValue(),'1');
 // Daily integrado mantiene sus límites visibles aunque oculte su probabilidad propia.
 await secciones(p,'Mazos',['general']);await p.locator('[name="especial-modo"]').selectOption('disparadores');await p.locator('[name="especial-daily"]').selectOption('integrado');await secciones(p,'Mazos',['daily']);assert.equal(await p.locator('#daily-limite-tipo').isEnabled(),true);assert.equal(await p.locator('#daily-config .daily-settings').isVisible(),false);
 await p.locator('#save-settings').click();estado=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);assert.equal(estado.proximaConfig.dailyLimite,1);assert.equal(estado.proximaConfig.dailyLimitesPorNivel,undefined);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await ctx.setOffline(true);await p.reload();await abrir();assert.equal(await p.locator('#daily-limite').inputValue(),'1');assert.equal(await p.locator('#daily-limite-tipo').inputValue(),'general');assert.deepEqual(errores,[]);await ctx.close();
 console.log('Daily: máximo general/por nivel/sin límite, validación, cinco tamaños, próxima tanda, aviso de cupo, integrado y recuperación offline verificados.');
}finally{await browser.close();}
