import fs from 'node:fs';
import path from 'node:path';
import {validateGovernance,evaluateReleaseGate,isCasePlayable} from '../src/data/clinical-governance.js';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const cases=read('data/core-cases.json');
const governance=read('data/governance.json');
const validation=validateGovernance(governance,cases);
if(!validation.ok)throw new Error(`Governança inválida: ${validation.errors.join(' | ')}`);
if(governance.releaseChannel!=='development')throw new Error('A Fase 8 deve permanecer no canal development até aprovação clínica real.');
if(governance.sources.length<7)throw new Error('Registro de fontes oficiais incompleto.');
for(const clinicalCase of cases){
  const record=governance.cases[clinicalCase.id];
  if(!record)throw new Error(`Caso sem governança: ${clinicalCase.id}`);
  if(record.publishable!==false)throw new Error(`Caso não revisado foi marcado como publicável: ${clinicalCase.id}`);
  if(record.status!=='reference-mapped')throw new Error(`Status inesperado em ${clinicalCase.id}: ${record.status}`);
  if(!isCasePlayable(governance,clinicalCase.id))throw new Error(`Caso de desenvolvimento foi bloqueado indevidamente: ${clinicalCase.id}`);
}
const gate=evaluateReleaseGate(governance,cases);
if(gate.ready||gate.approvedCount!==0||gate.blockedCount!==cases.length)throw new Error('Release gate deveria bloquear os seis casos ainda não revisados.');
for(const item of gate.items){
  if(item.sourcesFresh!==true)throw new Error(`Fonte deveria estar vigente no mapeamento inicial: ${item.caseId}`);
  for(const blocker of ['aprovação clínica pendente','publicação desativada','responsável clínico ausente','revisor médico ausente','auditoria de segurança pendente','revisão trilíngue pendente','data de revisão clínica ausente','data de revisão trilíngue ausente','data de QA ausente','próxima revisão não agendada'])if(!item.blockers.includes(blocker))throw new Error(`Bloqueio ausente em ${item.caseId}: ${blocker}`);
}
const urls=governance.sources.map(source=>source.url);
if(urls.some(url=>!url.startsWith('https://')))throw new Error('Fonte sem HTTPS.');
console.log(JSON.stringify({ok:true,channel:gate.channel,cases:gate.total,approved:gate.approvedCount,blocked:gate.blockedCount,sources:governance.sources.length,warnings:validation.warnings.length},null,2));
