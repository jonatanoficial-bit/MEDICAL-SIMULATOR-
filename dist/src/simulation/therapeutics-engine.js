const nonEmpty=value=>typeof value==='string'&&value.trim().length>0;
const localize=(value,locale='pt-BR')=>value&&typeof value==='object'?(value[locale]||value['pt-BR']||Object.values(value)[0]||''):String(value||'');
export function validateTherapeuticsRegistry(registry,caseIds=[]){
 const errors=[],warnings=[];if(!registry||typeof registry!=='object')return{ok:false,errors:['Registro terapêutico ausente.'],warnings};
 if(Number(registry.schemaVersion)!==1)errors.push('Schema terapêutico incompatível.');
 for(const key of ['examCatalog','interventions','procedureCatalog','patientProfiles'])if(!Array.isArray(registry[key]))errors.push(`Lista terapêutica inválida: ${key}.`);
 const exams=new Set(),interventions=new Set(),profiles=new Set();
 for(const item of registry.examCatalog||[]){if(!nonEmpty(item.id)||!nonEmpty(item.legacyValue))errors.push('Exame sem id ou valor legado.');if(exams.has(item.legacyValue))errors.push(`Exame duplicado: ${item.legacyValue}.`);exams.add(item.legacyValue);if(!(Number(item.turnaroundMinutes)>=1))errors.push(`Tempo inválido para ${item.legacyValue}.`);}
 for(const item of registry.interventions||[]){if(!nonEmpty(item.id)||!nonEmpty(item.legacyValue)||!nonEmpty(item.kind))errors.push('Intervenção incompleta.');if(interventions.has(item.legacyValue))errors.push(`Intervenção duplicada: ${item.legacyValue}.`);interventions.add(item.legacyValue);if(item.kind==='medication'&&(!item.order||!nonEmpty(item.order.route)||!nonEmpty(item.order.dose)))errors.push(`Ordem medicamentosa incompleta: ${item.legacyValue}.`);}
 for(const item of registry.patientProfiles||[]){if(!nonEmpty(item.caseId))errors.push('Perfil de segurança sem caseId.');profiles.add(item.caseId);}
 for(const id of caseIds)if(!profiles.has(id))errors.push(`Perfil terapêutico ausente: ${id}.`);
 if(registry.policy?.publishable!==true)warnings.push('Exames, medicamentos e procedimentos permanecem bloqueados para publicação comercial.');
 return{ok:errors.length===0,errors,warnings};
}
export const examDefinition=(registry,value)=>(registry?.examCatalog||[]).find(x=>x.legacyValue===value)||null;
export const interventionDefinition=(registry,value)=>(registry?.interventions||[]).find(x=>x.legacyValue===value)||null;
export const procedureDefinition=(registry,value)=>(registry?.procedureCatalog||[]).find(x=>x.legacyValue===value)||null;
export const therapeuticProfileForCase=(registry,caseId)=>(registry?.patientProfiles||[]).find(x=>x.caseId===caseId)||null;
export function createTherapeuticsState(caseId,previous=null){
 const valid=previous&&previous.caseId===caseId;const base=valid?previous:{};
 return{caseId,reconciliation:{checks:{identity:false,allergies:false,currentMedications:false,renalHepatic:false,pregnancy:false,indicationRoute:false},confirmed:false,confirmedAt:null,...(base.reconciliation||{})},examOrders:Array.isArray(base.examOrders)?base.examOrders:[],administrations:Array.isArray(base.administrations)?base.administrations:[],incidents:Array.isArray(base.incidents)?base.incidents:[],procedureAttempts:Array.isArray(base.procedureAttempts)?base.procedureAttempts:[],lastProcessedMinute:Number(base.lastProcessedMinute||0)};
}
export function requestExamOrder(state,registry,caseId,value,elapsedMinute=0){
 const def=examDefinition(registry,value);if(!def)return{ok:false,error:'Exame não cadastrado.'};
 const existing=(state.examOrders||[]).find(x=>x.value===value&&x.status!=='cancelled');if(existing)return{ok:true,order:existing,duplicate:true};
 const order={id:`exam-${caseId}-${def.id}-${Math.round(elapsedMinute)}-${state.examOrders.length+1}`,caseId,definitionId:def.id,value,status:'processing',requestedAt:Number(elapsedMinute),readyAt:Number(elapsedMinute)+Number(def.turnaroundMinutes),turnaroundMinutes:Number(def.turnaroundMinutes),specimen:def.specimen,category:def.category};state.examOrders.push(order);return{ok:true,order,definition:def};
}
export function cancelExamOrder(state,value){const order=(state.examOrders||[]).find(x=>x.value===value&&x.status==='processing');if(!order)return{ok:false,error:'Pedido já liberado ou inexistente.'};order.status='cancelled';order.cancelledAt=new Date().toISOString();return{ok:true,order};}
export function processExamOrders(state,registry,caseId,elapsedMinute,resultBank={}){
 const ready=[];for(const order of state.examOrders||[]){if(order.caseId!==caseId||order.status!=='processing'||Number(order.readyAt)>Number(elapsedMinute))continue;order.status='ready';order.releasedAt=Number(elapsedMinute);order.result=(resultBank?.[caseId]?.[order.value])||`${order.value}: resultado sem alteração relevante para este cenário.`;ready.push(order);}state.lastProcessedMinute=Math.max(Number(state.lastProcessedMinute||0),Number(elapsedMinute||0));return ready;
}
export function assessIntervention(registry,caseId,value,reconciliation){
 const definition=interventionDefinition(registry,value);if(!definition)return{ok:false,blocked:true,reasons:['Intervenção não cadastrada.'],definition:null};const profile=therapeuticProfileForCase(registry,caseId);const reasons=[];const warnings=[];
 if(definition.kind==='medication'&&reconciliation?.confirmed!==true)reasons.push('Reconciliação medicamentosa obrigatória antes da ordem.');
 const recommended=(definition.recommendedFor||[]).includes(caseId);if(!recommended)warnings.push('Intervenção sem indicação prevista para este caso.');
 const flags=new Set(profile?.flags||[]);for(const flag of definition.contraindicationFlags||[])if(flags.has(flag))reasons.push(`Contraindicação simulada: ${flag}.`);
 return{ok:reasons.length===0,blocked:reasons.length>0,reasons,warnings,recommended,definition,profile};
}
export function registerIntervention(state,registry,caseId,value,elapsedMinute=0){
 const assessment=assessIntervention(registry,caseId,value,state.reconciliation);if(assessment.blocked)return assessment;const def=assessment.definition;
 const administration={id:`intervention-${caseId}-${def.id}-${state.administrations.length+1}`,caseId,value,definitionId:def.id,kind:def.kind,at:Number(elapsedMinute),status:def.kind==='medication'?'administered':'planned',order:def.order||null,recommended:assessment.recommended,warnings:assessment.warnings};state.administrations.push(administration);
 if(!assessment.recommended)state.incidents.push({id:`incident-${state.incidents.length+1}`,severity:def.kind==='medication'?'major':'moderate',type:'wrong-indication',value,at:Number(elapsedMinute),message:'Intervenção registrada sem indicação prevista no cenário.'});return{...assessment,administration};
}
export function procedureOutcome(state,registry,caseId,value,elapsedMinute=0){const def=procedureDefinition(registry,value);if(!def)return null;const previous=(state.procedureAttempts||[]).filter(x=>x.value===value).length;const configured=def.outcomes?.[caseId]||['success'];const outcome=configured[Math.min(previous,configured.length-1)]||'success';const attempt={id:`procedure-${caseId}-${def.id}-${previous+1}`,value,definitionId:def.id,attempt:previous+1,outcome,at:Number(elapsedMinute)};state.procedureAttempts.push(attempt);if(outcome!=='success')state.incidents.push({id:`incident-${state.incidents.length+1}`,severity:'moderate',type:'procedure-failure',value,at:Number(elapsedMinute),message:'Falha de procedimento simulada.'});return{definition:def,attempt};}
export function therapeuticsPenalty(state){return(state?.incidents||[]).reduce((sum,item)=>sum+(item.severity==='major'?12:item.severity==='moderate'?6:3),0);}
export function localizeTherapeutic(value,locale='pt-BR'){return localize(value,locale);}
