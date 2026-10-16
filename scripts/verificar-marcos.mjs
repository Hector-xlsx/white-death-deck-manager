import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const key='white-death-gestor-v2',semilla=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion','asedio'],modoNigromantes:'sin-reposicion',modoAbominaciones:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival'},3);
for(const id of Object.keys(semilla.remaining))semilla.remaining[id]=1;const azar=[.99,0,0,0,.99];spawn(semilla,()=>azar.shift()??.99);semilla.openBatch=false;
const salida=new URL('../docs/verificacion/',import.meta.url);await mkdir(salida,{recursive:true});

async function comprobarFilas(p,selector,mini=false){
 const filas=await p.locator(selector).evaluateAll((cartas,mini)=>{
  const filas=[];
  for(const carta of cartas){const token=carta.querySelector('.spawn-zone-token').getBoundingClientRect(),imagen=carta.querySelector(mini?'.mini-media>button>img':'.card-image>img').getBoundingClientRect(),botones=carta.querySelector('.card-actions')?.getBoundingClientRect();let fila=filas.find(f=>Math.abs(f.token-token.top)<1);if(!fila){fila={token:token.top,centros:[],botones:[]};filas.push(fila);}fila.centros.push(imagen.top+imagen.height/2);if(botones)fila.botones.push(botones.top);}
  return filas;
 },mini);
 if(selector==='#batch-grid .draw-card')assert.ok(filas.length>=2,'La muestra debe ejercer varias filas');
 for(const fila of filas){assert.ok(Math.max(...fila.centros)-Math.min(...fila.centros)<1,'Centros de cartas de la misma fila');if(fila.botones.length)assert.ok(Math.max(...fila.botones)-Math.min(...fila.botones)<1,'Botones de la misma fila');}
}

async function comprobarMarcos(p,selector,mini=false){
 const errores=await p.locator(selector).evaluateAll(async (es,mini)=>{
  const fallos=[];
  for(const e of es){
   const im=e.querySelector('img');await im.decode();const r=im.getBoundingClientRect(),carta=e.parentElement.querySelector(':scope>img'),c=carta.getBoundingClientRect(),boton=e.parentElement.getBoundingClientRect(),tile=e.closest(mini?'.last-mini':'.draw-card'),token=tile.querySelector('.spawn-zone-token,.spawn-zone-space').getBoundingClientRect(),acciones=tile.querySelector('.card-actions')?.getBoundingClientRect();
   if(im.naturalWidth!==1120||im.naturalHeight!==1748)fallos.push('Dimensiones del PNG');
   const esperado={left:r.left+r.width/4,right:r.left+r.width*3/4,top:r.top+r.height/4,bottom:r.top+r.height*3/4};
   for(const lado of ['left','right','top','bottom'])if(Math.abs(esperado[lado]-c[lado])>.15)fallos.push({lado,abertura:esperado[lado],carta:c[lado]});
   if(Math.abs(boton.width-(mini?104:155))>.1||getComputedStyle(e).pointerEvents!=='none')fallos.push('Tamaño de carta o interacción');
   const canvas=document.createElement('canvas');canvas.width=1120;canvas.height=1748;const ctx=canvas.getContext('2d');ctx.drawImage(im,0,0);const data=ctx.getImageData(0,0,1120,1748).data;
   let left=1120,right=0,top=1748,bottom=0;
   for(let y=0;y<1748;y++)for(let x=0;x<1120;x++)if(data[(y*1120+x)*4+3]>8){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
   const pintado={left:r.left+left/1120*r.width,right:r.left+(right+1)/1120*r.width,top:r.top+top/1748*r.height,bottom:r.top+(bottom+1)/1748*r.height};
   if(pintado.top<token.bottom-1||acciones&&pintado.bottom>acciones.top+1)fallos.push({solapamiento:pintado,token:token.bottom,botones:acciones?.top});
   if(!mini&&(pintado.left<0||pintado.right>innerWidth))fallos.push('Marco visible cortado horizontalmente');
   if(data[(874*1120+560)*4+3]!==0)fallos.push('Centro sin transparencia');
  }
  return fallos;
 },mini);
 assert.deepEqual(errores,[]);
}
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 const context=await browser.newContext({reducedMotion:'reduce'});await context.addInitScript(({key,semilla})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));},{key,semilla});
 const p=await context.newPage();p.on('pageerror',e=>{errores.push(e.message);console.error(e.message);});await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 assert.equal(await p.locator('#last-preview .enemy-frame').count(),2);assert.equal(await p.locator('#pins .enemy-frame').count(),0);
 await p.locator('#reopen').click();assert.equal(await p.locator('#batch-grid .enemy-frame').count(),2);
 for(const [nombre,width,height] of [['escritorio',1440,900],['horizontal',844,390],['vertical',390,844],['estrecho',320,568],['tablet',1024,768]]){
  await p.setViewportSize({width,height});await comprobarFilas(p,'#batch-grid .draw-card');
  await comprobarMarcos(p,'#batch-grid .enemy-frame');
  await p.screenshot({path:fileURLToPath(new URL(`marcos-aparicion-${nombre}.png`,salida)),fullPage:true});
  await p.locator('#batch-dialog [data-action="close"]').click();await p.waitForFunction(k=>!JSON.parse(localStorage.getItem(k)).openBatch,key);await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
  await p.locator('#last-preview .last-mini button>img').evaluateAll(async es=>Promise.all(es.map(e=>e.decode())));
  assert.ok(await p.locator('#last-preview .last-mini button>img').evaluateAll(es=>es.every(e=>Math.abs(e.getBoundingClientRect().width-102)<1&&getComputedStyle(e).position==='static')));
  await comprobarMarcos(p,'#last-preview .enemy-frame',true);
  await comprobarFilas(p,'#last-preview .last-mini',true);
  await p.screenshot({path:fileURLToPath(new URL(`marcos-ultima-tanda-${nombre}.png`,salida)),fullPage:true});await p.locator('#reopen').click();
 }
 const imagen=p.locator('#batch-grid .enemy-frame').first().locator('..');await imagen.click();assert.equal(await p.locator('#zoom-dialog').isVisible(),true);await p.locator('#zoom-dialog [data-action="close"]').click();
 await context.setOffline(true);await p.reload();for(const im of await p.locator('.enemy-frame img').all())await im.evaluate(e=>e.decode());
 assert.equal(await p.locator('#batch-grid .enemy-frame').count(),2);assert.deepEqual(errores,[]);
 console.log('Filas mixtas: tokens, centros de cartas y botones alineados con/sin marcos. Los cuatro bordes de la abertura coinciden con la carta (tolerancia 0.15px), PNG 1120x1748 y sin recortar adornos, en Aparición y Última tanda. Marcos nuevos: carta completa de 155px en Aparicion y miniatura sin reducir, marco exterior proporcional, cinco viewports sin recortes, zoom y offline.');
}finally{await browser.close();}
