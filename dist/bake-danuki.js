export const BAKE_DANUKI='daily-du07';
export function tipoBakeDanuki(dado){
 if(!Number.isInteger(dado)||dado<1||dado>6)throw new Error('Dado de Bake-Danuki inválido.');
 return dado===1?'abominaciones':dado<=3?'corredores':dado<=5?'brutos':'caminantes';
}
export function bakeDanukiEnJuego(s){
 return s.pins.find(c=>c.cardId===BAKE_DANUKI&&c.mazo==='daily'&&!c.discarded&&!c.anulada)?.uid??null;
}
export function registrarBakeDanuki(tanda,uid,rng){
 if(uid===null)return;
 const azar=rng();
 if(!Number.isFinite(azar)||azar<0||azar>=1)throw new Error('Aleatoriedad inválida.');
 const dado=1+Math.floor(azar*6);
 tanda.bakeDanuki={uid,dado,tipo:tipoBakeDanuki(dado)};
}
export function tipoActualBakeDanuki(s,c){
 if(c.cardId!==BAKE_DANUKI||c.mazo!=='daily')return null;
 return s.history.findLast(b=>b.bakeDanuki?.uid===c.uid)?.bakeDanuki.tipo??'caminantes';
}
export function referenciaBakeDanuki(s,b){
 if(!b.bakeDanuki)return null;
 const r=b.bakeDanuki;
 const original=s.history.flatMap(t=>t.slots.flatMap(z=>z.draws.flatMap(c=>c.daily||[]))).find(c=>c.uid===r.uid);
 if(!original)return null;
 return {c:{...original,uid:`b-${b.number}-${r.uid}`,referenciaUid:r.uid,referenciaBakeDanuki:true,dadoBakeDanuki:r.dado,tipoBakeDanuki:r.tipo,discarded:false,anulada:false},slot:{id:`bake-${b.number}`,kind:'referencia',zone:''},zone:''};
}
export function validarBakeDanuki(s){
 return s.history.every((b,i)=>{
  if(b.bakeDanuki===undefined)return true;
  const r=b.bakeDanuki;
  if(!r||!Number.isSafeInteger(r.uid)||r.uid<1||r.tipo!==tipoBakeDanuki(r.dado))return false;
  return s.history.slice(0,i).some(t=>t.slots.some(z=>z.draws.some(c=>c.daily?.some(d=>d.uid===r.uid&&d.cardId===BAKE_DANUKI&&d.mazo==='daily'))));
 });
}
