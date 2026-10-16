import {createRequire} from 'node:module';
import {newGame,spawn} from '../dist/engine.js';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
await mkdir('docs/verificacion',{recursive:true});
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2';
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 for(const [tipo,id,trofeo] of [['abominacion','enemigo-amaterasu',true],['abominacion','enemigo-abominacion-orca',false],['nigromante','enemigo-ostokar-el-palido',false]]){
  const mazo=tipo==='abominacion'?'abominaciones':'nigromantes';
  const s=newGame({easy:true,normal:true,threshold:0,selectedIds:[tipo,'asedio'],modoNigromantes:'sin-reposicion',modoAbominaciones:'sin-reposicion',...(tipo==='abominacion'?{selectedAbominacionesIds:[id]}:{selectedNigromantesIds:[id]})},1);
  let azar=[0,0,.99];spawn(s,()=>azar.shift()??.99);s.openBatch=false;const uid=s.pins[0].uid;
  const context=await browser.newContext({viewport:{width:844,height:390}});await context.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s});
  const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
  const estado=()=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
  await p.locator('#pins .image-button').click();const devolver=p.getByRole('button',{name:`Volver a agregar al mazo de ${mazo}`,exact:true});
  await devolver.click();assert.equal((await p.locator('#confirm-message').textContent()).includes('tiene trofeo'),trofeo);
  for(const [nombre,width,height] of [['horizontal',844,390],['vertical',390,844],['estrecho',320,568],['tablet',1024,768]]){
   await p.setViewportSize({width,height});assert.ok(await p.locator('#confirm-dialog').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&e.scrollWidth<=e.clientWidth;}));
   await p.screenshot({path:`docs/verificacion/devolucion-${trofeo?'trofeo':tipo}-${nombre}.png`,fullPage:true});
  }
  await p.locator('#confirm-actions [data-value="no"]').click();assert.deepEqual(await estado(),s);
  await devolver.click();await p.locator('#confirm-actions [data-value="si"]').click();
  let actual=await estado();assert.equal(actual.pins.length,0);assert.equal(actual.unpinned[0].uid,uid);assert.equal(actual[mazo].remaining[id],1);if(tipo==='nigromante')assert.equal(actual.necro,0);
  await p.locator('#toggle-desfijados').click();await p.locator('#desfijados .repin').click();actual=await estado();assert.equal(actual[mazo].remaining[id],0);assert.equal(actual.pins.length,1);if(tipo==='nigromante')assert.equal(actual.necro,1);
  await p.locator('#pins .unpin:not(.repin)').click();actual=await estado();if(trofeo)assert.equal(actual[mazo].trofeos[id],uid);
  await p.locator(`#last-preview button[data-uid="${uid}"]`).click();await devolver.click();assert.equal((await p.locator('#confirm-message').textContent()).includes('tiene trofeo'),trofeo);
  const antes=await estado();await p.evaluate(()=>{window.setter=Storage.prototype.setItem;Storage.prototype.setItem=()=>{throw new DOMException('Quota','QuotaExceededError');};});
  await p.locator('#confirm-actions [data-value="si"]').click();assert.deepEqual(await estado(),antes);await p.evaluate(()=>Storage.prototype.setItem=window.setter);
  await devolver.click();await p.locator('#confirm-actions [data-value="si"]').click();actual=await estado();assert.equal(actual[mazo].remaining[id],1);
  await context.setOffline(true);await p.reload();assert.deepEqual(await estado(),actual);await context.close();
 }
 assert.deepEqual(errores,[]);console.log('Devolucion: ambas familias, aviso de trofeo solo cuando corresponde, cancelar/confirmar, desfijado/refijado, zonas, cuota y recarga offline.');
}finally{await browser.close();}
