import {CATALOG,datos,escapar as esc,componer,nombreVisible,dificultadVisible,cajaCarta} from './catalogo.js';
import {opcionesEspecial,cantidadEspecial,dailyIntegrado,configEspecialValida,NIVELES_ESPECIAL,esCartaConfigurable,esBasicaEspecial,destinoCartaEspecial} from './especial-config.js';
import {cartasEspecial,idsElegiblesEspecial} from './especial.js';

const niveles={azul:'Azul',amarillo:'Amarillo',naranja:'Naranja',rojo:'Rojo'};
const numero=(nombre,valor,min=0,max=100)=>`<input name="${nombre}" type="number" min="${min}" max="${max}" step="1" value="${valor}" required>`;
const seleccionado=(actual,valor)=>actual===valor?'selected':'';
export function iniciarEspecialUI(config){
 const o=opcionesEspecial(config),host=document.getElementById('especial-config');
 host.innerHTML=`<legend>Mazo general y mazo especial</legend>
 <label>Modalidad<select name="especial-modo"><option value="directo">Expansiones en el mazo general</option><option value="disparadores">Cartas Spawn especial</option><option value="probabilidad">Spawn adicional por probabilidad</option></select></label>
 <p class="field-note" data-especial-descripcion></p>
 <div data-especial-activo><div class="enemy-mode-row"><label data-especial-disparadores>Cartas Spawn especial en el mazo general${numero('especial-disparadores',o.disparadores,1,Number.MAX_SAFE_INTEGER)}</label><label>Reposición del mazo especial<select name="especial-reposicion"><option value="sin-reposicion">Sin reposición · reiniciar al agotar</option><option value="con-reposicion">Con reposición</option></select></label><label>Daily Spawn<select name="especial-daily"><option value="independiente">Mazo independiente</option><option value="integrado">Integrado al mazo especial</option></select></label></div>
 <p class="field-note">Daily integrado: activa Daily Spawn en su sección de Mazos y selecciona sus cartas en Contenido. Cada zombi Daily puede estar una sola vez en juego.</p>
 <label class="check-row"><input name="especial-compensar" type="checkbox" ${o.compensar?'checked':''}><span>Mantener la proporción de cartas de Nigromante, Abominación y Asedio</span></label><p class="field-note">Aumenta las copias de estas tres cartas en el mazo general para conservar, lo más posible, su proporción en el juego base con la dificultad seleccionada. Siempre utiliza cantidades enteras.</p><p id="especial-composicion" class="field-note"></p>
 <details open><summary>Destino y copias de las cartas</summary><p class="field-note">Copias indica el total de esa carta en el mazo elegido, no copias adicionales. Puedes elegir el destino del set y ajustar después cada carta. Caminantes, Brutos, Corredores y sus activaciones parten en el mazo general con sus copias originales.</p><div id="especial-cartas"></div></details>
 <div data-especial-probabilidad><div class="enemy-mode-row"><label>Cuándo intentar una aparición y aumentar la probabilidad si falla<select name="especial-frecuencia"><option value="carta">Por carta elegible</option><option value="tanda">Una vez por tanda</option></select></label><label>Límite de apariciones por tanda<select name="especial-limite-tipo"><option value="general">Mismo límite para todos los niveles</option><option value="nivel">Un límite por nivel de adrenalina</option></select></label></div>
 <div class="enemy-mode-row" data-especial-limite-general><label>Máximo por tanda (vacío: sin límite)<input name="especial-limite" type="number" min="1" step="1" value="${o.limite??''}"></label></div>
 <table class="especial-perfiles"><thead><tr><th>Nivel</th><th>Probabilidad base (%)</th><th>Aumento al fallar<br><small>Puntos porcentuales</small></th><th data-especial-limite-nivel>Máximo por tanda<br><small>Vacío: sin límite</small></th></tr></thead><tbody>${NIVELES_ESPECIAL.map(n=>`<tr><th>${niveles[n]}</th><td>${numero('especial-base-'+n,o.porNivel?.[n]?.base??o.base)}</td><td>${numero('especial-incremento-'+n,o.porNivel?.[n]?.incremento??o.incremento)}</td><td data-especial-limite-nivel><input type="number" min="1" step="1" name="especial-limite-${n}" value="${o.limitesPorNivel?.[n]??''}"></td></tr>`).join('')}</tbody></table>
 <details><summary>Cartas del mazo general que permiten intentar una aparición del mazo especial</summary><div id="especial-elegibles"></div></details>
 <p class="field-note">Una tanda corresponde a una pulsación de SPAWN. Cada intento fallido aumenta la probabilidad; una aparición la reinicia a la base. El aumento se mide en puntos porcentuales: 20% más 5 puntos da 25%. Al alcanzar el límite se suspenden intentos e incrementos. Por tanda, se resuelve al final y se asigna al azar a una zona elegible; sin zonas elegibles cuenta como fallo. Una aparición del mazo Daily o del mazo especial no provoca intentos adicionales en el otro mazo.</p></div></div>`;
 for(const [n,v] of [['modo',o.modo],['reposicion',o.reposicion],['daily',o.daily],['frecuencia',o.frecuencia],['limite-tipo',o.limitesPorNivel?'nivel':'general']])host.querySelector(`[name="especial-${n}"]`).value=v;
 host.onchange=e=>{const ids=e.target.dataset.especialSet?.split(',');if(ids&&e.target.value!=='mixto')for(const id of ids)host.querySelector(`[data-especial-destino="${id}"]`).value=e.target.value;};
 host.dataset.firma='';actualizarEspecialUI(config);
}
export function leerEspecialUI(config){
 const host=document.getElementById('especial-config');if(!host?.querySelector('select'))return config.spawnEspecial;
 const valor=n=>host.querySelector(`[name="especial-${n}"]`).value,o={...opcionesEspecial(config),...JSON.parse(host.dataset.borrador??'{}')},modo=valor('modo');
 if(modo==='directo'&&config.spawnEspecial===undefined)return undefined;
 const cantidades={...o.cantidades},destinos={...o.destinos};
 for(const e of host.querySelectorAll('[data-especial-cantidad]'))cantidades[e.dataset.especialCantidad]=Number(e.value===''?NaN:e.value);
 for(const e of host.querySelectorAll('[data-especial-destino]'))destinos[e.dataset.especialDestino]=e.value;
 let elegibles=o.elegibles;
 if(host.querySelector('[data-especial-elegible]'))elegibles=[...host.querySelectorAll('[data-especial-elegible]:checked')].map(e=>e.dataset.especialElegible);
 const previos=JSON.parse(host.dataset.destinos??'{}');
 if(elegibles)for(const [id,d] of Object.entries(destinos))if(d==='general'&&previos[id]!=='general'&&!elegibles.includes(id))elegibles.push(id);
 const porNivel=Object.fromEntries(NIVELES_ESPECIAL.map(n=>[n,{base:Number(valor('base-'+n)===''?NaN:valor('base-'+n)),incremento:Number(valor('incremento-'+n)===''?NaN:valor('incremento-'+n))}]));
 const limite=n=>valor(n)===''?null:Number(valor(n));
 const resultado={...o,modo,...(modo==='disparadores'?{destinosEnDisparadores:true}:{}),disparadores:Number(valor('disparadores')),reposicion:valor('reposicion'),daily:valor('daily'),frecuencia:valor('frecuencia'),compensar:host.querySelector('[name="especial-compensar"]').checked,cantidades,destinos,porNivel,limite:limite('limite'),...(elegibles?{elegibles}:{})};
 if(valor('limite-tipo')==='nivel')resultado.limitesPorNivel=Object.fromEntries(NIVELES_ESPECIAL.map(n=>[n,limite('limite-'+n)]));else delete resultado.limitesPorNivel;
 return resultado;
}
export function actualizarEspecialUI(config){
 const host=document.getElementById('especial-config'),o=opcionesEspecial(config),activo=o.modo!=='directo';
 host.querySelector('[data-especial-descripcion]').textContent=({directo:'Las cartas de expansión se incluyen directamente en el mazo general.',disparadores:'Las cartas Spawn especial funcionan como las cartas de Abominación o Nigromante: al salir una del mazo general, se roba una carta del mazo especial y se muestra el resultado en esa zona. Cada set o carta puede ir al mazo general o al especial.',probabilidad:'El mazo especial permanece separado del mazo general. Su aparición adicional se decide mediante la probabilidad configurada.'})[o.modo];
 host.querySelector('[data-especial-activo]').hidden=!activo;
 host.querySelector('[data-especial-disparadores]').hidden=o.modo!=='disparadores';
 host.querySelector('[data-especial-probabilidad]').hidden=o.modo!=='probabilidad';
 host.querySelector('[data-especial-limite-general]').hidden=Boolean(o.limitesPorNivel);
 for(const e of host.querySelectorAll('[data-especial-limite-nivel]'))e.hidden=!o.limitesPorNivel;
 const base={...config,spawnEspecial:undefined},generalBase=componer(base),expansiones=CATALOG.filter(c=>Object.hasOwn(generalBase,c.id)&&esCartaConfigurable(c));
 const daily=dailyIntegrado(config)?datos.daily.cartas.filter(c=>(config.selectedDailyIds??datos.daily.cartas_ids).includes(c.id)&&(config.coleccionIds===undefined||config.coleccionIds.includes(datos.coleccion.cartas.find(a=>a.id===c.id)?.cajaId))).map(c=>({id:c.id,name:c.nombre,copies:1,daily:true})):[];
 const general=componer(config),firma=JSON.stringify([expansiones.map(c=>c.id),daily.map(c=>c.id),o.modo,expansiones.map(c=>destinoCartaEspecial(config,c)),Object.keys(general)]);
 if(host.dataset.firma!==firma){
  const abiertos=new Set([...host.querySelectorAll('[data-especial-grupo][open]')].map(e=>e.dataset.especialGrupo));
  const fila=c=>`<div class="especial-carta"><span>${esc(esBasicaEspecial(c)&&!c.id.startsWith('activacion-')?({caminantes:'Caminantes',brutos:'Brutos',corredores:'Corredores'}[c.tipo]):nombreVisible(c.name))}${c.daily?' · Daily · no se repite en juego':`<small class="field-note"> · ${esBasicaEspecial(c)?esc(dificultadVisible(c.difficulty)??'Activación adicional'):`Carta ${esc(c.id.replace('spawn-',''))} · ${esc(dificultadVisible(c.difficulty)??'')}`}</small>`}<button type="button" class="text-button" data-action="consulta-recurso" data-id="${esc(c.id)}" aria-label="Consultar ${esc(c.name)}">ⓘ</button></span><label>Copias<input type="number" min="1" step="1" required data-especial-cantidad="${esc(c.id)}" aria-label="Copias ${esc(c.name)}" value="${cantidadEspecial(config,c)}"></label>${activo&&!c.daily?`<label>Mazo de esta carta<select data-especial-destino="${c.id}" aria-label="Mazo de ${esc(c.name)}"><option value="especial" ${seleccionado(destinoCartaEspecial(config,c),'especial')}>Mazo especial</option><option value="general" ${seleccionado(destinoCartaEspecial(config,c),'general')}>Mazo general</option></select></label>`:''}</div>`;
  const grupos=new Map();for(const c of expansiones){const clave=c.expansionId+'-'+(c.id.startsWith('activacion-')?'activacion-':'')+c.tipo;if(!grupos.has(clave))grupos.set(clave,[]);grupos.get(clave).push(c);}
  const conjuntos=[...grupos.entries()].map(([clave,cartas])=>{const caja=datos.coleccion.cajas.find(a=>a.id===cajaCarta(cartas[0].id)),destinos=new Set(cartas.map(c=>destinoCartaEspecial(config,c))),destino=destinos.size===1?[...destinos][0]:'mixto';return `<details class="especial-set" data-especial-grupo="${clave}" ${abiertos.has(clave)?'open':''}><summary>${esc(nombreVisible(cartas[0].name).replace(/\s+(fácil|estándar)$/i,''))} · ${esc(caja?.nombre??cartas[0].expansionId)}</summary>${activo?`<label>Mazo de este grupo de cartas<select data-especial-set="${cartas.map(c=>c.id).join(',')}" aria-label="Mazo de este grupo de cartas ${esc(cartas[0].name)}"><option value="especial" ${seleccionado(destino,'especial')}>Mazo especial</option><option value="general" ${seleccionado(destino,'general')}>Mazo general</option><option value="mixto" disabled ${seleccionado(destino,'mixto')}>Personalizado por carta</option></select></label>`:''}${cartas.map(fila).join('')}</details>`;});
  host.querySelector('#especial-cartas').innerHTML=[...conjuntos,...daily.map(c=>`<details class="especial-set" data-especial-grupo="${c.id}" ${abiertos.has(c.id)?'open':''}><summary>${esc(c.name)} · Daily · no se repite en juego</summary>${fila(c)}</details>`)].join('')||'<p class="field-note">Selecciona cartas de expansión en Contenido, o habilita Daily integrado.</p>';
  const elegibles=new Set(idsElegiblesEspecial(config));
  host.querySelector('#especial-elegibles').innerHTML=CATALOG.filter(c=>Object.hasOwn(general,c.id)).map(c=>`<label class="check-row"><input type="checkbox" data-especial-elegible="${c.id}" ${elegibles.has(c.id)?'checked':''}><span>${esc(nombreVisible(c.name))}</span></label>`).join('');
  host.dataset.firma=firma;
 }
 host.dataset.destinos=JSON.stringify(Object.fromEntries(expansiones.map(c=>[c.id,destinoCartaEspecial(config,c)])));host.dataset.borrador=JSON.stringify(o);
 const total=m=>Object.values(m).reduce((a,b)=>a+b,0),core=Object.fromEntries(Object.entries(generalBase).filter(([id])=>CATALOG.some(c=>c.id===id&&c.expansionId==='core-white-death'))),motor=m=>['nigromante','abominacion','asedio'].reduce((a,id)=>a+(m[id]??0),0),porcentaje=m=>total(m)?(100*motor(m)/total(m)).toFixed(2):'0.00';
 host.querySelector('#especial-composicion').textContent=configEspecialValida(config,CATALOG,datos.daily.cartas_ids)?`Mazo general: ${total(general)} cartas · Nigromante, Abominación y Asedio: ${porcentaje(core)}% en el juego base seleccionado → ${porcentaje(general)}% en el mazo general · Mazo especial: ${cartasEspecial(config).reduce((n,c)=>n+cantidadEspecial(config,c),0)+daily.reduce((n,c)=>n+cantidadEspecial(config,c),0)} copias configuradas.`:'Revisa las cantidades, probabilidades y límites.';
 for(const e of host.querySelectorAll('input,select'))if(e.name!=='especial-modo'){const oculto=e.closest('[hidden]');e.disabled=!activo||Boolean(oculto&&host.contains(oculto));}
}
