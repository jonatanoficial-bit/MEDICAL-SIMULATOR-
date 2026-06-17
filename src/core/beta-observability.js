const clone=value=>{try{return JSON.parse(JSON.stringify(value));}catch{return null;}};
const readJson=(storage,key,fallback)=>{try{const value=JSON.parse(storage.getItem(key)||'null');return value??fallback;}catch{return fallback;}};

export function createBetaObservability({key='medsim-beta-sessions',build='dev',maxSessions=25,diagnostics,storage=globalThis.localStorage}={}){
  let enabled=false;
  let active=null;
  const read=()=>{const value=readJson(storage,key,[]);return Array.isArray(value)?value:[];};
  const write=sessions=>{try{storage.setItem(key,JSON.stringify(sessions.slice(-maxSessions)));return true;}catch(error){diagnostics?.warn?.('beta','Falha ao gravar telemetria local.',{error:String(error)});return false;}};
  const persist=()=>{if(!active)return false;const sessions=read().filter(item=>item.id!==active.id);sessions.push(active);return write(sessions);};
  const safeContext=context=>{
    const value=clone(context)||{};
    delete value.playerName;delete value.name;delete value.description;delete value.freeText;
    return value;
  };
  return {
    key,
    setEnabled(value){enabled=Boolean(value);if(!enabled)active=null;return enabled;},
    isEnabled:()=>enabled,
    start(context={}){
      if(!enabled)return null;
      active={id:`beta-${Date.now()}-${Math.random().toString(36).slice(2,8)}`,build,startedAt:new Date().toISOString(),endedAt:null,durationMs:0,events:[],context:safeContext(context)};
      this.record('session-start',{screen:context.screen||'unknown'});return clone(active);
    },
    record(type,context={}){
      if(!enabled)return false;
      if(!active)this.start({screen:context.screen||'unknown'});
      if(!active)return false;
      active.events.push({at:new Date().toISOString(),type:String(type||'event'),context:safeContext(context)});
      active.events=active.events.slice(-160);active.durationMs=Math.max(0,Date.now()-Date.parse(active.startedAt));persist();return true;
    },
    end(reason='normal'){
      if(!enabled||!active)return false;
      active.endedAt=new Date().toISOString();active.durationMs=Math.max(0,Date.now()-Date.parse(active.startedAt));active.endReason=String(reason);persist();active=null;return true;
    },
    summary(){
      const sessions=read();const events=sessions.reduce((sum,item)=>sum+(item.events?.length||0),0);
      return {enabled,sessions:sessions.length,events,last:sessions.at(-1)||null,storageKey:key,localOnly:true};
    },
    list(limit=maxSessions){return read().slice(-limit).reverse();},
    clear(){active=null;try{storage.removeItem(key);return true;}catch{return false;}},
    export(){return {product:'Medical Simulator - Vale Edition',build,exportedAt:new Date().toISOString(),localOnly:true,sessions:read()};}
  };
}
