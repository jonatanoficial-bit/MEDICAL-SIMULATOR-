export function stableStringify(value){
  const seen=new WeakSet();
  const walk=input=>{
    if(input===null||typeof input!=='object') return input;
    if(seen.has(input)) throw new TypeError('Estrutura circular não suportada.');
    seen.add(input);
    if(Array.isArray(input)) return input.map(walk);
    return Object.keys(input).sort().reduce((out,key)=>{out[key]=walk(input[key]);return out;},{});
  };
  return JSON.stringify(walk(value));
}

export function fnv1a(value){
  const text=typeof value==='string'?value:stableStringify(value);
  let hash=0x811c9dc5;
  for(let i=0;i<text.length;i+=1){
    hash^=text.charCodeAt(i);
    hash=Math.imul(hash,0x01000193)>>>0;
  }
  return hash.toString(16).padStart(8,'0');
}

export function createEnvelope(payload,{kind='vale-envelope',schema=1,label=''}={}){
  const serialized=stableStringify(payload);
  return {
    kind,
    schema,
    label,
    createdAt:new Date().toISOString(),
    checksum:fnv1a(serialized),
    payload
  };
}

export function verifyEnvelope(value,{kind}={}){
  if(!value||typeof value!=='object'||!('payload' in value)) return {ok:false,error:'Envelope ausente ou inválido.'};
  if(kind&&value.kind!==kind) return {ok:false,error:`Tipo inesperado: ${value.kind||'sem tipo'}.`};
  try{
    const checksum=fnv1a(stableStringify(value.payload));
    if(checksum!==value.checksum) return {ok:false,error:'Checksum divergente.',expected:value.checksum,actual:checksum};
    return {ok:true,payload:value.payload,envelope:value};
  }catch(error){return {ok:false,error:error.message};}
}
