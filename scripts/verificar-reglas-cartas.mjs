import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,spawn,isValid} from '../dist/engine.js';
import {MUMM_N,MUMM_A,SHAKOKI,CHIMIMORYO,MENG_HUO,RAKSHASA} from '../dist/reglas-cartas.js';
import {disponiblesSecundario} from '../dist/secundarios.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/';
const crear=(extra={})=>newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion','caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival',selectedNigromantesIds:[MUMM_N],selectedAbominacionesIds:[MUMM_A,SHAKOKI,CHIMIMORYO],...extra},1);
function revelar(s,id,enemigo=null){for(const c of Object.keys(s.remaining))s.remaining[c]=c===id?s.initial[c]:0;spawn(s,()=>{const opciones=disponiblesSecundario(s,'abominaciones'),i=opciones.findIndex(c=>c.id===enemigo);return i<0?.999:(i+.1)/opciones.length;});assert.ok(isValid(s));}
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
async function abrir(s){const ctx=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});await ctx.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s});const p=await ctx.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(url);return {ctx,p};}
async function cancelarMensaje(p,{escape=false}={}){
 const antes=await p.evaluate(k=>localStorage.getItem(k),key);
 assert.equal(await p.getByRole('button',{name:'Cerrar mensaje sin aceptar',exact:true}).count(),1);
 if(escape)await p.keyboard.press('Escape');else await p.getByRole('button',{name:'Cerrar mensaje sin aceptar',exact:true}).click();
 assert.equal(await p.locator('#confirm-dialog').isVisible(),false);
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),antes);
}
try{
 const s=crear();revelar(s,'nigromante');if(!s.pins.some(c=>c.cardId===MUMM_N))revelar(s,'nigromante');revelar(s,'nigromante');
 const {ctx,p}=await abrir(s);await p.locator('#batch-dialog[data-revelacion="lista"]').waitFor();
 const desde=p.locator('[data-extraccion^="m-desde-"]').first(),hasta=p.locator('[data-extraccion^="m-hasta-"]').first();
 assert.equal(await desde.locator('.spawn-zone-token,.activation-stamp,.card-actions').count(),0);assert.equal(await hasta.locator('.spawn-zone-token,.activation-stamp,.card-actions').count(),0);assert.ok(await desde.evaluate(e=>e.classList.contains('spawn-applied')));
 await p.locator('#batch-dialog [data-action="close"]').click();const a=s.pins.find(c=>c.cardId===MUMM_A);
 await p.locator(`#pins [data-action="unpin"][data-uid="${a.uid}"]`).click();assert.match(await p.locator('#confirm-message').textContent(),/Mumm-Ra Nigromante/);await cancelarMensaje(p);await p.locator(`#pins [data-action="unpin"][data-uid="${a.uid}"]`).click();await p.getByRole('button',{name:'Invocar Mumm-Ra Nigromante',exact:true}).click();
 const n=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).pins.find(c=>c.cardId==='enemigo-mumm-ra'),key);await p.locator(`#pins [data-action="zoom"][data-uid="${n.uid}"]`).click();await p.getByRole('button',{name:'Pasar a Mumm-Ra Abominación',exact:true}).click();assert.ok(await p.locator(`#pins .pinned-card`).count());
 const antes=await p.evaluate(k=>localStorage.getItem(k),key);await p.reload();assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),antes);await ctx.close();
 const t=crear({dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',selectedDailyIds:[RAKSHASA]});revelar(t,'abominacion',SHAKOKI);revelar(t,'caminantes-normal');
 const g=await abrir(t);await g.p.locator('#batch-dialog[data-revelacion="lista"]').waitFor();assert.match((await g.p.locator('#batch-grid .extra-zombies').allTextContents()).join(' '),/\+1.*Caminantes.*Shakōki/s);
 for(const [nombre,width,height] of [['escritorio',1440,900],['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568]]){
  await g.p.setViewportSize({width,height});assert.equal(await g.p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await g.p.locator('#batch-dialog').screenshot({path:`docs/verificacion/reglas-cartas-${nombre}.png`});
 }
 await g.p.locator('#batch-dialog [data-action="close"]').click();await g.p.getByRole('button',{name:/Historial/}).click();assert.match(await g.p.locator('#history-list').textContent(),/Zona de Rakshasa/);await g.p.locator('#history-dialog [data-action="close"]').click();
 await g.p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});const bytes=await g.p.evaluate(k=>localStorage.getItem(k),key);await g.ctx.setOffline(true);await g.p.reload();assert.equal(await g.p.evaluate(k=>localStorage.getItem(k),key),bytes);assert.match(await g.p.locator('#last-preview').textContent(),/Shakōki/);await g.ctx.close();
 const c=crear();revelar(c,'nigromante');revelar(c,'abominacion',CHIMIMORYO);c.openBatch=false;const h=await abrir(c),uid=c.pins.find(p=>p.cardId===CHIMIMORYO).uid;
 await h.p.locator(`#pins [data-action="unpin"][data-uid="${uid}"]`).click();await cancelarMensaje(h.p);await h.p.locator(`#pins [data-action="unpin"][data-uid="${uid}"]`).click();await h.p.getByRole('button',{name:'Reaparecer en la zona de nigromante más cercana',exact:true}).click();assert.equal(await h.p.locator(`#pins [data-action="unpin"][data-uid="${uid}"]`).count(),1);
 await h.p.locator(`#pins [data-action="unpin"][data-uid="${uid}"]`).click();await h.p.getByRole('button',{name:'Derrotar abominación',exact:true}).click();await cancelarMensaje(h.p,{escape:true});await h.p.locator(`#pins [data-action="unpin"][data-uid="${uid}"]`).click();await h.p.getByRole('button',{name:'Derrotar abominación',exact:true}).click();await h.p.getByRole('button',{name:'Sí, derrotar',exact:true}).click();assert.equal(await h.p.locator(`#pins [data-action="unpin"][data-uid="${uid}"]`).count(),0);await h.ctx.close();
 const m=crear({dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',selectedDailyIds:[MENG_HUO]});revelar(m,'caminantes-normal');m.openBatch=false;const j=await abrir(m),mu=m.pins.find(c=>c.cardId===MENG_HUO).uid;
 await j.p.locator(`#pins [data-action="unpin"][data-uid="${mu}"]`).click();await cancelarMensaje(j.p);await j.p.locator(`#pins [data-action="unpin"][data-uid="${mu}"]`).click();await j.p.getByRole('button',{name:'Mover a la primera zona de aparición',exact:true}).click();assert.equal(await j.p.locator(`#pins [data-action="unpin"][data-uid="${mu}"]`).count(),1);
 await j.p.locator(`#pins [data-action="zoom"][data-uid="${mu}"]`).click();await j.p.getByRole('button',{name:'Retirar Meng Huo',exact:true}).click();assert.match(await j.p.locator('#confirm-message').textContent(),/primera zona de aparición/);
 await cancelarMensaje(j.p);assert.ok(await j.p.locator('#zoom-dialog').isVisible());await j.p.getByRole('button',{name:'Retirar Meng Huo',exact:true}).click();await j.p.getByRole('button',{name:'Cancelar',exact:true}).click();assert.equal(await j.p.locator(`#pins [data-action="unpin"][data-uid="${mu}"]`).count(),1);
 await j.p.getByRole('button',{name:'Retirar Meng Huo',exact:true}).click();await j.p.getByRole('button',{name:'Sí, retirar',exact:true}).click();assert.equal(await j.p.locator(`#pins [data-action="unpin"][data-uid="${mu}"]`).count(),0);assert.equal(await j.p.locator('#zoom-dialog').isVisible(),false);
 const retirado=await j.p.evaluate(k=>localStorage.getItem(k),key);assert.ok(isValid(JSON.parse(retirado)));await j.p.reload();assert.equal(await j.p.evaluate(k=>localStorage.getItem(k),key),retirado);assert.equal(await j.p.locator(`#pins [data-action="unpin"][data-uid="${mu}"]`).count(),0);await j.ctx.close();
 assert.deepEqual(errores,[]);console.log('Reglas por carta: transformaciones, diálogos de derrota/reaparición, referencias +N, cinco tamaños, historial, recarga y offline verificados en contexto aislado.');
}finally{await browser.close();}
