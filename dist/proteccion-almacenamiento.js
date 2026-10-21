// El permiso pertenece al navegador y al origen, no a la partida ni a una
// preferencia local. No guarda, migra ni elimina datos de juego.
export function iniciarProteccionAlmacenamiento(boton,estado,{navegador=navigator,documento=document,ventana=window}={}){
 const storage=navegador.storage;let enCurso=null,arranqueRealizado=false;
 const informar=(tipo,texto)=>{estado.dataset.estado=tipo;estado.textContent=texto;};
 if(typeof storage?.persist!=='function'){
  boton.disabled=true;informar('no-compatible','Este navegador no permite solicitar protección del almacenamiento. Conserva una exportación de la partida como respaldo.');
  return {listo:Promise.resolve()};
 }
 function pintar(concedida){
  informar(concedida?'concedida':'no-concedida',concedida?'Protección concedida por el navegador frente al borrado automático por falta de espacio. El borrado manual sigue siendo posible.':'Protección no concedida. Puedes volver a solicitarla aquí. El navegador puede decidir sin mostrar un aviso; este botón no obliga a mostrarlo de nuevo.');
 }
 function comprobar({pedir=false,manual=false}={}){
  if(enCurso)return enCurso;
  boton.disabled=true;informar('comprobando',manual||pedir?'Comprobando y solicitando protección del almacenamiento…':'Comprobando protección del almacenamiento…');
  const tarea=async()=>{
   try{
    // La llamada manual comienza en el propio gesto del botón.
    if(manual){const concedida=await storage.persist();pintar(concedida===true||typeof storage.persisted==='function'&&await storage.persisted()===true);return;}
    if(typeof storage.persisted==='function'&&await storage.persisted()===true){pintar(true);return;}
    if(pedir){const concedida=await storage.persist();pintar(concedida===true||typeof storage.persisted==='function'&&await storage.persisted()===true);}
    else pintar(false);
   }catch{informar('error','No se pudo comprobar o solicitar la protección. Puedes reintentar desde este botón; la partida no se ha modificado.');}
  };
  enCurso=tarea().finally(()=>{enCurso=null;boton.disabled=false;});return enCurso;
 }
 function alVolver(){
  if(documento.visibilityState!=='visible')return Promise.resolve();
  const pedir=!arranqueRealizado;arranqueRealizado=true;return comprobar({pedir});
 }
 boton.addEventListener('click',()=>comprobar({manual:true}));
 documento.addEventListener('visibilitychange',alVolver);ventana.addEventListener('pageshow',alVolver);
 return {listo:alVolver()};
}
