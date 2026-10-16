import {readFile,writeFile,mkdir,copyFile,rm,realpath,lstat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {esRutaRecurso} from './rutas-recursos.mjs';

const raiz=fileURLToPath(new URL('../',import.meta.url));
const leer=async nombre=>JSON.parse(await readFile(path.join(raiz,'datos',nombre),'utf8'));
const datos={
 base:await leer('mazo_base.json'),
 abominaciones:await leer('mazo_abominaciones.json'),
 nigromantes:await leer('mazo_nigromantes.json'),
 daily:await leer('mazo_daily.json'),
 enemigos:await leer('catalogo_enemigos_borrador.json'),
 expansiones:await leer('cartas_expansion_pendientes.json'),
 referencias:await leer('referencias_borrador.json'),
 configuracion:await leer('configuracion_referencia.json'),
 coleccion:await leer('coleccion.json'),
 recursos:await leer('catalogo_recursos.json')
};
const ids=new Set();
const cajas=new Set(datos.coleccion.cajas.map(c=>c.id));
if(cajas.size!==datos.coleccion.cajas.length||!datos.coleccion.cajas.some(c=>c.id==='core'&&c.obligatoria)||new Set(datos.coleccion.cartas.map(c=>c.id)).size!==datos.coleccion.cartas.length||datos.coleccion.cartas.some(c=>!cajas.has(c.cajaId)))throw new Error('Coleccion invalida');
const fichasColeccion=new Set([...datos.base.cartas,...datos.enemigos.enemigos,...datos.expansiones.cartas,...datos.referencias.referencias,...datos.daily.cartas].map(c=>c.id));
const asociados=new Set(datos.coleccion.cartas.map(c=>c.id));
if(datos.coleccion.cartas.some(c=>!fichasColeccion.has(c.id))||[...datos.base.cartas.map(c=>c.id),...datos.abominaciones.cartas_ids,...datos.nigromantes.cartas_ids].some(id=>!asociados.has(id)))throw new Error('Carta operativa sin caja o asociacion desconocida');
for(const mazo of ['abominaciones','nigromantes']){
 const operativo=datos[mazo];
 if(new Set(operativo.cartas_ids).size!==operativo.cartas_ids.length||!operativo.cartas_ids.length)throw new Error(`Catalogo secundario invalido: ${mazo}`);
 for(const id of operativo.cartas_ids){
  const ficha=datos.enemigos.enemigos.find(c=>c.id===id);
  if(!ficha||ficha.mazo_destino!==mazo||!ficha.tipo_confirmado_por_usuario||ficha.cantidad_inicial_mazo_secundario!==1)throw new Error(`Carta secundaria incompleta: ${id}`);
 }
}
if(new Set(datos.daily.cartas_ids).size!==datos.daily.cartas.length||datos.daily.cartas.some(c=>!datos.daily.cartas_ids.includes(c.id)||c.cantidad_inicial!==1||!asociados.has(c.id)))throw new Error('Daily Spawn incompleto');
for(const c of datos.base.cartas){
 if(ids.has(c.id)||!c.datos_confirmados||!Number.isSafeInteger(c.cantidad_inicial)||c.cantidad_inicial<1)throw new Error(`Carta base invalida: ${c.id}`);
 ids.add(c.id);
 const original=await readFile(path.join(raiz,c.imagen));
 const copia=await readFile(path.join(raiz,'base-web/dist/assets',c.nombre_imagen_efectiva));
 if(!original.equals(copia))throw new Error(`Imagen base discrepante: ${c.id}`);
}
if(datos.base.cartas.reduce((n,c)=>n+c.cantidad_inicial,0)!==datos.base.total_copias)throw new Error('Total discrepante');
const rutas=new Set();
for(const recurso of datos.recursos.recursos){
 if(!esRutaRecurso(recurso.ruta))throw new Error(`Ruta no permitida: ${recurso.ruta}`);
 let fuente=path.join(raiz,recurso.ruta),archivo;
 try{archivo=await readFile(fuente);}catch(error){
  if(error.code!=='ENOENT')throw error;
  fuente=path.join(raiz,'dist',recurso.ruta);archivo=await readFile(fuente);
  console.warn(`Recurso fuente ausente; se valida y conserva la copia publicada: ${recurso.ruta}`);
 }
 if(createHash('sha256').update(archivo).digest('hex')!==recurso.sha256){
  fuente=path.join(raiz,'dist',recurso.ruta);archivo=await readFile(fuente);
  if(createHash('sha256').update(archivo).digest('hex')!==recurso.sha256)throw new Error(`Hash discrepante: ${recurso.ruta}`);
  console.warn(`Fuente modificada sin inventariar; se conserva la copia validada: ${recurso.ruta}`);
 }
 const destino=path.join(raiz,'dist',recurso.ruta);
 await mkdir(path.dirname(destino),{recursive:true});
 if(fuente!==destino)await copyFile(fuente,destino);
 rutas.add(`./${recurso.ruta}`);
}
// Todas las asociaciones deben apuntar a recursos inventariados, incluso las pendientes.
const recursosInterfaz=['recursos/Imagenes generales/Marcador de zonas de nigromante.png','recursos/Imagenes generales/Marcador de zonas de estandar.png','recursos/Imagenes generales/Franja modular de corrupción verde.png','recursos/Imagenes generales/Muralla nevada con torre y escalera.png','recursos/Imagenes generales/Sección de muro nevado liso-2.png','recursos/Imagenes generales/Muralla nevada con caldero, antorcha y estandarte-1.png','recursos/Imagenes generales/Puerta nevada con torres y calderos.png','recursos/Imagenes generales/Contratapa Mazo - La tormenta oculta la horda.png','recursos/Imagenes generales/Banderín rojo de abominación-2.png','recursos/Imagenes generales/Estandarte esmeralda del nigromante-1.png','recursos/Imagenes generales/Zombi barrigón en estandarte morado.png','recursos/Imagenes generales/Estandarte del caminante zombi.png','recursos/Imagenes generales/Estandarte ámbar del zombi corredor.png','recursos/Imagenes generales/Ficha circular de horda zombi.png','recursos/Imagenes generales/marcos_corregidos_280x437/marco_nigromante.png','recursos/Imagenes generales/marcos_corregidos_280x437/marco_abominacion.png'];
recursosInterfaz.push(...['caminante.png','bruto.png','corredor.png','Trepador-2.png','Guerrero de terracota animado-1.png','Caminante ballestero-1.png','Bruto custodio-2.png','Ninja del Pie-3.png'].map(nombre=>'recursos/06 - Cartas Apariciones adicionales/'+nombre));
recursosInterfaz.push(...['digits.js','score-counter.js','score-counter.css','themes.json','LICENSE_DIGITS.txt','assets/kang.png','assets/dragon.png','assets/cabeza.png'].map(nombre=>'recursos/Imagenes generales/contadores_puntaje/'+nombre));
for(const ruta of recursosInterfaz){
 const destino=path.join(raiz,'dist',ruta);
 await mkdir(path.dirname(destino),{recursive:true});
 await copyFile(path.join(raiz,ruta),destino);
}
for(const ficha of [...datos.enemigos.enemigos,...datos.expansiones.cartas,...datos.referencias.referencias,...datos.daily.cartas]){
 for(const ruta of [ficha.imagen,ficha.imagen_original,ficha.imagen_es,...(ficha.variantes_por_revisar||[])].filter(Boolean)){
  if(!rutas.has(`./${ruta}`))throw new Error(`Referencia inexistente: ${ruta}`);
 }
}
await writeFile(path.join(raiz,'dist/catalogo-datos.js'),`// Generado desde datos/ por scripts/preparar.mjs.\nexport default ${JSON.stringify(datos)};\n`);
// Limpiar solo las copias generadas antiguas, nunca recursos/ ni base-web/.
const generados=path.join(raiz,'dist','recursos');
for(const carpeta of ['originales','traducciones_es','variantes_por_revisar']){
 const destino=path.join(generados,carpeta);
 try{
  if((await lstat(destino)).isSymbolicLink())throw new Error(`Destino enlazado: ${destino}`);
  if(await realpath(destino)!==destino||path.dirname(destino)!==generados)throw new Error(`Destino inesperado: ${destino}`);
  await rm(destino,{recursive:true});
 }catch(error){if(error.code!=='ENOENT')throw error;}
}
const archivos=['./','./index.html','./style.css','./app.js','./presentacion.js','./contenido.js','./engine.js','./abominaciones.js','./nigromantes.js','./secundarios.js','./catalogo.js','./catalogo-datos.js','./estado.js','./persistencia.js','./informacion.js','./pwa.js','./manifest.webmanifest','./icon.svg','./icon-192.png','./icon-512.png',...datos.base.cartas.map(c=>`./assets/${c.nombre_imagen_efectiva}`),...rutas];
const plantilla=await readFile(path.join(raiz,'scripts/sw-plantilla.js'),'utf8');
archivos.push('./fichas-zombis.js','./tabla-puntajes.js','./formula-puntaje.js','./derrotas.js','./reglas-cartas.js','./apariciones-adicionales.js','./puntaje.js');
archivos.push('./volteo.js','./contador-zombis.js','./bake-danuki.js');
archivos.push('./revelacion.js');
archivos.push('./acciones-enemigos.js');
archivos.push('./daily.js');
archivos.push('./adrenalina.js');
archivos.push('./limites.js');
archivos.push('./modos-enemigos.js');
archivos.push('./configuracion-partida.js');
archivos.push(...recursosInterfaz.map(ruta=>`./${ruta}`));
const hash=createHash('sha256').update(plantilla);
for(const archivo of archivos.filter(a=>a!=='./'))hash.update(archivo).update(await readFile(path.join(raiz,'dist',archivo)));
const version=hash.digest('hex').slice(0,16);
await writeFile(path.join(raiz,'dist/version.js'),`export const VERSION_APP='${version}';\n`);
archivos.push('./version.js');
await writeFile(path.join(raiz,'dist/sw.js'),`// Generado desde scripts/sw-plantilla.js.\nconst VERSION_APP='${version}';\nconst ARCHIVOS=${JSON.stringify(archivos)};\n${plantilla}`);
console.log(`Preparados ${datos.base.total_copias} copias base y ${rutas.size} recursos. Version ${version}.`);
