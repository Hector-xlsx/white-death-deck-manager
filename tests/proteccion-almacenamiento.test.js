import test from 'node:test';
import assert from 'node:assert/strict';
import {iniciarProteccionAlmacenamiento} from '../dist/proteccion-almacenamiento.js';
const esperar=()=>new Promise(resolve=>setImmediate(resolve));
function entorno(storage,visible='visible'){
 return {boton:Object.assign(new EventTarget(),{disabled:false}),estado:{dataset:{},textContent:''},navegador:{storage},documento:Object.assign(new EventTarget(),{visibilityState:visible}),ventana:new EventTarget()};
}
test('protección: solicitud automática denegada y reintento manual concedido',async()=>{
 let peticiones=0,concedida=false;const e=entorno({persisted:async()=>concedida,persist:async()=>{peticiones++;return concedida;}});
 await iniciarProteccionAlmacenamiento(e.boton,e.estado,e).listo;assert.equal(peticiones,1);assert.equal(e.estado.dataset.estado,'no-concedida');assert.equal(e.boton.disabled,false);
 concedida=true;e.boton.dispatchEvent(new Event('click'));await esperar();assert.equal(peticiones,2);assert.equal(e.estado.dataset.estado,'concedida');
});
test('protección: permiso existente evita otra solicitud y una revocación se refleja al volver',async()=>{
 let concedida=true,peticiones=0;const e=entorno({persisted:async()=>concedida,persist:async()=>{peticiones++;return false;}});
 await iniciarProteccionAlmacenamiento(e.boton,e.estado,e).listo;assert.equal(peticiones,0);assert.equal(e.estado.dataset.estado,'concedida');
 concedida=false;e.ventana.dispatchEvent(new Event('pageshow'));await esperar();assert.equal(e.estado.dataset.estado,'no-concedida');assert.equal(peticiones,0);
});
test('protección: una página oculta espera visibilidad y no repite la solicitud en cada regreso',async()=>{
 let peticiones=0;const e=entorno({persisted:async()=>false,persist:async()=>{peticiones++;return false;}},'hidden');
 await iniciarProteccionAlmacenamiento(e.boton,e.estado,e).listo;assert.equal(peticiones,0);
 e.documento.visibilityState='visible';e.documento.dispatchEvent(new Event('visibilitychange'));await esperar();assert.equal(peticiones,1);
 e.ventana.dispatchEvent(new Event('pageshow'));await esperar();assert.equal(peticiones,1);
});
test('protección: peticiones simultáneas comparten la solicitud pendiente',async()=>{
 let resolver,peticiones=0;const e=entorno({persisted:async()=>false,persist:()=>{peticiones++;return new Promise(r=>resolver=r);}});
 const {listo}=iniciarProteccionAlmacenamiento(e.boton,e.estado,e);await esperar();assert.equal(e.boton.disabled,true);
 e.boton.dispatchEvent(new Event('click'));e.ventana.dispatchEvent(new Event('pageshow'));assert.equal(peticiones,1);resolver(true);await listo;assert.equal(e.estado.dataset.estado,'concedida');assert.equal(e.boton.disabled,false);
});
test('protección: error recuperable y ausencia de API no bloquean la aplicación',async()=>{
 const e=entorno({persisted:async()=>{throw Error('Bloqueado');},persist:async()=>true});await iniciarProteccionAlmacenamiento(e.boton,e.estado,e).listo;assert.equal(e.estado.dataset.estado,'error');assert.equal(e.boton.disabled,false);
 e.boton.dispatchEvent(new Event('click'));await esperar();assert.equal(e.estado.dataset.estado,'concedida');
 const otro=entorno(undefined);await iniciarProteccionAlmacenamiento(otro.boton,otro.estado,otro).listo;assert.equal(otro.boton.disabled,true);assert.equal(otro.estado.dataset.estado,'no-compatible');
});
test('protección: cada apertura vuelve a solicitar si no hay concesión; sin persist es opcional la consulta',async()=>{
 let solicitudes=0;const storage={persist:async()=>{solicitudes++;return false;}};
 for(let i=0;i<2;i++){const e=entorno(storage);await iniciarProteccionAlmacenamiento(e.boton,e.estado,e).listo;assert.equal(e.estado.dataset.estado,'no-concedida');}assert.equal(solicitudes,2);
});
