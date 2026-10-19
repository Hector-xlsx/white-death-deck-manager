import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {newGame,spawn,replaceCard,discardCard,pinCard,total,isValid} from '../dist/engine.js';
import {migrarEstado} from '../dist/estado.js';
import {KEY,KEY_ANTERIOR,recuperar,guardarAccion} from '../dist/persistencia.js';
import {CATALOG,componer,datos,referenciasPorCarta,rutaRecurso,escapar} from '../dist/catalogo.js';
const original=JSON.parse(await readFile(new URL('../datos/ejemplo_partida_v1_SINTETICO.json',import.meta.url),'utf8'));
function almacenInicial(entries=[]){const valores=new Map(entries);return {getItem:k=>valores.get(k)??null,setItem:(k,v)=>valores.set(k,v)};}

test('migracion v1 conserva extracciones, cantidades, referencias y ventana; asigna IDs estables',()=>{
 for(const conDesfijados of [true,false]){
  const viejo=structuredClone(original);if(!conDesfijados)delete viejo.unpinned;
  const s=migrarEstado(viejo);
  assert.equal(s.version,2);assert.deepEqual(s.remaining,viejo.remaining);assert.deepEqual(s.pins,viejo.pins);
  assert.deepEqual(s.history.flatMap(b=>b.slots.flatMap(t=>t.draws)),viejo.history.flatMap(b=>b.slots.flatMap(t=>t.draws)));
  assert.equal(s.openBatch,true);assert.equal(s.sequence,3);assert.equal(s.history[0].slots[1].id,'t1-z2');
  assert.ok(isValid(s));assert.deepEqual(migrarEstado(s),s);assert.equal(viejo.version,1);
 }
});
test('migracion guarda v2 sin sobrescribir los bytes v1; recuperacion no roba',()=>{
 const bytes=JSON.stringify(original),almacen=almacenInicial([[KEY_ANTERIOR,bytes]]);
 const s=recuperar(almacen);assert.equal(almacen.getItem(KEY_ANTERIOR),bytes);
 assert.deepEqual(recuperar(almacen),s);assert.equal(s.sequence,original.sequence);
});
test('guardado corrupto v2 no cae silenciosamente a v1 ni sobrescribe datos',()=>{
 const almacen=almacenInicial([[KEY,'{corrupto'],[KEY_ANTERIOR,JSON.stringify(original)]]);
 assert.throws(()=>recuperar(almacen));assert.equal(almacen.getItem(KEY),'{corrupto');
});
test('fallo de escritura revierte toda la accion, incluido RNG, ciclo, historial y fijados',()=>{
 const s=newGame({easy:false,normal:false,threshold:99},1);const antes=structuredClone(s);
 const almacen={setItem(){throw new Error('QuotaExceededError');}};
 assert.throws(()=>guardarAccion(s,n=>{spawn(n,()=>0);pinCard(n,n.history[0].slots[0].draws[0]);},almacen));
 assert.deepEqual(s,antes);
 const viejo=JSON.stringify(original);const lector={getItem:k=>k===KEY_ANTERIOR?viejo:null,...almacen};
 assert.throws(()=>recuperar(lector));assert.equal(lector.getItem(KEY_ANTERIOR),viejo);
});
test('validacion rechaza extracciones duplicadas, referencias huerfanas y campos invalidos',()=>{
 const valido=migrarEstado(original);
 for(const mutar of [
  s=>s.history[0].slots[1].draws[0].uid=1,
  s=>s.pins[0].uid=999,
  s=>s.pins[0].cardId='nigromante',
  s=>s.sequence=2,
  s=>s.history[0].slots[0].draws[0].cycle=2,
  s=>s.history[0].slots[0].kind='desconocido',
  s=>s.history[0].slots[1].id=s.history[0].slots[0].id,
  s=>s.normal=-1,
  s=>s.catalogo.cartas[0].image='../secreto.png',
  s=>s.catalogo.cartas[0].levels='texto incompatible',
  s=>delete s.config,
  s=>s.remaining.nigromante=10,
  s=>s.unpinned.push({...s.pins[0]})
 ]){const s=structuredClone(valido);mutar(s);assert.equal(isValid(s),false);assert.throws(()=>migrarEstado(s));}
});
test('accion invalida no escribe al almacenamiento',()=>{
 const s=newGame();let escrituras=0;
 assert.throws(()=>guardarAccion(s,n=>n.necro=-1,{setItem(){escrituras++;}}));assert.equal(escrituras,0);assert.equal(s.necro,0);
});
test('pestaña desactualizada no sobrescribe una accion ni ejecuta nuevos robos',()=>{
 const s=newGame(),almacen=almacenInicial();const esperado=JSON.stringify(s);almacen.setItem(KEY,esperado);
 const otra=guardarAccion(s,n=>n.normal++,almacen,{esperado});let extracciones=0;
 assert.throws(()=>guardarAccion(s,n=>{extracciones++;spawn(n,()=>0);},almacen,{esperado}),e=>e.code==='PARTIDA_CAMBIADA');
 assert.equal(extracciones,0);assert.deepEqual(JSON.parse(almacen.getItem(KEY)),otra);
});
test('configuracion futura no modifica la composicion vigente; catalogo de partida congelado',()=>{
 const s=newGame();const almacen=almacenInicial();
 const siguiente=guardarAccion(s,n=>n.proximaConfig={easy:false,normal:false,threshold:20,selectedIds:CATALOG.map(c=>c.id)},almacen);
 assert.equal(total(siguiente.initial),56);assert.equal(total(newGame(siguiente.proximaConfig).initial),28);
 const antigua=structuredClone(s);antigua.catalogo.cartas[0].copies=11;antigua.initial.nigromante=11;antigua.remaining.nigromante=11;
 assert.ok(isValid(antigua));assert.equal(total(antigua.initial),58);assert.equal(total(newGame().initial),56);
});
test('seleccion por ID no duplica copias y mazo vacio no inventa cartas',()=>{
 const config={easy:true,normal:true,threshold:0,selectedIds:['nigromante','nigromante']};
 assert.deepEqual(componer(config),{nigromante:9});assert.equal(total(newGame(config).initial),9);
 const s=newGame({...config,selectedIds:[]});assert.ok(isValid(s));assert.throws(()=>spawn(s,()=>0));assert.equal(s.sequence,0);assert.equal(s.history.length,0);
});
test('acciones por ID siguen apuntando a la posicion tras reordenarla y no reescriben historial',()=>{
 const s=newGame();spawn(s,()=>0);const id=s.history[0].slots[1].id;
 s.history[0].slots.reverse();replaceCard(s,1,id,()=>0);
 assert.equal(s.history[0].slots.find(t=>t.id===id).draws.length,2);
 spawn(s,()=>0);const antes=structuredClone(s);
 assert.throws(()=>discardCard(s,1,id));assert.deepEqual(s,antes);
});
test('inventarios pendientes no entran al sorteo; originales y variantes son rutas controladas',()=>{
 assert.equal(datos.enemigos.enemigos.length,31);
 assert.ok(datos.enemigos.enemigos.every(c=>c.habilitado_para_sorteo===false&&c.cantidad_inicial_mazo_secundario===1));
 assert.equal(datos.expansiones.cartas.filter(c=>c.habilitada_para_sorteo).length,5);
 assert.ok(datos.expansiones.cartas.filter(c=>!c.habilitada_para_sorteo).every(c=>c.efectos_por_nivel===null));
 for(const c of CATALOG)assert.deepEqual(referenciasPorCarta(c.id),[]);
 const imagen=id=>{const c=datos.enemigos.enemigos.find(c=>c.id===id);return c.imagen_es||c.imagen_original;};
 assert.notEqual(imagen('enemigo-mumm-ra'),imagen('enemigo-mumm-ra-abominacion'));
 assert.throws(()=>rutaRecurso('https://ejemplo.test/imagen.png'));assert.throws(()=>rutaRecurso('../secreto'));
 assert.equal(escapar('<img onerror="alert(1)">'),'&lt;img onerror=&quot;alert(1)&quot;&gt;');
});
test('una ayuda confirmada se comparte entre cartas y admite varias referencias sin habilitar sorteos',()=>{
 const refs=datos.referencias.referencias.slice(0,2),anteriores=structuredClone(refs);
 try{
  for(const r of refs){r.vinculos_confirmados=true;r.cartas_vinculadas_ids=['nigromante','abominacion'];}
  assert.deepEqual(referenciasPorCarta('nigromante').map(r=>r.id),refs.map(r=>r.id));
  assert.deepEqual(referenciasPorCarta('abominacion').map(r=>r.id),refs.map(r=>r.id));
  assert.deepEqual(referenciasPorCarta('asedio'),[]);assert.equal(total(newGame().initial),56);
 }finally{refs.forEach((r,i)=>Object.assign(r,anteriores[i]));}
});
