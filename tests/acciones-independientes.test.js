import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,isValid,discardCard,replaceCard,anularTanda,programarConfiguracion,regenerarNigromante,regenerarAbominacion} from '../dist/engine.js';
import {limitesIniciales} from '../dist/limites.js';
import {presentes,PROFANADOR} from '../dist/modos-enemigos.js';
import {probabilidadSpawnEnemigo,configuracionAccionesValida} from '../dist/acciones-independientes.js';
import {guardarAccion,recuperar,KEY} from '../dist/persistencia.js';
const opcion=(modo='nunca',probabilidad=50)=>({modo,probabilidad});
const perfil=(extra={})=>({profanador:opcion(),otros:opcion(),spawn:{...opcion('probabilidad',20),incremento:15,maximo:60},...extra});
const crear=(p=perfil(),familia='nigromantes')=>{
 const limites=limitesIniciales(true);for(const familia of Object.keys(limites))for(const n of Object.keys(limites[familia]))limites[familia][n]=4;
 return newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion','asedio'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado',selectedNigromantesIds:['enemigo-ostokar-el-palido','enemigo-bomoh','enemigo-hannya'],selectedAbominacionesIds:['enemigo-abominacion-kan','enemigo-abominacion-orca','enemigo-yeti'],limitesPorAdrenalina:limites,revelacionEnemigos:{[familia]:p}},1);
};
function revelar(s,tipo='nigromante',valores=[]){for(const id of Object.keys(s.remaining))s.remaining[id]=Number(id===tipo);const cola=[0,...valores];spawn(s,()=>cola.shift()??.99);assert.ok(isValid(s));return s.history.at(-1).slots[0].draws[0];}
function cambiar(s,p,familia='nigromantes'){programarConfiguracion(s,{...s.proximaConfig,revelacionEnemigos:{...s.proximaConfig.revelacionEnemigos,[familia]:p}});}

test('independientes: Profanador prioritario incluso con todas las acciones en Nunca',()=>{
 const s=crear(perfil({spawn:{...opcion('nunca'),incremento:0,maximo:100}})),c=revelar(s);
 assert.equal(c.nigromantes[0].cardId,PROFANADOR);assert.equal(c.revelacionIndependiente.spawn.resultado,'prioridad');
 const siguiente=revelar(s);assert.equal(siguiente.resolucionNigromante,'sin-efecto');assert.equal(siguiente.activaciones.length,0);assert.equal(presentes(s,'nigromantes').length,1);
});
test('independientes: aumento por fallo con máximo menor a 100 y reinicio al aparecer',()=>{
 const s=crear();revelar(s);
 for(const esperado of [35,50,60,60]){const c=revelar(s,'nigromante',[.99]);assert.equal(c.revelacionIndependiente.spawn.resultado,'fallo');assert.equal(probabilidadSpawnEnemigo(s,'nigromantes'),esperado);}
 const c=revelar(s,'nigromante',[.1,0]);assert.equal(c.revelacionIndependiente.spawn.resultado,'spawn');assert.equal(c.revelacionIndependiente.spawn.probabilidad,60);assert.equal(probabilidadSpawnEnemigo(s,'nigromantes'),20);
});
test('independientes: tope pausa Spawn, no fuerza activaciones ni suma un fallo',()=>{
 const s=crear();for(const n of Object.keys(s.config.limitesPorAdrenalina.nigromantes))s.config.limitesPorAdrenalina.nigromantes[n]=0;
 revelar(s);const antes=probabilidadSpawnEnemigo(s,'nigromantes'),c=revelar(s);
 assert.equal(c.revelacionIndependiente.spawn.resultado,'bloqueado');assert.equal(c.revelacionIndependiente.spawn.motivo,'limite');assert.equal(probabilidadSpawnEnemigo(s,'nigromantes'),antes);assert.equal(c.activaciones.length,0);assert.equal(c.accionEnemigo,'sin-efecto');
});
test('independientes: activación del Profanador se evalúa aunque el Spawn esté bloqueado',()=>{
 const s=crear(perfil({profanador:opcion('siempre')}));for(const n of Object.keys(s.config.limitesPorAdrenalina.nigromantes))s.config.limitesPorAdrenalina.nigromantes[n]=0;
 revelar(s);const c=revelar(s);assert.deepEqual(c.activaciones.map(a=>a.cardId),[PROFANADOR]);assert.equal(c.revelacionIndependiente.spawn.resultado,'bloqueado');
});
test('independientes: cada otro nigromante tiene un sorteo propio y excluye al Profanador',()=>{
 const s=crear(perfil({spawn:{...opcion('siempre'),incremento:0,maximo:100}}));revelar(s);revelar(s);revelar(s);
 cambiar(s,perfil({otros:opcion('probabilidad',50),spawn:{...opcion('nunca'),incremento:0,maximo:100}}));
 const c=revelar(s,'nigromante',[.1,.9]);assert.equal(c.activaciones.length,1);assert.notEqual(c.activaciones[0].cardId,PROFANADOR);assert.deepEqual(c.revelacionIndependiente.activaciones.map(a=>a.activada),[false,true,false]);
});
test('independientes: Siempre activa a todos los adicionales; Nunca excluye al Profanador',()=>{
 const s=crear(perfil({spawn:{...opcion('siempre'),incremento:0,maximo:100}}));revelar(s);revelar(s);revelar(s);
 cambiar(s,perfil({otros:opcion('siempre'),spawn:{...opcion('nunca'),incremento:0,maximo:100}}));const c=revelar(s);assert.equal(c.activaciones.length,2);assert.ok(c.activaciones.every(a=>a.cardId!==PROFANADOR));
});
test('independientes: probabilidades 0/100 no necesitan un sorteo de ocurrencia',()=>{
 const s=crear(perfil({profanador:opcion('probabilidad',100),spawn:{...opcion('probabilidad',0),incremento:0,maximo:0}}));revelar(s);const c=revelar(s,'nigromante');assert.equal(c.activaciones.length,1);assert.equal(c.revelacionIndependiente.spawn.resultado,'fallo');assert.equal(probabilidadSpawnEnemigo(s,'nigromantes'),0);
});
test('independientes: no hay candidatos, solo se pausa Spawn',()=>{
 const s=crear(perfil({profanador:opcion('nunca'),spawn:{...opcion('siempre'),incremento:0,maximo:100}}));revelar(s);revelar(s);revelar(s);revelar(s);const c=revelar(s);assert.equal(c.revelacionIndependiente.spawn.motivo,'sin-candidatos');assert.equal(c.activaciones.length,0);assert.equal(c.resolucionNigromante,'sin-efecto');
});
test('independientes: cancelar fallo revierte aumento; reemplazo y anulación son persistibles',()=>{
 const s=crear();revelar(s);const c=revelar(s);assert.equal(probabilidadSpawnEnemigo(s,'nigromantes'),35);
 discardCard(s,2,'t2-z1');assert.equal(probabilidadSpawnEnemigo(s,'nigromantes'),20);assert.ok(isValid(s));
 replaceCard(s,2,'t2-z1',()=>.99);assert.ok(isValid(s));
 revelar(s);const esperado={...structuredClone(s.respaldoTanda.estado),respaldoTanda:null,openBatch:false};anularTanda(s);assert.deepEqual(s,esperado);
});
test('independientes: recuperación y cuota no repiten ni aceptan sorteos parcialmente',()=>{
 const s=crear();revelar(s);revelar(s);const bytes=JSON.stringify(s),almacen={getItem:k=>k===KEY?bytes:null};assert.deepEqual(recuperar(almacen),s);
 assert.throws(()=>guardarAccion(s,n=>revelar(n),{setItem(){throw Error('Quota');}}));assert.equal(JSON.stringify(s),bytes);
});
test('independientes: modos oficiales ignoran las opciones personalizadas',()=>{
 const s=crear();s.config.reglaNigromantes='varios';s.proximaConfig.reglaNigromantes='varios';revelar(s);const c=revelar(s);assert.equal(c.revelacionIndependiente,undefined);assert.equal(c.accionEnemigo,'activacion-spawn');
});
test('independientes: parámetros nuevos no cambian el comportamiento de guardados sin perfil',()=>{
 const s=crear();delete s.config.revelacionEnemigos;delete s.proximaConfig.revelacionEnemigos;s.accionesPredeterminadas={nigromante:'spawn'};for(const n of Object.keys(s.config.limitesPorAdrenalina.nigromantes))s.config.limitesPorAdrenalina.nigromantes[n]=0;
 revelar(s);const c=revelar(s);assert.equal(c.activacionPorLimite,0);assert.equal(c.accionEnemigo,'activacion');assert.equal(c.revelacionIndependiente,undefined);
});
test('independientes: valida rangos, máximo mayor o igual a base y resultados guardados',()=>{
 const s=crear();revelar(s);revelar(s);
 for(const modificar of [n=>n.config.revelacionEnemigos.nigromantes.spawn.maximo=10,n=>n.config.revelacionEnemigos.nigromantes.otros.probabilidad=101,n=>n.config.revelacionEnemigos.nigromantes.profanador.modo='azar',n=>n.history[1].slots[0].draws[0].revelacionIndependiente.spawn.resultado='inexistente']){const roto=structuredClone(s);modificar(roto);assert.equal(isValid(roto),false);}
 assert.equal(configuracionAccionesValida({...s.config,revelacionEnemigos:null}),false);
});

test('independientes: abominaciones conservan la primera aparición y Nunca no activa al tope',()=>{
 const p={activacion:opcion('nunca'),spawn:{...opcion('siempre'),incremento:0,maximo:100}},s=crear(p,'abominaciones');
 for(const n of Object.keys(s.config.limitesPorAdrenalina.abominaciones))s.config.limitesPorAdrenalina.abominaciones[n]=1;
 const primera=revelar(s,'abominacion');assert.equal(primera.revelacionIndependiente.spawn.resultado,'prioridad');
 const c=revelar(s,'abominacion');assert.equal(c.revelacionIndependiente.spawn.motivo,'limite');assert.equal(c.resolucionAbominacion,'sin-efecto');assert.equal(c.activaciones.length,0);
});
test('independientes: abominaciones aumentan y reinician su propia probabilidad de Spawn',()=>{
 const s=crear({activacion:opcion('nunca'),spawn:{...opcion('probabilidad',20),incremento:15,maximo:60}},'abominaciones');
 revelar(s,'abominacion');revelar(s,'abominacion',[.99]);assert.equal(probabilidadSpawnEnemigo(s,'abominaciones'),35);
 const c=revelar(s,'abominacion',[.1,0]);assert.equal(c.resolucionAbominacion,'spawn');assert.equal(c.activaciones.length,0);assert.equal(probabilidadSpawnEnemigo(s,'abominaciones'),20);
});
test('independientes: activaciones de abominaciones siempre ocurren aunque no se haga Spawn',()=>{
 const s=crear({activacion:opcion('siempre'),spawn:{...opcion('nunca'),incremento:0,maximo:100}},'abominaciones');
 revelar(s,'abominacion');const c=revelar(s,'abominacion');assert.equal(c.activaciones.length,1);assert.equal(c.revelacionIndependiente.spawn.resultado,'nunca');assert.equal(c.resolucionAbominacion,'activacion');
});
test('independientes: activar o cambiar parámetros se aplica desde próxima tanda sin reescribir historia',()=>{
 const s=crear();revelar(s);revelar(s);const historia=structuredClone(s.history);
 cambiar(s,perfil({spawn:{...opcion('probabilidad',5),incremento:2,maximo:60}}));assert.equal(probabilidadSpawnEnemigo(s,'nigromantes'),35);assert.deepEqual(s.history,historia);
 const c=revelar(s);assert.equal(c.revelacionIndependiente.spawn.probabilidad,35);assert.equal(probabilidadSpawnEnemigo(s,'nigromantes'),37);assert.deepEqual(s.history.slice(0,2),historia);
 revelar(s,'nigromante',[.1,0]);assert.equal(probabilidadSpawnEnemigo(s,'nigromantes'),5);
});

test('independientes: regenerar un enemigo no repite activaciones ni modifica el resultado del sorteo',()=>{
 for(const mazo of ['nigromantes','abominaciones']){
  const p=mazo==='nigromantes'?perfil({profanador:opcion('siempre'),spawn:{...opcion('siempre'),incremento:0,maximo:100}}):{activacion:opcion('siempre'),spawn:{...opcion('siempre'),incremento:0,maximo:100}};
  const s=crear(p,mazo),tipo=mazo==='nigromantes'?'nigromante':'abominacion';revelar(s,tipo);const c=revelar(s,tipo);
  const antes=structuredClone(c.revelacionIndependiente),activaciones=structuredClone(c.activaciones),uid=c[mazo][0].uid;
  (mazo==='nigromantes'?regenerarNigromante:regenerarAbominacion)(s,uid,()=>.99);
  assert.deepEqual(c.revelacionIndependiente,antes);assert.deepEqual(c.activaciones,activaciones);assert.ok(isValid(s));
 }
});

function prepararGrupo(mazo,calcularPor){
 const siempre={...opcion('siempre'),incremento:0,maximo:100},nunca={...opcion('nunca'),incremento:0,maximo:100};
 const s=crear(mazo==='nigromantes'?perfil({spawn:siempre}):{activacion:opcion('nunca'),spawn:siempre},mazo);
 const tipo=mazo==='nigromantes'?'nigromante':'abominacion';
 revelar(s,tipo);revelar(s,tipo);if(mazo==='nigromantes')revelar(s,tipo);
 const activacion={...opcion('probabilidad',50),calcularPor};
 cambiar(s,mazo==='nigromantes'?perfil({profanador:opcion('probabilidad',50),otros:activacion,spawn:nunca}):{activacion,spawn:nunca},mazo);
 return s;
}

test('Calcular por: otros nigromantes juntos usan un único sorteo y excluyen al Profanador',()=>{
 for(const [valores,esperadas] of [[[.1,.9],[true,false,false]],[[.9,.1],[false,true,true]]]){
  const s=prepararGrupo('nigromantes','juntos'),c=revelar(s,'nigromante',valores);
  assert.deepEqual(c.revelacionIndependiente.activaciones.map(a=>a.activada),esperadas);
  const adicionales=c.revelacionIndependiente.activaciones.filter(a=>a.cardId!==PROFANADOR);assert.equal(adicionales.length,2);assert.equal(new Set(adicionales.map(a=>a.activada)).size,1);
 }
});
test('Calcular por: abominaciones juntas se activan todas o ninguna con un solo sorteo',()=>{
 for(const [valor,esperada] of [[.1,true],[.9,false]]){
  const s=prepararGrupo('abominaciones','juntos'),c=revelar(s,'abominacion',[valor]);
  assert.equal(c.revelacionIndependiente.activaciones.length,2);assert.ok(c.revelacionIndependiente.activaciones.every(a=>a.activada===esperada));
  assert.equal(c.activaciones.length,esperada?2:0);
 }
});
test('Calcular por: abominaciones independientes pueden tener resultados diferentes',()=>{
 const s=prepararGrupo('abominaciones','independiente'),c=revelar(s,'abominacion',[.1,.9]);
 assert.deepEqual(c.revelacionIndependiente.activaciones.map(a=>a.activada),[true,false]);assert.equal(c.activaciones.length,1);
});
test('Calcular por: validar cálculo y rechazar resultados mixtos de un sorteo conjunto',()=>{
 const s=prepararGrupo('abominaciones','juntos'),c=revelar(s,'abominacion',[.1]);
 for(const valor of [null,'otro',false]){const roto=structuredClone(s);roto.config.revelacionEnemigos.abominaciones.activacion.calcularPor=valor;assert.equal(isValid(roto),false);}
 const roto=structuredClone(s),origen=roto.history.at(-1).slots[0].draws[0];origen.revelacionIndependiente.activaciones[0].activada=false;origen.activaciones.shift();assert.equal(isValid(roto),false);
 assert.equal(c.activaciones.length,2);assert.deepEqual(recuperar({getItem:k=>k===KEY?JSON.stringify(s):null}),s);
});
test('Calcular por: cambiar a conjunto afecta la próxima tanda y conserva resultados históricos',()=>{
 const s=prepararGrupo('abominaciones','independiente');revelar(s,'abominacion',[.1,.9]);const historia=structuredClone(s.history);
 const p=structuredClone(s.proximaConfig.revelacionEnemigos.abominaciones);p.activacion.calcularPor='juntos';cambiar(s,p,'abominaciones');assert.deepEqual(s.history,historia);
 const c=revelar(s,'abominacion',[.1]);assert.ok(c.revelacionIndependiente.activaciones.every(a=>a.activada));assert.deepEqual(s.history.slice(0,historia.length),historia);assert.ok(isValid(s));
});
