import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import {validateAcademy} from '../src/data/academy-schema.js';
import {FALLBACK_ACADEMY} from '../src/data/fallback-academy.js';
import {ACADEMY_UI} from '../src/i18n/academy-ui.js';
const root=fileURLToPath(new URL('..',import.meta.url));
const academy=JSON.parse(fs.readFileSync(path.join(root,'data/academy.json'),'utf8'));
const validation=validateAcademy(academy);
if(!validation.ok)throw new Error(`Academia inválida: ${validation.errors.join(' | ')}`);
const locales=['pt-BR','en','es'];
if(academy.modules.length!==9)throw new Error('Quantidade de módulos divergente.');
const lessonCounts={};
for(const locale of locales){
  lessonCounts[locale]=academy.modules.reduce((sum,item)=>sum+item.locales[locale].lessons.length,0);
  if(lessonCounts[locale]!==27)throw new Error(`Esperadas 27 lições em ${locale}.`);
  if(!ACADEMY_UI[locale]||Object.keys(ACADEMY_UI[locale]).length<50)throw new Error(`UI da Academia incompleta em ${locale}.`);
  if(academy.pretest[locale].questions.length!==5)throw new Error(`Pré-teste incompleto em ${locale}.`);
  const guided=academy.modules.find(item=>item.id==='guided-reasoning')?.locales?.[locale]?.guidedCase;
  if(!guided||guided.steps.length!==5)throw new Error(`Caso guiado incompleto em ${locale}.`);
}
if(JSON.stringify(academy)!==JSON.stringify(FALLBACK_ACADEMY))throw new Error('Fallback da Academia diverge de data/academy.json.');
for(const item of academy.modules){
  if(item.publishable!==false||item.status!=='development-only')throw new Error(`Módulo indevidamente publicável: ${item.id}`);
  if(!item.sourceIds.length)throw new Error(`Módulo sem fonte: ${item.id}`);
}
console.log(JSON.stringify({ok:true,modules:academy.modules.length,lessonCounts,pretestQuestions:5,guidedSteps:5,locales,developmentOnly:true},null,2));
