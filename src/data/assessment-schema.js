const LOCALES=['pt-BR','en','es'];
const text=value=>typeof value==='string'&&value.trim().length>0;
const localized=value=>value&&typeof value==='object'&&LOCALES.every(locale=>text(value[locale]));

export function validateAssessmentRegistry(registry,cases=[]){
  const errors=[];const warnings=[];
  if(!registry||typeof registry!=='object')return{ok:false,errors:['Registro de anamnese/exame físico ausente.'],warnings};
  if(Number(registry.schemaVersion)!==1)errors.push('Assessment schemaVersion deve ser 1.');
  if(!registry.policy||registry.policy.publishable!==false)errors.push('Conteúdo de avaliação deve permanecer não publicável até validação clínica.');
  const caseIds=new Set((cases||[]).map(item=>item.id));
  const profiles=Array.isArray(registry.cases)?registry.cases:[];
  if(!profiles.length)errors.push('Nenhum perfil de avaliação clínica foi fornecido.');
  const seenCases=new Set();
  for(const profile of profiles){
    if(!text(profile.caseId)){errors.push('Perfil de avaliação sem caseId.');continue;}
    if(seenCases.has(profile.caseId))errors.push(`Perfil duplicado: ${profile.caseId}`);seenCases.add(profile.caseId);
    if(caseIds.size&&!caseIds.has(profile.caseId))warnings.push(`Perfil sem caso ativo correspondente: ${profile.caseId}`);
    for(const bucket of ['interview','physicalExam']){
      const items=profile[bucket];
      if(!Array.isArray(items)||items.length<3){errors.push(`${profile.caseId}: ${bucket} precisa de ao menos 3 itens.`);continue;}
      const ids=new Set();
      for(const item of items){
        if(!text(item.id))errors.push(`${profile.caseId}/${bucket}: item sem id.`);
        else if(ids.has(item.id))errors.push(`${profile.caseId}/${bucket}: id duplicado ${item.id}.`);else ids.add(item.id);
        if(!text(item.legacyValue))errors.push(`${profile.caseId}/${bucket}/${item.id}: legacyValue ausente.`);
        if(!localized(item.label))errors.push(`${profile.caseId}/${bucket}/${item.id}: label trilíngue incompleto.`);
        const result=bucket==='interview'?item.response:item.finding;
        if(!localized(result))errors.push(`${profile.caseId}/${bucket}/${item.id}: resultado trilíngue incompleto.`);
        if(!localized(item.rationale))errors.push(`${profile.caseId}/${bucket}/${item.id}: rationale trilíngue incompleto.`);
      }
    }
  }
  for(const caseId of caseIds)if(!seenCases.has(caseId))errors.push(`Caso ativo sem perfil de avaliação: ${caseId}`);
  return{ok:errors.length===0,errors,warnings,profileCount:profiles.length};
}

export function assessmentForCase(registry,caseId){return (registry?.cases||[]).find(item=>item.caseId===caseId)||null;}
export function localizeAssessment(item,locale='pt-BR'){
  const pick=value=>value?.[locale]||value?.['pt-BR']||'';
  return{...item,label:pick(item?.label),response:pick(item?.response),finding:pick(item?.finding),rationale:pick(item?.rationale)};
}
