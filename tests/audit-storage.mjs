const memory=new Map();
globalThis.localStorage={
  get length(){return memory.size;},
  key:index=>Array.from(memory.keys())[index]??null,
  getItem:key=>memory.has(key)?memory.get(key):null,
  setItem:(key,value)=>memory.set(key,String(value)),
  removeItem:key=>memory.delete(key),
  clear:()=>memory.clear()
};
const {createStateStore}=await import('../src/core/storage.js');
const {createEnvelope}=await import('../src/core/checksum.js');
const {createDefaultState}=await import('../src/core/default-state.js');
const legacy={screen:'hub',player:{name:'Dr. Save Antigo',short:'Dr. Save',xp:777,avatar:2},accessibility:{contrast:'high',textSize:'large',reduceMotion:true},meta:{updatedAt:'2026-06-12T14:00:00.000Z'}};
localStorage.setItem('medsim-vale-save-v017',JSON.stringify(legacy));
const store=createStateStore({key:'medsim-vale-save-v027',legacyKeys:['medsim-vale-save-v026','medsim-vale-save-v017'],schemaVersion:18,buildVersion:'0.27.0',maxBackups:5,backupIntervalMs:0});
let state=store.load(()=>createDefaultState({buildVersion:'0.27.0'}));
if(state.player.name!=='Dr. Save Antigo'||state.player.xp!==777||state.meta.saveSchema!==18)throw new Error('Migração do save antigo falhou.');
if(state.accessibility?.contrast!=='high'||state.accessibility?.textSize!=='large')throw new Error('Preferências de acessibilidade não foram preservadas.');
const migrated=JSON.parse(localStorage.getItem('medsim-vale-save-v027'));
if(migrated.kind!=='vale-medical-save'||!migrated.checksum||migrated.payload.meta.buildVersion!=='0.27.0')throw new Error('Envelope migrado inválido.');
state.player.xp=900;
if(!store.save(state,{label:'audit-save',forceBackup:true}))throw new Error('Save transacional falhou.');
if(localStorage.getItem(store.pendingKey)!==null)throw new Error('Slot pendente não foi limpo após commit.');
const stableCurrent=localStorage.getItem('medsim-vale-save-v027');
const interrupted=structuredClone(state);interrupted.player.xp=1200;interrupted.meta.updatedAt=new Date(Date.now()+60000).toISOString();
localStorage.setItem(store.pendingKey,JSON.stringify(createEnvelope(interrupted,{kind:'vale-medical-save',schema:10,label:'interrupted-write'})));
localStorage.setItem('medsim-vale-save-v027',stableCurrent);
state=store.load(()=>createDefaultState({buildVersion:'0.27.0'}));
if(state.player.xp!==1200||localStorage.getItem(store.pendingKey)!==null)throw new Error('Recuperação de gravação pendente interrompida falhou.');
for(let index=0;index<7;index+=1){
  state.player.xp=901+index;
  store.save(state,{label:`rotation-${index}`,forceBackup:true});
  await new Promise(resolve=>setTimeout(resolve,2));
}
if(store.listBackups().length!==5)throw new Error(`Rotação esperava 5 backups e encontrou ${store.listBackups().length}.`);
const current=JSON.parse(localStorage.getItem('medsim-vale-save-v027'));
current.checksum='00000000';
localStorage.setItem('medsim-vale-save-v027',JSON.stringify(current));
state=store.load(()=>createDefaultState({buildVersion:'0.27.0'}));
if(state.player.name!=='Dr. Save Antigo'||state.player.xp<900)throw new Error('Recuperação automática do backup falhou.');
const inspection=store.inspect();
if(!inspection.main.ok||inspection.backups.length<1)throw new Error('Inspeção do store inválida.');
console.log(JSON.stringify({ok:true,saveSchema:state.meta.saveSchema,player:state.player.name,xp:state.player.xp,accessibility:state.accessibility,backups:inspection.backups.length,pending:inspection.pending.exists,mainIntegrity:inspection.main.ok},null,2));
