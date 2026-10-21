import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {newGame,spawn} from '../dist/engine.js';
const {chromium}=createRequire(import.meta.url)(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2';
const navegador=await chromium.launch({headless:true,channel:'chrome'});
try{
 const ctx=await navegador.newContext({viewport:{width:1024,height:768},reducedMotion:'reduce'});
 const s=newGame({easy:true,normal:true,threshold:20,modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'},3);spawn(s,()=>.99);s.openBatch=false;
 await ctx.addInitScript(({s,key})=>{
  if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));
  window.proteccionPrueba={solicitudes:0,concedida:false,resultado:false};
  Object.defineProperty(navigator,'storage',{configurable:true,value:{persisted:async()=>window.proteccionPrueba.concedida,persist:async()=>{const p=window.proteccionPrueba;p.solicitudes++;p.concedida=p.resultado;return p.concedida;}}});
 },{s,key});
 const p=await ctx.newPage(),errores=[];p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8095/mazo/');
 const bytes=await p.evaluate(k=>localStorage.getItem(k),key),estado=p.locator('#proteccion-estado');await estado.filter({hasText:'Protección no concedida'}).waitFor({state:'attached'});assert.equal(await p.evaluate(()=>window.proteccionPrueba.solicitudes),1);
 await p.getByRole('button',{name:'Configuración',exact:true}).click();await p.getByRole('tab',{name:'General',exact:true}).click();
 for(const [width,height] of [[1440,900],[1024,768],[844,390],[390,844],[320,568]]){await p.setViewportSize({width,height});const boton=p.locator('#solicitar-proteccion');await boton.scrollIntoViewIfNeeded();const r=await boton.boundingBox();assert.ok(r.height>=44&&r.x>=0&&r.x+r.width<=width);assert.equal(await p.locator('#settings-dialog').evaluate(e=>e.scrollWidth>e.clientWidth+1),false);}
 await p.setViewportSize({width:1024,height:768});await p.evaluate(()=>window.proteccionPrueba.resultado=true);await p.locator('#solicitar-proteccion').click();await estado.filter({hasText:'Protección concedida'}).waitFor();assert.equal(await p.evaluate(()=>window.proteccionPrueba.solicitudes),2);
 await mkdir('docs/verificacion',{recursive:true});await p.screenshot({path:'docs/verificacion/proteccion-almacenamiento-tablet.png'});
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);await p.locator('#settings-dialog .close-button').click();assert.equal(await p.locator('#confirm-dialog').isVisible(),false);
 await p.reload();await estado.filter({hasText:'Protección no concedida'}).waitFor({state:'attached'});assert.equal(await p.evaluate(()=>window.proteccionPrueba.solicitudes),1);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await ctx.setOffline(true);await p.reload();await estado.filter({hasText:'Protección no concedida'}).waitFor({state:'attached'});assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);assert.deepEqual(errores,[]);await ctx.close();
 const sinApi=await navegador.newContext();await sinApi.addInitScript(()=>Object.defineProperty(navigator,'storage',{value:undefined}));const otra=await sinApi.newPage();await otra.goto(process.env.MAZO_URL||'http://127.0.0.1:8095/mazo/');assert.equal(await otra.locator('#solicitar-proteccion').isDisabled(),true);assert.match(await otra.locator('#proteccion-estado').textContent(),/no permite/);assert.equal(await otra.locator('#spawn').isEnabled(),true);await sinApi.close();
 console.log('Protección: solicitud automática, rechazo, reintento, concesión simulada, cinco tamaños, estado sin API, partida intacta y recuperación offline verificados.');
}finally{await navegador.close();}
