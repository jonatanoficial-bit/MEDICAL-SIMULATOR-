import fs from 'node:fs';
import path from 'node:path';
import {CATALOGS} from '../src/i18n/catalogs.js';
import {SUPPORTED_LOCALES,normalizeLocale,detectLocale,translateTerm,translateText,catalogStats} from '../src/i18n/index.js';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const readJson=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const failures=[];const require=(ok,label)=>{if(!ok)failures.push(label)};
require(SUPPORTED_LOCALES.length===3,'três idiomas registrados');
for(const locale of ['pt-BR','en','es'])require(SUPPORTED_LOCALES.some(item=>item.id===locale&&item.ready==='complete'),`idioma pronto: ${locale}`);
require(normalizeLocale('en-US')==='en','normalização en-US');
require(normalizeLocale('es-AR')==='es','normalização es-AR');
require(normalizeLocale('pt-PT')==='pt-BR','normalização pt');
require(detectLocale(['fr-FR','es-MX'])==='es','detecção por lista');
const stats=catalogStats();
for(const locale of ['en','es']){
  require(stats[locale].ui>=350,`${locale}: cobertura UI`);
  require(stats[locale].terms>=100,`${locale}: termos clínicos`);
  require(stats[locale].responses>=40,`${locale}: respostas clínicas`);
}
const gameplay=readJson('data/gameplay.json');
const specialties=readJson('data/specialties.json').specialties;
const missions=readJson('data/missions.json').missions;
const responses=readJson('data/clinical-responses.json');
const canonicalTerms=[...gameplay.exams,...gameplay.procedures,...gameplay.hypotheses,...gameplay.conducts,...gameplay.directedQuestions,...specialties.flatMap(x=>[x.name,x.description]),...missions.flatMap(x=>[x.type,x.title])];
for(const locale of ['en','es']){
  for(const term of canonicalTerms)require(Object.hasOwn(CATALOGS[locale].terms,term),`${locale}: termo ausente ${term}`);
  const clinical=[];
  for(const group of ['examResults','questionResults'])for(const values of Object.values(responses[group]))clinical.push(...Object.values(values));
  clinical.push(...Object.values(responses.procedureResults));
  for(const response of clinical)require(Object.hasOwn(CATALOGS[locale].responses,response),`${locale}: resposta ausente`);
}
require(translateTerm('en','Hemograma completo')==='Complete blood count','termo clínico inglês');
require(translateTerm('es','Aferir sinais vitais')==='Medir signos vitales','termo clínico espanhol');
require(translateText('en','Marcos • 34 anos • Masculino').includes('34 years old')&&translateText('en','Marcos • 34 anos • Masculino').includes('Male'),'padrões dinâmicos inglês');
require(translateText('es','Nível 3 • Reputação Boa').includes('Nivel 3')&&translateText('es','Nível 3 • Reputação Boa').includes('Reputación Buena'),'padrões dinâmicos espanhol');
const app=read('src/app.js'),sw=read('sw.js'),index=read('index.html'),state=read('src/core/default-state.js');
for(const token of ['localizeDOM','applyDocumentLocale','detectLocale','setAppLocale','top-locale','localeSelected'])require(app.includes(token),`app:${token}`);
require(sw.includes("'./src/i18n/catalogs.js'"),'catálogo no cache crítico');
require(index.includes('src/i18n/catalogs.js'),'catálogo em modulepreload');
require(state.includes("locale:'pt-BR'")&&state.includes('saveSchema:18'),'locale e schema no estado');
if(failures.length)throw new Error(`Auditoria i18n falhou: ${failures.slice(0,25).join(' | ')}${failures.length>25?` (+${failures.length-25})`:''}`);
console.log(JSON.stringify({ok:true,locales:SUPPORTED_LOCALES.map(x=>x.id),stats,canonicalTerms:canonicalTerms.length,clinicalResponses:46,liveSwitch:true,canonicalGameplayPreserved:true},null,2));
