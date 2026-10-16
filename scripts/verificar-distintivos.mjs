import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {newGame,spawn,pinCard} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',semilla=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion','asedio','brutos-normal','caminantes-normal','corredores-normal'],modoNigromantes:'sin-reposicion',modoAbominaciones:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival'},6);
for(const id of Object.keys(semilla.remaining))semilla.remaining[id]=1;const azar=[0,0,0,0,0,0,0,.99];spawn(semilla,()=>azar.shift()??.99);semilla.openBatch=false;
for(const slot of semilla.history[0].slots)for(const c of slot.draws)if(['brutos-normal','caminantes-normal','corredores-normal'].includes(c.cardId)&&!semilla.pins.some(a=>a.cardId===c.cardId))pinCard(semilla,c);
const salida=new URL('../docs/verificacion/',import.meta.url);await mkdir(salida,{recursive:true});
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 const context=await browser.newContext();
 await context.addInitScript(({key,semilla})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));},{key,semilla});
 const p=await context.newPage();p.on('pageerror',e=>{errores.push(e.message);console.error(e.message);});await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 assert.deepEqual(await p.locator('#pins .enemy-tag').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label'))),['Nigromante','Abominación','Bruto','Caminante','Corredor']);
 assert.equal(await p.locator('#last-preview .enemy-tag').count(),0);
 for(const [nombre,width,height] of [['escritorio',1440,900],['horizontal',844,390],['vertical',390,844],['tablet',1024,768],['estrecho',320,568]]){
  await p.setViewportSize({width,height});await p.locator('#pins').scrollIntoViewIfNeeded();
  assert.ok(await p.locator('#pins .enemy-tag').evaluateAll(async es=>{
   for(const e of es){
    const im=e.querySelector('img');await im.decode();const r=e.getBoundingClientRect(),b=e.parentElement.getBoundingClientRect(),i=im.getBoundingClientRect();
    if(Math.abs(r.height/(b.height-2)-.2)>.002||Math.abs(r.top-b.top-1)>1||Math.abs(r.left-b.left-5)>1||Math.abs(i.width/i.height-im.naturalWidth/im.naturalHeight)>.002||getComputedStyle(e).pointerEvents!=='none')return false;
   }return true;
  }));
  await p.screenshot({path:fileURLToPath(new URL(`distintivos-${nombre}.png`,salida)),fullPage:true});
 }
 const tag=p.locator('#pins .enemy-tag-nigromantes');const r=await tag.boundingBox();await p.mouse.click(r.x+r.width/2,r.y+r.height/2);
 assert.equal(await p.locator('#zoom-dialog').isVisible(),true);await p.locator('#zoom-dialog [data-action="close"]').click();
 await context.setOffline(true);await p.reload();
 for(const im of await p.locator('#pins .enemy-tag img').all())await im.evaluate(e=>e.decode());
 await p.locator('#pins .unpin:not(.repin)').first().click();assert.equal(await p.locator('#pins .enemy-tag-nigromantes').count(),0);
 assert.equal(await p.locator('#pins .enemy-tag-abominaciones').count(),1);

 const diarios=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival',dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',selectedDailyIds:['daily-du01','daily-du03','daily-du05']},3);spawn(diarios,()=>0);diarios.openBatch=false;
 const ctxDaily=await browser.newContext({reducedMotion:'reduce'});await ctxDaily.addInitScript(({key,s})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(s));},{key,s:diarios});const pd=await ctxDaily.newPage();pd.on('pageerror',e=>errores.push(e.message));await pd.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');
 assert.deepEqual(await pd.locator('#pins .enemy-tag').evaluateAll(es=>es.map(e=>e.getAttribute('aria-label'))),['Caminante','Bruto','Corredor']);
 await pd.locator('#pins .unpin:not(.repin)').nth(1).click();assert.equal(await pd.locator('#pins .enemy-tag-brutos').count(),0);await pd.locator('#toggle-desfijados').click();assert.equal(await pd.locator('#desfijados .enemy-tag').count(),0);await pd.locator('#desfijados .repin').click();assert.equal(await pd.locator('#pins .enemy-tag-brutos').count(),1);await ctxDaily.close();
 assert.deepEqual(errores,[]);console.log('Distintivos: cinco tipos, altura 20%, proporcion intacta, borde superior y margen izquierdo, cinco viewports, zoom/desfijar y recursos offline; Daily por tipo y refijar con estandarte.');
}finally{await browser.close();}
