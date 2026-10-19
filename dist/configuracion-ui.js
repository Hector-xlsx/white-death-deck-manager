import {componer,idsSecundarios,CATALOG,nombreVisible,escapar} from './catalogo.js';
import {idsElegiblesDaily} from './daily.js';
import {iniciarRevelacionUI,actualizarRevelacionUI} from './revelacion-ui.js';
import {opcionesEspecial,dailyIntegrado} from './especial-config.js';

const $=id=>document.getElementById(id);
const secciones={};
let pestanaActual='contenido',notaDaily;
function seccion(id,titulo,nodos){
 const d=document.createElement('details');d.id=`config-seccion-${id}`;d.className='config-section';
 const summary=document.createElement('summary'),nombre=document.createElement('span'),resumen=document.createElement('small');
 nombre.textContent=titulo;summary.append(nombre,resumen);d.append(summary,...nodos);secciones[id]={elemento:d,resumen};return d;
}
function abrirAncestros(nodo){for(let p=nodo.parentElement;p;p=p.parentElement)if(p.tagName==='DETAILS')p.open=true;}
export function mostrarPestanaConfiguracion(nombre,{enfocar=false}={}){
 pestanaActual=nombre;
 for(const tab of $('config-tabs').querySelectorAll('[role="tab"]')){const activa=tab.dataset.pestana===nombre;tab.setAttribute('aria-selected',String(activa));tab.tabIndex=activa?0:-1;}
 for(const p of $('config-panels').querySelectorAll('[role="tabpanel"]'))p.hidden=p.id!==`config-panel-${nombre}`;
 $('config-panels').scrollTop=0;
 if(enfocar)$(`config-tab-${nombre}`).focus();
}
export function iniciarConfiguracionUI(){
 const form=$('settings-form'),dialog=$('settings-dialog'),campos=[...form.querySelectorAll(':scope>fieldset')];
 const campo=nombre=>campos.find(f=>f.querySelector('legend')?.textContent===nombre);
 const dificultad=campo('Dificultad'),contenido=campo('Contenido'),nigromantes=campo('Mazo de nigromantes'),abominaciones=campo('Mazo de abominaciones'),reinicio=campo('Reiniciar mazo general de forma anticipada');
 const titulo=dialog.querySelector('h2');titulo.id='config-title';dialog.setAttribute('aria-labelledby',titulo.id);
 const coleccion=form.querySelector('.collection-section');
 for(const [mazo,campoDestino,tipo] of [['nigromantes',nigromantes,'nigromante'],['abominaciones',abominaciones,'abominacion']]){
  const bloque=document.createElement('div');bloque.className='config-acciones';
  iniciarRevelacionUI(bloque,mazo);campoDestino.append(bloque);
  for(const [selector,id] of [[`regla-${mazo}`,`descripcion-modo-${tipo}`],[`modo-${mazo}`,`descripcion-reposicion-${tipo}`]]){
   const ayuda=document.createElement('span');ayuda.id=id;ayuda.className='field-note';$(selector).after(ayuda);
  }
  const limites=document.createElement('div');limites.id=`config-limites-${mazo}`;limites.className='limit-settings';
  const table=document.createElement('table');table.className='daily-levels';
  table.innerHTML=`<caption>${mazo==='nigromantes'?'Tope de Nigromantes adicionales al Profanador en juego':'Topes personalizados por adrenalina'}</caption><thead><tr><th scope="col">Nivel</th><th scope="col">${mazo==='nigromantes'?'Nigromantes adicionales al Profanador':'Abominaciones totales'}</th></tr></thead><tbody></tbody>`;
  for(const nivel of ['azul','amarillo','naranja','rojo']){const input=form.elements[`limite-${mazo}-${nivel}`],fila=document.createElement('tr'),th=document.createElement('th'),td=document.createElement('td');th.scope='row';th.textContent=nivel[0].toUpperCase()+nivel.slice(1);td.append(input);fila.append(th,td);table.tBodies[0].append(fila);}
  const notaLimite=document.createElement('p');notaLimite.className='field-note';notaLimite.textContent=mazo==='nigromantes'?'No incluye al Profanador. Los topes no pueden disminuir de Azul a Rojo.':'Incluye la primera abominación. Los topes no pueden disminuir de Azul a Rojo.';
  limites.append(table,notaLimite);campoDestino.append(limites);
 }
 $('limits-config').remove();
 // Mover los nodos conserva nombres, valores y manejadores de los controles originales.
 const nav=document.createElement('div');nav.id='config-tabs';nav.className='config-tabs';nav.setAttribute('role','tablist');nav.setAttribute('aria-label','Secciones de configuración');
 const panels=document.createElement('div');panels.id='config-panels';panels.className='config-panels';
 for(const [id,titulo] of [['contenido','Contenido'],['mazos','Mazos'],['apariencia','Apariencia']]){
  const tab=document.createElement('button');tab.type='button';tab.id=`config-tab-${id}`;tab.dataset.pestana=id;tab.textContent=titulo;tab.setAttribute('role','tab');tab.setAttribute('aria-controls',`config-panel-${id}`);nav.append(tab);
  const panel=document.createElement('section');panel.id=`config-panel-${id}`;panel.setAttribute('role','tabpanel');panel.setAttribute('aria-labelledby',tab.id);panels.append(panel);
 }
 const coleccionResumen=coleccion.querySelector('summary');coleccionResumen.textContent='Colección';
 form.prepend(nav,panels);
 $('config-panel-contenido').append(coleccion,seccion('dificultad','Dificultad',[dificultad]),seccion('cartas','Cartas de la partida',[contenido]));
 const general=seccion('general','Mazo general y mazo especial',[$('especial-config'),reinicio]);
 $('config-panel-mazos').append(general,seccion('nigromantes','Nigromantes',[nigromantes]),seccion('abominaciones','Abominaciones',[abominaciones]),seccion('daily','Daily Spawn',[$('daily-config')]));
 $('config-panel-apariencia').append(seccion('apariciones','Apariciones adicionales',[campo('Apariciones adicionales')]),seccion('puntaje','Marcador de puntaje',[campo('Marcador de puntaje')]));
 notaDaily=$('daily-nota-probabilidad');
 const integrado=document.createElement('div');integrado.id='config-daily-integrado';integrado.innerHTML='<p class="field-note">Daily participa en el mazo especial. Sus cantidades y reposición se configuran allí; cada identidad sigue siendo única.</p><button type="button" class="text-button">Ir a Spawn Especial</button>';
 integrado.querySelector('button').addEventListener('click',()=>{mostrarPestanaConfiguracion('mazos');general.open=true;general.scrollIntoView({block:'start'});$('especial-config').querySelector('select').focus();});$('daily-config').append(integrado);
 const nueva=$('new-game'),advertencia=nueva.nextElementSibling;
 const gestion=document.createElement('details');gestion.id='config-nueva-partida';gestion.className='config-new-game';gestion.innerHTML='<summary>Iniciar nueva partida</summary>';gestion.append(advertencia,nueva);panels.append(gestion);
 const pie=document.createElement('div');pie.className='config-footer';pie.append($('settings-summary'),$('settings-errors'),$('save-settings'));form.append(pie);
 const nota=document.createElement('p');nota.className='config-save-note';nota.textContent='Contenido y reglas: próxima tanda. Apariencia: al guardar.';pie.prepend(nota);
 dificultad.querySelector('.field-note').textContent='Filtra las cartas elegidas. Guardar aplica los cambios a la próxima tanda.';
 // Ayuda secundaria plegable; los avisos de guardado y los errores permanecen visibles.
 for(const f of [reinicio,nigromantes,abominaciones,$('daily-config'),campo('Apariciones adicionales')]){
  const notas=[...f.querySelectorAll(':scope>.field-note')].filter(p=>p!==notaDaily&&p.id!=='nigromantes-status'&&p.id!=='abominaciones-status');
  if(notas.length){const ayuda=document.createElement('details');ayuda.className='config-help';ayuda.innerHTML='<summary>Cómo funciona</summary>';ayuda.append(...notas);f.append(ayuda);}
 }
 nav.addEventListener('click',e=>{const t=e.target.closest('[role="tab"]');if(t)mostrarPestanaConfiguracion(t.dataset.pestana);});
 nav.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();const tabs=[...nav.querySelectorAll('[role="tab"]')],i=tabs.indexOf(document.activeElement),n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(e.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;mostrarPestanaConfiguracion(tabs[n].dataset.pestana,{enfocar:true});});
 form.addEventListener('invalid',e=>{const p=e.target.closest('[role="tabpanel"]');if(p)mostrarPestanaConfiguracion(p.id.replace('config-panel-',''));abrirAncestros(e.target);},true);
 mostrarPestanaConfiguracion(pestanaActual);
}
export function actualizarConfiguracionUI(config){
 actualizarRevelacionUI(config);
 for(const nota of $('especial-config').querySelectorAll('p.field-note:not(#especial-composicion):not([data-especial-descripcion])')){if(nota.closest('.config-help')||nota.closest('#especial-cartas'))continue;const ayuda=document.createElement('details');ayuda.className='config-help';const summary=document.createElement('summary');summary.textContent=nota.textContent.startsWith('Daily integrado')?'Sobre Daily integrado':'Cómo funciona';ayuda.append(summary);nota.before(ayuda);ayuda.append(nota);}

 const o=opcionesEspecial(config),sumar=m=>Object.values(m).reduce((a,b)=>a+b,0);
 const texto=(id,s)=>secciones[id].resumen.textContent=s,identidades=n=>`${n} ${n===1?'identidad':'identidades'}`;
 const cajas=config.coleccionIds?.length??0;$('collection-selector').closest('details').querySelector('summary').textContent=`Colección · ${cajas} ${cajas===1?'caja':'cajas'}`;
 texto('dificultad',[config.easy?'Fácil':null,config.normal?'Estándar':null].filter(Boolean).join(' + ')||'Sin Fácil ni Estándar');
 texto('cartas',`${sumar(componer(config))} cartas en el mazo general · ${config.coleccionIds?.length??0} cajas seleccionadas`);
 const modos={directo:'Integración directa',disparadores:`${o.disparadores} cartas Spawn especial`,probabilidad:`Probabilidad por ${o.frecuencia==='carta'?'carta':'tanda'}`};
 texto('general',modos[o.modo]+(o.modo==='directo'?'':` · ${o.reposicion==='con-reposicion'?'Con':'Sin'} reposición`));
 const nombres={estandar:'Estándar',varios:'Varios',festival:'Festival',personalizado:'Personalizado'};
 for(const [mazo,campo] of [['nigromantes','reglaNigromantes'],['abominaciones','reglaAbominaciones']])texto(mazo,`${nombres[config[campo]]??'Personalizado'} · ${identidades(idsSecundarios(config,mazo).length)}`);
 const integrado=dailyIntegrado(config);texto('daily',!config.dailyHabilitado?'Desactivado':`${integrado?'Integrado en el mazo especial':'Independiente'} · ${identidades(idsSecundarios(config,'daily').length)}`);
 $('config-daily-integrado').hidden=!integrado;if(notaDaily)notaDaily.hidden=integrado||!config.dailyHabilitado;
 const descripciones={nigromante:{estandar:'Solo participa el Profanador: aparece si está fuera de juego y se activa si ya está presente.',varios:'Si falta el Profanador, aparece primero. Si ya está en juego, se activa y aparece otro nigromante disponible.',personalizado:'Permite elegir el funcionamiento de Spawn y el máximo de nigromantes adicionales por adrenalina. El Profanador tiene prioridad y no cuenta para ese máximo.'},abominacion:{estandar:'Usa la abominación elegida, sin trofeo: aparece si no hay ninguna en juego; si ya hay presencia, las abominaciones presentes se activan.',festival:'Si no hay abominaciones, aparece una. Si ya hay, se activan las presentes y aparece otra disponible.',personalizado:'Permite elegir el funcionamiento de Spawn y el máximo total de abominaciones por adrenalina.'}};
 for(const [tipo,mazo,campo,modo] of [['nigromante','nigromantes','reglaNigromantes','modoNigromantes'],['abominacion','abominaciones','reglaAbominaciones','modoAbominaciones']]){
  $(`descripcion-modo-${tipo}`).textContent=descripciones[tipo][config[campo]??'personalizado'];
  $(`descripcion-reposicion-${tipo}`).textContent=(config[modo]==='con-reposicion'?'Al derrotarlo/desfijarlo, vuelve al mazo.':'Al derrotarlo/desfijarlo, queda en descarte hasta reiniciar el mazo al agotarse.')+(tipo==='abominacion'?' Los trofeos permanecen fuera.':'');
 }
 $('daily-nota-incremento').textContent=config.dailyIncrementoPor==='carta'?'El porcentaje aumenta por cada carta elegible sin aparición Daily; se reinicia a la base del nivel al aparecer un Daily.':'El porcentaje aumenta una vez por tanda sin aparición Daily; se reinicia a la base del nivel al aparecer un Daily. Los intentos se realizan por cada carta elegible.';
 $('daily-nota-reposicion').textContent=config.modoDaily==='con-reposicion'?'Al derrotarlo/desfijarlo, el Daily vuelve al mazo. Mientras esté en juego, no puede repetirse.':'Al derrotarlo/desfijarlo, el Daily queda en descarte hasta agotar y reiniciar el mazo. Mientras esté en juego, no puede repetirse.';
 const general=componer(config),lista=CATALOG.filter(c=>Object.hasOwn(general,c.id)),host=$('daily-elegibles'),firma=JSON.stringify(lista.map(c=>c.id));
 if(host.dataset.firma!==firma){const elegibles=new Set(idsElegiblesDaily(config));host.innerHTML=lista.map(c=>`<label class="check-row"><input type="checkbox" data-daily-elegible="${c.id}" ${elegibles.has(c.id)?'checked':''}><span>${escapar(nombreVisible(c.name))}</span></label>`).join('');host.dataset.firma=firma;}
 for(const input of host.querySelectorAll('input'))input.disabled=!config.dailyHabilitado||integrado;
 texto('apariciones',config.modoAparicionAdicional==='cartas-custom'?'Cartas custom':'Minimalista');texto('puntaje',config.ocultarPuntaje?'Oculto':({kang:'Kang',dragon:'Dragón',cabeza:'Cabeza'}[config.temaPuntaje??'kang']));
}
export function leerElegiblesDailyUI(config){
 const controles=$('daily-elegibles')?.querySelectorAll('[data-daily-elegible]');
 if(!controles?.length)return config.dailyElegibles;
 const ids=new Set(idsElegiblesDaily(config));for(const e of controles){if(e.checked)ids.add(e.dataset.dailyElegible);else ids.delete(e.dataset.dailyElegible);}return [...ids];
}
