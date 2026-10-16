import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,elegirAbominacion,elegirNigromante,regenerarAbominacion,regenerarNigromante,discardCard,unpinCard,anularTanda,isValid,total} from '../dist/engine.js';
import {limitesIniciales,erroresLimites,contarEnemigos,adoptarLimites} from '../dist/limites.js';
import {cambiarNivelAdrenalina} from '../dist/adrenalina.js';
import {recuperar,guardarAccion,KEY} from '../dist/persistencia.js';
const crear=(c={},zonas=1)=>newGame({easy:true,normal:true,threshold:0,selectedIds:['asedio'],modoNigromantes:'sin-reposicion',limitesPorAdrenalina:limitesIniciales(),...c},zonas);
const perfil=valor=>({nigromantes:{azul:valor,amarillo:valor,naranja:valor,rojo:valor},abominaciones:{azul:valor,amarillo:valor,naranja:valor,rojo:valor}});
const cerrar=s=>{s.openBatch=false;};
const rng=valores=>()=>{assert.ok(valores.length,'RNG extra inesperado');return valores.shift();};
const cartas=s=>s.history.at(-1).slots.filter(t=>!t.anulada).flatMap(t=>t.draws.slice(-1));
function almacen(s){let bytes=JSON.stringify(s);return {getItem:k=>k===KEY?bytes:null,setItem:(k,v)=>{bytes=v;}};}

test('limites: datos confirmados y perfiles positivos no decrecientes por familia',()=>{
 assert.deepEqual(limitesIniciales(),{nigromantes:{azul:1,amarillo:1,naranja:2,rojo:2},abominaciones:{azul:1,amarillo:2,naranja:3,rojo:4}});
 assert.deepEqual(erroresLimites(limitesIniciales()),[]);const p=perfil(1);p.nigromantes.naranja=3;assert.ok(erroresLimites(p)[0].includes('nigromantes'));
 for(const cambiar of [p=>p.abominaciones.azul=0,p=>p.abominaciones.rojo=1.5,p=>p.abominaciones.rojo=Infinity,p=>delete p.nigromantes.rojo,p=>p.daily={}]){const p=limitesIniciales();cambiar(p);assert.ok(erroresLimites(p).length);}
});
test('limites: abominaciones al maximo activan sin elecciones ni RNG secundario en ambos modos',()=>{
 for(const modo of ['con-reposicion','sin-reposicion']){
  const s=crear({selectedIds:['abominacion'],modoAbominaciones:modo},3);s.accionesPredeterminadas={abominacion:'azar'};let llamadas=0;
  spawn(s,()=>{llamadas++;return 0;});assert.equal(llamadas,4);assert.equal(s.pins.length,1);assert.equal(total(s.remaining),3);
  assert.deepEqual(cartas(s).map(c=>c.resolucionAbominacion),['spawn','activacion','activacion']);assert.ok(cartas(s).slice(1).every(c=>c.activacionPorLimite===1));assert.ok(isValid(s));
 }
});
test('limites: nigromante nuevo suma su zona, la cadena y otros origenes se detienen en el tope',()=>{
 const s=crear({selectedIds:['nigromante']},3);s.accionesPredeterminadas={nigromante:'azar'};let llamadas=0;
 spawn(s,()=>{llamadas++;return 0;});assert.equal(llamadas,5);assert.equal(s.pins.length,1);assert.equal(s.necro,1);assert.equal(s.history[0].slots.length,4);assert.equal(total(s.remaining),5);
 assert.equal(cartas(s).filter(c=>c.activacionPorLimite===1).length,3);assert.ok(isValid(s));
});
for(const [mazo,tipo,topes] of [['nigromantes','nigromante',[1,1,2,2]],['abominaciones','abominacion',[1,2,3,4]]])test(`limites: ${mazo} respeta los cuatro topes con aparicion automatica`,()=>{
 for(let nivel=0;nivel<4;nivel++){
  const s=crear({selectedIds:[tipo]},mazo==='nigromantes'?1:6);s.accionesPredeterminadas={[tipo]:'spawn'};
  for(let i=0;i<nivel;i++)cambiarNivelAdrenalina(s,1);spawn(s,()=>0);
  assert.equal(contarEnemigos(s,mazo),topes[nivel]);assert.equal(s.history[0].limitesEnemigos[mazo],topes[nivel]);assert.ok(isValid(s));
 }
});
test('limites: las dos familias se cuentan independientemente en una tanda mixta',()=>{
 const s=crear({selectedIds:['nigromante','abominacion']},2);spawn(s,rng([.99,0,0,0,.99]));
 assert.equal(contarEnemigos(s,'nigromantes'),1);assert.equal(contarEnemigos(s,'abominaciones'),1);assert.equal(s.necro,1);assert.equal(s.history[0].slots.length,3);assert.ok(isValid(s));
});
test('limites: al completar el tope una eleccion resuelve otros pendientes sin sortear de nuevo',()=>{
 const s=crear({selectedIds:['abominacion'],limitesPorAdrenalina:perfil(2)},3);spawn(s,()=>0);
 const pendientes=cartas(s).filter(c=>c.resolucionAbominacion==='pendiente');assert.equal(pendientes.length,2);
 elegirAbominacion(s,pendientes[0].uid,'spawn',()=>.99);assert.equal(s.pins.length,2);assert.equal(pendientes[1].resolucionAbominacion,'activacion');assert.equal(pendientes[1].activacionPorLimite,2);
 const antes=structuredClone(s);elegirAbominacion(s,pendientes[1].uid,'spawn',()=>{throw Error('RNG indebido');});assert.deepEqual(s,antes);assert.ok(isValid(s));
});
test('limites: una eleccion de nigromante completa el maximo y activa su general derivada',()=>{
 const s=crear({selectedIds:['nigromante'],limitesPorAdrenalina:perfil(2)});spawn(s,()=>0);
 const c=cartas(s).find(c=>c.resolucionNigromante==='pendiente');assert.ok(c);elegirNigromante(s,c.uid,'spawn',()=>0);
 assert.equal(s.pins.length,2);assert.equal(s.necro,2);assert.equal(cartas(s).at(-1).activacionPorLimite,2);assert.ok(isValid(s));
});
test('limites: guardar ajustes cambia la siguiente tanda pero no elecciones de la tanda creada',()=>{
 const s=crear({selectedIds:['abominacion'],limitesPorAdrenalina:perfil(2)},2);spawn(s,()=>0);cerrar(s);
 const pendiente=cartas(s).find(c=>c.resolucionAbominacion==='pendiente');s.config.limitesPorAdrenalina=perfil(1);s.proximaConfig.limitesPorAdrenalina=perfil(1);
 elegirAbominacion(s,pendiente.uid,'spawn',()=>.99);assert.equal(s.pins.length,2);assert.equal(s.history[0].limitesEnemigos.abominaciones,2);
 spawn(s,()=>0);assert.equal(s.history[1].limitesEnemigos.abominaciones,1);assert.equal(s.pins.length,2);assert.ok(cartas(s).every(c=>c.activacionPorLimite===1));assert.ok(isValid(s));
});
test('limites: bajar adrenalina conserva presentes y activa hasta volver a estar bajo el tope',()=>{
 const s=crear({selectedIds:['abominacion']},3);cambiarNivelAdrenalina(s,1);s.accionesPredeterminadas={abominacion:'spawn'};spawn(s,()=>0);assert.equal(s.pins.length,2);cerrar(s);cambiarNivelAdrenalina(s,-1);
 spawn(s,()=>0);assert.equal(s.pins.length,2);assert.ok(cartas(s).every(c=>c.resolucionAbominacion==='activacion'));unpinCard(s,s.pins[0].uid);assert.equal(s.pins.length,1);spawn(s,()=>0);assert.equal(s.pins.length,1);
 unpinCard(s,s.pins[0].uid);spawn(s,()=>0);assert.equal(s.pins.length,1);assert.ok(isValid(s));
});
test('limites: regenerar secundarios reemplaza la instancia y conserva el tope y las zonas',()=>{
 for(const [tipo,mazo,regenerar] of [['abominacion','abominaciones',regenerarAbominacion],['nigromante','nigromantes',regenerarNigromante]]){
  const s=crear({selectedIds:[tipo]});spawn(s,()=>0);const anterior=s.pins[0].uid;regenerar(s,anterior,()=>.99);
  assert.equal(contarEnemigos(s,mazo),1);assert.equal(s.pins.length,1);assert.notEqual(s.pins[0].uid,anterior);if(tipo==='nigromante')assert.equal(s.necro,1);assert.ok(isValid(s));
 }
});
test('limites: descartar el origen libera al enemigo sin tocar una activacion historica',()=>{
 const s=crear({selectedIds:['abominacion']},2);spawn(s,()=>0);const activacion=cartas(s)[1];discardCard(s,1,'t1-z1');assert.equal(s.pins.length,0);assert.equal(activacion.activacionPorLimite,1);
 spawn(s,()=>0);assert.equal(s.pins.length,1);assert.ok(isValid(s));
});
test('limites: anular restaura perfiles, presencia y topes anteriores junto con la tanda',()=>{
 const s=crear({selectedIds:['abominacion']});spawn(s,()=>0);cerrar(s);const antes=structuredClone(s);antes.respaldoTanda=null;
 spawn(s,()=>0);s.config.limitesPorAdrenalina=perfil(3);s.proximaConfig.limitesPorAdrenalina=perfil(3);anularTanda(s);assert.deepEqual(s,antes);assert.ok(isValid(s));
});
test('limites: recarga mantiene la resolucion, cuota y pestaña desactualizada no aceptan cambios',()=>{
 const s=crear({selectedIds:['abominacion']},2);spawn(s,()=>0);const a=almacen(s),antes=structuredClone(s),bytes=a.getItem(KEY);assert.deepEqual(recuperar(a),s);
 assert.throws(()=>guardarAccion(s,n=>{n.config.limitesPorAdrenalina=perfil(2);}, {setItem(){throw Error('Quota');}}));assert.deepEqual(s,antes);
 a.setItem(KEY,JSON.stringify({...s,normal:4}));let llamadas=0;assert.throws(()=>guardarAccion(s,n=>spawn(n,()=>{llamadas++;return 0;}),a,{esperado:bytes}),e=>e.code==='PARTIDA_CAMBIADA');assert.equal(llamadas,0);
});
test('limites: legado se conserva al leer y adopta topes solo para las tandas siguientes',()=>{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['abominacion']},3);spawn(s,()=>0);cerrar(s);const a=almacen(s),bytes=a.getItem(KEY);assert.deepEqual(recuperar(a),s);assert.equal(a.getItem(KEY),bytes);
 const historia=structuredClone(s.history);adoptarLimites(s);assert.deepEqual(s.history,historia);spawn(s,()=>0);assert.deepEqual(s.history[0],historia[0]);assert.equal(s.history[1].limitesEnemigos.abominaciones,1);assert.equal(s.pins.length,1);assert.ok(isValid(s));
});
test('limites: valida perfiles y snapshots corruptos sin cambiar los bytes originales',()=>{
 const s=crear({selectedIds:['abominacion']},2);spawn(s,()=>0);
 for(const cambiar of [n=>n.config.limitesPorAdrenalina.nigromantes.azul=3,n=>n.proximaConfig.limitesPorAdrenalina.abominaciones.azul=0,n=>n.history[0].limitesEnemigos.abominaciones=-1,n=>delete n.history[0].limitesEnemigos.nigromantes,n=>cartas(n)[1].activacionPorLimite=2,n=>delete n.history[0].nivelAdrenalina]){
  const roto=structuredClone(s);cambiar(roto);assert.equal(isValid(roto),false);const a=almacen(roto),bytes=a.getItem(KEY);assert.throws(()=>recuperar(a));assert.equal(a.getItem(KEY),bytes);
 }
});
test('limites: perfiles, topes de tanda y reinicio de partida no comparten referencias',()=>{
 const p=limitesIniciales(),s=crear({limitesPorAdrenalina:p});p.nigromantes.rojo=99;assert.equal(s.config.limitesPorAdrenalina.nigromantes.rojo,2);
 spawn(s,()=>.99);s.config.limitesPorAdrenalina.nigromantes.azul=1;s.proximaConfig.limitesPorAdrenalina=perfil(3);
 assert.equal(s.history[0].limitesEnemigos.nigromantes,1);assert.equal(newGame(s.proximaConfig).config.limitesPorAdrenalina.nigromantes.azul,3);assert.ok(isValid(s));
});
