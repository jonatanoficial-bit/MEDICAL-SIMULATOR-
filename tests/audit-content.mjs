import fs from 'node:fs';
import path from 'node:path';
import {validateGameContent} from '../src/data/content-schema.js';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const read=file=>JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const content={cases:read('data/core-cases.json'),gameplay:read('data/gameplay.json'),queue:read('data/queue.json'),specialties:read('data/specialties.json'),missions:read('data/missions.json'),responses:read('data/clinical-responses.json')};
const result=validateGameContent(content);
if(!result.ok){console.error(result);process.exit(1);} 
console.log(JSON.stringify({ok:true,cases:content.cases.length,specialties:content.specialties.specialties.length,missions:content.missions.missions.length,warnings:result.warnings},null,2));
