import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,replaceCard,discardCard,addZoneCard,anularTanda,programarConfiguracion,isValid,regenerarDaily} from '../dist/engine.js';
import {configDailyValida,aparicionesDailyTanda,probabilidadDaily,puntosAcumuladosDaily} from '../dist/daily.js';
import {regenerarEspecial} from '../dist/especial.js';
import {guardarAccion,recuperar,KEY} from '../dist/persistencia.js';
const crear=(extra={},zonas=3)=>newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado',dailyHabilitado:true,dailyBase:100,dailyIncremento:10,dailyIncrementoPor:'carta',...extra},zonas);
const generales=s=>s.history.at(-1).slots.flatMap(t=>t.draws);
test('Daily: máximo general suspende intentos e incrementos sin consumir azar extra',()=>{
 const s=crear({dailyLimite:1});let azar=0;spawn(s,()=>{azar++;return 0;});
 assert.equal(azar,4);assert.equal(aparicionesDailyTanda(s),1);assert.deepEqual(generales(s).map(c=>c.dailyIntento.resultado),['spawn','limite','limite']);assert.equal(puntosAcumuladosDaily(s),0);assert.equal(probabilidadDaily(s),100);assert.ok(isValid(s));
});
test('Daily: general vacío conserva comportamiento anterior y nueva tanda renueva el cupo',()=>{
 for(const dailyLimite of [undefined,null]){const s=crear({dailyLimite});spawn(s,()=>0);assert.equal(aparicionesDailyTanda(s),3);assert.ok(isValid(s));}
 const s=crear({dailyLimite:1});spawn(s,()=>0);spawn(s,()=>0);assert.equal(aparicionesDailyTanda(s),1);assert.equal(s.history[0].slots[1].draws[0].dailyIntento.resultado,'limite');assert.ok(isValid(s));
});
test('Daily: perfil por nivel tiene prioridad y congela el nivel de la tanda',()=>{
 const limites={azul:1,amarillo:2,naranja:null,rojo:3};
 for(const [nivel,esperado] of [['azul',1],['amarillo',2],['naranja',3],['rojo',3]]){
  const s=crear({dailyLimite:1,dailyLimitesPorNivel:limites});s.nivelAdrenalina=nivel;spawn(s,()=>0);assert.equal(aparicionesDailyTanda(s),esperado);s.nivelAdrenalina='rojo';addZoneCard(s,1,'normal',()=>0);assert.equal(aparicionesDailyTanda(s),nivel==='naranja'?4:esperado);assert.ok(isValid(s));
 }
});
test('Daily: regenerar mantiene un cupo, cancelar lo libera sin repetir intentos ya resueltos',()=>{
 const s=crear({dailyLimite:1});spawn(s,()=>0);const uid=generales(s)[0].daily[0].uid;regenerarDaily(s,uid,()=>0);assert.equal(aparicionesDailyTanda(s),1);
 discardCard(s,1,0);assert.equal(aparicionesDailyTanda(s),0);assert.equal(generales(s)[1].dailyIntento.resultado,'limite');addZoneCard(s,1,'normal',()=>0);assert.equal(aparicionesDailyTanda(s),1);assert.ok(isValid(s));
 replaceCard(s,1,3,()=>0);assert.equal(aparicionesDailyTanda(s),1);assert.ok(isValid(s));
});
test('Daily: guardar límite adopta próxima tanda, conserva histórico y anulación completa',()=>{
 const s=crear();spawn(s,()=>0);s.openBatch=false;const b=structuredClone(s.history[0]);programarConfiguracion(s,{...s.proximaConfig,dailyLimite:1});const antes=structuredClone(s);spawn(s,()=>0);
 assert.equal(aparicionesDailyTanda(s),1);assert.deepEqual(s.history[0],b);assert.ok(isValid(s));anularTanda(s);assert.deepEqual(s,{...antes,respaldoTanda:null,openBatch:false});
});
test('Daily: integrado respeta cuota propia sin bloquear otros resultados del Especial',()=>{
 for(const modo of ['disparadores','probabilidad']){
  const s=crear({dailyLimite:1,selectedIds:['caminantes-normal','spawn-559'],spawnEspecial:{modo,daily:'integrado',base:100,cantidades:{'daily-du01':100},limite:2}},3);
  for(const id of Object.keys(s.remaining))s.remaining[id]=id===(modo==='disparadores'?'spawn-especial':'caminantes-normal')?3:0;
  spawn(s,()=>.5);assert.equal(aparicionesDailyTanda(s),1);assert.ok(generales(s).some(c=>c.especial?.length));assert.ok(isValid(s));
  const daily=generales(s).flatMap(c=>c.daily||[])[0];regenerarEspecial(s,daily.uid,()=>.5);assert.ok(aparicionesDailyTanda(s)<=1);assert.ok(isValid(s));
 }
});
test('Daily: registros de límite se guardan, recuperan y anulan atómicamente',()=>{
 const a={valor:null,getItem(){return this.valor;},setItem(k,v){assert.equal(k,KEY);this.valor=v;}};let s=guardarAccion(crear({dailyLimite:1}),n=>spawn(n,()=>0),a);assert.deepEqual(recuperar(a),s);const bytes=JSON.stringify(s);
 assert.throws(()=>guardarAccion(s,n=>anularTanda(n),{setItem(){throw Error('cuota');}}));assert.equal(JSON.stringify(s),bytes);
 s=guardarAccion(s,n=>anularTanda(n),a);assert.equal(s.history.length,0);assert.equal(s.registroActividad.eventos.at(-1).tipo,'tanda-anulada');assert.ok(isValid(s));
});
test('Daily: rechaza máximos inválidos y snapshots que exceden el límite',()=>{
 for(const v of [0,-1,1.5,NaN,Infinity,'2'])assert.equal(configDailyValida({dailyLimite:v}),false);
 for(const v of [null,{},[],{azul:1,amarillo:1,naranja:1,rojo:0}])assert.equal(configDailyValida({dailyLimitesPorNivel:v}),false);
 const s=crear();spawn(s,()=>0);s.history[0].configLimitesDaily={dailyLimite:1};assert.equal(isValid(s),false);
});
