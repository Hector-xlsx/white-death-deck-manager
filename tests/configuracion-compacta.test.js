import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,isValid,unpinCard,programarConfiguracion,anularTanda} from '../dist/engine.js';
import {disponiblesSecundario} from '../dist/secundarios.js';
import {configContenido,resumenCaja,marcarCaja,seleccionarContenido} from '../dist/contenido.js';
import {selectorContenido} from '../dist/informacion.js';
import {guardarAccion,recuperar,KEY} from '../dist/persistencia.js';
const crear=modoDaily=>newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival',dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',selectedDailyIds:['daily-du04','daily-du05'],...(modoDaily?{modoDaily}:{})},1);
test('Daily con reposición vuelve al retirar; sin reposición conserva descarte hasta su ciclo',()=>{
 for(const modo of ['sin-reposicion','con-reposicion']){
  const s=crear(modo);spawn(s,()=>0);const p=s.pins[0];assert.ok(!disponiblesSecundario(s,'daily').some(c=>c.id===p.cardId));unpinCard(s,p.uid);
  assert.equal(disponiblesSecundario(s,'daily').some(c=>c.id===p.cardId),modo==='con-reposicion');assert.ok(isValid(s));
 }
});
test('Daily cambio de reposición se aplica la siguiente tanda y anular restaura el modo anterior',()=>{
 const s=crear();spawn(s,()=>0);unpinCard(s,s.pins[0].uid);programarConfiguracion(s,{...s.config,modoDaily:'con-reposicion'});assert.equal(s.daily.modo,'sin-reposicion');
 spawn(s,()=>0);assert.equal(s.daily.modo,'con-reposicion');assert.ok(isValid(s));anularTanda(s);assert.equal(s.daily.modo,'sin-reposicion');assert.equal(s.proximaConfig.modoDaily,'con-reposicion');assert.ok(isValid(s));
});
test('Daily reposición no duplica presentes; persiste y falla atómicamente ante cuota',()=>{
 const s=crear('con-reposicion');spawn(s,()=>0);spawn(s,()=>0);spawn(s,()=>0);assert.equal(s.pins.length,2);assert.equal(disponiblesSecundario(s,'daily').length,0);assert.ok(isValid(s));
 const m=new Map([[KEY,JSON.stringify(s)]]),store={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};const n=guardarAccion(s,x=>unpinCard(x,x.pins[0].uid),store);assert.deepEqual(recuperar(store),n);assert.throws(()=>guardarAccion(s,x=>unpinCard(x,x.pins[0].uid),{...store,setItem:()=>{throw Error('Quota');}}));assert.equal(s.pins.length,2);
 const malo=structuredClone(n);malo.config.modoDaily='otro';assert.equal(isValid(malo),false);
});
test('cajas completas, parciales, vacías y toggles solo afectan a su caja',()=>{
 const c=configContenido({easy:true,normal:true,threshold:0});const r=resumenCaja(c,'abominaciones','frozen-fortress');assert.ok(r.total>1);assert.ok(r.completa);
 const vacio=marcarCaja(c,'abominaciones','frozen-fortress',false);assert.equal(resumenCaja(vacio,'abominaciones','frozen-fortress').marcadas,0);assert.deepEqual(resumenCaja(vacio,'abominaciones','core'),resumenCaja(c,'abominaciones','core'));
 const id=c.selectedAbominacionesIds.find(id=>!vacio.selectedAbominacionesIds.includes(id));const parcial=seleccionarContenido(vacio,'abominaciones',[id],true);assert.ok(resumenCaja(parcial,'abominaciones','frozen-fortress').parcial);
 assert.ok(resumenCaja(marcarCaja(parcial,'abominaciones','frozen-fortress',true),'abominaciones','frozen-fortress').completa);
});
test('contenido contraído y consulta por carta; obligatorias y pendientes no se habilitan por caja',()=>{
 const c=configContenido({easy:true,normal:true,threshold:0});const html=selectorContenido(c,'abominaciones');assert.ok(!html.includes('<details open>'));assert.match(html,/name="caja-contenido"/);assert.match(html,/data-action="consulta-recurso"/);
 const otros=marcarCaja(c,'otros','core',false);assert.equal(resumenCaja(otros,'otros','core').completa,true);assert.equal(resumenCaja(otros,'otros','core').editable,false);
});
