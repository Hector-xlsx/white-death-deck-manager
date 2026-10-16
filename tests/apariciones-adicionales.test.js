import test from 'node:test';
import assert from 'node:assert/strict';
import {newGame,spawn,isValid,programarConfiguracion} from '../dist/engine.js';
import {resumenZombis} from '../dist/contador-zombis.js';
import {guardarAccion,recuperar,KEY} from '../dist/persistencia.js';
test('presentación opcional compatible; cambiarla conserva historial, presencias y contador',()=>{
 const s=newGame({easy:true,normal:true,threshold:0,selectedIds:['caminantes-normal'],modoNigromantes:'sin-reposicion',reglaNigromantes:'varios',reglaAbominaciones:'festival'},1);spawn(s,()=>0);assert.ok(isValid(s));
 const antes=JSON.stringify({historia:s.history,pins:s.pins,contador:resumenZombis(s),secuencia:s.sequence});
 const m=new Map([[KEY,JSON.stringify(s)]]),store={getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,v)};
 for(const modo of ['cartas-custom','minimalista']){
  const n=guardarAccion(s,x=>programarConfiguracion(x,{...x.config,modoAparicionAdicional:modo}),store);
  assert.equal(n.proximaConfig.modoAparicionAdicional,modo);assert.deepEqual(recuperar(store),n);
  assert.equal(JSON.stringify({historia:n.history,pins:n.pins,contador:resumenZombis(n),secuencia:n.sequence}),antes);
 }
 const invalido=structuredClone(s);invalido.proximaConfig.modoAparicionAdicional='otro';assert.equal(isValid(invalido),false);
});
