import {isValid,migrarEstado} from './estado.js';
import {registrarActividad} from './registro-actividad.js';
export const KEY='white-death-gestor-v2';
export const KEY_ANTERIOR='white-death-mvp-v1';
export function recuperar(almacen){
 const actual=almacen.getItem(KEY);
 if(actual!==null)return migrarEstado(JSON.parse(actual));
 const anterior=almacen.getItem(KEY_ANTERIOR);
 if(anterior===null)return null;
 const estado=migrarEstado(JSON.parse(anterior));
 almacen.setItem(KEY,JSON.stringify(estado));
 return estado;
}
export function guardarAccion(estado,accion,almacen,{esperado,nuevaPartida=false}={}){
 if(esperado!==undefined&&almacen.getItem(KEY)!==esperado){
  const error=new Error('La partida cambio en otra pestaña');error.code='PARTIDA_CAMBIADA';throw error;
 }
 const siguiente=structuredClone(estado);
 accion(siguiente);
 if(!isValid(siguiente))throw new Error('La accion produjo una partida invalida.');
 registrarActividad(estado,siguiente,Date.now(),nuevaPartida);
 almacen.setItem(KEY,JSON.stringify(siguiente));
 return siguiente;
}
