import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,isValid,programarConfiguracion,actualizarPartidaDePrueba,pinCard,unpinCard,replaceCard,anularTanda} from '../dist/engine.js';
import {prepararConfiguracion} from '../dist/configuracion-partida.js';
import {presentes,PROFANADOR} from '../dist/modos-enemigos.js';
import {disponiblesSecundario} from '../dist/secundarios.js';
import {limitesIniciales} from '../dist/limites.js';
import {probabilidadDaily,puntosAcumuladosDaily} from '../dist/daily.js';
import {datos,componer} from '../dist/catalogo.js';
import {guardarAccion,recuperar,KEY} from '../dist/persistencia.js';
const kan='enemigo-abominacion-kan',orca='enemigo-abominacion-orca',trofeo='enemigo-red-hare',ostokar='enemigo-ostokar-el-palido';
const crear=(extra={})=>newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion','asedio'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado',selectedNigromantesIds:[ostokar,'enemigo-bomoh'],selectedAbominacionesIds:[kan,orca,trofeo],abominacionEstandarId:kan,limitesPorAdrenalina:limitesIniciales(true),...extra},1);
const gen=s=>s.history.at(-1).slots[0].draws.at(-1);
function revelar(s,id='asedio',rng=()=>.99){for(const k of Object.keys(s.remaining))s.remaining[k]=Number(k===id);spawn(s,rng);assert.ok(isValid(s));return gen(s);}
function guardar(s,extra){programarConfiguracion(s,{...s.proximaConfig,...extra});assert.ok(isValid(s));}
function alto(s){s.config.limitesPorAdrenalina.abominaciones={azul:3,amarillo:3,naranja:3,rojo:3};s.proximaConfig.limitesPorAdrenalina=structuredClone(s.config.limitesPorAdrenalina);s.accionesPredeterminadas={abominacion:'spawn',nigromante:'spawn'};}
test('configuración: cambios se adoptan en la próxima tanda, no al guardar ni al reabrir',()=>{
 const s=crear();revelar(s);const b=structuredClone(s.history[0]);guardar(s,{reglaNigromantes:'estandar',reglaAbominaciones:'festival'});assert.equal(s.config.reglaNigromantes,'personalizado');assert.deepEqual(s.history[0],b);revelar(s);assert.equal(s.config.reglaNigromantes,'estandar');assert.equal(s.config.reglaAbominaciones,'festival');assert.equal(s.history[0].configTanda.reglaNigromantes,'personalizado');assert.equal(s.history[1].configTanda.reglaNigromantes,'estandar');
});
test('configuración: estándar con varias abominaciones conserva presencia y solo activa hasta quedar vacío',()=>{
 const s=crear();alto(s);revelar(s,'abominacion');revelar(s,'abominacion');assert.equal(presentes(s,'abominaciones').length,2);guardar(s,{reglaAbominaciones:'estandar',abominacionEstandarId:orca});const c=revelar(s,'abominacion');assert.equal(c.resolucionAbominacion,'activacion');assert.equal(c.activaciones.length,2);assert.equal(presentes(s,'abominaciones').length,2);for(const p of [...presentes(s,'abominaciones')])unpinCard(s,p.uid);const siguiente=revelar(s,'abominacion');assert.equal(siguiente.abominaciones[0].cardId,orca);
});
test('configuración: estándar conserva adicionales existentes y permite volver a invocar Profanador',()=>{
 const s=crear();s.config.limitesPorAdrenalina.nigromantes={azul:2,amarillo:2,naranja:2,rojo:2};s.proximaConfig.limitesPorAdrenalina=structuredClone(s.config.limitesPorAdrenalina);s.accionesPredeterminadas={nigromante:'spawn'};revelar(s,'nigromante');revelar(s,'nigromante');const p=presentes(s,'nigromantes').find(c=>c.cardId===PROFANADOR);unpinCard(s,p.uid);guardar(s,{reglaNigromantes:'estandar'});const c=revelar(s,'nigromante');assert.equal(c.nigromantes[0].cardId,PROFANADOR);assert.equal(presentes(s,'nigromantes').length,2);const otro=revelar(s,'nigromante');assert.equal(otro.resolucionNigromante,'activacion');assert.deepEqual(otro.activaciones.map(a=>a.cardId),[PROFANADOR]);
});
test('configuración: estándar y nueva partida conservan topes personalizados exactos',()=>{
 const s=crear();const limites=limitesIniciales(true);limites.nigromantes={azul:2,amarillo:3,naranja:4,rojo:5};limites.abominaciones={azul:4,amarillo:5,naranja:6,rojo:7};guardar(s,{limitesPorAdrenalina:limites,reglaNigromantes:'estandar',reglaAbominaciones:'estandar'});revelar(s);guardar(s,{reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'});revelar(s);assert.deepEqual(s.config.limitesPorAdrenalina,limites);const nueva=newGame(s.proximaConfig);assert.deepEqual(nueva.config.limitesPorAdrenalina,limites);
});
test('configuración: retirar selección excluye sorteos, conserva catálogo/historial y presencia',()=>{
 const s=crear();alto(s);const c=revelar(s,'abominacion');const id=c.abominaciones[0].cardId;guardar(s,{selectedAbominacionesIds:[orca]});revelar(s);assert.ok(s.abominaciones.cartas.some(a=>a.id===id));assert.ok(presentes(s,'abominaciones').some(a=>a.cardId===id));assert.deepEqual(s.abominaciones.habilitadasIds,[orca]);assert.ok(disponiblesSecundario(s,'abominaciones').every(a=>a.id===orca));assert.equal(s.history[0].slots[0].draws[0].abominaciones[0].cardId,id);
});
test('configuración: añadir una identidad nueva la incorpora disponible sin reiniciar otras',()=>{
 const s=crear({selectedAbominacionesIds:[kan]});revelar(s,'abominacion');guardar(s,{selectedAbominacionesIds:[kan,orca]});revelar(s);assert.equal(s.abominaciones.remaining[orca],1);assert.equal(s.abominaciones.remaining[kan],0);assert.ok(s.abominaciones.cartas.some(a=>a.id===orca));
});
test('configuración: trofeo derrotado no vuelve al desmarcar y remarcar en tandas distintas',()=>{
 const s=crear();const i=s.abominaciones.cartas.findIndex(a=>a.id===trofeo);let valores=[0,(i+.01)/s.abominaciones.cartas.length];const c=revelar(s,'abominacion',()=>valores.shift()??.99);assert.equal(c.abominaciones[0].cardId,trofeo);unpinCard(s,c.abominaciones[0].uid);guardar(s,{selectedAbominacionesIds:[kan,orca]});revelar(s);assert.ok(Object.hasOwn(s.abominaciones.trofeos,trofeo));guardar(s,{selectedAbominacionesIds:[kan,orca,trofeo]});revelar(s);assert.equal(s.abominaciones.remaining[trofeo],0);assert.ok(!disponiblesSecundario(s,'abominaciones').some(a=>a.id===trofeo));
});
test('configuración: dos guardados antes de SPAWN no recuperan trofeos y sí permiten reactivar una carta ordinaria',()=>{
 const s=crear();const i=s.abominaciones.cartas.findIndex(a=>a.id===trofeo);let valores=[0,(i+.01)/s.abominaciones.cartas.length];const c=revelar(s,'abominacion',()=>valores.shift()??.99);unpinCard(s,c.abominaciones[0].uid);guardar(s,{selectedAbominacionesIds:[kan]});guardar(s,{selectedAbominacionesIds:[kan,orca,trofeo]});revelar(s);assert.ok(Object.hasOwn(s.abominaciones.trofeos,trofeo));assert.equal(s.abominaciones.remaining[trofeo],0);assert.equal(s.abominaciones.remaining[orca],1);
});
test('configuración: reinicio del mazo solo reincorpora descartes activos y nunca presentes ni trofeos',()=>{
 const s=crear({selectedNigromantesIds:[ostokar]});s.config.limitesPorAdrenalina.nigromantes={azul:1,amarillo:1,naranja:1,rojo:1};s.proximaConfig.limitesPorAdrenalina=structuredClone(s.config.limitesPorAdrenalina);s.accionesPredeterminadas={nigromante:'spawn'};revelar(s,'nigromante');revelar(s,'nigromante');const n=presentes(s,'nigromantes').find(a=>a.cardId===ostokar);unpinCard(s,n.uid);assert.ok(disponiblesSecundario(s,'nigromantes').some(a=>a.id===ostokar));const c=revelar(s,'nigromante');assert.equal(c.nigromantes[0].cardId,ostokar);
});
test('configuración: colección/cajas y composición general cambian preservando historia y copias incluidas',()=>{
 const s=crear();revelar(s,'abominacion');const antes=structuredClone(s.history);guardar(s,{selectedIds:['nigromante','asedio']});revelar(s);assert.ok(!Object.hasOwn(s.remaining,'abominacion'));assert.equal(s.history[0].slots[0].draws[0].cardId,'abominacion');assert.ok(isValid(s));assert.deepEqual(s.history[0],antes[0]);guardar(s,{selectedIds:['nigromante','abominacion','asedio']});revelar(s);assert.equal(s.initial.abominacion,6);assert.ok(s.remaining.abominacion>0);
});
test('configuración: deshabilitar caja de enemigo presente conserva su presencia y evita nuevos robos de esa caja',()=>{
 const cajas=datos.coleccion.cajas.map(c=>c.id),s=crear({coleccionIds:cajas});alto(s);const c=revelar(s,'abominacion',()=>0),id=c.abominaciones[0].cardId,caja=datos.coleccion.cartas.find(a=>a.id===id).cajaId;assert.notEqual(caja,'core');guardar(s,{coleccionIds:cajas.filter(a=>a!==caja)});revelar(s);assert.ok(presentes(s,'abominaciones').some(a=>a.cardId===id));assert.ok(!s.abominaciones.habilitadasIds.includes(id));
});
test('configuración: Daily cambia selección, habilitación y parámetros sin perder puntos históricos',()=>{
 const daily=datos.daily.cartas_ids.slice(0,2),perfil={azul:{base:0,incremento:20},amarillo:{base:0,incremento:20},naranja:{base:0,incremento:20},rojo:{base:0,incremento:20}};
 const s=crear({dailyHabilitado:true,selectedDailyIds:daily,dailyPorNivel:perfil,dailyIncrementoPor:'tanda'});revelar(s);assert.equal(puntosAcumuladosDaily(s),20);const nuevo=structuredClone(perfil);nuevo.azul={base:30,incremento:5};guardar(s,{dailyPorNivel:nuevo,selectedDailyIds:[daily[1]]});revelar(s);assert.equal(puntosAcumuladosDaily(s),25);assert.equal(probabilidadDaily(s),55);assert.deepEqual(s.daily.habilitadasIds,[daily[1]]);guardar(s,{dailyHabilitado:false});revelar(s);assert.equal(s.config.dailyHabilitado,false);assert.equal(puntosAcumuladosDaily(s),25);guardar(s,{dailyHabilitado:true});revelar(s);assert.equal(puntosAcumuladosDaily(s),30);
});
test('configuración: activar Daily por primera vez después de tandas sin Daily valida historia',()=>{
 const s=crear();revelar(s);guardar(s,{dailyHabilitado:true,selectedDailyIds:datos.daily.cartas_ids.slice(0,1),dailyBase:100,dailyIncremento:0});const c=revelar(s);assert.equal(c.daily.length,1);assert.ok(isValid(s));
});
test('configuración: Kan respalda estándar vacío/trofeos y no se elige un trofeo',()=>{
 const c=prepararConfiguracion({...crear().config,reglaAbominaciones:'estandar',selectedAbominacionesIds:[trofeo],abominacionEstandarId:trofeo});assert.equal(c.abominacionEstandarId,kan);const s=newGame(c);assert.equal(s.abominaciones.cartas[0].id,kan);const vacia=prepararConfiguracion({...c,selectedAbominacionesIds:[]});assert.equal(vacia.abominacionEstandarId,kan);
});
test('configuración: reemplazo de tanda existente conserva modo y composición antes de adoptar cambios',()=>{
 const s=crear();revelar(s);guardar(s,{reglaNigromantes:'estandar',selectedIds:['nigromante','asedio']});const slot=s.history[0].slots[0];replaceCard(s,1,slot.id,()=>.99);assert.equal(s.config.reglaNigromantes,'personalizado');assert.equal(s.history[0].configTanda.reglaNigromantes,'personalizado');assert.ok(Object.hasOwn(s.initial,'abominacion'));assert.ok(isValid(s));
});
test('configuración: anular SPAWN restaura pendiente, mazos, trofeos, modos y referencias anteriores',()=>{
 const s=crear();revelar(s);s.openBatch=false;guardar(s,{reglaNigromantes:'estandar',selectedAbominacionesIds:[orca]});for(const k of Object.keys(s.remaining))s.remaining[k]=Number(k==='asedio');const antes=structuredClone(s);spawn(s,()=>.99);assert.ok(isValid(s));anularTanda(s);assert.deepEqual(s,{...antes,openBatch:false,respaldoTanda:null});
});
test('configuración: reset único de pruebas conserva configuración y no repite al recargar',()=>{
 const s=crear();s.config.limitesPorAdrenalina.nigromantes={azul:2,amarillo:2,naranja:3,rojo:3};s.proximaConfig.limitesPorAdrenalina=structuredClone(s.config.limitesPorAdrenalina);revelar(s);delete s.revisionReglas;assert.ok(actualizarPartidaDePrueba(s));assert.equal(s.history.length,0);assert.equal(s.necro,0);assert.equal(s.pins.length,0);assert.deepEqual(s.config.limitesPorAdrenalina.nigromantes,{azul:2,amarillo:2,naranja:3,rojo:3});assert.equal(s.config.reglaNigromantes,'personalizado');revelar(s);const bytes=JSON.stringify(s);assert.equal(actualizarPartidaDePrueba(s),false);assert.equal(JSON.stringify(recuperar({getItem:k=>k===KEY?bytes:null})),bytes);
});
test('configuración: cuota/revisión desactualizada no aceptan ajustes ni reset parcial',()=>{
 const s=crear(),bytes=JSON.stringify(s),almacen={getItem:()=>bytes,setItem(){throw Error('quota');}};assert.throws(()=>guardarAccion(s,n=>programarConfiguracion(n,{...n.config,reglaNigromantes:'estandar'}),almacen));assert.equal(JSON.stringify(s),bytes);assert.throws(()=>guardarAccion(s,n=>actualizarPartidaDePrueba(n),almacen,{esperado:'otra'}),/otra pestaña/);
});
test('configuración: carta deshabilitada disponible no impide reiniciar descartes activos',()=>{
 const s=crear();s.config.limitesPorAdrenalina.nigromantes={azul:2,amarillo:2,naranja:2,rojo:2};s.proximaConfig.limitesPorAdrenalina=structuredClone(s.config.limitesPorAdrenalina);s.accionesPredeterminadas={nigromante:'spawn'};revelar(s,'nigromante');let rng=[0,0,.99];revelar(s,'nigromante',()=>rng.shift()??.99);guardar(s,{selectedNigromantesIds:[ostokar]});revelar(s);assert.equal(s.nigromantes.remaining['enemigo-bomoh'],1);const p=presentes(s,'nigromantes').find(c=>c.cardId===ostokar);unpinCard(s,p.uid);assert.ok(disponiblesSecundario(s,'nigromantes').some(c=>c.id===ostokar));assert.ok(!disponiblesSecundario(s,'nigromantes').some(c=>c.id==='enemigo-bomoh'));assert.ok(isValid(s));
});
test('configuración: trofeo retirado de selección mientras está presente queda bloqueado al derrotarlo después',()=>{
 const s=crear();const i=s.abominaciones.cartas.findIndex(a=>a.id===trofeo);let rng=[0,(i+.01)/s.abominaciones.cartas.length];const c=revelar(s,'abominacion',()=>rng.shift()??.99);guardar(s,{selectedAbominacionesIds:[kan]});revelar(s);unpinCard(s,c.abominaciones[0].uid);assert.ok(Object.hasOwn(s.abominaciones.trofeos,trofeo));guardar(s,{selectedAbominacionesIds:[kan,trofeo]});revelar(s);assert.equal(s.abominaciones.remaining[trofeo],0);assert.ok(isValid(s));
});
test('configuración: fijar una genérica de referencia no cuenta como otro enemigo ni bloquea el cupo',()=>{
 const s=crear();s.config.limitesPorAdrenalina.abominaciones={azul:2,amarillo:2,naranja:2,rojo:2};s.accionesPredeterminadas={abominacion:'spawn'};const c=revelar(s,'abominacion');pinCard(s,c);const otro=revelar(s,'abominacion');assert.equal(otro.resolucionAbominacion,'spawn');assert.equal(presentes(s,'abominaciones').length,2);assert.ok(isValid(s));
});
