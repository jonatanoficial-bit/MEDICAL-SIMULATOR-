import {CATALOGS} from './catalogs.js';

export const SUPPORTED_LOCALES=Object.freeze(Object.entries(CATALOGS).map(([id,catalog])=>({id,label:catalog.meta.label,short:catalog.meta.short,ready:catalog.meta.ready?'complete':'structure'})));

export function normalizeLocale(value){
  const raw=String(value||'').trim();
  if(CATALOGS[raw])return raw;
  const base=raw.toLowerCase().split('-')[0];
  if(base==='pt')return 'pt-BR';
  if(base==='en')return 'en';
  if(base==='es')return 'es';
  return 'pt-BR';
}

export function detectLocale(languages=globalThis.navigator?.languages||[globalThis.navigator?.language]){
  for(const language of languages||[]){
    const normalized=normalizeLocale(language);
    const base=String(language||'').toLowerCase().split('-')[0];
    if(base==='pt'||base==='en'||base==='es')return normalized;
  }
  return 'pt-BR';
}

export function localeLabel(value){return CATALOGS[normalizeLocale(value)]?.meta?.label||CATALOGS['pt-BR'].meta.label;}
export function localeShort(value){return CATALOGS[normalizeLocale(value)]?.meta?.short||'PT';}

function interpolate(value,params={}){
  return String(value).replace(/\{([\w.-]+)\}/g,(_,key)=>Object.prototype.hasOwnProperty.call(params,key)?String(params[key]):`{${key}}`);
}

export function t(locale,key,params={}){
  const normalized=normalizeLocale(locale);
  if(normalized==='pt-BR')return interpolate(key,params);
  const catalog=CATALOGS[normalized];
  return interpolate(catalog?.ui?.[key]??catalog?.terms?.[key]??catalog?.responses?.[key]??key,params);
}

export function translateTerm(locale,value){
  const normalized=normalizeLocale(locale);
  if(normalized==='pt-BR')return String(value??'');
  const catalog=CATALOGS[normalized];
  const raw=String(value??'');
  return catalog?.terms?.[raw]??catalog?.ui?.[raw]??catalog?.responses?.[raw]??raw;
}

const preserveSpace=(raw,translated)=>{
  const lead=raw.match(/^\s*/)?.[0]||'';
  const trail=raw.match(/\s*$/)?.[0]||'';
  return lead+translated+trail;
};

function applyPatterns(locale,text){
  if(locale==='pt-BR')return text;
  let out=text;
  if(locale==='en'){
    out=out.replace(/\b(\d+) anos\b/g,'$1 years old');
    out=out.replace(/\bNível (\d+)\b/g,'Level $1');
    out=out.replace(/\bnível (\d+)\b/g,'level $1');
    out=out.replace(/\bCriticidade (\d+)\b/g,'Criticality $1');
    out=out.replace(/\b(\d+) etapas documentadas\b/g,'$1 documented steps');
    out=out.replace(/\bDisponível • (\d+) caso\(s\)\b/g,'Available • $1 case(s)');
    out=out.replace(/\bDisponível com (\d+) casos\b/g,'Available with $1 cases');
    out=out.replace(/\b(\d+)\/(\d+) casos aprovados\b/g,'$1/$2 approved cases');
    out=out.replace(/\bReputação ([\p{L} ]+)\b/gu,(_,value)=>`Reputation ${translateTerm(locale,value.trim())}`);
    out=out.replace(/\bRep\. ([\p{L} ]+)\b/gu,(_,value)=>`Rep. ${translateTerm(locale,value.trim())}`);
  }else if(locale==='es'){
    out=out.replace(/\b(\d+) anos\b/g,'$1 años');
    out=out.replace(/\bNível (\d+)\b/g,'Nivel $1');
    out=out.replace(/\bnível (\d+)\b/g,'nivel $1');
    out=out.replace(/\bCriticidade (\d+)\b/g,'Criticidad $1');
    out=out.replace(/\b(\d+) etapas documentadas\b/g,'$1 etapas documentadas');
    out=out.replace(/\bDisponível • (\d+) caso\(s\)\b/g,'Disponible • $1 caso(s)');
    out=out.replace(/\bDisponível com (\d+) casos\b/g,'Disponible con $1 casos');
    out=out.replace(/\b(\d+)\/(\d+) casos aprovados\b/g,'$1/$2 casos aprobados');
    out=out.replace(/\bReputação ([\p{L} ]+)\b/gu,(_,value)=>`Reputación ${translateTerm(locale,value.trim())}`);
    out=out.replace(/\bRep\. ([\p{L} ]+)\b/gu,(_,value)=>`Rep. ${translateTerm(locale,value.trim())}`);
  }
  return out;
}

export function translateText(locale,value){
  const normalized=normalizeLocale(locale);
  const raw=String(value??'');
  if(normalized==='pt-BR'||!raw.trim())return raw;
  const trimmed=raw.trim();
  const catalog=CATALOGS[normalized];
  const exact=catalog?.ui?.[trimmed]??catalog?.terms?.[trimmed]??catalog?.responses?.[trimmed];
  if(exact!==undefined)return preserveSpace(raw,exact);
  let translated=trimmed;
  const entries=[...Object.entries(catalog?.responses||{}),...Object.entries(catalog?.terms||{}),...Object.entries(catalog?.ui||{})]
    .filter(([source,target])=>source&&target&&source!==target)
    .sort((a,b)=>b[0].length-a[0].length);
  for(const [source,target] of entries){
    if(translated.includes(source))translated=translated.split(source).join(target);
  }
  translated=applyPatterns(normalized,translated);
  return preserveSpace(raw,translated);
}

export function formatDateTime(locale,value,options={dateStyle:'short',timeStyle:'short'}){
  const date=value instanceof Date?value:new Date(value);
  if(Number.isNaN(date.getTime()))return t(locale,'Data indisponível');
  try{return new Intl.DateTimeFormat(normalizeLocale(locale),options).format(date);}catch{return date.toISOString();}
}

export function formatNumber(locale,value,options={}){
  try{return new Intl.NumberFormat(normalizeLocale(locale),options).format(Number(value));}catch{return String(value);}
}

export function localizeDOM(root,locale){
  const normalized=normalizeLocale(locale);
  if(!root||normalized==='pt-BR')return;
  try{
    const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(node){
      const parent=node.parentElement;
      if(!parent||['SCRIPT','STYLE','TEXTAREA','CODE','KBD'].includes(parent.tagName))return NodeFilter.FILTER_REJECT;
      if(parent.closest?.('[data-no-i18n]'))return NodeFilter.FILTER_REJECT;
      return node.nodeValue?.trim()?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
    }});
    const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes)node.nodeValue=translateText(normalized,node.nodeValue);
    for(const element of root.querySelectorAll?.('[aria-label],[title],[placeholder]')||[]){
      for(const attr of ['aria-label','title','placeholder','data-text']){
        if(element.hasAttribute(attr))element.setAttribute(attr,translateText(normalized,element.getAttribute(attr)));
      }
    }
  }catch(error){console.warn('[ValeI18n] DOM localization skipped.',error);}
}

export function applyDocumentLocale(locale){
  const normalized=normalizeLocale(locale);
  if(globalThis.document?.documentElement){
    document.documentElement.lang=normalized;
    document.documentElement.dir='ltr';
    document.documentElement.dataset.locale=normalized;
  }
  return normalized;
}

export function catalogStats(){
  return Object.fromEntries(Object.entries(CATALOGS).map(([id,c])=>[id,{ui:Object.keys(c.ui||{}).length,terms:Object.keys(c.terms||{}).length,responses:Object.keys(c.responses||{}).length,ready:Boolean(c.meta?.ready)}]));
}
