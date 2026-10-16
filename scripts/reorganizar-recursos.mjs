import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {CARPETAS_RECURSOS,esRutaRecurso} from './rutas-recursos.mjs';
const raiz=fileURLToPath(new URL('../',import.meta.url));
const leer=async archivo=>JSON.parse(await readFile(path.join(raiz,'datos',archivo),'utf8'));
const inventario=await leer('catalogo_recursos.json');
const porHash=new Map(inventario.recursos.map(r=>[r.sha256,r]));
const rutas=new Map(),recursos=[];
const mazos=['apoyo-supervivientes','general-base','general-expansiones','nigromantes','abominaciones'];
for(const [i,carpeta] of CARPETAS_RECURSOS.entries()){
 for(const nombre of (await readdir(path.join(raiz,'recursos',carpeta))).filter(n=>n.toLowerCase().endsWith('.png')).sort()){
  const ruta=`recursos/${carpeta}/${nombre}`;
  if(!esRutaRecurso(ruta))throw new Error(`Ruta no permitida: ${ruta}`);
  const bytes=await readFile(path.join(raiz,ruta));
  const hash=createHash('sha256').update(bytes).digest('hex');
  const anterior=porHash.get(hash);if(!anterior)throw new Error(`Recurso sin identidad previa: ${ruta}`);
  if(rutas.has(anterior.ruta))throw new Error(`Recurso repetido: ${ruta}`);
  rutas.set(anterior.ruta,ruta);
  recursos.push({...anterior,ruta,grupo:carpeta,mazo_destino:mazos[i]});
 }
}
const destino=ruta=>rutas.get(ruta)||null;
const ubicacion=ruta=>recursos.find(r=>r.ruta===ruta)?.mazo_destino;
const base=await leer('mazo_base.json');
for(const c of base.cartas){c.imagen=destino(c.imagen);if(!c.imagen)throw new Error(`Carta base no encontrada: ${c.id}`);}
const enemigos=await leer('catalogo_enemigos_borrador.json');
enemigos.enemigos=enemigos.enemigos.map(c=>{
 const imagen_original=destino(c.imagen_original),imagen_es=destino(c.imagen_es);
 const variantes_por_revisar=c.variantes_por_revisar.map(destino).filter(Boolean);
 if(!imagen_original&&!imagen_es&&!variantes_por_revisar.length)return null;
 const mazo=ubicacion(imagen_es||imagen_original||variantes_por_revisar[0]);
 return {...c,imagen_original,imagen_es,variantes_por_revisar,mazo_destino:mazo,
  tipo_sugerido:mazo==='nigromantes'?'nigromante':'abominacion',tipo_confirmado_por_usuario:true,
  cantidad_inicial_mazo_secundario:1,disponible_en_coleccion:true,
  pendientes:c.pendientes.filter(p=>p!=='seleccionar disponibles')};
}).filter(Boolean);
enemigos.nota='Colección clasificada por el usuario en carpetas 03 y 04. Una copia por carta secundaria; modalidades y reglas pendientes.';
const expansiones=await leer('cartas_expansion_pendientes.json');
expansiones.cartas=expansiones.cartas.map(c=>({...c,imagen:destino(c.imagen)})).filter(c=>c.imagen&&ubicacion(c.imagen)==='general-expansiones');
const referencias=await leer('referencias_borrador.json');
for(const c of referencias.referencias){
 c.imagen=destino(c.imagen);c.imagen_es=destino(c.imagen_es);
 if(!c.imagen&&!c.imagen_es)throw new Error(`Ayuda no encontrada: ${c.id}`);
 c.mazo_destino=ubicacion(c.imagen_es||c.imagen);
 if(c.mazo_destino==='apoyo-supervivientes'){c.en_espera=true;c.nota='Apoyo de supervivientes conservado en standby; sin automatización.';}
 if(['nigromantes','abominaciones'].includes(c.mazo_destino))c.cantidad_inicial_mazo_secundario=1;
}
const nuevoInventario={...inventario,version:2,nota:'Recursos de la colección del usuario organizados en carpetas 00–04. Sin cantidades inferidas desde archivos.',recursos};
delete nuevoInventario.archivos_recuperados_antes_de_deduplicar;
delete nuevoInventario.archivos_unicos_por_sha256;
nuevoInventario.total_archivos=recursos.length;
for(const [archivo,datos] of Object.entries({'mazo_base.json':base,'catalogo_recursos.json':nuevoInventario,'catalogo_enemigos_borrador.json':enemigos,'cartas_expansion_pendientes.json':expansiones,'referencias_borrador.json':referencias})){
 await writeFile(path.join(raiz,'datos',archivo),JSON.stringify(datos,null,2)+'\n');
}
console.log(`Reorganizados ${recursos.length} recursos. Se conservan las 12 identidades base y ${enemigos.enemigos.length} fichas de enemigo disponibles.`);
