import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/',key='white-death-gestor-v2';
const salida=new URL('../docs/verificacion/',import.meta.url);await mkdir(salida,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
const estado=p=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
const esperar=p=>p.waitForFunction(()=>['eleccion','lista'].includes(document.querySelector('#batch-dialog').dataset.revelacion)&&!document.querySelector('#batch-grid .volteando'));
async function verificarActivacion(p,tipo){
 await p.waitForFunction(()=>document.querySelector('#batch-dialog').dataset.revelacion==='activacion');
 const s=await estado(p),c=s.history.at(-1).slots[0].draws.at(-1),inicio=await p.evaluate(()=>performance.now());
 const sello=p.locator(`#batch-grid [data-extraccion="${c.uid}"] .activation-animation .activation-stamp`);
 assert.equal(await sello.evaluate(e=>getComputedStyle(e).animationDuration),'1s');
 assert.equal(await p.locator('#batch-grid .volteando').count(),0);
 const hijos=c[tipo==='abominacion'?'abominaciones':'nigromantes']||[];
 for(const hijo of hijos)assert.equal(await p.locator(`#batch-grid [data-extraccion="${hijo.uid}"]`).count(),0);
 await p.waitForTimeout(350);
 await p.screenshot({path:fileURLToPath(new URL(`tiempo-activacion-${tipo}.png`,salida))});
 await p.waitForFunction(()=>document.querySelector('#batch-dialog').dataset.revelacion!=='activacion');
 assert.ok(await p.evaluate(()=>performance.now())-inicio>=850,'La activacion conserva su espera propia');
 if(hijos.length){
  const carta=p.locator(`#batch-grid [data-extraccion="${hijos[0].uid}"] .reveal-front`);
  assert.equal(await carta.evaluate(e=>getComputedStyle(e).animationDuration),'1s');
 }
 await esperar(p);assert.deepEqual(await estado(p),s);
}
try{
 for(const tipo of ['abominacion','nigromante']){
  const semilla=newGame({easy:true,normal:true,threshold:0,selectedIds:[tipo,'asedio'],modoNigromantes:'sin-reposicion'},1);
  spawn(semilla,()=>0);semilla.openBatch=false;
  const context=await browser.newContext({viewport:{width:844,height:390}});
  await context.addInitScript(({semilla,key})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));Math.random=()=>window.azarPrueba?.shift()??.99;},{semilla,key});
  const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(url);
  await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
  const selector=p.locator(`#accion-${tipo}`),otro=p.locator(`#accion-${tipo==='abominacion'?'nigromante':'abominacion'}`);
  assert.equal(await selector.inputValue(),'elegir');assert.equal(await selector.locator('option').count(),5);
  const inicial=await estado(p);
  await selector.selectOption('activacion');const guardado=await estado(p);
  for(const campo of ['history','pins','remaining','abominaciones','nigromantes'])assert.deepEqual(guardado[campo],inicial[campo]);
  assert.equal(await otro.inputValue(),'elegir');await p.reload();assert.equal(await selector.inputValue(),'activacion');
  for(const opcion of ['activacion','spawn','activacion-spawn','azar','elegir']){
   await selector.selectOption(opcion);await p.evaluate(()=>window.azarPrueba=[0,.99,.99,.99]);
   await p.locator('#spawn').click();
   assert.equal(await p.locator('#batch-grid .volteando .reveal-front').evaluate(e=>getComputedStyle(e).animationDuration),'0.7s');
   if(['activacion','activacion-spawn'].includes(opcion))await verificarActivacion(p,tipo);
   await esperar(p);
   let s=await estado(p),c=s.history.at(-1).slots[0].draws.at(-1);
   if(opcion==='elegir'){
    assert.equal(c[tipo==='abominacion'?'resolucionAbominacion':'resolucionNigromante'],'pendiente');
    assert.equal(await p.locator(`#batch-grid [data-action="elegir-${tipo}"]`).count(),3);
    await p.locator('#batch-dialog [data-action="close"]').click();await p.locator('#reopen').click();
    await p.locator(`#batch-grid [data-action="elegir-${tipo}"][data-value="activacion-spawn"]`).click();
    await verificarActivacion(p,tipo);s=await estado(p);c=s.history.at(-1).slots[0].draws.at(-1);
   }
   assert.equal(c.accionEnemigo,opcion==='azar'||opcion==='elegir'?'activacion-spawn':opcion);
   const articulo=p.locator(`#batch-grid [data-extraccion="${c.uid}"]`);
   assert.equal(await articulo.locator('.activation-stamp').count(),c.accionEnemigo==='spawn'?0:1);
   assert.equal(await p.locator('#batch-grid .enemy-choices').count(),0);
   await p.locator('#batch-dialog [data-action="close"]').click();
  }
  await selector.selectOption('activacion-spawn');
  for(const [nombre,viewport] of [['horizontal',{width:844,height:390}],['vertical',{width:390,height:844}],['estrecho',{width:320,height:568}],['tablet',{width:1024,height:768}],['escritorio',{width:1440,height:900}]]){
   await p.setViewportSize(viewport);
   assert.ok(await p.locator('.last-heading').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
   assert.ok(await p.locator('.enemy-defaults select').evaluateAll(cs=>cs.every(c=>{const r=c.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.height>=44;})));
   assert.ok(await p.locator('.enemy-defaults label').evaluateAll(cs=>cs.every(c=>{
    const texto=c.querySelector('span').getBoundingClientRect(),select=c.querySelector('select'),r=select.getBoundingClientRect(),css=getComputedStyle(select);
    const ctx=document.createElement('canvas').getContext('2d');ctx.font=`${css.fontSize} ${css.fontFamily}`;
    const ancho=Math.max(...[...select.options].map(o=>ctx.measureText(o.textContent).width));
    return texto.right<=r.left&&Math.abs((texto.top+texto.height/2)-(r.top+r.height/2))<1&&ancho+36<=r.width;
   })));
   assert.ok(await p.locator('#reopen').evaluate(e=>e.getBoundingClientRect().height>=44&&parseFloat(getComputedStyle(e).fontSize)>=16));
   assert.ok(await p.locator('.last-heading h2').evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=24));
   await p.screenshot({path:fileURLToPath(new URL(`acciones-${tipo}-${nombre}.png`,salida)),fullPage:true});
  }
  const antesCuota=await estado(p);await p.evaluate(()=>{window.setItemOriginal=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new DOMException('Quota','QuotaExceededError');};});
  await selector.selectOption('spawn');assert.equal(await selector.inputValue(),'activacion-spawn');assert.deepEqual(await estado(p),antesCuota);
  await p.evaluate(()=>Storage.prototype.setItem=window.setItemOriginal);
  await p.reload();assert.equal(await selector.inputValue(),'activacion-spawn');await context.setOffline(true);await p.reload();assert.equal(await selector.inputValue(),'activacion-spawn');
  assert.deepEqual(await estado(p),antesCuota);await context.close();
 }
 assert.deepEqual(errores,[]);console.log('Acciones por defecto: cinco opciones, independencia, guardado, recarga/offline, tres elecciones, sellos, animación, cuota y cinco viewports; encabezado proporcional, etiquetas horizontales y opciones completas.');
}finally{await browser.close();}
