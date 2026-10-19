// Composición pura: no consume azar ni modifica partidas.
export const ID_DISPARADOR='spawn-especial';
export const DISPARADOR_ESPECIAL={id:ID_DISPARADOR,name:'Spawn Especial',copies:6,difficulty:null,image:'Contratapa Mazo - La tormenta oculta la horda.png',rutaImagen:'recursos/Imagenes generales/Contratapa Mazo - La tormenta oculta la horda.png',tipo:'disparador-especial',juegoId:'white-death',expansionId:'virtual'};
export const NIVELES_ESPECIAL=['azul','amarillo','naranja','rojo'];
export function opcionesEspecial(config){
 return {modo:'directo',disparadores:6,reposicion:'sin-reposicion',daily:'independiente',cantidades:{},destinos:{},frecuencia:'carta',base:0,incremento:0,limite:null,compensar:false,...config.spawnEspecial};
}
export const especialActivo=c=>opcionesEspecial(c).modo!=='directo';
export const dailyIntegrado=c=>especialActivo(c)&&opcionesEspecial(c).daily==='integrado'&&Boolean(c.dailyHabilitado);
export const reposicionDaily=config=>dailyIntegrado(config)?opcionesEspecial(config).reposicion:config.modoDaily??'sin-reposicion';
export const esExpansionEspecial=c=>c.id.startsWith('spawn-')&&c.id!==ID_DISPARADOR&&!['abominacion','nigromante','asedio'].includes(c.tipo)&&!c.id.startsWith('activacion-');
export const cantidadEspecial=(config,c)=>opcionesEspecial(config).cantidades[c.id]??c.copies??1;
export function ajustarGeneralEspecial(config,composicion,cartas){
 const o=opcionesEspecial(config);if(o.modo==='directo')return composicion;
 const general={...composicion};
 for(const c of cartas.filter(esExpansionEspecial))if(Object.hasOwn(general,c.id)){
  if(o.modo==='probabilidad'&&o.destinos[c.id]==='general')general[c.id]=cantidadEspecial(config,c);
  else delete general[c.id];
 }
 if(o.modo==='disparadores')general[ID_DISPARADOR]=o.disparadores;
 if(o.compensar){
  const core=cartas.filter(c=>!esExpansionEspecial(c)&&c.id!==ID_DISPARADOR&&Object.hasOwn(composicion,c.id));
  const motor=core.filter(c=>['nigromante','abominacion','asedio'].includes(c.tipo));
  const otros=core.filter(c=>!motor.includes(c)).reduce((n,c)=>n+composicion[c.id],0);
  const extra=Object.entries(general).filter(([id])=>!core.some(c=>c.id===id)).reduce((n,[,q])=>n+q,0);
  if(otros>0)for(const c of motor)general[c.id]=Math.round(composicion[c.id]*(otros+extra)/otros);
 }
 return general;
}
export function configEspecialValida(config,cartas,dailyIds){
 if(config.spawnEspecial===undefined)return true;
 const o=opcionesEspecial(config),entero=n=>Number.isSafeInteger(n)&&n>=1,porcentaje=n=>Number.isFinite(n)&&n>=0&&n<=100;
 if(!config.spawnEspecial||typeof config.spawnEspecial!=='object'||Array.isArray(config.spawnEspecial))return false;
 if(!['directo','disparadores','probabilidad'].includes(o.modo)||!['sin-reposicion','con-reposicion'].includes(o.reposicion)||!['independiente','integrado'].includes(o.daily)||!['carta','tanda'].includes(o.frecuencia)||!entero(o.disparadores)||typeof o.compensar!=='boolean'||!porcentaje(o.base)||!porcentaje(o.incremento)||o.limite!==null&&!entero(o.limite))return false;
 const expansiones=cartas.filter(esExpansionEspecial).map(c=>c.id),ids=[...expansiones,...dailyIds];
 for(const [campo,validar] of [['cantidades',([id,q])=>ids.includes(id)&&entero(q)],['destinos',([id,d])=>expansiones.includes(id)&&['general','especial'].includes(d)]]){
  const mapa=o[campo];if(!mapa||typeof mapa!=='object'||Array.isArray(mapa)||!Object.entries(mapa).every(validar))return false;
 }
 if(o.elegibles!==undefined&&(!Array.isArray(o.elegibles)||new Set(o.elegibles).size!==o.elegibles.length||o.elegibles.some(id=>!cartas.some(c=>c.id===id))))return false;
 if(o.porNivel!==undefined&&(!o.porNivel||typeof o.porNivel!=='object'||Array.isArray(o.porNivel)||Object.keys(o.porNivel).length!==4||!NIVELES_ESPECIAL.every(n=>porcentaje(o.porNivel[n]?.base)&&porcentaje(o.porNivel[n]?.incremento))))return false;
 if(o.limitesPorNivel!==undefined&&(!o.limitesPorNivel||typeof o.limitesPorNivel!=='object'||Array.isArray(o.limitesPorNivel)||Object.keys(o.limitesPorNivel).length!==4||!NIVELES_ESPECIAL.every(n=>o.limitesPorNivel[n]===null||entero(o.limitesPorNivel[n]))))return false;
 return Number.isSafeInteger(Object.values(o.cantidades).reduce((a,b)=>a+b,0)+o.disparadores);
}
