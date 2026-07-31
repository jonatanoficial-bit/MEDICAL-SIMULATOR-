import {fileURLToPath} from 'node:url';
import fs from 'node:fs';import path from 'node:path';
import {validateAssessmentRegistry} from '../src/data/assessment-schema.js';
const root=fileURLToPath(new URL('..',import.meta.url));
const readJson=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const registry=readJson('data/assessment.json');const cases=readJson('data/core-cases.json');
const result=validateAssessmentRegistry(registry,cases);if(!result.ok)throw new Error(result.errors.join(' | '));
const app=fs.readFileSync(path.join(root,'src/app.js'),'utf8');
const failures=[];const require=(ok,label)=>{if(!ok)failures.push(label)};
require(registry.cases.length===cases.length,'perfil por caso');
for(const item of registry.cases){require(item.interview.length>=5,`${item.caseId}: 5 perguntas`);require(item.physicalExam.length>=4,`${item.caseId}: 4 exames físicos`);}
for(const token of ['performAssessmentItem','physicalExamPanel','assessmentUi','structured-assessment','assessmentRegistry'])require(app.includes(token),`app:${token}`);
if(failures.length)throw new Error(failures.join(' | '));
console.log(JSON.stringify({ok:true,profiles:registry.cases.length,interviewItems:registry.cases.reduce((n,x)=>n+x.interview.length,0),physicalExamItems:registry.cases.reduce((n,x)=>n+x.physicalExam.length,0),locales:3},null,2));
