import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
import {abrirSeccionesConfiguracion as secciones} from './ayuda-configuracion.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2';
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['asedio','activacion-caminantes','spawn-559','spawn-565'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado',dailyHabilitado:true,dailyIncrementoPor:'carta',dailyPorNivel:{azul:{base:20,incremento:20},amarillo:{base:80,incremento:7},naranja:{base:10,incremento:3},rojo:{base:15,incremento:4}}},1);
 spawn(s,()=>.99);s.openBatch=false;
 const ctx=await browser.newContext({viewport:{width:1024,height:768},reducedMotion:'reduce'});await ctx.addInitScript(({s,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{s,key});
 const p=await ctx.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');
 const abrir=()=>p.getByRole('button',{name:'Configuración',exact:true}).click();await abrir();await secciones(p,'Mazos',['general']);
 assert.match(await p.locator('#config-seccion-general>summary').textContent(),/Mazo general y mazo especial/);
 await p.locator('[name="especial-modo"]').selectOption('disparadores');assert.equal(await p.locator('[name="especial-modo"] option:checked').textContent(),'Cartas Spawn especial');
 assert.match(await p.locator('[data-especial-descripcion]').textContent(),/Abominación o Nigromante/);assert.equal(await p.locator('[data-especial-grupo][open]').count(),0);
 const grupo=p.locator('[data-especial-cantidad="spawn-559"]').locator('xpath=ancestor::details[1]');await grupo.locator(':scope>summary').click();
 await grupo.locator('[data-action="consulta-recurso"]').first().click();await p.locator('#info-dialog').waitFor();assert.ok(await p.locator('#info-content img').count()>0);await p.locator('#info-dialog [data-action="close"]').click();
 await p.locator('[data-especial-cantidad="spawn-559"]').fill('2');await grupo.locator(':scope>summary').click();await grupo.locator(':scope>summary').click();assert.equal(await p.locator('[data-especial-cantidad="spawn-559"]').inputValue(),'2');
 await p.locator('[name="especial-modo"]').selectOption('probabilidad');
 for(const modo of ['nivel','general']){await p.locator('[name="especial-limite-tipo"]').selectOption(modo);assert.equal(await p.locator('th[data-especial-limite-nivel]').isVisible(),modo==='nivel');assert.equal(await p.locator('[name="especial-limite-azul"]').isEnabled(),modo==='nivel');}
 assert.match(await p.locator('#config-seccion-general legend').last().textContent(),/Reiniciar mazo general/);
 await secciones(p,'Mazos',['nigromantes','abominaciones']);
 for(const [modo,texto] of [['estandar','Solo participa el Profanador'],['varios','se activa y aparece otro'],['personalizado','máximo de nigromantes adicionales']]){await p.locator('#regla-nigromantes').selectOption(modo);assert.ok((await p.locator('#descripcion-modo-nigromante').textContent()).includes(texto));}
 await p.locator('#accion-nigromante').selectOption('activacion-azar-spawn');assert.match(await p.locator('#descripcion-spawn-nigromante').textContent(),/50%/);
 await p.locator('#regla-abominaciones').selectOption('festival');assert.match(await p.locator('#descripcion-modo-abominacion').textContent(),/aparece otra/);
 await secciones(p,'Mazos',['daily']);
 assert.equal(await p.locator('#daily-nota-probabilidad').evaluate(e=>e.previousElementSibling.tagName),'TABLE');assert.match(await p.locator('#daily-nota-probabilidad').textContent(),/se mantiene el porcentaje actual/);
 for(const modo of ['tanda','carta']){await p.locator('#daily-incremento-por').selectOption(modo);assert.match(await p.locator('#daily-nota-incremento').textContent(),modo==='tanda'?/una vez por tanda/:/cada carta elegible/);}
 await p.locator('#modo-daily').selectOption('con-reposicion');assert.match(await p.locator('#daily-nota-reposicion').textContent(),/Al derrotarlo.*vuelve al mazo.*no puede repetirse/);
 await p.locator('#daily-elegibles-panel>summary').click();await p.locator('[data-daily-elegible="asedio"]').uncheck();await p.locator('[data-daily-elegible="activacion-caminantes"]').check();
 for(const [nombre,width,height] of [['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568],['escritorio',1440,900]]){await p.setViewportSize({width,height});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);const b=await p.locator('#save-settings').boundingBox();assert.ok(b&&b.y>=0&&b.y+b.height<=height);if(['tablet','vertical'].includes(nombre))await p.screenshot({path:`docs/verificacion/ajustes-configuracion-${nombre}.png`});}
 await p.locator('#save-settings').click();let guardado=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);assert.ok(guardado.proximaConfig.dailyElegibles.includes('activacion-caminantes'));assert.ok(!guardado.proximaConfig.dailyElegibles.includes('asedio'));assert.deepEqual(guardado.history,s.history);
 await p.locator('[data-action="adrenalina"][data-delta="1"]').click();assert.equal(await p.evaluate(async k=>{const {probabilidadDaily}=await import('./daily.js');return probabilidadDaily(JSON.parse(localStorage.getItem(k)));},key),40);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await ctx.setOffline(true);await p.reload();await abrir();await secciones(p,'Mazos',['daily']);await p.locator('#daily-elegibles-panel>summary').click();assert.equal(await p.locator('[data-daily-elegible="asedio"]').isChecked(),false);assert.equal(await p.locator('[data-daily-elegible="activacion-caminantes"]').isChecked(),true);
 assert.deepEqual(errores,[]);await ctx.close();console.log('Ajustes: nombres, descripciones dinámicas, grupos/cantidades/consulta, límite general/nivel, elegibilidad Daily, cambio de adrenalina sin salto, guardado, cinco tamaños y offline.');
}finally{await browser.close();}
