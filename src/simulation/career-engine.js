const localized=(value,locale='pt-BR')=>value&&typeof value==='object'?(value[locale]||value['pt-BR']||Object.values(value)[0]||''):String(value??'');
export const localizeCareer=(value,locale='pt-BR')=>localized(value,locale);
export function validateCareerRegistry(registry){
 const errors=[],warnings=[];if(!registry||typeof registry!=='object')return{ok:false,errors:['Registro de carreira ausente.'],warnings};
 if(!Array.isArray(registry.stages)||registry.stages.length<5)errors.push('Estágios de carreira insuficientes.');
 if(!Array.isArray(registry.departments)||registry.departments.length<6)errors.push('Setores hospitalares insuficientes.');
 if(!Array.isArray(registry.exams)||registry.exams.length<4)errors.push('Provas de progressão insuficientes.');
 if(!Array.isArray(registry.calendar)||registry.calendar.length<7)errors.push('Calendário de carreira incompleto.');
 const stageIds=new Set((registry.stages||[]).map(x=>x.id));
 for(const item of registry.departments||[])if(!stageIds.has(item.stage))errors.push(`Setor com estágio inválido: ${item.id}.`);
 for(const exam of registry.exams||[]){if(!stageIds.has(exam.stage))errors.push(`Prova com estágio inválido: ${exam.id}.`);if(!Array.isArray(exam.questions)||exam.questions.length<3)errors.push(`Prova sem questões suficientes: ${exam.id}.`);}
 if(registry.publishable!==false)warnings.push('Carreira não está explicitamente marcada como conteúdo de desenvolvimento.');
 return{ok:errors.length===0,errors:[...new Set(errors)],warnings:[...new Set(warnings)]};
}
export function createCareerState(registry,previous=null){
 const base={stageId:'intern',day:1,rotationId:'triage',examSession:null,examResults:{},examRewardsClaimed:[],claimedMissions:[],attendanceDates:[],activityLog:[],competencies:{},streak:0,lastActivityDate:null,totalActivities:0};
 const out={...base,...(previous||{})};out.examResults={...(previous?.examResults||{})};out.examRewardsClaimed=[...(previous?.examRewardsClaimed||[])];out.claimedMissions=[...(previous?.claimedMissions||[])];out.attendanceDates=[...(previous?.attendanceDates||[])];out.activityLog=[...(previous?.activityLog||[])].slice(-80);out.competencies={...(previous?.competencies||{})};
 if(!(registry?.stages||[]).some(x=>x.id===out.stageId))out.stageId='intern';if(!Number.isFinite(Number(out.day))||out.day<1)out.day=1;return out;
}
export const careerStage=(registry,id)=>(registry?.stages||[]).find(x=>x.id===id)||(registry?.stages||[])[0]||null;
export const careerExam=(registry,id)=>(registry?.exams||[]).find(x=>x.id===id)||null;
export const careerDepartment=(registry,id)=>(registry?.departments||[]).find(x=>x.id===id)||null;
export function careerMetrics(state,{completed=[],academyPassed=0,emergencyCompleted=0,outpatientCompleted=0,player={}}={}){
 const scores=completed.map(x=>Number(x.score)).filter(Number.isFinite);const averageScore=scores.length?Math.round(scores.reduce((a,b)=>a+b,0)/scores.length):0;
 return{cases:completed.length,averageScore,academyModules:Number(academyPassed)||0,emergency:Number(emergencyCompleted)||0,outpatient:Number(outpatientCompleted)||0,streak:Number(state?.streak||player?.streak||0),xp:Number(player?.xp||0),reputation:player?.reputation||''};
}
export function requirementProgress(stage,metrics,career){
 const req=stage?.requirements||{};const rows=['cases','averageScore','academyModules','emergency','outpatient'].map(key=>({key,current:Number(metrics[key]||0),goal:Number(req[key]||0),met:Number(metrics[key]||0)>=Number(req[key]||0)}));
 if(req.examId){const result=career?.examResults?.[req.examId];rows.push({key:'exam',current:Number(result?.score||0),goal:Number(result?.passScore||100),met:!!result?.passed,examId:req.examId});}
 return rows;
}
export function canAdvanceCareer(registry,career,metrics){const stages=[...(registry?.stages||[])].sort((a,b)=>a.order-b.order),index=Math.max(0,stages.findIndex(x=>x.id===career.stageId)),next=stages[index+1];if(!next)return{ok:false,reason:'max-stage',next:null,rows:[]};const rows=requirementProgress(next,metrics,career);return{ok:rows.every(x=>x.met),next,rows};}
export function advanceCareer(registry,career,metrics){const check=canAdvanceCareer(registry,career,metrics);if(!check.ok)return check;career.stageId=check.next.id;career.rotationId=check.next.unlocks?.[0]||career.rotationId;career.activityLog.push({type:'promotion',stageId:check.next.id,at:new Date().toISOString()});return{...check,advanced:true};}
export function unlockedDepartments(registry,career){const stages=[...(registry?.stages||[])].sort((a,b)=>a.order-b.order),index=Math.max(0,stages.findIndex(x=>x.id===career.stageId)),allowed=new Set(stages.slice(0,index+1).flatMap(x=>x.unlocks||[]));if(allowed.has('all-sectors'))return(registry?.departments||[]).map(x=>x.id);return(registry?.departments||[]).filter(x=>allowed.has(x.id)).map(x=>x.id);}
export function recordCareerActivity(career,{type='activity',specialty='general',score=0,id=null}={}){career.totalActivities=Number(career.totalActivities||0)+1;career.streak=Number(career.streak||0)+1;career.lastActivityDate=new Date().toISOString().slice(0,10);career.day=Math.max(1,Number(career.day||1)+1);const key=specialty||type;const comp=career.competencies[key]||{activities:0,totalScore:0,average:0};comp.activities+=1;comp.totalScore+=Number(score)||0;comp.average=Math.round(comp.totalScore/comp.activities);career.competencies[key]=comp;career.activityLog.push({type,id,specialty:key,score:Number(score)||0,day:career.day,at:new Date().toISOString()});career.activityLog=career.activityLog.slice(-80);return career;}
export function startCareerExam(career,registry,examId){const exam=careerExam(registry,examId);if(!exam)return{ok:false,error:'exam-not-found'};career.examSession={examId,index:0,answers:[],correct:0,completed:false,score:null,startedAt:new Date().toISOString()};return{ok:true,session:career.examSession,exam};}
export function answerCareerExam(career,registry,answerIndex){const session=career.examSession,exam=careerExam(registry,session?.examId);if(!session||!exam||session.completed)return{ok:false,error:'exam-not-active'};const q=exam.questions[session.index],correct=Number(answerIndex)===Number(q.correctIndex);session.answers.push({question:session.index,answerIndex:Number(answerIndex),correct});if(correct)session.correct+=1;session.index+=1;if(session.index>=exam.questions.length){session.completed=true;session.score=Math.round(session.correct/exam.questions.length*100);const passed=session.score>=exam.passScore;career.examResults[exam.id]={score:session.score,passScore:exam.passScore,passed,attempts:Number(career.examResults[exam.id]?.attempts||0)+1,at:new Date().toISOString()};career.activityLog.push({type:'exam',id:exam.id,score:session.score,passed,at:new Date().toISOString()});return{ok:true,completed:true,passed,score:session.score,exam};}return{ok:true,completed:false,correct,session,exam};}
export function careerMissionProgress(mission,metrics){return Math.min(Number(mission.goal)||0,Number(metrics[mission.metric]||0));}
