import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,discardCard,isValid} from '../dist/engine.js';
import {etiquetasZonas,agruparZonas,conexionesDerivacion,rutaDerivacion} from '../dist/presentacion.js';
const crear=()=>{const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','asedio'],modoNigromantes:'sin-reposicion'},1);s.accionesPredeterminadas={nigromante:'spawn'};let valores=[0,0,0,0,.99];spawn(s,()=>valores.shift()??.99);return s;};
function items(b){const etiquetas=etiquetasZonas(b),resultado=[];function visitar(slot){for(const c of slot.draws){resultado.push({c,slot,zone:etiquetas.get(slot.id)});for(const n of c.nigromantes||[]){resultado.push({c:n,slot,zone:etiquetas.get(slot.id)});visitar(b.slots.find(t=>t.id===n.spawnSlotId));}}}for(const slot of b.slots.filter(t=>t.kind!=='derivada'))visitar(slot);return resultado;}
test('zonas: cadena anidada usa parentescos y nombres sin sufijos, sin alterar estado ni IDs',()=>{
 const s=crear(),antes=structuredClone(s),etiquetas=etiquetasZonas(s.history[0]);
 assert.deepEqual([...etiquetas.values()],['Zona 1','Zona 1 nigromante','Zona 1 nigromante 2']);assert.deepEqual(s,antes);assert.ok(isValid(s));
 assert.ok(s.history[0].slots[1].zone.endsWith('-3'));
});
test('zonas: cada grupo abarca general y enemigo, la nueva zona tiene su propio grupo',()=>{
 const s=crear(),lista=items(s.history[0]),grupos=agruparZonas(lista);
 assert.deepEqual(grupos.map(g=>g.items.length),[2,2,1]);assert.deepEqual(grupos.map(g=>g.nombre),['Zona 1','Zona 1 nigromante','Zona 1 nigromante 2']);
 assert.deepEqual(grupos.flatMap(g=>g.items.map(i=>i.c.uid)),lista.map(i=>i.c.uid));
});
test('zonas: una insercion visible amplia solo su grupo y no reserva la zona derivada futura',()=>{
 const s=crear(),lista=items(s.history[0]);
 assert.deepEqual(agruparZonas(lista.slice(0,1)).map(g=>g.items.length),[1]);assert.deepEqual(agruparZonas(lista.slice(0,2)).map(g=>g.items.length),[2]);assert.equal(conexionesDerivacion(lista.slice(0,2)).length,0);
 assert.equal(conexionesDerivacion(lista.slice(0,3)).length,1);
});
test('zonas: segunda flecha enlaza nigromante con su general, no con otro origen',()=>{
 const s=crear(),lista=items(s.history[0]),enlaces=conexionesDerivacion(lista);
 assert.deepEqual(enlaces,lista.filter(i=>i.c.mazo==='nigromantes').map(i=>({origenUid:i.c.uid,destinoUid:s.history[0].slots.find(t=>t.id===i.c.spawnSlotId).draws[0].uid})));
 const falsa=structuredClone(lista);falsa.find(i=>i.slot.kind==='derivada').slot.origenUid=999;assert.equal(conexionesDerivacion(falsa).length,1);
});
test('zonas: cancelaciones no generan flechas a hijos anulados, historial mantiene etiquetas',()=>{
 const s=crear();discardCard(s,1,'t1-z1');const lista=items(s.history[0]);assert.equal(conexionesDerivacion(lista).length,0);assert.equal(etiquetasZonas(s.history[0]).get(s.history[0].slots[1].id),'Zona 1 nigromante');assert.ok(isValid(s));
});
test('zonas: agrupa por ID estable, mantiene distintas zonas con el mismo nombre',()=>{
 const a={id:'t1-z1',zone:'Zona 1'},b={id:'t1-z2',zone:'Zona 1'};
 const lista=[{c:{uid:1},slot:a,zone:a.zone},{c:{uid:2},slot:{...a},zone:a.zone},{c:{uid:3},slot:b,zone:b.zone}];
 assert.deepEqual(agruparZonas(lista).map(g=>g.items.length),[2,1]);
});
test('zonas: generales y Daily de una misma zona comparten grupo sin flecha de nigromante',()=>{
 const slot={id:'t1-z1',zone:'Zona 1'},lista=[{c:{uid:1},slot,zone:slot.zone},{c:{uid:2,mazo:'daily',origenUid:1},slot,zone:slot.zone}];
 assert.equal(agruparZonas(lista).length,1);assert.equal(conexionesDerivacion(lista).length,0);
});
test('zonas: conector adapta su recorrido al salto de fila y no modifica rectangulos',()=>{
 const a={left:0,right:100,top:0,bottom:200},b={left:160,right:260,top:0,bottom:200},antes=structuredClone([a,b]);
 assert.ok(rutaDerivacion(a,b,300).includes(' C '));assert.ok(rutaDerivacion(a,{...b,left:0,right:100,top:400,bottom:600},300).includes(' L '));assert.deepEqual([a,b],antes);
});
