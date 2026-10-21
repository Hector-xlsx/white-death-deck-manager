import {perfilDesdeCombinacion} from './acciones-independientes.js';
const $=id=>document.getElementById(id);
const familias={nigromantes:{tipo:'nigromante',titulo:'Revelación Carta Nigromante',acciones:{profanador:'Activación del Profanador',otros:'Activación adicional de otros nigromantes en juego',spawn:'Spawn adicional'}},abominaciones:{tipo:'abominacion',titulo:'Revelación Carta Abominación',acciones:{activacion:'Activación adicional de abominaciones en juego',spawn:'Spawn adicional'}}};
export function iniciarRevelacionUI(bloque,mazo){
 const f=familias[mazo],titulo=document.createElement('h3'),intro=document.createElement('p'),condiciones=document.createElement('details'),controles=document.createElement('div');
 bloque.id=`revelacion-${mazo}`;titulo.textContent=f.titulo;intro.className='field-note';intro.textContent=`Define qué ocurre al revelar una carta de ${mazo==='nigromantes'?'Nigromante':'Abominación'} del mazo general, en el modo Personalizado.`;
 condiciones.className='config-help';condiciones.innerHTML=`<summary>Se aplican estas condiciones:</summary><ul>${(mazo==='nigromantes'?['Si falta el Profanador, aparece primero, independientemente de las acciones configuradas.','El cálculo de los otros nigromantes puede ser independiente o conjunto; siempre excluye al Profanador.','Solo el Profanador crea una zona de aparición.']:['Si no hay abominaciones presentes, aparece la primera disponible.','La activación adicional se evalúa para las abominaciones que ya están en juego.']).concat(['Si se alcanza el máximo de enemigos en juego o no quedan cartas disponibles, únicamente se bloquea el Spawn; las activaciones conservan su configuración.','Un Spawn bloqueado conserva la probabilidad actual. Si el sorteo falla, la probabilidad aumenta hasta el máximo configurado; si aparece un enemigo, vuelve a la probabilidad base.','Los cambios se aplican desde la próxima tanda y no repiten resultados ya resueltos.']).map(t=>`<li>${t}</li>`).join('')}</ul>`;
 controles.id=`acciones-independientes-${mazo}`;controles.className='acciones-independientes';
 controles.innerHTML=Object.entries(f.acciones).map(([id,nombre])=>`<fieldset data-revelacion-accion="${id}"><legend>${nombre}</legend><label>Cuándo se aplica<select name="revelacion-${mazo}-${id}-modo"><option value="siempre">Siempre</option><option value="probabilidad">Por probabilidad</option><option value="nunca">Nunca</option></select></label><div data-revelacion-probabilidad><label>${id==='spawn'?'Probabilidad base (%)':'Probabilidad (%)'}<input type="number" name="revelacion-${mazo}-${id}-probabilidad" min="0" max="100" step="any" required></label>${id==='otros'||mazo==='abominaciones'&&id==='activacion'?`<label>Calcular por<select name="revelacion-${mazo}-${id}-calcularPor"><option value="independiente">Independiente</option><option value="juntos">Todos juntos</option></select></label>`:''}${id==='spawn'?`<label>Aumento al fallar (puntos porcentuales)<input type="number" name="revelacion-${mazo}-spawn-incremento" min="0" max="100" step="any" required></label><label>Probabilidad máxima de aparición (%)<input type="number" name="revelacion-${mazo}-spawn-maximo" min="0" max="100" step="any" required></label>`:''}</div><p class="field-note" data-revelacion-explicacion></p></fieldset>`).join('')+`<p class="field-note">${mazo==='nigromantes'?'La activación del Profanador, la activación de los otros nigromantes y la aparición adicional':'La activación de las abominaciones y la aparición adicional'} se resuelven por separado. Pueden ocurrir varias acciones, una sola o ninguna. Guarda la configuración para aplicarla a la próxima tanda.</p>`;
 // La probabilidad inmediata comparte fila con el modo; los otros parámetros
 // conservan sus etiquetas para distinguir aumento, máximo y cálculo por grupo.
 for(const grupo of controles.querySelectorAll('[data-revelacion-accion]')){
  const fila=document.createElement('div');fila.className='config-accion-fila';
  const modo=grupo.querySelector(':scope>label'),probabilidades=grupo.querySelector('[data-revelacion-probabilidad]'),probabilidad=probabilidades.firstElementChild;
  const entrada=probabilidad.querySelector('input');entrada.setAttribute('aria-label',probabilidad.firstChild.textContent);
  probabilidad.firstChild.textContent='';
  const unidad=document.createElement('span');unidad.textContent='%';unidad.setAttribute('aria-hidden','true');probabilidad.append(unidad);probabilidad.className='config-porcentaje';
  grupo.insertBefore(fila,modo);fila.append(modo,probabilidades);probabilidades.prepend(probabilidad);
 }
 bloque.append(titulo,intro,condiciones,controles);
}
function llenar(mazo,perfil){
 for(const [accion,opcion] of Object.entries(perfil)){
  const calculo=document.querySelector(`[name="revelacion-${mazo}-${accion}-calcularPor"]`);if(calculo)calculo.value=opcion.calcularPor??'independiente';
  for(const [campo,valor] of Object.entries(opcion))document.querySelector(`[name="revelacion-${mazo}-${accion}-${campo}"]`).value=valor;
 }
}
export function cargarRevelacionUI(config,acciones={}){
 for(const [mazo,f] of Object.entries(familias)){
  const modo=config[mazo==='nigromantes'?'reglaNigromantes':'reglaAbominaciones'];
  llenar(mazo,config.revelacionEnemigos?.[mazo]??perfilDesdeCombinacion(mazo,modo&&modo!=='personalizado'?modo:acciones[f.tipo]??'azar'));
 }
}
export function leerRevelacionUI(){
 const resultado={};
 for(const [mazo,f] of Object.entries(familias)){
  resultado[mazo]=Object.fromEntries(Object.keys(f.acciones).map(accion=>[accion,Object.fromEntries((accion==='spawn'?['modo','probabilidad','incremento','maximo']:accion==='otros'||mazo==='abominaciones'&&accion==='activacion'?['modo','probabilidad','calcularPor']:['modo','probabilidad']).map(campo=>{const e=document.querySelector(`[name="revelacion-${mazo}-${accion}-${campo}"]`);return [campo,['modo','calcularPor'].includes(campo)?e.value:e.value===''?NaN:Number(e.value)];}))]));
 }
 return Object.keys(resultado).length?resultado:undefined;
}
export function actualizarRevelacionUI(config){
 for(const [mazo,f] of Object.entries(familias)){
  const personalizado=config[mazo==='nigromantes'?'reglaNigromantes':'reglaAbominaciones']==='personalizado';
  $(`revelacion-${mazo}`).hidden=!personalizado;
  for(const grupo of $(`acciones-independientes-${mazo}`).querySelectorAll('[data-revelacion-accion]')){
   const id=grupo.dataset.revelacionAccion,modo=grupo.querySelector('select').value,probable=modo==='probabilidad';
   grupo.querySelector('[data-revelacion-probabilidad]').hidden=!probable;
   for(const e of grupo.querySelectorAll('input,select'))e.disabled=!personalizado||(e.tagName==='INPUT'||e.name.endsWith('-calcularPor'))&&!probable;
   grupo.querySelector('[data-revelacion-explicacion]').textContent=id==='spawn'?(modo==='siempre'?'Aparece un enemigo si quedan cartas disponibles y no se ha alcanzado el máximo de enemigos en juego.':modo==='nunca'?'No se intenta una aparición adicional.':'Si el sorteo falla, aumenta la probabilidad sin superar el máximo configurado. Por ejemplo, 20% más 5 puntos da 25%. Si aparece un enemigo, vuelve a la base; si se bloquea por el límite de enemigos en juego o por falta de cartas disponibles, conserva el porcentaje actual.'):id==='profanador'?(modo==='siempre'?'El Profanador siempre recibe una activación adicional.':modo==='nunca'?'El Profanador no recibe una activación adicional.':'Se realiza un sorteo para decidir si el Profanador recibe una activación adicional.'):(modo==='siempre'?'Cada enemigo presente de este grupo recibe una activación adicional.':modo==='nunca'?'Ningún enemigo de este grupo recibe una activación adicional.':grupo.querySelector('[name$="-calcularPor"]').value==='juntos'?'Se realiza un solo sorteo: se activa todo el grupo o ninguno.'+(mazo==='nigromantes'?' El Profanador mantiene su evaluación separada.':''):'Se realiza un sorteo independiente para cada enemigo presente de este grupo.');
  }
 }
}
