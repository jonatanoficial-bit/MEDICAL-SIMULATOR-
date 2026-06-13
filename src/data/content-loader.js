import {getFallbackContent} from './fallback-content.js';
import {validateGameContent} from './content-schema.js';
import {createEnvelope,verifyEnvelope} from '../core/checksum.js';

const FILES={
  cases:'data/core-cases.json',gameplay:'data/gameplay.json',queue:'data/queue.json',
  specialties:'data/specialties.json',missions:'data/missions.json',responses:'data/clinical-responses.json',governance:'data/governance.json',academy:'data/academy.json',physiology:'data/physiology.json',assessment:'data/assessment.json',therapeutics:'data/therapeutics.json',emergency:'data/emergency.json',outpatient:'data/outpatient.json',branching:'data/branching.json'
};
const CACHE_KEY='medsim-last-known-good-content-v024';
const LEGACY_CACHE_KEYS=['medsim-last-known-good-content-v023','medsim-last-known-good-content-v022','medsim-last-known-good-content-v021','medsim-last-known-good-content-v020','medsim-last-known-good-content-v018','medsim-last-known-good-content-v017','medsim-last-known-good-content-v016','medsim-last-known-good-content-v015','medsim-last-known-good-content-v014','medsim-last-known-good-content-v013','medsim-last-known-good-content-v012'];

const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));

function normalizeContentPackage(content,fallback){
  const normalized={...(content||{})};
  if(!normalized.governance)normalized.governance=fallback.governance;
  if(!normalized.academy)normalized.academy=fallback.academy;
  if(!normalized.physiology)normalized.physiology=fallback.physiology;
  if(!normalized.assessment)normalized.assessment=fallback.assessment;
  if(!normalized.therapeutics)normalized.therapeutics=fallback.therapeutics;
  if(!normalized.emergency)normalized.emergency=fallback.emergency;
  if(!normalized.outpatient)normalized.outpatient=fallback.outpatient;
  if(!normalized.branching)normalized.branching=fallback.branching;
  return normalized;
}

async function fetchJson(path,version,{timeoutMs=5000,retries=1}={}){
  let lastError=null;
  for(let attempt=0;attempt<=retries;attempt+=1){
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),timeoutMs);
    const started=performance.now();
    try{
      const response=await fetch(`${path}?v=${encodeURIComponent(version)}&attempt=${attempt}`,{cache:'no-store',signal:controller.signal});
      if(!response.ok)throw new Error(`${path}: HTTP ${response.status}`);
      const data=await response.json();
      return {data,attempt,durationMs:Math.round(performance.now()-started)};
    }catch(error){
      lastError=error.name==='AbortError'?new Error(`${path}: tempo limite de ${timeoutMs} ms excedido`):error;
      if(attempt<retries)await delay(140*(attempt+1));
    }finally{clearTimeout(timer);}
  }
  throw lastError||new Error(`${path}: falha desconhecida`);
}

function readCachedContent(){
  try{
    let raw=localStorage.getItem(CACHE_KEY);
    if(!raw){
      for(const legacyKey of LEGACY_CACHE_KEYS){raw=localStorage.getItem(legacyKey);if(raw)break;}
    }
    if(!raw)return {ok:false,error:'Cache clínico ainda não criado.'};
    const parsed=JSON.parse(raw);
    const verified=verifyEnvelope(parsed,{kind:'vale-clinical-content'});
    if(!verified.ok)return verified;
    const fallback=getFallbackContent();
    const normalized=normalizeContentPackage(verified.payload.content,fallback);
    const validation=validateGameContent(normalized);
    if(!validation.ok)return {ok:false,error:`Cache clínico inválido: ${validation.errors.join(' | ')}`};
    return {ok:true,content:normalized,metadata:verified.payload.metadata||{},validation};
  }catch(error){return {ok:false,error:error.message};}
}

function writeCachedContent(content,metadata){
  try{
    const envelope=createEnvelope({content,metadata:{...metadata,cachedAt:new Date().toISOString()}},{kind:'vale-clinical-content',schema:8,label:'last-known-good'});
    localStorage.setItem(CACHE_KEY,JSON.stringify(envelope));
    return {ok:true,checksum:envelope.checksum};
  }catch(error){return {ok:false,error:error.message};}
}

export async function loadGameContent({version='dev',safeMode=false,diagnostics=null}={}){
  const fallback=getFallbackContent();
  const total=Object.keys(FILES).length;
  const warnings=[];
  const timings={};
  if(safeMode){
    const validation=validateGameContent(fallback);
    diagnostics?.warn?.('content','Modo seguro ativado; conteúdo externo ignorado.',{version});
    return {content:fallback,status:{mode:'safe-fallback',source:'internal',externalCount:0,total,warnings:['Modo seguro: arquivos externos não foram carregados.'],validation,timings}};
  }
  const content={};
  let externalCount=0;
  await Promise.all(Object.entries(FILES).map(async([key,path])=>{
    try{
      const result=await fetchJson(path,version,{timeoutMs:5000,retries:1});
      content[key]=result.data;externalCount+=1;timings[path]={ok:true,attempts:result.attempt+1,durationMs:result.durationMs};
    }catch(error){content[key]=fallback[key];warnings.push(`${path} usou fallback: ${error.message}`);timings[path]={ok:false,error:error.message};}
  }));
  const normalizedContent=normalizeContentPackage(content,fallback);
  const validation=validateGameContent(normalizedContent);
  if(validation.ok){
    const mode=externalCount===total?'external':externalCount===0?'fallback':'hybrid';
    const cacheResult=writeCachedContent(normalizedContent,{version,mode,externalCount,total});
    if(!cacheResult.ok)warnings.push(`Cache clínico não pôde ser atualizado: ${cacheResult.error}`);
    diagnostics?.info?.('content','Conteúdo clínico validado antes da ativação.',{mode,externalCount,total,cache:cacheResult.ok});
    return {content:normalizedContent,status:{mode,source:externalCount?'network+fallback':'internal',externalCount,total,warnings:[...warnings,...validation.warnings],validation,timings,cache:cacheResult}};
  }
  warnings.push(...validation.errors.map(item=>`Validação: ${item}`));
  const cached=readCachedContent();
  if(cached.ok){
    diagnostics?.warn?.('content','Conteúdo recebido foi rejeitado; último pacote válido restaurado.',{errors:validation.errors,cachedVersion:cached.metadata.version});
    return {content:cached.content,status:{mode:'last-known-good',source:'local-cache',externalCount:0,total,warnings:[...warnings,...validation.warnings,'Foi restaurado o último pacote clínico validado.'],validation:cached.validation,timings,cacheMetadata:cached.metadata}};
  }
  const fallbackValidation=validateGameContent(fallback);
  if(!fallbackValidation.ok)throw new Error(`Fallback interno inválido: ${fallbackValidation.errors.join(' | ')}`);
  warnings.push(`Último pacote válido indisponível: ${cached.error}`);
  diagnostics?.error?.('content','Conteúdo externo e cache foram rejeitados; fallback interno ativado.',{errors:validation.errors,cacheError:cached.error});
  return {content:fallback,status:{mode:'fallback',source:'internal',externalCount:0,total,warnings:[...warnings,...validation.warnings],validation:fallbackValidation,timings}};
}

export function clearClinicalContentCache(){
  try{localStorage.removeItem(CACHE_KEY);return true;}catch{return false;}
}
