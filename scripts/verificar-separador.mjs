import {createRequire} from 'node:module';
import {mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import {newGame,spawn} from '../dist/engine.js';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const url=process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/',key='white-death-gestor-v2';
const salida=new URL('../docs/verificacion/',import.meta.url);await mkdir(salida,{recursive:true});
const semilla=newGame({easy:true,normal:true,threshold:0,selectedIds:['abominacion'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival'},1);
spawn(semilla,()=>0);semilla.openBatch=false;
const browser=await chromium.launch({headless:true,channel:'chrome'}),errores=[];
try{
 const context=await browser.newContext();
 await context.addInitScript(({key,semilla})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify(semilla));},{key,semilla});
 const p=await context.newPage();p.on('pageerror',e=>errores.push(e.message));await p.goto(url);
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});
 const original=await p.evaluate(k=>localStorage.getItem(k),key);
 for(const [nombre,viewport] of [['escritorio',{width:1440,height:900}],['horizontal',{width:844,height:390}],['vertical',{width:390,height:844}],['estrecho',{width:320,height:568}],['tablet',{width:1024,height:768}]]){
  await p.setViewportSize(viewport);
  assert.ok(await p.locator('.pin-section').evaluate(async e=>{
   const css=getComputedStyle(e,'::before'),imagen=new Image();imagen.src=css.backgroundImage.slice(5,-2);await imagen.decode();
   const r=e.getBoundingClientRect(),titulo=e.querySelector('.section-title').getBoundingClientRect(),anterior=document.querySelector('.last-section').getBoundingClientRect();
   return css.backgroundRepeat==='repeat-x'&&css.height==='24px'&&imagen.naturalWidth===2172&&r.top>=anterior.bottom&&titulo.top>=r.top+24&&r.right<=innerWidth;
  }));
  assert.ok(await p.locator('.wall-separator').evaluate(async e=>{
 const gate=e.querySelector('.wall-gate');await gate.decode();const r=e.getBoundingClientRect(),g=gate.getBoundingClientRect(),left=e.querySelector('.wall-wing-left'),right=e.querySelector('.wall-wing-right'),l=left.getBoundingClientRect(),d=right.getBoundingClientRect();
 for(const [wing,tipos] of [[left,['caldero','torre']],[right,['caldero','torre']]]){
  const imgs=[...wing.querySelectorAll('img')];for(const img of imgs)await img.decode();
  if(imgs.length!==10||imgs.some((im,i)=>im.dataset.wall!==tipos[i%2]))return false;
  const cajas=imgs.map(im=>im.getBoundingClientRect()),w=wing.getBoundingClientRect();
  if(imgs.some((im,i)=>Math.abs(cajas[i].height-r.height)>.1||Math.abs(cajas[i].width/cajas[i].height-im.naturalWidth/im.naturalHeight)>.01))return false;
  if(wing===left){if(Math.abs(cajas[0].right-w.right)>1||cajas.at(-1).left>w.left)return false;for(let i=1;i<cajas.length;i++)if(Math.abs(cajas[i].right-cajas[i-1].left)>1)return false;}
  else{if(Math.abs(cajas[0].left-w.left)>1||cajas.at(-1).right<w.right)return false;for(let i=1;i<cajas.length;i++)if(Math.abs(cajas[i].left-cajas[i-1].right)>1)return false;}
 }
 const li=[...left.querySelectorAll('img')],ri=[...right.querySelectorAll('img')];for(let i=0;i<li.length;i++){const a=li[i].getBoundingClientRect(),b=ri[i].getBoundingClientRect();if(li[i].dataset.wall!==ri[i].dataset.wall||Math.abs((g.left-a.right)-(b.left-g.right))>1||Math.abs(a.width-b.width)>1)return false;}
 const titulo=e.parentElement.querySelector('.section-title').getBoundingClientRect();
 return gate.naturalWidth===2172&&Math.abs((g.left+g.width/2)-(r.left+r.width/2))<1&&Math.abs(g.width/g.height-3)<.01&&Math.abs(l.width-d.width)<1&&Math.abs(l.right-g.left)<1&&Math.abs(g.right-d.left)<1&&titulo.top>=r.bottom&&r.right<=innerWidth;
}));
  assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
  await p.locator('.wall-separator').screenshot({path:fileURLToPath(new URL(`muralla-compuesta-${nombre}.png`,salida))});
  await p.screenshot({path:fileURLToPath(new URL(`separador-muralla-${nombre}.png`,salida)),fullPage:true});
 }
 await context.setOffline(true);await p.reload();
 assert.ok(await p.locator('.pin-section').evaluate(async e=>{const i=new Image();i.src=getComputedStyle(e,'::before').backgroundImage.slice(5,-2);await i.decode();return i.naturalWidth>0;}));
 assert.ok(await p.locator('.wall-separator').evaluate(async e=>{for(const i of e.querySelectorAll('img')){await i.decode();if(!i.naturalWidth)return false;}return true;}));
 assert.equal(await p.evaluate(k=>localStorage.getItem(k),key),original);assert.deepEqual(errores,[]);
 await context.close();console.log('Puerta central; ambos lados caldero/torre desde el centro, simétricos; cinco ciclos con escala proporcional y uniones sin huecos, separadores compactos, cinco viewports, offline y partida intacta.');
}finally{await browser.close();}
