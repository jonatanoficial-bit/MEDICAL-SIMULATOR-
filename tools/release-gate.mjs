import fs from 'node:fs';
import path from 'node:path';
import {evaluateReleaseGate} from '../src/data/clinical-governance.js';
import {validatePhysiologyRegistry} from '../src/simulation/physiology-engine.js';
import {validateAssessmentRegistry} from '../src/data/assessment-schema.js';
import {validateTherapeuticsRegistry} from '../src/simulation/therapeutics-engine.js';
import {validateEmergencyRegistry} from '../src/simulation/emergency-engine.js';
import {validateOutpatientRegistry} from '../src/simulation/outpatient-engine.js';
import {validateBranchingRegistry} from '../src/simulation/branching-engine.js';
import {validateCareerRegistry} from '../src/simulation/career-engine.js';

const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const cases=read('data/core-cases.json');
const governance=read('data/governance.json');
const academy=read('data/academy.json');
const physiology=read('data/physiology.json');
const assessment=read('data/assessment.json');
const therapeutics=read('data/therapeutics.json');
const emergency=read('data/emergency.json');
const outpatient=read('data/outpatient.json');
const branching=read('data/branching.json');
const career=read('data/career.json');
const beta=read('data/beta-program.json');
const gate=evaluateReleaseGate({...governance,releaseChannel:'release'},cases);
const physiologyValidation=validatePhysiologyRegistry(physiology,cases.map(item=>item.id));
const physiologyReady=physiologyValidation.ok&&physiology.publishable===true;
const assessmentValidation=validateAssessmentRegistry(assessment,cases);
const assessmentReady=assessmentValidation.ok&&assessment.policy?.publishable===true;
const therapeuticsValidation=validateTherapeuticsRegistry(therapeutics,cases.map(item=>item.id));
const therapeuticsReady=therapeuticsValidation.ok&&therapeutics.policy?.publishable===true;
const emergencyValidation=validateEmergencyRegistry(emergency);
const emergencyReady=emergencyValidation.ok&&emergency.publishable===true;
const outpatientValidation=validateOutpatientRegistry(outpatient);
const outpatientReady=outpatientValidation.ok&&outpatient.publishable===true;
const branchingValidation=validateBranchingRegistry(branching,cases.map(item=>item.id));
const branchingReady=branchingValidation.ok&&branching.policy?.publishable===true;
const careerValidation=validateCareerRegistry(career);
const careerReady=careerValidation.ok&&career.publishable===true;
const betaRegistryValid=beta.schemaVersion===1&&beta.contentVersion==='1.0.0'&&beta.channel==='closed-beta'&&beta.localOnly===true&&beta.telemetryDefault===false;
const betaRequiredDevices=(beta.deviceMatrix||[]).filter(item=>item.required);
const betaPhysicalComplete=betaRequiredDevices.length>0&&betaRequiredDevices.every(item=>item.status==='passed');
const releaseReady=gate.ready&&academy.publishable===true&&physiologyReady&&assessmentReady&&therapeuticsReady&&emergencyReady&&outpatientReady&&branchingReady&&careerReady;
const releaseCandidateReady=releaseReady&&betaRegistryValid&&betaPhysicalComplete;
const report={
  product:'Medical Simulator - Vale Edition',
  build:read('BUILD.json').build_label,
  checkedAt:new Date().toISOString(),
  releaseReady,
  releaseCandidateReady,
  approved:gate.approvedCount,
  total:gate.total,
  cases:gate.items,
  academy:{
    publishable:academy.publishable,
    status:academy.status,
    modules:academy.modules.length,
    blocker:'independent clinical and terminology review pending'
  },
  physiology:{
    publishable:physiology.publishable,
    status:physiology.status,
    engineVersion:physiology.engineVersion,
    profiles:physiology.profiles.length,
    registryValid:physiologyValidation.ok,
    validationErrors:physiologyValidation.errors,
    blocker:'independent clinical, terminology, and simulation-safety validation pending'
  },
  therapeutics:{publishable:therapeutics.policy?.publishable===true,status:therapeutics.policy?.status||'unknown',schemaVersion:therapeutics.schemaVersion,examDefinitions:therapeutics.examCatalog.length,interventions:therapeutics.interventions.length,profiles:therapeutics.patientProfiles.length,registryValid:therapeuticsValidation.ok,validationErrors:therapeuticsValidation.errors,blocker:'independent clinical, pharmacy, terminology, and medication-safety validation pending'},
  emergency:{publishable:emergency.publishable===true,status:emergency.status,scenarios:emergency.scenarios.length,actions:emergency.actions.length,registryValid:emergencyValidation.ok,validationErrors:emergencyValidation.errors,blocker:'independent emergency-medicine, resuscitation, pharmacy, terminology, and simulation-safety review pending'},
  branching:{publishable:branching.policy?.publishable===true,status:branching.policy?.status||'unknown',profiles:branching.cases.length,difficulties:branching.difficulties.length,clues:branching.cases.reduce((sum,item)=>sum+item.clues.length,0),outcomes:branching.outcomes.length,registryValid:branchingValidation.ok,validationErrors:branchingValidation.errors,blocker:'independent clinical, terminology, branching-logic, and simulation-safety review pending'},
  career:{publishable:career.publishable===true,status:career.status,stages:career.stages.length,departments:career.departments.length,exams:career.exams.length,calendarEvents:career.calendar.length,missions:career.missions.length,registryValid:careerValidation.ok,validationErrors:careerValidation.errors,blocker:'fictional career, progression, economy, accessibility, and retention validation pending'},
  beta:{schemaVersion:beta.schemaVersion,channel:beta.channel,registryValid:betaRegistryValid,localOnly:beta.localOnly,telemetryDefault:beta.telemetryDefault,requiredDevices:betaRequiredDevices.length,physicalDevicesPassed:betaRequiredDevices.filter(item=>item.status==='passed').length,physicalMatrixComplete:betaPhysicalComplete,blocker:'physical-device, HTTPS PWA, offline, screen-reader, and independent medical validation pending'},
  outpatient:{publishable:outpatient.publishable===true,status:outpatient.status,programs:outpatient.programs.length,actions:outpatient.actions.length,registryValid:outpatientValidation.ok,validationErrors:outpatientValidation.errors,blocker:'independent primary-care, chronic-care, terminology, equity, and simulation-safety review pending'},
  assessment:{
    publishable:assessment.policy?.publishable===true,
    status:assessment.policy?.status||'unknown',
    schemaVersion:assessment.schemaVersion,
    profiles:assessment.cases.length,
    interviewItems:assessment.cases.reduce((sum,item)=>sum+item.interview.length,0),
    physicalExamItems:assessment.cases.reduce((sum,item)=>sum+item.physicalExam.length,0),
    registryValid:assessmentValidation.ok,
    validationErrors:assessmentValidation.errors,
    blocker:'independent clinical, terminology, communication, and physical-examination safety validation pending'
  }
};
fs.writeFileSync(path.join(root,'docs','release-gate-v1.0.0.json'),JSON.stringify(report,null,2)+'\n');
if(!releaseReady){
  console.error(`PUBLICAÇÃO CLÍNICA BLOQUEADA: ${gate.blockedCount}/${gate.total} casos possuem pendências.`);
  for(const item of gate.items)if(!item.approved)console.error(`- ${item.caseId}: ${item.blockers.join(', ')}`);
  if(academy.publishable!==true)console.error(`- Academia: publicação bloqueada; ${academy.modules.length} módulos em revisão independente.`);
  if(!physiologyValidation.ok)console.error(`- Fisiologia: registro inválido; ${physiologyValidation.errors.join(' | ')}`);
  if(physiology.publishable!==true)console.error(`- Fisiologia: publicação bloqueada; ${physiology.profiles.length} perfis aguardam validação clínica e de segurança independente.`);
  if(!emergencyValidation.ok)console.error(`- Emergência: registro inválido; ${emergencyValidation.errors.join(' | ')}`);
  if(emergency.publishable!==true)console.error(`- Emergência: publicação bloqueada; ${emergency.scenarios.length} cenários ABCDE aguardam validação independente.`);
  if(!branchingValidation.ok)console.error(`- Ramificações: registro inválido; ${branchingValidation.errors.join(' | ')}`);
  if(branching.policy?.publishable!==true)console.error(`- Ramificações: publicação bloqueada; ${branching.cases.length} perfis e ${branching.difficulties.length} níveis aguardam validação independente.`);
  if(!careerValidation.ok)console.error(`- Carreira: registro inválido; ${careerValidation.errors.join(' | ')}`);
  if(career.publishable!==true)console.error(`- Carreira: publicação bloqueada; ${career.stages.length} estágios, ${career.exams.length} provas e ${career.departments.length} setores aguardam validação independente.`);
  if(!betaRegistryValid)console.error('- Beta: registro do programa beta inválido.');
  if(!betaPhysicalComplete)console.error(`- Beta: matriz física pendente; ${betaRequiredDevices.filter(item=>item.status==='passed').length}/${betaRequiredDevices.length} aparelhos obrigatórios aprovados.`);
  if(!outpatientValidation.ok)console.error(`- Ambulatório: registro inválido; ${outpatientValidation.errors.join(' | ')}`);
  if(outpatient.publishable!==true)console.error(`- Ambulatório: publicação bloqueada; ${outpatient.programs.length} linhas de cuidado aguardam validação independente.`);
  if(!assessmentValidation.ok)console.error(`- Avaliação clínica: registro inválido; ${assessmentValidation.errors.join(' | ')}`);
  if(assessment.policy?.publishable!==true)console.error(`- Avaliação clínica: publicação bloqueada; ${assessment.cases.length} perfis aguardam validação clínica, terminológica e de segurança independente.`);
  if(!therapeuticsValidation.ok)console.error(`- Terapêutica: registro inválido; ${therapeuticsValidation.errors.join(' | ')}`);
  if(therapeutics.policy?.publishable!==true)console.error(`- Terapêutica: publicação bloqueada; exames, medicamentos e procedimentos aguardam validação clínica, farmacêutica e de segurança independente.`);
  process.exit(2);
}
console.log('Release Candidate gate aprovado.');
