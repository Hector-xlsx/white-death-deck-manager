import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,discardCard,replaceCard,anularTanda,elegirNigromante,isValid} from '../dist/engine.js';
import {cambiarNivelAdrenalina} from '../dist/adrenalina.js';
import {probabilidadDaily,probabilidadEfectivaDaily,puntosAcumuladosDaily,parametrosDaily} from '../dist/daily.js';
import {recuperar,guardarAccion,KEY} from '../dist/persistencia.js';
const perfil=()=>({azul:{base:20,incremento:20},amarillo:{base:30,incremento:5},naranja:{base:10,incremento:10},rojo:{base:40,incremento:15}});
const crear=(c={},zonas=1)=>newGame({easy:true,normal:true,threshold:0,selectedIds:['asedio'],dailyHabilitado:true,dailyPorNivel:perfil(),dailyIncrementoPor:'carta',...c},zonas);
const azar=valores=>()=>{assert.ok(valores.length,'RNG adicional inesperado');return valores.shift();};
const cerrar=s=>{s.openBatch=false;};
const intentos=s=>s.history.at(-1).slots.flatMap(t=>t.draws).filter(c=>c.dailyIntento).map(c=>c.dailyIntento.probabilidad);
function almacen(s){let bytes=JSON.stringify(s);return {getItem:k=>k===KEY?bytes:null,setItem:(k,v)=>{bytes=v;}};}

test('Daily por adrenalina: conserva puntos acumulados al subir y bajar, sin recalcular incrementos antiguos',()=>{
 const s=crear();spawn(s,azar([0,.99]));assert.equal(probabilidadDaily(s),40);cerrar(s);
 cambiarNivelAdrenalina(s,1);assert.equal(probabilidadDaily(s),50);
 spawn(s,azar([0,.99]));assert.deepEqual(intentos(s),[50]);assert.equal(puntosAcumuladosDaily(s),25);assert.equal(probabilidadDaily(s),55);cerrar(s);
 cambiarNivelAdrenalina(s,1);assert.equal(probabilidadDaily(s),35);cambiarNivelAdrenalina(s,-1);assert.equal(probabilidadDaily(s),55);
 assert.ok(isValid(s));
});
test('Daily por adrenalina: intento por carta incrementa y una aparicion reinicia el aumento',()=>{
 const s=crear({},3);spawn(s,azar([0,.99,0,.99,0,.1,0]));
 assert.deepEqual(intentos(s),[20,40,60]);assert.equal(s.pins.length,1);assert.equal(puntosAcumuladosDaily(s),0);assert.equal(probabilidadDaily(s),20);cerrar(s);
 cambiarNivelAdrenalina(s,1);assert.equal(probabilidadDaily(s),30);assert.ok(isValid(s));
});
test('Daily por adrenalina: incremento por tanda usa su nivel una sola vez y conserva el aumento entre niveles',()=>{
 const s=crear({dailyIncrementoPor:'tanda'},2);spawn(s,azar([0,.99,0,.99]));assert.deepEqual(intentos(s),[20,20]);assert.equal(probabilidadDaily(s),40);cerrar(s);
 cambiarNivelAdrenalina(s,1);spawn(s,azar([0,.99,0,.99]));assert.deepEqual(intentos(s),[50,50]);assert.equal(probabilidadDaily(s),55);cerrar(s);
 cambiarNivelAdrenalina(s,1);assert.equal(probabilidadDaily(s),35);assert.ok(isValid(s));
});
test('Daily por adrenalina: probabilidad maxima 100 conserva el incremento ganado al bajar la base',()=>{
 const p=perfil();p.azul={base:90,incremento:20};const s=crear({dailyPorNivel:p});spawn(s,azar([0,.99]));assert.equal(probabilidadDaily(s),100);assert.equal(puntosAcumuladosDaily(s),20);cerrar(s);
 cambiarNivelAdrenalina(s,1);assert.equal(probabilidadDaily(s),50);
});
test('Daily por adrenalina: base cero no sortea; base 100 garantiza y todos en juego bloquean',()=>{
 const p=perfil();p.azul={base:0,incremento:20};const s=crear({dailyPorNivel:p},2);spawn(s,azar([0,0,.99]));assert.deepEqual(intentos(s),[0,20]);assert.equal(probabilidadDaily(s),40);assert.ok(isValid(s));
 p.azul={base:100,incremento:20};const f=crear({dailyPorNivel:p},7);spawn(f,()=>0);assert.equal(f.pins.length,7);assert.equal(probabilidadEfectivaDaily(f),0);f.normal=1;spawn(f,azar([0,0]));assert.equal(f.history.at(-1).bakeDanuki.dado,1);assert.equal(f.history.at(-1).slots[0].draws[0].dailyIntento.resultado,'bloqueado');assert.equal(puntosAcumuladosDaily(f),0);assert.ok(isValid(f));
});
test('Daily por adrenalina: sin elegibles solo el modo tanda aporta su incremento',()=>{
 for(const modo of ['carta','tanda']){const s=crear({selectedIds:['activacion-caminantes'],dailyIncrementoPor:modo});spawn(s,azar([0]));assert.equal(probabilidadDaily(s),modo==='tanda'?40:20);assert.ok(isValid(s));}
});
test('Daily por adrenalina: cancelar fallo o aparicion revierte su aporte sin perder el previo',()=>{
 const s=crear();spawn(s,azar([0,.99]));spawn(s,azar([0,.1,0]));assert.equal(probabilidadDaily(s),20);
 discardCard(s,2,'t2-z1');assert.equal(probabilidadDaily(s),40);assert.equal(s.pins.length,0);assert.ok(isValid(s));
 const f=crear();spawn(f,azar([0,.99]));discardCard(f,1,'t1-z1');assert.equal(probabilidadDaily(f),20);assert.ok(isValid(f));
});
test('Daily por adrenalina: regenerar una tanda antigua usa su base aunque el selector ya cambio',()=>{
 const s=crear();spawn(s,azar([0,.99]));cerrar(s);cambiarNivelAdrenalina(s,1);
 replaceCard(s,1,'t1-z1',azar([0,.99]));assert.equal(s.history[0].nivelAdrenalina,'azul');assert.equal(s.history[0].slots[0].draws.at(-1).dailyIntento.probabilidad,20);assert.equal(probabilidadDaily(s),50);assert.ok(isValid(s));
});
test('Daily por adrenalina: eleccion tardia usa el nivel de su tanda y no duplica el incremento',()=>{
 const s=crear({selectedIds:['nigromante','asedio'],modoNigromantes:'sin-reposicion',selectedNigromantesIds:['enemigo-ostokar-el-palido','enemigo-bomoh'],dailyIncrementoPor:'tanda'});
 spawn(s,azar([0,0,.99,.99]));cerrar(s);cambiarNivelAdrenalina(s,1);spawn(s,azar([0,.99,.99]));
 const origen=s.history[1].slots[0].draws[0];cerrar(s);cambiarNivelAdrenalina(s,1);
 elegirNigromante(s,origen.uid,'spawn',azar([0,.99,.99]));assert.deepEqual(intentos(s),[50,50]);assert.equal(puntosAcumuladosDaily(s),25);assert.equal(probabilidadDaily(s),35);assert.ok(isValid(s));
});
test('Daily por adrenalina: anular restaura exactamente nivel, probabilidad y configuracion anteriores',()=>{
 const s=crear();spawn(s,azar([0,.99]));cerrar(s);cambiarNivelAdrenalina(s,1);const antes=structuredClone(s);antes.respaldoTanda=null;
 spawn(s,azar([0,.99]));cerrar(s);cambiarNivelAdrenalina(s,1);anularTanda(s);assert.deepEqual(s,antes);assert.equal(probabilidadDaily(s),50);assert.ok(isValid(s));
});
test('Daily por adrenalina: recarga, cuota y configuracion futura conservan la partida congelada',()=>{
 const s=crear();spawn(s,azar([0,.99]));cerrar(s);cambiarNivelAdrenalina(s,1);const a=almacen(s),antes=structuredClone(s);
 assert.deepEqual(recuperar(a),antes);assert.equal(probabilidadDaily(recuperar(a)),50);
 assert.throws(()=>guardarAccion(s,n=>spawn(n,()=>.99),{setItem(){throw new Error('Quota');}}));assert.deepEqual(s,antes);
 const siguiente=guardarAccion(s,n=>{n.proximaConfig.dailyPorNivel.amarillo.base=90;},a);assert.equal(probabilidadDaily(siguiente),50);assert.equal(siguiente.config.dailyPorNivel.amarillo.base,30);assert.equal(newGame(siguiente.proximaConfig).config.dailyPorNivel.amarillo.base,90);
});
test('Daily por adrenalina: configuracion general anterior conserva tasas y bytes, nueva partida opta por niveles',()=>{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['asedio'],dailyHabilitado:true,dailyBase:20,dailyIncremento:20,dailyIncrementoPor:'carta'},1);spawn(s,azar([0,.99]));cerrar(s);const a=almacen(s),bytes=a.getItem(KEY);
 assert.deepEqual(recuperar(a),s);assert.equal(a.getItem(KEY),bytes);cambiarNivelAdrenalina(s,1);assert.equal(probabilidadDaily(s),40);assert.deepEqual(parametrosDaily(s.config,'rojo'),{base:20,incremento:20});
 s.proximaConfig.dailyPorNivel=perfil();assert.equal(probabilidadDaily(s),40);const nueva=newGame(s.proximaConfig);assert.equal(probabilidadDaily(nueva),20);assert.ok(isValid(s));assert.ok(isValid(nueva));
});
test('Daily por adrenalina: valida cuatro pares completos y no comparte el perfil con el input',()=>{
 const p=perfil(),s=crear({dailyPorNivel:p});p.azul.base=99;assert.equal(s.config.dailyPorNivel.azul.base,20);
 for(const cambiar of [n=>n.config.dailyPorNivel=null,n=>n.config.dailyPorNivel=[],n=>delete n.config.dailyPorNivel.rojo,n=>n.config.dailyPorNivel.verde={base:0,incremento:0},n=>n.config.dailyPorNivel.azul.base=101,n=>n.config.dailyPorNivel.azul.incremento=-1,n=>n.proximaConfig.dailyPorNivel.naranja.base=NaN]){
  const roto=structuredClone(s);cambiar(roto);assert.equal(isValid(roto),false);
 }
 assert.throws(()=>crear({dailyPorNivel:{azul:{base:20,incremento:20}}}));
});
