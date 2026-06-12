import fs from 'node:fs';
import path from 'node:path';
import {evaluateReleaseGate} from '../src/data/clinical-governance.js';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const cases=read('data/core-cases.json');
const governance=read('data/governance.json');
const academy=read('data/academy.json');
const gate=evaluateReleaseGate({...governance,releaseChannel:'release'},cases);
const report={product:'Medical Simulator - Vale Edition',build:read('BUILD.json').build_label,checkedAt:new Date().toISOString(),releaseReady:gate.ready&&academy.publishable===true,approved:gate.approvedCount,total:gate.total,cases:gate.items,academy:{publishable:academy.publishable,status:academy.status,modules:academy.modules.length,blocker:'independent clinical and terminology review pending'}};
fs.writeFileSync(path.join(root,'docs','release-gate-v0.18.0.json'),JSON.stringify(report,null,2)+'\n');
if(!gate.ready||academy.publishable!==true){
  console.error(`PUBLICAÇÃO CLÍNICA BLOQUEADA: ${gate.blockedCount}/${gate.total} casos possuem pendências.`);
  for(const item of gate.items)if(!item.approved)console.error(`- ${item.caseId}: ${item.blockers.join(', ')}`);
  if(academy.publishable!==true)console.error(`- Academia: publicação bloqueada; ${academy.modules.length} módulos em revisão independente.`);
  process.exit(2);
}
console.log('Release gate aprovado.');
