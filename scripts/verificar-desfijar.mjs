import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',semilla=newGame({easy:true,normal:true,threshold:0,selectedIds:['abominacion','asedio']},1);
spawn(semilla,()=>0);semilla.openBatch=false;
const salida=new URL('../docs/verificacion/',import.meta.url);await mkdir(salida,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 const context=await browser.newContext();
 await context.addInitScript(({key,semilla})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));},{key,semilla});
 const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));
 await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 const boton=p.locator('#pins .unpin:not(.repin)').first();
 for(const [nombre,width,height] of [['escritorio',1440,900],['horizontal',844,390],['vertical',390,844],['tablet',1024,768]]){
  await p.setViewportSize({width,height});await boton.scrollIntoViewIfNeeded();
  assert.equal(await boton.textContent(),'×');
  assert.ok(await boton.evaluate(e=>{
   const r=e.getBoundingClientRect(),css=getComputedStyle(e),imagen=e.parentElement.querySelector('.image-button').getBoundingClientRect();
   const rango=document.createRange();rango.selectNodeContents(e);const x=rango.getBoundingClientRect();
   return r.width===44&&r.height===44&&css.backgroundColor==='rgba(0, 0, 0, 0)'&&css.borderTopWidth==='0px'&&css.boxShadow==='none'&&Math.abs(x.right-imagen.right)<8&&Math.abs(x.top-imagen.top)<8;
  }));
  await boton.hover();assert.equal(await boton.evaluate(e=>getComputedStyle(e).backgroundColor),'rgba(0, 0, 0, 0)');
  await boton.focus();assert.equal(await boton.evaluate(e=>getComputedStyle(e).outlineStyle),'solid');
  await boton.evaluate(e=>e.blur());await p.mouse.move(0,0);
  await p.screenshot({path:fileURLToPath(new URL(`desfijar-${nombre}.png`,salida)),fullPage:true});
 }
 const uid=Number(await boton.getAttribute('data-uid'));
 await boton.click();
 const guardado=await p.evaluate(key=>JSON.parse(localStorage.getItem(key)),key);
 assert.equal(guardado.pins.some(c=>c.uid===uid),false);assert.equal(guardado.unpinned.some(c=>c.uid===uid),true);
 await p.reload();assert.equal(await p.locator('#pins .unpin:not(.repin)').count(),0);
 assert.deepEqual(errores,[]);
 console.log('Desfijar: X sin circulo junto a la esquina, hitbox 44x44, hover transparente, foco visible, cuatro viewports y accion guardada tras recarga.');
}finally{await browser.close();}
