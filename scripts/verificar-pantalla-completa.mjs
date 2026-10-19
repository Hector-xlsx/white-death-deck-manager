import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const browser=await chromium.launch({headless:true,channel:'chrome'}),key='white-death-gestor-v2';
try{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'},1);spawn(s,()=>0);s.openBatch=false;
 const ctx=await browser.newContext({viewport:{width:1024,height:768},reducedMotion:'reduce'});
 await ctx.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s});
 const p=await ctx.newPage(),errores=[];p.on('pageerror',e=>errores.push(e.message));
 await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');
 const boton=p.locator('#pantalla-completa'),guardado=await p.evaluate(k=>localStorage.getItem(k),key);
 for(const [width,height] of [[1440,900],[1024,768],[844,390],[390,844],[320,568]]){
  await p.setViewportSize({width,height});
  const medidas=await p.locator('.brand').evaluate(e=>{
   const elementos=[...e.querySelectorAll('.wordmark,.test-tag,.adrenalina-selector,.score-counter-host,.brand-window-tools')].filter(n=>n.getClientRects().length&&!n.hidden).map(n=>n.getBoundingClientRect());
   return {fuera:document.documentElement.scrollWidth>innerWidth,solapados:elementos.some((a,i)=>elementos.slice(i+1).some(b=>Math.min(a.right,b.right)-Math.max(a.left,b.left)>1&&Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)>1))};
  });
  assert.deepEqual(medidas,{fuera:false,solapados:false},`${width}×${height}`);
  for(const selector of ['#pantalla-completa','.settings-button']){const r=await p.locator(selector).boundingBox();assert.ok(r&&r.width>=44&&r.height>=44&&r.x>=0&&r.x+r.width<=width);}
  if([1024,320].includes(width))await p.screenshot({path:`docs/verificacion/pantalla-completa-${width}.png`});
 }
 await p.setViewportSize({width:1024,height:768});
 await boton.click();await p.waitForFunction(()=>Boolean(document.fullscreenElement));assert.equal(await boton.getAttribute('aria-pressed'),'true');assert.equal(await boton.getAttribute('aria-label'),'Salir de pantalla completa');
 await p.getByRole('button',{name:'Configuración',exact:true}).click();assert.equal(await p.locator('#settings-dialog').isVisible(),true);await p.locator('#settings-dialog .close-button').click();
 await boton.click();await p.waitForFunction(()=>!document.fullscreenElement);assert.equal(await boton.getAttribute('aria-pressed'),'false');
 await boton.click();await p.waitForFunction(()=>Boolean(document.fullscreenElement));await p.evaluate(()=>document.exitFullscreen());await p.waitForFunction(()=>document.querySelector('#pantalla-completa').getAttribute('aria-pressed')==='false');
 // Navegador sin permiso/API y rechazo de la solicitud: aviso, botón recuperable, sin escrituras.
 await p.evaluate(()=>Object.defineProperty(document,'fullscreenEnabled',{configurable:true,value:false}));await boton.click();assert.match(await p.locator('#toast').textContent(),/Este navegador no permite/);assert.equal(await boton.isEnabled(),true);await p.evaluate(()=>delete document.fullscreenEnabled);
 await p.evaluate(()=>Object.defineProperty(document.documentElement,'requestFullscreen',{configurable:true,value:()=>Promise.reject(new Error('denegado'))}));await boton.click();await p.waitForFunction(()=>document.querySelector('#toast').textContent.includes('No se pudo activar'));assert.equal(await boton.isEnabled(),true);await p.evaluate(()=>delete document.documentElement.requestFullscreen);
 // Variante WebKit simulada: se prueba la compatibilidad, no un dispositivo Apple real.
 await p.evaluate(()=>{
  Object.defineProperty(document.documentElement,'requestFullscreen',{configurable:true,value:undefined});Object.defineProperty(document,'fullscreenEnabled',{configurable:true,value:undefined});
  Object.defineProperty(document,'webkitFullscreenEnabled',{configurable:true,value:true});let dentro=null;
  Object.defineProperty(document,'webkitFullscreenElement',{configurable:true,get:()=>dentro});
  document.documentElement.webkitRequestFullscreen=()=>{dentro=document.documentElement;document.dispatchEvent(new Event('webkitfullscreenchange'));};
  document.webkitExitFullscreen=()=>{dentro=null;document.dispatchEvent(new Event('webkitfullscreenchange'));};
 });
 await boton.click();assert.equal(await boton.getAttribute('aria-pressed'),'true');await boton.click();assert.equal(await boton.getAttribute('aria-pressed'),'false');
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),guardado);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:120000});await ctx.setOffline(true);await p.reload();await boton.click();await p.waitForFunction(()=>Boolean(document.fullscreenElement));await boton.click();await p.waitForFunction(()=>!document.fullscreenElement);
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),guardado);assert.deepEqual(errores,[]);await ctx.close();
 console.log('Pantalla completa: entrada/salida real, salida externa, configuración accesible, cinco tamaños sin solapes, rechazo/no soporte, WebKit simulado, guardado intacto y recarga offline.');
}finally{await browser.close();}
