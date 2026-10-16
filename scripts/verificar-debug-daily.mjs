import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/';
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 for(const [nombre,habilitado,base] of [['fallos',true,20],['acierto',true,100],['cero',true,0],['apagado',false,20]]){
  const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['asedio'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado',dailyHabilitado:habilitado,dailyBase:base,dailyIncremento:20,dailyIncrementoPor:'carta'},3);spawn(s,()=>.99);s.openBatch=false;
  const context=await browser.newContext({viewport:{width:844,height:390},reducedMotion:'reduce'});await context.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s});
  const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(url);await p.locator('#reopen').click();const esperado=s.history[0].slots.flatMap(t=>t.draws).filter(c=>c.dailyIntento).map(c=>' - '+c.dailyIntento.probabilidad+'%');assert.deepEqual(await p.locator('#batch-grid .debug-daily').allTextContents(),esperado);
  if(nombre==='fallos')assert.deepEqual(esperado,[' - 20%',' - 40%',' - 60%']);
  const antes=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);await p.reload();assert.deepEqual(await p.locator('#batch-grid .debug-daily').allTextContents(),esperado);assert.deepEqual(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key),antes);
  await p.setViewportSize({width:320,height:568});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(await p.locator('#batch-grid .debug-daily').allTextContents(),esperado);
  if(nombre==='fallos')await p.locator('#batch-dialog').screenshot({path:'docs/verificacion/debug-daily.png'});
  await p.locator('#batch-dialog [data-action="close"]').click();await p.getByRole('button',{name:/Historial/}).click();assert.equal(await p.locator('#history-list .debug-daily').count(),0);await context.close();
 }
 assert.deepEqual(errores,[]);console.log('Debug Daily: probabilidad guardada por carta (20/40/60), acierto 100%, 0%, deshabilitado, recarga sin resorteo, 320/844px y solo Aparición.');
}finally{await browser.close();}

