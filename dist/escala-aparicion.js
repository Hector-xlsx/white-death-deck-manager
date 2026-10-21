export function iniciarEscalaAparicion(){
 let escala=100;
 const menos=document.getElementById('aparicion-alejar'),mas=document.getElementById('aparicion-acercar'),valor=document.getElementById('aparicion-escala'),grid=document.getElementById('batch-grid');
 const pintar=()=>{grid.style.setProperty('--escala-aparicion',escala/100);valor.textContent=escala+'%';menos.disabled=escala<=75;mas.disabled=escala>=125;};
 menos.addEventListener('click',()=>{escala=Math.max(75,escala-5);pintar();});
 mas.addEventListener('click',()=>{escala=Math.min(125,escala+5);pintar();});pintar();
}
