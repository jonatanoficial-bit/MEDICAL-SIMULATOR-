import {deepMerge} from './object.js';
import {createEnvelope,verifyEnvelope} from './checksum.js';

const now=()=>Date.now();
const parseJson=raw=>{try{return {ok:true,value:JSON.parse(raw)}}catch(error){return {ok:false,error}}};

export function createStateStore({
  key,
  legacyKeys=[],
  schemaVersion=1,
  buildVersion='0.0.0',
  maxBackups=5,
  backupIntervalMs=60000,
  diagnostics=null
}){
  const pendingKey=`${key}-pending`;
  const backupPrefix=`${key}-backup-`;
  let lastBackupAt=0;
  let lastStatus={ok:true,source:'none',message:'Store inicializado.',at:new Date().toISOString()};
  const report=(level,message,context={})=>{
    lastStatus={ok:level!=='error',source:context.source||'store',message,at:new Date().toISOString(),...context};
    diagnostics?.[level]?.('storage',message,context);
  };
  const allKeys=()=>{const keys=[];try{for(let i=0;i<localStorage.length;i+=1)keys.push(localStorage.key(i));}catch{}return keys.filter(Boolean)};
  const backupKeys=()=>allKeys().filter(item=>item.startsWith(backupPrefix)).sort((a,b)=>b.localeCompare(a));
  const prune=()=>{for(const item of backupKeys().slice(maxBackups)){try{localStorage.removeItem(item)}catch{}}};
  const migrate=value=>{
    const data=value&&typeof value==='object'?value:{};
    data.meta=data.meta&&typeof data.meta==='object'?data.meta:{};
    data.meta.saveSchema=schemaVersion;
    data.meta.buildVersion=buildVersion;
    if(!data.locale)data.locale='pt-BR';
    return data;
  };
  const encode=(payload,label='autosave')=>JSON.stringify(createEnvelope(payload,{kind:'vale-medical-save',schema:schemaVersion,label}));
  const decode=(raw,{allowPlain=true}={})=>{
    if(!raw)return {ok:false,error:'Registro vazio.'};
    const parsed=parseJson(raw);
    if(!parsed.ok)return {ok:false,error:`JSON inválido: ${parsed.error.message}`};
    const value=parsed.value;
    if(value?.kind==='vale-medical-save'){
      const verified=verifyEnvelope(value,{kind:'vale-medical-save'});
      if(!verified.ok)return verified;
      return {ok:true,payload:verified.payload,envelope:value,format:'envelope'};
    }
    if(allowPlain&&value&&typeof value==='object')return {ok:true,payload:value,envelope:null,format:'legacy-plain'};
    return {ok:false,error:'Formato de save não reconhecido.'};
  };
  const snapshotRaw=(label='automatico',raw=null,{force=false}={})=>{
    try{
      const sourceRaw=raw??localStorage.getItem(key);
      if(!sourceRaw)return false;
      if(!force&&backupIntervalMs>0&&now()-lastBackupAt<backupIntervalMs)return false;
      const decoded=decode(sourceRaw);
      if(!decoded.ok){report('warn','Save inválido não foi promovido a backup.',{source:'backup',error:decoded.error});return false;}
      const stamp=new Date().toISOString().replace(/[:.]/g,'-');
      const backupKey=`${backupPrefix}${stamp}-${String(label).replace(/[^a-z0-9_-]+/gi,'-')}-${Math.random().toString(36).slice(2,7)}`;
      localStorage.setItem(backupKey,sourceRaw);
      lastBackupAt=now();prune();
      report('info','Backup local criado.',{source:'backup',backupKey,label});
      return true;
    }catch(error){report('warn','Não foi possível criar backup local.',{source:'backup',error:error.message});return false;}
  };
  const candidates=()=>{
    const list=[{storageKey:key,kind:'current',priority:100},{storageKey:pendingKey,kind:'pending',priority:90}];
    backupKeys().forEach((storageKey,index)=>list.push({storageKey,kind:'backup',priority:80-index}));
    legacyKeys.forEach((storageKey,index)=>list.push({storageKey,kind:'legacy',priority:50-index}));
    return list;
  };
  const readCandidate=item=>{
    try{
      const raw=localStorage.getItem(item.storageKey);
      const decoded=decode(raw);
      if(!decoded.ok)return {...item,ok:false,error:decoded.error,raw};
      const updatedAt=Date.parse(decoded.payload?.meta?.updatedAt||decoded.envelope?.createdAt||0)||0;
      return {...item,ok:true,raw,payload:decoded.payload,envelope:decoded.envelope||null,format:decoded.format,updatedAt};
    }catch(error){return {...item,ok:false,error:error.message};}
  };
  const promote=(candidate,label='recovered')=>{
    try{
      const data=migrate(candidate.payload);
      localStorage.setItem(pendingKey,encode(data,`${label}-pending`));
      const verifyPending=decode(localStorage.getItem(pendingKey),{allowPlain:false});
      if(!verifyPending.ok)throw new Error(verifyPending.error);
      localStorage.setItem(key,encode(data,label));
      const verifyMain=decode(localStorage.getItem(key),{allowPlain:false});
      if(!verifyMain.ok)throw new Error(verifyMain.error);
      localStorage.removeItem(pendingKey);
      report('info','Save válido promovido para o slot principal.',{source:candidate.kind,storageKey:candidate.storageKey,label});
      return data;
    }catch(error){report('error','Falha ao promover save recuperado.',{source:candidate.kind,error:error.message});throw error;}
  };
  return {
    key,
    pendingKey,
    load(defaultFactory){
      const base=defaultFactory();
      const inspected=candidates().map(readCandidate);
      const valid=inspected.filter(item=>item.ok);
      if(!valid.length){
        if(inspected.some(item=>item.raw)){report('warn','Nenhum save válido encontrado; estado padrão restaurado.',{source:'load',invalid:inspected.filter(x=>!x.ok).map(x=>({key:x.storageKey,error:x.error}))});}
        else report('info','Nenhum save anterior encontrado; novo perfil iniciado.',{source:'load'});
        return base;
      }
      const current=valid.find(item=>item.kind==='current');
      const pending=valid.find(item=>item.kind==='pending');
      const chosen=current
        ?(pending&&pending.updatedAt>current.updatedAt?pending:current)
        :valid.sort((a,b)=>(b.updatedAt-a.updatedAt)||(b.priority-a.priority))[0];
      try{
        const merged=deepMerge(base,migrate(chosen.payload));
        const needsPromotion=chosen.storageKey!==key||chosen.format!=='envelope';
        if(needsPromotion){
          if(chosen.raw)snapshotRaw(`before-${chosen.kind}-promotion`,chosen.raw,{force:true});
          promote({...chosen,payload:merged},`migrated-${chosen.kind}`);
        }else{
          try{localStorage.removeItem(pendingKey)}catch{}
          report('info','Save principal validado com sucesso.',{source:'current',format:chosen.format});
        }
        return merged;
      }catch(error){report('error','Falha protegida durante a leitura do save.',{source:chosen.kind,error:error.message});return base;}
    },
    save(value,{label='autosave',forceBackup=false}={}){
      try{
        value.meta=value.meta&&typeof value.meta==='object'?value.meta:{};
        value.meta.saveSchema=schemaVersion;
        value.meta.buildVersion=buildVersion;
        value.meta.updatedAt=new Date().toISOString();
        const previous=localStorage.getItem(key);
        if(previous)snapshotRaw(label,previous,{force:forceBackup});
        const pending=encode(value,`${label}-pending`);
        localStorage.setItem(pendingKey,pending);
        const pendingCheck=decode(localStorage.getItem(pendingKey),{allowPlain:false});
        if(!pendingCheck.ok)throw new Error(`Gravação temporária inválida: ${pendingCheck.error}`);
        const committed=encode(value,label);
        localStorage.setItem(key,committed);
        const mainCheck=decode(localStorage.getItem(key),{allowPlain:false});
        if(!mainCheck.ok)throw new Error(`Verificação pós-gravação falhou: ${mainCheck.error}`);
        localStorage.removeItem(pendingKey);
        report('info','Save confirmado por gravação transacional.',{source:'save',label,checksum:mainCheck.envelope.checksum});
        return true;
      }catch(error){report('error','Falha protegida ao salvar; slot principal anterior foi preservado.',{source:'save',error:error.message});return false;}
    },
    reset(){try{localStorage.removeItem(key);localStorage.removeItem(pendingKey);report('info','Slot principal removido; backups preservados.',{source:'reset'});return true;}catch(error){report('error','Falha ao resetar slot principal.',{source:'reset',error:error.message});return false;}},
    backup(label='manual'){return snapshotRaw(label,null,{force:true});},
    listBackups(){
      return backupKeys().map(storageKey=>{
        const item=readCandidate({storageKey,kind:'backup',priority:0});
        return {storageKey,ok:item.ok,error:item.error||null,updatedAt:item.payload?.meta?.updatedAt||item.envelope?.createdAt||null,playerName:item.payload?.player?.name||'Perfil sem nome',level:item.payload?.player?.level||1,xp:item.payload?.player?.xp||0,screen:item.payload?.screen||'unknown'};
      });
    },
    restoreBackup(storageKey){
      if(!String(storageKey).startsWith(backupPrefix))return {ok:false,error:'Backup fora do escopo deste save.'};
      const item=readCandidate({storageKey,kind:'backup',priority:0});
      if(!item.ok)return {ok:false,error:item.error};
      try{
        const current=localStorage.getItem(key);if(current)snapshotRaw('before-restore',current,{force:true});
        promote(item,'manual-restore');
        return {ok:true,state:item.payload};
      }catch(error){return {ok:false,error:error.message};}
    },
    inspect(){
      const main=readCandidate({storageKey:key,kind:'current',priority:0});
      const pending=readCandidate({storageKey:pendingKey,kind:'pending',priority:0});
      return {key,main:{exists:!!main.raw,ok:main.ok,error:main.error||null,format:main.format||null},pending:{exists:!!pending.raw,ok:pending.ok,error:pending.error||null},backups:this.listBackups(),lastStatus};
    },
    status(){return lastStatus;},
    exportPackage(value){return createEnvelope({state:value,store:this.inspect()},{kind:'vale-medical-export',schema:schemaVersion,label:'manual-export'});}
  };
}
