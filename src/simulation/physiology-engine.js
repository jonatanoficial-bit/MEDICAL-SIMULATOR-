const clamp=(value,min,max)=>Math.max(min,Math.min(max,Number(value)||0));
const round=(value,digits=0)=>{const factor=10**digits;return Math.round((Number(value)||0)*factor)/factor;};
const clone=value=>typeof structuredClone==='function'?structuredClone(value):JSON.parse(JSON.stringify(value));
const actionKey=(type,value)=>`${type}:${String(value)}`;

export function validatePhysiologyRegistry(registry,caseIds=[]){
  const errors=[];const warnings=[];
  if(!registry||typeof registry!=='object')return{ok:false,errors:['Registro fisiológico ausente.'],warnings};
  if(Number(registry.schemaVersion)!==1)errors.push('Schema fisiológico incompatível.');
  if(!Array.isArray(registry.profiles)||!registry.profiles.length)errors.push('Perfis fisiológicos ausentes.');
  const ids=new Set();
  for(const profile of registry.profiles||[]){
    if(!profile?.caseId){errors.push('Perfil sem caseId.');continue;}
    if(ids.has(profile.caseId))errors.push(`Perfil fisiológico duplicado: ${profile.caseId}.`);ids.add(profile.caseId);
    for(const field of ['baseline','naturalCourse','thresholds','actionEffects','outcomeRules'])if(!profile[field]||typeof profile[field]!=='object')errors.push(`Perfil ${profile.caseId} sem ${field}.`);
    for(const vital of ['systolic','diastolic','heartRate','respiratoryRate','temperature','spo2','symptomSeverity','stabilityReserve'])if(!Number.isFinite(Number(profile.baseline?.[vital])))errors.push(`Perfil ${profile.caseId} com ${vital} inválido.`);
  }
  for(const id of caseIds)if(!ids.has(id))errors.push(`Caso sem perfil fisiológico: ${id}.`);
  for(const id of ids)if(caseIds.length&&!caseIds.includes(id))warnings.push(`Perfil fisiológico sem caso ativo: ${id}.`);
  return{ok:errors.length===0,errors:[...new Set(errors)],warnings:[...new Set(warnings)]};
}

export function profileForCase(registry,caseId){return registry?.profiles?.find(item=>item.caseId===caseId)||null;}

function normalizeCurrent(current,baseline){
  const source={...baseline,...(current||{})};
  return{
    systolic:clamp(source.systolic,60,240),diastolic:clamp(source.diastolic,30,150),heartRate:clamp(source.heartRate,30,220),
    respiratoryRate:clamp(source.respiratoryRate,6,50),temperature:clamp(source.temperature,32,42),spo2:clamp(source.spo2,70,100),
    symptomSeverity:clamp(source.symptomSeverity,0,100),stabilityReserve:clamp(source.stabilityReserve,0,100)
  };
}

export function createPhysiologySession(caseData,profile,previous=null,now=Date.now()){
  if(!caseData||!profile)throw new Error('Caso ou perfil fisiológico ausente.');
  if(previous?.caseId===caseData.id){
    const restored=clone(previous);restored.current=normalizeCurrent(restored.current,profile.baseline);restored.baseline=normalizeCurrent(restored.baseline,profile.baseline);
    restored.schemaVersion=1;restored.lastRealTickAt=Number(restored.lastRealTickAt)||now;restored.appliedActions=restored.appliedActions||{};restored.activeEffects=restored.activeEffects||[];restored.alerts=restored.alerts||[];restored.trend=Array.isArray(restored.trend)?restored.trend:[];restored.outcome=restored.outcome||'under-care';restored.status=restored.status||'stable';return restored;
  }
  const current=normalizeCurrent(profile.baseline,profile.baseline);
  const session={schemaVersion:1,caseId:caseData.id,startedAt:new Date(now).toISOString(),lastRealTickAt:now,elapsedMinutes:0,lastAutosaveMinute:0,current,baseline:clone(current),status:'stable',outcome:'under-care',urgency:profile.urgency||'low',paused:false,appliedActions:{},activeEffects:[],alerts:[],trend:[]};
  session.trend.push(snapshot(session,'baseline','Avaliação inicial'));
  return session;
}

function snapshot(session,reason='tick',label='Evolução clínica'){
  const c=session.current;
  return{minute:round(session.elapsedMinutes,1),reason,label,status:session.status,outcome:session.outcome,systolic:round(c.systolic),diastolic:round(c.diastolic),heartRate:round(c.heartRate),respiratoryRate:round(c.respiratoryRate),temperature:round(c.temperature,1),spo2:round(c.spo2),symptomSeverity:round(c.symptomSeverity),stabilityReserve:round(c.stabilityReserve)};
}

function applyDelta(current,delta={},factor=1){
  for(const key of ['systolic','diastolic','heartRate','respiratoryRate','temperature','spo2','symptomSeverity','stabilityReserve'])if(Number.isFinite(Number(delta[key])))current[key]+=Number(delta[key])*factor;
  Object.assign(current,normalizeCurrent(current,current));
}

function evaluate(session,profile){
  const c=session.current,t=profile.thresholds||{},attention=t.attention||{},unstable=t.unstable||{};
  const isUnstable=(Number.isFinite(unstable.stabilityReserveBelow)&&c.stabilityReserve<unstable.stabilityReserveBelow)||(Number.isFinite(unstable.symptomSeverityAbove)&&c.symptomSeverity>unstable.symptomSeverityAbove)||(Number.isFinite(unstable.spo2Below)&&c.spo2<unstable.spo2Below)||(Number.isFinite(unstable.heartRateAbove)&&c.heartRate>unstable.heartRateAbove);
  const isAttention=(Number.isFinite(attention.stabilityReserveBelow)&&c.stabilityReserve<attention.stabilityReserveBelow)||(Number.isFinite(attention.symptomSeverityAbove)&&c.symptomSeverity>attention.symptomSeverityAbove);
  const improved=c.symptomSeverity<=Number(profile.outcomeRules?.improvingSymptomBelow??25)&&c.stabilityReserve>=72;
  const delayed=session.elapsedMinutes>=Number(profile.outcomeRules?.escalationAfterMinutes??999);
  if(isUnstable){session.status='unstable';session.outcome='escalation-required';}
  else if(improved){session.status='improving';session.outcome='improving';}
  else if(isAttention||delayed){session.status='attention';session.outcome=delayed?'delayed':'under-care';}
  else{session.status='stable';session.outcome='under-care';}
  return session;
}

function effectMinuteDelta(effect){
  const duration=Math.max(1,Number(effect.durationMinutes)||1),immediate=effect.immediate||{};
  const gradual={};
  for(const key of Object.keys(immediate))gradual[key]=(Number(immediate[key])*0.6)/(duration||1);
  return gradual;
}

export function advancePhysiology(session,profile,minutes=1,{reason='tick',label='Evolução espontânea'}={}){
  const safeMinutes=clamp(minutes,0,60);if(!safeMinutes||session.paused||session.outcome==='closed')return{session,events:[]};
  const drift=profile.naturalCourse?.per10Minutes||{};const events=[];
  for(let minute=0;minute<safeMinutes;minute+=1){
    applyDelta(session.current,drift,0.1);
    const delayStart=Number(profile.naturalCourse?.maxSafeMinutes??999);
    if(session.elapsedMinutes>=delayStart){session.current.stabilityReserve-=profile.urgency==='moderate'?0.8:0.25;session.current.symptomSeverity+=profile.urgency==='moderate'?0.45:0.15;}
    const stillActive=[];
    for(const active of session.activeEffects||[]){
      applyDelta(session.current,active.perMinute,1);active.remainingMinutes-=1;if(active.remainingMinutes>0)stillActive.push(active);
    }
    session.activeEffects=stillActive;session.elapsedMinutes+=1;evaluate(session,profile);
  }
  const last=session.trend?.[session.trend.length-1];
  if(!last||session.elapsedMinutes-last.minute>=5||reason!=='tick')session.trend.push(snapshot(session,reason,label));
  if(session.status==='unstable'&&!session.alerts.includes('unstable')){session.alerts.push('unstable');events.push({level:'critical',code:'unstable',message:'A simulação indica instabilidade e necessidade de escalonamento imediato.'});}
  else if(session.status==='attention'&&!session.alerts.includes('attention')){session.alerts.push('attention');events.push({level:'warning',code:'attention',message:'A tendência clínica exige reavaliação e priorização.'});}
  return{session,events};
}

export function applyPhysiologyAction(session,profile,type,value,timeCost=0){
  const events=[];advancePhysiology(session,profile,timeCost,{reason:'action-time',label:`Tempo consumido: ${value}`});
  const key=actionKey(type,value),first=!session.appliedActions[key];session.appliedActions[key]=(session.appliedActions[key]||0)+1;
  const effect=profile.actionEffects?.[type]?.[value];
  if(first&&effect){
    if(effect.immediate)applyDelta(session.current,effect.immediate,0.4);
    if(effect.immediate&&Number(effect.durationMinutes)>0)session.activeEffects.push({key,remainingMinutes:Number(effect.durationMinutes),perMinute:effectMinuteDelta(effect)});
    events.push({level:'info',code:'response',message:effect.observation?'Sinais clínicos reavaliados e registrados.':'Resposta fisiológica simulada aplicada.'});
  }
  evaluate(session,profile);session.trend.push(snapshot(session,'action',value));
  return{session,events,first,effect:effect||null};
}

export function reassessPhysiology(session,profile,timeCost=2){
  const result=advancePhysiology(session,profile,timeCost,{reason:'reassessment',label:'Reavaliação dirigida'});session.trend.push(snapshot(session,'reassessment','Reavaliação dirigida'));return result;
}

export function physiologyQuality(session,profile){
  if(!session)return 0;const c=session.current;let score=10;
  if(session.status==='improving')score=15;else if(session.status==='attention')score=6;else if(session.status==='unstable')score=0;
  const safe=Number(profile?.naturalCourse?.maxSafeMinutes??999);if(session.elapsedMinutes>safe)score-=Math.min(6,Math.ceil((session.elapsedMinutes-safe)/10));
  if(c.symptomSeverity>75)score-=3;if(c.stabilityReserve<40)score-=3;return clamp(Math.round(score),0,15);
}

export function formatPhysiologyVitals(session){
  const c=session.current;return{pa:`${round(c.systolic)}/${round(c.diastolic)}`,fc:round(c.heartRate),fr:round(c.respiratoryRate),temp:round(c.temperature,1).toFixed(1).replace('.',','),spo2:round(c.spo2),symptom:round(c.symptomSeverity),reserve:round(c.stabilityReserve),status:session.status,outcome:session.outcome,elapsedMinutes:round(session.elapsedMinutes)};
}

export function statusLabel(status,locale='pt-BR'){
  const labels={
    'pt-BR':{stable:'Estável',improving:'Melhora clínica',attention:'Atenção',unstable:'Instável'},
    en:{stable:'Stable',improving:'Improving',attention:'Attention',unstable:'Unstable'},
    es:{stable:'Estable',improving:'Mejorando',attention:'Atención',unstable:'Inestable'}
  };return labels[locale]?.[status]||labels['pt-BR'][status]||status;
}
