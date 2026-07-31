import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
import {validateGameContent} from '../src/data/content-schema.js';
const root=fileURLToPath(new URL('..',import.meta.url));
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const content={cases:read('data/core-cases.json'),gameplay:read('data/gameplay.json'),queue:read('data/queue.json'),specialties:read('data/specialties.json'),missions:read('data/missions.json'),responses:read('data/clinical-responses.json'),governance:read('data/governance.json'),academy:read('data/academy.json'),physiology:read('data/physiology.json'),assessment:read('data/assessment.json'),therapeutics:read('data/therapeutics.json'),emergency:read('data/emergency.json'),outpatient:read('data/outpatient.json'),branching:read('data/branching.json'),career:read('data/career.json')};
const result=validateGameContent(content);
if(!result.ok){console.error(result);process.exit(1);} 
console.log(JSON.stringify({ok:true,cases:content.cases.length,specialties:content.specialties.specialties.length,missions:content.missions.missions.length,governanceCases:Object.keys(content.governance.cases).length,academyModules:content.academy.modules.length,physiologyProfiles:content.physiology.profiles.length,assessmentProfiles:content.assessment.cases.length,therapeuticsProfiles:content.therapeutics.patientProfiles.length,emergencyScenarios:content.emergency.scenarios.length,outpatientPrograms:content.outpatient.programs.length,branchingProfiles:content.branching.cases.length,difficulties:content.branching.difficulties.length,careerStages:content.career.stages.length,careerDepartments:content.career.departments.length,warnings:result.warnings},null,2));
