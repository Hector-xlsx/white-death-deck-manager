import datos from './catalogo-datos.js';
export {datos};
export const CATALOGO_BASE=datos.base.cartas.map(c=>({
 id:c.id,name:c.nombre,copies:c.cantidad_inicial,difficulty:c.dificultad,
 image:c.nombre_imagen_efectiva,...(c.efectos_por_nivel?{levels:c.efectos_por_nivel}:{}),
 tipo:c.tipo_zombi,juegoId:c.juego_id,expansionId:c.expansion_id,referenciasIds:c.referencias_ids
}));
export const CATALOG=[...CATALOGO_BASE,...datos.expansiones.cartas.filter(c=>c.habilitada_para_sorteo&&c.datos_confirmados).map(c=>({id:c.id,name:c.nombre_sugerido,copies:c.cantidad_inicial,difficulty:c.dificultad,image:c.imagen.split('/').at(-1),rutaImagen:c.imagen,levels:c.efectos_por_nivel,tipo:c.tipo_zombi_sugerido,juegoId:c.juego_id,expansionId:c.expansion_id,referenciasIds:[]}))];
export const dificultadVisible=dificultad=>dificultad==='Normal'?'Estándar':dificultad;
export const nombreVisible=nombre=>nombre.replace(/\bnormal\b/gi,'estándar');
export const IDS_OTROS=CATALOG.filter(c=>['nigromante','abominacion','asedio'].includes(c.tipo)||c.id.startsWith('activacion-')).map(c=>c.id);
export const cajaCarta=id=>datos.coleccion.cartas.find(c=>c.id===id)?.cajaId;
export function enColeccion(id,config){return config.coleccionIds===undefined||config.coleccionIds.includes(cajaCarta(id));}
export function idsSecundarios(config,mazo){
 const campo=mazo==='abominaciones'?'selectedAbominacionesIds':mazo==='daily'?'selectedDailyIds':'selectedNigromantesIds';
 const elegidos=new Set(config[campo]??datos[mazo].cartas_ids);
 if(mazo==='nigromantes'&&config.reglaNigromantes!==undefined){
  if(config.reglaNigromantes==='estandar')return ['enemigo-nigromante-profanador'];
  elegidos.add('enemigo-nigromante-profanador');
 }
 if(mazo==='abominaciones'&&config.reglaAbominaciones==='estandar'){
  const aptas=datos[mazo].cartas_ids.filter(id=>elegidos.has(id)&&enColeccion(id,config)&&!datos.enemigos.enemigos.find(a=>a.id===id)?.trofeo);
  if(config.abominacionEstandarId&&aptas.includes(config.abominacionEstandarId))return [config.abominacionEstandarId];
  return [aptas.includes('enemigo-abominacion-kan')?'enemigo-abominacion-kan':aptas[0]??'enemigo-abominacion-kan'];
 }
 return datos[mazo].cartas_ids.filter(id=>elegidos.has(id)&&enColeccion(id,config));
}
export function normalizarConfig(config={easy:true,normal:true,threshold:20}){
 const resultado={...config,selectedIds:[...new Set(config.selectedIds??CATALOGO_BASE.map(c=>c.id))]};
 if(config.dailyPorNivel!==undefined)resultado.dailyPorNivel=structuredClone(config.dailyPorNivel);
 if(config.limitesPorAdrenalina!==undefined)resultado.limitesPorAdrenalina=structuredClone(config.limitesPorAdrenalina);
 for(const campo of ['coleccionIds','selectedAbominacionesIds','selectedNigromantesIds','selectedDailyIds'])if(config[campo]!==undefined)resultado[campo]=[...new Set(config[campo])];
 if(config.coleccionIds!==undefined){resultado.coleccionIds=[...new Set(['core',...resultado.coleccionIds])];resultado.selectedIds=[...new Set([...resultado.selectedIds,...IDS_OTROS])];}
 if(config.reglaNigromantes!==undefined&&(config.selectedNigromantesIds?.includes('enemigo-mumm-ra')||config.selectedAbominacionesIds?.includes('enemigo-mumm-ra-abominacion'))){
  resultado.selectedNigromantesIds=[...new Set([...(resultado.selectedNigromantesIds??datos.nigromantes.cartas_ids),'enemigo-mumm-ra'])];
  resultado.selectedAbominacionesIds=[...new Set([...(resultado.selectedAbominacionesIds??datos.abominaciones.cartas_ids),'enemigo-mumm-ra-abominacion'])];
 }
 return resultado;
}
export function componer(config,cartas=CATALOG){
 const ids=new Set(config.selectedIds??cartas.map(c=>c.id));
 return Object.fromEntries(cartas.filter(c=>enColeccion(c.id,config)&&(ids.has(c.id)||config.coleccionIds!==undefined&&IDS_OTROS.includes(c.id))&&(!c.difficulty||(c.difficulty==='Fácil'?config.easy:config.normal))).map(c=>[c.id,c.copies]));
}
export function referenciasPorCarta(id){
 const ficha=datos.base.cartas.find(c=>c.id===id)||datos.enemigos.enemigos.find(c=>c.id===id);
 return datos.referencias.referencias.filter(r=>r.vinculos_confirmados&&((r.cartas_vinculadas_ids||[]).includes(id)||(ficha?.referencias_ids||[]).includes(r.id)));
}
export function escapar(texto){return String(texto).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
export function rutaRecurso(ruta){
 if(!datos.recursos.recursos.some(r=>r.ruta===ruta))throw new Error('Recurso fuera del inventario');
 return `./${ruta}`;
}
