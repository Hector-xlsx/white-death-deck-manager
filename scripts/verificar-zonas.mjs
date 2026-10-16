import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {newGame,spawn} from '../dist/engine.js';
import {limitesIniciales} from '../dist/limites.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/';
const semilla=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','asedio'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival',limitesPorAdrenalina:limitesIniciales(true)},2);
for(const id of Object.keys(semilla.remaining))semilla.remaining[id]=Number(id==='nigromante');
spawn(semilla,()=>.99);semilla.openBatch=false;
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
await mkdir('docs/verificacion',{recursive:true});
const context=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});
await context.addInitScript(({key,semilla})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));},{key,semilla});
const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));
const estado=()=>p.evaluate(k=>JSON.parse(localStorage.getItem(k)),key);
async function comprobar(selector,mini=false){
 const datos=await p.locator(selector).evaluateAll((grupos,mini)=>grupos.map(g=>({tipo:g.dataset.tipo,borde:getComputedStyle(g).borderBottomWidth,cartas:[...g.querySelectorAll(mini?'.last-mini':'.draw-card')].map(c=>{const t=c.querySelector('.spawn-zone-token'),n=t?.querySelector('.spawn-zone-number'),media=c.querySelector('.card-media,.mini-media'),r=t?.getBoundingClientRect(),nr=n?.getBoundingClientRect();return {aplicado:c.classList.contains('spawn-applied'),filtro:getComputedStyle(t).filter,opacidad:getComputedStyle(t).opacity,cantidad:c.querySelectorAll('.spawn-zone-token').length,src:t?.querySelector('img').getAttribute('src'),numero:n?.textContent,color:n&&getComputedStyle(n).color,centrado:!n||Math.abs((nr.left+nr.width/2)-(r.left+r.width/2))<1&&Math.abs((nr.top+nr.height/2)-(r.top+r.height/2))<1,encima:r.bottom<=media.getBoundingClientRect().top+.1};})})),mini);
 for(const g of datos){assert.equal(g.borde,'0px');for(const c of g.cartas){assert.equal(c.cantidad,1);assert.equal(c.filtro,c.aplicado?'grayscale(1)':'none');assert.equal(c.opacidad,c.aplicado?'0.75':'1');assert.ok(c.encima);assert.ok(c.centrado);if(g.tipo==='normal'){assert.ok(c.src.endsWith('Marcador de zonas de estandar.png'));assert.match(c.numero,/^[12]$/);assert.equal(c.color,'rgb(255, 255, 255)');}else{assert.ok(c.src.endsWith('Marcador de zonas de nigromante.png'));assert.equal(c.numero,undefined);}}}
 assert.equal(await p.locator('.derivation-arrows,.zone-group-label,.last-zone-label').count(),0);
 return datos;
}
try{
 await p.goto(url);assert.deepEqual(await estado(),semilla);await comprobar('#last-preview .last-zone-group',true);await p.locator('#reopen').click();const abierta=await estado();
 const datos=await comprobar('#batch-grid .zone-group');assert.ok(datos.some(g=>g.tipo==='derivada'));assert.ok(datos[0].cartas.length>=2);assert.ok(datos[0].cartas.every(c=>c.numero==='1'));
 for(const [nombre,width,height] of [['escritorio',1440,900],['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568]]){
  await p.setViewportSize({width,height});await comprobar('#batch-grid .zone-group');assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.locator('#batch-dialog').screenshot({path:`docs/verificacion/tokens-zonas-${nombre}.png`});assert.deepEqual(await estado(),abierta);
 }
 await p.setViewportSize({width:1440,height:900});await p.locator('#batch-grid').screenshot({path:'docs/verificacion/tokens-zonas.png'});
 await p.locator('#batch-grid [data-action="zoom"]').nth(1).click();assert.ok(await p.locator('#zoom-dialog').isVisible());await p.locator('#zoom-dialog [data-action="close"]').click();
 await p.locator('#batch-dialog [data-action="close"]').click();await p.getByRole('button',{name:/Historial/}).click();await comprobar('#history-list .zone-group');await p.locator('#history-dialog [data-action="close"]').click();
 const antes=await estado();await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await context.setOffline(true);await p.reload();await comprobar('#last-preview .last-zone-group',true);await p.locator('#reopen').click();await comprobar('#batch-grid .zone-group');assert.deepEqual(await estado(),{...antes,openBatch:true});
 assert.deepEqual(errores,[]);console.log('Tokens: zona real sobre cada carta, blanco centrado, verde sin número, sin líneas ni segunda flecha, cinco tamaños, historial/última tanda, zoom, recarga offline y guardado intacto.');
}finally{await browser.close();}


