import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,anularTanda,programarConfiguracion,isValid,discardCard} from '../dist/engine.js';
import {regenerarEspecial} from '../dist/especial.js';
import {componer,CATALOG} from '../dist/catalogo.js';
import {cantidadEspecial,configEspecialValida,esBasicaEspecial,destinoCartaEspecial} from '../dist/especial-config.js';
import {resumenZombis} from '../dist/contador-zombis.js';
import {resumenPuntaje} from '../dist/puntaje.js';
import {guardarAccion,recuperar,KEY} from '../dist/persistencia.js';
const config={easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal','brutos-normal','brutos-facil','corredores-normal','activacion-brutos','activacion-corredor'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'};
const opciones=modo=>({modo,destinosEnDisparadores:true,base:100,destinos:{'brutos-normal':'especial','brutos-facil':'especial','activacion-brutos':'especial'},cantidades:{'corredores-normal':8}});
const crear=modo=>newGame({...config,spawnEspecial:opciones(modo)},1);
function revelar(s,id,especial){for(const k of Object.keys(s.remaining))s.remaining[k]=Number(k===id);if(especial)for(const k of Object.keys(s.especial.remaining))s.especial.remaining[k]=Number(k===especial);spawn(s,()=>0);assert.ok(isValid(s));return s.history.at(-1).slots[0].draws[0];}
test('Core configurable: nueve cartas con cantidades originales y destino general por defecto',()=>{
 const basicas=CATALOG.filter(esBasicaEspecial);assert.equal(basicas.length,9);
 for(const modo of ['disparadores','probabilidad'])for(const c of basicas){const cfg={...config,spawnEspecial:{modo}};assert.equal(destinoCartaEspecial(cfg,c),'general');assert.equal(cantidadEspecial(cfg,c),c.copies);}
});
test('Core configurable: ambos modos admiten Brutos y activación exclusivos en Especial y ocho Corredores en General',()=>{
 for(const modo of ['disparadores','probabilidad']){
  const s=crear(modo);assert.equal(s.initial['brutos-normal'],undefined);assert.equal(s.initial['brutos-facil'],undefined);assert.equal(s.initial['activacion-brutos'],undefined);assert.equal(s.initial['corredores-normal'],8);
  assert.equal(s.especial.initial['brutos-normal'],4);assert.equal(s.especial.initial['brutos-facil'],4);assert.equal(s.especial.initial['activacion-brutos'],1);assert.equal(s.especial.initial['corredores-normal'],undefined);
  s.nivelAdrenalina='amarillo';const c=revelar(s,modo==='disparadores'?'spawn-especial':'caminantes-normal','brutos-normal');assert.equal(c.especial[0].cardId,'brutos-normal');assert.equal(c.especial[0].mazo,'especial');
  assert.equal(resumenZombis(s).total,modo==='disparadores'?4:10);assert.equal(resumenPuntaje(s).total,modo==='disparadores'?16:34);
 }
});
test('Core configurable: activaciones especiales no suman zombis, variables ni puntos',()=>{
 for(const nivel of ['azul','amarillo','naranja','rojo']){
  const s=crear('disparadores');s.nivelAdrenalina=nivel;revelar(s,'spawn-especial','activacion-brutos');assert.deepEqual(resumenZombis(s),{automaticos:0,manuales:0,variables:0,total:0});assert.equal(resumenPuntaje(s).total,0);
 }
});
test('Core configurable: regeneración, descarte, cuota, recuperación y anulación conservan integridad',()=>{
 const a={valor:null,getItem(){return this.valor;},setItem(k,v){assert.equal(k,KEY);this.valor=v;}};let s=crear('disparadores');
 s=guardarAccion(s,n=>revelar(n,'spawn-especial','brutos-normal'),a);const uid=s.history[0].slots[0].draws[0].especial[0].uid;
 s=guardarAccion(s,n=>regenerarEspecial(n,uid,()=>.99),a);assert.ok(isValid(recuperar(a)));
 const bytes=JSON.stringify(s);assert.throws(()=>guardarAccion(s,n=>discardCard(n,1,0),{setItem(){throw Error('cuota');}}));assert.equal(JSON.stringify(s),bytes);
 s=guardarAccion(s,n=>discardCard(n,1,0),a);assert.equal(resumenZombis(s).total,0);
 s=guardarAccion(s,n=>anularTanda(n),a);assert.equal(s.history.length,0);assert.equal(s.registroActividad.eventos.at(-1).tipo,'tanda-anulada');assert.ok(isValid(recuperar(a)));
});
test('Core configurable: mover cartas durante partida preserva la tanda anterior y permite anular',()=>{
 const s=newGame({...config,selectedIds:[...config.selectedIds,'spawn-559'],spawnEspecial:{modo:'disparadores'}},1);revelar(s,'spawn-especial');s.openBatch=false;
 const b=structuredClone(s.history[0]);programarConfiguracion(s,{...s.proximaConfig,spawnEspecial:opciones('disparadores')});const antes=structuredClone(s);
 spawn(s,()=>0);assert.ok(isValid(s));assert.deepEqual(s.history[0],b);assert.equal(s.initial['brutos-normal'],undefined);anularTanda(s);assert.deepEqual(s,{...antes,respaldoTanda:null,openBatch:false});
});
test('Core configurable: filtros, cartas desmarcadas y motor se conservan',()=>{
 const c={...config,normal:false,spawnEspecial:opciones('disparadores')},m=componer(c);assert.equal(m['corredores-normal'],undefined);assert.equal(m['brutos-normal'],undefined);
 for(const id of ['nigromante','abominacion','asedio'])assert.equal(configEspecialValida({...config,spawnEspecial:{modo:'disparadores',destinos:{[id]:'especial'}}},CATALOG,[]),false);
 const completos={easy:true,normal:true,selectedIds:CATALOG.map(c=>c.id),spawnEspecial:{modo:'disparadores',compensar:true,cantidades:{'corredores-normal':12}}};
 assert.ok(componer(completos).nigromante>componer({...completos,spawnEspecial:{modo:'disparadores',compensar:true}}).nigromante);
});
