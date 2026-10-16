import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {resumenPuntaje} from '../dist/puntaje.js';
import {newGame,spawn} from '../dist/engine.js';
import {MUMM_A,MUMM_N,CHIMIMORYO,MENG_HUO} from '../dist/reglas-cartas.js';
import {disponiblesSecundario} from '../dist/secundarios.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',browser=await chromium.launch({headless:true,channel:'chrome'});
const crear=(extra={})=>newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion','caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival',selectedNigromantesIds:[MUMM_N],selectedAbominacionesIds:[MUMM_A,CHIMIMORYO],...extra},3);
function revelar(s,id,enemigo){for(const c of Object.keys(s.remaining))s.remaining[c]=c===id?s.initial[c]:0;spawn(s,()=>{const o=disponiblesSecundario(s,'abominaciones'),i=o.findIndex(c=>c.id===enemigo);return i<0?.999:(i+.1)/o.length;});s.openBatch=false;}
async function abrir(s){const ctx=await browser.newContext({viewport:{width:1440,height:900}});await ctx.addInitScript(({s,key})=>{localStorage.setItem(key,JSON.stringify(s));window.pulsos=0;const original=Element.prototype.animate;Element.prototype.animate=function(...args){if(this.id==='score-counter-host')window.pulsos++;return original.apply(this,args);};},{s,key});const p=await ctx.newPage();await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');return {ctx,p};}
const pulsos=p=>p.evaluate(()=>window.pulsos);
try{
 const s=crear();const {ctx,p}=await abrir(s);
 assert.ok(await p.locator('#profanador-indicator').evaluate(e=>e.classList.contains('inactive')));
 for(const [width,height] of [[1440,900],[1024,768],[844,390],[390,844],[320,568]]){
  await p.setViewportSize({width,height});const r=await p.evaluate(()=>{const b=s=>{const r=document.querySelector(s).getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height,cx:r.x+r.width/2,cy:r.y+r.height/2}};return {a:b('.adrenalina-selector'),k:b('#score-counter-host'),s:b('.settings-button'),spawn:b('#spawn'),z:b('.spawn-zones'),items:[...document.querySelector('.spawn-zones').children].filter(e=>e.id!=='necro-count').map(e=>{const r=e.getBoundingClientRect();return {x:r.x,c:r.y+r.height/2}}),overflow:document.documentElement.scrollWidth>innerWidth}});
  assert.ok(!r.overflow);assert.ok(Math.abs(r.a.cx-width/2)<1);assert.ok(r.items.every(i=>Math.abs(i.c-r.z.cy)<1));assert.ok(r.items.every((i,n)=>!n||i.x>r.items[n-1].x));
  if(width>760)assert.ok(Math.abs(r.k.cx-(r.a.x+r.a.w+r.s.x)/2)<1);
  if(width>600)assert.ok(Math.abs(r.spawn.cy-r.z.cy)<1);
  await p.locator('.board').screenshot({path:`docs/verificacion/zonas-pulso-${width}.png`});
 }
 await p.locator('[data-action="counter"][data-delta="1"]').click();assert.equal(await p.locator('#normal-count').textContent(),'4');await p.locator('[data-action="counter"][data-delta="-1"]').click();assert.equal(await p.locator('#normal-count').textContent(),'3');assert.equal(await pulsos(p),0);await ctx.close();
 for(const id of [MUMM_A,CHIMIMORYO,MENG_HUO]){
  const t=crear(id===MENG_HUO?{dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',selectedDailyIds:[MENG_HUO]}:{});revelar(t,'nigromante');revelar(t,id===MENG_HUO?'caminantes-normal':'abominacion',id);
  const {ctx,p}=await abrir(t),uid=t.pins.find(c=>c.cardId===id).uid,base=resumenPuntaje(t).total;
  assert.ok(!await p.locator('#profanador-indicator').evaluate(e=>e.classList.contains('inactive')));
  const unpin=()=>p.locator(`#pins [data-action="unpin"][data-uid="${uid}"]`).click();
  await unpin();await p.getByRole('button',{name:'Cerrar mensaje sin aceptar',exact:true}).click();assert.equal(await pulsos(p),0);
  const bytes=await p.evaluate(k=>localStorage.getItem(k),key);await unpin();await p.locator('#confirm-actions button.primary').click();assert.equal(await pulsos(p),1);assert.match(await p.locator('#open-zombies').getAttribute('aria-label'),new RegExp('Puntaje: '+(base+(id===MENG_HUO?0:id===MUMM_A?48:60))+'\\.'));
  const efecto=await p.evaluate(()=>{const a=document.querySelector('#score-counter-host').getAnimations()[0];a.pause();a.currentTime=750;return {duration:a.effect.getTiming().duration,scale:getComputedStyle(document.querySelector('#score-counter-host')).transform};});assert.equal(efecto.duration,1500);assert.match(efecto.scale,/1\.1/);
  if(id===MENG_HUO)assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);
  await p.emulateMedia({reducedMotion:'reduce'});await p.waitForFunction(()=>document.querySelector('#score-counter-host').getAnimations().length===0);assert.equal(await p.locator('#score-counter-host').evaluate(e=>e.getAnimations().length),0);
  if(id!==MUMM_A){await unpin();await p.locator('#confirm-actions button.primary').click();assert.equal(await pulsos(p),1);}
  else{const n=await p.evaluate(k=>JSON.parse(localStorage.getItem(k)).pins.find(c=>c.cardId==='enemigo-mumm-ra'),key);await p.locator(`#pins [data-action="zoom"][data-uid="${n.uid}"]`).click();await p.getByRole('button',{name:'Pasar a Mumm-Ra Abominación',exact:true}).click();assert.equal(await pulsos(p),1);}
  await p.emulateMedia({reducedMotion:'no-preference'});
  const prof=t.pins.find(c=>c.cardId==='enemigo-nigromante-profanador').uid;
  await p.evaluate(()=>{window.guardarOriginal=Storage.prototype.setItem;Storage.prototype.setItem=function(){throw new DOMException('Cuota','QuotaExceededError');};});
  await p.locator(`#pins [data-action="unpin"][data-uid="${prof}"]`).click();assert.equal(await pulsos(p),1);assert.ok(!await p.locator('#profanador-indicator').evaluate(e=>e.classList.contains('inactive')));
  await p.evaluate(()=>{Storage.prototype.setItem=window.guardarOriginal;});
  await p.locator(`#pins [data-action="unpin"][data-uid="${prof}"]`).click();assert.equal(await pulsos(p),2);assert.ok(await p.locator('#profanador-indicator').evaluate(e=>e.classList.contains('inactive')));
  await ctx.close();
 }
 console.log('Zonas horizontales, centros, cinco tamaños, presencia del Profanador, cancelaciones, tres reapariciones, pulso 1500 ms/10%, movimiento reducido y corrección sin pulso verificados.');
}finally{await browser.close();}
