import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,anularTanda,replaceCard,regenerarAbominacion,regenerarNigromante,regenerarDaily,programarConfiguracion,isValid} from '../dist/engine.js';
import {guardarAccion,KEY,recuperar} from '../dist/persistencia.js';
import {prepararExportacion} from '../dist/exportacion.js';
const almacen=()=>({valor:null,getItem(){return this.valor;},setItem(k,v){assert.equal(k,KEY);this.valor=v;}});
const inicial=()=>newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'},1);
test('registro conserva spawn, reemplazo y anulación tras recuperar y repetir el mismo número de tanda',()=>{
 const a=almacen();let s=inicial();
 s=guardarAccion(s,n=>spawn(n,()=>0),a);
 const primera=s.history[0],inicio=s.registroActividad.iniciadoEn;
 assert.equal(s.registroActividad.eventos[0].tipo,'spawn');
 assert.equal(s.registroActividad.eventos[0].generadaEn,primera.date);
 assert.equal(s.respaldoTanda.estado.registroActividad,undefined);
 s=guardarAccion(s,n=>replaceCard(n,1,0,()=>0),a);
 s=guardarAccion(s,n=>anularTanda(n),a);
 assert.equal(s.history.length,0);assert.equal(s.registroActividad.eventos.length,3);
 const anulacion=s.registroActividad.eventos[2];assert.equal(anulacion.tipo,'tanda-anulada');
 assert.deepEqual(anulacion.cambios.find(c=>c.ruta.join('/')==='history/0').antes.slots[0].draws.length,2);
 s=recuperar(a);s=guardarAccion(s,n=>spawn(n,()=>0),a);
 assert.equal(s.history[0].number,1);assert.equal(s.registroActividad.eventos.length,4);assert.equal(s.registroActividad.iniciadoEn,inicio);
 assert.ok(isValid(s));assert.deepEqual(JSON.parse(prepararExportacion(s).contenido).partida.registroActividad,s.registroActividad);
});
test('registro conserva selección inicial y cambios de configuración sin inventar actividad pasada',()=>{
 const a=almacen();let s=inicial();spawn(s,()=>0);s.openBatch=false;
 const previo=structuredClone(s);
 s=guardarAccion(s,n=>programarConfiguracion(n,{...n.proximaConfig,threshold:15}),a);
 assert.deepEqual(s.registroActividad.estadoInicial,(()=>{const {respaldoTanda,...resto}=previo;return resto;})());
 assert.equal(s.registroActividad.eventos[0].tipo,'configuracion');
 assert.ok(s.registroActividad.eventos[0].cambios.some(c=>c.ruta.join('/')==='proximaConfig/threshold'&&c.despues===15));
});
test('registro no se confirma ante cuota o conflicto; nueva partida inicia registro propio',()=>{
 const a=almacen();let s=guardarAccion(inicial(),n=>spawn(n,()=>0),a);const bytes=JSON.stringify(s);
 assert.throws(()=>guardarAccion(s,n=>anularTanda(n),{setItem(){throw Error('cuota');}}),/cuota/);assert.equal(JSON.stringify(s),bytes);
 assert.throws(()=>guardarAccion(s,n=>anularTanda(n),a,{esperado:'otra'}),e=>e.code==='PARTIDA_CAMBIADA');
 s=guardarAccion(s,n=>{for(const k of Object.keys(n))delete n[k];Object.assign(n,inicial());},a,{nuevaPartida:true});
 assert.equal(s.registroActividad.eventos.length,1);assert.equal(s.registroActividad.eventos[0].tipo,'nueva-partida');assert.equal(s.registroActividad.estadoInicial.history.length,0);
});
test('registro conserva regeneraciones de Abominaciones, Nigromantes y Daily',()=>{
 for(const [mazo,carta,config,regenerar] of [
  ['abominaciones','abominacion',{modoAbominaciones:'sin-reposicion'},regenerarAbominacion],
  ['nigromantes','nigromante',{modoNigromantes:'sin-reposicion'},regenerarNigromante],
  ['daily','asedio',{dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta'},regenerarDaily]
 ]){
  const a=almacen();let s=newGame({easy:true,normal:true,threshold:0,selectedIds:[carta],...config},1);
  s=guardarAccion(s,n=>spawn(n,()=>0),a);
  const original=s.history[0].slots[0].draws[0][mazo][0];
  s=guardarAccion(s,n=>regenerar(n,original.uid,()=>.99),a);
  const evento=s.registroActividad.eventos.at(-1);assert.equal(evento.tipo,'cambio-cartas');
  assert.ok(evento.cambios.some(c=>c.ruta.includes(mazo)&&c.ruta.includes('anulada')&&c.despues===true),mazo);
  assert.ok(isValid(recuperar(a)));
 }
});
