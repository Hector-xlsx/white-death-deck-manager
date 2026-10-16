import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,spawn,unpinCard} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2';
const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival',dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta'},7);spawn(s,()=>0);s.openBatch=false;unpinCard(s,s.pins.at(-1).uid);

async function comprobarCentro(p){
 const errores=await p.locator('#inplay-gallery').evaluate(e=>{
  e.scrollTo(0,0);const r=e.getBoundingClientRect(),rects=[...e.querySelectorAll('.pinned-card')].map(c=>c.getBoundingClientRect());
  const left=Math.min(...rects.map(c=>c.left)),right=Math.max(...rects.map(c=>c.right)),top=Math.min(...rects.map(c=>c.top)),bottom=Math.max(...rects.map(c=>c.bottom)),errores=[];
  if(e.scrollWidth<=e.clientWidth+1){if(Math.abs((left+right)/2-(r.left+e.clientWidth/2))>1)errores.push('Centro horizontal');}else if(left<r.left)errores.push('Primeras cartas recortadas horizontalmente');
  if(e.scrollHeight<=e.clientHeight+1){if(Math.abs((top+bottom)/2-(r.top+e.clientHeight/2-5))>1)errores.push('Centro vertical');}else if(top<r.top)errores.push('Primeras cartas recortadas verticalmente');
  return errores;
 });assert.deepEqual(errores,[]);
}
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});await context.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s});const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');const original=await p.evaluate(k=>localStorage.getItem(k),key);
 const abrir=()=>p.locator('#open-inplay').click();const cerrar=()=>p.getByRole('button',{name:'Cerrar cartas en juego',exact:true}).click();const menos=p.getByRole('button',{name:'Reducir zoom de cartas en juego',exact:true}),mas=p.getByRole('button',{name:'Aumentar zoom de cartas en juego',exact:true});
 await abrir();assert.equal(await p.locator('#inplay-percent').textContent(),'100%');assert.equal(await p.locator('#inplay-gallery .pinned-card').count(),6);assert.equal(await p.locator('#inplay-gallery .enemy-tag').count(),6);assert.equal(await p.locator('#inplay-gallery .unpin:visible').count(),0);
 const ancho=await p.locator('#inplay-gallery .pinned-card').first().evaluate(e=>e.getBoundingClientRect().width);assert.equal(ancho,280);await mas.click();assert.equal(await p.locator('#inplay-percent').textContent(),'105%');assert.equal(await p.locator('#inplay-gallery .pinned-card').first().evaluate(e=>e.getBoundingClientRect().width),294);await menos.click();
 for(let i=0;i<10;i++)await menos.click();assert.equal(await p.locator('#inplay-percent').textContent(),'50%');assert.ok(await p.locator('#inplay-gallery').evaluate(e=>Number(e.style.getPropertyValue('--inplay-rows'))>=2));assert.ok(await p.locator('#inplay-gallery .pinned-card').evaluateAll(es=>new Set(es.map(e=>Math.round(e.getBoundingClientRect().top))).size>=2));
 await comprobarCentro(p);
 for(const [nombre,width,height] of [['escritorio',1440,900],['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568]]){
  await p.setViewportSize({width,height});await cerrar();await abrir();assert.equal(await p.locator('#inplay-percent').textContent(),'100%');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  const fuera=await p.locator('#inplay-dialog .inplay-tools button,#inplay-dialog .close-button').evaluateAll(es=>es.some(e=>{const r=e.getBoundingClientRect();return r.left<0||r.right>innerWidth||r.top<0||r.bottom>innerHeight;}));assert.equal(fuera,false);
  await comprobarCentro(p);assert.ok(await p.locator('#inplay-gallery').evaluate(e=>e.scrollWidth>e.clientWidth));await p.locator('#inplay-dialog').screenshot({path:`docs/verificacion/en-juego-zoom-${nombre}.png`});
 }
 for(let i=0;i<15;i++)await menos.click();assert.equal(await p.locator('#inplay-percent').textContent(),'25%');assert.ok(await menos.isDisabled());for(let i=0;i<35;i++)await mas.click();assert.equal(await p.locator('#inplay-percent').textContent(),'200%');assert.ok(await mas.isDisabled());await comprobarCentro(p);
 await p.locator('#inplay-gallery .image-button').first().click();assert.ok(await p.locator('#zoom-dialog').isVisible());await p.locator('#zoom-dialog [data-action="close"]').click();assert.ok(await p.locator('#inplay-dialog').isVisible());assert.deepEqual(await p.evaluate(k=>localStorage.getItem(k),key),original);
 await cerrar();await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await context.setOffline(true);await p.reload();await abrir();assert.equal(await p.locator('#inplay-percent').textContent(),'100%');for(const i of await p.locator('#inplay-gallery .image-button>img,#inplay-gallery .enemy-tag img').all())await i.evaluate(e=>e.decode());assert.deepEqual(await p.evaluate(k=>localStorage.getItem(k),key),original);const otra=await context.newPage();await otra.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');await otra.locator('#pins .unpin:not(.repin)').first().click();await p.waitForFunction(()=>document.querySelectorAll('#inplay-gallery .pinned-card').length===5);await otra.close();await context.close();
 const vacia=await browser.newContext();const q=await vacia.newPage();await q.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');await q.locator('#open-inplay').click();assert.match(await q.locator('#inplay-gallery').textContent(),/No hay cartas en juego/);await vacia.close();assert.deepEqual(errores,[]);
 console.log('Galería centrada en ambos ejes si cabe, extremos accesibles al desbordar; En juego: solo fijadas, estandartes, 100% al abrir, pasos 5%, límites 25–200%, varias filas y scroll horizontal, cinco tamaños, zoom individual, offline, partida intacta durante consulta y sincronización con otra pestaña.');
}finally{await browser.close();}
