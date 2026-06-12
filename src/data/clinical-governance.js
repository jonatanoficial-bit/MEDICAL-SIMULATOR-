const nonEmpty=value=>typeof value==='string'&&value.trim().length>0;
const asArray=value=>Array.isArray(value)?value:[];
const validDate=value=>nonEmpty(value)&&Number.isFinite(Date.parse(value));
const addMonths=(date,months)=>{const result=new Date(date);result.setUTCMonth(result.getUTCMonth()+Number(months||0));return result;};

export const GOVERNANCE_STATUSES=Object.freeze({
  DRAFT:'draft',
  REFERENCE_MAPPED:'reference-mapped',
  CLINICAL_REVIEW:'clinical-review',
  CLINICALLY_APPROVED:'clinically-approved',
  SUSPENDED:'suspended',
  RETIRED:'retired'
});

export const GOVERNANCE_STATUS_LABELS=Object.freeze({
  draft:'Rascunho',
  'reference-mapped':'Fontes mapeadas',
  'clinical-review':'Em revisão clínica',
  'clinically-approved':'Aprovado clinicamente',
  suspended:'Suspenso',
  retired:'Retirado'
});

export function governanceStatusLabel(status){
  return GOVERNANCE_STATUS_LABELS[status]||String(status||'Não informado');
}

export function validateGovernance(governance,cases=[]){
  const errors=[];const warnings=[];
  if(!governance||typeof governance!=='object')return {ok:false,errors:['Registro de governança médica ausente.'],warnings};
  if(Number(governance.schemaVersion)!==1)errors.push('Schema de governança médica incompatível.');
  if(!nonEmpty(governance.contentVersion))errors.push('Versão do registro de governança ausente.');
  if(!['development','staging','release'].includes(governance.releaseChannel))errors.push('Canal de publicação da governança inválido.');
  if(!governance.policy||typeof governance.policy!=='object')errors.push('Política de publicação médica ausente.');
  const sources=asArray(governance.sources);
  const sourceIds=new Set();
  for(const source of sources){
    if(!source||typeof source!=='object'){errors.push('Fonte médica com formato inválido.');continue;}
    for(const field of ['id','title','organization','region','type','url','status'])if(!nonEmpty(source[field]))errors.push(`Fonte médica sem ${field}.`);
    if(sourceIds.has(source.id))errors.push(`Fonte médica duplicada: ${source.id}.`);else sourceIds.add(source.id);
    if(!Number.isFinite(Number(source.year)))errors.push(`Ano inválido na fonte ${source.id||'desconhecida'}.`);
    if(nonEmpty(source.url)&&!/^https:\/\//i.test(source.url))errors.push(`URL não segura na fonte ${source.id}.`);
    if(source.status!=='active')warnings.push(`Fonte ${source.id} não está marcada como ativa.`);
    if(!validDate(source.accessedAt))errors.push(`Data de verificação inválida na fonte ${source.id}.`);
    else if(governance.policy?.sourceFreshnessCheckRequired){
      const due=addMonths(source.accessedAt,governance.policy?.reviewIntervalMonths||12);
      if(due.getTime()<Date.now())warnings.push(`Fonte ${source.id} precisa de nova verificação de vigência.`);
    }
  }
  const records=governance.cases&&typeof governance.cases==='object'?governance.cases:{};
  const approved=new Set(governance.policy?.approvedStatuses||[GOVERNANCE_STATUSES.CLINICALLY_APPROVED]);
  const playable=new Set(governance.policy?.developmentPlayableStatuses||[GOVERNANCE_STATUSES.REFERENCE_MAPPED,GOVERNANCE_STATUSES.CLINICAL_REVIEW,GOVERNANCE_STATUSES.CLINICALLY_APPROVED]);
  for(const clinicalCase of asArray(cases)){
    const record=records[clinicalCase.id];
    if(!record||typeof record!=='object'){errors.push(`Caso ${clinicalCase.id} sem registro de governança.`);continue;}
    if(record.caseId!==clinicalCase.id)errors.push(`Registro de governança aponta para ID divergente: ${clinicalCase.id}.`);
    if(!nonEmpty(record.status))errors.push(`Status de governança ausente em ${clinicalCase.id}.`);
    if(!nonEmpty(record.region))errors.push(`Região de referência ausente em ${clinicalCase.id}.`);
    if(!Array.isArray(record.sourceIds)||record.sourceIds.length===0)errors.push(`Caso ${clinicalCase.id} sem fonte médica vinculada.`);
    for(const sourceId of record.sourceIds||[])if(!sourceIds.has(sourceId))errors.push(`Caso ${clinicalCase.id} aponta para fonte inexistente: ${sourceId}.`);
    if(governance.releaseChannel==='release'&&!approved.has(record.status))errors.push(`Publicação bloqueada: ${clinicalCase.id} não está clinicamente aprovado.`);
    if(governance.releaseChannel!=='release'&&!playable.has(record.status))warnings.push(`Caso ${clinicalCase.id} não está em status jogável no canal de desenvolvimento.`);
    if(!approved.has(record.status))warnings.push(`Caso ${clinicalCase.id} permanece somente para desenvolvimento: ${governanceStatusLabel(record.status)}.`);
    if(record.publishable===true&&!approved.has(record.status))errors.push(`Caso ${clinicalCase.id} marcou publishable=true sem aprovação clínica.`);
    if(record.publishable!==true&&approved.has(record.status))warnings.push(`Caso ${clinicalCase.id} está aprovado, mas publishable ainda está desativado.`);
  }
  for(const caseId of Object.keys(records))if(!asArray(cases).some(item=>item.id===caseId))warnings.push(`Registro de governança sem caso ativo: ${caseId}.`);
  return {ok:errors.length===0,errors:[...new Set(errors)],warnings:[...new Set(warnings)]};
}

export function getCaseGovernance(governance,caseId){
  return governance?.cases?.[caseId]||null;
}

export function isCasePlayable(governance,caseId){
  const record=getCaseGovernance(governance,caseId);
  if(!record)return false;
  const approved=new Set(governance?.policy?.approvedStatuses||[GOVERNANCE_STATUSES.CLINICALLY_APPROVED]);
  if(governance?.releaseChannel==='release')return approved.has(record.status)&&record.publishable===true;
  const playable=new Set(governance?.policy?.developmentPlayableStatuses||[GOVERNANCE_STATUSES.REFERENCE_MAPPED,GOVERNANCE_STATUSES.CLINICAL_REVIEW,GOVERNANCE_STATUSES.CLINICALLY_APPROVED]);
  return playable.has(record.status);
}

export function evaluateReleaseGate(governance,cases=[]){
  const validation=validateGovernance(governance,cases);
  const approvedStatuses=new Set(governance?.policy?.approvedStatuses||[GOVERNANCE_STATUSES.CLINICALLY_APPROVED]);
  const sourceById=new Map(asArray(governance?.sources).map(source=>[source.id,source]));
  const freshnessMonths=governance?.policy?.reviewIntervalMonths||12;
  const items=asArray(cases).map(item=>{
    const record=getCaseGovernance(governance,item.id);
    const linkedSources=asArray(record?.sourceIds).map(id=>sourceById.get(id)).filter(Boolean);
    const sourcesFresh=linkedSources.length>0&&linkedSources.every(source=>source.status==='active'&&validDate(source.accessedAt)&&addMonths(source.accessedAt,freshnessMonths).getTime()>=Date.now());
    const reviewDatesComplete=Boolean(validDate(record?.review?.clinicalReviewedAt)&&validDate(record?.review?.translationReviewedAt)&&validDate(record?.review?.qaReviewedAt)&&validDate(record?.review?.nextReviewAt));
    const reviewCurrent=reviewDatesComplete&&Date.parse(record.review.nextReviewAt)>=Date.now();
    const approved=Boolean(record&&approvedStatuses.has(record.status)&&record.publishable===true&&record.reviewers?.clinicalOwner&&record.reviewers?.medicalReviewer&&record.reviewers?.qaReviewer&&record.reviewers?.translationReviewers?.['pt-BR']&&record.reviewers?.translationReviewers?.en&&record.reviewers?.translationReviewers?.es&&reviewDatesComplete&&reviewCurrent&&sourcesFresh);
    const blockers=[];
    if(!record)blockers.push('registro ausente');
    else{
      if(!approvedStatuses.has(record.status))blockers.push('aprovação clínica pendente');
      if(record.publishable!==true)blockers.push('publicação desativada');
      if(!record.reviewers?.clinicalOwner)blockers.push('responsável clínico ausente');
      if(!record.reviewers?.medicalReviewer)blockers.push('revisor médico ausente');
      if(!record.reviewers?.qaReviewer)blockers.push('auditoria de segurança pendente');
      if(!record.reviewers?.translationReviewers?.['pt-BR']||!record.reviewers?.translationReviewers?.en||!record.reviewers?.translationReviewers?.es)blockers.push('revisão trilíngue pendente');
      if(!validDate(record.review?.clinicalReviewedAt))blockers.push('data de revisão clínica ausente');
      if(!validDate(record.review?.translationReviewedAt))blockers.push('data de revisão trilíngue ausente');
      if(!validDate(record.review?.qaReviewedAt))blockers.push('data de QA ausente');
      if(!validDate(record.review?.nextReviewAt))blockers.push('próxima revisão não agendada');
      else if(Date.parse(record.review.nextReviewAt)<Date.now())blockers.push('revisão clínica vencida');
      if(linkedSources.length===0)blockers.push('fonte vinculada ausente');
      else if(!sourcesFresh)blockers.push('fonte inativa ou verificação de vigência vencida');
    }
    return {caseId:item.id,status:record?.status||'missing',approved,sourceIds:asArray(record?.sourceIds),sourcesFresh,reviewCurrent,blockers};
  });
  const approvedCount=items.filter(item=>item.approved).length;
  const ready=validation.ok&&approvedCount===items.length&&items.length>0;
  return {ready,channel:governance?.releaseChannel||'unknown',approvedCount,total:items.length,blockedCount:items.length-approvedCount,items,validation};
}

export function buildGovernanceSummary(governance,cases=[]){
  const gate=evaluateReleaseGate(governance,cases);
  const statusCounts={};
  for(const item of gate.items)statusCounts[item.status]=(statusCounts[item.status]||0)+1;
  return {
    ...gate,
    sourceCount:asArray(governance?.sources).length,
    activeSourceCount:asArray(governance?.sources).filter(source=>source.status==='active').length,
    statusCounts,
    disclaimer:governance?.policy?.disclaimer||{},
    contentVersion:governance?.contentVersion||'unknown'
  };
}

export function getGovernanceSourcesForCase(governance,caseId){
  const record=getCaseGovernance(governance,caseId);
  const wanted=new Set(record?.sourceIds||[]);
  return asArray(governance?.sources).filter(source=>wanted.has(source.id));
}
