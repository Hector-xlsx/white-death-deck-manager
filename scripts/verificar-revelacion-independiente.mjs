import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
import {limitesIniciales} from '../dist/limites.js';
import {abrirSeccionesConfiguracion as secciones} from './ayuda-configuracion.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2';
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 const limites=limitesIniciales(true);for(const n of Object.keys(limites.nigromantes))limites.nigromantes[n]=2;
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion','asedio'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado',limitesPorAdrenalina:limites},1);
 for(const id of Object.keys(s.remaining))s.remaining[id]=Number(id==='nigromante');let primera=true;spawn(s,()=>{if(primera){primera=false;return 0;}return .99;});s.openBatch=false;
 for(const id of Object.keys(s.remaining))s.remaining[id]=Number(id==='nigromante');
 const ctx=await browser.newContext({viewport:{width:1024,height:768},reducedMotion:'reduce'});await ctx.addInitScript(({s,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));Math.random=()=>.99;},{s,key});
 const p=await ctx.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');
 const abrir=async()=>{await p.getByRole('button',{name:'Configuración',exact:true}).click();await secciones(p,'Mazos',['nigromantes','abominaciones']);};
 const campo=(familia,accion,prop)=>p.locator(`[name="revelacion-${familia}-${accion}-${prop}"]`);
 await abrir();const antes=await p.evaluate(k=>localStorage.getItem(k),key);
 assert.equal(await p.locator('#revelacion-nigromantes>h3').textContent(),'Revelación Carta Nigromante');assert.match(await p.locator('#revelacion-nigromantes>.field-note').first().textContent(),/Define qué ocurre al revelar una carta de Nigromante del mazo general/);
 const condiciones=p.locator('#revelacion-nigromantes>details');assert.equal(await condiciones.getAttribute('open'),null);assert.equal(await condiciones.locator('summary').textContent(),'Se aplican estas condiciones:');await condiciones.locator('summary').click();assert.match(await condiciones.textContent(),/únicamente se bloquea el Spawn/);
 assert.equal(await p.locator('#independientes-nigromantes').isChecked(),false);
 await p.locator('#independientes-nigromantes').check();assert.equal(await p.locator('#combinacion-anterior-nigromantes').isVisible(),false);
 await campo('nigromantes','profanador','modo').selectOption('nunca');assert.equal(await campo('nigromantes','profanador','probabilidad').isDisabled(),true);
 await campo('nigromantes','otros','modo').selectOption('probabilidad');await campo('nigromantes','otros','probabilidad').fill('50');
 assert.equal(await campo('nigromantes','otros','calcularPor').inputValue(),'independiente');await campo('nigromantes','otros','calcularPor').selectOption('juntos');
 assert.match(await p.locator('[data-revelacion-accion="otros"] [data-revelacion-explicacion]').textContent(),/un solo sorteo/);
 assert.equal(await p.locator('[name="revelacion-nigromantes-profanador-calcularPor"]').count(),0);
 await campo('nigromantes','spawn','modo').selectOption('probabilidad');await campo('nigromantes','spawn','probabilidad').fill('20');await campo('nigromantes','spawn','incremento').fill('15');await campo('nigromantes','spawn','maximo').fill('10');assert.equal(await p.locator('#save-settings').isDisabled(),true);await campo('nigromantes','spawn','maximo').fill('60');assert.equal(await p.locator('#save-settings').isEnabled(),true);
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),antes);
 await p.locator('#independientes-abominaciones').check();await campo('abominaciones','activacion','modo').selectOption('probabilidad');await campo('abominaciones','activacion','calcularPor').selectOption('juntos');await campo('abominaciones','spawn','modo').selectOption('nunca');
 for(const [nombre,width,height] of [['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568],['escritorio',1440,900]]){
  await p.setViewportSize({width,height});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);const b=await p.locator('#save-settings').boundingBox();assert.ok(b&&b.y>=0&&b.y+b.height<=height);if(nombre==='tablet')await p.screenshot({path:'docs/verificacion/revelacion-independiente-tablet.png'});
 }
 await p.locator('#save-settings').click();let estado=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);assert.equal(estado.config.revelacionEnemigos,undefined);assert.equal(estado.proximaConfig.revelacionEnemigos.nigromantes.spawn.maximo,60);assert.deepEqual(estado.history,s.history);
 assert.equal(estado.proximaConfig.revelacionEnemigos.nigromantes.otros.calcularPor,'juntos');assert.equal(estado.proximaConfig.revelacionEnemigos.abominaciones.activacion.calcularPor,'juntos');
 await p.evaluate(()=>{let primero=true;Math.random=()=>{if(primero){primero=false;return 0;}return .99;};});
 await p.locator('#spawn').click();await p.locator('#batch-dialog').waitFor();await p.locator('#batch-dialog .close-button').click();
 estado=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);const origen=estado.history.at(-1).slots[0].draws[0];assert.equal(origen.revelacionIndependiente.spawn.resultado,'fallo');assert.equal(origen.activaciones.length,0);assert.equal(origen.resolucionNigromante,'sin-efecto');
 const porcentaje=()=>p.evaluate(async k=>{const {probabilidadSpawnEnemigo}=await import('./acciones-independientes.js');return probabilidadSpawnEnemigo(JSON.parse(localStorage.getItem(k)),'nigromantes');},key);assert.equal(await porcentaje(),35);
 await abrir();assert.equal(await p.locator('#independientes-nigromantes').isChecked(),true);assert.equal(await campo('nigromantes','spawn','maximo').inputValue(),'60');await campo('nigromantes','otros','probabilidad').fill('40');
 const bytes=await p.evaluate(k=>localStorage.getItem(k),key);await p.evaluate(()=>{window.escrituraOriginal=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw Error('Quota');};});await p.locator('#save-settings').click();assert.equal(await p.locator('#settings-dialog').isVisible(),true);assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);await p.evaluate(()=>Storage.prototype.setItem=window.escrituraOriginal);await p.locator('#save-settings').click();
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await ctx.setOffline(true);await p.reload();assert.equal(await porcentaje(),35);await abrir();assert.equal(await campo('nigromantes','otros','probabilidad').inputValue(),'40');assert.equal(await campo('nigromantes','otros','calcularPor').inputValue(),'juntos');assert.equal(await campo('abominaciones','activacion','calcularPor').inputValue(),'juntos');assert.deepEqual(errores,[]);await ctx.close();
 console.log('Revelación: título/introducción/condiciones plegables, acciones independientes, porcentajes/tope, Nunca y sin efecto, guardado explícito y próxima tanda, cuota, cinco tamaños, recarga y offline.');
}finally{await browser.close();}
