import test from 'node:test';
import assert from 'node:assert/strict';
import {planificarVolteos,DURACION_VOLTEO,INTERVALO_VOLTEO} from '../dist/volteo.js';

test('volteo sigue el orden visual, incluyendo secundarias y zonas derivadas',()=>{
 const actuales=[1,4,5,2,3],antes=structuredClone(actuales);
 const plan=planificarVolteos([],actuales,100);
 assert.deepEqual([...plan],actuales.map((uid,i)=>[uid,100+i*INTERVALO_VOLTEO]));
 assert.deepEqual(actuales,antes);
});
test('elegir spawn anima solo las cartas nuevas sin repetir las reveladas',()=>{
 assert.deepEqual([...planificarVolteos([1,2],[1,3,4,2],100)],[[3,100],[4,100+INTERVALO_VOLTEO]]);
 assert.equal(planificarVolteos([1,2],[1,2],100).size,0);
});
test('un render conserva tiempos y una nueva derivada se agrega a la secuencia pendiente',()=>{
 const pendientes=new Map([[1,100],[2,340]]);
 assert.deepEqual([...planificarVolteos([1,2],[1,2,3],150,pendientes)],[[1,100],[2,340],[3,580]]);
 assert.deepEqual([...pendientes],[[1,100],[2,340]]);
});
test('no conserva volteos de cartas retiradas o que ya terminaron',()=>{
 const plan=planificarVolteos([1,2],[1],100+DURACION_VOLTEO,new Map([[1,100],[2,340]]));
 assert.equal(plan.size,0);
});
