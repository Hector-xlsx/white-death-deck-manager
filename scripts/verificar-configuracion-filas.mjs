import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
const {chromium}=createRequire(import.meta.url)(process.env.MAZO_PLAYWRIGHT||'playwright');
const navegador=await chromium.launch({headless:true,channel:'chrome'});
try{
 const ctx=await navegador.newContext({viewport:{width:960,height:600}}),p=await ctx.newPage(),errores=[];
 p.on('pageerror',e=>errores.push(e.message));await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8095/mazo/');
 await p.locator('[data-action="settings"]').click();
 assert.equal(await p.locator('#config-seccion-dificultad').count(),0);
 const bytes=await p.evaluate(()=>localStorage.getItem('white-death-gestor-v2'));
 for(const [width,height] of [[960,600],[1920,1200],[844,390],[390,844],[320,568]]){
  await p.setViewportSize({width,height});
  for(const tab of ['General','Contenido','Mazos','Apariencia']){
   await p.getByRole('tab',{name:tab,exact:true}).click();
   if(tab==='Mazos')for(const id of ['general','nigromantes','abominaciones','daily'])await p.locator(`#config-seccion-${id}`).evaluate(e=>e.open=true);
   assert.equal(await p.locator('#config-panels').evaluate(e=>e.scrollWidth>e.clientWidth+1),false,`${tab} ${width}: sin desborde`);
  }
  assert.equal(await p.locator('#config-panel-apariencia details').count(),0);
  await p.locator('#config-panel-apariencia .config-info').first().click();
  assert.equal(await p.locator('.config-globo:visible').count(),1);
  const r=await p.locator('.config-globo:visible').boundingBox();assert.ok(r.x>=0&&r.x+r.width<=width);
  await p.keyboard.press('Escape');assert.equal(await p.locator('.config-globo:visible').count(),0);assert.ok(await p.locator('#settings-dialog').evaluate(e=>e.open));
 }
 await p.setViewportSize({width:960,height:600});await p.getByRole('tab',{name:'Mazos',exact:true}).click();
 await p.locator('#regla-nigromantes').selectOption('estandar');assert.ok(await p.locator('#modo-nigromantes').isHidden());
 await p.locator('#regla-nigromantes').selectOption('personalizado');assert.ok(await p.locator('#modo-nigromantes').isVisible());
 await p.locator('[name="revelacion-nigromantes-profanador-modo"]').selectOption('probabilidad');
 const fila=p.locator('[data-revelacion-accion="profanador"] .config-accion-fila');
 const posiciones=await fila.locator('select,input').evaluateAll(es=>es.map(e=>({top:e.getBoundingClientRect().top,left:e.getBoundingClientRect().left})));
 assert.ok(Math.abs(posiciones[0].top-posiciones[1].top)<2,'Modo y porcentaje en la misma fila en tablet');
 await p.locator('[name="revelacion-nigromantes-profanador-probabilidad"]').fill('37');
 await p.locator('[name="especial-modo"]').selectOption('probabilidad');
 await p.locator('#config-seccion-general .config-info').first().click();assert.equal(await p.locator('.config-globo:visible').count(),1);
 await p.getByRole('tab',{name:'Apariencia',exact:true}).click();assert.equal(await p.locator('.config-globo:visible').count(),0);
 assert.equal(await p.evaluate(()=>localStorage.getItem('white-death-gestor-v2')),bytes,'Abrir/editar no guarda hasta confirmar');
 // El perfil inicial no tiene candidatos especiales: volver a directo antes de guardar.
 await p.getByRole('tab',{name:'Mazos',exact:true}).click();
 await p.locator('[name="especial-modo"]').selectOption('directo');
 await p.getByRole('tab',{name:'Apariencia',exact:true}).click();
 await mkdir('docs/verificacion',{recursive:true});await p.screenshot({path:'docs/verificacion/configuracion-apariencia-filas.png'});
 await p.getByRole('tab',{name:'Mazos',exact:true}).click();await p.locator('#regla-nigromantes').scrollIntoViewIfNeeded();await p.screenshot({path:'docs/verificacion/configuracion-nigromantes-filas.png'});
 await p.locator('#save-settings').click();assert.ok(await p.locator('#settings-dialog').isHidden());
 const guardado=await p.evaluate(()=>JSON.parse(localStorage.getItem('white-death-gestor-v2')));assert.equal(guardado.proximaConfig.revelacionEnemigos.nigromantes.profanador.probabilidad,37);
 await p.reload();await p.locator('[data-action="settings"]').click();await p.getByRole('tab',{name:'Mazos',exact:true}).click();assert.equal(await p.locator('[name="revelacion-nigromantes-profanador-probabilidad"]').inputValue(),'37');
 assert.deepEqual(errores,[]);console.log('Configuración: cinco tamaños, cuatro pestañas, ayudas/Escape, sin desborde, modo/porcentaje alineados, reposición condicional, guardado y recarga.');
 await ctx.close();
}finally{await navegador.close();}
