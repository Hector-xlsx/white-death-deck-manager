import {CATALOG,escapar as esc} from './catalogo.js';

// Texto suministrado por el usuario: consulta de reglas, sin automatizar efectos.
export const FICHAS_ZOMBIS={
 caminantes:{nombre:'Caminante',heridas:'1',eliminar:'Daño 1',adrenalina:'1 punto',reglas:[]},
 brutos:{nombre:'Bruto',heridas:'1',eliminar:'Daño 2',adrenalina:'1 punto',reglas:[]},
 corredores:{
  nombre:'Corredor',heridas:'1',eliminar:'Daño 1',adrenalina:'1 punto',
  reglas:['Los Corredores realizan dos acciones cada vez que se activan. Después de que todos los zombis (Corredores incluidos) hayan acabado el paso de activación (página 25) y resuelto su primera acción, los Corredores reciben una nueva activación, empleando su segunda acción en atacar a un Superviviente que esté en su Zona o en moverse si no hay nadie a quien atacar.']
 },
 'enemigo-nigromante-profanador':{
  nombre:'Nigromante profanador',heridas:'1',eliminar:'Daño 1',adrenalina:'1 punto',
  reglas:[
   'Un Nigromante es un zombi para todos los efectos de juego.',
   'Un Nigromante siempre lidera su propio ejército de infectados. Coloca una ficha de Aparición de profanador en la Zona donde ha aparecido el Nigromante. La Zona de aparición de profanador genera una aparición de zombis en último lugar durante el paso de aparición (página 28), incluida la ronda en la que se puso sobre el tablero.',
   'Los Nigromantes profanadores colocan una ficha de Corrupción en la Zona por donde han entrado, creando en ella una Zona de Corrupción.',
   'Cada vez que un Nigromante profanador vaya a moverse (incluyendo las activaciones adicionales), en vez de eso lo que se mueve es la ficha de Aparición por la que llegó. La ficha se mueve 1 Zona hacia la Almenara, siguiendo el recorrido más corto, pasando a través de murallas y escalando Almenas. Si hay varios caminos con la misma longitud, los jugadores eligen por cuál se mueve la ficha. Coloca una ficha de Corrupción en la Zona de destino (si ya contiene una ficha de Corrupción, no se colocan más).',
   'Siempre que la Corrupción alcance una Zona que contenga un Objetivo, esa ficha de Objetivo se descarta (lo cual podría suponer el final de la partida, según se indique en las instrucciones de la aventura). Si la Corrupción alcanza la Zona de la Almenara, los jugadores pierden la partida.',
   'Al igual que los zombis ordinarios, el Nigromante profanador atacará a cualquier Superviviente que esté en su misma Zona durante su activación en vez de moverse (ver Fase de los zombis en la página 25). En este caso se inflige 1 Herida a un solo Superviviente situado en la Zona del Nigromante profanador (si hay varios, los jugadores eligen quién la recibe). Este ataque zombi sustituye el movimiento del Nigromante, y por tanto su Zona de aparición no se mueve hacia la Almenara.',
   {texto:'Cada vez que un Nigromante profanador sea eliminado:',consecuencias:[
    'Se retira su ficha de Aparición de profanador (ATENCIÓN: la ficha de Aparición por la que ha entrado el Nigromante profanador se queda donde está).',
    'Se toma un arma de Cámara secreta al azar (si queda alguna disponible) y se coloca boca abajo en su Zona. Cualquier Superviviente que se encuentre en esta Zona puede gastar una acción para recoger el arma de Cámara secreta. Luego este Superviviente puede reorganizar su inventario sin coste alguno.'
   ]}
  ]
 },
 'enemigo-abominacion-kan':{
  nombre:'Abominación Kan',heridas:'1',eliminar:'Daño 3, Caldero o Fuego de dragón',adrenalina:'5 puntos',
  reglas:[
   'Las Heridas que inflige una Abominación no pueden anularse con tiradas de salvación por armadura (página 26).',
   'Sólo se puede matar a una Abominación utilizando un arma de Daño 3. En esta caja básica de White Death no hay ningún arma con estas características, pero se puede alcanzar con ciertas habilidades (como «+1 al Daño») o cuando así lo permita alguna regla especial de una misión. El Fuego de dragón (página 37) y los Calderos (página 24) también pueden eliminar a una Abominación.',
   'Una vez eliminado el monstruo, escoge al azar un arma de Cámara secreta (si hay alguna disponible) y colócala boca abajo en la Zona de la Abominación. Cualquier Superviviente que se encuentre en esta Zona puede gastar una acción para recoger esta carta; luego puede reorganizar su inventario sin coste alguno.',
   'Las Abominaciones ignoran las murallas y no necesitan Escaleras para subir o bajar de las Almenas (página 34).'
  ]
 },
 'caminantes-terrorcota':{
  nombre:'Caminante de terrorcota',heridas:'1',eliminar:'Daño 1',adrenalina:'1 punto',
  reglas:[
   'Los Caminantes de terrorcota ocupan el mismo puesto que los Caminantes en el orden de prioridad de blancos.',
   'Al comienzo de cada fase de los zombis, localiza todas las Zonas en las que haya de una a cuatro miniaturas de Caminantes de terrorcota. Luego coloca más Caminantes de terrorcota en todas esas Zonas hasta que haya cinco en cada una. Si no dispones de suficientes miniaturas, elige las Zonas que recibirán los Caminantes de terrorcota que queden. Luego todos los Caminantes de terrorcota reciben una activación adicional.'
  ],atencion:'Esta aparición especial no activa el efecto de la habilidad Reflejos de combate.'
 },
 trepadores:{
  nombre:'Trepadores',heridas:'1',eliminar:'Daño 1',adrenalina:'1 punto',
  reglas:[
   'Los Trepadores ocupan el mismo puesto que los Caminantes en el orden de prioridad de blancos.',
   'Los Trepadores pueden cruzar murallas (Wulfsburg), Barreras y Cornisas (Green Horde) cuando se mueven.',
   'Los Trepadores ignoran las murallas y no necesitan usar Escaleras para subir y bajar de Almenas (White Death).'
  ]
 },
 'caminantes-ballesteros':{
  nombre:'Caminantes ballesteros',heridas:'2 (sin tirada de salvación por armadura)',eliminar:'Daño 1',adrenalina:'1 punto',
  reglas:[
   'Los Caminantes ballesteros ocupan el mismo puesto que los Caminantes en el orden de prioridad de blancos.',
   {texto:'Los Caminantes ballesteros atacan cada vez que se activan si hay algún Superviviente a Alcance 0–3 y dentro de su línea de visión. Efectúan un ataque zombi contra la Zona designada. Si hay varias Zonas entre las que elegir, se decantarán por el blanco que satisfaga los siguientes criterios de prioridad:',prioridades:[
    'La Zona que contenga más Supervivientes.',
    'La Zona más ruidosa.',
    'Si todas las Zonas disponibles contienen la misma cantidad de Supervivientes y Ruido, la elección se deja en manos de los jugadores.'
   ]},
   {texto:'No se permiten tiradas de salvación por armadura contra los ataques de los Caminantes ballesteros.',destacada:true}
  ]
 }
};
export function fichaZombiHTML(tipo,carta={}){
 const basico=['caminantes','brutos','corredores'].includes(tipo);
 const esCartaGeneral=!carta.id||CATALOG.some(c=>c.id===carta.id&&c.tipo===tipo);
 const f=FICHAS_ZOMBIS[carta.id]??(!basico||esCartaGeneral?FICHAS_ZOMBIS[tipo]:undefined);
 if(f)return pintarFicha(f);
 if(carta.mazo==='abominaciones'||carta.mazo_destino==='abominaciones')return `<details class="reglas-estandar-abominacion"><summary>Ver reglas estándar de abominación White Death (Kan)</summary>${pintarFicha(FICHAS_ZOMBIS['enemigo-abominacion-kan'])}</details>`;
 return '';
}
function pintarFicha(f){
 return `<article class="ficha-zombi" aria-label="Reglas de ${esc(f.nombre)}"><h3>${esc(f.nombre)}</h3><p><strong>Heridas que causa:</strong> ${esc(f.heridas)}</p><p><strong>Para eliminarlo:</strong> ${esc(f.eliminar)}</p><p><strong>Adrenalina obtenida:</strong> ${esc(f.adrenalina)}</p>${f.reglas.length?`<p class="ficha-reglas-titulo"><strong>${f.reglas.length===1?'Regla especial:':'Reglas especiales:'}</strong></p><ul>${f.reglas.map(r=>{const regla=typeof r==='string'?{texto:r}:r;return `<li${regla.destacada?' class="ficha-regla-destacada"':''}>${esc(regla.texto)}${regla.prioridades?`<ol>${regla.prioridades.map(p=>`<li>${esc(p)}</li>`).join('')}</ol>`:''}${regla.consecuencias?`<ul>${regla.consecuencias.map(p=>`<li>${esc(p)}</li>`).join('')}</ul>`:''}</li>`;}).join('')}</ul>`:''}${f.atencion?`<p class="ficha-atencion"><strong>ATENCIÓN:</strong> ${esc(f.atencion)}</p>`:''}</article>`;
}
