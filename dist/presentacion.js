export function estadoVisualSpawn(c){
 if(c.discarded||c.anulada||c.mazo)return 'ninguno';
 const resolucion=c.resolucionAbominacion||c.resolucionNigromante;
 if(resolucion==='activacion')return 'activacion';
 if(resolucion==='spawn'&&[...(c.abominaciones||[]),...(c.nigromantes||[])].some(n=>!n.anulada&&!n.discarded))return 'spawn';
 return resolucion==='pendiente'?'pendiente':'ninguno';
}
export function tieneActivacionAdicional(c){
 if(c.referenciaActivacion)return !c.discarded;
 if(c.activaciones!==undefined)return c.activaciones.length>0&&!c.discarded&&!c.anulada;
 const visual=estadoVisualSpawn(c);
 return visual==='activacion'||visual==='spawn'&&c.accionEnemigo==='activacion-spawn';
}
export function referenciasActivacion(c){
 if(c.discarded||c.anulada)return [];
 return (c.activaciones||[]).map(a=>({...a,uid:`a-${c.uid}-${a.uid}`,referenciaUid:a.uid,origenUid:c.uid,referenciaActivacion:true,discarded:false}));
}
export function agruparRevelaciones(items){
 const grupos=[];
 for(let i=0;i<items.length;i++){
  const origen=items[i],siguiente=items[i+1];
  if(origen.c.transformacionDesde&&siguiente?.c.transformacionHasta){grupos.push([origen,siguiente]);i++;}
  else if(estadoVisualSpawn(origen.c)==='spawn'&&siguiente?.c.origenUid===origen.c.uid&&!siguiente.c.anulada){
   grupos.push([origen,siguiente]);i++;
  }else grupos.push([origen]);
 }
 return grupos;
}
// Etiquetas derivadas desde parentescos estables; los sufijos guardados siguen intactos.
export function etiquetasZonas(tanda){
 const padres=new Map(tanda.slots.flatMap(slot=>slot.draws.flatMap(c=>(c.nigromantes||[]).map(n=>[n.uid,slot]))));
 return new Map(tanda.slots.map(slot=>{
  let raiz=slot,profundidad=0;const visitadas=new Set();
  while(raiz.kind==='derivada'&&padres.has(raiz.origenUid)&&!visitadas.has(raiz)){
   visitadas.add(raiz);raiz=padres.get(raiz.origenUid);profundidad++;
  }
  const nombre=profundidad?`${raiz.zone}${raiz.kind==='necro'?' · nueva zona':' nigromante'}${profundidad>1?` ${profundidad}`:''}`:slot.zone;
  return [slot.id,nombre];
 }));
}
export function agruparZonas(items){
 const grupos=[];
 for(const item of items){
  const anterior=grupos.at(-1);
  if(anterior&&(anterior.slot===item.slot||anterior.slot.id&&anterior.slot.id===item.slot.id))anterior.items.push(item);
  else grupos.push({slot:item.slot,nombre:item.zone,items:[item]});
 }
 return grupos;
}
export function conexionesDerivacion(items){
 const enlaces=[];
 for(const {c} of items){
  if(c.mazo!=='nigromantes'||c.anulada||c.discarded||!c.spawnSlotId)continue;
  const destino=items.find(i=>!i.c.mazo&&!i.c.discarded&&!i.c.anulada&&i.slot.id===c.spawnSlotId&&i.slot.origenUid===c.uid);
  if(destino)enlaces.push({origenUid:c.uid,destinoUid:destino.c.uid});
 }
 return enlaces;
}
export function rutaDerivacion(origen,destino,ancho,grupoOrigen=origen,grupoDestino=destino){
 const ay=(origen.top+origen.bottom)/2,by=(destino.top+destino.bottom)/2;
 if(Math.abs(grupoOrigen.top-grupoDestino.top)<2&&destino.left>origen.right+16){
  const ax=origen.right+4,bx=destino.left-6,medio=(ax+bx)/2;
  return `M ${ax} ${ay} C ${medio} ${ay} ${medio} ${by} ${bx} ${by}`;
 }
 const rail=Math.min(ancho-6,Math.max(grupoOrigen.right,origen.right)+8),entrada=destino.right+14,paso=grupoDestino.top-8;
 return `M ${origen.right+4} ${ay} L ${rail} ${ay} L ${rail} ${paso} L ${entrada} ${paso} L ${entrada} ${by} L ${destino.right+6} ${by}`;
}
