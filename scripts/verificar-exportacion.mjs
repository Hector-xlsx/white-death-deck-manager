import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
import {newGame,spawn,replaceCard,programarConfiguracion} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const browser=await chromium.launch({headless:true,channel:'chrome'}),key='white-death-gestor-v2';
try{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'},1);
 spawn(s,()=>0);replaceCard(s,1,0,()=>0);s.openBatch=false;programarConfiguracion(s,{...s.proximaConfig,easy:false});
 const ctx=await browser.newContext({viewport:{width:1024,height:768},acceptDownloads:true,reducedMotion:'reduce'});
 await ctx.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s});
 const p=await ctx.newPage(),errores=[];p.on('pageerror',e=>errores.push(e.message));
 await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');
 const guardado=await p.evaluate(k=>localStorage.getItem(k),key);
 await p.getByRole('button',{name:/^Historial/}).click();
 const boton=p.getByRole('button',{name:'Exportar partida (JSON)',exact:true});
 for(const [width,height] of [[1440,900],[1024,768],[844,390],[390,844],[320,568]]){
  await p.setViewportSize({width,height});await boton.scrollIntoViewIfNeeded();
  const r=await boton.boundingBox();assert.ok(r&&r.height>=44&&r.x>=0&&r.x+r.width<=width);
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 }
 await p.setViewportSize({width:1024,height:768});
 const descargar=async()=>{
  const descarga=p.waitForEvent('download');await boton.click();const d=await descarga;
  assert.match(d.suggestedFilename(),/^white-death-partida-.*\.json$/);
  const informe=JSON.parse(await readFile(await d.path(),'utf8'));
  assert.deepEqual(informe.partida,JSON.parse(guardado));
  assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),guardado);return informe;
 };
 await descargar();
 await p.screenshot({path:'docs/verificacion/exportacion-tablet.png'});
 // Ni una cuota agotada ni la ausencia de red impiden una descarga de solo lectura.
 await p.evaluate(()=>{window.escriturasExportacion=0;window.setItemOriginal=Storage.prototype.setItem;Storage.prototype.setItem=function(){window.escriturasExportacion++;throw new DOMException('Cuota','QuotaExceededError');};});
 await descargar();assert.equal(await p.evaluate(()=>window.escriturasExportacion),0);
 await p.evaluate(()=>{Storage.prototype.setItem=window.setItemOriginal;});
 // Un cambio todavía no recibido de otra pestaña no se exporta como si fuera el estado visible.
 await p.evaluate(k=>localStorage.setItem(k,localStorage.getItem(k)+' '),key);
 let descargas=0;const contar=()=>descargas++;p.on('download',contar);
 await boton.click();assert.match(await p.locator('#toast').textContent(),/otra pestaña/);assert.equal(descargas,0);p.off('download',contar);
 await p.evaluate(({key,guardado})=>localStorage.setItem(key,guardado),{key,guardado});
 await p.locator('#history-dialog .close-button').click();
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 await ctx.setOffline(true);await p.reload();await p.getByRole('button',{name:/^Historial/}).click();await descargar();
 assert.deepEqual(errores,[]);await ctx.close();
 console.log('Exportación: descarga JSON exacta, cinco tamaños, cuota sin escrituras, conflicto entre pestañas y recarga offline aprobados.');
}finally{await browser.close();}
