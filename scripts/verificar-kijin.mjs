import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',actual='recursos/04 - Mazo Abominaciones ESP/Carta Kijin de Zombicide-13.png';
const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['abominacion','asedio'],selectedAbominacionesIds:['enemigo-kijin'],modoAbominaciones:'sin-reposicion'},1);
let azar=[0,0,.99];spawn(s,()=>azar.shift()??.99);s.openBatch=false;
s.abominaciones.cartas[0].image='recursos/04 - Mazo Abominaciones ESP/Carta Kijin con corrección tipográfica-18.png';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const context=await browser.newContext({viewport:{width:844,height:390}}),errores=[];
 await context.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s});
 const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));
 await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 const comprobar=async()=>{
  const imagen=p.locator('#pins .image-button img').first();
  await imagen.evaluate(i=>i.decode());
  const info=await imagen.evaluate(i=>({src:decodeURI(i.src),ancho:i.naturalWidth,alto:i.naturalHeight}));
  assert.ok(info.src.endsWith(actual));assert.equal(info.ancho,1004);assert.equal(info.alto,1566);
  await p.locator('#pins .image-button').click();
  assert.ok(await p.getByRole('button',{name:'Volver a agregar al mazo de abominaciones',exact:true}).isVisible());
 };
 await comprobar();await context.setOffline(true);await p.reload();await comprobar();
 assert.deepEqual(errores,[]);await context.close();
 console.log('Kijin: imagen actual, guardado con ruta antigua recuperado, detalle y recarga offline correctos.');
}finally{await browser.close();}
