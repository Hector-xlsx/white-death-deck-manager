// Registro local de cambios aceptados. No incluye el propio registro ni el respaldo
// de anulación: evita copias recursivas y conserva las anulaciones por separado.
const copia=valor=>JSON.parse(JSON.stringify(valor));
function estadoRegistrable(s){const {registroActividad,respaldoTanda,...estado}=s;return copia(estado);}
function diferencias(antes,despues,ruta=[],salida=[]){
 if(JSON.stringify(antes)===JSON.stringify(despues))return salida;
 if(antes&&despues&&typeof antes==='object'&&typeof despues==='object'&&Array.isArray(antes)===Array.isArray(despues)){
  for(const clave of new Set([...Object.keys(antes),...Object.keys(despues)]))diferencias(antes[clave],despues[clave],[...ruta,clave],salida);
 }else salida.push({ruta,...(antes!==undefined?{antes}:{}),...(despues!==undefined?{despues}:{})});
 return salida;
}
export function registrarActividad(anterior,siguiente,fecha=Date.now(),reinicio=false){
 const antes=estadoRegistrable(anterior),despues=estadoRegistrable(siguiente),cambios=diferencias(antes,despues);
 if(!cambios.length)return;
 const registro=!reinicio&&anterior.registroActividad?copia(anterior.registroActividad):{version:1,iniciadoEn:fecha,estadoInicial:reinicio?despues:antes,eventos:[]};
 const anulada=antes.history.length>despues.history.length&&anterior.respaldoTanda&&!reinicio;
 const generada=despues.history.length>antes.history.length;
 const tipo=reinicio?'nueva-partida':anulada?'tanda-anulada':generada?'spawn':cambios.some(c=>['config','proximaConfig'].includes(c.ruta[0]))?'configuracion':cambios.some(c=>c.ruta[0]==='history')?'cambio-cartas':'cambio-partida';
 registro.eventos.push({id:registro.eventos.length+1,fecha,tipo,tanda:anulada?antes.history.at(-1).number:despues.history.at(-1)?.number??null,...(generada?{generadaEn:despues.history.at(-1).date}:{}),cambios:reinicio?[]:cambios});
 siguiente.registroActividad=registro;
}
export function registroActividadValido(r){
 return r===undefined||Boolean(r&&r.version===1&&Number.isFinite(r.iniciadoEn)&&r.estadoInicial&&Array.isArray(r.eventos)&&r.eventos.every((e,i)=>e.id===i+1&&Number.isFinite(e.fecha)&&typeof e.tipo==='string'&&Array.isArray(e.cambios)&&e.cambios.every(c=>Array.isArray(c.ruta)&&c.ruta.every(k=>typeof k==='string')&&(Object.hasOwn(c,'antes')||Object.hasOwn(c,'despues')))));
}
