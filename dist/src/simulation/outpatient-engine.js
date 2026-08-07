const clamp=(n,min,max)=>Math.max(min,Math.min(max,Number(n)||0));
const clone=value=>JSON.parse(JSON.stringify(value));
export const localizeOutpatient=(value,locale='pt-BR')=>value&&typeof value==='object'&&!Array.isArray(value)?(value[locale]??value['pt-BR']??Object.values(value)[0]??''):String(value??'');
export function validateOutpatientRegistry(registry){
  const errors=[],warnings=[];
  if(!registry||typeof registry!=='object')return {ok:false,errors:['Registro ambulatorial ausente.'],warnings};
  if(registry.publishable!==false)warnings.push('Pacote ambulatorial não está explicitamente bloqueado para publicação.');
  if(!Array.isArray(registry.actions)||registry.actions.length<12)errors.push('Catálogo de ações ambulatoriais incompleto.');
  if(!Array.isArray(registry.programs)||registry.programs.length<10)errors.push('São necessárias pelo menos dez linhas de cuidado.');
  const actionIds=new Set(),programIds=new Set();
  for(const action of registry.actions||[]){if(!action?.id||actionIds.has(action.id))errors.push(`Ação ambulatorial inválida ou duplicada: ${action?.id||'sem-id'}`);actionIds.add(action?.id);if(!action?.label||!action?.description)errors.push(`Ação sem tradução: ${action?.id}.`);}
  for(const program of registry.programs||[]){if(!program?.id||programIds.has(program.id))errors.push(`Linha de cuidado inválida ou duplicada: ${program?.id||'sem-id'}`);programIds.add(program?.id);if(!program?.baseline||!Array.isArray(program?.goals)||program.goals.length<2)errors.push(`Metas ou baseline inválidos em ${program?.id}.`);if(Number(program?.totalVisits)<3)errors.push(`Seguimento curto demais em ${program?.id}.`);for(const id of [...(program?.requiredActions||[]),...(program?.helpfulActions||[]),...(program?.harmfulActions||[])])if(!actionIds.has(id))errors.push(`Ação ${id} não existe em ${program?.id}.`);if(!program?.sourceIds?.length)errors.push(`Fontes ausentes em ${program?.id}.`);}
  return {ok:errors.length===0,errors:[...new Set(errors)],warnings:[...new Set(warnings)]};
}
export const outpatientProgram=(registry,id)=>registry?.programs?.find(item=>item.id===id)||null;
export const outpatientAction=(registry,id)=>registry?.actions?.find(item=>item.id===id)||null;
export function createOutpatientSession(program,previous=null){
  if(previous?.programId===program?.id)return clone(previous);
  const b=clone(program?.baseline||{});
  return {programId:program?.id||null,status:'active',outcome:'in-follow-up',visit:1,week:0,score:100,metrics:b,adherence:clamp(b.adherence??50,0,100),engagement:clamp(b.engagement??50,0,100),risk:clamp(b.risk??50,0,100),symptom:clamp(b.symptom??50,0,100),performedThisVisit:[],timeline:[],visitHistory:[],penalties:0,lastAction:null,completedAt:null};
}
function applyEffects(session,effects={}){
  for(const [key,value] of Object.entries(effects||{})){
    if(['adherence','engagement','risk','symptom'].includes(key))session[key]=clamp(session[key]+Number(value),0,100);
    else session.metrics[key]=Math.round(((Number(session.metrics[key])||0)+Number(value))*100)/100;
  }
  session.metrics.adherence=session.adherence;session.metrics.engagement=session.engagement;session.metrics.risk=session.risk;session.metrics.symptom=session.symptom;
}
function goalReached(goal,metrics){const value=Number(metrics?.[goal.metric]);if(!Number.isFinite(value))return false;return goal.direction==='min'?value>=Number(goal.target):value<=Number(goal.target);}
export function outpatientProgress(session,program){const reached=(program?.goals||[]).filter(goal=>goalReached(goal,session.metrics)).length;const required=(program?.requiredActions||[]);const done=required.filter(id=>session.performedThisVisit.some(item=>item.actionId===id)).length;return {goalsReached:reached,totalGoals:(program?.goals||[]).length,goalPct:Math.round(reached/Math.max(1,(program?.goals||[]).length)*100),requiredDone:done,requiredTotal:required.length,requiredMissing:required.filter(id=>!session.performedThisVisit.some(item=>item.actionId===id)),visitPct:Math.round((session.visit-1)/Math.max(1,(program?.totalVisits||1)-1)*100)};}
function recalc(session,program){
  const progress=outpatientProgress(session,program);const incomplete=Math.max(0,progress.requiredTotal-progress.requiredDone);
  session.score=clamp(Math.round(100-session.penalties-incomplete*4-session.risk*0.12+(session.adherence-50)*0.12+(session.engagement-50)*0.08),0,100);
  if(session.status==='completed'){session.outcome=progress.goalsReached===progress.totalGoals?'goals-met':progress.goalsReached>=Math.ceil(progress.totalGoals/2)?'partial-improvement':'needs-reassessment';}
  else if(session.risk>=85)session.outcome='urgent-escalation-needed';
  else if(session.adherence<35)session.outcome='adherence-at-risk';
  else session.outcome='in-follow-up';
  return session;
}
export function performOutpatientAction(session,registry,program,actionId){
  const action=outpatientAction(registry,actionId);if(!action||!program)return {ok:false,error:'Ação ou linha de cuidado inválida.',session};
  if(session.status!=='active')return {ok:false,error:'Seguimento já encerrado.',session};
  if(!action.repeatable&&session.performedThisVisit.some(item=>item.actionId===actionId))return {ok:false,error:'Ação já registrada nesta consulta.',session};
  let penalty=0,quality='neutral';
  if(action.harmful||program.harmfulActions?.includes(actionId)){penalty=12;quality='harmful';}
  else if(program.requiredActions?.includes(actionId))quality='required';
  else if(program.helpfulActions?.includes(actionId))quality='helpful';
  else {penalty=2;quality='nonpriority';}
  session.penalties+=penalty;applyEffects(session,action.effects);applyEffects(session,program.actionEffects?.[actionId]);
  const record={actionId,visit:session.visit,week:session.week,quality,penalty};session.performedThisVisit.push(record);session.timeline.push({...record,type:'action'});session.lastAction=actionId;recalc(session,program);return {ok:true,session,record};
}
export function closeOutpatientVisit(session,program,{force=false}={}){
  if(!session||session.status!=='active')return {ok:false,error:'Seguimento indisponível.',session};
  const progress=outpatientProgress(session,program);
  if(!force&&progress.requiredDone<Math.min(3,progress.requiredTotal))return {ok:false,error:'Complete pelo menos três ações essenciais antes de encerrar a consulta.',session,progress};
  const snapshot={visit:session.visit,week:session.week,score:session.score,metrics:clone(session.metrics),adherence:session.adherence,engagement:session.engagement,risk:session.risk,symptom:session.symptom,actions:clone(session.performedThisVisit),at:new Date().toISOString()};
  session.visitHistory.push(snapshot);session.timeline.push({type:'visit-closed',visit:session.visit,week:session.week,score:session.score});
  if(session.visit>=Number(program.totalVisits||4)){
    session.status='completed';session.completedAt=new Date().toISOString();recalc(session,program);return {ok:true,completed:true,session,progress:outpatientProgress(session,program)};
  }
  const good=session.adherence>=65&&session.engagement>=55&&session.risk<80;
  applyEffects(session,program.naturalCourse?.[good?'good':'poor']||{});
  session.visit+=1;session.week+=Number(program.visitIntervalWeeks||4);session.performedThisVisit=[];session.penalties=Math.max(0,session.penalties-2);recalc(session,program);
  return {ok:true,completed:false,session,progress:outpatientProgress(session,program)};
}
export function missOutpatientVisit(session,program){
  if(!session||session.status!=='active')return {ok:false,error:'Seguimento indisponível.',session};
  session.week+=Number(program.visitIntervalWeeks||4);session.penalties+=8;applyEffects(session,{adherence:-8,engagement:-6,risk:8,symptom:5});session.timeline.push({type:'missed-visit',visit:session.visit,week:session.week,penalty:8});recalc(session,program);return {ok:true,session};
}
