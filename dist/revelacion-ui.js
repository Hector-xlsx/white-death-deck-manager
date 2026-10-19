import {perfilDesdeCombinacion} from './acciones-independientes.js';
const $=id=>document.getElementById(id);
const familias={nigromantes:{tipo:'nigromante',titulo:'Revelación Carta Nigromante',acciones:{profanador:'Activación del Profanador',otros:'Activación adicional de otros nigromantes en juego',spawn:'Spawn adicional'}},abominaciones:{tipo:'abominacion',titulo:'Revelación Carta Abominación',acciones:{activacion:'Activación adicional de abominaciones en juego',spawn:'Spawn adicional'}}};
export function iniciarRevelacionUI(bloque,mazo){
 const f=familias[mazo],titulo=document.createElement('h3'),intro=document.createElement('p'),condiciones=document.createElement('details'),controles=document.createElement('div');
 bloque.id=`revelacion-${mazo}`;titulo.textContent=f.titulo;intro.className='field-note';intro.textContent=`Define qué ocurre al revelar una carta de ${mazo==='nigromantes'?'Nigromante':'Abominación'} del mazo general, en el modo Personalizado.`;
 condiciones.className='config-help';condiciones.innerHTML=`<summary>Se aplican estas condiciones:</summary><ul>${(mazo==='nigromantes'?['Si falta el Profanador, aparece primero, independientemente de las acciones configuradas.','El cálculo de los otros nigromantes puede ser independiente o conjunto; siempre excluye al Profanador.','Solo el Profanador crea una zona de aparición.']:['Si no hay abominaciones presentes, aparece la primera disponible.','La activación adicional se evalúa para las abominaciones que ya están en juego.']).concat(['Si se alcanza el tope o no hay candidatos, únicamente se bloquea el Spawn; las activaciones conservan su configuración.','Un Spawn bloqueado no aumenta la probabilidad. Un fallo del sorteo sí la incrementa, hasta el máximo configurado; una aparición la reinicia a la base.','Los cambios se aplican desde la próxima tanda y no repiten resultados ya resueltos.']).map(t=>`<li>${t}</li>`).join('')}</ul>`;
 controles.id=`acciones-independientes-${mazo}`;controles.className='acciones-independientes';
 controles.innerHTML=Object.entries(f.acciones).map(([id,nombre])=>`<fieldset data-revelacion-accion="${id}"><legend>${nombre}</legend><label>Ocurrencia<select name="revelacion-${mazo}-${id}-modo"><option value="siempre">Siempre</option><option value="probabilidad">Por probabilidad</option><option value="nunca">Nunca</option></select></label><div data-revelacion-probabilidad><label>${id==='spawn'?'Probabilidad base (%)':'Probabilidad (%)'}<input type="number" name="revelacion-${mazo}-${id}-probabilidad" min="0" max="100" step="any" required></label>${id==='otros'||mazo==='abominaciones'&&id==='activacion'?`<label>Calcular por<select name="revelacion-${mazo}-${id}-calcularPor"><option value="independiente">Independiente</option><option value="juntos">Todos juntos</option></select></label>`:''}${id==='spawn'?`<label>Aumento al fallar (puntos porcentuales)<input type="number" name="revelacion-${mazo}-spawn-incremento" min="0" max="100" step="any" required></label><label>Límite de probabilidad (%)<input type="number" name="revelacion-${mazo}-spawn-maximo" min="0" max="100" step="any" required></label>`:''}</div><p class="field-note" data-revelacion-explicacion></p></fieldset>`).join('')+'<p class="field-note">Las acciones tienen evaluaciones independientes. Puede ocurrir más de una, una sola o ninguna. Guarda la configuración para aplicarlas a la próxima tanda.</p>';
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
   grupo.querySelector('[data-revelacion-explicacion]').textContent=id==='spawn'?(modo==='siempre'?'Aparece un enemigo disponible siempre que lo permitan el tope y la disponibilidad.':modo==='nunca'?'No se intenta una aparición adicional.':'Cada fallo suma el aumento configurado sin superar el límite. Una aparición reinicia a la base; un bloqueo por tope o falta de candidatos pausa el porcentaje.'):id==='profanador'?(modo==='siempre'?'El Profanador siempre recibe una activación adicional.':modo==='nunca'?'El Profanador no recibe una activación adicional.':'Se realiza un sorteo para decidir si el Profanador recibe una activación adicional.'):(modo==='siempre'?'Cada enemigo presente de este grupo recibe una activación adicional.':modo==='nunca'?'Ningún enemigo de este grupo recibe una activación adicional.':grupo.querySelector('[name$="-calcularPor"]').value==='juntos'?'Se realiza un solo sorteo: se activa todo el grupo o ninguno.'+(mazo==='nigromantes'?' El Profanador mantiene su evaluación separada.':''):'Se realiza un sorteo independiente para cada enemigo presente de este grupo.');
  }
 }
}
