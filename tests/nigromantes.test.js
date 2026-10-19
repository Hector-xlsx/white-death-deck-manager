import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,discardCard,replaceCard,addZoneCard,pinCard,unpinCard,total,isValid,elegirNigromante,regenerarNigromante,elegirAbominacion} from '../dist/engine.js';
import {CARTAS_NIGROMANTES,contarNigromantes} from '../dist/nigromantes.js';
import {extraccionesSecundarias} from '../dist/secundarios.js';
import {guardarAccion,recuperar,KEY} from '../dist/persistencia.js';
const partida=(modo='sin-reposicion',zonas=1)=>newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante'],modoNigromantes:modo},zonas);
const raiz=s=>s.history.at(-1).slots.find(t=>t.kind==='normal');
const origen=s=>raiz(s).draws.at(-1);
const enemigo=s=>origen(s).nigromantes.at(-1);
const derivada=(s,n=enemigo(s))=>s.history.at(-1).slots.find(t=>t.id===n.spawnSlotId);

test('catalogo operativo: once nigromantes, una identidad por recurso y Death Notes seleccionable',()=>{
 assert.equal(CARTAS_NIGROMANTES.length,11);assert.equal(new Set(CARTAS_NIGROMANTES.map(c=>c.id)).size,11);
 assert.ok(CARTAS_NIGROMANTES.every(c=>c.image.startsWith('recursos/03 - Mazo Nigromante ESP/')));
 const s=partida();assert.equal(s.necro,0);assert.ok(isValid(s));
});
test('primera aparicion fija, suma exactamente una zona y roba general inmediatamente',()=>{
 const s=partida();spawn(s,()=>0);const n=enemigo(s),d=derivada(s);
 assert.equal(origen(s).cardId,'nigromante');assert.equal(origen(s).discarded,false);
 assert.equal(s.necro,1);assert.equal(s.pins[0].uid,n.uid);assert.equal(d.origenUid,n.uid);
 assert.equal(d.zone,'Zona 1-3');assert.equal(d.kind,'derivada');assert.equal(d.draws[0].resolucionNigromante,'pendiente');
 assert.equal(total(s.remaining),7);assert.equal(total(s.nigromantes.remaining),10);assert.equal(s.history[0].normal,1);assert.equal(s.history[0].necro,0);assert.ok(isValid(s));
});
test('cadena manual: nuevo nigromante genera otro robo una vez, activacion simple no consume',()=>{
 const s=partida();spawn(s,()=>0);const c=derivada(s).draws[0];
 elegirNigromante(s,c.uid,'spawn',()=>0);const despues=structuredClone(s);
 elegirNigromante(s,c.uid,'spawn',()=>{throw new Error('Robo duplicado');});assert.deepEqual(s,despues);
 assert.equal(s.necro,2);assert.equal(total(s.remaining),6);
 const otra=derivada(s,c.nigromantes[0]);assert.equal(otra.zone,'Zona 1-3-3');
 elegirNigromante(s,otra.draws[0].uid,'activacion',()=>{throw new Error('No debe robar');});
 assert.equal(s.necro,2);assert.equal(total(s.remaining),6);assert.ok(isValid(s));
});
test('nueva tanda incluye zonas de fijados al comenzar sin duplicar los robos inmediatos anteriores',()=>{
 const s=partida();spawn(s,()=>0);spawn(s,()=>0);
 const b=s.history.at(-1);assert.equal(b.slots.length,2);assert.equal(b.normal,1);assert.equal(b.necro,1);
 assert.deepEqual(b.slots.map(t=>t.zone),['Zona 1','Nigromante 1']);assert.equal(total(s.remaining),5);assert.equal(s.necro,1);assert.ok(isValid(s));
});
test('fijar, desfijar y refijar mantiene igualdad exacta y no repite la aparicion ni devuelve cartas',()=>{
 const s=partida();spawn(s,()=>0);const n=enemigo(s),restantes={...s.remaining};
 pinCard(s,n);assert.equal(s.necro,1);unpinCard(s,n.uid,false);assert.equal(s.necro,0);unpinCard(s,n.uid,true);assert.equal(s.necro,0);
 pinCard(s,n);pinCard(s,n);assert.equal(s.necro,1);assert.deepEqual(s.remaining,restantes);assert.equal(total(s.nigromantes.remaining),10);assert.ok(isValid(s));
});
test('genericamente fijado cuenta solo si valido; referencia descartada no modifica contador',()=>{
 const s=partida();spawn(s,()=>0);pinCard(s,origen(s));assert.equal(s.necro,2);
 discardCard(s,1,raiz(s).id);assert.equal(s.necro,0);pinCard(s,origen(s));assert.equal(s.necro,0);assert.equal(contarNigromantes(s),0);assert.ok(isValid(s));
});
test('cancelar origen anula toda su cadena, devuelve secundarios y deja generales consumidas',()=>{
 const s=partida();spawn(s,()=>0);elegirNigromante(s,derivada(s).draws[0].uid,'spawn',()=>0);
 const generales={...s.remaining},uid=enemigo(s).uid;discardCard(s,1,raiz(s).id);discardCard(s,1,raiz(s).id);
 assert.equal(s.necro,0);assert.equal(s.pins.length,0);assert.equal(total(s.nigromantes.remaining),11);assert.deepEqual(s.remaining,generales);
 assert.ok(s.history[0].slots.filter(t=>t.kind==='derivada').every(t=>t.anulada));
 regenerarNigromante(s,uid,()=>{throw new Error('No debe robar anulada');});assert.ok(isValid(s));
});
test('cancelar una raiz preserva completamente los otros orígenes y sus aportes',()=>{
 const s=partida('sin-reposicion',2);spawn(s,()=>0);
 const otra=s.history[0].slots.find(t=>t.id==='t1-z2');elegirNigromante(s,otra.draws[0].uid,'spawn',()=>0);
 const copia=structuredClone(otra),n=otra.draws[0].nigromantes[0],d=structuredClone(derivada(s,n));
 elegirNigromante(s,derivada(s).draws[0].uid,'spawn',()=>0);assert.equal(s.necro,3);
 discardCard(s,1,'t1-z1');assert.equal(s.necro,1);assert.deepEqual(otra,copia);assert.deepEqual(derivada(s,n),d);assert.equal(s.pins[0].uid,n.uid);assert.ok(isValid(s));
});
test('regenerar secundaria devuelve anterior y anula su spawn; conserva origen y roba una nueva general',()=>{
 const s=partida();spawn(s,()=>0);const anterior=enemigo(s),vieja=derivada(s);
 regenerarNigromante(s,anterior.uid,()=>0);
 assert.equal(anterior.anulada,true);assert.equal(vieja.anulada,true);assert.equal(origen(s).discarded,false);
 assert.equal(enemigo(s).cardId,anterior.cardId);assert.equal(s.necro,1);assert.equal(total(s.remaining),6);assert.equal(total(s.nigromantes.remaining),10);assert.ok(isValid(s));
});
test('regenerar origen consume nueva general y su spawn sin conservar enemigo anterior',()=>{
 const s=partida();spawn(s,()=>0);const anterior=enemigo(s);replaceCard(s,1,raiz(s).id,()=>0);
 assert.equal(anterior.anulada,true);assert.equal(raiz(s).draws[0].discarded,true);
 assert.equal(s.necro,1);assert.equal(total(s.remaining),5);assert.equal(total(s.nigromantes.remaining),10);assert.ok(isValid(s));
});
test('derivada abominacion integra su mazo; cancelar nigromante devuelve y desfija ambos tipos',()=>{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion'],modoNigromantes:'sin-reposicion'},1);
 const az=[0,0,0.8,0];spawn(s,()=>az.shift());
 assert.equal(derivada(s).draws[0].cardId,'abominacion');assert.equal(s.pins.length,2);assert.equal(total(s.abominaciones.remaining),19);
 const antes={...s.remaining};discardCard(s,1,raiz(s).id);
 assert.equal(total(s.abominaciones.remaining),20);assert.equal(total(s.nigromantes.remaining),11);assert.equal(s.necro,0);assert.equal(s.pins.length,0);assert.deepEqual(s.remaining,antes);assert.ok(isValid(s));
});
test('un spawn de nigromante puede descartarse/regenerarse sin quitar su padre ni duplicar aportes',()=>{
 const s=partida();spawn(s,()=>0);const d=derivada(s),uid=d.draws[0].uid;
 elegirNigromante(s,uid,'spawn',()=>0);assert.equal(s.necro,2);
 discardCard(s,1,d.id);assert.equal(s.necro,1);assert.equal(enemigo(s).anulada,false);
 replaceCard(s,1,d.id,()=>0);assert.equal(d.draws.at(-1).resolucionNigromante,'pendiente');assert.equal(s.necro,1);assert.ok(isValid(s));
});
test('legado v1: con reposicion repite identidad manteniendo dos fijados; sin reposicion reinicia al agotar',()=>{
 const s=partida('con-reposicion');s.nigromantes.version=1;spawn(s,()=>0);elegirNigromante(s,derivada(s).draws[0].uid,'spawn',()=>0);
 assert.equal(s.pins[0].cardId,s.pins[1].cardId);assert.equal(total(s.nigromantes.remaining),11);assert.equal(s.necro,2);assert.ok(isValid(s));
 const n=partida();n.nigromantes.version=1;n.nigromantes.cartas=n.nigromantes.cartas.slice(0,2);n.nigromantes.remaining=Object.fromEntries(n.nigromantes.cartas.map(c=>[c.id,1]));
 spawn(n,()=>0);elegirNigromante(n,derivada(n).draws[0].uid,'spawn',()=>0);
 assert.notEqual(n.pins[0].cardId,n.pins[1].cardId);assert.equal(n.nigromantes.cycle,2);assert.equal(total(n.nigromantes.remaining),2);assert.ok(isValid(n));
});
test('reinicio general dentro del robo inmediato conserva la cadena y no reinicia secundarios',()=>{
 const s=partida();s.config.threshold=99;spawn(s,()=>0);
 assert.equal(s.cycle,3);assert.equal(origen(s).cycle,1);assert.equal(derivada(s).draws[0].cycle,2);
 assert.equal(s.nigromantes.cycle,1);assert.equal(total(s.nigromantes.remaining),10);assert.equal(s.necro,1);assert.ok(isValid(s));
});
test('ajustes manuales verdes no permitidos en el motor nuevo; zonas normales siguen funcionando',()=>{
 const s=partida();spawn(s,()=>0);const antes=structuredClone(s);assert.throws(()=>addZoneCard(s,1,'necro',()=>0));assert.deepEqual(s,antes);
 addZoneCard(s,1,'normal',()=>0);assert.equal(s.normal,2);assert.equal(s.necro,1);assert.ok(isValid(s));
});
test('recuperacion mantiene cadena pendiente; cuota fallida revierte selección, contador y robos juntos',()=>{
 const s=partida();spawn(s,()=>0);const bytes=JSON.stringify(s),almacen={getItem:k=>k===KEY?bytes:null,setItem(){throw new Error('Sin espacio');}};
 assert.deepEqual(recuperar(almacen),s);
 assert.throws(()=>guardarAccion(s,n=>elegirNigromante(n,derivada(n).draws[0].uid,'spawn',()=>0),almacen,{esperado:bytes}));assert.equal(JSON.stringify(s),bytes);
});
test('validacion rechaza contador desincronizado, arbol roto, duplicados y ciclos',()=>{
 const s=partida();spawn(s,()=>0);
 for(const mutar of [
  n=>n.necro=2,
  n=>enemigo(n).spawnSlotId='inexistente',
  n=>derivada(n).origenUid=999,
  n=>derivada(n).zone='Zona equivocada',
  n=>derivada(n).anulada=true,
  n=>enemigo(n).uid=origen(n).uid,
  n=>n.history[0].slots.reverse(),
  n=>n.nigromantes.remaining[enemigo(n).cardId]=1,
  n=>n.nigromantes.modo='otro'
 ]){const copia=structuredClone(s);mutar(copia);assert.equal(isValid(copia),false);}
});
test('partida anterior sin nigromantes mantiene sus contadores manuales y no genera enemigos retroactivos',()=>{
 const s=newGame(undefined,1,2);spawn(s,()=>0);assert.equal(s.nigromantes,undefined);assert.equal(s.necro,2);
 assert.equal(extraccionesSecundarias(s,'nigromantes').length,0);assert.ok(isValid(s));
});
