import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,isValid,discardCard,programarConfiguracion} from '../dist/engine.js';
import {datos,idsSecundarios} from '../dist/catalogo.js';
import {configContenido,visiblesContenido} from '../dist/contenido.js';
import {CARTAS_NIGROMANTES} from '../dist/nigromantes.js';
import {KEY,recuperar} from '../dist/persistencia.js';
const id='referencia-death-notes';

test('Death Notes: una identidad seleccionable de Frozen Fortress, sin duplicado en ayudas',()=>{
 const c=configContenido({easy:true,normal:true,threshold:0});
 assert.equal(CARTAS_NIGROMANTES.filter(c=>c.id===id).length,1);
 assert.equal(visiblesContenido(c,'nigromantes').find(c=>c.id===id).copias,1);
 assert.ok(idsSecundarios(c,'nigromantes').includes(id));
 assert.ok(!idsSecundarios({...c,coleccionIds:['core']},'nigromantes').includes(id));
 assert.ok(!datos.referencias.referencias.some(c=>c.id===id));
 assert.equal(datos.coleccion.cartas.find(c=>c.id===id).cajaId,'frozen-fortress');
});

test('Death Notes: aparece, se fija, se recupera y se anula como nigromante',()=>{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante'],modoNigromantes:'sin-reposicion',selectedNigromantesIds:[id]},1);
 spawn(s,()=>0);
 assert.equal(s.pins[0].cardId,id);assert.equal(s.nigromantes.remaining[id],0);assert.ok(isValid(s));
 const bytes=JSON.stringify(s),almacen={getItem:k=>k===KEY?bytes:null};
 assert.deepEqual(recuperar(almacen),s);
 discardCard(s,1,s.history[0].slots[0].id);
 assert.equal(s.pins.length,0);assert.equal(s.nigromantes.remaining[id],1);assert.ok(isValid(s));
});

test('Death Notes: guardados con defaults antiguos conservan mazo, historia y bytes originales',()=>{
 const anteriores=datos.nigromantes.cartas_ids.filter(c=>c!==id);
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado',selectedNigromantesIds:anteriores},1);
 spawn(s,()=>0);
 function quitarSeleccion(n){delete n.config.selectedNigromantesIds;delete n.proximaConfig.selectedNigromantesIds;for(const b of n.history)if(b.configTanda)delete b.configTanda.selectedNigromantesIds;if(n.respaldoTanda)quitarSeleccion(n.respaldoTanda.estado);}
 quitarSeleccion(s);
 const bytes=JSON.stringify(s),almacen={getItem:k=>k===KEY?bytes:null};
 const recuperado=recuperar(almacen);
 assert.ok(isValid(recuperado));assert.deepEqual(recuperado.nigromantes,s.nigromantes);
 assert.deepEqual(recuperado.pins,s.pins);assert.deepEqual(recuperado.remaining,s.remaining);
 assert.ok(!recuperado.config.selectedNigromantesIds.includes(id));
 assert.equal(almacen.getItem(KEY),bytes);assert.deepEqual(recuperar({getItem:k=>k===KEY?JSON.stringify(recuperado):null}),recuperado);
});

test('Death Notes: habilitar durante una partida se aplica en la próxima tanda sin reescribir la anterior',()=>{
 const anteriores=datos.nigromantes.cartas_ids.filter(c=>c!==id);
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado',selectedNigromantesIds:anteriores},1);
 spawn(s,()=>0);const historia=structuredClone(s.history),mazo=structuredClone(s.nigromantes);
 programarConfiguracion(s,{...s.proximaConfig,selectedNigromantesIds:[...anteriores,id]});
 assert.deepEqual(s.nigromantes,mazo);assert.deepEqual(s.history,historia);
 spawn(s,()=>0);
 assert.equal(s.nigromantes.remaining[id],1);assert.ok(s.nigromantes.habilitadasIds.includes(id));
 assert.deepEqual(s.history[0],historia[0]);assert.ok(isValid(s));
});
