import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,unpinCard,pinCard,volverAlMazo,isValid,anularTanda,discardCard} from '../dist/engine.js';
import {guardarAccion,recuperar,KEY} from '../dist/persistencia.js';
import {migrarEstado} from '../dist/estado.js';
const crear=(tipo='abominacion',ids=['enemigo-abominacion-orca','enemigo-mumm-ra-abominacion'],modo='sin-reposicion')=>{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:[tipo,'asedio'],modoAbominaciones:modo,modoNigromantes:modo,...(tipo==='abominacion'?{selectedAbominacionesIds:ids}: {selectedNigromantesIds:ids})},1);
 s.accionesPredeterminadas={abominacion:'spawn',nigromante:'spawn'};return s;
};
function revelar(s){let azar=[0,0,.99];spawn(s,()=>azar.shift()??.99);return s.pins.at(-1);}

test('Kijin conserva partida y respaldo al migrar su unica imagen actual',()=>{
 const s=crear('abominacion',['enemigo-kijin']);revelar(s);revelar(s);
 const antigua='recursos/04 - Mazo Abominaciones ESP/Carta Kijin con corrección tipográfica-18.png';
 s.abominaciones.cartas[0].image=antigua;s.respaldoTanda.estado.abominaciones.cartas[0].image=antigua;
 const bytes=JSON.stringify(s),m=recuperar({getItem:k=>k===KEY?bytes:null});
 const esperado=structuredClone(s),actual='recursos/04 - Mazo Abominaciones ESP/Carta Kijin de Zombicide-13.png';
 esperado.abominaciones.cartas[0].image=actual;esperado.respaldoTanda.estado.abominaciones.cartas[0].image=actual;
 assert.deepEqual(m,esperado);assert.equal(JSON.stringify(s),bytes);assert.ok(isValid(m));
 anularTanda(m);assert.equal(m.abominaciones.cartas[0].image,actual);assert.equal(m.pins.length,1);assert.ok(isValid(m));
});

test('migracion de imagen no acepta rutas desconocidas ni corrige otra identidad',()=>{
 const s=crear('abominacion',['enemigo-kijin']);s.abominaciones.cartas[0].image='recursos/04 - Mazo Abominaciones ESP/desconocida.png';
 assert.throws(()=>migrarEstado(s),/Partida invalida/);
 const otra=crear();otra.abominaciones.cartas[0].image='recursos/04 - Mazo Abominaciones ESP/Carta Kijin con corrección tipográfica-18.png';
 assert.throws(()=>migrarEstado(otra),/Partida invalida/);
});
test('unicos en ambos modos, agotamiento no baraja fijados y activa sin robar',()=>{
 for(const modo of ['sin-reposicion','con-reposicion']){
  const s=crear('abominacion',undefined,modo);revelar(s);revelar(s);const ids=s.pins.map(c=>c.cardId);assert.equal(new Set(ids).size,2);
  assert.deepEqual(Object.values(s.abominaciones.remaining),[0,0]);assert.equal(s.abominaciones.cycle,1);
  revelar(s);assert.equal(s.pins.length,2);assert.equal(s.history.at(-1).slots[0].draws[0].accionEnemigo,'activacion');assert.ok(isValid(s));
 }
});
test('derrotar normal descarta y reinicio recicla solo descartes, nunca fijados',()=>{
 const s=crear(),a=revelar(s),b=revelar(s);unpinCard(s,a.uid);
 assert.equal(s.abominaciones.remaining[a.cardId],1);assert.equal(s.abominaciones.remaining[b.cardId],0);assert.equal(s.abominaciones.cycle,2);
 const c=revelar(s);assert.equal(c.cardId,a.cardId);assert.ok(isValid(s));
});
test('trofeo sale al aparecer, derrota no lo recicla, devolver es excepcion explicita',()=>{
 const s=crear('abominacion',['enemigo-amaterasu']);const a=revelar(s);
 assert.equal(s.abominaciones.cartas[0].trofeo,true);assert.equal(s.abominaciones.remaining[a.cardId],0);
 unpinCard(s,a.uid);assert.equal(s.abominaciones.trofeos[a.cardId],a.uid);revelar(s);assert.equal(s.pins.length,0);assert.ok(isValid(s));
 volverAlMazo(s,a.uid);assert.equal(s.abominaciones.remaining[a.cardId],1);assert.deepEqual(s.abominaciones.trofeos,{});
 const c=revelar(s);assert.equal(c.cardId,a.cardId);assert.ok(isValid(s));
});
test('devolver en juego desfija, es idempotente y refijar retira del mazo',()=>{
 const s=crear(),a=revelar(s);volverAlMazo(s,a.uid);
 assert.equal(s.pins.length,0);assert.equal(s.unpinned[0].uid,a.uid);assert.equal(s.abominaciones.remaining[a.cardId],1);
 const antes=structuredClone(s);volverAlMazo(s,a.uid);assert.deepEqual(s,antes);
 pinCard(s,a);assert.equal(s.abominaciones.remaining[a.cardId],0);assert.equal(s.unpinned.length,0);assert.ok(isValid(s));
});
test('no refijar una copia historica mientras otra identidad igual esta en juego',()=>{
 const s=crear(),a=revelar(s);volverAlMazo(s,a.uid);revelar(s);
 assert.throws(()=>pinCard(s,a),/ya está en juego/);assert.ok(isValid(s));
});
test('nigromante devuelto quita zona sin borrar la general ya revelada; refijado la recupera',()=>{
 const s=crear('nigromante',['enemigo-ostokar-el-palido']),a=revelar(s),slots=structuredClone(s.history.at(-1).slots);
 assert.equal(s.necro,1);volverAlMazo(s,a.uid);assert.equal(s.necro,0);assert.equal(s.nigromantes.remaining[a.cardId],1);assert.deepEqual(s.history.at(-1).slots,slots);
 pinCard(s,a);assert.equal(s.necro,1);assert.equal(s.nigromantes.remaining[a.cardId],0);assert.ok(isValid(s));
});
test('nigromante agotado evita cadena duplicada y deja activacion',()=>{
 const s=crear('nigromante',['enemigo-ostokar-el-palido']);spawn(s,()=>0);
 assert.equal(s.pins.length,1);assert.equal(s.history[0].slots.length,2);assert.equal(s.history[0].slots[1].draws[0].accionEnemigo,'activacion');assert.ok(isValid(s));
});
test('anular origen devuelve trofeo derrotado como nunca mostrado',()=>{
 const s=crear('abominacion',['enemigo-amaterasu']),a=revelar(s);unpinCard(s,a.uid);discardCard(s,1,'t1-z1');
 assert.equal(s.abominaciones.remaining[a.cardId],1);assert.deepEqual(s.abominaciones.trofeos,{});assert.ok(isValid(s));
});
test('anular tanda revierte derrota, devolucion y refijado',()=>{
 const s=crear('abominacion',['enemigo-amaterasu']),antes=structuredClone(s),a=revelar(s);unpinCard(s,a.uid);volverAlMazo(s,a.uid);pinCard(s,a);anularTanda(s);
 assert.deepEqual(s,{...antes,openBatch:false,respaldoTanda:null});assert.ok(isValid(s));
});
test('recarga mantiene ubicaciones y fallo de cuota no acepta devolucion',()=>{
 const s=crear('abominacion',['enemigo-amaterasu']),a=revelar(s);unpinCard(s,a.uid);const bytes=JSON.stringify(s),almacen={getItem:()=>bytes,setItem(){throw new Error('Quota');}};
 assert.deepEqual(recuperar(almacen),s);assert.throws(()=>guardarAccion(s,n=>volverAlMazo(n,a.uid),almacen));assert.equal(JSON.stringify(s),bytes);
});
test('migracion conserva historial y duplicados antiguos, pero excluye fijados del nuevo sorteo',()=>{
 const s=crear('abominacion',undefined,'con-reposicion');s.abominaciones.version=1;revelar(s);revelar(s);assert.equal(s.pins[0].cardId,s.pins[1].cardId);
 const json=JSON.stringify(s),m=recuperar({getItem:k=>k===KEY?json:null});assert.equal(m.abominaciones.version,2);assert.deepEqual(m.history,s.history);assert.deepEqual(m.pins,s.pins);
 assert.equal(m.abominaciones.remaining[m.pins[0].cardId],0);assert.ok(isValid(m));
});
test('rechaza mapa de trofeos falso y ubicacion duplicada',()=>{
 const s=crear(),a=revelar(s);const copia=structuredClone(s);copia.abominaciones.trofeos[a.cardId]=a.uid;assert.equal(isValid(copia),false);
 const otra=structuredClone(s);otra.abominaciones.remaining[a.cardId]=1;assert.equal(isValid(otra),false);
});
test('trofeo desfijado antes de actualizar no vuelve al sorteo al migrar',()=>{
 const s=crear('abominacion',['enemigo-amaterasu']);s.abominaciones.version=1;const a=revelar(s);unpinCard(s,a.uid);
 assert.equal(s.abominaciones.remaining[a.cardId],1);assert.ok(isValid(s));
 const json=JSON.stringify(s),m=recuperar({getItem:k=>k===KEY?json:null});
 assert.equal(m.abominaciones.remaining[a.cardId],0);assert.equal(m.abominaciones.trofeos[a.cardId],a.uid);assert.ok(isValid(m));
});
