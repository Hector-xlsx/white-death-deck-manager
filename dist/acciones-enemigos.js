export const ACCIONES_ENEMIGOS=['activacion','spawn','activacion-spawn'];
export const ACCIONES_EXTENDIDAS=[...ACCIONES_ENEMIGOS,'activacion-azar','activacion-azar-spawn'];
export const OPCIONES_ENEMIGOS=[...ACCIONES_ENEMIGOS,'azar','elegir'];
export const NOMBRES_ACCIONES={activacion:'Activación adicional',spawn:'Spawn adicional','activacion-spawn':'Activación adicional + Spawn adicional',azar:'Al azar',elegir:'Elegir en el momento'};

export function accionPorDefecto(s,tipo,rng){
 const opcion=s.history?.at(-1)?.accionesEnemigos?.[tipo]??s.accionesPredeterminadas?.[tipo]??'elegir';
 if(!OPCIONES_ENEMIGOS.includes(opcion))throw new Error('Accion por defecto invalida');
 if(opcion!=='azar')return opcion;
 const azar=rng();
 if(!Number.isFinite(azar)||azar<0||azar>=1)throw new Error('Aleatoriedad invalida');
 return ACCIONES_ENEMIGOS[Math.floor(azar*ACCIONES_ENEMIGOS.length)];
}
export function validarAccionEnemigo(c,campo){
 if(c.accionEnemigo===undefined)return true;
 if(c.accionEnemigo==='sin-efecto')return Boolean(c.revelacionIndependiente)&&['sin-efecto','anulada'].includes(c[campo]);
 if(!ACCIONES_EXTENDIDAS.includes(c.accionEnemigo))return false;
 const resolucion=c[campo];
 return resolucion==='anulada'||(resolucion==='activacion'?['activacion','activacion-azar'].includes(c.accionEnemigo):resolucion==='spawn'&&['spawn','activacion-spawn','activacion-azar-spawn'].includes(c.accionEnemigo));
}
