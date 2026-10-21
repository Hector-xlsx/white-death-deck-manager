export function iniciarVistaMesa(){
 const board=document.querySelector('.board'),brand=document.querySelector('.brand'),consola=document.querySelector('.console'),herramientas=document.querySelector('.brand-window-tools');
 document.querySelector('.test-tag')?.remove();document.querySelector('.deck-status').hidden=true;
 const offline=document.getElementById('offline-status');offline.classList.add('visually-hidden');document.querySelector('.board>footer').replaceWith(offline);
 const aviso=document.getElementById('actualizacion-disponible');board.after(aviso);
 const marcador=document.getElementById('score-counter-host'),contenedor=document.querySelector('.brand-score-tools');brand.append(marcador,herramientas);contenedor.remove();
 const historial=document.querySelector('[data-action="history"]');historial.setAttribute('aria-label','Historial');historial.title='Historial';historial.querySelector('span').setAttribute('aria-hidden','true');herramientas.prepend(historial);document.querySelector('.console>.tools').remove();
 const zonas=document.createElement('div');zonas.className='mesa-zonas';consola.append(zonas);zonas.append(document.querySelector('.adrenalina-selector'),document.querySelector('.spawn-zones'));
 const fijados=document.querySelector('.pin-section'),ultima=document.querySelector('.last-section'),muralla=ultima.querySelector('.wall-separator'),cabeceraFijados=fijados.querySelector('.section-title'),cabeceraUltima=ultima.querySelector('.last-heading');
 ultima.before(fijados);cabeceraFijados.classList.add('mesa-section-heading');cabeceraFijados.insertBefore(muralla,document.getElementById('toggle-desfijados'));
 cabeceraUltima.classList.add('mesa-section-heading');const corrupcion=document.createElement('div');corrupcion.className='mesa-corruption-separator';corrupcion.setAttribute('aria-hidden','true');cabeceraUltima.insertBefore(corrupcion,document.getElementById('reopen'));
 const titulo=cabeceraUltima.querySelector('h2'),plegar=document.createElement('button'),preview=document.getElementById('last-preview');plegar.type='button';plegar.id='toggle-ultima-tanda';plegar.setAttribute('aria-controls','last-preview');plegar.setAttribute('aria-expanded','false');plegar.innerHTML='<span aria-hidden="true">›</span> Última tanda';titulo.replaceChildren(plegar);preview.hidden=true;
 plegar.addEventListener('click',()=>{const abrir=preview.hidden;preview.hidden=!abrir;plegar.setAttribute('aria-expanded',String(abrir));});
 const lupa=document.createElement('button');lupa.type='button';lupa.id='mesa-zoom-toggle';lupa.className='icon-button';lupa.title='Escala de pantalla principal';lupa.setAttribute('aria-label','Escala de pantalla principal');lupa.setAttribute('aria-expanded','false');lupa.setAttribute('aria-controls','mesa-zoom-controls');lupa.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10" cy="10" r="6"/><path d="m15 15 6 6"/></svg>';
 const controles=document.createElement('div');controles.id='mesa-zoom-controls';controles.className='mesa-zoom-controls';controles.hidden=true;controles.setAttribute('role','group');controles.setAttribute('aria-label','Escala de pantalla principal');controles.innerHTML='<button id="mesa-alejar" type="button" aria-label="Alejar pantalla principal un 5%">−</button><output id="mesa-escala" aria-live="polite">100%</output><button id="mesa-acercar" type="button" aria-label="Acercar pantalla principal un 5%">+</button>';
 herramientas.insertBefore(lupa,document.getElementById('pantalla-completa'));herramientas.append(controles);
 lupa.addEventListener('click',()=>{controles.hidden=!controles.hidden;lupa.setAttribute('aria-expanded',String(!controles.hidden));});
 document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!controles.hidden&&!document.querySelector('dialog[open]')){e.stopPropagation();controles.hidden=true;lupa.setAttribute('aria-expanded','false');lupa.focus();}});
 let escala=100;const menos=document.getElementById('mesa-alejar'),mas=document.getElementById('mesa-acercar');
 const pintar=()=>{board.style.setProperty('--escala-mesa',escala/100);document.getElementById('mesa-escala').textContent=escala+'%';menos.disabled=escala<=75;mas.disabled=escala>=125;};
 menos.addEventListener('click',()=>{escala=Math.max(75,escala-5);pintar();});mas.addEventListener('click',()=>{escala=Math.min(125,escala+5);pintar();});pintar();
}
