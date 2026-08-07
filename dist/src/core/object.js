export function deepMerge(base, extra){
  if(!extra || typeof extra !== 'object') return base;
  for(const key of Object.keys(extra)){
    const incoming=extra[key];
    const current=base[key];
    if(incoming && typeof incoming === 'object' && !Array.isArray(incoming) && current && typeof current === 'object' && !Array.isArray(current)){
      deepMerge(current,incoming);
    }else{
      base[key]=incoming;
    }
  }
  return base;
}

export function cloneJson(value){
  if(typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
