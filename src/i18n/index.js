export const SUPPORTED_LOCALES=Object.freeze([
  {id:'pt-BR',label:'Português (Brasil)',ready:'base'},
  {id:'en',label:'English',ready:'structure'},
  {id:'es',label:'Español',ready:'structure'}
]);
export function normalizeLocale(value){return SUPPORTED_LOCALES.some(item=>item.id===value)?value:'pt-BR';}
export function localeLabel(value){return SUPPORTED_LOCALES.find(item=>item.id===normalizeLocale(value))?.label||'Português (Brasil)';}
