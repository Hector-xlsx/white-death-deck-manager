import {abrirSeccionesConfiguracion} from './ayuda-configuracion.mjs';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {newGame,spawn,isValid} from '../dist/engine.js';
import {RAKSHASA} from '../dist/reglas-cartas.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright'),key='white-death-gestor-v2';
const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival',dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',selectedDailyIds:[RAKSHASA]},1);spawn(s,()=>0);s.openBatch=false;
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 const ctx=await browser.newContext({viewport:{width:1440,height:900},reducedMotion:'reduce'});await ctx.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s});const p=await ctx.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');
 assert.equal(await p.locator('#open-zombies').getAttribute('data-theme'),'kang');assert.match(await p.locator('#open-zombies').getAttribute('aria-label'),/Puntaje: 27/);
 await p.locator('#open-zombies').focus();await p.keyboard.press('Enter');assert.ok(await p.locator('#zombies-dialog').isVisible());assert.equal(await p.locator('#zombies-total').textContent(),'8');assert.equal(await p.locator('#score-total').textContent(),'27');
 await p.locator('#zombies-adjustment-form [data-action="zombis-ajuste"][data-delta="5"]').click();assert.equal(await p.locator('#zombies-total').textContent(),'8');assert.equal(await p.locator('#score-total').textContent(),'27');await p.locator('#zombies-add').click();assert.equal(await p.locator('#zombies-total').textContent(),'13');assert.equal(await p.locator('#score-total').textContent(),'42');
 await p.locator('#zombies-amount').fill('-2');await p.locator('#zombies-add').click();assert.equal(await p.locator('#zombies-total').textContent(),'11');assert.equal(await p.locator('#score-total').textContent(),'36');assert.equal(await p.locator('#zombies-log li').count(),2);
 const cancelar=await p.evaluate(k=>localStorage.getItem(k),key);await p.locator('#zombies-amount').fill('9007199254740991');assert.ok(await p.locator('#zombies-add').isDisabled());assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),cancelar);await p.locator('#zombies-amount').fill('0');
 const cantidades=await p.evaluate(k=>{const s=JSON.parse(localStorage.getItem(k));return {history:s.history,pins:s.pins,ajustes:s.ajustesZombis,sequence:s.sequence};},key);
 await p.locator('#zombies-dialog [data-action="close"]').click();
 for(const tema of ['kang','dragon','cabeza']){
  await p.getByRole('button',{name:'Configuración',exact:true}).click();await abrirSeccionesConfiguracion(p,'Apariencia',['puntaje']);await p.locator('#tema-puntaje').selectOption(tema);await p.locator('#save-settings').click();assert.equal(await p.locator('#open-zombies').getAttribute('data-theme'),tema);assert.match(await p.locator('#open-zombies').getAttribute('aria-label'),/Puntaje: 36/);await p.locator('#open-zombies img').evaluate(e=>e.decode());
  for(const [nombre,width,height] of [['escritorio',1440,900],['tablet',1024,768],['horizontal',844,390],['vertical',390,844],['estrecho',320,568]]){
   await p.setViewportSize({width,height});assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);await p.locator('.brand').screenshot({path:`docs/verificacion/puntaje-${tema}-${nombre}.png`});
  }
  await p.locator('#open-zombies').click();assert.equal(await p.locator('#score-total').textContent(),'36');assert.equal(await p.locator('#zombies-total').textContent(),'11');await p.locator('#score-dialog-display img').evaluate(e=>e.decode());await p.locator('#zombies-dialog').screenshot({path:`docs/verificacion/puntaje-${tema}-detalle.png`});await p.locator('#zombies-dialog [data-action="close"]').click();
 }
 const ahora=await p.evaluate(k=>{const s=JSON.parse(localStorage.getItem(k));return {history:s.history,pins:s.pins,ajustes:s.ajustesZombis,sequence:s.sequence};},key);assert.deepEqual(ahora,cantidades);
 // Validar los paths reales del paquete, incluidos signo y autoajuste de cifras.
 const glifos=await p.evaluate(()=>{
  const host=document.createElement('div');host.style.cssText='position:fixed;inset:0 auto auto 0;width:420px;z-index:9999';document.body.append(host);let n=0;
  for(const theme of ['kang','dragon','cabeza'])for(const width of [180,280,420])for(const value of [0,9,99,999,1000,99999,-999,Number.MAX_SAFE_INTEGER])for(const showPlus of [false,true]){
   const c=ScoreCounter.create(host,{theme,value,width,showPlus,assetBase:'./recursos/Imagenes generales/contadores_puntaje/assets/'}),svg=c.element.querySelector('svg'),g=svg.querySelector('g[data-score]'),shape=svg.querySelector('defs g'),box=ScoreCounter.themes[theme].box,b=shape.getBBox(),matrix=g.transform.baseVal.consolidate().matrix,pad=65;
   if(b.x*matrix.a+matrix.e-pad*matrix.a<box.x-1||(b.x+b.width)*matrix.a+matrix.e+pad*matrix.a>box.x+box.width+1||b.y*matrix.d+matrix.f-pad*matrix.d<box.y-1||(b.y+b.height)*matrix.d+matrix.f+pad*matrix.d>box.y+box.height+1)throw Error('Glifos fuera de caja: '+theme+' / '+value);
   if(svg.outerHTML.includes('NaN'))throw Error('SVG inválido');c.destroy();n++;
  }host.remove();return n;
 });assert.equal(glifos,144);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});const bytes=await p.evaluate(k=>localStorage.getItem(k),key);assert.ok(isValid(JSON.parse(bytes)));await ctx.setOffline(true);await p.reload();assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),bytes);assert.equal(await p.locator('#open-zombies').getAttribute('data-theme'),'cabeza');await p.locator('#open-zombies img').evaluate(e=>e.decode());await p.locator('#open-zombies').click();assert.equal(await p.locator('#score-total').textContent(),'36');assert.equal(await p.locator('#zombies-total').textContent(),'11');assert.deepEqual(errores,[]);await ctx.close();
 console.log('Puntaje: ponderaciones, ajuste agrupado de Caminantes, temas, 144 combinaciones de glifos, cinco tamaños, teclado, persistencia y offline verificados en contexto aislado.');
}finally{await browser.close();}
