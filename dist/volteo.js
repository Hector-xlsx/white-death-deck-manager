export const DURACION_VOLTEO=700;
export const DURACION_DERIVADA=1000;
export const DURACION_ACTIVACION=1000;
export function duracionCarta({c,slot}){return c.mazo||slot.kind==='derivada'?DURACION_DERIVADA:DURACION_VOLTEO;}
export const INTERVALO_VOLTEO=240;

export function planificarVolteos(anteriores,actuales,ahora,pendientes=new Map()){
 const conocidos=new Set(anteriores),vigentes=new Set(actuales);
 const plan=new Map([...pendientes].filter(([uid,inicio])=>vigentes.has(uid)&&inicio+DURACION_VOLTEO>ahora));
 let inicio=Math.max(ahora,...[...plan.values()].map(t=>t+INTERVALO_VOLTEO));
 for(const uid of actuales){
  if(conocidos.has(uid)||plan.has(uid))continue;
  plan.set(uid,inicio);inicio+=INTERVALO_VOLTEO;
 }
 return plan;
}
