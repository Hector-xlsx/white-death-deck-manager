import test from 'node:test';
import assert from 'node:assert/strict';
import {CATALOG,newGame,draw,spawn,replaceCard,discardCard,addZoneCard,pinCard,unpinCard,total,isValid} from '../dist/engine.js';
test('catálogo: 12 tipos, 56 copias, filtros sin compensación',()=>{
 assert.equal(CATALOG.filter(c=>!c.rutaImagen).length,12);assert.equal(total(newGame().initial),56);
 assert.equal(total(newGame({easy:false,normal:true,threshold:0}).initial),42);
 assert.equal(total(newGame({easy:false,normal:false,threshold:0}).initial),28);
});
test('selección proporcional a cada copia disponible',()=>{
 for(let ticket=0;ticket<56;ticket++){
  const s=newGame({easy:true,normal:true,threshold:0});const card=draw(s,()=>ticket/56);
  const flat=CATALOG.flatMap(c=>Array(c.copies).fill(c.id));assert.equal(card.cardId,flat[ticket]);
 }
});
test('sin reposición: un ciclo completo reproduce exactamente el mazo',()=>{
 const s=newGame({easy:true,normal:true,threshold:0}),counts={};
 for(let i=0;i<56;i++){const c=draw(s,()=>0);counts[c.cardId]=(counts[c.cardId]||0)+1;if(i<55)assert.equal(total(s.remaining),55-i);}
 assert.deepEqual(counts,s.initial);assert.equal(s.cycle,2);assert.equal(total(s.remaining),56);
});
test('umbral estricto: con 28 cartas, 25% no reinicia en 7, sí en 6',()=>{
 const s=newGame({easy:false,normal:false,threshold:25});for(let i=0;i<21;i++)draw(s,()=>0);
 assert.equal(total(s.remaining),7);assert.equal(s.cycle,1);draw(s,()=>0);
 assert.equal(total(s.remaining),28);assert.equal(s.cycle,2);
});
test('reinicio dentro de una tanda conserva contadores, historial y fijados',()=>{
 const s=newGame({easy:false,normal:false,threshold:25},3,2);
 for(let i=0;i<20;i++)draw(s,()=>0);
 s.pins=[{uid:100,cardId:'abominacion'}];const b=spawn(s,()=>0);
 assert.equal(b.slots.length,5);assert.deepEqual(b.slots.map(t=>t.kind),['normal','normal','normal','necro','necro']);
 assert.deepEqual(b.slots.map(t=>t.draws[0].cycle),[1,1,2,2,2]);
 assert.equal(total(s.remaining),25);assert.equal(s.necro,2);assert.equal(s.pins.length,1);assert.equal(s.history.length,1);
});
test('reemplazar consume otra copia y conserva carta descartada en su zona',()=>{
 const s=newGame({easy:true,normal:true,threshold:0},1,0);spawn(s,()=>0);replaceCard(s,1,0,()=>0);
 const cards=s.history[0].slots[0].draws;assert.equal(cards.length,2);assert.equal(cards[0].discarded,true);assert.equal(cards[1].discarded,false);
 assert.equal(total(s.remaining),54);assert.equal(s.remaining.nigromante,7);assert.equal(s.history.length,1);
});
test('cero zonas no roba; recuperación conserva todos los datos',()=>{
 const s=newGame(undefined,0,0);assert.equal(spawn(s),null);assert.equal(total(s.remaining),56);
 s.normal=3;spawn(s,()=>0.4);s.pins.push({...s.history[0].slots[0].draws[0]});
 const recovered=JSON.parse(JSON.stringify(s));assert.ok(isValid(recovered));assert.deepEqual(recovered,s);
 recovered.remaining.nigromante=10;assert.equal(isValid(recovered),false);
});

test('descarte sin reposición conserva el consumo y los contadores',()=>{
 const s=newGame({easy:true,normal:true,threshold:0});spawn(s,()=>0);
 const before=structuredClone(s);discardCard(s,1,1);discardCard(s,1,1);
 assert.deepEqual(s.remaining,before.remaining);assert.equal(s.sequence,before.sequence);
 assert.equal(s.normal,before.normal);assert.equal(s.necro,before.necro);
 assert.equal(s.history[0].slots[1].draws.length,1);assert.equal(s.history[0].slots[1].draws[0].discarded,true);
 replaceCard(s,1,1,()=>0);assert.equal(s.history[0].slots[1].draws.at(-1).discarded,false);assert.equal(total(s.remaining),52);
});
test('añadir normal y nigromante roba una carta y aumenta solo su contador',()=>{
 const s=newGame({easy:true,normal:true,threshold:0},3,1);spawn(s,()=>0);
 addZoneCard(s,1,'normal',()=>0);addZoneCard(s,1,'necro',()=>0);addZoneCard(s,1,'normal',()=>0);
 assert.equal(s.normal,5);assert.equal(s.necro,2);assert.equal(s.history.length,1);
 assert.deepEqual(s.history[0].slots.map(slot=>slot.zone),['Zona 1','Zona 2','Zona 3','Nigromante 1','Zona 4','Nigromante 2','Zona 5']);
 assert.equal(total(s.remaining),49);assert.equal(s.sequence,7);
 const before=structuredClone(s);assert.throws(()=>addZoneCard(s,1,'invalid',()=>0));assert.deepEqual(s,before);
});
test('una carta adicional respeta el reinicio anticipado sin borrar la tanda',()=>{
 const s=newGame({easy:false,normal:false,threshold:25},1,0);spawn(s,()=>0);
 for(let i=0;i<20;i++)draw(s,()=>0);
 assert.equal(total(s.remaining),7);addZoneCard(s,1,'necro',()=>0);
 assert.equal(total(s.remaining),28);assert.equal(s.cycle,2);assert.equal(s.history[0].slots.length,2);
 assert.equal(s.history[0].slots.at(-1).draws[0].cycle,1);assert.equal(s.necro,1);
});
test('desfijar conserva el registro: activas primero, última desfijada al inicio',()=>{
 const s=newGame();spawn(s,()=>0.5);
 const cards=s.history[0].slots.map(slot=>slot.draws[0]);cards.forEach(c=>pinCard(s,c));
 unpinCard(s,cards[0].uid);unpinCard(s,cards[2].uid);
 assert.deepEqual(s.pins.map(c=>c.uid),[cards[1].uid]);assert.deepEqual(s.unpinned.map(c=>c.uid),[cards[2].uid,cards[0].uid]);
 assert.equal(s.history[0].slots.length,3);assert.ok(isValid(JSON.parse(JSON.stringify(s))));
 pinCard(s,cards[2]);assert.deepEqual(s.unpinned.map(c=>c.uid),[cards[0].uid]);
 unpinCard(s,cards[2].uid);unpinCard(s,cards[2].uid);assert.deepEqual(s.unpinned.map(c=>c.uid),[cards[2].uid,cards[0].uid]);
});
test('desfijar nigromante resta solo por elección y no vuelve negativo',()=>{
 const s=newGame(undefined,3,1);spawn(s,()=>0);const c=s.history[0].slots[0].draws[0];
 pinCard(s,c);unpinCard(s,c.uid,false);assert.equal(s.necro,1);assert.equal(s.unpinned.length,1);
 pinCard(s,c);unpinCard(s,c.uid,true);assert.equal(s.necro,0);
 pinCard(s,c);unpinCard(s,c.uid,true);assert.equal(s.necro,0);assert.equal(s.unpinned.length,1);
});
test('las partidas anteriores se recuperan sin perder historial ni fijados',()=>{
 const old=newGame();spawn(old,()=>0);pinCard(old,old.history[0].slots[0].draws[0]);delete old.unpinned;
 assert.ok(isValid(old));unpinCard(old,old.pins[0].uid);assert.equal(old.unpinned.length,1);
 assert.ok(isValid(JSON.parse(JSON.stringify(old))));assert.equal(old.history.length,1);
 const fresh=newGame();assert.equal(fresh.unpinned.length,0);
});
