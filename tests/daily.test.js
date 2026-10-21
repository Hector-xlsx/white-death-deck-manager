import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,discardCard,replaceCard,anularTanda,regenerarDaily,unpinCard,pinCard,volverAlMazo,elegirNigromante,isValid,total} from '../dist/engine.js';
import {probabilidadDaily,probabilidadEfectivaDaily,CARTAS_DAILY,elegibleDaily} from '../dist/daily.js';
import {CATALOG,CATALOGO_BASE,datos,dificultadVisible} from '../dist/catalogo.js';
import {configContenido,marcarContenido,visiblesContenido,erroresContenido} from '../dist/contenido.js';
import {recuperar,guardarAccion,KEY} from '../dist/persistencia.js';
import {migrarEstado} from '../dist/estado.js';
import {crearRevelacion,avanzarRevelacion} from '../dist/revelacion.js';
const crear=(c={},zonas=1)=>newGame({easy:true,normal:true,threshold:0,selectedIds:['asedio'],dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',...c},zonas);
const azar=valores=>()=>{assert.ok(valores.length,'RNG extra no esperado');return valores.shift();};
const principal=s=>s.history.at(-1).slots[0].draws.at(-1);
const validar=s=>assert.ok(isValid(s));

test('Daily: siete IDs unicos, Rakshasa DU02, Frozen Fortress y copia unica',()=>{
 assert.equal(CARTAS_DAILY.length,7);assert.equal(new Set(CARTAS_DAILY.map(c=>c.id)).size,7);
 assert.equal(CARTAS_DAILY.find(c=>c.name==='Rakshasa').idCarta,'DU02');
 assert.ok(datos.daily.cartas.every(c=>c.cantidad_inicial===1&&c.caja_id==='frozen-fortress'));
 assert.deepEqual(datos.daily.cartas.filter(c=>c.regla_programable==='programada').map(c=>c.id).sort(),['daily-du02','daily-du03','daily-du07']);validar(crear());
});
test('Daily: se añade en su zona, fija y consume; no altera cantidad del spawn ni zonas',()=>{
 const s=crear();spawn(s,azar([0,0]));const c=principal(s);
 assert.equal(c.cardId,'asedio');assert.equal(c.daily.length,1);assert.equal(s.pins[0].cardId,c.daily[0].cardId);
 assert.equal(s.history[0].slots.length,1);assert.equal(s.normal,1);assert.equal(s.necro,0);assert.equal(total(s.remaining),8);validar(s);
});
test('Daily: todo el mazo elegible sin filtrar por tipo, seleccion uniforme',()=>{
 for(let i=0;i<7;i++){const s=crear({selectedIds:['corredores-normal']});spawn(s,azar([0,(i+.5)/7]));assert.equal(s.pins[0].cardId,CARTAS_DAILY[i].id);validar(s);}
});
test('Daily: Asedio y expansiones elegibles; activaciones y genéricas excluidas',()=>{
 const s=crear();
 for(const c of CATALOG)assert.equal(Boolean(elegibleDaily(s,{cardId:c.id})),c.id==='asedio'||!c.id.startsWith('activacion-')&&!['nigromante','abominacion'].includes(c.tipo));
});
test('Daily: cada fallo de carta suma puntos y un acierto reinicia inmediatamente',()=>{
 const s=crear({dailyBase:10,dailyIncremento:15},3);spawn(s,azar([0,.99,0,.99,0,.05,0]));
 assert.deepEqual(s.history[0].slots.map(t=>t.draws[0].dailyIntento.probabilidad),[10,25,40]);
 assert.equal(s.pins.length,1);assert.equal(probabilidadDaily(s),10);validar(s);
});
test('Daily: por tanda mantiene probabilidad dentro de la tanda y aumenta una vez',()=>{
 const s=crear({dailyBase:10,dailyIncremento:15,dailyIncrementoPor:'tanda'},2);
 spawn(s,azar([0,.99,0,.99]));assert.deepEqual(s.history[0].slots.map(t=>t.draws[0].dailyIntento.probabilidad),[10,10]);assert.equal(probabilidadDaily(s),25);
 spawn(s,azar([0,.01,0,0,.99]));assert.equal(probabilidadDaily(s),10);validar(s);
});
test('Daily: una tanda sin elegibles incrementa solo en modo tanda',()=>{
 for(const modo of ['carta','tanda']){const s=crear({selectedIds:['activacion-caminantes'],dailyBase:10,dailyIncremento:15,dailyIncrementoPor:modo},2);spawn(s,azar([0,0]));assert.equal(probabilidadDaily(s),modo==='tanda'?25:10);assert.equal(s.pins.length,0);validar(s);}
});
test('Daily: techo 100, base cero no sortea, 100 garantiza si hay candidatos',()=>{
 const s=crear({dailyBase:0,dailyIncremento:100},2);spawn(s,azar([0,0,0]));
 assert.deepEqual(s.history[0].slots.map(t=>t.draws[0].dailyIntento.probabilidad),[0,100]);assert.equal(s.pins.length,1);assert.equal(probabilidadDaily(s),0);validar(s);
 const f=crear({dailyBase:90,dailyIncremento:90});spawn(f,azar([0,.99]));assert.equal(probabilidadDaily(f),100);
});
test('Daily: todos en juego bloquean, probabilidad efectiva 0, sin RNG Daily ni activacion extra; D6 Bake independiente',()=>{
 const s=crear({},7);spawn(s,()=>0);assert.equal(new Set(s.pins.map(c=>c.cardId)).size,7);assert.equal(probabilidadEfectivaDaily(s),0);assert.equal(s.daily.cycle,1);
 s.normal=1;spawn(s,azar([0,0]));assert.equal(s.history.at(-1).bakeDanuki.dado,1);assert.equal(principal(s).dailyIntento.resultado,'bloqueado');assert.equal(principal(s).accionEnemigo,undefined);assert.equal(s.pins.length,7);validar(s);
});
test('Daily: derrota y reciclado respetan fijados; devolver/refijar conserva unicidad',()=>{
 const s=crear({},7);spawn(s,()=>0);const a=s.pins[0];unpinCard(s,a.uid);assert.equal(s.daily.cycle,2);assert.equal(s.daily.remaining[a.cardId],1);
 s.normal=1;spawn(s,()=>0);assert.equal(s.pins.at(-1).cardId,a.cardId);assert.throws(()=>pinCard(s,a),/ya está en juego/);
 const b=s.pins.at(-1);volverAlMazo(s,b.uid);assert.equal(s.daily.remaining[b.cardId],1);assert.ok(!s.pins.some(p=>p.cardId===b.cardId));pinCard(s,b);assert.equal(s.daily.remaining[b.cardId],0);validar(s);
});
test('Daily: descarte cancela aparición y progresion, no devuelve la general',()=>{
 const s=crear({dailyBase:10,dailyIncremento:15});spawn(s,azar([0,.01,0]));const a=s.pins[0];discardCard(s,1,'t1-z1');
 assert.equal(s.pins.length,0);assert.ok(s.unpinned[0].anulada);assert.equal(s.daily.remaining[a.cardId],1);assert.equal(total(s.remaining),8);assert.equal(probabilidadDaily(s),10);validar(s);
 const f=crear({dailyBase:10,dailyIncremento:15});spawn(f,azar([0,.99]));assert.equal(probabilidadDaily(f),25);discardCard(f,1,'t1-z1');assert.equal(probabilidadDaily(f),10);validar(f);
});
test('Daily: regenerar origen repite intento; regenerar secundaria devuelve y fija otra',()=>{
 const s=crear();spawn(s,()=>0);const a=s.pins[0];regenerarDaily(s,a.uid,()=>.99);
 assert.equal(s.pins.length,1);assert.notEqual(s.pins[0].cardId,a.cardId);assert.equal(s.daily.remaining[a.cardId],1);validar(s);
 replaceCard(s,1,'t1-z1',()=>0);assert.equal(s.pins.length,1);assert.equal(principal(s).dailyIntento.resultado,'spawn');assert.equal(total(s.remaining),7);validar(s);
});
test('Daily: anular tanda restaura mazo, probabilidad y referencias exactos',()=>{
 const s=crear({dailyBase:10,dailyIncremento:15}),antes=structuredClone(s);spawn(s,azar([0,.99]));anularTanda(s);assert.deepEqual(s,{...antes,openBatch:false,respaldoTanda:null});validar(s);
});
test('Daily: general derivada de nigromante hace su intento y cancelacion retira todo',()=>{
 const s=crear({selectedIds:['nigromante','asedio'],modoNigromantes:'sin-reposicion',selectedNigromantesIds:['enemigo-ostokar-el-palido']});
 spawn(s,azar([0,0,.99,0]));assert.equal(s.pins.length,2);assert.equal(s.necro,1);assert.equal(s.history[0].slots[1].draws[0].daily.length,1);validar(s);
 discardCard(s,1,'t1-z1');assert.equal(s.pins.length,0);assert.equal(s.necro,0);assert.equal(total(s.daily.remaining),7);validar(s);
});
test('Daily: eleccion tardia incorpora intento en misma tanda sin doble incremento',()=>{
 const s=crear({selectedIds:['nigromante','asedio'],modoNigromantes:'sin-reposicion',selectedNigromantesIds:['enemigo-ostokar-el-palido','enemigo-bomoh'],dailyBase:10,dailyIncremento:15,dailyIncrementoPor:'tanda'});
 spawn(s,azar([0,0,.99,.99]));assert.equal(probabilidadDaily(s),25);validar(s);
 s.normal=1;spawn(s,azar([0,.99,.99]));const pendiente=principal(s);assert.equal(pendiente.resolucionNigromante,'pendiente');
 elegirNigromante(s,pendiente.uid,'spawn',azar([0,.99,.99]));assert.equal(probabilidadDaily(s),40);validar(s);
});
test('Daily: recarga no sortea y fallos de cuota conservan estado completo',()=>{
 const s=crear();spawn(s,()=>0);const bytes=JSON.stringify(s),a={getItem:k=>k===KEY?bytes:null,setItem(){throw new Error('Quota');}};
 assert.deepEqual(recuperar(a),s);assert.throws(()=>guardarAccion(s,n=>volverAlMazo(n,n.pins[0].uid),a));assert.equal(JSON.stringify(s),bytes);
 assert.throws(()=>guardarAccion(s,n=>spawn(n,()=>2),a));assert.equal(JSON.stringify(s),bytes);
});
test('Daily: rechaza probabilidad, ubicaciones, parentesco, rutas y duplicados invalidos',()=>{
 const s=crear();spawn(s,()=>0);
 for(const cambiar of [n=>n.config.dailyBase=101,n=>n.config.dailyIncremento=-1,n=>n.config.dailyIncrementoPor='tipo',n=>n.daily.remaining[n.pins[0].cardId]=1,n=>principal(n).daily[0].origenUid=999,n=>n.daily.cartas[0].image='../secreto.png',n=>n.pins.push({...n.pins[0],uid:999}),n=>principal(n).dailyIntento.probabilidad=NaN,n=>principal(n).dailyIntento.resultado='inventado',n=>delete n.daily]){const roto=structuredClone(s);cambiar(roto);assert.equal(isValid(roto),false);}
});
test('Daily: Coleccion Frozen Fortress y seleccion de cartas controlan su composicion',()=>{
 const c=configContenido({easy:true,normal:true,threshold:0,dailyHabilitado:true});assert.equal(visiblesContenido(c,'daily').length,7);
 const vacio=marcarContenido(c,'daily',false);assert.ok(erroresContenido(vacio).some(e=>e.includes('Daily')));assert.throws(()=>newGame(vacio));
 const sin={...c,coleccionIds:['core']};assert.equal(visiblesContenido(sin,'daily').length,0);assert.throws(()=>newGame(sin));
 const s=newGame({...c,selectedDailyIds:['daily-du05']});assert.equal(s.daily.cartas.length,1);validar(s);
});
test('expansiones: cinco cartas completas suman 24 copias y dificultad sin compensacion',()=>{
 const c=marcarContenido(configContenido({easy:true,normal:true,threshold:0}),'zombies',true);
 assert.equal(total(newGame(c).initial),80);assert.equal(total(newGame({...c,easy:false}).initial),57);assert.equal(total(newGame({...c,normal:false}).initial),51);assert.equal(total(newGame({...c,easy:false,normal:false}).initial),28);
 assert.ok(!Object.keys(newGame(c).initial).includes('spawn-bestias-divinas-aparicion'));
 for(const s of [newGame(c),newGame({...c,coleccionIds:['core']})])validar(s);
 const exp=CATALOG.find(c=>c.id==='spawn-559');assert.deepEqual(exp.levels,[5,5,5,5]);assert.equal(dificultadVisible(exp.difficulty),'Avanzado');
});
test('migracion: partidas congeladas antiguas conservan 56 cartas y no reciben Daily',()=>{
 const s=newGame();s.catalogo={version:1,cartas:structuredClone(CATALOGO_BASE)};spawn(s,()=>.5);
 const antes=structuredClone(s),m=migrarEstado(s);assert.deepEqual(m,antes);assert.equal(m.daily,undefined);assert.equal(total(m.initial),56);validar(m);
});
test('Daily: revelacion secundaria usa 1000 ms y precede a siguiente inicial',()=>{
 const s=crear({},2);spawn(s,()=>0);const b=s.history[0],items=b.slots.flatMap(slot=>[{c:slot.draws[0],slot},...slot.draws[0].daily.map(c=>({c,slot}))]);
 const p=crearRevelacion(items,1,0);assert.equal(p.visibles.size,2);
 assert.equal(avanzarRevelacion(p,items,0).revelar,items[0].c.uid);const siguiente=avanzarRevelacion(p,items,700);assert.equal(siguiente.revelar,items[1].c.uid);assert.equal(siguiente.demora,1000);
 assert.equal(avanzarRevelacion(p,items,1700).revelar,items[2].c.uid);
});
