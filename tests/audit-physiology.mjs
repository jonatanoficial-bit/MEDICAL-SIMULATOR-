import fs from 'node:fs';
import {validatePhysiologyRegistry,profileForCase,createPhysiologySession,advancePhysiology,applyPhysiologyAction,reassessPhysiology,physiologyQuality,formatPhysiologyVitals} from '../src/simulation/physiology-engine.js';
const cases=JSON.parse(fs.readFileSync(new URL('../data/core-cases.json',import.meta.url),'utf8'));
const registry=JSON.parse(fs.readFileSync(new URL('../data/physiology.json',import.meta.url),'utf8'));
const validation=validatePhysiologyRegistry(registry,cases.map(item=>item.id));
if(!validation.ok)throw new Error(validation.errors.join(' | '));
const results=[];
for(const clinicalCase of cases){
  const profile=profileForCase(registry,clinicalCase.id);const first=createPhysiologySession(clinicalCase,profile,null,1000);const second=createPhysiologySession(clinicalCase,profile,null,1000);
  advancePhysiology(first,profile,30);advancePhysiology(second,profile,30);
  if(JSON.stringify(formatPhysiologyVitals(first))!==JSON.stringify(formatPhysiologyVitals(second)))throw new Error(`Motor não determinístico em ${clinicalCase.id}.`);
  const before=formatPhysiologyVitals(first);for(const conduct of clinicalCase.idealConduct)applyPhysiologyAction(first,profile,'conduct',conduct,registry.actionTimeCost.conduct);
  reassessPhysiology(first,profile,registry.actionTimeCost.reassessment);const after=formatPhysiologyVitals(first);
  if(!Number.isFinite(after.fc)||!Number.isFinite(after.reserve)||first.trend.length<2)throw new Error(`Tendência inválida em ${clinicalCase.id}.`);
  if(after.symptom>before.symptom+20)throw new Error(`Resposta inesperadamente agravante em ${clinicalCase.id}.`);
  const quality=physiologyQuality(first,profile);if(quality<0||quality>15)throw new Error(`Qualidade fisiológica fora do intervalo em ${clinicalCase.id}.`);
  results.push({caseId:clinicalCase.id,status:after.status,elapsed:after.elapsedMinutes,symptomBefore:before.symptom,symptomAfter:after.symptom,reserve:after.reserve,quality,trend:first.trend.length});
}
const angina=cases.find(item=>item.id==='angina-estavel'),anginaProfile=profileForCase(registry,angina.id),delayed=createPhysiologySession(angina,anginaProfile,null,1000);advancePhysiology(delayed,anginaProfile,45);
if(!['attention','unstable'].includes(delayed.status))throw new Error('Janela de segurança do caso de maior urgência não alterou o estado.');
console.log(JSON.stringify({ok:true,profiles:registry.profiles.length,engineVersion:registry.engineVersion,deterministic:true,delayedAnginaStatus:delayed.status,results},null,2));
