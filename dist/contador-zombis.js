import {aportesTanda} from './reglas-cartas.js';
import {NIVELES_ADRENALINA} from './adrenalina.js';

export const TIPOS_AJUSTE=['caminantes','brutos','corredores'];
export const NOMBRES_AJUSTE={caminantes:'Caminantes',brutos:'Brutos',corredores:'Corredores'};

// Se reconstruye desde extracciones vigentes, nunca desde las cartas fijadas.
export function desgloseGenerados(s){
 let automaticos=0,variables=0;
 const porTipo={};
 const sumar=(tipo,cantidad)=>{automaticos+=cantidad;porTipo[tipo]=(porTipo[tipo]??0)+cantidad;};
 const vistos=new Set();
 for(const tanda of s.history){
  for(const aporte of aportesTanda(tanda))sumar(aporte.tipo,aporte.cantidad);
  const nivel=NIVELES_ADRENALINA.indexOf(tanda.nivelAdrenalina);
  for(const zona of tanda.slots){
   if(zona.anulada)continue;
   for(const c of zona.draws){
    if(c.discarded||c.anulada)continue;
    const ficha=s.catalogo.cartas.find(f=>f.id===c.cardId);
    if(c.cardId!=='spawn-especial'&&!c.cardId.startsWith('activacion-')&&!['abominacion','nigromante'].includes(ficha?.tipo)){
     const cantidad=ficha?.levels?.[nivel];
     if(Number.isSafeInteger(cantidad)&&cantidad>=0)sumar(ficha.tipo,cantidad);
     else if(cantidad!=='Sin efecto'&&cantidad!=='Activación adicional')variables++;
    }
    for(const a of c.especial||[])if(!a.discarded&&!a.anulada){
     const f=s.catalogo.cartas.find(f=>f.id===a.cardId),q=f?.levels?.[nivel];
     if(Number.isSafeInteger(q))sumar(f.tipo,q);else if(q!=='Sin efecto'&&q!=='Activación adicional')variables++;
    }
    for(const secundaria of [...(c.abominaciones||[]),...(c.nigromantes||[]),...(c.daily||[])]){
     if(secundaria.anulada||secundaria.discarded||vistos.has(secundaria.uid))continue;
     vistos.add(secundaria.uid);sumar(secundaria.mazo,1);
    }
   }
  }
 }
 return {automaticos,variables,porTipo};
}
export function resumenZombis(s){
 const {automaticos,variables}=desgloseGenerados(s),manuales=(s.ajustesZombis||[]).reduce((n,r)=>n+r.delta,0);
 return {automaticos,manuales,variables,total:Math.max(0,automaticos+manuales)};
}
export function ajustesZombisValidos(registros){
 return registros===undefined||Array.isArray(registros)&&registros.every((r,i)=>r&&r.id===i+1&&(r.tipo===undefined||TIPOS_AJUSTE.includes(r.tipo))&&Number.isSafeInteger(r.delta)&&r.delta!==0&&Number.isSafeInteger(r.fecha)&&r.fecha>=0&&Number.isSafeInteger(r.tanda)&&r.tanda>=0&&NIVELES_ADRENALINA.includes(r.nivel));
}
export function ajustarZombis(s,delta,fecha=Date.now(),tipo='caminantes'){
 if(!TIPOS_AJUSTE.includes(tipo)||!Number.isSafeInteger(delta)||delta===0||!Number.isSafeInteger(fecha)||fecha<0)throw new Error('Ajuste de zombis inválido.');
 const total=resumenZombis(s).total;
 if(delta<0&&total===0)return;
 if(total+delta<0||!Number.isSafeInteger(total+delta))throw new Error('El ajuste excede el conteo permitido.');
 const registros=s.ajustesZombis??=[];
 registros.push({id:registros.length+1,delta,fecha,tipo,tanda:s.history.at(-1)?.number??0,nivel:s.nivelAdrenalina??'azul'});
}
