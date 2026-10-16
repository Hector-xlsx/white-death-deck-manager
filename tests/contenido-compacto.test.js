import test from 'node:test';
import assert from 'node:assert/strict';
import {configContenido,fichasContenido} from '../dist/contenido.js';
import {selectorContenido} from '../dist/informacion.js';
const config=configContenido({easy:true,normal:true,threshold:20});
test('zombis comunes muestran dificultad confirmada, sin inferirla del nombre',()=>{
 const cartas=fichasContenido('zombies').filter(c=>c.operativa);
 assert.equal(cartas.length,11);assert.ok(cartas.every(c=>['Fácil','Normal'].includes(c.dificultad)));
});
test('filas compactas muestran Fácil antes de Estándar con copias y casilla al final',()=>{
 const html=selectorContenido(config,'zombies');assert.equal((html.match(/class="content-row zombie-row"/g)||[]).length,6);
 for(const tipo of ['brutos','caminantes','corredores']){
  const faciles=fichasContenido('zombies').find(c=>c.id===`${tipo}-facil`),normales=fichasContenido('zombies').find(c=>c.id===`${tipo}-normal`);
  assert.ok(html.indexOf(`value="${faciles.id}"`)<html.indexOf(`value="${normales.id}"`));
  assert.match(html,new RegExp(`<span>Fácil</span><strong>${faciles.copias}</strong><input[^>]+value="${faciles.id}"`));
  assert.match(html,new RegExp(`<span>Estándar</span><strong>${normales.copias}</strong><input[^>]+value="${normales.id}"`));
 }
 assert.doesNotMatch(html,/<summary>(Brutos|Caminantes|Corredores)<\/summary>/);
});
test('compactar conserva IDs, selección y pendientes deshabilitados',()=>{
 const html=selectorContenido({...config,selectedIds:config.selectedIds.filter(id=>id!=='corredores-normal')},'zombies');
 assert.match(html,/value="corredores-normal"[^>]*>/);assert.doesNotMatch(html,/value="corredores-normal"[^>]*checked/);
 assert.match(html,/value="corredores-facil"[^>]*checked/);assert.match(selectorContenido(config,'otros'),/pendiente de implementación/);
 assert.equal((html.match(/name="carta"/g)||[]).length,11);
});
test('abominaciones y nigromantes de todas las cajas usan nombre, cantidad y casilla al final',()=>{
 for(const [filtro,total] of [['abominaciones',20],['nigromantes',10]]){
  const html=selectorContenido(config,filtro);
  assert.equal((html.match(/class="content-row"/g)||[]).length,total);
  assert.equal((html.match(/<strong>1<\/strong><input[^>]+name="carta"/g)||[]).length,total);
  assert.doesNotMatch(html,/class="check-row"/);
 }
});
test('Otros mantiene cantidades confirmadas y sus seis casillas obligatorias al final',()=>{
 const html=selectorContenido(config,'otros');
 assert.equal((html.match(/<small>Obligatoria<\/small><strong>\d+<\/strong><input/g)||[]).length,6);
 assert.equal((html.match(/name="carta"[^>]*checked disabled/g)||[]).length,6);
 assert.doesNotMatch(html,/class="check-row"/);
});
test('expansiones completas muestran opciones compactas y bestias quedan pendientes',()=>{
 const html=selectorContenido(config,'zombies');
 assert.equal((html.match(/Pendiente de implementación<\/small><input type="checkbox" disabled/g)||[]).length,0);
 assert.match(selectorContenido(config,'otros'),/Pendiente de implementación/);
 assert.doesNotMatch(html,/<details><summary>/);
});
