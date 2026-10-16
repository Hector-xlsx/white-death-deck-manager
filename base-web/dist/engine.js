export const CATALOG = [
 {id:'nigromante',name:'Nigromante',copies:9,difficulty:null,image:'471_Nigromante.png'},
 {id:'abominacion',name:'Abominación',copies:6,difficulty:null,image:'461_Abominacion.png'},
 {id:'asedio',name:'Asedio zombi',copies:9,difficulty:null,image:'474_Asedio_zombi.png'},
 {id:'activacion-corredor',name:'Activación adicional corredor',copies:1,difficulty:null,image:'484_Activacion_adicional_Corredores.png',levels:['Sin efecto','Activación adicional','Activación adicional','Activación adicional']},
 {id:'activacion-brutos',name:'Activación adicional brutos',copies:1,difficulty:null,image:'483_Activacion_adicional_Brutos.png',levels:['Sin efecto','Activación adicional','Activación adicional','Activación adicional']},
 {id:'activacion-caminantes',name:'Activación adicional caminantes',copies:2,difficulty:null,image:'481_Activacion_adicional_Caminantes.png',levels:['Sin efecto','Activación adicional','Activación adicional','Activación adicional']},
 {id:'brutos-normal',name:'Brutos normal',copies:4,difficulty:'Normal',image:'451_Brutos.png',levels:[4,4,6,8]},
 {id:'brutos-facil',name:'Brutos fácil',copies:4,difficulty:'Fácil',image:'435_Brutos.png',levels:[2,2,6,8]},
 {id:'caminantes-normal',name:'Caminantes normal',copies:6,difficulty:'Normal',image:'444_Caminantes.png',levels:[4,6,8,10]},
 {id:'caminantes-facil',name:'Caminantes fácil',copies:6,difficulty:'Fácil',image:'429_Caminantes.png',levels:[2,4,6,8]},
 {id:'corredores-normal',name:'Corredores normal',copies:4,difficulty:'Normal',image:'455_Corredores.png',levels:[4,4,6,8]},
 {id:'corredores-facil',name:'Corredores fácil',copies:4,difficulty:'Fácil',image:'442_Corredores.png',levels:[2,2,6,8]}
];
export const total = values => Object.values(values).reduce((a,b)=>a+b,0);
export function newGame(config={easy:true,normal:true,threshold:20}, normal=3, necro=0) {
 const initial=Object.fromEntries(CATALOG.filter(c=>!c.difficulty || (c.difficulty==='Fácil'?config.easy:config.normal)).map(c=>[c.id,c.copies]));
 return {version:1,config:{...config},initial,remaining:{...initial},normal,necro,history:[],pins:[],unpinned:[],cycle:1,sequence:0,openBatch:false};
}
export function draw(s,rng=Math.random) {
 if(!total(s.remaining)) s.remaining={...s.initial};
 const count=total(s.remaining); if(!count) throw new Error('Mazo vacío');
 let ticket=Math.floor(rng()*count), selected;
 for(const [id,n] of Object.entries(s.remaining)) { if(ticket<n){selected=id;break;} ticket-=n; }
 if(!selected) throw new Error('Selección inválida');
 s.remaining[selected]--;
 const card={uid:++s.sequence,cardId:selected,discarded:false,cycle:s.cycle};
 const left=total(s.remaining), size=total(s.initial);
 if(left===0 || left/size*100<s.config.threshold){s.remaining={...s.initial};s.cycle++;}
 return card;
}
export function spawn(s,rng=Math.random) {
 const count=s.normal+s.necro; if(count===0) return null;
 const batch={number:s.history.length+1,date:Date.now(),normal:s.normal,necro:s.necro,slots:[]};
 for(let i=0;i<count;i++) batch.slots.push({zone:i<s.normal?`Zona ${i+1}`:`Nigromante ${i-s.normal+1}`,kind:i<s.normal?'normal':'necro',draws:[draw(s,rng)]});
 s.history.push(batch);s.openBatch=true;return batch;
}
export function replaceCard(s,batchNumber,slotIndex,rng=Math.random) {
 const slot=s.history.find(b=>b.number===batchNumber)?.slots[slotIndex];if(!slot)throw new Error('Zona inválida');
 slot.draws.at(-1).discarded=true;slot.draws.push(draw(s,rng));
}
export function discardCard(s,batchNumber,slotIndex) {
 const slot=s.history.find(b=>b.number===batchNumber)?.slots[slotIndex];
 if(!slot)throw new Error('Zona inválida');
 slot.draws.at(-1).discarded=true;
}
export function addZoneCard(s,batchNumber,kind,rng=Math.random) {
 if(!['normal','necro'].includes(kind))throw new Error('Tipo de zona inválido');
 const batch=s.history.find(b=>b.number===batchNumber);
 if(!batch)throw new Error('Tanda inválida');
 const card=draw(s,rng);
 const number=batch.slots.filter(slot=>slot.kind===kind).length+1;
 batch[kind]=(batch[kind]||0)+1;s[kind]++;
 batch.slots.push({zone:kind==='normal'?`Zona ${number}`:`Nigromante ${number}`,kind,draws:[card]});
 return card;
}
export function pinCard(s,card) {
 if(s.pins.some(c=>c.uid===card.uid))return;
 s.unpinned=(s.unpinned||[]).filter(c=>c.uid!==card.uid);
 s.pins.push({...card});
}
export function unpinCard(s,uid,subtractSpawn=false) {
 const card=s.pins.find(c=>c.uid===uid);if(!card)return;
 s.pins=s.pins.filter(c=>c.uid!==uid);
 s.unpinned=[{...card},...(s.unpinned||[]).filter(c=>c.uid!==uid)];
 if(subtractSpawn&&card.cardId==='nigromante')s.necro=Math.max(0,s.necro-1);
}
export function isValid(s) {
 if(!s||s.version!==1||!s.config||!Array.isArray(s.history)||!Array.isArray(s.pins))return false;
 if(!['easy','normal'].every(k=>typeof s.config[k]==='boolean')||!Number.isFinite(s.config.threshold)||s.config.threshold<0||s.config.threshold>99)return false;
 if(!['normal','necro','cycle','sequence'].every(k=>Number.isSafeInteger(s[k])&&s[k]>=0))return false;
 const expected=newGame(s.config).initial;
 if(JSON.stringify(s.initial)!==JSON.stringify(expected))return false;
 if(!s.remaining||Object.keys(s.remaining).length!==Object.keys(expected).length)return false;
 if(!Object.entries(expected).every(([id,n])=>Number.isInteger(s.remaining[id])&&s.remaining[id]>=0&&s.remaining[id]<=n))return false;
 const ids=new Set(CATALOG.map(c=>c.id));
 const validReference=c=>ids.has(c.cardId)&&Number.isInteger(c.uid);
 if(s.unpinned!==undefined&&(!Array.isArray(s.unpinned)||!s.unpinned.every(validReference)))return false;
 const references=[...s.pins,...(s.unpinned||[])];
 if(new Set(references.map(c=>c.uid)).size!==references.length)return false;
 return s.history.every((b,i)=>b.number===i+1&&Array.isArray(b.slots)&&b.slots.every(t=>Array.isArray(t.draws)&&t.draws.length>0&&t.draws.every(validReference)))&&s.pins.every(validReference);
}
