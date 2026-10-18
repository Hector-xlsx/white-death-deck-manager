import {registrarDerrota} from '../dist/derrotas.js';
import {BAKE_DANUKI} from '../dist/bake-danuki.js';
import {CATALOG} from '../dist/catalogo.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,discardCard,replaceCard,anularTanda,unpinCard,isValid} from '../dist/engine.js';
import {ajustarZombis,resumenZombis} from '../dist/contador-zombis.js';
import {grupoPuntaje,resumenPuntaje} from '../dist/puntaje.js';
import {RAKSHASA,SHAKOKI,MUMM_A,MUMM_N,transformarMummRa} from '../dist/reglas-cartas.js';
import {guardarAccion,recuperar,KEY} from '../dist/persistencia.js';
const crear=(ids=['caminantes-normal'],extra={})=>newGame({easy:true,normal:true,threshold:0,selectedIds:ids,modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival',...extra},1);
test('puntaje por cantidad y prioridad: variantes Caminantes, Brutos y Corredores; adrenalina congelada',()=>{
 for(const [tipo,puntos] of [['caminantes',12],['brutos',16],['corredores',16],['caminantes-terrorcota',15],['trepadores',6],['caminantes-ballesteros',6]]){
  const id=CATALOG.find(c=>c.tipo===tipo&&typeof c.levels?.[0]==='number').id,s=crear([id]);spawn(s,()=>0);assert.equal(resumenPuntaje(s).total,puntos,id);s.nivelAdrenalina='rojo';assert.equal(resumenPuntaje(s).total,puntos);
 }
 assert.equal(grupoPuntaje('trepadores'),'caminantes');assert.equal(grupoPuntaje('caminantes-ballesteros'),'caminantes');assert.equal(grupoPuntaje('caminantes-terrorcota'),'caminantes');
});
test('Nigromante 50 y Abominación 60 en turno cero; activaciones y transformaciones no suman apariciones',()=>{
 const n=crear(['nigromante']);spawn(n,()=>0);assert.equal(resumenPuntaje(n).total,0);const prof=n.pins[0].uid;unpinCard(n,prof,false,false,'derrota');assert.equal(resumenPuntaje(n).total,50);unpinCard(n,prof,false,false,'derrota');assert.equal(resumenPuntaje(n).total,50);
 const a=crear(['abominacion'],{selectedAbominacionesIds:[MUMM_A],selectedNigromantesIds:[MUMM_N]});spawn(a,()=>0);assert.equal(resumenPuntaje(a).total,0);const uid=a.pins[0].uid;transformarMummRa(a,uid,{motivo:'derrota'});assert.equal(resumenPuntaje(a).total,60);assert.ok(isValid(a));
 const simple=crear(['abominacion'],{reglaAbominaciones:'estandar'});spawn(simple,()=>0);spawn(simple,()=>0);assert.equal(resumenPuntaje(simple).total,0);const u=simple.pins[0].uid;unpinCard(simple,u,false,false,'derrota');assert.equal(resumenPuntaje(simple).total,48);
});
test('Daily general 6, Rakshasa +3 Caminantes y Shakōki cuentan acompañantes sin duplicar referencias',()=>{
 const s=crear(['caminantes-normal'],{dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',selectedDailyIds:[RAKSHASA]});spawn(s,()=>0);assert.equal(resumenZombis(s).total,8);assert.equal(resumenPuntaje(s).total,27);unpinCard(s,s.pins[0].uid);assert.equal(resumenPuntaje(s).total,27);
 const a=crear(['abominacion','caminantes-normal'],{selectedAbominacionesIds:[SHAKOKI]});for(const id of Object.keys(a.remaining))a.remaining[id]=id==='abominacion'?1:0;spawn(a,()=>0);for(const id of Object.keys(a.remaining))a.remaining[id]=id==='caminantes-normal'?1:0;spawn(a,()=>0);assert.equal(resumenPuntaje(a).total,15);
});
test('ajustes sin tipo y predeterminados conservan el puntaje de Caminantes',()=>{
 const s=crear();ajustarZombis(s,5,1);assert.equal(resumenZombis(s).total,5);assert.equal(resumenPuntaje(s).total,15);ajustarZombis(s,-2,2);assert.equal(resumenPuntaje(s).total,9);assert.equal(s.ajustesZombis.length,2);assert.ok(isValid(s));
 const antiguo=JSON.parse(JSON.stringify(s));for(const r of antiguo.ajustesZombis)delete r.tipo;assert.equal(resumenPuntaje(antiguo).total,9);assert.ok(isValid(antiguo));
});

test('ajustes por tipo conservan cantidades, puntos, correcciones y clasificación tras recarga',()=>{
 const s=crear();ajustarZombis(s,3,1,'caminantes');ajustarZombis(s,2,2,'brutos');ajustarZombis(s,1,3,'corredores');
 assert.equal(resumenZombis(s).total,6);assert.equal(resumenPuntaje(s).total,21);
 ajustarZombis(s,-1,4,'brutos');assert.equal(resumenZombis(s).total,5);assert.equal(resumenPuntaje(s).total,17);
 const m=new Map([[KEY,JSON.stringify(s)]]),store={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};
 assert.deepEqual(recuperar(store).ajustesZombis,s.ajustesZombis);assert.ok(isValid(s));
 const antes=JSON.stringify(s);assert.throws(()=>ajustarZombis(s,1,5,'daily'));assert.equal(JSON.stringify(s),antes);
 const malo=structuredClone(s);malo.ajustesZombis[0].tipo='otro';assert.equal(isValid(malo),false);
 assert.throws(()=>guardarAccion(s,x=>ajustarZombis(x,2,5,'corredores'),{...store,setItem:()=>{throw Error('Quota');}}));assert.equal(JSON.stringify(s),antes);
});
test('cancelar, regenerar y anular reconstruyen puntos y zombis; sin inventar Asedio variable',()=>{
 const s=crear();spawn(s,()=>0);ajustarZombis(s,3,1);assert.equal(resumenPuntaje(s).total,21);replaceCard(s,1,s.history[0].slots[0].id,()=>0);assert.equal(resumenPuntaje(s).total,21);discardCard(s,1,s.history[0].slots[0].id);assert.equal(resumenPuntaje(s).total,9);anularTanda(s);assert.equal(resumenPuntaje(s).total,0);
 const a=crear(['asedio']);spawn(a,()=>0);assert.equal(resumenPuntaje(a).total,0);ajustarZombis(a,4,1);assert.equal(resumenPuntaje(a).total,12);
});
test('tema es solo presentación; recarga/cuota y límite numérico conservan el estado',()=>{
 const s=crear();spawn(s,()=>0);const m=new Map([[KEY,JSON.stringify(s)]]),store={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};
 for(const temaPuntaje of ['kang','dragon','cabeza']){const n=guardarAccion(s,x=>{x.proximaConfig.temaPuntaje=temaPuntaje;},store);assert.equal(resumenPuntaje(recuperar(store)).total,12);assert.equal(n.proximaConfig.temaPuntaje,temaPuntaje);}
 assert.throws(()=>guardarAccion(s,x=>ajustarZombis(x,1,1),{...store,setItem:()=>{throw Error('Quota');}}));assert.equal(resumenPuntaje(s).total,12);
 const malo=structuredClone(s);malo.proximaConfig.temaPuntaje='otro';assert.equal(isValid(malo),false);
 assert.throws(()=>guardarAccion(s,x=>ajustarZombis(x,Math.floor(Number.MAX_SAFE_INTEGER/2),1),store));assert.equal(s.ajustesZombis,undefined);
});

test('Bake-Danuki puntúa según su forma al derrotarlo; anular revierte',()=>{
 const s=crear(['caminantes-normal'],{dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',selectedDailyIds:[BAKE_DANUKI]});spawn(s,()=>0);assert.equal(resumenZombis(s).total,5);assert.equal(resumenPuntaje(s).total,12);
 const uid=s.pins.find(c=>c.cardId===BAKE_DANUKI).uid;spawn(s,()=>0);assert.equal(resumenPuntaje(s).total,24);assert.equal(s.history.at(-1).bakeDanuki.tipo,'abominaciones');
 unpinCard(s,uid,false,false,'derrota');assert.equal(resumenPuntaje(s).total,72);assert.ok(isValid(s));anularTanda(s);assert.equal(resumenPuntaje(s).total,12);assert.ok(s.pins.some(c=>c.uid===uid));
});
test('reaparición registra cada derrota explícita; corrección, cancelación y legado no inventan derrotas',()=>{
 const s=crear(['abominacion'],{reglaAbominaciones:'estandar'});spawn(s,()=>0);const uid=s.pins[0].uid;registrarDerrota(s,uid,{reaparicion:true,fecha:1});registrarDerrota(s,uid,{reaparicion:true,fecha:2});assert.equal(resumenPuntaje(s).total,120);assert.equal(s.pins.length,1);
 const m=new Map([[KEY,JSON.stringify(s)]]),store={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};assert.equal(resumenPuntaje(recuperar(store)).total,120);
 const bytes=JSON.stringify(s);assert.throws(()=>guardarAccion(s,x=>unpinCard(x,uid,false,false,'derrota'),{...store,setItem:()=>{throw Error('Quota');}}));assert.equal(JSON.stringify(s),bytes);
 discardCard(s,1,s.history[0].slots[0].id);assert.equal(resumenPuntaje(s).total,0);
 const c=crear(['abominacion'],{reglaAbominaciones:'estandar'});spawn(c,()=>0);unpinCard(c,c.pins[0].uid);assert.equal(resumenPuntaje(c).total,0);assert.equal(c.derrotasEnemigos,undefined);assert.ok(isValid(c));
});

test('visibilidad de puntaje es booleana opcional, persistente y no altera el cálculo',()=>{
 const s=crear();spawn(s,()=>0);const base=resumenPuntaje(s).total,m=new Map([[KEY,JSON.stringify(s)]]),store={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};
 const nuevo=guardarAccion(s,x=>{x.config.ocultarPuntaje=true;x.proximaConfig.ocultarPuntaje=true;},store);
 assert.equal(recuperar(store).proximaConfig.ocultarPuntaje,true);assert.equal(resumenPuntaje(nuevo).total,base);assert.deepEqual(nuevo.history,s.history);
 const malo=structuredClone(nuevo);malo.proximaConfig.ocultarPuntaje='sí';assert.equal(isValid(malo),false);
});
