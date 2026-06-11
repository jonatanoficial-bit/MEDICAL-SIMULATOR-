const safeJson=value=>{
  try{return JSON.parse(JSON.stringify(value));}catch{return {unserializable:true};}
};

export function createDiagnostics({key='medsim-diagnostics',build='dev',maxEntries=80}={}){
  const read=()=>{
    try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[];}catch{return [];}
  };
  const write=entries=>{
    try{localStorage.setItem(key,JSON.stringify(entries.slice(-maxEntries)));return true;}catch{return false;}
  };
  const log=(level,category,message,context={})=>{
    const entry={
      id:`${Date.now()}-${Math.random().toString(36).slice(2,8)}`,
      at:new Date().toISOString(),build,level,category,
      message:String(message||'Evento sem descrição'),
      context:safeJson(context)
    };
    const entries=read();entries.push(entry);write(entries);
    return entry;
  };
  return {
    key,
    info:(category,message,context)=>log('info',category,message,context),
    warn:(category,message,context)=>log('warn',category,message,context),
    error:(category,message,context)=>log('error',category,message,context),
    list:(limit=maxEntries)=>read().slice(-limit).reverse(),
    clear:()=>{try{localStorage.removeItem(key);return true;}catch{return false;}},
    summary:()=>{
      const entries=read();
      return {total:entries.length,errors:entries.filter(x=>x.level==='error').length,warnings:entries.filter(x=>x.level==='warn').length,last:entries.at(-1)||null};
    },
    export:()=>({
      product:'Medical Simulator - Vale Edition',build,exportedAt:new Date().toISOString(),
      environment:{userAgent:navigator?.userAgent||'unknown',language:navigator?.language||'unknown',online:navigator?.onLine??null,viewport:typeof innerWidth==='number'?`${innerWidth}x${innerHeight}`:'unknown'},
      entries:read()
    })
  };
}
