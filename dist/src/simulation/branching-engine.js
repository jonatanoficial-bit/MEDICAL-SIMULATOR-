const nonEmpty=value=>typeof value==='string'&&value.trim().length>0;
const localized=(value,locale='pt-BR')=>value&&typeof value==='object'?(value[locale]||value['pt-BR']||Object.values(value)[0]||''):String(value??'');
export function validateBranchingRegistry(registry,caseIds=[]){
 const errors=[],warnings=[];if(!registry||typeof registry!=='object')return{ok:false,errors:['Registro de ramificações ausente.'],warnings};
 if(!Array.isArray(registry.difficulties)||registry.difficulties.length!==4)errors.push('São necessários quatro níveis de dificuldade.');
 const ids=new Set((registry.difficulties||[]).map(x=>x.id));for(const id of ['beginner','student','professional','challenge'])if(!ids.has(id))errors.push(`Dificuldade ausente: ${id}.`);
 if(!Array.isArray(registry.cases))errors.push('Perfis ramificados ausentes.');
 for(const caseId of caseIds){const p=(registry.cases||[]).find(x=>x.caseId===caseId);if(!p){errors.push(`Perfil ramificado ausente: ${caseId}.`);continue;}if(!nonEmpty(p.referenceDiagnosis))errors.push(`Diagnóstico de referência ausente: ${caseId}.`);if(!Array.isArray(p.differentials)||p.differentials.length<3)errors.push(`Diferenciais insuficientes: ${caseId}.`);if(!p.differentials.includes(p.referenceDiagnosis))errors.push(`Diagnóstico fora dos diferenciais: ${caseId}.`);if(!Array.isArray(p.clues)||p.clues.length<2)errors.push(`Pistas insuficientes: ${caseId}.`);}
 if(registry.policy?.publishable!==false)warnings.push('Registro ramificado não está explicitamente bloqueado para publicação.');
 return{ok:errors.length===0,errors:[...new Set(errors)],warnings:[...new Set(warnings)]};
}
export const branchingProfileForCase=(registry,caseId)=>(registry?.cases||[]).find(x=>x.caseId===caseId)||null;
export const difficultyDefinition=(registry,id='student')=>(registry?.difficulties||[]).find(x=>x.id===id)||(registry?.difficulties||[]).find(x=>x.id==='student')||null;
export const localizeBranching=(value,locale='pt-BR')=>localized(value,locale);
export function createBranchingSession(caseId,difficulty='student',registry,previous=null){
 const def=difficultyDefinition(registry,difficulty),profile=branchingProfileForCase(registry,caseId);const valid=previous&&previous.caseId===caseId&&previous.difficulty===def?.id;
 const base=valid?structuredClone(previous):{caseId,difficulty:def?.id||'student',evidence:[],unlockedClueIds:[],outcome:null,scoreModifier:0,startedAt:new Date().toISOString()};
 const initial=(profile?.clues||[]).slice(0,Math.max(0,Number(def?.initialClues||0))).map(x=>x.id);base.unlockedClueIds=[...new Set([...(base.unlockedClueIds||[]),...initial])];base.evidence=Array.isArray(base.evidence)?base.evidence:[];return base;
}
export function registerBranchEvidence(session,registry,event){
 const profile=branchingProfileForCase(registry,session?.caseId);if(!session||!profile||!event)return{unlocked:[],session};const key=`${event.type}:${event.value}`;
 if(!session.evidence.some(x=>x.key===key))session.evidence.push({key,type:event.type,value:event.value,at:event.at||new Date().toISOString()});
 const unlocked=[];for(const clue of profile.clues||[]){const t=clue.trigger||{};if(t.type===event.type&&t.value===event.value&&!session.unlockedClueIds.includes(clue.id)){session.unlockedClueIds.push(clue.id);unlocked.push(clue.id);}}
 return{unlocked,session};
}
export function visibleBranchClues(session,registry){const profile=branchingProfileForCase(registry,session?.caseId);return(profile?.clues||[]).filter(x=>(session?.unlockedClueIds||[]).includes(x.id));}
export function hypothesisLimit(registry,difficulty){return Math.max(1,Number(difficultyDefinition(registry,difficulty)?.maxHypotheses||3));}
export function difficultyMultiplier(registry,difficulty,key='scoreMultiplier'){return Number(difficultyDefinition(registry,difficulty)?.[key]||1);}
export function evaluateBranchOutcome(session,registry,{hypotheses=[],conduct=[],idealConduct=[],score=0,physiologyStatus='stable',incidents=0,assessmentIds=[]}={}){
 const profile=branchingProfileForCase(registry,session?.caseId),def=difficultyDefinition(registry,session?.difficulty);if(!profile)return{id:'unresolved-risk',quality:0,correctDiagnosis:false,evidenceRatio:0,conductRatio:0,missingEssential:[]};
 const correctDiagnosis=hypotheses.includes(profile.referenceDiagnosis),conductRatio=idealConduct.length?idealConduct.filter(x=>conduct.includes(x)).length/idealConduct.length:1;
 const evidenceSet=new Set(assessmentIds);const essentials=profile.essentialEvidenceIds||[],missingEssential=essentials.filter(x=>!evidenceSet.has(x));const evidenceRatio=essentials.length?(essentials.length-missingEssential.length)/essentials.length:1;
 let id='follow-up-required';if(!correctDiagnosis||incidents>0)id='unsafe-closure';else if(['unstable','critical'].includes(physiologyStatus)||evidenceRatio<Number(def?.requiredEvidenceRatio||.5))id='unresolved-risk';else if(conductRatio>=.66&&score>=70)id='safe-resolution';
 const quality=Math.max(0,Math.min(100,Math.round((correctDiagnosis?38:0)+conductRatio*27+evidenceRatio*25+(incidents?0:10))));const outcome=(registry.outcomes||[]).find(x=>x.id===id)||{id};session.outcome={id,quality,correctDiagnosis,evidenceRatio,conductRatio,missingEssential,at:new Date().toISOString()};return{...session.outcome,label:outcome.label,description:outcome.description};
}
