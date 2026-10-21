import test from 'node:test';
import assert from 'node:assert/strict';
import {crearRevelacion,avanzarRevelacion} from '../dist/revelacion.js';
import {DURACION_VOLTEO,DURACION_DERIVADA,DURACION_ACTIVACION,duracionCarta} from '../dist/volteo.js';
const item=(uid,{mazo,derivada=false,pendiente=false}={})=>({c:{uid,...(mazo?{mazo}:{}),...(pendiente?{resolucionNigromante:'pendiente'}:{})},slot:{kind:derivada?'derivada':'normal'}});
const items=[item(1),item(6,{mazo:'nigromantes'}),item(7,{derivada:true}),item(8,{mazo:'abominaciones'}),item(2),item(9,{mazo:'abominaciones'}),item(3)];

test('pausa inicial de SPAWN conserva reversos 400 ms sin cambiar orden ni duración',()=>{
 const antes=structuredClone(items),p=crearRevelacion(items,1,100,{pausaInicial:400});
 assert.equal(p.fase,'espera-inicial');assert.equal(p.hasta,500);
 assert.deepEqual(avanzarRevelacion(p,items,100),{demora:400});assert.deepEqual(avanzarRevelacion(p,items,499),{demora:1});assert.equal(p.reveladas.size,0);
 assert.deepEqual(avanzarRevelacion(p,items,500),{revelar:1,demora:DURACION_VOLTEO});assert.deepEqual(items,antes);
 const reducido=crearRevelacion(items,1,100,{pausaInicial:400,reducida:true});assert.deepEqual(avanzarRevelacion(reducido,items,100),{terminada:true});
});
test('tiempos iniciales 700, secundarios y generales derivados 1000',()=>{
 assert.equal(DURACION_VOLTEO,700);assert.equal(DURACION_ACTIVACION,1000);
 assert.equal(duracionCarta(item(1)),700);assert.equal(duracionCarta(item(2,{mazo:'abominaciones'})),1000);assert.equal(duracionCarta(item(3,{derivada:true})),1000);
});
test('activacion y spawn son pasos separados antes de la siguiente inicial',()=>{
 const origen=item(1);origen.c.resolucionNigromante='spawn';origen.c.accionEnemigo='activacion-spawn';origen.c.nigromantes=[{uid:6}];
 const cartas=[origen,item(6,{mazo:'nigromantes'}),item(7,{derivada:true}),item(2)],p=crearRevelacion(cartas,1,0);
 assert.deepEqual(avanzarRevelacion(p,cartas,0),{revelar:1,demora:700});
 assert.deepEqual(avanzarRevelacion(p,cartas,700),{activacion:1,demora:1000});assert.equal(p.fase,'activacion');assert.equal(p.visibles.has(6),false);
 assert.deepEqual(avanzarRevelacion(p,cartas,1699),{demora:1});
 assert.deepEqual(avanzarRevelacion(p,cartas,1700),{revelar:6,demora:1000});
 assert.deepEqual(avanzarRevelacion(p,cartas,2700),{revelar:7,demora:1000});
 assert.deepEqual(avanzarRevelacion(p,cartas,3700),{revelar:2,demora:700});
 assert.deepEqual(avanzarRevelacion(p,cartas,4400),{terminada:true});
});
test('activacion sola dedica 1000 sin volver a revelar el origen conocido',()=>{
 const origen=item(1);origen.c.resolucionAbominacion='activacion';
 const p=crearRevelacion([origen],1,50,{conocidos:[1],porResolver:[1]});
 assert.deepEqual(avanzarRevelacion(p,[origen],50),{activacion:1,demora:1000});
 assert.deepEqual(avanzarRevelacion(p,[origen],1049),{demora:1});
 assert.deepEqual(avanzarRevelacion(p,[origen],1050),{terminada:true});
 assert.deepEqual(avanzarRevelacion(p,[origen],1051),{terminada:true});
});
test('activacion combinada elegida tras reabrir precede al nuevo enemigo',()=>{
 const origen=item(1);origen.c.resolucionAbominacion='spawn';origen.c.accionEnemigo='activacion-spawn';origen.c.abominaciones=[{uid:3}];
 const cartas=[origen,item(3,{mazo:'abominaciones'}),item(2)],p=crearRevelacion(cartas,1,0,{conocidos:[1,2],porResolver:[1]});
 assert.deepEqual(avanzarRevelacion(p,cartas,0),{activacion:1,demora:1000});
 assert.deepEqual(avanzarRevelacion(p,cartas,1000),{revelar:3,demora:1000});
 assert.deepEqual(avanzarRevelacion(p,cartas,2000),{terminada:true});
});
test('activacion anulada o movimiento reducido no agregan esperas',()=>{
 const origen=item(1);origen.c.resolucionNigromante='activacion';
 const cartas=[origen],p=crearRevelacion(cartas,1,0,{reducida:true});assert.deepEqual(avanzarRevelacion(p,cartas,0),{terminada:true});
 origen.c.discarded=true;const q=crearRevelacion(cartas,1,0);avanzarRevelacion(q,cartas,0);assert.deepEqual(avanzarRevelacion(q,cartas,700),{terminada:true});
});
test('solo N iniciales visibles, sin derivadas ni huecos reservados',()=>{
 const p=crearRevelacion(items,1,100);assert.deepEqual([...p.visibles],[1,2,3]);
 assert.equal(p.hasta,100);assert.equal(p.resueltas.size,0);assert.equal(p.reveladas.size,0);
 assert.deepEqual(avanzarRevelacion(p,items,100),{revelar:1,demora:DURACION_VOLTEO});assert.deepEqual([...p.visibles],[1,2,3]);assert.deepEqual([...p.reveladas],[1]);
});
test('cada inicial se revela y resuelve toda su cadena antes de voltear la siguiente',()=>{
 const copia=structuredClone(items),p=crearRevelacion(items,1,0);let ahora=p.hasta;
 for(const uid of [1,6,7,8,2,9,3]){
  const duracion=duracionCarta(items.find(({c})=>c.uid===uid));
  const visibles=p.visibles.size,yaVisible=p.visibles.has(uid);assert.deepEqual(avanzarRevelacion(p,items,ahora),{revelar:uid,demora:duracion});
  assert.equal(p.visibles.size,visibles+(yaVisible?0:1));assert.deepEqual(avanzarRevelacion(p,items,ahora+1),{demora:duracion-1});ahora+=duracion;
 }
 assert.deepEqual(avanzarRevelacion(p,items,ahora),{terminada:true});assert.deepEqual(items,copia);
});
test('eleccion pausa primer pendiente y no adelanta derivadas de otro origen',()=>{
 const cartas=[item(1,{pendiente:true}),item(2),item(5,{mazo:'abominaciones'})],p=crearRevelacion(cartas,2,0);
 assert.equal(avanzarRevelacion(p,cartas,0).revelar,1);
 assert.deepEqual(avanzarRevelacion(p,cartas,p.hasta),{eleccion:1});assert.equal(p.espera,1);assert.equal(p.fase,'eleccion');assert.equal(p.visibles.has(5),false);
 assert.deepEqual(avanzarRevelacion(p,cartas,p.hasta),{eleccion:1});
 assert.equal(p.reveladas.has(2),false);
 const elegidas=[item(1),item(3,{mazo:'nigromantes'}),item(4,{derivada:true}),...cartas.slice(1)];
 assert.equal(avanzarRevelacion(p,elegidas,p.hasta).revelar,3);assert.equal(p.visibles.has(4),false);assert.equal(p.visibles.has(5),false);
});
test('pendiente derivado pausa su cadena antes de avanzar al siguiente origen',()=>{
 const cartas=[item(1),item(6,{mazo:'nigromantes'}),item(7,{derivada:true,pendiente:true}),item(2),item(9,{mazo:'abominaciones'})];
 const p=crearRevelacion(cartas,1,0);let ahora=p.hasta;
 assert.equal(avanzarRevelacion(p,cartas,ahora).revelar,1);ahora+=DURACION_VOLTEO;
 assert.equal(avanzarRevelacion(p,cartas,ahora).revelar,6);ahora+=DURACION_DERIVADA;
 assert.equal(avanzarRevelacion(p,cartas,ahora).revelar,7);ahora+=DURACION_DERIVADA;
 assert.deepEqual(avanzarRevelacion(p,cartas,ahora),{eleccion:7});assert.equal(p.visibles.has(9),false);assert.equal(p.reveladas.has(2),false);
});
test('descartar pendiente o retirar derivadas permite continuar sin revelar las anuladas',()=>{
 const cartas=[item(1,{pendiente:true}),item(2),item(3,{mazo:'abominaciones'})],p=crearRevelacion(cartas,1,0);
 avanzarRevelacion(p,cartas,p.hasta);cartas[0].c.discarded=true;
 assert.equal(avanzarRevelacion(p,cartas,p.hasta).revelar,2);
 assert.equal(avanzarRevelacion(p,cartas,p.hasta).revelar,3);cartas.pop();
 assert.deepEqual(avanzarRevelacion(p,cartas,p.hasta),{terminada:true});
});
test('nueva eleccion tras reabrir no vuelve a voltear conocidos',()=>{
 const p=crearRevelacion(items,1,50,{conocidos:[1,2,3]});
 assert.equal(p.hasta,50);assert.equal(avanzarRevelacion(p,items,50).revelar,6);assert.equal(p.visibles.has(7),false);
});
test('movimiento reducido omite esperas pero mantiene orden y pausa manual',()=>{
 const p=crearRevelacion(items,1,0,{reducida:true});assert.deepEqual(avanzarRevelacion(p,items,0),{terminada:true});assert.equal(p.visibles.size,items.length);
 const q=crearRevelacion([item(1,{pendiente:true}),item(2)],1,0,{reducida:true});assert.deepEqual(avanzarRevelacion(q,[item(1,{pendiente:true}),item(2)],0),{eleccion:1});
});
