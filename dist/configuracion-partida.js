import {CATALOG,componer,normalizarConfig,idsSecundarios,enColeccion,datos} from './catalogo.js';
import {erroresContenido} from './contenido.js';
import {limitesIniciales} from './limites.js';
import {CARTAS_ABOMINACIONES} from './abominaciones.js';
import {CARTAS_NIGROMANTES} from './nigromantes.js';
import {CARTAS_DAILY} from './daily.js';
import {crearSecundario,recalcularSecundario} from './secundarios.js';
export const REVISION_REGLAS=2;
export function prepararConfiguracion(config){
 const c=normalizarConfig({...config,modoNigromantes:config.modoNigromantes??'sin-reposicion',reglaNigromantes:config.reglaNigromantes??'personalizado',reglaAbominaciones:config.reglaAbominaciones??'personalizado',limitesPorAdrenalina:config.limitesPorAdrenalina??limitesIniciales(true)});
 const elegidas=new Set(c.selectedAbominacionesIds??datos.abominaciones.cartas_ids);
 const aptas=CARTAS_ABOMINACIONES.filter(a=>!a.trofeo&&elegidas.has(a.id)&&enColeccion(a.id,c));
 if(!aptas.some(a=>a.id===c.abominacionEstandarId))c.abominacionEstandarId=aptas.find(a=>a.id==='enemigo-abominacion-kan')?.id??aptas[0]?.id??'enemigo-abominacion-kan';
 return c;
}
export function programarConfiguracion(s,config){
 const c=prepararConfiguracion(config),errores=erroresContenido(c);
 if(errores.length)throw new Error(errores.join(' '));
 const previa=s.configuracionPendiente?s.proximaConfig:s.config;
 const reincorporaciones=s.reincorporacionesPendientes??={};
 for(const mazo of ['abominaciones','nigromantes','daily','general']){
  const antes=new Set(mazo==='general'?Object.keys(componer(previa)):idsSecundarios(previa,mazo));
  const despues=mazo==='general'?Object.keys(componer(c)):idsSecundarios(c,mazo);
  reincorporaciones[mazo]=[...new Set([...(reincorporaciones[mazo]||[]),...despues.filter(id=>!antes.has(id))])];
 }
 s.proximaConfig=c;s.configuracionPendiente=true;s.config.threshold=c.threshold;
}
export function aplicarConfiguracionPendiente(s){
 if(!s.configuracionPendiente)return;
 const c=prepararConfiguracion(s.proximaConfig),errores=erroresContenido(c);
 if(errores.length)throw new Error(errores.join(' '));
 const anteriores={...s.initial};
 for(const ficha of CATALOG)if(!s.catalogo.cartas.some(a=>a.id===ficha.id))s.catalogo.cartas.push(structuredClone(ficha));
 s.config=c;s.initial=componer(c,s.catalogo.cartas);
 s.remaining=Object.fromEntries(Object.entries(s.initial).map(([id,n])=>[id,Object.hasOwn(anteriores,id)&&!s.reincorporacionesPendientes?.general?.includes(id)?Math.min(s.remaining[id]??0,n):n]));
 if(Object.values(s.remaining).every(n=>n===0)){s.remaining={...s.initial};s.cycle++;}
 for(const [mazo,catalogo] of [['abominaciones',CARTAS_ABOMINACIONES],['nigromantes',CARTAS_NIGROMANTES],['daily',CARTAS_DAILY]]){
  const ids=mazo==='daily'&&!c.dailyHabilitado?[]:idsSecundarios(c,mazo);
  if(!s[mazo]&&!ids.length)continue;
  const m=s[mazo]??=crearSecundario(catalogo.filter(a=>ids.includes(a.id)),mazo==='daily'?(c.modoDaily??'sin-reposicion'):c[mazo==='nigromantes'?'modoNigromantes':'modoAbominaciones']);
  const previos=new Set(m.habilitadasIds??m.cartas.map(a=>a.id));
  for(const id of ids){
   if(!m.cartas.some(a=>a.id===id)){m.cartas.push(structuredClone(catalogo.find(a=>a.id===id)));m.remaining[id]=1;}
   if((!previos.has(id)||s.reincorporacionesPendientes?.[mazo]?.includes(id))&&!s.pins.some(p=>p.mazo===mazo&&p.cardId===id)&&!Object.hasOwn(m.trofeos,id)){
    delete m.descarte[id];m.remaining[id]=1;
   }
  }
  m.dinamico=true;m.habilitadasIds=[...ids];m.modo=mazo==='daily'?(c.modoDaily??'sin-reposicion'):c[mazo==='nigromantes'?'modoNigromantes':'modoAbominaciones']??'sin-reposicion';
  recalcularSecundario(s,mazo);
 }
 s.configuracionDinamica=true;s.configuracionPendiente=false;
 delete s.reincorporacionesPendientes;
}
