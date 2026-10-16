import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,unpinCard,anularTanda,isValid,discardCard} from '../dist/engine.js';
import {registrarDerrota} from '../dist/derrotas.js';
import {filaPuntaje} from '../dist/formula-puntaje.js';
import {resumenPuntaje} from '../dist/puntaje.js';
import {transformarMummRa,MUMM_A,MUMM_N} from '../dist/reglas-cartas.js';
import {BAKE_DANUKI} from '../dist/bake-danuki.js';
import {guardarAccion,recuperar,KEY} from '../dist/persistencia.js';
const crear=(extra={})=>newGame({easy:true,normal:true,threshold:0,selectedIds:['abominacion','nigromante','caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'estandar',...extra},1);
function revelar(s,id,rng=()=>0){for(const k of Object.keys(s.remaining))s.remaining[k]=k===id?s.initial[k]:0;spawn(s,rng);}
test('tabla: todos los turnos, máximo 6+, y captura independiente de cambios posteriores',()=>{
 for(const [tipo,id,base] of [['abominaciones','abominacion',12],['nigromantes','nigromante',10]])for(const turnos of [0,1,2,3,4,5,6,9]){
  const s=crear();revelar(s,id);const c=s.pins.find(p=>p.mazo===tipo);for(let i=0;i<turnos;i++)revelar(s,'caminantes-normal');
  registrarDerrota(s,c.uid);const r=s.derrotasEnemigos[0];assert.equal(r.turnosEnJuego,turnos);assert.equal(r.puntos,base*[5,4,3,2.5,2,1.5,1][Math.min(6,turnos)]);assert.ok(isValid(s));
  const puntos=r.puntos;revelar(s,'caminantes-normal');assert.equal(s.derrotasEnemigos[0].puntos,puntos);
 }
});
test('reapariciones sin retirada conservan tiempo y aplican factor de tabla desde segunda derrota',()=>{
 const s=crear();revelar(s,'abominacion');const uid=s.pins[0].uid;registrarDerrota(s,uid,{reaparicion:true});revelar(s,'caminantes-normal');
 const fila=filaPuntaje('abominaciones',1),anterior=fila.reeliminacion;
 try{fila.reeliminacion=.5;registrarDerrota(s,uid,{reaparicion:true});assert.equal(s.derrotasEnemigos[1].puntos,24);assert.equal(s.derrotasEnemigos[1].numeroEliminacion,2);assert.equal(s.derrotasEnemigos[1].turnosEnJuego,1);}finally{fila.reeliminacion=anterior;}
 assert.equal(s.derrotasEnemigos[0].puntos,60);assert.ok(isValid(s));
});
test('una nueva aparición después de salir del juego comienza con turno cero y primera eliminación',()=>{
 const s=crear();revelar(s,'abominacion');const uid=s.pins[0].uid;revelar(s,'caminantes-normal');unpinCard(s,uid,false,false,'derrota');assert.equal(s.derrotasEnemigos[0].puntos,48);
 revelar(s,'abominacion');const otro=s.pins.find(p=>p.mazo==='abominaciones');assert.notEqual(otro.uid,uid);unpinCard(s,otro.uid,false,false,'derrota');assert.equal(s.derrotasEnemigos[1].turnosEnJuego,0);assert.equal(s.derrotasEnemigos[1].numeroEliminacion,1);assert.equal(s.derrotasEnemigos[1].puntos,60);
});
test('Mumm-Ra pausa y retoma Nigromante, reinicia forma derrotada y puntúa ambas en una ronda',()=>{
 const s=crear({selectedAbominacionesIds:[MUMM_A],selectedNigromantesIds:[MUMM_N],abominacionEstandarId:MUMM_A,reglaAbominaciones:'festival'});revelar(s,'abominacion');let a=s.pins.find(p=>p.cardId===MUMM_A);transformarMummRa(s,a.uid,{motivo:'derrota'});const n=s.pins.find(p=>p.cardId===MUMM_N);revelar(s,'caminantes-normal');
 transformarMummRa(s,n.uid);revelar(s,'caminantes-normal');a=s.pins.find(p=>p.cardId===MUMM_A);transformarMummRa(s,a.uid,{motivo:'derrota'});let r=s.derrotasEnemigos.at(-1);assert.equal(r.turnosEnJuego,1);assert.equal(r.numeroEliminacion,2);assert.equal(r.puntos,48);
 const vuelto=s.pins.find(p=>p.cardId===MUMM_N);revelar(s,'caminantes-normal');unpinCard(s,vuelto.uid,false,false,'derrota');r=s.derrotasEnemigos.at(-1);assert.equal(r.turnosEnJuego,2);assert.equal(r.puntos,30);assert.ok(isValid(s));
 const t=crear({selectedAbominacionesIds:[MUMM_A],selectedNigromantesIds:[MUMM_N],reglaAbominaciones:'festival'});revelar(t,'abominacion');transformarMummRa(t,t.pins.find(p=>p.cardId===MUMM_A).uid,{motivo:'derrota'});unpinCard(t,t.pins.find(p=>p.cardId===MUMM_N).uid,false,false,'derrota');assert.equal(resumenPuntaje(t).total,110);
});
test('Bake-Danuki: cada forma usa su base; Abominación cuenta desde aparición original',()=>{
 for(const [azar,tipo,puntos] of [[0,'abominaciones',48],[.2,'corredores',4],[.6,'brutos',4],[.99,'caminantes',3]]){
  const s=crear({dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',selectedDailyIds:[BAKE_DANUKI]});revelar(s,'caminantes-normal');const uid=s.pins[0].uid;revelar(s,'caminantes-normal',()=>azar);assert.equal(s.history.at(-1).bakeDanuki.tipo,tipo);unpinCard(s,uid,false,false,'derrota');assert.equal(s.derrotasEnemigos[0].puntos,puntos);assert.equal(s.derrotasEnemigos[0].tipoPuntaje,tipo);assert.ok(isValid(s));
 }
});
test('detalle guardado: recarga, fallo atómico, anulación, legado y rechazo de fórmula alterada',()=>{
 const s=crear();revelar(s,'abominacion');const uid=s.pins[0].uid;const m=new Map([[KEY,JSON.stringify(s)]]),store={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};
 assert.throws(()=>guardarAccion(s,x=>unpinCard(x,uid,false,false,'derrota'),{...store,setItem:()=>{throw Error('Quota');}}));assert.equal(s.derrotasEnemigos,undefined);
 const nuevo=guardarAccion(s,x=>unpinCard(x,uid,false,false,'derrota'),store);assert.equal(resumenPuntaje(recuperar(store)).total,60);const malo=structuredClone(nuevo);malo.derrotasEnemigos[0].puntos=999;assert.ok(!isValid(malo));
 const antiguo=structuredClone(nuevo);for(const k of ['versionPuntaje','tipoPuntaje','turnosEnJuego','numeroEliminacion','puntosBase','multiplicadorTurnos','multiplicadorReeliminacion','puntos'])delete antiguo.derrotasEnemigos[0][k];assert.ok(isValid(antiguo));assert.equal(resumenPuntaje(antiguo).total,25);
 discardCard(nuevo,1,nuevo.history[0].slots[0].id);assert.equal(resumenPuntaje(nuevo).total,0);anularTanda(nuevo);assert.equal(nuevo.derrotasEnemigos,undefined);
});
