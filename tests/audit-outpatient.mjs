import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import {validateOutpatientRegistry,createOutpatientSession,performOutpatientAction,closeOutpatientVisit,missOutpatientVisit,outpatientProgress} from '../src/simulation/outpatient-engine.js';
const root=fileURLToPath(new URL('..',import.meta.url));
const registry=JSON.parse(fs.readFileSync(path.join(root,'data/outpatient.json'),'utf8'));
const validation=validateOutpatientRegistry(registry);
const governance=JSON.parse(fs.readFileSync(path.join(root,'data/governance.json'),'utf8'));const sourceIds=new Set(governance.sources.map(item=>item.id));
if(!validation.ok)throw new Error(validation.errors.join(' | '));
if(registry.programs.length!==10)throw new Error('Esperadas 10 linhas de cuidado.');
if(registry.actions.length<15)throw new Error('Catálogo ambulatorial incompleto.');
for(const program of registry.programs){
  for(const sourceId of program.sourceIds)if(!sourceIds.has(sourceId))throw new Error(`${program.id}: fonte não registrada ${sourceId}.`);
  let session=createOutpatientSession(program);
  const initial=JSON.stringify(session);
  for(let visit=1;visit<=program.totalVisits;visit++){
    const chosen=[...new Set([...program.requiredActions,...program.helpfulActions])].slice(0,7);
    for(const actionId of chosen){const result=performOutpatientAction(session,registry,program,actionId);if(!result.ok)throw new Error(`${program.id}: ${result.error}`);}
    const result=closeOutpatientVisit(session,program,{force:true});if(!result.ok)throw new Error(`${program.id}: falha ao encerrar retorno.`);
  }
  if(session.status!=='completed')throw new Error(`${program.id}: seguimento não foi concluído.`);
  const progress=outpatientProgress(session,program);if(progress.totalGoals<2)throw new Error(`${program.id}: metas insuficientes.`);
  const replay=createOutpatientSession(program);if(JSON.stringify(replay)!==initial)throw new Error(`${program.id}: sessão inicial não determinística.`);
  const missed=createOutpatientSession(program);const before=missed.risk;missOutpatientVisit(missed,program);if(missed.risk<=before)throw new Error(`${program.id}: falta não aumentou risco.`);
}
console.log(JSON.stringify({ok:true,programs:registry.programs.length,actions:registry.actions.length,deterministic:true,publishable:registry.publishable},null,2));
