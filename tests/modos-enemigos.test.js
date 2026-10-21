import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,isValid,unpinCard,pinCard,volverAlMazo,discardCard,replaceCard,regenerarNigromante,regenerarAbominacion,anularTanda} from '../dist/engine.js';
import {PROFANADOR,presentes,registrarActivaciones} from '../dist/modos-enemigos.js';
import {limitesIniciales} from '../dist/limites.js';
import {guardarAccion,KEY,recuperar} from '../dist/persistencia.js';
import {referenciasActivacion} from '../dist/presentacion.js';
const adicionales=['enemigo-ostokar-el-palido','enemigo-bomoh','enemigo-hannya'];
const aboms=['enemigo-abominacion-kan','enemigo-abominacion-orca'];
const crear=(extra={},normal=1)=>newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion','asedio'],modoNigromantes:'sin-reposicion',modoAbominaciones:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival',abominacionEstandarId:aboms[0],selectedNigromantesIds:adicionales,selectedAbominacionesIds:aboms,limitesPorAdrenalina:limitesIniciales(true),...extra},normal);
const generales=s=>s.history.at(-1).slots.filter(t=>!t.anulada).flatMap(t=>t.draws.slice(-1));
function solo(s,id){for(const c of Object.keys(s.remaining))s.remaining[c]=Number(c===id);}
function revelar(s,id='nigromante',azar=()=>.99){solo(s,id);spawn(s,azar);assert.ok(isValid(s));return generales(s)[0];}
function llenar(s,n=1){for(let i=0;i<n+1;i++)revelar(s);}
test('modos: Profanador obligatorio aunque no este seleccionado, estándar solo su identidad',()=>{
 for(const regla of ['estandar','varios','personalizado']){const s=crear({reglaNigromantes:regla});assert.ok(s.nigromantes.cartas.some(c=>c.id===PROFANADOR));if(regla==='estandar')assert.equal(s.nigromantes.cartas.length,1);const c=revelar(s);assert.equal(c.nigromantes[0].cardId,PROFANADOR);assert.equal(s.necro,1);}
});
test('modos: estándar activa al Profanador y no añade otro enemigo ni otra zona',()=>{
 const s=crear({reglaNigromantes:'estandar'});revelar(s);const c=revelar(s);assert.equal(c.resolucionNigromante,'activacion');assert.deepEqual(c.activaciones.map(a=>a.cardId),[PROFANADOR]);assert.equal(s.pins.length,1);assert.equal(s.history[1].slots.filter(t=>t.kind==='derivada').length,0);
});
test('modos: varios activa exclusivamente Profanador, adicionales no generan zonas ni consumen cupo oficial',()=>{
 const s=crear();llenar(s,2);assert.equal(presentes(s,'nigromantes').length,3);assert.equal(s.necro,1);for(const c of generales(s).filter(c=>c.cardId==='nigromante'))assert.deepEqual(c.activaciones.map(a=>a.cardId),[PROFANADOR]);assert.equal(s.history.flatMap(b=>b.slots).filter(t=>t.kind==='derivada').length,1);assert.ok(presentes(s,'nigromantes').filter(c=>c.cardId!==PROFANADOR).every(c=>c.spawnSlotId===undefined));
});
test('modos: resolver zonas normales antes de la nueva zona del Profanador, también internamente',()=>{
 const s=crear({},2);solo(s,'nigromante');let valores=[0,0,.99,.99,.99];const b=spawn(s,()=>valores.shift()??.99);assert.deepEqual(b.slots.map(t=>t.kind),['normal','normal','derivada']);assert.ok(b.slots[1].draws[0].uid<b.slots[2].draws[0].uid);assert.equal(b.slots[0].draws[0].nigromantes[0].cardId,PROFANADOR);assert.ok(isValid(s));
});
test('modos: retirar y refijar Profanador ajusta solo su zona; volver al mazo restaura prioridad',()=>{
 const s=crear();llenar(s);const p=presentes(s,'nigromantes').find(c=>c.cardId===PROFANADOR),n=presentes(s,'nigromantes').find(c=>c.cardId!==PROFANADOR);unpinCard(s,n.uid);assert.equal(s.necro,1);unpinCard(s,p.uid);assert.equal(s.necro,0);pinCard(s,p);assert.equal(s.necro,1);volverAlMazo(s,p.uid);assert.equal(s.necro,0);const c=revelar(s);assert.equal(c.nigromantes[0].cardId,PROFANADOR);
});
test('modos: espacio Profanador reservado incluso con cupo adicional completo y sin carta disponible',()=>{
 const s=crear({reglaNigromantes:'personalizado'});s.config.limitesPorAdrenalina.nigromantes={azul:1,amarillo:1,naranja:1,rojo:1};s.accionesPredeterminadas={nigromante:'spawn'};llenar(s);const p=presentes(s,'nigromantes').find(c=>c.cardId===PROFANADOR);unpinCard(s,p.uid);const c=revelar(s);assert.equal(c.nigromantes[0].cardId,PROFANADOR);assert.equal(s.necro,1);assert.equal(presentes(s,'nigromantes').length,2);
});
test('modos: cupos 0/0/1/1 y fallback de acción fija al tope',()=>{
 const s=crear({reglaNigromantes:'personalizado'});s.accionesPredeterminadas={nigromante:'spawn'};revelar(s);const c=revelar(s);assert.equal(c.activacionPorLimite,0);assert.equal(c.accionEnemigo,'activacion');assert.equal(s.pins.length,1);assert.deepEqual(c.activaciones.map(a=>a.cardId),[PROFANADOR]);
});
test('modos: azar al tope solo elige las dos acciones cumplibles',()=>{
 for(const [n,esperada] of [[.49,'activacion'],[.5,'activacion-azar']]){const s=crear({reglaNigromantes:'personalizado'});revelar(s);s.accionesPredeterminadas={nigromante:'azar'};let valores=[0,n,.99];const c=revelar(s,'nigromante',()=>valores.shift()??.99);assert.equal(c.accionEnemigo,esperada);assert.equal(s.pins.length,1);}
});
test('modos: cinco acciones uniformes y azar individual posterior independiente',()=>{
 const acciones=['activacion','activacion-azar','spawn','activacion-spawn','activacion-azar-spawn'];
 for(let i=0;i<5;i++){const s=crear({reglaNigromantes:'personalizado'});s.config.limitesPorAdrenalina.nigromantes={azul:3,amarillo:3,naranja:3,rojo:3};s.accionesPredeterminadas={nigromante:'spawn'};llenar(s);s.accionesPredeterminadas.nigromante='azar';let valores=[0,(i+.1)/5,.1,.99,.99];const c=revelar(s,'nigromante',()=>valores.shift()??.99);assert.equal(c.accionEnemigo,acciones[i]);if([1,4].includes(i))assert.equal(c.activaciones.length,2);}
});
test('modos: azar independiente del 50% registra cada objetivo, sin modificar presencia',()=>{
 const s=crear();llenar(s,2);const antes=structuredClone(s.pins),c={uid:s.sequence+1,cardId:'nigromante'};let valores=[.49,.5];registrarActivaciones(s,c,'nigromantes','activacion-azar',()=>valores.shift());assert.equal(c.activaciones.length,2);assert.deepEqual(s.pins,antes);assert.ok(c.activaciones.some(a=>a.cardId===PROFANADOR));
});
test('modos: abominación estándar elegida no borra selección y no usa topes personalizados',()=>{
 const s=crear({reglaAbominaciones:'estandar',abominacionEstandarId:aboms[1]});assert.deepEqual(s.config.selectedAbominacionesIds,aboms);assert.equal(s.abominaciones.cartas.length,1);const c=revelar(s,'abominacion');assert.equal(c.abominaciones[0].cardId,aboms[1]);const otro=revelar(s,'abominacion');assert.equal(otro.resolucionAbominacion,'activacion');assert.equal(otro.activaciones[0].cardId,aboms[1]);assert.equal(presentes(s,'abominaciones').length,1);
});
test('modos: Festival activa todas y añade otra sin aplicar tope Azul',()=>{
 const s=crear();revelar(s,'abominacion');const c=revelar(s,'abominacion');assert.equal(c.accionEnemigo,'activacion-spawn');assert.equal(c.activaciones.length,1);assert.equal(presentes(s,'abominaciones').length,2);const otro=revelar(s,'abominacion');assert.equal(otro.activaciones.length,2);assert.ok(otro.sinCandidatos);assert.equal(presentes(s,'abominaciones').length,2);
});
test('modos: abominaciones personalizadas resuelven acciones y límite sin elegir',()=>{
 for(const accion of ['activacion','spawn','activacion-spawn','azar']){const s=crear({reglaAbominaciones:'personalizado'});revelar(s,'abominacion');s.accionesPredeterminadas={abominacion:accion};const c=revelar(s,'abominacion');assert.equal(c.resolucionAbominacion,'activacion');assert.equal(c.activacionPorLimite,1);assert.equal(c.activaciones.length,1);}
});
test('modos: acciones congeladas por tanda, reemplazos no usan cambios posteriores',()=>{
 const s=crear({reglaNigromantes:'personalizado'});revelar(s);s.accionesPredeterminadas={nigromante:'activacion'};revelar(s);s.accionesPredeterminadas.nigromante='activacion-azar';solo(s,'nigromante');replaceCard(s,2,s.history[1].slots[0].id,()=>.99);assert.equal(generales(s)[0].accionEnemigo,'activacion');assert.ok(isValid(s));
});
test('modos: cancelación del origen retira zona/descendientes y no toca otro origen',()=>{
 const s=crear({},2);revelar(s);const t=s.history[0].slots[0],otra=s.history[0].slots[1].draws[0].uid;discardCard(s,1,t.id);assert.equal(s.necro,0);assert.ok(s.history[0].slots.find(t=>t.kind==='derivada').anulada);assert.equal(s.history[0].slots[1].draws[0].uid,otra);assert.ok(isValid(s));
});
test('modos: regenerar ambos secundarios conserva reglas e integridad',()=>{
 const s=crear();const c=revelar(s);regenerarNigromante(s,c.nigromantes[0].uid,()=>.99);assert.equal(s.necro,1);assert.ok(isValid(s));const a=revelar(s,'abominacion');regenerarAbominacion(s,a.abominaciones[0].uid,()=>.99);assert.ok(isValid(s));
});
test('modos: referencias de activación son puramente visuales y no tienen IDs de extracción',()=>{
 const s=crear();llenar(s);const bytes=JSON.stringify(s),c=generales(s)[0],refs=referenciasActivacion(c);assert.ok(refs.every(r=>typeof r.uid==='string'&&r.referenciaActivacion));assert.equal(JSON.stringify(s),bytes);
});
test('modos: persistencia, cuota, sincronización, recuperación y anulación conservan sorteos',()=>{
 const s=crear(),almacen={texto:JSON.stringify(s),getItem(){return this.texto;},setItem(k,v){this.texto=v;}};solo(s,'nigromante');almacen.texto=JSON.stringify(s);const next=guardarAccion(s,n=>spawn(n,()=>.99),almacen,{esperado:almacen.texto});const bytes=almacen.texto;assert.deepEqual(recuperar(almacen),next);assert.throws(()=>guardarAccion(next,n=>spawn(n),{getItem:()=>bytes,setItem(){throw Error('quota');}}));assert.equal(almacen.texto,bytes);assert.throws(()=>guardarAccion(next,()=>{throw Error('no RNG');},almacen,{esperado:'antigua'}),/otra pestaña/);anularTanda(next);const {registroActividad,...restaurado}=next;assert.deepEqual(restaurado,{...s,respaldoTanda:null,openBatch:false});assert.equal(registroActividad.eventos[0].tipo,'spawn');
});
test('modos: guardados anteriores no reciben modos ni cambian bytes',()=>{
 const s=newGame({easy:true,normal:true,threshold:0,modoNigromantes:'sin-reposicion'},1);spawn(s,()=>.99);const bytes=JSON.stringify(s);assert.equal(JSON.stringify(recuperar({getItem:k=>k===KEY?bytes:null})),bytes);assert.equal(s.config.reglaNigromantes,undefined);
});
test('modos: validación rechaza acciones, cupos, identidades y referencias corruptas',()=>{
 const s=crear();llenar(s);for(const cambio of [n=>n.config.reglaNigromantes='inventado',n=>n.config.limitesPorAdrenalina.nigromantes.azul=-1,n=>n.history.at(-1).accionesEnemigos.nigromante='elegir',n=>n.history.at(-1).slots[0].draws[0].activaciones[0].uid=999,n=>n.config.reglaAbominaciones='estandar']){const copia=structuredClone(s);cambio(copia);assert.equal(isValid(copia),false);}
});
test('modos: con y sin reposición mantienen unicidad y reponen solo enemigos retirados',()=>{
 for(const modo of ['sin-reposicion','con-reposicion']){const s=crear({modoNigromantes:modo,modoAbominaciones:modo});llenar(s,2);const n=presentes(s,'nigromantes').find(c=>c.cardId!==PROFANADOR);volverAlMazo(s,n.uid);const c=revelar(s);assert.equal(c.nigromantes[0].cardId,n.cardId);assert.equal(new Set(s.pins.filter(c=>c.mazo==='nigromantes').map(c=>c.cardId)).size,3);assert.ok(isValid(s));}
});
test('modos: candidatos agotados filtran spawn al azar, sin crear ni duplicar enemigos',()=>{
 const s=crear({reglaNigromantes:'personalizado',selectedNigromantesIds:[]});s.config.limitesPorAdrenalina.nigromantes={azul:3,amarillo:3,naranja:3,rojo:3};revelar(s);s.accionesPredeterminadas={nigromante:'azar'};const c=revelar(s,'nigromante',()=>.99);assert.equal(c.accionEnemigo,'activacion-azar');assert.equal(s.pins.length,1);assert.equal(c.activaciones.length,1);
});
test('modos: abominaciones personalizadas admiten las tres acciones con cupo disponible',()=>{
 for(const accion of ['activacion','spawn','activacion-spawn']){const s=crear({reglaAbominaciones:'personalizado'});s.config.limitesPorAdrenalina.abominaciones={azul:2,amarillo:2,naranja:2,rojo:2};revelar(s,'abominacion');s.accionesPredeterminadas={abominacion:accion};const c=revelar(s,'abominacion');assert.equal(c.accionEnemigo,accion);assert.equal(c.activaciones.length,accion==='spawn'?0:1);assert.equal(presentes(s,'abominaciones').length,accion==='activacion'?1:2);}
});
test('modos: estándar rechaza selección explícita de abominaciones con trofeo',()=>{
 assert.throws(()=>crear({reglaAbominaciones:'estandar',abominacionEstandarId:'enemigo-red-hare',selectedAbominacionesIds:['enemigo-red-hare']}),/trofeo/);
});
test('modos: perfil 0 permitido solo en nuevos adicionales, snapshots obligatorios y RNG rechazado',()=>{
 const s=crear({reglaNigromantes:'personalizado'});revelar(s);const invalida=structuredClone(s);delete invalida.history[0].accionesEnemigos;assert.equal(isValid(invalida),false);s.accionesPredeterminadas={nigromante:'azar'};solo(s,'nigromante');let valores=[0,NaN];assert.throws(()=>spawn(s,()=>valores.shift()),/Aleatoriedad/);const viejo=newGame({easy:true,normal:true,threshold:0,limitesPorAdrenalina:limitesIniciales(true)});assert.equal(isValid(viejo),false);
});
