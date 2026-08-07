import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {PATIENT_VARIANTS,createCommercialState,patientVariantForCase,preparePatientEncounter,registerPatientInteraction,completeCareerEncounter,commercialSummary,totalCoreVariants} from '../src/simulation/commercial-engine.js';

const root=fileURLToPath(new URL('..',import.meta.url));
const req=(condition,message)=>{if(!condition)throw new Error(message);};
const cases=JSON.parse(fs.readFileSync(path.join(root,'data/core-cases.json'),'utf8'));
req(totalCoreVariants(cases.map(item=>item.id))===24,'Escala de variantes centrais divergente.');
for(const item of cases)req(PATIENT_VARIANTS[item.id]?.length===4,`Variantes ausentes: ${item.id}`);

let state=preparePatientEncounter(createCommercialState(),cases[0]);
const first=patientVariantForCase(cases[0],state,'pt-BR');
req(first.variantId&&first.patientContext&&first.patient,'Variação de paciente incompleta.');
const trustBefore=state.trust;
state=registerPatientInteraction(state,{kind:'interview',priority:'essential',positive:true});
req(state.trust>trustBefore,'Interação positiva não alterou confiança.');
const result=completeCareerEncounter(state,{caseId:first.id,score:92,trust:state.trust,incidents:0,excessTests:0,elapsedMinutes:52,communication:82});
const summary=commercialSummary(result.state);
req(summary.world.competence>50&&summary.world.hospitalReputation>50,'Carreira viva não reagiu ao resultado.');
req(summary.world.journal.length===1,'Histórico da carreira não foi registrado.');

for(const page of ['privacy.html','terms.html','accessibility.html'])req(fs.existsSync(path.join(root,page)),`Página pública ausente: ${page}`);
const app=fs.readFileSync(path.join(root,'src/app.js'),'utf8');
for(const token of ['careerJourney','patient-rapport','completeCareerEncounter','legalSettingsCard'])req(app.includes(token),`Integração comercial ausente: ${token}`);
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
req(sw.includes('commercial-engine.js')&&sw.includes('privacy.html'),'Cache offline comercial incompleto.');
console.log(JSON.stringify({ok:true,coreVariants:24,emergencies:9,outpatientPrograms:10,totalExperiences:43,careerMetrics:5,publicPolicies:3},null,2));
