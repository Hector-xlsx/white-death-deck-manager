import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,cp,readFile,writeFile,readdir,access,rm} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {createHash} from 'node:crypto';
import {CARPETAS_RECURSOS,esRutaRecurso} from '../scripts/rutas-recursos.mjs';
import {datos} from '../dist/catalogo.js';
const raiz=fileURLToPath(new URL('../',import.meta.url));
const ejecutar=promisify(execFile);
test('rutas clasificadas admiten espacios y Unicode, y rechazan traversal y carpetas antiguas',()=>{
 for(const r of datos.recursos.recursos)assert.ok(esRutaRecurso(r.ruta));
 assert.ok(esRutaRecurso('recursos/04 - Mazo Abominaciones ESP/Shakōki Dogū_ reglas en español-2.png'));
 for(const ruta of ['recursos/originales/471_Nigromante.png','recursos/01 Mazo Spawn - Juego base/../otra.png','recursos/01 Mazo Spawn - Juego base/%2e%2e.png','recursos/01 Mazo Spawn - Juego base/carta".png','https://sitio/carta.png'])assert.equal(esRutaRecurso(ruta),false);
});
test('coleccion conserva sus 60 archivos y cantidades secundarias sin habilitar reglas pendientes',()=>{
 assert.equal(datos.recursos.recursos.length,60);
 for(const [i,carpeta] of CARPETAS_RECURSOS.entries())assert.equal(datos.recursos.recursos.filter(r=>r.grupo===carpeta).length,[3,12,6,11,21,7][i]);
 assert.ok(datos.enemigos.enemigos.every(c=>c.tipo_confirmado_por_usuario&&c.disponible_en_coleccion&&c.cantidad_inicial_mazo_secundario===1&&!c.habilitado_para_sorteo));
 const kijin=datos.enemigos.enemigos.find(c=>c.id==='enemigo-kijin');assert.equal(kijin.variantes_por_revisar.length,0);assert.equal(kijin.cantidad_inicial_mazo_secundario,1);
 assert.equal(kijin.imagen_es,'recursos/04 - Mazo Abominaciones ESP/Carta Kijin de Zombicide-13.png');
 assert.ok(datos.referencias.referencias.filter(c=>c.mazo_destino==='apoyo-supervivientes').every(c=>c.en_espera));
 const usadas=new Set([...datos.base.cartas.map(c=>c.imagen),...datos.enemigos.enemigos.flatMap(c=>[c.imagen_original,c.imagen_es,...c.variantes_por_revisar]),...datos.expansiones.cartas.map(c=>c.imagen),...datos.referencias.referencias.flatMap(c=>[c.imagen,c.imagen_es]),...datos.daily.cartas.map(c=>c.imagen)].filter(Boolean));
 assert.equal(usadas.size,60);for(const ruta of usadas)assert.ok(esRutaRecurso(ruta));
});
test('preparacion completa funciona sin ninguna carpeta fuente antigua',async()=>{
 const temporal=await mkdtemp(path.join(os.tmpdir(),'mazo-recursos-'));
 try{
  for(const carpeta of ['scripts','datos','dist','base-web/dist/assets','recursos'])await mkdir(path.join(temporal,carpeta),{recursive:true});
  for(const script of ['preparar.mjs','sw-plantilla.js','rutas-recursos.mjs'])await cp(path.join(raiz,'scripts',script),path.join(temporal,'scripts',script));
  for(const json of ['mazo_base.json','mazo_abominaciones.json','mazo_nigromantes.json','mazo_daily.json','catalogo_enemigos_borrador.json','cartas_expansion_pendientes.json','referencias_borrador.json','configuracion_referencia.json','coleccion.json','catalogo_recursos.json'])await cp(path.join(raiz,'datos',json),path.join(temporal,'datos',json));
  for(const entrada of await readdir(path.join(raiz,'dist'),{withFileTypes:true}))if(entrada.isFile())await cp(path.join(raiz,'dist',entrada.name),path.join(temporal,'dist',entrada.name));
  await cp(path.join(raiz,'dist/assets'),path.join(temporal,'dist/assets'),{recursive:true});
  await cp(path.join(raiz,'dist/recursos'),path.join(temporal,'dist/recursos'),{recursive:true});
  await cp(path.join(raiz,'base-web/dist/assets'),path.join(temporal,'base-web/dist/assets'),{recursive:true});
  for(const carpeta of CARPETAS_RECURSOS)await cp(path.join(raiz,'recursos',carpeta),path.join(temporal,'recursos',carpeta),{recursive:true});
  await cp(path.join(raiz,'recursos/Imagenes generales'),path.join(temporal,'recursos/Imagenes generales'),{recursive:true});
  await cp(path.join(raiz,'recursos/06 - Cartas Apariciones adicionales'),path.join(temporal,'recursos/06 - Cartas Apariciones adicionales'),{recursive:true});
  const antiguas=['originales','traducciones_es','variantes_por_revisar'];
  for(const carpeta of antiguas){await mkdir(path.join(temporal,'dist/recursos',carpeta),{recursive:true});await writeFile(path.join(temporal,'dist/recursos',carpeta,'copia-generada.txt'),'antigua');}
  const resultado=await ejecutar(process.execPath,['scripts/preparar.mjs'],{cwd:temporal});assert.match(resultado.stdout,/60 recursos/);
  for(const carpeta of antiguas){await assert.rejects(access(path.join(temporal,'recursos',carpeta)));await assert.rejects(access(path.join(temporal,'dist/recursos',carpeta)));}
  for(const r of datos.recursos.recursos)assert.equal(createHash('sha256').update(await readFile(path.join(temporal,'dist',r.ruta))).digest('hex'),r.sha256);
  const sw=await readFile(path.join(temporal,'dist/sw.js'),'utf8');assert.doesNotMatch(sw,/recursos\/(originales|traducciones_es|variantes_por_revisar)\//);
  assert.ok(sw.includes('Carta Kijin de Zombicide-13.png'));assert.ok(!sw.includes('Carta Kijin con corrección tipográfica-18.png'));
  for(const nombre of ['caminante.png','bruto.png','corredor.png','Trepador-2.png','Guerrero de terracota animado-1.png','Caminante ballestero-1.png']){
   const ruta=`recursos/06 - Cartas Apariciones adicionales/${nombre}`;
   assert.ok(sw.includes(ruta));assert.deepEqual(await readFile(path.join(temporal,'dist',ruta)),await readFile(path.join(raiz,ruta)));
  }
  await assert.rejects(access(path.join(temporal,'dist/recursos/04 - Mazo Abominaciones ESP/Carta Kijin con corrección tipográfica-18.png')));
for(const nombre of ['Marcador de zonas de nigromante.png','Marcador de zonas de estandar.png','Franja modular de corrupción verde.png','Muralla nevada con torre y escalera.png','Sección de muro nevado liso-2.png','Muralla nevada con caldero, antorcha y estandarte-1.png','Puerta nevada con torres y calderos.png','Contratapa Mazo - La tormenta oculta la horda.png','Banderín rojo de abominación-2.png','Estandarte esmeralda del nigromante-1.png','Zombi barrigón en estandarte morado.png','Estandarte del caminante zombi.png','Estandarte ámbar del zombi corredor.png','Ficha circular de horda zombi.png','marcos_corregidos_280x437/marco_nigromante.png','marcos_corregidos_280x437/marco_abominacion.png']){
   const marcador=`recursos/Imagenes generales/${nombre}`;
   assert.ok(sw.includes(marcador));assert.deepEqual(await readFile(path.join(temporal,'dist',marcador)),await readFile(path.join(raiz,marcador)));
  }
 }finally{
  const esperado=path.join(os.tmpdir(),path.basename(temporal));assert.equal(path.resolve(temporal),path.resolve(esperado));
  assert.ok(path.basename(temporal).startsWith('mazo-recursos-'));await rm(temporal,{recursive:true});
 }
});
