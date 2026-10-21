import {isValid} from './estado.js';
import {datos} from './catalogo.js';
import {VERSION_APP} from './version.js';

// Copia para análisis: no migra, guarda ni vuelve a resolver la partida.
export function prepararExportacion(estado,fecha=new Date()){
 if(!isValid(estado))throw new Error('No se puede exportar: la partida no tiene un formato válido.');
 const exportadoEn=fecha.toISOString();
 const informe={
  formato:'white-death-partida',versionExportacion:1,versionApp:VERSION_APP,exportadoEn,
  partida:estado,
  referencias:{enemigos:datos.enemigos.enemigos,daily:datos.daily.cartas,coleccion:datos.coleccion},
  alcance:[
   'Incluye la partida actual y su configuración guardada, incluida la pendiente de la próxima tanda.',
   'No incluye cambios sin guardar del formulario ni partidas anteriores reemplazadas al iniciar otra.',
   'Los niveles y ajustes reflejan lo registrado en la aplicación, no acciones físicas sin registrar.',
   'registroActividad conserva cambios guardados y anulaciones desde la incorporación del registro; no reconstruye acciones anteriores ni clics sin cambios.',
   'Las referencias son datos de catálogo de esta versión; las imágenes no están incluidas.'
  ]
 };
 return {nombre:`white-death-partida-${exportadoEn.replace(/[:.]/g,'-')}.json`,contenido:JSON.stringify(informe,null,2)};
}

export function descargarExportacion(archivo){
 const url=URL.createObjectURL(new Blob([archivo.contenido],{type:'application/json;charset=utf-8'}));
 const enlace=document.createElement('a');
 try{
  enlace.href=url;enlace.download=archivo.nombre;document.body.append(enlace);enlace.click();
 }finally{
  enlace.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);
 }
}
