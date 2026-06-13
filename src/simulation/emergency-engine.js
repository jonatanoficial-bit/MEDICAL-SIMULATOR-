const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number(n)||0));
const clone=value=>JSON.parse(JSON.stringify(value));
export const localizeEmergency=(value,locale='pt-BR')=>value&&typeof value==='object'&&!Array.isArray(value)?(value[locale]??value['pt-BR']??Object.values(value)[0]??''):String(value??'');
export function validateEmergencyRegistry(registry){
  const errors=[],warnings=[];
  if(!registry||typeof registry!=='object')return {ok:false,errors:['Registro de emergência ausente.'],warnings};
  if(registry.publishable!==false)warnings.push('Pacote de emergência não está explicitamente bloqueado para publicação.');
  if(!Array.isArray(registry.actions)||registry.actions.length<20)errors.push('Catálogo de ações de emergência incompleto.');
  if(!Array.isArray(registry.scenarios)||registry.scenarios.length<9)errors.push('São necessários pelo menos nove cenários de emergência.');
  const actionIds=new Set(),scenarioIds=new Set();
  for(const action of registry.actions||[]){if(!action?.id||actionIds.has(action.id))errors.push(`Ação inválida ou duplicada: ${action?.id||'sem-id'}`);actionIds.add(action?.id);if(!['A','B','C','D','E'].includes(action?.stage))errors.push(`Etapa ABCDE inválida em ${action?.id}.`);}
  for(const scenario of registry.scenarios||[]){if(!scenario?.id||scenarioIds.has(scenario.id))errors.push(`Cenário inválido ou duplicado: ${scenario?.id||'sem-id'}`);scenarioIds.add(scenario?.id);if(!Array.isArray(scenario?.criticalActions)||scenario.criticalActions.length<3)errors.push(`Ações críticas insuficientes em ${scenario?.id}.`);for(const id of [...(scenario?.criticalActions||[]),...(scenario?.expectedSequence||[]),...(scenario?.harmfulActions||[])])if(!actionIds.has(id))errors.push(`Ação ${id} não existe em ${scenario?.id}.`);if(!scenario?.sourceIds?.length)errors.push(`Fontes ausentes em ${scenario?.id}.`);}
  return {ok:errors.length===0,errors:[...new Set(errors)],warnings:[...new Set(warnings)]};
}
export const emergencyScenario=(registry,id)=>registry?.scenarios?.find(item=>item.id===id)||null;
export const emergencyAction=(registry,id)=>registry?.actions?.find(item=>item.id===id)||null;
export function createEmergencySession(scenario,previous=null){
  if(previous?.scenarioId===scenario?.id)return clone(previous);
  return {scenarioId:scenario?.id||null,status:'active',outcome:'deteriorating',elapsedMinutes:0,score:100,penalties:0,performed:[],timeline:[],vitals:{...clone(scenario?.initialVitals||{}),symptom:78,stability:42},stageCompletion:{A:false,B:false,C:false,D:false,E:false},lastRealTickAt:Date.now(),completedAt:null};
}
function applyDelta(vitals,delta={}){for(const [key,value] of Object.entries(delta)){if(key==='consciousness')vitals[key]=value;else if(key==='symptom')vitals.symptom=clamp(vitals.symptom+value,0,100);else if(key==='stability')vitals.stability=clamp(vitals.stability+value,0,100);else vitals[key]=Math.round(((Number(vitals[key])||0)+Number(value))*10)/10;}return vitals;}
function recalc(session,scenario){
  const criticalDone=scenario.criticalActions.filter(id=>session.performed.some(item=>item.actionId===id)).length;
  const missing=scenario.criticalActions.length-criticalDone;
  const overtime=Math.max(0,session.elapsedMinutes-scenario.maxMinutes);
  session.score=clamp(100-session.penalties-missing*7-overtime*2,0,100);
  const allDone=missing===0;
  if(allDone){session.status='resolved';session.outcome=scenario.stableOutcome||'stabilized';session.completedAt=session.completedAt||new Date().toISOString();session.vitals.stability=clamp(session.vitals.stability+18,0,100);session.vitals.symptom=clamp(session.vitals.symptom-18,0,100);}
  else if(session.elapsedMinutes>=scenario.maxMinutes){session.status='failed';session.outcome='time-critical-deterioration';session.completedAt=session.completedAt||new Date().toISOString();session.vitals.stability=clamp(session.vitals.stability-20,0,100);}
  else if(session.vitals.stability<25||Number(session.vitals.spo2||100)<80||Number(session.vitals.systolic||120)<70){session.outcome='unstable';}
  else if(session.vitals.stability<45)session.outcome='critical';
  else session.outcome='deteriorating';
  return session;
}
export function advanceEmergency(session,scenario,minutes=1,{reason='time'}={}){
  if(!session||session.status!=='active')return {session,events:[]};
  const delta=Math.max(0,Number(minutes)||0);session.elapsedMinutes=Math.round((session.elapsedMinutes+delta)*10)/10;
  const severity=scenario.priority==='resuscitation'?1.8:scenario.priority==='critical'?1.25:0.8;
  applyDelta(session.vitals,{heartRate:severity*delta,respiratoryRate:0.25*severity*delta,spo2:-0.35*severity*delta,systolic:-0.55*severity*delta,symptom:0.8*severity*delta,stability:-1.1*severity*delta});
  const events=[];if(session.elapsedMinutes>scenario.maxMinutes*0.6&&!session.timeline.some(x=>x.type==='window-warning')){const event={type:'window-warning',minute:session.elapsedMinutes,message:'Janela crítica em risco: priorize ações essenciais.'};session.timeline.push(event);events.push(event);}
  recalc(session,scenario);return {session,events,reason};
}
export function performEmergencyAction(session,registry,scenario,actionId){
  const action=emergencyAction(registry,actionId);if(!action||!scenario)return {ok:false,error:'Ação ou cenário inválido.',session};
  if(session.status!=='active')return {ok:false,error:'Cenário já encerrado.',session};
  if(!action.repeatable&&session.performed.some(item=>item.actionId===actionId))return {ok:false,error:'Ação já registrada.',session};
  advanceEmergency(session,scenario,action.timeCost||1,{reason:'action'});
  const expectedIndex=scenario.expectedSequence.indexOf(actionId),doneExpected=scenario.expectedSequence.filter(id=>session.performed.some(item=>item.actionId===id)).length;
  let penalty=0,quality='neutral';
  if(scenario.harmfulActions.includes(actionId)){penalty+=14;quality='harmful';}
  else if(scenario.criticalActions.includes(actionId)){quality='critical';if(expectedIndex>doneExpected+1)penalty+=5;if(session.elapsedMinutes>scenario.maxMinutes*0.7)penalty+=4;}
  else if(!scenario.expectedSequence.includes(actionId)){penalty+=3;quality='nonpriority';}
  session.penalties+=penalty;
  applyDelta(session.vitals,scenario.actionEffects?.[actionId]||{});
  const record={actionId,stage:action.stage,minute:session.elapsedMinutes,quality,penalty};session.performed.push(record);session.timeline.push({...record,type:'action'});
  for(const stage of ['A','B','C','D','E'])session.stageCompletion[stage]=session.performed.some(item=>emergencyAction(registry,item.actionId)?.stage===stage);
  recalc(session,scenario);return {ok:true,session,record,status:session.status,outcome:session.outcome};
}
export function emergencyProgress(session,scenario){const done=scenario.criticalActions.filter(id=>session.performed.some(item=>item.actionId===id)).length;return {done,total:scenario.criticalActions.length,pct:Math.round(done/Math.max(1,scenario.criticalActions.length)*100),missing:scenario.criticalActions.filter(id=>!session.performed.some(item=>item.actionId===id))};}
