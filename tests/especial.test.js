import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,replaceCard,discardCard,addZoneCard,isValid,anularTanda,programarConfiguracion,volverAlMazo,pinCard,unpinCard,elegirNigromante,elegirAbominacion} from '../dist/engine.js';
import {componer,CATALOG} from '../dist/catalogo.js';
import {puntosEspecial,probabilidadEspecial,regenerarEspecial,cerrarEspecial} from '../dist/especial.js';
import {ID_DISPARADOR,configEspecialValida} from '../dist/especial-config.js';
import {resumenPuntaje} from '../dist/puntaje.js';
import {resumenZombis} from '../dist/contador-zombis.js';
import {guardarAccion,recuperar,KEY} from '../dist/persistencia.js';
const crear=(opciones={},extra={},zonas=1)=>newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal','spawn-559','spawn-565'],spawnEspecial:{modo:'probabilidad',base:100,incremento:10,...opciones},...extra},zonas);
function revelar(s,id='caminantes-normal',valores=[]){for(const k of Object.keys(s.remaining))s.remaining[k]=Number(k===id);const b=spawn(s,()=>valores.shift()??0);assert.ok(isValid(s),'estado válido tras SPAWN');return b;}
const gen=b=>b.slots[0].draws.at(-1);

test('Especial: modalidad actual y guardados anteriores conservan composición y bytes',()=>{
 const s=newGame({easy:true,normal:true,threshold:20});spawn(s,()=>.7);const bytes=JSON.stringify(s);assert.equal(JSON.stringify(recuperar({getItem:k=>k===KEY?bytes:null})),bytes);assert.equal(s.especial,undefined);assert.equal(Object.values(s.initial).reduce((a,b)=>a+b,0),56);
});
test('Especial: disparadores editables retiran expansiones del general y muestran selección final',()=>{
 const s=crear({modo:'disparadores',disparadores:2});assert.deepEqual(s.initial,{'caminantes-normal':6,[ID_DISPARADOR]:2});const c=gen(revelar(s,ID_DISPARADOR));assert.equal(c.especial[0].cardId,'spawn-559');assert.equal(c.especial[0].disparadorEspecial,true);assert.equal(resumenZombis(s).total,5);assert.equal(resumenPuntaje(s).total,15);
});
test('Especial: cantidades ponderadas y agotamiento independiente; admite grupos repetidos y fijados',()=>{
 const s=crear({modo:'disparadores',cantidades:{'spawn-559':2,'spawn-565':1}});let c=gen(revelar(s,ID_DISPARADOR,[0,.66]));assert.equal(c.especial[0].cardId,'spawn-559');pinCard(s,c.especial[0]);c=gen(revelar(s,ID_DISPARADOR));assert.equal(c.especial[0].cardId,'spawn-559');pinCard(s,c.especial[0]);assert.equal(s.pins.length,2);c=gen(revelar(s,ID_DISPARADOR));assert.equal(c.especial[0].cardId,'spawn-565');const ciclo=s.cycle;c=gen(revelar(s,ID_DISPARADOR));assert.equal(c.especial[0].cycle,2);assert.ok(s.cycle>=ciclo);assert.ok(isValid(s));
});
test('Especial: reposición no consume copias y admite repetir la misma carta',()=>{
 const s=crear({reposicion:'con-reposicion',cantidades:{'spawn-559':1}});revelar(s);revelar(s);assert.equal(s.especial.remaining['spawn-559'],1);assert.equal(s.especial.cycle,1);
});
test('Especial: probabilidad por carta, fallo incrementa y acierto reinicia a base',()=>{
 const s=crear({base:0,incremento:50}, {},3);revelar(s,'caminantes-normal',[0,0,.99,0,0,0]);const cartas=s.history[0].slots.map(t=>t.draws[0]);assert.deepEqual(cartas.map(c=>c.especialIntento.probabilidad),[0,50,100]);assert.deepEqual(cartas.map(c=>c.especialIntento.resultado),['fallo','fallo','spawn']);assert.equal(puntosEspecial(s),0);assert.equal(probabilidadEspecial(s),0);
});
test('Especial: límite por tanda pausa intentos e incrementos, nueva tanda reabre cupo',()=>{
 const s=crear({limite:1}, {},3);revelar(s);assert.deepEqual(s.history[0].slots.map(t=>t.draws[0].especialIntento.resultado),['spawn','limite','limite']);assert.equal(puntosEspecial(s),0);revelar(s);assert.equal(gen(s.history[1]).especialIntento.resultado,'spawn');
});
test('Especial: límite por adrenalina permite sin límite incluso con límite general',()=>{
 const s=crear({limite:1,limitesPorNivel:{azul:null,amarillo:1,naranja:2,rojo:3}}, {},3);revelar(s);assert.equal(s.history[0].slots.filter(t=>t.draws[0].especialIntento.resultado==='spawn').length,3);
});
test('Especial: por tanda un solo sorteo, destino aleatorio congelado y sin repetición posterior',()=>{
 const s=crear({frecuencia:'tanda'}, {},2);const b=revelar(s,'caminantes-normal',[0,0,.99,0]);assert.equal(b.especialIntento.origenUid,b.slots[1].draws[0].uid);const bytes=JSON.stringify(b.especialIntento);cerrarEspecial(s,()=>{throw Error('No repetir');});addZoneCard(s,1,'normal',()=>0);replaceCard(s,1,b.slots[0].id,()=>0);assert.equal(JSON.stringify(b.especialIntento),bytes);assert.ok(isValid(s));
});
test('Especial: tanda sin elegibles cuenta como fallo sin sortear ni asignar ubicación',()=>{
 const s=crear({frecuencia:'tanda',base:20,incremento:15,elegibles:[]});const b=revelar(s);assert.equal(b.especialIntento.resultado,'fallo');assert.equal(b.especialIntento.sinElegibles,true);assert.equal(puntosEspecial(s),15);
});
test('Especial: elegibilidad seleccionable incluye activaciones y excluye grupos a voluntad',()=>{
 const s=crear({elegibles:['activacion-corredor']},{selectedIds:['activacion-corredor','caminantes-normal','spawn-559']});const b=revelar(s,'activacion-corredor');assert.equal(gen(b).especial.length,1);assert.equal(gen(revelar(s)).especialIntento,undefined);
});
test('Especial: destinos del modo probabilístico son exclusivos y usan cantidades editadas',()=>{
 const s=crear({destinos:{'spawn-559':'general'},cantidades:{'spawn-559':3}});assert.equal(s.initial['spawn-559'],3);assert.equal(s.especial.initial['spawn-559'],undefined);assert.equal(s.especial.initial['spawn-565'],6);const c=gen(revelar(s,'spawn-559'));assert.equal(c.especial[0].cardId,'spawn-565');
});
test('Especial: disparadores admiten destino general con ocho copias totales y conservan el especial separado',()=>{
 const s=crear({modo:'disparadores',destinosEnDisparadores:true,destinos:{'spawn-559':'general'},cantidades:{'spawn-559':8},disparadores:4});
 assert.equal(s.initial['spawn-559'],8);assert.equal(s.initial[ID_DISPARADOR],4);
 assert.equal(s.especial.initial['spawn-559'],undefined);assert.equal(s.especial.initial['spawn-565'],6);
 const directa=gen(revelar(s,'spawn-559'));assert.equal(directa.especial,undefined);
 const disparador=gen(revelar(s,ID_DISPARADOR));assert.equal(disparador.especial[0].cardId,'spawn-565');assert.ok(isValid(s));
});
test('Especial: disparadores históricos ignoran destinos probabilísticos guardados y conservan sus bytes',()=>{
 const s=crear({modo:'disparadores',destinos:{'spawn-559':'general'},cantidades:{'spawn-559':8}});
 assert.equal(s.initial['spawn-559'],undefined);assert.equal(s.especial.initial['spawn-559'],8);
 revelar(s,ID_DISPARADOR);const bytes=JSON.stringify(s);assert.equal(JSON.stringify(recuperar({getItem:k=>k===KEY?bytes:null})),bytes);
});
test('Especial: cambio de destino en disparadores se adopta en próxima tanda y anular restaura ambos mazos',()=>{
 const s=crear({modo:'disparadores'},{modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'});revelar(s,ID_DISPARADOR);s.openBatch=false;const historia=structuredClone(s.history);
 programarConfiguracion(s,{...s.proximaConfig,spawnEspecial:{...s.config.spawnEspecial,destinosEnDisparadores:true,destinos:{'spawn-559':'general'},cantidades:{'spawn-559':8}}});
 assert.equal(s.initial['spawn-559'],undefined);const antes=structuredClone(s);
 spawn(s,()=>0);assert.equal(s.initial['spawn-559'],8);assert.equal(s.especial.initial['spawn-559'],undefined);assert.deepEqual(s.history.slice(0,1),historia);assert.ok(isValid(s));
 anularTanda(s);assert.deepEqual(s,{...antes,openBatch:false,respaldoTanda:null});
});
test('Especial: disparadores rechazan destino que vacía el mazo especial y marca de compatibilidad inválida',()=>{
 assert.throws(()=>crear({modo:'disparadores',destinosEnDisparadores:true,destinos:{'spawn-559':'general','spawn-565':'general'}}),/al menos una carta/);
 assert.equal(configEspecialValida({spawnEspecial:{destinosEnDisparadores:'sí'}},CATALOG,[]),false);
});
test('Especial: compensación entera usa Core filtrado y contabiliza disparadores/general',()=>{
 const config={easy:true,normal:true,threshold:0,selectedIds:CATALOG.map(c=>c.id),spawnEspecial:{modo:'disparadores',compensar:true}};
 let m=componer(config);assert.equal(m.nigromante,11);assert.equal(m.abominacion,7);assert.equal(m.asedio,11);assert.equal(Object.values(m).reduce((a,b)=>a+b,0),67);
 m=componer({...config,easy:false});assert.equal(m.nigromante,12);assert.equal(m.abominacion,8);assert.equal(m.asedio,12);
 m=componer({...config,spawnEspecial:{modo:'probabilidad',compensar:true,destinos:{'spawn-559':'general'}}});assert.equal(m.nigromante,11);assert.equal(m[ID_DISPARADOR],undefined);
});
test('Especial: Daily integrado pondera identidades y retira todas las copias mientras están presentes',()=>{
 const s=crear({daily:'integrado',cantidades:{'daily-du01':20}},{dailyHabilitado:true,selectedDailyIds:['daily-du01'],selectedIds:['caminantes-normal','spawn-559']});const c=gen(revelar(s,'caminantes-normal',[0,.99]));assert.equal(c.daily[0].cardId,'daily-du01');assert.equal(c.daily[0].spawnEspecial,true);const d=gen(revelar(s));assert.equal(d.especial[0].cardId,'spawn-559');assert.equal(s.pins.filter(p=>p.cardId==='daily-du01').length,1);volverAlMazo(s,c.daily[0].uid);const e=gen(revelar(s,'caminantes-normal',[0,.99]));assert.equal(e.daily[0].cardId,'daily-du01');assert.ok(isValid(s));
});
test('Especial: Daily integrado admite disparador y candidatos únicamente Daily',()=>{
 const s=crear({modo:'disparadores',daily:'integrado'},{dailyHabilitado:true,selectedDailyIds:['daily-du02'],selectedIds:['caminantes-normal']});const c=gen(revelar(s,ID_DISPARADOR));assert.equal(c.daily[0].cardId,'daily-du02');assert.equal(resumenZombis(s).total,4);const otro=gen(revelar(s,ID_DISPARADOR));assert.equal(otro.sinCandidatos,true);assert.equal(otro.daily,undefined);assert.ok(isValid(s));
});
test('Especial: Daily independiente no hereda pesos y no se dispara desde un Especial',()=>{
 const s=crear({cantidades:{'daily-du01':100}},{dailyHabilitado:true,dailyBase:100,selectedDailyIds:['daily-du01','daily-du02']});const c=gen(revelar(s,'caminantes-normal',[0,0,0,.99]));assert.equal(c.daily.length,1);assert.equal(c.daily[0].cardId,'daily-du02');assert.equal(c.especial.length,1);assert.equal(c.especial[0].daily,undefined);
});
test('Especial: descarte revierte aportes, regeneración conserva origen sin repetir probabilidad',()=>{
 const s=crear();const c=gen(revelar(s));const evento=structuredClone(c.especialIntento);regenerarEspecial(s,c.especial[0].uid,()=>.99);assert.deepEqual(c.especialIntento,evento);assert.equal(c.especial.filter(a=>!a.anulada).length,1);assert.ok(isValid(s));discardCard(s,1,s.history[0].slots[0].id);assert.equal(resumenZombis(s).total,0);assert.equal(resumenPuntaje(s).total,0);assert.ok(isValid(s));
});
test('Especial: anular tanda restaura copias, probabilidad y preferencias; cuota y recarga atómicas',()=>{
 const s=crear(),bytes=JSON.stringify(s),store={getItem:()=>bytes,setItem(){throw Error('Quota');}};assert.throws(()=>guardarAccion(s,x=>spawn(x,()=>0),store));assert.equal(JSON.stringify(s),bytes);spawn(s,()=>0);const guardado=JSON.stringify(s);assert.equal(JSON.stringify(recuperar({getItem:k=>k===KEY?guardado:null})),guardado);anularTanda(s);assert.equal(JSON.stringify(s),bytes);
});
test('Especial: adopción en próxima tanda conserva historia y permite volver a modalidad actual',()=>{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal','spawn-559'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'},1);revelar(s);const historia=structuredClone(s.history[0]);programarConfiguracion(s,{...s.config,spawnEspecial:{modo:'disparadores'}});assert.ok(isValid(s));spawn(s,()=>.99);assert.ok(isValid(s));assert.deepEqual(s.history[0],historia);programarConfiguracion(s,{...s.config,spawnEspecial:{modo:'directo'}});spawn(s,()=>0);assert.ok(isValid(s));assert.equal(s.initial['spawn-559'],6);
});
test('Especial: configuración incompleta y estados manipulados se rechazan sin perder el original',()=>{
 assert.throws(()=>crear({}, {selectedIds:['caminantes-normal']}),/al menos una/);
 for(const q of [0,-1,1.5,NaN,Infinity])assert.equal(configEspecialValida({spawnEspecial:{cantidades:{'spawn-559':q}}},CATALOG,[]),false);
 assert.equal(configEspecialValida({spawnEspecial:{disparadores:0}},CATALOG,[]),false);
 const s=crear();revelar(s);const malo=structuredClone(s);gen(malo.history[0]).especial[0].origenUid=999;assert.equal(isValid(malo),false);const otro=structuredClone(s);otro.especial.remaining['spawn-559']=999;assert.equal(isValid(otro),false);
});

test('Especial: espera elecciones y asigna la aparición por tanda a una zona derivada válida',()=>{
 const s=crear({frecuencia:'tanda'},{selectedIds:['nigromante','asedio','spawn-559'],modoNigromantes:'sin-reposicion',selectedNigromantesIds:['enemigo-ostokar-el-palido','enemigo-bomoh']});
 revelar(s,'nigromante',[0,0,.99,0,0]);
 const b=revelar(s,'nigromante',[0,.99]);assert.equal(gen(b).resolucionNigromante,'pendiente');assert.equal(b.especialIntento,undefined);
 elegirNigromante(s,gen(b).uid,'spawn',(()=>{const r=[0,.99,0,0];return ()=>r.shift()??0;})());
 assert.equal(b.especialIntento.resultado,'spawn');assert.equal(b.slots.find(t=>t.draws.some(c=>c.uid===b.especialIntento.origenUid)).kind,'derivada');assert.ok(isValid(s));
 const bytes=JSON.stringify(b.especialIntento);elegirNigromante(s,gen(b).uid,'spawn',()=>{throw Error('No repetir');});assert.equal(JSON.stringify(b.especialIntento),bytes);
});
test('Especial: elección o descarte de una abominación pendiente cierra un solo intento',()=>{
 for(const descartar of [false,true]){
  const s=crear({frecuencia:'tanda'},{selectedIds:['abominacion','asedio','spawn-559'],selectedAbominacionesIds:['enemigo-abominacion-kan','enemigo-abominacion-orca']});
  revelar(s,'abominacion');const b=revelar(s,'abominacion');assert.equal(gen(b).resolucionAbominacion,'pendiente');assert.equal(b.especialIntento,undefined);
  if(descartar)discardCard(s,b.number,b.slots[0].id,()=>0);else elegirAbominacion(s,gen(b).uid,'activacion',()=>0);
  assert.ok(b.especialIntento);assert.ok(isValid(s));
 }
});
test('Especial: Daily sin reposición comparte el agotamiento con las cartas de grupos',()=>{
 const s=crear({daily:'integrado',cantidades:{'spawn-559':1},reposicion:'sin-reposicion'},{selectedIds:['caminantes-normal','spawn-559'],dailyHabilitado:true,selectedDailyIds:['daily-du01']});
 const c=gen(revelar(s));assert.equal(c.especial[0].cardId,'spawn-559');assert.equal(s.especial.remaining['spawn-559'],0);
 const d=gen(revelar(s));assert.equal(d.daily[0].cardId,'daily-du01');assert.equal(s.especial.cycle,1);
 unpinCard(s,d.daily[0].uid);assert.equal(s.daily.remaining['daily-du01'],0);
 const e=gen(revelar(s));assert.equal(e.especial[0].cardId,'spawn-559');assert.equal(s.especial.cycle,2);assert.equal(s.daily.remaining['daily-du01'],1);assert.ok(isValid(s));
});
test('Especial: Daily integrado con reposición usa el modo del Especial al crear y al adoptar',()=>{
 const extra={selectedIds:['caminantes-normal','spawn-559'],dailyHabilitado:true,selectedDailyIds:['daily-du01'],reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado',modoNigromantes:'sin-reposicion'};
 const s=crear({daily:'integrado',reposicion:'con-reposicion'},extra);assert.equal(s.daily.modo,'con-reposicion');
 const c=gen(revelar(s,'caminantes-normal',[0,.99]));unpinCard(s,c.daily[0].uid);assert.equal(s.daily.remaining['daily-du01'],1);
 programarConfiguracion(s,{...s.config,spawnEspecial:{...s.config.spawnEspecial,reposicion:'sin-reposicion'}});revelar(s);assert.equal(s.daily.modo,'sin-reposicion');assert.ok(isValid(s));
});
test('Especial: límite cuenta apariciones vigentes y los fallos conservan el nivel de su tanda',()=>{
 const s=crear({limite:1,base:0,incremento:15,porNivel:{azul:{base:0,incremento:10},amarillo:{base:0,incremento:20},naranja:{base:0,incremento:30},rojo:{base:0,incremento:40}}});
 const b=revelar(s);assert.equal(puntosEspecial(s),10);s.nivelAdrenalina='amarillo';const otro=revelar(s,'caminantes-normal',[0,.99]);assert.equal(puntosEspecial(s),30);assert.equal(b.slots[0].draws[0].especialIntento.incremento,10);assert.equal(gen(otro).especialIntento.incremento,20);
});

test('Especial: cancelar Shakōki cancela los acompañantes aportados a los grupos especiales',()=>{
 const s=crear({}, {selectedIds:['abominacion','caminantes-normal','spawn-559'],selectedAbominacionesIds:['enemigo-shakoki-dogu']},2);
 for(const id in s.remaining)s.remaining[id]=Number(['abominacion','caminantes-normal'].includes(id));spawn(s,()=>0);
 assert.equal(resumenZombis(s).total,12);assert.ok(isValid(s));discardCard(s,1,'t1-z1');assert.equal(resumenZombis(s).total,9);assert.ok(isValid(s));
});
test('Especial: límite se libera al cancelar el origen y un nuevo robo elegible puede intentar',()=>{
 const s=crear({limite:1});const b=revelar(s);replaceCard(s,1,b.slots[0].id,()=>0);const actual=b.slots[0].draws.at(-1);assert.equal(actual.especialIntento.resultado,'spawn');assert.equal(actual.especial.filter(c=>!c.anulada).length,1);assert.ok(isValid(s));
});
test('Especial: cambio de pestaña rechaza una acción sin sobrescribir el progreso ajeno',()=>{
 const s=crear(),bytes=JSON.stringify(s),almacen={getItem:()=>bytes+'otra',setItem(){throw Error('No debe escribir');}};
 assert.throws(()=>guardarAccion(s,x=>spawn(x,()=>0),almacen,{esperado:bytes}),/otra pestaña/);assert.equal(JSON.stringify(s),bytes);
});
