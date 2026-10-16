import {escapar as esc} from './catalogo.js';
export const MODOS_APARICION_ADICIONAL=['minimalista','cartas-custom'];
export const CARPETA_APARICIONES='recursos/06 - Cartas Apariciones adicionales/';
export const IMAGENES_APARICIONES={caminantes:'caminante.png',brutos:'bruto.png',corredores:'corredor.png',trepadores:'Trepador-2.png','caminantes-terrorcota':'Guerrero de terracota animado-1.png','caminantes-ballesteros':'Caminante ballestero-1.png'};
export const NOMBRES_APARICIONES={caminantes:'Caminantes',brutos:'Brutos',corredores:'Corredores',trepadores:'Trepadores','caminantes-terrorcota':'Caminantes de terracota','caminantes-ballesteros':'Caminantes ballesteros'};
export function aporteHTML(c,modo='minimalista',mini=false){
 const nombre=NOMBRES_APARICIONES[c.tipo]??c.tipo.replaceAll('-',' '),imagen=modo==='cartas-custom'&&IMAGENES_APARICIONES[c.tipo];
 const destino=`Zona de ${c.destino}`;
 return `<article class="${mini?'last-mini':'draw-card'} extra-zombies" data-extraccion="${esc(c.uid)}"><span class="spawn-zone-space" aria-hidden="true"></span><div class="${mini?'mini-media':'card-media'}"><div class="extra-zombies-body ${imagen?'extra-custom':'extra-minimal'}" role="img" aria-label="${esc(nombre)}: +${c.cantidad}. ${esc(destino)}">${imagen?`<img class="extra-custom-image" src="./${esc(CARPETA_APARICIONES+imagen)}" alt="${esc(nombre)}" loading="lazy">`:''}<div class="extra-text"><strong class="extra-quantity">+${c.cantidad}</strong>${imagen?'':`<span class="extra-type">${esc(nombre)}</span>`}<small class="extra-destination">${esc(destino)}</small></div></div></div><p class="card-label">Aparición adicional</p></article>`;
}
