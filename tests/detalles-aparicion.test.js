import test from 'node:test';
import assert from 'node:assert/strict';
import {detallesProbabilidadesHTML,detallesTandaHTML} from '../dist/detalles-aparicion.js';

test('detalles: conserva ambas probabilidades históricas y resultados sin modificar la extracción',()=>{
 const c={dailyIntento:{probabilidad:6,resultado:'fallo'},especialIntento:{probabilidad:8,resultado:'spawn'}},antes=JSON.stringify(c);
 const html=detallesProbabilidadesHTML(c);assert.match(html,/Daily Spawn: 6 % · Sin aparición/);assert.match(html,/Spawn especial: 8 % · Aparición/);assert.equal(JSON.stringify(c),antes);
});
test('detalles: un intento por tanda no se atribuye a una extracción sin registro',()=>{
 const b={especialIntento:{probabilidad:12,resultado:'fallo'}};
 assert.equal(detallesProbabilidadesHTML({}), '');assert.match(detallesTandaHTML(b),/Spawn especial \(por tanda\): 12 %/);assert.equal(detallesTandaHTML({}), '');
});
test('detalles: distingue bloqueo, tope y ausencia de elegibles de un fallo probabilístico',()=>{
 assert.match(detallesProbabilidadesHTML({dailyIntento:{probabilidad:0,resultado:'bloqueado'}}),/0 % · Sin cartas disponibles/);
 assert.match(detallesProbabilidadesHTML({especialIntento:{probabilidad:10,resultado:'limite'}}),/Sin intento: máximo/);
 assert.match(detallesTandaHTML({especialIntento:{probabilidad:10,resultado:'fallo',sinElegibles:true}}),/Sin intento: no hay cartas elegibles/);
});
