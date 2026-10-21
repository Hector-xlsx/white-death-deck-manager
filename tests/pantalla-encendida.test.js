import test from 'node:test';
import assert from 'node:assert/strict';
import {iniciarPantallaEncendida} from '../dist/pantalla-encendida.js';
const esperar=()=>new Promise(resolve=>setImmediate(resolve));
function entorno(request){
 const casilla=Object.assign(new EventTarget(),{checked:false,disabled:false}),estado={textContent:''},documento=Object.assign(new EventTarget(),{visibilityState:'visible'}),valores=new Map();
 const almacen={getItem:k=>valores.get(k),setItem:(k,v)=>valores.set(k,v)};
 const navegador={wakeLock:{request}};
 return {casilla,estado,documento,almacen,navegador,valores};
}
function bloqueo(){const b=Object.assign(new EventTarget(),{released:false,liberaciones:0});b.release=async()=>{b.released=true;b.liberaciones++;b.dispatchEvent(new Event('release'));};return b;}

test('pantalla encendida: activación, pausa, recuperación y desactivación sin cambiar la partida',async()=>{
 const solicitudes=[],e=entorno(async tipo=>{assert.equal(tipo,'screen');const b=bloqueo();solicitudes.push(b);return b;});
 iniciarPantallaEncendida(e.casilla,e.estado,e);e.casilla.checked=true;e.casilla.dispatchEvent(new Event('change'));await esperar();
 assert.match(e.estado.textContent,/Activo/);assert.equal([...e.valores.values()][0],'si');
 e.documento.visibilityState='hidden';e.documento.dispatchEvent(new Event('visibilitychange'));await esperar();assert.equal(solicitudes[0].released,true);
 e.documento.visibilityState='visible';e.documento.dispatchEvent(new Event('visibilitychange'));await esperar();assert.equal(solicitudes.length,2);
 e.casilla.checked=false;e.casilla.dispatchEvent(new Event('change'));await esperar();assert.equal(solicitudes[1].released,true);assert.equal([...e.valores.values()][0],'no');assert.match(e.estado.textContent,/Desactivado/);
});
test('pantalla encendida: un rechazo y una liberación externa se informan sin afirmar activación',async()=>{
 const e=entorno(async()=>{throw new Error('Sin permiso');});iniciarPantallaEncendida(e.casilla,e.estado,e);e.casilla.checked=true;e.casilla.dispatchEvent(new Event('change'));await esperar();assert.match(e.estado.textContent,/no permitió/);
 const b=bloqueo(),otro=entorno(async()=>b);iniciarPantallaEncendida(otro.casilla,otro.estado,otro);otro.casilla.checked=true;otro.casilla.dispatchEvent(new Event('change'));await esperar();await b.release();assert.match(otro.estado.textContent,/Suspendido/);
});
test('pantalla encendida: una petición tardía se libera si se desmarcó mientras esperaba',async()=>{
 let resolver;const e=entorno(()=>new Promise(r=>resolver=r));iniciarPantallaEncendida(e.casilla,e.estado,e);e.casilla.checked=true;e.casilla.dispatchEvent(new Event('change'));
 e.casilla.checked=false;e.casilla.dispatchEvent(new Event('change'));const b=bloqueo();resolver(b);await esperar();assert.equal(b.released,true);assert.doesNotMatch(e.estado.textContent,/^Activo/);
});
test('pantalla encendida: navegador sin soporte y almacenamiento bloqueado son recuperables',async()=>{
 const e=entorno();e.navegador={};iniciarPantallaEncendida(e.casilla,e.estado,e);assert.equal(e.casilla.disabled,true);assert.match(e.estado.textContent,/no permite/);
 const otro=entorno(async()=>bloqueo());otro.almacen={getItem(){throw Error('Bloqueado');},setItem(){throw Error('Bloqueado');}};
 iniciarPantallaEncendida(otro.casilla,otro.estado,otro);otro.casilla.checked=true;otro.casilla.dispatchEvent(new Event('change'));await esperar();assert.match(otro.estado.textContent,/Activo/);assert.match(otro.estado.textContent,/solo se aplica a esta sesión/);
});
