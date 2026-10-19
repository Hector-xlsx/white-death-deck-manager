import test from 'node:test';
import assert from 'node:assert/strict';
import {configContenido,visiblesContenido,marcarContenido,erroresContenido,firmaContenido} from '../dist/contenido.js';
import {IDS_OTROS,datos,componer,idsSecundarios} from '../dist/catalogo.js';
import {selectorContenido,selectorColeccion} from '../dist/informacion.js';
import {newGame,spawn,anularTanda,isValid} from '../dist/engine.js';
import {KEY,recuperar,guardarAccion} from '../dist/persistencia.js';
const inicial=()=>configContenido({easy:true,normal:true,threshold:0,modoNigromantes:'sin-reposicion',modoAbominaciones:'sin-reposicion'});
function almacen(s){let bytes=JSON.stringify(s);return{getItem:()=>bytes,setItem:(k,v)=>{bytes=v;}};}

test('coleccion: seis cajas por Excel, Core obligatorio y retrocompatibilidad separada',()=>{
 assert.equal(datos.coleccion.cajas.length,6);
 assert.equal(datos.coleccion.cajas.filter(c=>c.obligatoria).length,1);
 const c=inicial();assert.ok(c.coleccionIds.includes('core'));assert.ok(c.coleccionIds.includes('core-retrocompatibilidad'));
 assert.equal(visiblesContenido(c,'abominaciones').filter(c=>c.operativa).length,20);
 assert.equal(visiblesContenido(c,'nigromantes').length,11);
});
test('filtros separan zombies comunes, secundarios y los seis tipos obligatorios Otros',()=>{
 const c=inicial();
 assert.equal(visiblesContenido(c,'zombies').filter(c=>c.operativa).length,11);
 assert.equal(visiblesContenido(c,'otros').filter(c=>c.operativa).length,6);
 assert.ok(visiblesContenido(c,'otros').filter(c=>c.operativa).every(c=>c.obligatoria));
 assert.ok(visiblesContenido(c,'abominaciones').every(c=>c.id.startsWith('enemigo-')));
});
test('solo Core deja un enemigo de cada tipo y no habilita los retrocompatibles',()=>{
 const c={...inicial(),coleccionIds:['core']},s=newGame(c);
 assert.deepEqual(s.abominaciones.cartas.map(c=>c.id),['enemigo-abominacion-kan']);
 assert.deepEqual(s.nigromantes.cartas.map(c=>c.id),['enemigo-nigromante-profanador']);
 assert.ok(isValid(s));assert.equal(s.initial.nigromante,9);assert.equal(s.initial.abominacion,6);
});
test('quitar caja oculta y excluye secundarios sin borrar la seleccion individual',()=>{
 const c=inicial(),antes=structuredClone(c),sin={...c,coleccionIds:c.coleccionIds.filter(id=>id!=='core-retrocompatibilidad')};
 assert.equal(idsSecundarios(sin,'abominaciones').length,17);assert.equal(idsSecundarios(sin,'nigromantes').length,7);
 assert.ok(visiblesContenido(sin,'abominaciones').every(c=>c.cajaId!=='core-retrocompatibilidad'));
 assert.deepEqual(sin.selectedAbominacionesIds,antes.selectedAbominacionesIds);
 assert.deepEqual(idsSecundarios({...sin,coleccionIds:c.coleccionIds},'abominaciones'),idsSecundarios(antes,'abominaciones'));
});
test('marcar y desmarcar solo toca elegibles del filtro y cajas habilitadas',()=>{
 const c={...inicial(),coleccionIds:['core']},sin=marcarContenido(c,'abominaciones',false);
 assert.equal(idsSecundarios(sin,'abominaciones').length,0);
 assert.equal(sin.selectedAbominacionesIds.length,19);
 assert.deepEqual(sin.selectedNigromantesIds,c.selectedNigromantesIds);
 const todo=marcarContenido(sin,'abominaciones',true);assert.deepEqual(idsSecundarios(todo,'abominaciones'),idsSecundarios(c,'abominaciones'));
 assert.deepEqual(c.selectedAbominacionesIds,inicial().selectedAbominacionesIds);
});
test('desmarcar todo zombies conserva 28 copias de Otros y no toca secundarios',()=>{
 const c=marcarContenido(inicial(),'zombies',false);
 assert.deepEqual([...c.selectedIds].sort(),[...IDS_OTROS].sort());
 assert.equal(Object.values(componer(c)).reduce((a,b)=>a+b,0),28);
 assert.equal(idsSecundarios(c,'abominaciones').length,20);
 const sinOtros=marcarContenido(c,'otros',false);assert.deepEqual(sinOtros,c);
});
test('Core y Otros se fuerzan al normalizar; UI usa casillas checked disabled',()=>{
 const c=configContenido({...inicial(),coleccionIds:[],selectedIds:[]});
 assert.deepEqual(c.coleccionIds,['core']);assert.ok(IDS_OTROS.every(id=>c.selectedIds.includes(id)));
 assert.match(selectorColeccion(c),/value="core" checked disabled/);
 const html=selectorContenido(c,'otros');for(const id of IDS_OTROS)assert.ok(html.includes(`value="${id}" checked disabled`));
});
test('cantidad de enemigos seleccionados se congela en la nueva partida y limita sorteos',()=>{
 const c={...inicial(),coleccionIds:['core']},s=newGame(c,1);spawn(s,()=>0);
 assert.equal(s.pins[0].cardId,'enemigo-nigromante-profanador');
 const a=almacen(s),antes=structuredClone(s);
 const nuevo=guardarAccion(s,n=>n.proximaConfig={...inicial(),coleccionIds:['core','frozen-fortress']},a);
 assert.deepEqual(nuevo.nigromantes,antes.nigromantes);assert.deepEqual(nuevo.abominaciones,antes.abominaciones);
 assert.equal(newGame(nuevo.proximaConfig).nigromantes.cartas.length,7);
});
test('mazos secundarios vacios bloquean inicio pero borrador se puede guardar',()=>{
 const c={...inicial(),selectedAbominacionesIds:[],selectedNigromantesIds:[]};
 assert.equal(erroresContenido(c).length,2);assert.throws(()=>newGame(c),/Selecciona al menos/);
 const s=newGame(),a=almacen(s),guardado=guardarAccion(s,n=>n.proximaConfig=c,a);
 assert.ok(isValid(guardado));assert.deepEqual(recuperar(a).proximaConfig,c);
});
test('expansiones completas son seleccionables; bestias incompletas siguen fuera del motor',()=>{
 const c=inicial();assert.equal(visiblesContenido(c,'zombies').filter(c=>!c.operativa).length,0);
 assert.ok(marcarContenido(c,'zombies',true).selectedIds.includes('spawn-559'));
 assert.equal(Object.keys(newGame(c).initial).length,12);
 assert.match(selectorContenido(c,'otros'),/pendiente de implementación/);
});
test('configuracion antigua recupera exactamente sin activar nuevas restricciones',()=>{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['abominacion']},1),a=almacen(s);
 spawn(s,()=>0);a.setItem(KEY,JSON.stringify(s));assert.deepEqual(recuperar(a),s);
 assert.deepEqual(s.config.selectedIds,['abominacion']);assert.equal(s.config.coleccionIds,undefined);
 const borrador=configContenido(s.proximaConfig);assert.ok(borrador.selectedIds.includes('nigromante'));assert.equal(s.config.selectedIds.length,1);
});
test('validacion rechaza cajas desconocidas, Core ausente, Otros quitados e IDs secundarios invalidos',()=>{
 const s=newGame(inicial());
 for(const mutar of [n=>n.config.coleccionIds.push('inventada'),n=>n.config.coleccionIds=[],n=>n.config.selectedIds=n.config.selectedIds.filter(id=>id!=='asedio'),n=>n.config.selectedNigromantesIds.push('inventado'),n=>n.config.selectedAbominacionesIds.push(n.config.selectedAbominacionesIds[0]),n=>n.config.coleccionIds=['core']]){
  const roto=structuredClone(s);mutar(roto);assert.equal(isValid(roto),false);
 }
});
test('anular tanda restaura la coleccion y seleccion previa junto con los mazos congelados',()=>{
 const s=newGame({...inicial(),coleccionIds:['core']},1),antes=structuredClone(s);spawn(s,()=>0);
 s.proximaConfig=inicial();anularTanda(s);assert.deepEqual(s,antes);assert.ok(isValid(s));
});
test('firma ignora orden de IDs pero detecta seleccion, caja, modo y umbral',()=>{
 const c=inicial();assert.equal(firmaContenido(c),firmaContenido({...c,coleccionIds:[...c.coleccionIds].reverse()}));
 for(const cambio of [{threshold:10},{coleccionIds:['core']},{modoAbominaciones:'con-reposicion'},{selectedAbominacionesIds:[]}])assert.notEqual(firmaContenido(c),firmaContenido({...c,...cambio}));
});
