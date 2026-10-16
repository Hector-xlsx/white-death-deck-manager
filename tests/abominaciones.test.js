import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,discardCard,replaceCard,addZoneCard,pinCard,unpinCard,isValid,total,elegirAbominacion,regenerarAbominacion} from '../dist/engine.js';
import {presenciaAbominacion,extraccionesAbominaciones,CARTAS_ABOMINACIONES} from '../dist/abominaciones.js';
import {guardarAccion,recuperar,KEY} from '../dist/persistencia.js';
const partida=(modo='sin-reposicion',zonas=1)=>newGame({easy:true,normal:true,threshold:0,selectedIds:['abominacion'],modoAbominaciones:modo},zonas);
const origen=s=>s.history.at(-1).slots[0].draws.at(-1);
const secundaria=s=>origen(s).abominaciones.at(-1);
function mazoPequeno(s){s.abominaciones.cartas=s.abominaciones.cartas.slice(0,2);s.abominaciones.remaining=Object.fromEntries(s.abominaciones.cartas.map(c=>[c.id,1]));return s;}

test('catalogo operativo tiene 20 identidades, Kijin una sola vez y ninguna regla especial automatica',()=>{
 assert.equal(CARTAS_ABOMINACIONES.length,20);
 assert.equal(CARTAS_ABOMINACIONES.filter(c=>c.id==='enemigo-kijin').length,1);
 assert.ok(CARTAS_ABOMINACIONES.every(c=>c.image.startsWith('recursos/04 - Mazo Abominaciones ESP/')));
});
test('primera abominacion mantiene origen y crea secundaria auto-fijada en la misma zona',()=>{
 const s=partida();spawn(s,()=>0);
 assert.equal(s.history[0].slots.length,1);assert.equal(s.normal,1);assert.equal(s.necro,0);
 assert.equal(origen(s).cardId,'abominacion');assert.equal(origen(s).discarded,false);
 assert.equal(secundaria(s).origenUid,origen(s).uid);assert.equal(s.pins[0].uid,secundaria(s).uid);
 assert.equal(total(s.remaining),5);assert.equal(total(s.abominaciones.remaining),19);
 assert.ok(presenciaAbominacion(s));assert.ok(isValid(s));
});
test('tanda resuelve en orden: solo la primera genera automaticamente; elecciones idempotentes',()=>{
 const s=partida('sin-reposicion',3);spawn(s,()=>0);
 const cartas=s.history[0].slots.map(t=>t.draws[0]);
 assert.equal(cartas[0].resolucionAbominacion,'spawn');assert.equal(cartas[1].resolucionAbominacion,'pendiente');assert.equal(cartas[2].resolucionAbominacion,'pendiente');
 let robos=0;elegirAbominacion(s,cartas[1].uid,'activacion',()=>{robos++;return 0;});
 elegirAbominacion(s,cartas[1].uid,'spawn',()=>{robos++;return 0;});assert.equal(robos,0);
 elegirAbominacion(s,cartas[2].uid,'spawn',()=>{robos++;return 0;});
 elegirAbominacion(s,cartas[2].uid,'spawn',()=>{robos++;return 0;});assert.equal(robos,1);
 assert.equal(s.pins.length,2);assert.equal(total(s.abominaciones.remaining),18);assert.equal(total(s.remaining),3);assert.ok(isValid(s));
});
test('legado v1: sin reposicion agota y reinicia siempre; general y secundario son independientes',()=>{
 const s=mazoPequeno(partida());s.abominaciones.version=1;spawn(s,()=>0);unpinCard(s,secundaria(s).uid);
 const primera=secundaria(s).cardId;spawn(s,()=>0);
 assert.notEqual(secundaria(s).cardId,primera);assert.equal(secundaria(s).cycle,1);
 assert.equal(s.abominaciones.cycle,2);assert.equal(total(s.abominaciones.remaining),2);
 unpinCard(s,secundaria(s).uid);spawn(s,()=>0);assert.equal(secundaria(s).cardId,primera);assert.equal(secundaria(s).cycle,2);
 assert.equal(s.cycle,1);assert.ok(isValid(s));
});
test('legado v1: con reposicion permite volver a seleccionar la misma identidad incluso fijada',()=>{
 const s=partida('con-reposicion');s.abominaciones.version=1;spawn(s,()=>0);const primera=secundaria(s).cardId;
 spawn(s,()=>0);elegirAbominacion(s,origen(s).uid,'spawn',()=>0);
 assert.equal(secundaria(s).cardId,primera);assert.equal(s.pins.length,2);
 assert.equal(total(s.abominaciones.remaining),20);assert.ok(isValid(s));
});
test('descartar origen devuelve secundaria, desfija y conserva consumo general; repetir no duplica',()=>{
 const s=partida();spawn(s,()=>0);const c=secundaria(s),antes={...s.remaining};
 discardCard(s,1,'t1-z1');discardCard(s,1,'t1-z1');
 assert.equal(c.anulada,true);assert.equal(s.pins.length,0);assert.equal(s.unpinned.length,1);
 assert.equal(total(s.abominaciones.remaining),20);assert.deepEqual(s.remaining,antes);
 pinCard(s,c);assert.equal(s.pins.length,0);assert.equal(presenciaAbominacion(s),false);assert.ok(isValid(s));
});
test('regenerar origen devuelve anterior y consume un nuevo spawn; anula solo su descendiente',()=>{
 const s=partida('sin-reposicion',2);spawn(s,()=>0);
 elegirAbominacion(s,s.history[0].slots[1].draws[0].uid,'spawn',()=>0);
 const anterior=secundaria(s),otro=s.pins[1];replaceCard(s,1,'t1-z1',()=>0);
 assert.equal(anterior.anulada,true);assert.equal(origen(s).resolucionAbominacion,'pendiente');
 assert.deepEqual(s.pins.map(c=>c.uid),[otro.uid]);assert.equal(s.abominaciones.remaining[anterior.cardId],1);
 assert.equal(total(s.remaining),3);assert.ok(isValid(s));
});
test('regenerar secundaria devuelve la anterior antes de sortear, puede salir la misma, no toca general',()=>{
 const s=partida();spawn(s,()=>0);const c=secundaria(s),restantes={...s.remaining};
 regenerarAbominacion(s,c.uid,()=>0);regenerarAbominacion(s,c.uid,()=>{throw new Error('No debe robar');});
 assert.equal(c.anulada,true);assert.equal(secundaria(s).cardId,c.cardId);
 assert.equal(s.pins.length,1);assert.equal(s.unpinned.length,1);assert.equal(total(s.abominaciones.remaining),19);
 assert.deepEqual(s.remaining,restantes);assert.ok(isValid(s));
});
test('legado v1: cancelar el robo que agotaba restaura la carta y revierte el reinicio sin robos posteriores',()=>{
 const s=mazoPequeno(partida());s.abominaciones.version=1;spawn(s,()=>0);unpinCard(s,secundaria(s).uid);spawn(s,()=>0);
 assert.equal(s.abominaciones.cycle,2);const c=secundaria(s);discardCard(s,2,'t2-z1');
 assert.equal(s.abominaciones.cycle,1);assert.equal(total(s.abominaciones.remaining),1);assert.equal(s.abominaciones.remaining[c.cardId],1);assert.ok(isValid(s));
});
test('legado v1: anular una extraccion de ciclo anterior no devuelve una copia ocupada por otro origen vigente',()=>{
 const s=mazoPequeno(partida('sin-reposicion',3));s.abominaciones.version=1;spawn(s,()=>0);
 const [a,b,c]=s.history[0].slots.map(t=>t.draws[0]);
 elegirAbominacion(s,b.uid,'spawn',()=>0);elegirAbominacion(s,c.uid,'spawn',()=>0);
 assert.equal(a.abominaciones[0].cardId,c.abominaciones[0].cardId);assert.equal(s.abominaciones.cycle,2);
 discardCard(s,1,'t1-z1');assert.equal(s.abominaciones.remaining[c.abominaciones[0].cardId],0);
 assert.equal(c.abominaciones[0].anulada,false);assert.equal(s.pins.length,2);assert.ok(isValid(s));
});
test('desfijar quita presencia sin devolver consumo; una generica valida fijada tambien cuenta',()=>{
 const s=partida();spawn(s,()=>0);unpinCard(s,secundaria(s).uid);
 assert.equal(presenciaAbominacion(s),false);assert.equal(total(s.abominaciones.remaining),19);
 pinCard(s,origen(s));assert.equal(presenciaAbominacion(s),true);
 discardCard(s,1,'t1-z1');pinCard(s,origen(s));assert.equal(presenciaAbominacion(s),false);assert.ok(isValid(s));
});
test('zona añadida resuelve abominacion sin añadir otra zona por el enemigo',()=>{
 const s=partida();spawn(s,()=>0);unpinCard(s,secundaria(s).uid);addZoneCard(s,1,'normal',()=>0);
 assert.equal(s.normal,2);assert.equal(s.history[0].slots.length,2);assert.equal(s.pins.length,1);assert.ok(isValid(s));
});
test('recuperacion no sortea, guarda eleccion y anulaciones; cuota fallida conserva todo',()=>{
 const s=partida('sin-reposicion',2);spawn(s,()=>0);elegirAbominacion(s,s.history[0].slots[1].draws[0].uid,'activacion');
 const bytes=JSON.stringify(s),almacen={getItem:()=>bytes,setItem(){throw new Error('Sin espacio');}};
 assert.deepEqual(recuperar(almacen),s);
 assert.throws(()=>guardarAccion(s,n=>regenerarAbominacion(n,secundaria(n).uid,()=>0),almacen,{esperado:bytes}));
 assert.equal(JSON.stringify(s),bytes);
});
test('partida v2 anterior mantiene composicion e historial sin activar secundarios retroactivamente',()=>{
 const s=newGame();delete s.abominaciones;const bytes=JSON.stringify(s);
 assert.ok(isValid(s));assert.equal(recuperar({getItem:k=>k===KEY?bytes:null}).abominaciones,undefined);
 spawn(s,()=>0.2);assert.equal(extraccionesAbominaciones(s).length,0);assert.ok(isValid(s));
});
test('validacion rechaza parentesco roto, IDs duplicados, anuladas fijadas y disponibilidad incorrecta',()=>{
 const s=partida();spawn(s,()=>0);
 for(const mutar of [
  n=>secundaria(n).origenUid=999,
  n=>secundaria(n).uid=origen(n).uid,
  n=>n.abominaciones.remaining[secundaria(n).cardId]=1,
  n=>secundaria(n).anulada=true,
  n=>n.abominaciones.cartas[0].image='../secreto.png',
  n=>n.abominaciones.modo='otro',
  n=>origen(n).resolucionAbominacion='activacion',
  n=>origen(n).discarded=true
 ]){const copia=structuredClone(s);mutar(copia);assert.equal(isValid(copia),false);}
});
