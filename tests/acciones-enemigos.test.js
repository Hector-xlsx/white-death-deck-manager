import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,elegirNigromante,elegirAbominacion,discardCard,isValid,anularTanda,regenerarAbominacion} from '../dist/engine.js';
import {accionPorDefecto} from '../dist/acciones-enemigos.js';
import {tieneActivacionAdicional} from '../dist/presentacion.js';
import {guardarAccion,KEY,recuperar} from '../dist/persistencia.js';
const crear=tipo=>newGame({easy:true,normal:true,threshold:0,selectedIds:[tipo,'asedio'],modoNigromantes:'sin-reposicion'},1);
const actuales=s=>s.history.at(-1).slots.filter(t=>!t.anulada).flatMap(t=>t.draws.slice(-1));
function siguiente(s){spawn(s,()=>0);spawn(s,()=>0);return actuales(s).find(c=>(c.resolucionNigromante||c.resolucionAbominacion)==='pendiente');}

test('azar uniforme entre tres acciones, sin elegir, con RNG validado',()=>{
 assert.equal(accionPorDefecto({},'nigromante',()=>{throw Error();}),'elegir');
 for(const [valor,esperado] of [[0,'activacion'],[.333333,'activacion'],[1/3,'spawn'],[.666666,'spawn'],[2/3,'activacion-spawn'],[.99999,'activacion-spawn']])assert.equal(accionPorDefecto({accionesPredeterminadas:{nigromante:'azar'}},'nigromante',()=>valor),esperado);
 for(const valor of [-1,1,NaN,Infinity])assert.throws(()=>accionPorDefecto({accionesPredeterminadas:{abominacion:'azar'}},'abominacion',()=>valor));
});
for(const tipo of ['abominacion','nigromante']){
 const campo=tipo==='abominacion'?'resolucionAbominacion':'resolucionNigromante',mazo=tipo==='abominacion'?'abominaciones':'nigromantes';
 const elegir=tipo==='abominacion'?elegirAbominacion:elegirNigromante;
 test(`${tipo}: sin presencia ignora activacion/elegir/azar y genera enemigo`,()=>{
  for(const modo of ['activacion','elegir','azar']){
   const s=crear(tipo);s.accionesPredeterminadas={[tipo]:modo};let llamadas=0;
   spawn(s,()=>{llamadas++;return llamadas>=3?.99:0;});
   assert.equal(actuales(s)[0][campo],'spawn');assert.equal(actuales(s)[0].accionEnemigo,'spawn');assert.equal(s.pins.length,1);
   assert.equal(llamadas,tipo==='nigromante'?3:2);assert.ok(isValid(s));
  }
 });
 test(`${tipo}: accion automatica activa sin nuevos consumos secundarios`,()=>{
  const s=crear(tipo);spawn(s,()=>0);s.accionesPredeterminadas={[tipo]:'activacion'};
  const antes=structuredClone(s[mazo]);spawn(s,()=>0);
  assert.ok(actuales(s).every(c=>c[campo]==='activacion'));assert.deepEqual(s[mazo],antes);assert.equal(s.pins.length,1);assert.ok(isValid(s));
 });
 test(`${tipo}: elegir conserva tres elecciones idempotentes y distingue spawn de combinado`,()=>{
  for(const opcion of ['activacion','spawn','activacion-spawn']){
   const s=crear(tipo),c=siguiente(s);assert.ok(c);const antes=s.sequence;
   elegir(s,c.uid,opcion,()=>.99);const despues=structuredClone(s);elegir(s,c.uid,opcion,()=>0);assert.deepEqual(s,despues);
   assert.equal(c.accionEnemigo,opcion);assert.equal(tieneActivacionAdicional(c),opcion!=='spawn');
   assert.equal(s.sequence-antes,opcion==='activacion'?0:tipo==='nigromante'?2:1);assert.ok(isValid(s));
   const t=s.history.at(-1).slots.find(t=>t.draws.at(-1).uid===c.uid);discardCard(s,s.history.length,t.id);assert.ok(isValid(s));
  }
 });
 test(`${tipo}: automatico spawn y combinado registra resultado sin pendientes`,()=>{
  for(const opcion of ['spawn','activacion-spawn']){
   const s=crear(tipo);spawn(s,()=>0);s.accionesPredeterminadas={[tipo]:opcion};
   let llamada=0;spawn(s,()=>{llamada++;return llamada===1?0:.99;});
   const c=actuales(s)[0];assert.equal(c[campo],'spawn');assert.equal(c.accionEnemigo,opcion);assert.equal(tieneActivacionAdicional(c),opcion==='activacion-spawn');assert.ok(isValid(s));
  }
 });
 test(`${tipo}: azar guarda la eleccion real, no vuelve a sortear al recuperar`,()=>{
  const s=crear(tipo);spawn(s,()=>0);s.accionesPredeterminadas={[tipo]:'azar'};
  let i=0;spawn(s,()=>i++===0?0:.99);const c=actuales(s)[0];assert.equal(c.accionEnemigo,'activacion-spawn');
  const almacen={getItem:()=>JSON.stringify(s)};assert.deepEqual(recuperar(almacen),s);
 });
}
test('preferencias independientes, legacy intacto, validacion y respaldo',()=>{
 const s=crear('abominacion');assert.equal(s.accionesPredeterminadas,undefined);const antes=structuredClone(s);
 assert.deepEqual(recuperar({getItem:()=>JSON.stringify(s)}),antes);
 for(const mal of [null,[],{nigromante:'invalida'},{otro:'azar'}])assert.equal(isValid({...s,accionesPredeterminadas:mal}),false);
 s.accionesPredeterminadas={nigromante:'spawn',abominacion:'activacion'};const previo=structuredClone(s);spawn(s,()=>0);
 s.accionesPredeterminadas.abominacion='azar';anularTanda(s);assert.deepEqual(s.accionesPredeterminadas,previo.accionesPredeterminadas);
});
test('regenerar abominacion mantiene accion combinada elegida',()=>{
 const s=crear('abominacion'),c=siguiente(s);elegirAbominacion(s,c.uid,'activacion-spawn',()=>0);
 regenerarAbominacion(s,c.abominaciones.at(-1).uid,()=>0);assert.equal(c.accionEnemigo,'activacion-spawn');assert.ok(isValid(s));
});
test('legado v1: cadena interminable aborta accion atomicamente sin cambiar partida ni almacenamiento',()=>{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante'],modoNigromantes:'sin-reposicion'},1);s.nigromantes.version=1;s.accionesPredeterminadas={nigromante:'spawn'};const antes=structuredClone(s),json=JSON.stringify(s);
 const almacen={getItem:k=>k===KEY?json:null,setItem(){assert.fail('No guardar una cadena incompleta');}};
 assert.throws(()=>guardarAccion(s,p=>spawn(p,()=>0),almacen),e=>e.code==='CADENA_AUTOMATICA');assert.deepEqual(s,antes);
});
