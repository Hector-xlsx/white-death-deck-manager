import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,isValid,discardCard,replaceCard,anularTanda,unpinCard,pinCard} from '../dist/engine.js';
import {MUMM_N,MUMM_A,SHAKOKI,CHIMIMORYO,MENG_HUO,RAKSHASA,transformarMummRa,aportesTanda,referenciasReglas} from '../dist/reglas-cartas.js';
import {disponiblesSecundario} from '../dist/secundarios.js';
import {presentes,PROFANADOR} from '../dist/modos-enemigos.js';
import {limitesIniciales} from '../dist/limites.js';
import {resumenZombis} from '../dist/contador-zombis.js';
import {guardarAccion,recuperar,KEY} from '../dist/persistencia.js';
import {CATALOG} from '../dist/catalogo.js';
const crear=(extra={})=>newGame({easy:true,normal:true,threshold:0,selectedIds:['nigromante','abominacion','caminantes-normal','asedio','activacion-caminantes'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival',selectedNigromantesIds:[MUMM_N],selectedAbominacionesIds:[MUMM_A,SHAKOKI,CHIMIMORYO],...extra},1);
function revelar(s,id){for(const c of Object.keys(s.remaining))s.remaining[c]=c===id?s.initial[c]:0;const b=spawn(s,()=>.999);assert.ok(isValid(s),'estado válido tras '+id);return b;}
function mummInicial(){const s=crear();revelar(s,'nigromante');if(!s.pins.some(p=>p.cardId===MUMM_N))revelar(s,'nigromante');assert.ok(s.pins.some(p=>p.cardId===MUMM_N));assert.equal(s.transformacionesMummRa,undefined);return s;}
function abom(s,id){
 // Elegir determinísticamente desde candidatos reales, manteniendo el motor.
 for(const c of Object.keys(s.remaining))s.remaining[c]=c==='abominacion'?s.initial[c]:0;
 const b=spawn(s,()=>{const opciones=disponiblesSecundario(s,'abominaciones');return opciones.some(c=>c.id===id)?(opciones.findIndex(c=>c.id===id)+.1)/opciones.length:0;});assert.ok(isValid(s));return b;
}
test('Mumm-Ra no se transforma por su propia aparición; lo hace después de la siguiente carta y sin nueva zona',()=>{
 const s=mummInicial(),uid=s.pins.find(p=>p.cardId===MUMM_N).uid,antes=resumenZombis(s).total;
 const b=revelar(s,'nigromante');assert.ok(s.pins.some(p=>p.cardId===MUMM_A));assert.ok(!s.pins.some(p=>p.cardId===MUMM_N));assert.equal(s.necro,1);assert.equal(s.transformacionesMummRa.at(-1).anteriorUid,uid);assert.equal(resumenZombis(s).total,antes);
 const refs=referenciasReglas(s,b);assert.equal(refs[0].c.transformacionDesde,true);assert.equal(refs[1].c.transformacionHasta,true);assert.equal(refs[0].zone,'');
 assert.ok(!disponiblesSecundario(s,'nigromantes').some(c=>c.id===MUMM_N));
 assert.throws(()=>pinCard(s,s.unpinned.find(p=>p.uid===uid)));
});
test('transformación excede tope, conserva activación previa y bloquea aparición normal mientras no haya cupo',()=>{
 const s=mummInicial();abom(s,CHIMIMORYO);s.config.reglaNigromantes='personalizado';s.config.reglaAbominaciones='personalizado';s.proximaConfig=structuredClone(s.config);s.config.limitesPorAdrenalina=limitesIniciales(true);s.proximaConfig.limitesPorAdrenalina=limitesIniciales(true);s.accionesPredeterminadas={nigromante:'activacion-azar',abominacion:'spawn'};
 // RNG 0 activa a los adicionales; mantener otros robos inocuos.
 const abominacionesAntes=presentes(s,'abominaciones').length;
 s.normal=1;s.necro=1;for(const c of Object.keys(s.remaining))s.remaining[c]=c==='nigromante'?s.initial[c]:0;spawn(s,()=>0);
 assert.ok(s.history.at(-1).slots[0].draws[0].activaciones.some(a=>a.cardId===MUMM_N));assert.equal(presentes(s,'abominaciones').length,abominacionesAntes+1);assert.ok(isValid(s));
 const b=revelar(s,'abominacion');assert.equal(b.slots[0].draws[0].resolucionAbominacion,'activacion');
});
test('derrota y corrección de Mumm-Ra son reemplazos idempotentes, persisten y anular restaura',()=>{
 const s=mummInicial();revelar(s,'nigromante');const a=s.pins.find(p=>p.cardId===MUMM_A);assert.throws(()=>unpinCard(s,a.uid));
 const n=transformarMummRa(s,a.uid,{motivo:'derrota'});assert.equal(transformarMummRa(s,a.uid),null);assert.ok(isValid(s));assert.equal(s.pins.filter(p=>[MUMM_N,MUMM_A].includes(p.cardId)).length,1);
 transformarMummRa(s,n.uid);assert.ok(isValid(s));anularTanda(s);assert.ok(s.pins.some(p=>p.cardId===MUMM_N));assert.ok(isValid(s));
});
test('cancelar carta detonante revierte transformación y regenerar no deja dos formas',()=>{
 const s=mummInicial(),b=revelar(s,'nigromante');discardCard(s,b.number,b.slots[0].id);assert.ok(s.pins.some(p=>p.cardId===MUMM_N));assert.ok(!s.pins.some(p=>p.cardId===MUMM_A));assert.ok(isValid(s));
 replaceCard(s,b.number,b.slots[0].id,()=>0);assert.ok(isValid(s));
});
test('Shakōki añade uno por aparición, Asedio incluido, activación excluida; contador y cancelación',()=>{
 const s=crear();abom(s,SHAKOKI);const b=revelar(s,'caminantes-normal');assert.deepEqual(aportesTanda(b),[{tipo:'caminantes',cantidad:1,destino:'Shakōki Dogū'}]);assert.equal(resumenZombis(s).total,6);
 const asedio=revelar(s,'asedio');assert.equal(aportesTanda(asedio)[0].cantidad,1);const act=revelar(s,'activacion-caminantes');assert.deepEqual(aportesTanda(act),[]);
 discardCard(s,act.number,act.slots[0].id);assert.ok(isValid(s));
});
test('Rakshasa aporta tres acompañantes aunque no esté Shakōki; Daily no dispara Shakōki',()=>{
 const s=crear({dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',selectedDailyIds:[RAKSHASA]});abom(s,SHAKOKI);const b=revelar(s,'caminantes-normal');assert.equal(aportesTanda(b).filter(a=>a.destino==='Shakōki Dogū')[0].cantidad,1);assert.equal(aportesTanda(s.history[0]).find(a=>a.destino==='Rakshasa')?.cantidad??aportesTanda(b).find(a=>a.destino==='Rakshasa')?.cantidad,3);
});
test('Meng Huo no se retira por derrota y Chimimōryō permite excepción explícita',()=>{
 const s=crear({dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',selectedDailyIds:[MENG_HUO]});revelar(s,'caminantes-normal');assert.throws(()=>unpinCard(s,s.pins.find(p=>p.cardId===MENG_HUO).uid));
 const t=crear();revelar(t,'nigromante');abom(t,CHIMIMORYO);const c=t.pins.find(p=>p.cardId===CHIMIMORYO);assert.throws(()=>unpinCard(t,c.uid));unpinCard(t,c.uid,false,true);assert.ok(!t.pins.some(p=>p.uid===c.uid));assert.ok(isValid(t));
});
test('persistencia, cuota y validación de eventos y aportes; lectura no modifica resultados',()=>{
 const s=mummInicial(),map=new Map([[KEY,JSON.stringify(s)]]),store={getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};
 const n=guardarAccion(s,x=>revelar(x,'nigromante'),store);assert.deepEqual(recuperar(store),n);const bytes=JSON.stringify(n);referenciasReglas(n,n.history.at(-1));assert.equal(JSON.stringify(n),bytes);
 assert.throws(()=>guardarAccion(n,x=>transformarMummRa(x,x.pins.find(p=>p.cardId===MUMM_A).uid),{...store,setItem:()=>{throw Error('Quota');}}));assert.equal(JSON.stringify(n),bytes);
 const bad=structuredClone(n);bad.transformacionesMummRa[0].carta.cardId=MUMM_N;assert.equal(isValid(bad),false);
});
test('Estándar no transforma Mumm-Ra presente tras un cambio de modo',()=>{
 const s=mummInicial();s.config.reglaNigromantes='estandar';s.proximaConfig=structuredClone(s.config);
 // Inventario histórico retenido, selección activa restringida al Profanador.
 s.nigromantes.dinamico=true;s.nigromantes.habilitadasIds=[PROFANADOR];
 revelar(s,'nigromante');assert.ok(s.pins.some(c=>c.cardId===MUMM_N));assert.equal(s.transformacionesMummRa,undefined);
});
test('Shakōki conserva Terracota, Trepadores y Ballesteros como tipos separados',()=>{
 const variantes=CATALOG.filter(c=>c.rutaImagen&&c.levels?.some(n=>typeof n==='number'));
 const s=crear({selectedIds:['abominacion',...variantes.map(c=>c.id)]});abom(s,SHAKOKI);
 for(const ficha of variantes){const b=revelar(s,ficha.id);assert.equal(aportesTanda(b)[0].tipo,ficha.tipo);assert.equal(aportesTanda(b)[0].cantidad,1);}
});
test('Rakshasa nuevo suma una vez; regeneración/cancelación ajustan acompañantes sin reinterpretar historial previo',()=>{
 const s=crear({selectedIds:['caminantes-normal'],dailyHabilitado:true,dailyBase:100,dailyIncremento:0,dailyIncrementoPor:'carta',selectedDailyIds:[RAKSHASA]});const b=revelar(s,'caminantes-normal');assert.equal(resumenZombis(s).total,8);
 const previo=structuredClone(s);delete previo.history[0].slots[0].draws[0].daily[0].acompanantesRakshasa;assert.equal(resumenZombis(previo).total,5);assert.ok(isValid(previo));
 replaceCard(s,b.number,b.slots[0].id,()=>0);assert.equal(resumenZombis(s).total,8);discardCard(s,b.number,b.slots[0].id);assert.equal(resumenZombis(s).total,0);assert.ok(isValid(s));
});
test('cancelar origen de Shakōki anula también sus acompañantes de la misma tanda',()=>{
 const s=crear({selectedAbominacionesIds:[SHAKOKI],selectedNigromantesIds:[]});s.normal=2;
 for(const id of Object.keys(s.remaining))s.remaining[id]=id==='abominacion'?1:id==='caminantes-normal'?4:0;
 const rng=[0,0,.999],b=spawn(s,()=>rng.shift()??.999);assert.equal(aportesTanda(b).length,1);discardCard(s,b.number,b.slots[0].id);assert.deepEqual(aportesTanda(b),[]);assert.ok(isValid(s));
});
