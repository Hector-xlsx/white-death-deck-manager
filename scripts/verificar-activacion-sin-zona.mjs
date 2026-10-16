import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2';
function crear(familia,solo){
 if(familia==='abominaciones'){const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['abominacion'],modoNigromantes:'sin-reposicion',reglaNigromantes:solo?'estandar':'varios',reglaAbominaciones:solo?'estandar':'festival',selectedAbominacionesIds:['enemigo-abominacion-kan','enemigo-abominacion-orca']},1);
spawn(s,()=>0);spawn(s,()=>0);s.openBatch=false;
return s;}
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','asedio'],modoNigromantes:'sin-reposicion',reglaNigromantes:solo?'estandar':'varios',reglaAbominaciones:solo?'estandar':'festival',selectedNigromantesIds:['enemigo-bomoh']},1);
 for(let i=0;i<2;i++){for(const id of Object.keys(s.remaining))s.remaining[id]=Number(id==='nigromante');spawn(s,()=>.99);}
 s.openBatch=false;return s;
}
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 for(const familia of ['abominaciones','nigromantes'])for(const solo of [false,true]){const s=crear(familia,solo);const origen=s.history.at(-1).slots.flatMap(t=>t.draws).find(c=>c.activaciones?.length);
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});await context.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s});const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');
 async function comprobar(selector,mini=false){
  const refs=p.locator(selector+' [data-extraccion^="a-"]');assert.equal(await refs.count(),1);assert.equal(await refs.locator('.spawn-zone-token').count(),0);assert.equal(await refs.locator('.spawn-zone-space').count(),1);assert.equal(await refs.locator('.activation-stamp').count(),1);
  assert.equal(await p.locator(selector+' .spawn-zone-token').count(),(familia==='abominaciones'?2:3)-(solo?1:0));
  
  const original=p.locator(selector+' [data-extraccion="'+origen.uid+'"]');
  const imagen=original.locator(mini?'.mini-media>button>img':'.card-image>img');assert.equal(await imagen.evaluate(e=>getComputedStyle(e).filter),'grayscale(1)');assert.equal(await imagen.evaluate(e=>getComputedStyle(e).opacity),'0.75');
  assert.equal(await original.locator('.spawn-zone-token').evaluate(e=>getComputedStyle(e).filter),'grayscale(1)');
  assert.equal(await refs.locator(mini?'.mini-media>button>img':'.card-image>img').evaluate(e=>getComputedStyle(e).filter),'none');
  const espacios=await p.locator(selector+' .spawn-zone-space').evaluateAll(ns=>ns.map(n=>n.getBoundingClientRect().height));assert.deepEqual(espacios,[mini?36:54]);
 }
 await comprobar('#last-preview',true);await p.locator('#reopen').click();const antes=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
 for(const [width,height] of [[1440,900],[1024,768],[844,390],[390,844],[320,568]]){await p.setViewportSize({width,height});await comprobar('#batch-grid');const filas=await p.locator('#batch-grid .draw-card').evaluateAll(cs=>cs.map(c=>{const z=c.querySelector('.spawn-zone-token,.spawn-zone-space').getBoundingClientRect(),i=c.querySelector('.card-image>img').getBoundingClientRect();return{y:z.top,centro:i.top+i.height/2};}));for(const a of filas)for(const b of filas)if(Math.abs(a.y-b.y)<1)assert.ok(Math.abs(a.centro-b.centro)<1);}
 await p.reload();await comprobar('#batch-grid');assert.deepEqual(await p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key),antes);
 await p.locator('#batch-dialog [data-action="close"]').click();await p.getByRole('button',{name:/Historial/}).click();assert.equal(await p.locator('#history-list [data-extraccion^="a-"] .spawn-zone-token').count(),0);assert.equal(await p.locator('#history-list [data-extraccion^="a-"] .activation-stamp').count(),1);assert.deepEqual(errores,[]);
 await context.close();}
 console.log('Origen gris y referencia a color para solo activación y activación más spawn; activación de abominación y nigromante sin token en Aparición/Última tanda/Historial; nuevas apariciones conservan token, cinco tamaños y centros alineados; recarga conserva estado.');
}finally{await browser.close();}
