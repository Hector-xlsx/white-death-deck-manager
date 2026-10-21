import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,replaceCard,pinCard,unpinCard,programarConfiguracion,isValid} from '../dist/engine.js';
import {prepararExportacion} from '../dist/exportacion.js';

test('exportación conserva exactamente historial, descartes, desfijados, respaldo y configuración pendiente',()=>{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'personalizado',reglaAbominaciones:'personalizado'},1);
 spawn(s,()=>0);replaceCard(s,1,0,()=>0);
 const carta=s.history[0].slots[0].draws.at(-1);pinCard(s,carta);unpinCard(s,carta.uid);
 programarConfiguracion(s,{...s.proximaConfig,easy:false});
 const antes=JSON.stringify(s),archivo=prepararExportacion(s,new Date('2026-10-21T01:00:00Z')),informe=JSON.parse(archivo.contenido);
 assert.ok(isValid(informe.partida));assert.deepEqual(informe.partida,JSON.parse(antes));assert.equal(JSON.stringify(s),antes);
 assert.equal(informe.partida.history[0].slots[0].draws[0].discarded,true);
 assert.equal(informe.partida.config.easy,true);assert.equal(informe.partida.proximaConfig.easy,false);
 assert.ok(informe.partida.respaldoTanda);assert.equal(informe.partida.unpinned.length,1);
 assert.match(archivo.nombre,/^white-death-partida-2026-10-21T01-00-00-000Z\.json$/);
 assert.equal(informe.formato,'white-death-partida');assert.equal(informe.versionExportacion,1);
 assert.ok(informe.referencias.enemigos.some(c=>c.id==='enemigo-abominacion-kan'));
});

test('exportación permite una partida sin tandas y produce una copia independiente',()=>{
 const s=newGame(),archivo=prepararExportacion(s),informe=JSON.parse(archivo.contenido);
 assert.deepEqual(informe.partida.history,[]);s.normal++;
 assert.notEqual(informe.partida.normal,s.normal);assert.ok(informe.versionApp);
});

test('exportación rechaza un estado inválido sin cambiar sus datos',()=>{
 const s=newGame();s.remaining.nigromante=-1;const antes=JSON.stringify(s);
 assert.throws(()=>prepararExportacion(s),/formato válido/);assert.equal(JSON.stringify(s),antes);
});
