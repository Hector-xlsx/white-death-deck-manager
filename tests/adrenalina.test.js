import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,replaceCard,elegirNigromante,anularTanda,isValid} from '../dist/engine.js';
import {nivelAdrenalina,cambiarNivelAdrenalina} from '../dist/adrenalina.js';
import {migrarEstado} from '../dist/estado.js';
import {KEY,recuperar,guardarAccion} from '../dist/persistencia.js';
const cerrar=s=>{s.openBatch=false;};
function almacen(s){let bytes=JSON.stringify(s);return {getItem:()=>bytes,setItem:(k,v)=>{bytes=v;}};}

test('adrenalina: partida nueva en Azul, avance y retroceso sin saltar los extremos',()=>{
 const s=newGame();assert.equal(nivelAdrenalina(s),'azul');
 cambiarNivelAdrenalina(s,-1);assert.equal(s.nivelAdrenalina,'azul');
 for(const nivel of ['amarillo','naranja','rojo']){cambiarNivelAdrenalina(s,1);assert.equal(s.nivelAdrenalina,nivel);}
 cambiarNivelAdrenalina(s,1);assert.equal(s.nivelAdrenalina,'rojo');
 cambiarNivelAdrenalina(s,-1);assert.equal(s.nivelAdrenalina,'naranja');
 assert.equal(newGame(s.config).nivelAdrenalina,'azul');assert.ok(isValid(s));
});
test('adrenalina: cambiar nivel no consume mazos ni modifica historial o contadores',()=>{
 const s=newGame();spawn(s,()=>.99);cerrar(s);const antes=structuredClone(s);
 cambiarNivelAdrenalina(s,1);assert.deepEqual({...s,nivelAdrenalina:antes.nivelAdrenalina},antes);
 assert.throws(()=>cambiarNivelAdrenalina(s,0));assert.ok(isValid(s));
});
test('adrenalina: SPAWN conserva el nivel y lo congela en cada tanda, sin incremento automatico',()=>{
 const s=newGame();cambiarNivelAdrenalina(s,1);spawn(s,()=>.99);
 assert.equal(s.nivelAdrenalina,'amarillo');assert.equal(s.history[0].nivelAdrenalina,'amarillo');
 assert.throws(()=>cambiarNivelAdrenalina(s,1));cerrar(s);cambiarNivelAdrenalina(s,1);
 assert.equal(s.history[0].nivelAdrenalina,'amarillo');spawn(s,()=>.99);
 assert.equal(s.history[1].nivelAdrenalina,'naranja');assert.equal(s.nivelAdrenalina,'naranja');assert.ok(isValid(s));
});
test('adrenalina: elecciones tardias, cadenas y regeneracion mantienen el nivel de su tanda',()=>{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','asedio'],modoNigromantes:'sin-reposicion'},1);
 cambiarNivelAdrenalina(s,1);spawn(s,()=>0);cerrar(s);cambiarNivelAdrenalina(s,1);
 const b=s.history[0],derivada=b.slots.find(t=>t.kind==='derivada');
 elegirNigromante(s,derivada.draws[0].uid,'spawn',()=>0);
 replaceCard(s,1,derivada.id,()=>.99);
 assert.equal(b.nivelAdrenalina,'amarillo');assert.equal(s.nivelAdrenalina,'naranja');assert.ok(isValid(s));
});
test('adrenalina: anular restaura el nivel previo a SPAWN incluso tras cambiarlo al cerrar',()=>{
 const s=newGame();cambiarNivelAdrenalina(s,1);const antes=structuredClone(s);
 spawn(s,()=>.99);cerrar(s);cambiarNivelAdrenalina(s,1);anularTanda(s);
 assert.deepEqual(s,antes);assert.equal(s.nivelAdrenalina,'amarillo');
});
test('adrenalina: recarga guarda el nivel y fallo de cuota revierte la accion completa',()=>{
 const s=newGame(),a=almacen(s),siguiente=guardarAccion(s,n=>cambiarNivelAdrenalina(n,1),a);
 assert.deepEqual(recuperar(a),siguiente);assert.equal(recuperar(a).nivelAdrenalina,'amarillo');
 const antes=structuredClone(siguiente),bytes=a.getItem(KEY);
 assert.throws(()=>guardarAccion(siguiente,n=>cambiarNivelAdrenalina(n,1),{setItem(){throw new Error('QuotaExceededError');}}));
 assert.deepEqual(siguiente,antes);assert.equal(a.getItem(KEY),bytes);
});
test('adrenalina: partidas anteriores usan Azul sin inventar niveles historicos ni cambiar bytes',()=>{
 const s=newGame();spawn(s,()=>.99);cerrar(s);
 delete s.nivelAdrenalina;delete s.history[0].nivelAdrenalina;delete s.respaldoTanda.estado.nivelAdrenalina;
 const antes=structuredClone(s),a=almacen(s),bytes=a.getItem(KEY),r=recuperar(a);
 assert.equal(nivelAdrenalina(r),'azul');assert.deepEqual(r,antes);assert.equal(a.getItem(KEY),bytes);
 spawn(r,()=>.99);assert.equal(r.history[1].nivelAdrenalina,'azul');assert.equal(r.history[0].nivelAdrenalina,undefined);
 anularTanda(r);assert.deepEqual(r,{...antes,respaldoTanda:null});assert.ok(isValid(r));
});
test('adrenalina: rechaza valores corruptos en partida, tanda y respaldo sin alterar el original',()=>{
 const s=newGame();spawn(s,()=>.99);
 for(const cambiar of [n=>n.nivelAdrenalina='verde',n=>n.nivelAdrenalina=null,n=>n.history[0].nivelAdrenalina=2,n=>n.respaldoTanda.estado.nivelAdrenalina='rojo<script>']){
  const roto=structuredClone(s);cambiar(roto);const antes=structuredClone(roto);
  assert.equal(isValid(roto),false);assert.throws(()=>migrarEstado(roto));assert.deepEqual(roto,antes);
 }
});
