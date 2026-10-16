import test from 'node:test';
import assert from 'node:assert/strict';
import {estadoVisualSpawn,agruparRevelaciones} from '../dist/presentacion.js';
test('pendiente no se marca aplicada ni como activacion',()=>{
 for(const campo of ['resolucionAbominacion','resolucionNigromante'])assert.equal(estadoVisualSpawn({[campo]:'pendiente'}),'pendiente');
});
test('spawn automatico/elegido con secundaria valida se marca aplicado',()=>{
 for(const [campo,mazo] of [['resolucionAbominacion','abominaciones'],['resolucionNigromante','nigromantes']]){
  assert.equal(estadoVisualSpawn({[campo]:'spawn',[mazo]:[{discarded:false,anulada:false}]}),'spawn');
 }
});
test('activacion se distingue de spawn y no requiere secundaria',()=>{
 assert.equal(estadoVisualSpawn({resolucionAbominacion:'activacion'}),'activacion');
 assert.equal(estadoVisualSpawn({resolucionNigromante:'activacion'}),'activacion');
});
test('anulados, descartados y secundarios no muestran spawn aplicado',()=>{
 const carta={resolucionAbominacion:'spawn',abominaciones:[{anulada:false,discarded:false}]};
 for(const extra of [{discarded:true},{anulada:true},{mazo:'abominaciones'},{abominaciones:[{anulada:true}]}])assert.equal(estadoVisualSpawn({...carta,...extra}),'ninguno');
});
test('agrupacion une solo origen y secundaria, sin agrupar la general de una zona nueva',()=>{
 const c={uid:1,resolucionNigromante:'spawn',nigromantes:[{uid:2,origenUid:1,anulada:false}]};
 const items=[{c},{c:c.nigromantes[0]},{c:{uid:3}}];
 const antes=structuredClone(items);assert.deepEqual(agruparRevelaciones(items).map(g=>g.map(i=>i.c.uid)),[[1,2],[3]]);assert.deepEqual(items,antes);
});
test('pendientes, activaciones y relaciones a otros orígenes no generan flecha',()=>{
 for(const c of [{uid:1,resolucionNigromante:'pendiente'},{uid:1,resolucionNigromante:'activacion'},{uid:1,resolucionNigromante:'spawn',nigromantes:[{uid:2,anulada:false}]}]){
  assert.equal(agruparRevelaciones([{c},{c:{uid:2,origenUid:99}}]).length,2);
 }
});
