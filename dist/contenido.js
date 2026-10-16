import {CATALOG,datos,normalizarConfig,componer,idsSecundarios,IDS_OTROS,enColeccion,cajaCarta,nombreVisible} from './catalogo.js';
import {configDailyValida} from './daily.js';
import {erroresLimites} from './limites.js';
import {configModosValida} from './modos-enemigos.js';
export const FILTROS_CONTENIDO=['zombies','abominaciones','nigromantes','daily','otros'];
export const campoFiltro=filtro=>filtro==='abominaciones'?'selectedAbominacionesIds':filtro==='nigromantes'?'selectedNigromantesIds':filtro==='daily'?'selectedDailyIds':'selectedIds';
export function configContenido(config){
 return normalizarConfig({...config,coleccionIds:config.coleccionIds??datos.coleccion.cajas.map(c=>c.id),selectedAbominacionesIds:config.selectedAbominacionesIds??datos.abominaciones.cartas_ids,selectedNigromantesIds:config.selectedNigromantesIds??datos.nigromantes.cartas_ids,selectedDailyIds:config.selectedDailyIds??datos.daily.cartas_ids});
}
export function fichasContenido(filtro){
 if(filtro==='daily')return datos.daily.cartas.map(c=>({id:c.id,nombre:c.nombre,copias:1,cajaId:cajaCarta(c.id),operativa:true,obligatoria:false}));
 if(filtro==='abominaciones'||filtro==='nigromantes')return datos.enemigos.enemigos.filter(c=>datos[filtro].cartas_ids.includes(c.id)).map(c=>({id:c.id,nombre:c.nombre,copias:1,cajaId:cajaCarta(c.id),operativa:true,obligatoria:false}));
 const base=CATALOG.filter(c=>IDS_OTROS.includes(c.id)===(filtro==='otros')).map(c=>({id:c.id,nombre:nombreVisible(c.name),tipo:c.tipo,dificultad:c.difficulty,copias:c.copies,cajaId:cajaCarta(c.id),operativa:true,obligatoria:filtro==='otros'}));
 const pendientes=datos.expansiones.cartas.filter(c=>!c.habilitada_para_sorteo&&(c.clase_sugerida==='spawn_general')===(filtro==='zombies')).map(c=>({id:c.id,nombre:c.nombre_sugerido,tipo:c.tipo_zombi_sugerido,copias:null,cajaId:cajaCarta(c.id),operativa:false,obligatoria:false}));
 return [...base,...pendientes];
}
export function visiblesContenido(config,filtro){return fichasContenido(filtro).filter(c=>enColeccion(c.id,config)).map(c=>filtro==='nigromantes'&&config.reglaNigromantes!==undefined&&c.id==='enemigo-nigromante-profanador'?{...c,obligatoria:true}:c);}
export function marcarContenido(config,filtro,marcar){
 return seleccionarContenido(config,filtro,visiblesContenido(config,filtro).map(c=>c.id),marcar);
}
export function seleccionarContenido(config,filtro,cartasIds,marcar){
 const campo=campoFiltro(filtro),ids=new Set(config[campo]),resultado={...config};
 for(const c of visiblesContenido(config,filtro))if(cartasIds.includes(c.id)&&c.operativa&&!c.obligatoria){
  if(marcar)ids.add(c.id);else ids.delete(c.id);
  const pareja=c.id==='enemigo-mumm-ra'?'enemigo-mumm-ra-abominacion':c.id==='enemigo-mumm-ra-abominacion'?'enemigo-mumm-ra':null;
  if(pareja){const otro=filtro==='nigromantes'?'selectedAbominacionesIds':'selectedNigromantesIds',seleccion=new Set(config[otro]);if(marcar)seleccion.add(pareja);else seleccion.delete(pareja);resultado[otro]=[...seleccion];}
 }
 return normalizarConfig({...resultado,[campo]:[...ids]});
}
export function resumenCaja(config,filtro,cajaId){
 const cartas=visiblesContenido(config,filtro).filter(c=>c.cajaId===cajaId&&c.operativa),ids=new Set(config[campoFiltro(filtro)]);
 const marcadas=cartas.filter(c=>c.obligatoria||ids.has(c.id)).length,total=cartas.length;
 return {marcadas,total,completa:total>0&&marcadas===total,parcial:marcadas>0&&marcadas<total,editable:cartas.some(c=>!c.obligatoria)};
}
export function marcarCaja(config,filtro,cajaId,marcar){return seleccionarContenido(config,filtro,visiblesContenido(config,filtro).filter(c=>c.cajaId===cajaId).map(c=>c.id),marcar);}
export function erroresContenido(config){
 const general=componer(config),errores=[];
 if(!Object.values(general).some(n=>n>0))errores.push('Selecciona cartas para el mazo general.');
 if(general.abominacion&&!idsSecundarios(config,'abominaciones').length)errores.push('Selecciona al menos una abominación de tu colección.');
 if(config.modoNigromantes!==undefined&&general.nigromante&&!idsSecundarios(config,'nigromantes').length)errores.push('Selecciona al menos un nigromante de tu colección.');
 if(config.dailyHabilitado&&!idsSecundarios(config,'daily').length)errores.push('Selecciona al menos un Daily Spawn de tu colección.');
 if(!configDailyValida(config))errores.push('Las probabilidades de Daily Spawn deben incluir base e incremento entre 0 y 100 para cada nivel.');
 if(!configModosValida(config))errores.push('Los modos de enemigos no son válidos.');
 if(config.reglaAbominaciones==='estandar'&&datos.enemigos.enemigos.find(a=>a.id===config.abominacionEstandarId)?.trofeo)errores.push('Estándar no permite abominaciones con trofeo.');
 if(config.reglaAbominaciones==='estandar'&&!idsSecundarios(config,'abominaciones').length)errores.push('Selecciona la abominación estándar entre las marcadas en tu colección.');
 errores.push(...erroresLimites(config.limitesPorAdrenalina,config.reglaNigromantes!==undefined));
 return errores;
}
export function firmaContenido(config){return JSON.stringify(Object.fromEntries(Object.entries(config).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>[k,Array.isArray(v)?[...v].sort():v])));}
