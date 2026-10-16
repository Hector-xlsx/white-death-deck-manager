import {duracionCarta,DURACION_ACTIVACION} from './volteo.js';
import {tieneActivacionAdicional} from './presentacion.js';

export function crearRevelacion(items,numero,ahora,{conocidos=null,porResolver=[],reducida=false}={}){
 const iniciales=items.filter(({c,slot})=>!c.mazo&&slot.kind!=='derivada').map(({c})=>c.uid);
 return {numero,reducida,visibles:new Set(conocidos??iniciales),reveladas:new Set(conocidos??[]),resueltas:new Set((conocidos??[]).filter(uid=>!porResolver.includes(uid))),espera:null,activacion:null,fase:'resolviendo',hasta:ahora};
}

// Recorrer el orden visual actualizado permite incorporar una elección sin rehacer la cadena.
export function avanzarRevelacion(plan,items,ahora){
 if(ahora<plan.hasta)return {demora:plan.hasta-ahora};
 plan.fase='resolviendo';plan.espera=null;plan.activacion=null;
 for(const item of items){
  const {c}=item,duracion=duracionCarta(item);
  plan.visibles.add(c.uid);
  if(!plan.reveladas.has(c.uid)){
   plan.reveladas.add(c.uid);
   if(!plan.reducida){plan.hasta=ahora+duracion;return {revelar:c.uid,demora:duracion};}
  }
  if(c.spawnSlotId){const diferida=items.find(i=>i.slot.id===c.spawnSlotId&&i.slot.diferida&&!i.c.mazo);if(diferida)plan.visibles.add(diferida.c.uid);}
  if(c.mazo&&!c.referenciaActivacion||plan.resueltas.has(c.uid))continue;
  if(!c.discarded&&(c.resolucionNigromante||c.resolucionAbominacion)==='pendiente'){
   plan.espera=c.uid;plan.fase='eleccion';return {eleccion:c.uid};
  }
  plan.resueltas.add(c.uid);
  if(!plan.reducida&&tieneActivacionAdicional(c)&&(c.activaciones===undefined||c.referenciaActivacion)){
   plan.activacion={uid:c.uid,inicio:ahora};plan.fase='activacion';plan.hasta=ahora+DURACION_ACTIVACION;
   return {activacion:c.uid,demora:DURACION_ACTIVACION};
  }
 }
 plan.fase='lista';return {terminada:true};
}
