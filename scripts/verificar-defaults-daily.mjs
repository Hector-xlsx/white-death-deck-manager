import {abrirSeccionesConfiguracion} from './ayuda-configuracion.mjs';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url),{chromium}=require(process.env.MAZO_PLAYWRIGHT||'playwright');
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const ctx=await browser.newContext({viewport:{width:1024,height:768}}),p=await ctx.newPage();await p.goto(process.env.MAZO_URL||'http://127.0.0.1:8080/mazo/');await p.getByRole('button',{name:'Configuración',exact:true}).click();await abrirSeccionesConfiguracion(p,'Mazos',['general','daily']);
 for(const [nivel,base,incremento] of [['azul',5,1],['amarillo',8,2],['naranja',12,3],['rojo',15,4]]){assert.equal(await p.locator(`[name="dailyBase-${nivel}"]`).inputValue(),String(base));assert.equal(await p.locator(`[name="dailyIncremento-${nivel}"]`).inputValue(),String(incremento));}
 assert.equal(await p.locator('#threshold').inputValue(),'20');assert.equal(await p.locator('[name="dailyHabilitado"]').isChecked(),false);await p.locator('[name="dailyHabilitado"]').check();await p.locator('[name="dailyBase-azul"]').fill('19');await p.locator('#save-settings').click();await p.getByRole('button',{name:'Configuración',exact:true}).click();await abrirSeccionesConfiguracion(p,'Mazos',['general','daily']);assert.equal(await p.locator('[name="dailyBase-azul"]').inputValue(),'19');await p.locator('#settings-dialog .close-button').click();
 await p.locator('#offline-status').filter({hasText:'Disponible offline'}).waitFor({timeout:90000});await ctx.setOffline(true);await p.reload();await p.getByRole('button',{name:'Configuración',exact:true}).click();await abrirSeccionesConfiguracion(p,'Mazos',['general','daily']);assert.equal(await p.locator('[name="dailyBase-azul"]').inputValue(),'19');assert.equal(await p.locator('[name="dailyBase-rojo"]').inputValue(),'15');await ctx.close();console.log('Daily inicial: cuatro perfiles correctos, habilitación sin cambio, edición conservada al reabrir y recarga offline verificados.');
}finally{await browser.close();}
