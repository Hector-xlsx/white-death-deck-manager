import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,pinCard,unpinCard,replaceCard,discardCard,addZoneCard,elegirAbominacion,elegirNigromante,regenerarNigromante,anularTanda,puedeAnularTanda,isValid} from '../dist/engine.js';
import {KEY,guardarAccion,recuperar} from '../dist/persistencia.js';
const sinRespaldo=s=>{const copia=structuredClone(s);copia.respaldoTanda=null;copia.openBatch=false;return copia;};
const rng=valores=>()=>valores.shift()??.99;
function almacen(s){let bytes=JSON.stringify(s);return{getItem:()=>bytes,setItem:(k,v)=>{bytes=v;}};}

test('anular primera tanda restaura exactamente antes de SPAWN y cierra Aparicion',()=>{
 const s=newGame(),antes=structuredClone(s);spawn(s,()=>.99);
 assert.ok(puedeAnularTanda(s));anularTanda(s);assert.deepEqual(s,antes);assert.ok(isValid(s));
 assert.equal(puedeAnularTanda(s),false);assert.throws(()=>anularTanda(s));
});
test('devuelve originales, reemplazos, descartes y cartas adicionales; revierte reinicios',()=>{
 const s=newGame({easy:true,normal:true,threshold:99},2),antes=structuredClone(s);
 spawn(s,()=>.99);replaceCard(s,1,0,()=>.99);discardCard(s,1,1);addZoneCard(s,1,'normal',()=>.99);
 assert.ok(s.cycle>antes.cycle);anularTanda(s);assert.deepEqual(s,antes);
});
test('restaura fijados, desfijados y modificaciones de tandas previas durante la ultima',()=>{
 const s=newGame();spawn(s,()=>.99);
 pinCard(s,s.history[0].slots[0].draws[0]);pinCard(s,s.history[0].slots[1].draws[0]);
 unpinCard(s,s.pins[1].uid);s.openBatch=false;
 const antes=sinRespaldo(s);spawn(s,()=>.99);
 unpinCard(s,s.pins[0].uid);pinCard(s,s.history[1].slots[0].draws[0]);
 s.normal=8;s.config.threshold=77;s.proximaConfig.easy=false;
 anularTanda(s);assert.deepEqual(s,antes);assert.ok(isValid(s));
});
test('anula nigromante, su zona derivada y abominacion fijados automaticamente',()=>{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion'],modoNigromantes:'sin-reposicion'},2);
 const antes=structuredClone(s);spawn(s,rng([0,0,.99,0,.99]));
 assert.equal(s.necro,1);assert.equal(s.pins.length,2);
 elegirAbominacion(s,s.history[0].slots.find(t=>t.id==='t1-z2').draws[0].uid,'spawn',()=>0);
 const derivada=s.history[0].slots.find(t=>t.kind==='derivada');
 replaceCard(s,1,derivada.id,()=>0);
 elegirNigromante(s,derivada.draws.at(-1).uid,'spawn',()=>0);
 regenerarNigromante(s,s.pins.find(c=>c.mazo==='nigromantes').uid,()=>0);
 assert.ok(isValid(s));anularTanda(s);assert.deepEqual(s,antes);assert.ok(isValid(s));
});
test('legado v1: restaura el agotamiento de los tres mazos en ambos modos secundarios',()=>{
 for(const modo of ['sin-reposicion','con-reposicion'])for(const [tipo,mazo,elegir] of [['abominacion','abominaciones',elegirAbominacion],['nigromante','nigromantes',elegirNigromante]]){
  const s=newGame({easy:true,normal:true,threshold:99,selectedIds:[tipo],modoNigromantes:modo,modoAbominaciones:modo},1);
  s[mazo].version=1;
  const revelar=()=>{const b=spawn(s,()=>0),c=b.slots[0].draws[0];if((c.resolucionAbominacion||c.resolucionNigromante)==='pendiente')elegir(s,c.uid,'spawn',()=>0);};
  const previas=modo==='sin-reposicion'?s[mazo].cartas.length-1:2;
  for(let i=0;i<previas;i++)revelar();
  s.openBatch=false;const antes=sinRespaldo(s);assert.ok(isValid(s));revelar();
  assert.ok(s.cycle>antes.cycle);
  if(modo==='sin-reposicion')assert.equal(s[mazo].cycle,antes[mazo].cycle+1);
  anularTanda(s);assert.deepEqual(s,antes);assert.ok(isValid(s));
 }
});
test('solo un respaldo, no recursivo: despues de anular no se puede anular la anterior',()=>{
 const s=newGame();spawn(s,()=>.99);s.openBatch=false;spawn(s,()=>.99);
 assert.equal(s.respaldoTanda.numero,2);assert.equal(Object.hasOwn(s.respaldoTanda.estado,'respaldoTanda'),false);
 assert.equal(puedeAnularTanda(s,1),false);assert.throws(()=>anularTanda(s,1));
 anularTanda(s,2);assert.equal(s.history.length,1);assert.equal(puedeAnularTanda(s),false);
 spawn(s,()=>.99);assert.equal(puedeAnularTanda(s,2),true);
});
test('recuperacion conserva respaldo sin sortear y permite anular tras cerrar la vista',()=>{
 const s=newGame(),antes=structuredClone(s),a=almacen(s);
 let actual=guardarAccion(s,n=>spawn(n,()=>.99),a);
 actual=guardarAccion(actual,n=>n.openBatch=false,a);
 const recuperado=recuperar(a);assert.deepEqual(recuperado,actual);
 actual=guardarAccion(recuperado,n=>anularTanda(n),a);assert.deepEqual(actual,antes);assert.deepEqual(recuperar(a),antes);
});
test('cuota fallida conserva tanda, referencias, mazos y respaldo intactos',()=>{
 const s=newGame();spawn(s,()=>.99);const antes=structuredClone(s);
 const a={setItem(){throw new Error('QuotaExceededError');}};
 assert.throws(()=>guardarAccion(s,n=>anularTanda(n),a));assert.deepEqual(s,antes);
});
test('pestana desactualizada no anula ni sobrescribe la nueva tanda',()=>{
 const s=newGame();spawn(s,()=>.99);const a=almacen(s),bytes=a.getItem(KEY);
 const nuevo=guardarAccion(s,n=>spawn(n,()=>.99),a);
 assert.throws(()=>guardarAccion(s,n=>anularTanda(n),a,{esperado:bytes}),e=>e.code==='PARTIDA_CAMBIADA');
 assert.deepEqual(recuperar(a),nuevo);
});
test('guardado antiguo se conserva sin respaldo ficticio y admite anular su siguiente tanda',()=>{
 const s=newGame();spawn(s,()=>.99);delete s.respaldoTanda;s.openBatch=false;
 const a=almacen(s),recuperado=recuperar(a);assert.deepEqual(recuperado,s);assert.equal(puedeAnularTanda(recuperado),false);
 spawn(recuperado,()=>.99);anularTanda(recuperado);assert.deepEqual(recuperado,sinRespaldo(s));
});
test('rechaza respaldos corruptos, anidados, de otra tanda o estado invalido sin borrar bytes',()=>{
 const s=newGame();spawn(s,()=>.99);
 for(const mutar of [n=>n.respaldoTanda.numero=2,n=>n.respaldoTanda.estado.normal=-1,n=>n.respaldoTanda.estado.history=s.history,n=>n.respaldoTanda.estado.respaldoTanda=null,n=>n.respaldoTanda.estado.version=1]){
  const roto=structuredClone(s);mutar(roto);assert.equal(isValid(roto),false);
  const a=almacen(roto),bytes=a.getItem(KEY);assert.throws(()=>recuperar(a));assert.equal(a.getItem(KEY),bytes);
 }
});
test('SPAWN con cero zonas no sustituye ni crea un respaldo',()=>{
 const s=newGame(undefined,0),antes=structuredClone(s);assert.equal(spawn(s),null);assert.deepEqual(s,antes);
});
