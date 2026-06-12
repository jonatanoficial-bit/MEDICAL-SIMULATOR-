import {BUILD,ASSET_ROOT,bg,av,ui} from './config/build.js';
import {createDefaultState} from './core/default-state.js';
import {deepMerge} from './core/object.js';
import {createStateStore} from './core/storage.js';
import {getFallbackContent} from './data/fallback-content.js';
import {loadGameContent,clearClinicalContentCache} from './data/content-loader.js';
import {createDiagnostics} from './core/diagnostics.js';
import {verifyRuntimeBuild} from './core/runtime-health.js';
import {initServiceWorker,applyWaitingUpdate} from './core/sw-manager.js';
import {createMobileExperience} from './core/mobile-experience.js';
import {SUPPORTED_LOCALES,normalizeLocale,localeLabel} from './i18n/index.js';
import {ACCESSIBILITY_DEFAULTS,normalizeAccessibility,applyAccessibilityPreferences,prefersReducedMotion,announce,enhanceAccessibility,focusMain,installKeyboardNavigation} from './core/accessibility.js';
import './compat/legacy-guards.js';

window.VALE_BOOT_GUARD?.checkpoint('app-module-loaded');
const safeMode=new URLSearchParams(location.search).get('safe')==='1';
const diagnostics=createDiagnostics({key:'medsim-diagnostics-v015',build:BUILD.label,maxEntries:120});
diagnostics.info('boot','Módulo principal carregado.',{safeMode});
let runtimeBuildStatus={ok:null,message:'Verificação pendente.'};
let swStatus={supported:'serviceWorker'in navigator,registered:false,updateReady:false};
let waitingRegistration=null;
const A=ASSET_ROOT;
const app=document.querySelector('#app');
const saveKey='medsim-vale-save-v015';
const legacySaveKeys=['medsim-vale-save-v014','medsim-vale-save-v013','medsim-vale-save-v012','medsim-vale-save-v011','medsim-vale-save-v010','medsim-vale-save-v080'];
const fresh=()=>createDefaultState({buildVersion:BUILD.version});
const stateStore=createStateStore({key:saveKey,legacyKeys:legacySaveKeys,schemaVersion:BUILD.saveSchema,buildVersion:BUILD.version,maxBackups:5,backupIntervalMs:60000,diagnostics});
const safeLoad=()=>stateStore.load(fresh);
let state=safeLoad();
const launchScreen=new URLSearchParams(location.search).get('screen');
if(['hub','specialty','learning','settings'].includes(launchScreen)&&state?.meta?.updatedAt)state.screen=launchScreen;
function normalizeState(){
  const base=fresh();
  state=deepMerge(base,state||{});
  window.state=state;
  const validScreens=['setup','menu','hub','specialty','shift','post','learning','settings','recovery'];
  if(!validScreens.includes(state.screen)) state.screen='hub';
  state.locale=normalizeLocale(state.locale);
  state.accessibility=normalizeAccessibility(state.accessibility);
  state.actions=deepMerge({questions:[],exams:[],procedures:[],hypotheses:[],conduct:[]},state.actions||{});
  state.prontuario=deepMerge({history:[],exams:[],procedures:[],hypotheses:[],conduct:[],notes:[]},state.prontuario||{});
  state.missions=deepMerge({claimed:[]},state.missions||{});
  state.player=deepMerge(base.player,state.player||{});
  state.currentCase=Number.isFinite(Number(state.currentCase))?Number(state.currentCase):0;
  state.simulation=deepMerge({minutes:720,criticality:0},state.simulation||{});
  state.meta=deepMerge(base.meta,state.meta||{});
  state.ui=deepMerge({shiftTab:'summary',recordTab:'overview',resultsOpen:false,closureReview:false,compactProfile:true},state.ui||{});
  state.pwa=deepMerge({installDismissed:false,lastInstallResult:null},state.pwa||{});
  document.documentElement.lang=state.locale;
  applyAccessibilityPreferences(state.accessibility);
}
const save=(options={})=>{normalizeState();const ok=stateStore.save(state,options);if(!ok)toast?.('Não foi possível confirmar o save. O progresso anterior foi preservado.','warn');return ok;};
function showRecoveryScreen(err){
  try{
    const msg=(err&&(err.message||String(err)))||'Erro desconhecido';
    state.meta=state.meta||{};state.meta.recoveryCount=(state.meta.recoveryCount||0)+1;
    diagnostics.error('runtime','Modo segurança ativado.',{message:msg,screen:state.screen,recoveryCount:state.meta.recoveryCount});
    try{stateStore.save(state,{label:'runtime-error',forceBackup:true});}catch{}
    app.innerHTML=`<main class="screen fade recovery-screen" style="--bg:url('${bg(8)}')"><section class="setup panel pop recovery-card"><p class="safety-kicker">ANTI-QUEBRA 2.0</p><h1>Modo segurança ativo</h1><p>O jogo isolou uma falha e preservou o último save confirmado.</p><p class="recovery-error"><small>${esc(msg)}</small></p><div class="recovery-actions"><button class="btn primary" onclick="safeRecoverHub()">Reparar e voltar ao lobby</button><button class="btn" onclick="openRecoveryCenter()">Central de recuperação</button><button class="btn" onclick="safeExportSave()">Exportar save</button><button class="btn" onclick="safeExportDiagnostics()">Exportar diagnóstico</button><button class="btn danger" onclick="safeFreshStart()">Reiniciar somente o slot principal</button></div></section><div class="build">${BUILD.label} • anti-quebra</div></main>`;
  }catch{document.body.innerHTML='<h1>Medical Simulator</h1><p>Modo segurança.</p><button onclick="location.reload()">Recarregar</button>';}
}
window.safeRecoverHub=()=>{state=deepMerge(fresh(),state||{});state.screen='hub';state.popup=null;state.encounter=null;state.actions={questions:[],exams:[],procedures:[],hypotheses:[],conduct:[]};state.meta.recoveryCount=(state.meta.recoveryCount||0)+1;save({label:'safe-recover',forceBackup:true});diagnostics.info('recovery','Estado transitório reparado; perfil preservado.');render();};
window.safeFreshStart=()=>{stateStore.backup('before-reset');stateStore.reset();diagnostics.warn('recovery','Slot principal resetado pelo usuário; backups preservados.');location.reload();};
window.safeExportSave=()=>{try{const payload=stateStore.exportPackage(state);const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`medical-simulator-save-${BUILD.stamp}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);diagnostics.info('recovery','Save exportado manualmente.');}catch(error){diagnostics.error('recovery','Falha ao exportar save.',{error:error.message});alert('Não foi possível exportar agora.');}};
window.safeExportDiagnostics=()=>{try{const blob=new Blob([JSON.stringify(diagnostics.export(),null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`medical-simulator-diagnostics-${BUILD.stamp}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),500);}catch{alert('Não foi possível exportar o diagnóstico.');}};
window.addEventListener('error',event=>{if(!event.error&&!event.message)return;const error=event.error||event.message;console.error('Erro capturado pelo anti-quebra',error);diagnostics.error('runtime',event.message||'Erro global',{stack:event.error?.stack||null,screen:state.screen});showRecoveryScreen(error);});
window.addEventListener('unhandledrejection',event=>{console.error('Promessa capturada pelo anti-quebra',event.reason);diagnostics.error('promise','Promessa rejeitada sem tratamento',{reason:String(event.reason),stack:event.reason?.stack||null,screen:state.screen});showRecoveryScreen(event.reason);});
let audioCtx=null;
function sound(type='tap'){if(!state.sound)return;try{audioCtx=audioCtx||new(window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.connect(g);g.connect(audioCtx.destination);const map={tap:[520,.025],ok:[760,.055],warn:[210,.09],nav:[390,.04],level:[880,.14]};const [f,d]=map[type]||map.tap;o.frequency.value=f;o.type='sine';g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.045,audioCtx.currentTime+.01);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+d);o.start();o.stop(audioCtx.currentTime+d+.01)}catch(e){}}
function toast(t,type='ok'){sound(type);let e=document.createElement('div');e.className='toast pop';e.setAttribute('role',type==='warn'?'alert':'status');e.setAttribute('aria-live',type==='warn'?'assertive':'polite');e.textContent=t;document.body.append(e);announce(t,{priority:type==='warn'?'assertive':'polite'});setTimeout(()=>e.remove(),prefersReducedMotion(state.accessibility)?2600:2100)}
function go(s){sound('nav');state.screen=s;state.drawer=false;save();render();requestAnimationFrame(()=>{window.scrollTo({top:0,left:0,behavior:'auto'});focusMain();})}
let exams=[];
let procedures=[];
let hypotheses=[];
let conducts=[];
let directedQuestions=[];
let patients=[];
let cases=[];
let specs=[];
let missionBank=[];
let examResultBank={};
let questionResultBank={};
let procedureResultBank={};

function applyGameContent(content,status={mode:'fallback',warnings:[]}){
  exams=[...(content.gameplay.exams||[])];
  procedures=[...(content.gameplay.procedures||[])];
  hypotheses=[...(content.gameplay.hypotheses||[])];
  conducts=[...(content.gameplay.conducts||[])];
  directedQuestions=[...(content.gameplay.directedQuestions||[])];
  patients=[...(content.queue.patients||[])];
  cases=[...(content.cases||[])];
  specs=(content.specialties.specialties||[]).map(item=>[item.id,item.name,item.description,item.icon,item.declaredCaseCount,bg(item.background),item.unlockLevel]);
  missionBank=[...(content.missions.missions||[])];
  examResultBank=content.responses.examResults||{};
  questionResultBank=content.responses.questionResults||{};
  procedureResultBank=content.responses.procedureResults||{};
  window.VALE_CONTENT_STATUS={...status,caseCount:cases.length,contentVersion:BUILD.version};
  diagnostics.info('content','Pacote clínico ativado.',{mode:status.mode,source:status.source||'unknown',caseCount:cases.length,warnings:status.warnings?.length||0});
  state.meta.contentMode=status.mode||'fallback';
}
applyGameContent(getFallbackContent(),{mode:'boot-fallback',warnings:[]});

let pwaStatus={displayMode:'browser',installAvailable:false,installed:false,fullscreen:false,online:navigator.onLine!==false,viewport:{width:innerWidth,height:innerHeight},orientation:'portrait'};
let pwaStatusKey='';
const mobileExperience=createMobileExperience({diagnostics,onChange:next=>{
  const key=[next.installAvailable,next.installed,next.fullscreen,next.online,next.displayMode].join(':');
  const shouldRender=pwaStatusKey&&key!==pwaStatusKey&&app?.dataset?.ready==='1';
  pwaStatus=next;pwaStatusKey=key;
  if(shouldRender)requestAnimationFrame(()=>render());
}});

function xpNeed(l){return 500+(l-1)*420}function syncProgress(){let p=state.player,lvl=1,spent=p.xp;while(spent>=xpNeed(lvl)&&lvl<20){spent-=xpNeed(lvl);lvl++}p.level=lvl;p.title=p.xp>=4200?'Especialista Vale':p.xp>=2600?'Médico Clínico':p.xp>=1400?'Residente R2':p.xp>=600?'Residente R1':'Interno';state.unlocks=state.unlocks||{specialties:['clinica-medica']};[['urgencia',2],['cardiologia',3],['pediatria',4]].forEach(x=>{if(p.level>=x[1]&&!state.unlocks.specialties.includes(x[0]))state.unlocks.specialties.push(x[0])});p.rank=Math.max(1,1248-Math.floor(p.xp/8)-(p.highScoreCases||0)*12);return{spent,next:xpNeed(lvl),pct:Math.min(100,Math.round(spent/xpNeed(lvl)*100))}}
function rep(sc){return sc>=90?'Excelente':sc>=78?'Boa':sc>=62?'Instável':'Em observação'}
function casesForSelectedSpecialty(){let filtered=cases.filter(c=>c.specialty===state.selectedSpec);if(!filtered.length){state.selectedSpec='clinica-medica';filtered=cases.filter(c=>c.specialty===state.selectedSpec);}return filtered.length?filtered:cases}
function activeCase(){const pool=casesForSelectedSpecialty();return pool[state.currentCase%pool.length]}function selected(type,val){return state.actions[type].includes(val)}
function addTime(kind){const cost={questions:3,exams:9,procedures:5,hypotheses:2,conduct:4}[kind]||2;state.simulation.minutes=Math.max(0,state.simulation.minutes-cost);if(kind==='exams'&&state.actions.exams.length>3)state.simulation.criticality+=2}
function toggleAction(type,val){let arr=state.actions[type];if(arr.includes(val)){state.actions[type]=arr.filter(x=>x!==val);state.encounter={kind:'Ação removida',title:'Registro atualizado',text:val+' foi removido do raciocínio ativo.',detail:'Ação removida pelo jogador.',time:minToClock()};toast('Ação removida','tap')}else{arr.push(val);addTime(type);state.encounter=clinicalResponse(type,val);if(type==='exams')state.popup=state.encounter;recordClinical(type,val,state.encounter);state.timeline.push({t:minToClock(),text:state.encounter.title+': '+val});toast(type==='exams'?'Resultado de exame liberado':'Resposta clínica registrada','ok')}save();render();setTimeout(focusClinicalPanel,80)}
function minToClock(){let m=720-state.simulation.minutes;let h=8+Math.floor(m/60),mi=m%60;return `${String(h).padStart(2,'0')}:${String(mi).padStart(2,'0')}`}
function esc(v){return String(v||'').replace(/[&<>\"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;',"'":'&#39;'}[m]||m))}
function defaultEncounter(){const c=activeCase();return {kind:'Queixa inicial',title:'Relato espontâneo do paciente',text:'Doutor(a), estou sentindo '+c.complaint+'.',detail:'Use perguntas, exames e procedimentos para transformar a queixa em raciocínio clínico.',time:minToClock()}}
function clinicalResponse(type,val){const c=activeCase();let text='',title='',detail='';if(type==='questions'){title='Resposta da anamnese';text=(questionResultBank[c.id]&&questionResultBank[c.id][val])||'Paciente responde, mas a informação não muda muito a hipótese principal neste momento.';detail='Pergunta feita: '+val}if(type==='exams'){title='Resultado de exame';text=(examResultBank[c.id]&&examResultBank[c.id][val])||val+': resultado sem alterações relevantes para a queixa atual. Pode representar exame de baixa utilidade neste caso.';detail='Exame solicitado: '+val}if(type==='procedures'){title='Achado do procedimento';text=procedureResultBank[val]||'Procedimento realizado sem intercorrências. Achado inespecífico.';detail='Procedimento: '+val}if(type==='hypotheses'){title='Hipótese diagnóstica registrada';text=val===c.diagnosis?'Hipótese forte: combina bem com queixa, sinais e achados obtidos até agora.':'Hipótese registrada, mas ainda exige evidências melhores para sustentar essa linha diagnóstica.';detail='Hipótese: '+val}if(type==='conduct'){title='Conduta registrada';text=c.idealConduct.includes(val)?'Conduta coerente com o caso. Ela contribui positivamente para segurança, seguimento e desfecho do paciente.':'Conduta anotada, porém pode não ser a prioridade ideal para este quadro. Revise a lógica clínica antes de finalizar.';detail='Conduta: '+val}return {kind:type,title,text,detail,time:minToClock()}}
function typeWriter(){const el=document.querySelector('#typewriter');if(!el)return;const txt=el.dataset.text||'';if(prefersReducedMotion(state.accessibility)){el.textContent=txt;return;}el.textContent='';let i=0;const step=()=>{el.textContent=txt.slice(0,i++);if(i<=txt.length)setTimeout(step,12)};step()}
function closePopup(){state.popup=null;save();render()}window.closePopup=closePopup;

function ensureClinicalState(){
  state.prontuario=state.prontuario||{history:[],exams:[],procedures:[],hypotheses:[],conduct:[],notes:[]};
  state.vitalTrend=state.vitalTrend||[];
}
function recordClinical(type,val,response){
  ensureClinicalState();
  const item={time:minToClock(),label:val,result:response.text,detail:response.detail||'',caseId:activeCase().id};
  const map={questions:'history',exams:'exams',procedures:'procedures',hypotheses:'hypotheses',conduct:'conduct'};
  const bucket=map[type]||'notes';
  state.prontuario[bucket].push(item);
  updateVitals(type,val);
}
function updateVitals(type,val){
  ensureClinicalState();
  const c=activeCase();
  const base={pa:c.vitals[0][1],fc:parseInt(c.vitals[1][1])||80,fr:parseInt(c.vitals[2][1])||16,temp:c.vitals[3][1],spo2:parseInt(c.vitals[4][1])||98,status:'Estável'};
  let step=state.vitalTrend.length;
  let stress=Math.max(0,state.simulation.criticality||0)+Math.max(0,state.actions.exams.length-3)*2;
  const next={time:minToClock(),pa:base.pa,fc:Math.min(150,base.fc+step*2+stress),fr:Math.min(32,base.fr+Math.floor(stress/3)),temp:base.temp,spo2:Math.max(86,base.spo2-Math.floor(stress/4)),status:stress>=12?'Crítico':stress>=7?'Atenção':'Estável'};
  if(type==='conduct' && activeCase().idealConduct.includes(val)){next.fc=Math.max(base.fc,next.fc-5);next.spo2=Math.min(99,next.spo2+1);next.status='Melhora clínica'}
  state.vitalTrend.push(next);
}
function clinicalRecords(){
  ensureClinicalState();
  const groups=[
    ['history','Anamnese','💬'],['exams','Exames','🧪'],['procedures','Procedimentos','⚕'],
    ['hypotheses','Hipóteses','🧠'],['conduct','Condutas','📋'],['notes','Notas','✎']
  ];
  return groups.flatMap(([bucket,label,icon])=>(state.prontuario[bucket]||[]).map((item,index)=>({...item,bucket,group:label,icon,index})))
    .sort((a,b)=>String(a.time).localeCompare(String(b.time)));
}
function latestVitals(){
  const c=activeCase();
  if(state.vitalTrend?.length)return state.vitalTrend[state.vitalTrend.length-1];
  return {time:minToClock(),pa:c.vitals[0]?.[1]||'—',fc:parseInt(c.vitals[1]?.[1])||80,fr:parseInt(c.vitals[2]?.[1])||16,temp:c.vitals[3]?.[1]||'—',spo2:parseInt(c.vitals[4]?.[1])||98,status:'Estável'};
}
function clinicalProgress(){
  const checks=[
    ['questions','Anamnese',state.actions.questions.length>0],
    ['exams','Exames',state.actions.exams.length>0],
    ['procedures','Procedimentos',state.actions.procedures.length>0],
    ['diagnosis','Diagnóstico',state.actions.hypotheses.length>0],
    ['conduct','Conduta',state.actions.conduct.length>0]
  ];
  const complete=checks.filter(x=>x[2]).length;
  return {checks,complete,pct:Math.round(complete/checks.length*100),actions:Object.values(state.actions).reduce((sum,list)=>sum+list.length,0)};
}
function workflowBar(){
  const progress=clinicalProgress();
  const map={questions:'questions',exams:'exams',procedures:'procedures',diagnosis:'diagnosis',conduct:'diagnosis'};
  return `<section class="clinical-workflow panel"><div class="workflow-copy"><small>FLUXO DO ATENDIMENTO</small><b>${progress.complete}/5 etapas documentadas</b><div class="workflow-meter"><i style="width:${progress.pct}%"></i></div></div><div class="workflow-steps">${progress.checks.map(([id,label,done],index)=>`<button class="workflow-step ${done?'done':''}" aria-label="Etapa ${index+1}: ${label}${done?', concluída':''}" onclick="setShiftTab('${map[id]}')"><span>${done?'✓':index+1}</span><small>${label}</small></button>`).join('')}</div><button class="results-center-btn" onclick="toggleResultsCenter()">▤ <span>Resultados</span><b>${state.prontuario.exams.length+state.prontuario.procedures.length}</b></button></section>`;
}
function patientCommandHeader(){
  const c=activeCase(),v=latestVitals();
  return `<section class="patient-command panel"><div class="patient-command-id"><span class="status-beacon ${String(v.status).toLowerCase().includes('crít')?'critical':String(v.status).toLowerCase().includes('aten')?'attention':'stable'}"></span><div><small>PACIENTE EM ATENDIMENTO</small><h2>${esc(c.patient)}</h2><p>${c.age} anos • ${esc(c.sex)} • ${esc(c.profession)} • ${esc(specs.find(x=>x[0]===state.selectedSpec)?.[1]||'Clínica Médica')}</p></div></div><div class="command-vitals"><div><small>PA</small><b>${esc(v.pa)}</b></div><div><small>FC</small><b>${v.fc}</b></div><div><small>SpO₂</small><b>${v.spo2}%</b></div><div><small>Estado</small><b>${esc(v.status)}</b></div></div><div class="command-clock"><small>TEMPO CLÍNICO</small><b>${minToClock()}</b><em>Criticidade ${state.simulation.criticality}</em></div></section>`;
}
function recordTabs(){
  const tabs=[['overview','Visão geral'],['history','Anamnese'],['results','Resultados'],['plan','Hipóteses/Plano'],['vitals','Sinais vitais'],['timeline','Linha do tempo']];
  return `<nav class="record-tabs" role="tablist" aria-label="Seções do prontuário">${tabs.map(([id,label])=>`<button role="tab" aria-selected="${state.ui.recordTab===id}" class="${state.ui.recordTab===id?'active':''}" onclick="setRecordTab('${id}')">${label}</button>`).join('')}</nav>`;
}
function recordItems(items,empty){
  return items.length?`<div class="record-feed">${items.slice().reverse().map(x=>`<article class="record-entry"><div><span>${x.icon||'•'}</span><b>${esc(x.label)}</b><time>${esc(x.time)}</time></div><p>${esc(x.result)}</p>${x.detail?`<small>${esc(x.detail)}</small>`:''}</article>`).join('')}</div>`:`<div class="record-empty"><b>Nenhum registro</b><p>${empty}</p></div>`;
}
function recordOverview(){
  const c=activeCase(),all=clinicalRecords();
  const activeHyp=state.actions.hypotheses;
  const activeConduct=state.actions.conduct;
  return `<div class="record-overview"><div class="record-summary premium"><small>QUEIXA PRINCIPAL</small><h3>${esc(c.complaint)}</h3><p>${esc((state.encounter||defaultEncounter()).text)}</p></div><div class="record-kpis"><div><small>Perguntas</small><b>${state.actions.questions.length}</b></div><div><small>Exames</small><b>${state.actions.exams.length}</b></div><div><small>Procedimentos</small><b>${state.actions.procedures.length}</b></div><div><small>Registros</small><b>${all.length}</b></div></div><section class="active-clinical-plan"><div><small>HIPÓTESES ATIVAS</small>${activeHyp.length?`<div class="clinical-chips">${activeHyp.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:'<p>Nenhuma hipótese selecionada.</p>'}</div><div><small>CONDUTAS ATIVAS</small>${activeConduct.length?`<div class="clinical-chips conduct">${activeConduct.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:'<p>Nenhuma conduta selecionada.</p>'}</div></section><h4>Últimos registros</h4>${recordItems(all.slice(-4),'As ações clínicas aparecerão aqui em ordem cronológica.')}</div>`;
}
function prontuarioPanel(){
  ensureClinicalState();
  const c=activeCase();
  const tab=state.ui.recordTab||'overview';
  const records=clinicalRecords();
  const by=bucket=>records.filter(x=>x.bucket===bucket);
  let body='';
  if(tab==='overview')body=recordOverview();
  if(tab==='history')body=recordItems(by('history'),'Faça perguntas dirigidas ou registre uma observação clínica.');
  if(tab==='results')body=recordItems([...by('exams'),...by('procedures')].sort((a,b)=>String(a.time).localeCompare(String(b.time))),'Exames e procedimentos aparecerão nesta central.');
  if(tab==='plan')body=recordItems([...by('hypotheses'),...by('conduct')].sort((a,b)=>String(a.time).localeCompare(String(b.time))),'Registre hipóteses e condutas antes do encerramento.');
  if(tab==='vitals')body=vitalChart();
  if(tab==='timeline')body=recordItems(records,'Nenhuma ação clínica registrada.');
  return `<div class="record-grid premium-record"><div class="record-head"><div><small>PRONTUÁRIO ELETRÔNICO</small><h3>${esc(c.patient)}</h3><p>${c.age} anos • ${esc(c.sex)} • Caso ${esc(c.id)}</p></div><button class="record-result-shortcut" onclick="toggleResultsCenter()">Abrir central de resultados</button></div>${recordTabs()}<div class="record-tab-body">${body}</div></div>`;
}
function vitalChart(){
  ensureClinicalState();
  const data=state.vitalTrend.slice(-8);
  if(!data.length)return `<div class="record-empty vital-empty"><b>Sem tendência registrada</b><p>Os sinais vitais evolutivos serão registrados conforme as ações clínicas.</p></div>`;
  const maxFc=Math.max(...data.map(x=>x.fc),100);
  return `<div class="vital-chart premium"><div class="vital-chart-legend"><span>Frequência cardíaca</span><span>SpO₂ e estado</span></div>${data.map(x=>`<div class="vital-row"><span>${x.time}</span><i style="width:${Math.round((x.fc/maxFc)*100)}%"></i><b>FC ${x.fc}</b><em>SpO₂ ${x.spo2}% • ${esc(x.status)}</em></div>`).join('')}</div>`;
}
function resetEncounterData(){state.actions={questions:[],exams:[],procedures:[],hypotheses:[],conduct:[]};state.timeline=[];state.encounter=null;state.popup=null;state.prontuario={history:[],exams:[],procedures:[],hypotheses:[],conduct:[],notes:[]};state.vitalTrend=[];state.ui.resultsOpen=false;state.ui.closureReview=false;state.ui.recordTab='overview';state.ui.shiftTab='summary';}

function clinicalPanel(){const e=state.encounter||defaultEncounter();return '<div class="clinical-board '+(e.kind==='exams'?'exam-mode':'')+'"><div class="board-head"><small>'+esc(e.kind)+'</small><b>'+esc(e.title)+'</b><time>'+esc(e.time||minToClock())+'</time></div><p id="typewriter" data-text="'+esc(e.text)+'"></p><div class="board-detail">'+esc(e.detail||'')+'</div></div>'}
function resultsCenterHtml(){
  if(!state.ui.resultsOpen)return '';
  const items=clinicalRecords().filter(x=>['exams','procedures'].includes(x.bucket)).reverse();
  return `<div class="modal-back results-center-back"><section class="results-center pop" role="dialog" aria-modal="true" aria-labelledby="results-center-title" tabindex="-1"><header><div><small>CENTRAL CLÍNICA</small><h2 id="results-center-title">Resultados e procedimentos</h2><p>Histórico preservado em ordem de liberação.</p></div><button class="modal-x" onclick="toggleResultsCenter()" aria-label="Fechar central de resultados">×</button></header>${items.length?`<div class="results-list">${items.map(x=>`<article><div class="result-icon">${x.icon}</div><div><small>${esc(x.group)} • ${esc(x.time)}</small><h3>${esc(x.label)}</h3><p>${esc(x.result)}</p><em>${esc(x.detail||'Registro clínico confirmado.')}</em></div></article>`).join('')}</div>`:'<div class="record-empty"><b>Nenhum resultado disponível</b><p>Solicite exames ou realize procedimentos para alimentar esta central.</p></div>'}<footer><button class="btn" onclick="setRecordTab('results');toggleResultsCenter();setShiftTab('record')">Abrir no prontuário</button><button class="btn primary" onclick="toggleResultsCenter()">Voltar ao atendimento</button></footer></section></div>`;
}
function popupHtml(){if(!state.popup)return '';const p=state.popup;return '<div class="modal-back"><div class="result-modal pop" role="dialog" aria-modal="true" aria-labelledby="result-modal-title" tabindex="-1"><button class="modal-x" onclick="closePopup()" aria-label="Fechar resultado">×</button><small>'+esc(p.kind)+'</small><h2 id="result-modal-title">'+esc(p.title)+'</h2><p>'+esc(p.text)+'</p><em>'+esc(p.detail)+'</em><div class="modal-actions"><button class="btn" onclick="closePopup();toggleResultsCenter()">Ver histórico</button><button class="btn primary" onclick="closePopup()">Continuar</button></div></div></div>'}
function closureReviewHtml(){
  if(!state.ui.closureReview)return '';
  const c=activeCase(),progress=clinicalProgress();
  const warnings=[];
  if(!state.actions.questions.length)warnings.push('Nenhuma pergunta dirigida registrada.');
  if(!state.actions.hypotheses.length)warnings.push('Nenhuma hipótese diagnóstica selecionada.');
  if(!state.actions.conduct.length)warnings.push('Nenhuma conduta selecionada.');
  return `<div class="modal-back"><section class="closure-review pop" role="dialog" aria-modal="true" aria-labelledby="closure-review-title" tabindex="-1"><header><small>REVISÃO DE ENCERRAMENTO</small><h2 id="closure-review-title">Confirmar conclusão da consulta?</h2><p>Revise o raciocínio ativo antes de registrar o desfecho.</p></header><div class="closure-grid"><div><small>PACIENTE</small><b>${esc(c.patient)}</b></div><div><small>ETAPAS</small><b>${progress.complete}/5</b></div><div><small>AÇÕES</small><b>${progress.actions}</b></div><div><small>TEMPO</small><b>${minToClock()}</b></div></div><section><small>HIPÓTESES ATIVAS</small>${state.actions.hypotheses.length?`<div class="clinical-chips">${state.actions.hypotheses.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:'<p>Nenhuma hipótese selecionada.</p>'}</section><section><small>CONDUTAS ATIVAS</small>${state.actions.conduct.length?`<div class="clinical-chips conduct">${state.actions.conduct.map(x=>`<span>${esc(x)}</span>`).join('')}</div>`:'<p>Nenhuma conduta selecionada.</p>'}</section>${warnings.length?`<div class="closure-warnings"><b>Atenção antes de concluir</b>${warnings.map(x=>`<p>• ${esc(x)}</p>`).join('')}</div>`:'<div class="closure-ready">✓ Documentação mínima registrada.</div>'}<footer><button class="btn" onclick="cancelFinishReview()">Continuar atendimento</button><button class="btn primary" onclick="confirmFinishCase()">Confirmar e encerrar</button></footer></section></div>`;
}
function count(a,b){return a.filter(x=>b.includes(x)).length}function calcScore(){const c=activeCase();let q=count(state.actions.questions,c.correctQuestions),e=count(state.actions.exams,c.correctExams),pr=count(state.actions.procedures,c.correctProcedures),co=count(state.actions.conduct,c.idealConduct);let diag=state.actions.hypotheses.includes(c.diagnosis)?25:0;let excess=Math.max(0,state.actions.exams.length-c.correctExams.length)*6;let missingConduct=Math.max(0,c.idealConduct.length-co)*4;return Math.max(15,Math.min(100,Math.round(q*6+e*7+pr*5+co*6+diag+10-excess-missingConduct-state.simulation.criticality)))}
function finishCaseCore(){state.ui.closureReview=false;state.ui.resultsOpen=false;const c=activeCase(),sc=calcScore();state.score=sc;state.completed.push({id:c.id,score:sc,at:BUILD.label});state.player.xp+=Math.round(c.xp*(sc/100));state.player.credits+=sc>=80?110:60;state.player.patients++;if(sc>=80)state.player.highScoreCases++;state.player.streak=sc>=75?state.player.streak+1:0;state.player.correct=Math.round((state.player.correct+sc)/2);state.player.reputation=rep(sc);state.currentCase=(state.currentCase+1)%casesForSelectedSpecialty().length;syncProgress();save();go('post')}
function missionProgress(m){return Math.min(m.goal,state.player[m.metric]||0)}function canClaim(m){return missionProgress(m)>=m.goal&&!state.missions.claimed.includes(m.id)}function claimMission(id){let m=missionBank.find(x=>x.id===id);if(!m||!canClaim(m))return toast('Missão ainda não concluída','warn');state.missions.claimed.push(id);state.player.xp+=m.rewardXp;state.player.credits+=m.rewardCredits;syncProgress();save();toast('Recompensa coletada!','level');render()}
function logo(){return `<div class="brand"><div class="pulse-line"></div><div class="logo"><span>Simulador de</span><b>Medicina</b></div><small>VALE EDITION • MODO SIMULADOR</small></div>`}
function profile(){let p=state.player,pr=syncProgress();return `<div class="profile panel" aria-label="Perfil do jogador"><img src="${av(p.avatar)}" alt="Avatar de ${esc(p.name)}"><div><strong>${esc(p.name)}</strong><em>${esc(p.title)} • Nível ${p.level}</em><div class="xp" role="progressbar" aria-label="Progresso de experiência" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pr.pct}"><i style="width:${pr.pct}%"></i></div><small>${pr.spent} / ${pr.next} XP • Rep. ${esc(p.reputation)}</small></div></div>`}
function top(section){const offline=!pwaStatus.online;return `<header class="topbar">${logo()}<div class="top-actions"><button class="hamb" onclick="toggleDrawer()" aria-label="Abrir menu principal" aria-expanded="${state.drawer}">☰</button>${pwaStatus.installAvailable&&!state.pwa.installDismissed?'<button class="install-btn" onclick="installGame()" aria-label="Instalar aplicativo">⬇ <span>Instalar</span></button>':''}<button class="fullscreen-btn" onclick="requestGameFullscreen()" aria-label="${pwaStatus.fullscreen?'Sair da tela cheia':'Ativar tela cheia'}" title="${pwaStatus.fullscreen?'Sair da tela cheia':'Tela cheia'}">${pwaStatus.fullscreen?'⤢':'⛶'}</button></div><h2 id="screen-title">${section}</h2><div class="runtime-pill ${offline?'offline':'online'}" role="status" aria-live="polite"><i aria-hidden="true"></i>${offline?'Offline':'Online'} • ${pwaStatus.displayMode==='browser'?'Navegador':'App'}</div>${profile()}</header>`}
function slug(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function shell(section,body,bgNum=8){return `<a class="skip-link" href="#main-content">Pular para o conteúdo principal</a><main id="main-content" tabindex="-1" class="screen fade screen-${slug(section)}" style="--bg:url('${bg(bgNum)}')" aria-labelledby="screen-title">${top(section)}${body}<div class="build" aria-label="Versão do aplicativo">${BUILD.label}</div></main>`}
function sidebar(active){let items=[['hub','🏠','Lobby','Visão geral'],['learning','📖','Aprendizagem','Procedimentos'],['specialty','🩺','Plantão','Especialidades'],['settings','⚙️','Configurações','Sistema']];return `<aside class="side panel ${state.drawer?'open':''}" aria-label="Navegação principal">${items.map(x=>`<button onclick="go('${x[0]}')" class="nav ${active==x[0]?'active':''}" ${active==x[0]?'aria-current="page"':''}><span>${x[1]}</span><b>${x[2]}</b><small>${x[3]}</small></button>`).join('')}</aside><div class="shade ${state.drawer?'show':''}" onclick="toggleDrawer()"></div>`}
function setup(){app.innerHTML=`<a class="skip-link" href="#main-content">Pular para o conteúdo principal</a><main id="main-content" tabindex="-1" class="screen fade" style="--bg:url('${bg(1)}')">${logo()}<img class="hero-doc" src="${av(state.player.avatar)}"><section class="setup panel pop" aria-labelledby="setup-title"><h3 id="setup-title">🫀 NOVO GAME</h3><h2>1. Escolha seu avatar</h2><div class="avatar-row" role="group" aria-label="Avatares disponíveis">${[1,2,3,4,5].map(i=>`<button class="avatar-choice ${state.player.avatar==i?'active':''}" onclick="pickAvatar(${i})" aria-label="Selecionar avatar ${i}" aria-pressed="${state.player.avatar==i}"><img src="${av(i)}" alt="Avatar ${i}"></button>`).join('')}</div><h2>2. Nome do personagem</h2><label class="sr-only" for="name">Nome do personagem</label><input class="input" id="name" value="${esc(state.player.name)}" autocomplete="name"><h2>3. País de origem</h2><label class="sr-only" for="country">País de origem</label><select class="input" id="country"><option>🇧🇷 Brasil</option></select><button class="btn primary" onclick="startGame()">🫀 Continuar</button></section><div class="build">${BUILD.label}</div></main>`}
function menu(){app.innerHTML=`<a class="skip-link" href="#main-content">Pular para o conteúdo principal</a><main id="main-content" tabindex="-1" class="screen fade" style="--bg:url('${bg(2)}')">${logo()}<section class="welcome slide"><h1>Bem-vindo,<br><span>${state.player.short}</span></h1><p>O conhecimento é a sua maior ferramenta. Cada decisão pode mudar uma vida.</p></section><section class="mode-grid"><article class="mode card" style="--cardbg:url('${bg(3)}')"><h2>Modo Carreira</h2><p>Progressão real, reputação, missões e desbloqueios.</p><button class="btn primary" onclick="go('hub')">Entrar</button></article><article class="mode card" style="--cardbg:url('${bg(7)}')"><h2>Modo Simulador</h2><p>Casos mais rigorosos, tempo clínico e penalidade por excesso de exames.</p><button class="btn" onclick="go('specialty')">Praticar</button></article></section><div class="build">${BUILD.label}</div></main>`}
function hub(){let p=state.player,pr=syncProgress();app.innerHTML=shell('LOBBY DO RESIDENTE',`<div class="layout">${sidebar('hub')}<section class="maincol"><div class="hero-card card" style="--cardbg:url('${bg(8)}')"><h1>Bem-vindo, ${p.short}</h1><p>v0.15.0: design system consistente, acessibilidade configurável, foco visível e navegação por teclado.</p><div class="level medallion">${p.level}</div><div class="stats"><div>🏆<b>${p.xp}</b><small>XP total</small></div><div>🌐<b>#${p.rank}</b><small>Ranking local</small></div><div>👥<b>${p.patients}</b><small>Pacientes</small></div><div>🎯<b>${p.correct}%</b><small>Acerto</small></div></div></div><div class="two"><div class="card"><h3>Progresso da carreira</h3><p>${p.title} • Reputação ${p.reputation}</p><div class="xp big"><i style="width:${pr.pct}%"></i></div><p>${pr.spent} / ${pr.next} XP • Desbloqueadas: ${state.unlocks.specialties.join(', ')}</p><button class="btn primary" onclick="go('specialty')">Iniciar plantão</button></div><div class="card"><h3>Últimos casos</h3>${state.completed.slice(-4).reverse().map(x=>`<p>✅ ${x.id} <b>${x.score}/100</b></p>`).join('')||'<p>Nenhum caso concluído nesta build.</p>'}</div></div></section><aside class="rightcol"><div class="card"><h3>Missões e recompensas</h3>${missionBank.map(m=>`<div class='mission'><b>${m.type}</b><span>${m.title}</span><small>${missionProgress(m)} / ${m.goal}</small><button class='btn mini' onclick="claimMission('${m.id}')" ${canClaim(m)?'':'disabled'}>Coletar</button></div>`).join('')}</div><div class="card"><h3>Economia</h3><h2>${p.credits} créditos</h2><p>Base pronta para loja futura, cosméticos e packs.</p></div></aside></div>`,8)}
function specialty(){app.innerHTML=shell('PLANTÃO — ESPECIALIDADE',`<div class="layout">${sidebar('specialty')}<section class="maincol"><h1>Escolha sua especialidade</h1><p class="muted">Modo simulador: especialidades desbloqueiam por nível.</p><div class="specialties">${specs.map(s=>{const levelLocked=state.player.level<s[6],hasCases=cases.some(c=>c.specialty===s[0]),locked=levelLocked||!hasCases;const reason=levelLocked?'Desbloqueia no nível '+s[6]:'Conteúdo em preparação';return `<button type="button" class="spec card ${locked?'locked':''}" onclick="${locked?`toast('${reason}','warn')`:`state.selectedSpec='${s[0]}';state.currentCase=0;resetEncounterData();go('shift')`}" aria-label="${esc(s[1])}. ${esc(locked?reason:'Disponível com '+cases.filter(c=>c.specialty===s[0]).length+' casos')}"><img src="${s[5]}" alt=""><span aria-hidden="true">${s[3]}</span><h2>${esc(s[1])}</h2><p>${esc(s[2])}</p><b>${esc(locked?reason:'Disponível • '+cases.filter(c=>c.specialty===s[0]).length+' caso(s)')}</b></button>`}).join('')}</div></section><aside class="rightcol"><div class="card"><h3>Regras simulador</h3><p>Exame desnecessário, conduta incompleta e demora reduzem seu score.</p></div><button class="btn primary" onclick="resetEncounterData();go('specialty')">Iniciar plantão</button></aside></div>`,4)}
function patientQueuePanel(c){return `<aside class="patient-list panel shift-panel panel-queue"><div class="panel-mobile-head"><button class="mobile-back-tab" onclick="setShiftTab('summary')">← Resumo</button><b>Fila de atendimento</b></div><div class="queue-head"><div><small>FLUXO DO SETOR</small><h3>Fila de atendimento</h3></div><b>${patients.length}</b></div><div class="patient-scroll">${patients.map((p,i)=>`<div class="patient ${p==c.patient?'active':''}" ${p==c.patient?'aria-current="true"':''}><span>${String(i+1).padStart(2,'0')}</span><div><b>${p}</b><small>${p==c.patient?'Em atendimento':'Aguardando'}</small></div><time>${['08:15','09:10','09:45','10:20','11:05','11:40','12:22'][i]||'18:'+String(i*5).padStart(2,'0')}</time></div>`).join('')}</div><button class="btn desktop-finish" onclick="requestFinishCase()">Revisar e finalizar</button></aside>`}
function patientSummaryPanel(c){return `<section class="case panel shift-panel panel-summary"><div class="patient-summary-grid"><div class="patient-portrait-wrap"><img class="patient-art" src="${ui((state.currentCase%3)+1)}" alt="Representação visual de ${esc(c.patient)}"><span>${esc(latestVitals().status)}</span></div><div class="patient-summary-copy"><small>QUEIXA PRINCIPAL</small><h3>${esc(c.complaint)}</h3><p>Use a entrevista, os exames e os procedimentos para construir uma hipótese segura.</p>${clinicalPanel()}</div></div><div class="card vitals"><h3>Sinais vitais iniciais</h3>${c.vitals.map(v=>`<div><small>${v[0]}</small><b>${v[1]}</b><small>${v[2]}</small></div>`).join('')}</div><button class="btn primary mobile-next-step" onclick="setShiftTab('questions')">Iniciar anamnese →</button></section>`}
function questionPanel(q){return `<section class="card shift-panel panel-questions"><div class="panel-mobile-head"><button class="mobile-back-tab" onclick="setShiftTab('summary')">← Resumo</button><b>Anamnese dirigida</b></div><div class="action-section-head"><div><small>ETAPA 1</small><h3>Anamnese dirigida</h3><p>Selecione perguntas clinicamente relevantes. Cada escolha avança o tempo.</p></div><b>${state.actions.questions.length}</b></div>${q.map(x=>`<button class="listbtn ${selected('questions',x)?'selected':''}" onclick="toggleAction('questions','${x}')"><span>💬</span><b>${x}</b><i>${selected('questions',x)?'Registrada':'Perguntar'}</i></button>`).join('')}<div class="clinical-note-box"><label for="clinical-note">Observação livre no prontuário</label><div><input id="clinical-note" class="input" maxlength="180" placeholder="Ex.: paciente demonstra ansiedade durante a entrevista"><button class="btn" onclick="submitClinicalNote()">Registrar</button></div></div><button class="btn primary mobile-next-step" onclick="setShiftTab('exams')">Seguir para exames →</button></section>`}
function actionCard(kind,title,stage,items,icon,next,nextLabel){return `<div class="card action-card action-${kind}"><div class="panel-mobile-head"><button class="mobile-back-tab" onclick="setShiftTab('${kind==='exams'?'questions':kind==='procedures'?'exams':'procedures'}')">← Voltar</button><b>${title}</b></div><div class="action-section-head"><div><small>ETAPA ${stage}</small><h3>${title}</h3><p>${kind==='exams'?'Solicite apenas exames que possam alterar sua decisão clínica.':'Registre procedimentos relevantes ao caso.'}</p></div><b>${state.actions[kind].length}</b></div>${items.map(x=>`<button class="listbtn ${selected(kind,x)?'selected':''}" onclick="toggleAction('${kind}','${x}')"><span>${icon}</span><b>${x}</b><i>${selected(kind,x)?'Selecionado':'Adicionar'}</i></button>`).join('')}<button class="btn primary mobile-next-step" onclick="setShiftTab('${next}')">${nextLabel} →</button></div>`}
function diagnosisCard(){return `<div class="card action-card action-diagnosis"><div class="panel-mobile-head"><button class="mobile-back-tab" onclick="setShiftTab('procedures')">← Procedimentos</button><b>Diagnóstico e conduta</b></div><div class="action-section-head"><div><small>ETAPAS 4 E 5</small><h3>Hipóteses e plano</h3><p>Defina o raciocínio ativo e a conduta antes da revisão final.</p></div><b>${state.actions.hypotheses.length+state.actions.conduct.length}</b></div><h4 class="action-subtitle">Hipóteses diagnósticas</h4>${hypotheses.map(x=>`<button class="listbtn ${selected('hypotheses',x)?'selected':''}" onclick="toggleAction('hypotheses','${x}')"><span>🧠</span><b>${x}</b><i>${selected('hypotheses',x)?'Ativa':'Considerar'}</i></button>`).join('')}<h4 class="action-subtitle">Condutas</h4>${conducts.map(x=>`<button class="listbtn ${selected('conduct',x)?'selected':''}" onclick="toggleAction('conduct','${x}')"><span>📋</span><b>${x}</b><i>${selected('conduct',x)?'Ativa':'Selecionar'}</i></button>`).join('')}<button class="btn primary finish-review-btn" onclick="requestFinishCase()">Revisar e encerrar consulta</button></div>`}
function mobileClinicalStrip(){const e=state.encounter||defaultEncounter();return `<div class="mobile-clinical-strip ${e.kind==='exams'?'exam-mode':''}"><small>${esc(e.kind)}</small><b>${esc(e.title)}</b><p>${esc(e.text)}</p></div>`}
function shiftTabs(){const tabs=[['summary','👤','Resumo'],['questions','💬','Anamnese'],['exams','🧪','Exames'],['procedures','⚕','Procedimentos'],['diagnosis','📋','Diagnóstico'],['record','🗂','Prontuário'],['queue','👥','Fila']];return `<nav class="shift-mobile-tabs" role="tablist" aria-label="Etapas do atendimento">${tabs.map(([id,icon,label])=>`<button role="tab" aria-label="${label}" aria-selected="${state.ui.shiftTab===id}" class="shift-tab ${state.ui.shiftTab===id?'active':''}" onclick="setShiftTab('${id}')"><span aria-hidden="true">${icon}</span><small>${label}</small></button>`).join('')}</nav>`}
function shift(){
  const c=activeCase(),q=directedQuestions,activeTab=state.ui.shiftTab||'summary';
  app.innerHTML=shell('PLANTÃO - MODO SIMULADOR',`${patientCommandHeader()}${workflowBar()}<div class="shift shift-tab-${activeTab}">${shiftTabs()}${mobileClinicalStrip()}${patientQueuePanel(c)}${patientSummaryPanel(c)}<section class="panel shift-panel panel-record"><div class="panel-mobile-head"><button class="mobile-back-tab" onclick="setShiftTab('summary')">← Resumo</button><b>Prontuário eletrônico</b></div>${prontuarioPanel()}</section>${questionPanel(q)}<aside class="rightpanel">${actionCard('exams','Exames complementares','2',exams,'🧪','procedures','Seguir para procedimentos')}${actionCard('procedures','Procedimentos','3',procedures,'⚕','diagnosis','Seguir para diagnóstico')}${diagnosisCard()}</aside></div>${popupHtml()}${resultsCenterHtml()}${closureReviewHtml()}<div class="hud"><b>Hora ${minToClock()}</b><b>Atendidos ${state.player.patients}</b><b>Ações ${clinicalProgress().actions}</b><b class="predicted-score">Etapas ${clinicalProgress().complete}/5</b><button class="btn" onclick="toggleResultsCenter()">Resultados</button></div><div class="mobile-shift-dock"><button onclick="setShiftTab('queue')">👥 <small>Fila</small></button><button onclick="setShiftTab('record')">🗂 <small>Prontuário</small></button><button class="dock-finish" onclick="requestFinishCase()">✓ <small>Revisar</small></button></div>`,5);
}
function post(){
  const last=state.completed[state.completed.length-1]||{score:state.score||88,id:'hipertensao-1'},c=cases.find(x=>x.id==last.id)||cases[0],sc=last.score;
  const q=count(state.actions.questions,c.correctQuestions),e=count(state.actions.exams,c.correctExams),pr=count(state.actions.procedures,c.correctProcedures),co=count(state.actions.conduct,c.idealConduct);
  const metrics=[['Raciocínio',Math.min(100,Math.round((q/Math.max(1,c.correctQuestions.length))*100))],['Exames',Math.min(100,Math.round((e/Math.max(1,c.correctExams.length))*100))],['Procedimentos',Math.min(100,Math.round((pr/Math.max(1,c.correctProcedures.length))*100))],['Conduta',Math.min(100,Math.round((co/Math.max(1,c.idealConduct.length))*100))]];
  app.innerHTML=shell('PÓS-CONSULTA',`<section class="post premium-post"><div class="card post-patient"><small>CONSULTA CONCLUÍDA</small><div class="post-patient-id"><img class="portrait" src="${ui(2)}"><div><h2>${esc(c.patient)}</h2><p>${esc(c.complaint)}</p></div></div><div class="success">Diagnóstico de referência: ${esc(c.diagnosis)}</div><div class="post-badges"><span>Reputação ${esc(state.player.reputation)}</span><span>Sequência ${state.player.streak}</span><span>${Math.round(c.xp*(sc/100))} XP</span></div></div><div class="card score premium-score"><small>DESEMPENHO GLOBAL</small><div class="ring">${sc}<small>/100</small></div><h1>${sc>=85?'Excelente condução':sc>=70?'Bom desempenho':'Revisão recomendada'}</h1><p>A pontuação considera relevância clínica, excesso de ações, hipótese, conduta e evolução do atendimento.</p><div class="metric-bars">${metrics.map(([label,value])=>`<div><span><b>${label}</b><em>${value}%</em></span><i><u style="width:${value}%"></u></i></div>`).join('')}</div></div><aside class="card post-debrief"><small>DEBRIEFING DO CASO</small><h3>Linha do tempo clínica</h3><div class="post-timeline">${state.timeline.slice(-10).map(x=>`<p><time>${x.t}</time><span>${esc(x.text)}</span></p>`).join('')||'<p><span>Consulta registrada.</span></p>'}</div><div class="post-reward"><b>Recompensas</b><span>⭐ +${Math.round(c.xp*(sc/100))} XP</span><span>💰 +${sc>=80?110:60} créditos</span></div><button class="btn primary" onclick="resetEncounterData();go('shift')">Próximo paciente</button><button class="btn" onclick="go('hub')">Voltar ao lobby</button></aside></section>`,7);
}
function learning(){app.innerHTML=shell('APRENDIZAGEM MÉDICA',`<div class="layout">${sidebar('learning')}<section class="maincol"><h1>Aprendizagem integrada</h1><div class='card'><h3>v0.15.0 Design System e Acessibilidade</h3><p>Completar módulos melhora missões, XP, domínio clínico e ajuda a manter sequência de bons atendimentos.</p></div><div class="procedure card"><img src="${ui(3)}"><div><h2>Cateterismo venoso periférico <small>Básico</small></h2><p>Procedimento para acesso venoso periférico para medicamentos, hidratação ou coleta de exames.</p><p>✅ Indicação • ✅ Materiais • ✅ Técnica segura • ✅ Complicações</p><button class="btn primary" onclick="state.player.learnedModules++;state.player.xp+=60;syncProgress();save();toast('Módulo concluído +60 XP');render()">Marcar como concluído</button></div></div><div class="card"><h3>Todos os procedimentos</h3>${['Coleta de sangue venoso ✅ 100%','Intubação orotraqueal 🟡 60%','Eletrocardiograma (ECG) ✅ 100%','Sutura simples ⚪ 0%','Ultrassonografia POCUS 🟡 20%'].map(x=>`<p>${x}</p>`).join('')}</div></section><aside class="rightcol"><div class="card"><h3>Seu progresso</h3><div class="ring small">${state.player.learnedModules}</div><p>Módulos concluídos</p></div></aside></div>`,9)}
function accessibilitySettingsCard(){
  const a=state.accessibility;
  const sizeOptions=[['small','Pequeno'],['medium','Médio'],['large','Grande'],['extra-large','Muito grande']];
  return `<section class="card a11y-card" aria-labelledby="a11y-title"><div class="settings-card-head"><div><small>ACESSIBILIDADE</small><h2 id="a11y-title">Leitura, movimento e navegação</h2><p>As preferências são aplicadas imediatamente e salvas junto com o progresso.</p></div><span class="a11y-badge">WCAG-ready</span></div><fieldset class="settings-fieldset"><legend>Tamanho do texto</legend><div class="segmented-control" role="group" aria-label="Tamanho do texto">${sizeOptions.map(([id,label])=>`<button class="segment ${a.textSize===id?'active':''}" data-a11y-key="textSize" data-a11y-value="${id}" aria-pressed="${a.textSize===id}" onclick="setAccessibility('textSize','${id}')">${label}</button>`).join('')}</div></fieldset><fieldset class="settings-fieldset"><legend>Contraste</legend><div class="segmented-control" role="group" aria-label="Contraste da interface"><button class="segment ${a.contrast==='standard'?'active':''}" data-a11y-key="contrast" data-a11y-value="standard" aria-pressed="${a.contrast==='standard'}" onclick="setAccessibility('contrast','standard')">Padrão</button><button class="segment ${a.contrast==='high'?'active':''}" data-a11y-key="contrast" data-a11y-value="high" aria-pressed="${a.contrast==='high'}" onclick="setAccessibility('contrast','high')">Alto contraste</button></div></fieldset><div class="settings-switches"><button class="setting-switch" data-a11y-key="reduceMotion" data-a11y-value="${!a.reduceMotion}" aria-pressed="${a.reduceMotion}" onclick="setAccessibility('reduceMotion',${!a.reduceMotion})"><span><b>Reduzir movimento</b><small>Remove transições, pulsos e efeito de digitação.</small></span><i aria-hidden="true"></i></button><button class="setting-switch" data-a11y-key="focusMode" data-a11y-value="${!a.focusMode}" aria-pressed="${a.focusMode}" onclick="setAccessibility('focusMode',${!a.focusMode})"><span><b>Foco reforçado</b><small>Destaca o elemento ativo para teclado e controle.</small></span><i aria-hidden="true"></i></button><button class="setting-switch" data-a11y-key="descriptions" data-a11y-value="${!a.descriptions}" aria-pressed="${a.descriptions}" onclick="setAccessibility('descriptions',${!a.descriptions})"><span><b>Descrições textuais</b><small>Mantém rótulos e estados clínicos explícitos.</small></span><i aria-hidden="true"></i></button><button class="setting-switch" data-a11y-key="sound" data-a11y-value="${!state.sound}" aria-pressed="${state.sound}" onclick="setGameSound(${!state.sound})"><span><b>Sons de interface</b><small>Ativa sinais sonoros curtos de confirmação.</small></span><i aria-hidden="true"></i></button></div><div class="a11y-preview" aria-label="Prévia das configurações"><small>PRÉVIA</small><h3>Informação clínica legível</h3><p>Use Tab para avançar, Shift + Tab para voltar, setas nas abas e Esc para fechar janelas.</p><button class="btn primary" onclick="announceAccessibilityPreview()">Testar anúncio</button><button class="btn ghost" onclick="resetAccessibility()">Restaurar padrão</button></div></section>`;
}
function settings(){
  const contentStatus=window.VALE_CONTENT_STATUS||{mode:'boot-fallback',caseCount:cases.length,warnings:[]};
  const store=stateStore.inspect(),diag=diagnostics.summary();
  app.innerHTML=shell('CONFIGURAÇÕES',`<div class="layout">${sidebar('settings')}<section class="settings-grid"><div class="card general-settings"><h2>Geral</h2><p>Idioma-base: ${localeLabel(state.locale)}<br>Estrutura preparada: PT-BR, EN e ES<br><small>A tradução integral da interface e dos casos será concluída na fase específica de internacionalização.</small><br>Dificuldade: Simulador<br>Salvar automaticamente: Ativo<br>Build: ${BUILD.label}</p><label for="locale-select">Preferência de idioma</label><select id="locale-select" class="input" onchange="setAppLocale(this.value)">${SUPPORTED_LOCALES.map(item=>`<option value="${item.id}" ${state.locale===item.id?'selected':''}>${item.label}</option>`).join('')}</select><div class="keyboard-help"><h3>Atalhos de teclado</h3><p><kbd>Alt</kbd> + <kbd>1</kbd> Lobby • <kbd>2</kbd> Aprendizagem • <kbd>3</kbd> Plantão • <kbd>4</kbd> Configurações • <kbd>5</kbd> Resultados</p><p><kbd>Esc</kbd> fecha janelas e menus. Setas navegam entre abas.</p></div></div>${accessibilitySettingsCard()}<div class="card"><h2>Conteúdo e atualização</h2><p>Conteúdo: <b>${contentStatus.mode}</b><br>Fonte: ${contentStatus.source||'interna'}<br>Casos carregados: ${contentStatus.caseCount||cases.length}<br>Runtime: <b>${runtimeBuildStatus.ok===true?'coerente':runtimeBuildStatus.ok===false?'atenção':'verificando'}</b><br>Service worker: ${swStatus.registered?'registrado':'não registrado'}${swStatus.updateReady?' • atualização pronta':''}<br>Modo de exibição: <b>${pwaStatus.displayMode}</b><br>Rede: <b>${pwaStatus.online?'online':'offline'}</b><br>Instalação PWA: <b>${pwaStatus.installed?'instalado':pwaStatus.installAvailable?'disponível':'pelo menu do navegador'}</b></p>${pwaStatus.installAvailable?'<button class="btn primary" onclick="installGame()">Instalar aplicativo</button>':''}${contentStatus.warnings?.length?`<details><summary>Avisos protegidos (${contentStatus.warnings.length})</summary>${contentStatus.warnings.map(item=>`<p><small>${esc(item)}</small></p>`).join('')}</details>`:''}${swStatus.updateReady?'<button class="btn primary" onclick="applyGameUpdate()">Aplicar atualização segura</button>':''}<button class="btn" onclick="clearClinicalCache()">Revalidar conteúdo no próximo início</button></div><div class="card"><h2>Proteção do progresso</h2><p>Save schema: ${BUILD.saveSchema}<br>Slot principal: <b>${store.main.ok?'íntegro':store.main.exists?'corrompido':'novo'}</b><br>Backups recuperáveis: <b>${store.backups.filter(x=>x.ok).length}</b> / ${store.backups.length}<br>Gravação pendente: ${store.pending.exists?store.pending.ok?'válida':'inválida':'nenhuma'}<br>Último evento: ${esc(store.lastStatus.message)}</p><button class="btn primary" onclick="openRecoveryCenter()">Abrir central de recuperação</button><button class="btn" onclick="createManualBackup()">Criar backup agora</button><button class="btn" onclick="safeExportSave()">Exportar save</button><button class="btn danger" onclick="resetLocalSave()">Resetar slot principal</button></div><div class="card"><h2>Observabilidade</h2><p>Eventos locais: ${diag.total}<br>Avisos: ${diag.warnings}<br>Erros: ${diag.errors}<br>Modo seguro: ${safeMode?'ativo':'inativo'}</p><button class="btn" onclick="safeExportDiagnostics()">Exportar diagnóstico</button><button class="btn" onclick="clearDiagnostics()">Limpar registros técnicos</button></div></section></div>`,10);
}

function recovery(){
  const store=stateStore.inspect();
  const events=diagnostics.list(8);
  const validBackups=store.backups.filter(item=>item.ok);
  app.innerHTML=shell('CENTRAL DE RECUPERAÇÃO',`<div class="layout">${sidebar('recovery')}<section class="maincol"><div class="card recovery-hero"><p class="safety-kicker">ANTI-QUEBRA 2.0</p><h1>Central de recuperação</h1><p>Ferramentas locais para reparar a sessão sem apagar carreira, XP, créditos ou histórico confirmado.</p><div class="recovery-actions"><button class="btn primary" onclick="repairTransientState()">Reparar apenas a sessão atual</button><button class="btn" onclick="createManualBackup()">Criar backup manual</button><button class="btn" onclick="safeExportSave()">Exportar save protegido</button><button class="btn" onclick="safeExportDiagnostics()">Exportar diagnóstico</button></div></div><div class="card"><h2>Backups rotativos</h2>${validBackups.length?store.backups.map((item,index)=>item.ok?`<article class="backup-row"><div><b>${esc(item.playerName)}</b><small>${item.updatedAt?new Date(item.updatedAt).toLocaleString('pt-BR'):'Data indisponível'} • nível ${item.level} • ${item.xp} XP • tela ${esc(item.screen)}</small></div><button class="btn mini" onclick="restoreBackupAt(${index})">Restaurar</button></article>`:`<article class="backup-row"><div><b>Backup inválido isolado</b><small>${esc(item.error)}</small></div></article>`).join(''):'<p>Nenhum backup automático foi criado ainda. Eles aparecem conforme o jogo confirma novos saves.</p>'}</div><div class="card"><h2>Estado do armazenamento</h2><p>Slot principal: <b>${store.main.ok?'íntegro':store.main.exists?'inválido':'não criado'}</b><br>Gravação temporária: ${store.pending.exists?store.pending.ok?'recuperável':'inválida':'nenhuma'}<br>Último status: ${esc(store.lastStatus.message)}</p><p><small>O botão de reset remove somente o slot principal. Os backups permanecem disponíveis para recuperação.</small></p><button class="btn danger" onclick="resetLocalSave()">Resetar somente o slot principal</button></div></section><aside class="rightcol"><div class="card"><h3>Eventos recentes</h3>${events.length?events.map(event=>`<p class="diag-event ${event.level}"><b>${event.category}</b><br><small>${new Date(event.at).toLocaleTimeString('pt-BR')} — ${esc(event.message)}</small></p>`).join(''):'<p>Nenhum evento técnico registrado.</p>'}</div><div class="card"><h3>Garantias desta build</h3><p>✓ checksum do save<br>✓ gravação temporária antes do commit<br>✓ até cinco backups rotativos<br>✓ recuperação de save antigo<br>✓ watchdog contra tela branca<br>✓ último conteúdo clínico válido<br>✓ cache anterior preservado</p></div></aside></div>`,8)
}

function focusClinicalPanel(){
  try{
    if(!matchMedia('(max-width: 980px)').matches)return;
    const board=document.querySelector('.mobile-clinical-strip');
    if(board){board.classList.add('focus-pulse');board.scrollIntoView({behavior:'smooth',block:'nearest'});setTimeout(()=>board.classList.remove('focus-pulse'),900)}
  }catch(e){}
}
window.pickAvatar=i=>{sound('tap');state.player.avatar=i;save();setup()};window.startGame=()=>{state.player.name=document.querySelector('#name').value||'Dr. Rafael Santos';state.player.short=state.player.name.split(' ').slice(0,2).join(' ');go('menu')};
async function requestGameFullscreen(){
  document.body.classList.add('mobile-fullscreen-active');
  const result=await mobileExperience.toggleFullscreen();
  if(result.ok){toast(document.fullscreenElement?'Tela cheia ativada':'Tela cheia encerrada','ok');return;}
  if(pwaStatus.installed){toast('O aplicativo já está em modo imersivo','ok');return;}
  toast('Use “Adicionar à tela inicial” para o modo imersivo completo','warn');
}
async function installGame(){
  const result=await mobileExperience.install();
  state.pwa.lastInstallResult=result.outcome||result.reason||null;
  if(result.ok){toast('Instalação confirmada','ok');}
  else if(result.reason==='unavailable'){toast('Instalação disponível pelo menu do navegador','warn');}
  else toast('Instalação não concluída','warn');
  save({label:'pwa-install'});render();
}

let fullscreenArmed=true;
document.addEventListener('pointerup',event=>{
  if(!fullscreenArmed||!matchMedia('(max-width: 980px)').matches)return;
  if(event.target.closest('input,select,textarea'))return;
  fullscreenArmed=false;
  requestGameFullscreen();
},{passive:true});

window.setAccessibility=(key,value)=>{
  const allowed=['contrast','textSize','reduceMotion','focusMode','descriptions'];
  if(!allowed.includes(key))return;
  state.accessibility=normalizeAccessibility({...state.accessibility,[key]:value});
  applyAccessibilityPreferences(state.accessibility);
  save({label:'accessibility-'+key});
  announce('Preferência de acessibilidade atualizada.');
  render();
  const focusSelector=typeof value==='boolean'?`[data-a11y-key="${key}"]`:`[data-a11y-key="${key}"][data-a11y-value="${String(value)}"]`;
  globalThis.requestAnimationFrame?.(()=>document.querySelector(focusSelector)?.focus());
};
window.resetAccessibility=()=>{state.accessibility={...ACCESSIBILITY_DEFAULTS};applyAccessibilityPreferences(state.accessibility);save({label:'accessibility-reset'});toast('Acessibilidade restaurada ao padrão');render();};
window.setGameSound=value=>{state.sound=Boolean(value);save({label:'sound'});announce(state.sound?'Sons de interface ativados.':'Sons de interface desativados.');render();globalThis.requestAnimationFrame?.(()=>document.querySelector('[data-a11y-key="sound"]')?.focus());};
window.announceAccessibilityPreview=()=>{announce('Teste concluído. A interface está pronta para anunciar mensagens importantes.');toast('Anúncio de acessibilidade enviado');};
window.setRecordTab=tab=>{const allowed=['overview','history','results','plan','vitals','timeline'];state.ui.recordTab=allowed.includes(tab)?tab:'overview';save({label:'record-tab'});render();};
window.toggleResultsCenter=()=>{state.ui.resultsOpen=!state.ui.resultsOpen;save({label:'results-center'});render();};
window.submitClinicalNote=()=>{const input=document.querySelector('#clinical-note');const value=String(input?.value||'').trim();if(!value)return toast('Escreva uma observação antes de registrar','warn');ensureClinicalState();const item={time:minToClock(),label:'Observação clínica',result:value,detail:'Registro livre inserido pelo jogador.',caseId:activeCase().id};state.prontuario.notes.push(item);state.timeline.push({t:minToClock(),text:'Observação clínica registrada'});state.encounter={kind:'Prontuário',title:'Observação registrada',text:value,detail:'Nota livre adicionada ao prontuário.',time:minToClock()};addTime('questions');save({label:'clinical-note'});toast('Observação registrada','ok');render();};
window.requestFinishCase=()=>{state.ui.closureReview=true;save({label:'closure-review'});render();};
window.cancelFinishReview=()=>{state.ui.closureReview=false;save({label:'closure-cancel'});render();};
window.confirmFinishCase=()=>{finishCaseCore();};
window.go=go;window.requestGameFullscreen=requestGameFullscreen;window.installGame=installGame;window.state=state;window.save=save;window.toast=toast;window.render=render;window.syncProgress=syncProgress;window.toggleDrawer=()=>{state.drawer=!state.drawer;render()};window.setShiftTab=tab=>{const allowed=['summary','questions','exams','procedures','diagnosis','record','queue'];state.ui.shiftTab=allowed.includes(tab)?tab:'summary';save({label:'shift-tab'});render();requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'}));};window.toggleAction=toggleAction;window.finishCaseCore=finishCaseCore;window.claimMission=claimMission;window.resetEncounterData=resetEncounterData;window.setAppLocale=value=>{state.locale=normalizeLocale(value);save({label:'locale'});toast('Preferência de idioma salva');render();};window.resetLocalSave=()=>{stateStore.backup('before-reset');stateStore.reset();location.reload();};
window.openRecoveryCenter=()=>{state.screen='recovery';save({label:'open-recovery'});render();};
window.createManualBackup=()=>{const ok=stateStore.backup('manual');toast(ok?'Backup local criado':'Não havia save válido para copiar',ok?'ok':'warn');render();};
window.restoreBackupAt=index=>{const backup=stateStore.listBackups()[Number(index)];if(!backup)return toast('Backup não encontrado','warn');const result=stateStore.restoreBackup(backup.storageKey);if(result.ok){diagnostics.warn('recovery','Backup restaurado manualmente.',{storageKey:backup.storageKey});location.reload();}else toast('Falha ao restaurar: '+result.error,'warn');};
window.repairTransientState=()=>{state.popup=null;state.encounter=null;state.drawer=false;state.actions={questions:[],exams:[],procedures:[],hypotheses:[],conduct:[]};state.prontuario={history:[],exams:[],procedures:[],hypotheses:[],conduct:[],notes:[]};state.timeline=[];state.screen='hub';save({label:'repair-transient',forceBackup:true});diagnostics.info('recovery','Dados transitórios limpos; carreira mantida.');render();};
window.clearDiagnostics=()=>{diagnostics.clear();toast('Registros técnicos removidos');render();};
window.clearClinicalCache=()=>{clearClinicalContentCache();toast('Conteúdo será revalidado no próximo início');};
window.applyGameUpdate=()=>{if(applyWaitingUpdate(waitingRegistration)){toast('Atualização segura iniciada');}else toast('Nenhuma atualização aguardando','warn');};
function render(){try{normalizeState();syncProgress();app.dataset.ready='1';const screens={setup,menu,hub,specialty,shift,post,learning,settings,recovery};(screens[state.screen]||hub)();enhanceAccessibility(app);setTimeout(typeWriter,30)}catch(err){console.error('Render protegido',err);showRecoveryScreen(err)}}
function closeTopLayer(){
  if(state.popup){closePopup();announce('Resultado fechado.');return true;}
  if(state.ui.resultsOpen){state.ui.resultsOpen=false;save({label:'escape-results'});render();announce('Central de resultados fechada.');return true;}
  if(state.ui.closureReview){state.ui.closureReview=false;save({label:'escape-review'});render();announce('Revisão de encerramento fechada.');return true;}
  if(state.drawer){state.drawer=false;save({label:'escape-drawer'});render();announce('Menu fechado.');return true;}
  return false;
}
installKeyboardNavigation({
  onEscape:event=>{if(closeTopLayer())event.preventDefault();},
  onShortcut:number=>{
    const routes={1:'hub',2:'learning',3:'specialty',4:'settings'};
    if(routes[number]){go(routes[number]);return;}
    if(number===5&&state.screen==='shift'){state.ui.resultsOpen=true;save({label:'shortcut-results'});render();announce('Central de resultados aberta.');}
  }
});
window.VALE_BOOT_GUARD?.checkpoint('initial-render');
render();
state.meta.lastHealthyAt=new Date().toISOString();
window.VALE_BOOT_GUARD?.healthy();
diagnostics.info('boot','Primeira renderização concluída.',{screen:state.screen});
verifyRuntimeBuild(BUILD.version).then(result=>{runtimeBuildStatus=result;result.ok?diagnostics.info('integrity',result.message,result):diagnostics.warn('integrity',result.message,result);if(!result.ok)toast('Versões de cache divergentes; recarregue se notar falhas','warn');});
initServiceWorker({version:BUILD.version,onStatus:status=>{swStatus=status;},onUpdate:({registration})=>{waitingRegistration=registration;swStatus.updateReady=true;diagnostics.info('update','Nova atualização aguardando aplicação segura.');toast('Nova versão disponível nas configurações','ok');}}).then(status=>{swStatus=status;});
window.VALE_BOOT_GUARD?.checkpoint('loading-content');
loadGameContent({version:BUILD.version,safeMode,diagnostics}).then(({content,status})=>{applyGameContent(content,status);save({label:'content-ready'});window.VALE_BOOT_GUARD?.checkpoint('content-ready');render();}).catch(error=>{console.warn('[ValeContentLoader] Fallback mantido.',error);diagnostics.error('content','Falha não recuperada no loader; fallback de boot mantido.',{error:error.message});window.VALE_CONTENT_STATUS={mode:'fallback',source:'boot',caseCount:cases.length,warnings:[String(error)]};render();});
