import {BUILD,ASSET_ROOT,bg,av,ui} from './config/build.js';
import {createDefaultState} from './core/default-state.js';
import {deepMerge} from './core/object.js';
import {createStateStore} from './core/storage.js';
import {getFallbackContent} from './data/fallback-content.js';
import {loadGameContent,clearClinicalContentCache} from './data/content-loader.js';
import {createDiagnostics} from './core/diagnostics.js';
import {verifyRuntimeBuild} from './core/runtime-health.js';
import {initServiceWorker,applyWaitingUpdate} from './core/sw-manager.js';
import {SUPPORTED_LOCALES,normalizeLocale,localeLabel} from './i18n/index.js';
import './compat/legacy-guards.js';

window.VALE_BOOT_GUARD?.checkpoint('app-module-loaded');
const safeMode=new URLSearchParams(location.search).get('safe')==='1';
const diagnostics=createDiagnostics({key:'medsim-diagnostics-v012',build:BUILD.label,maxEntries:80});
diagnostics.info('boot','Módulo principal carregado.',{safeMode});
let runtimeBuildStatus={ok:null,message:'Verificação pendente.'};
let swStatus={supported:'serviceWorker'in navigator,registered:false,updateReady:false};
let waitingRegistration=null;
const A=ASSET_ROOT;
const app=document.querySelector('#app');
const saveKey='medsim-vale-save-v012';
const legacySaveKeys=['medsim-vale-save-v011','medsim-vale-save-v010','medsim-vale-save-v080'];
const fresh=()=>createDefaultState({buildVersion:BUILD.version});
const stateStore=createStateStore({key:saveKey,legacyKeys:legacySaveKeys,schemaVersion:BUILD.saveSchema,buildVersion:BUILD.version,maxBackups:5,backupIntervalMs:60000,diagnostics});
const safeLoad=()=>stateStore.load(fresh);
let state=safeLoad();
function normalizeState(){
  const base=fresh();
  state=deepMerge(base,state||{});
  window.state=state;
  const validScreens=['setup','menu','hub','specialty','shift','post','learning','settings','recovery'];
  if(!validScreens.includes(state.screen)) state.screen='hub';
  state.locale=normalizeLocale(state.locale);
  state.actions=deepMerge({questions:[],exams:[],procedures:[],hypotheses:[],conduct:[]},state.actions||{});
  state.prontuario=deepMerge({history:[],exams:[],procedures:[],hypotheses:[],conduct:[],notes:[]},state.prontuario||{});
  state.missions=deepMerge({claimed:[]},state.missions||{});
  state.player=deepMerge(base.player,state.player||{});
  state.currentCase=Number.isFinite(Number(state.currentCase))?Number(state.currentCase):0;
  state.simulation=deepMerge({minutes:720,criticality:0},state.simulation||{});
  state.meta=deepMerge(base.meta,state.meta||{});
  document.documentElement.lang=state.locale;
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
function toast(t,type='ok'){sound(type);let e=document.createElement('div');e.className='toast pop';e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),2100)}
function go(s){sound('nav');state.screen=s;state.drawer=false;save();render()}
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
function typeWriter(){const el=document.querySelector('#typewriter');if(!el)return;const txt=el.dataset.text||'';el.textContent='';let i=0;const step=()=>{el.textContent=txt.slice(0,i++);if(i<=txt.length)setTimeout(step,12)};step()}
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
function prontuarioPanel(){
  ensureClinicalState();
  const c=activeCase();
  const sec=(title,arr,empty)=>`<div class="chart-section"><h4>${title}</h4>${arr.slice(-4).map(x=>`<p><b>${x.time}</b> ${esc(x.label)}<br><small>${esc(x.result)}</small></p>`).join('')||`<small>${empty}</small>`}</div>`;
  return `<div class="record-grid"><div class="record-head"><h3>Prontuário do paciente</h3><small>${esc(c.patient)} • ${c.age} anos • ${esc(c.sex)}</small></div><div class="record-summary"><b>Queixa principal</b><p>${esc(c.complaint)}</p></div>${sec('Anamnese',state.prontuario.history,'Sem perguntas registradas.')}${sec('Exames',state.prontuario.exams,'Sem exames solicitados.')}${sec('Procedimentos',state.prontuario.procedures,'Sem procedimentos registrados.')}${sec('Hipóteses',state.prontuario.hypotheses,'Sem hipótese ativa.')}${vitalChart()}</div>`;
}
function vitalChart(){
  ensureClinicalState();
  const data=state.vitalTrend.slice(-6);
  if(!data.length)return `<div class="chart-section"><h4>Evolução de sinais vitais</h4><small>Ainda sem evolução registrada. Faça perguntas, exames ou procedimentos.</small></div>`;
  const maxFc=Math.max(...data.map(x=>x.fc),100);
  return `<div class="chart-section vital-chart"><h4>Evolução de sinais vitais</h4>${data.map(x=>`<div class="vital-row"><span>${x.time}</span><i style="width:${Math.round((x.fc/maxFc)*100)}%"></i><b>FC ${x.fc}</b><em>SpO₂ ${x.spo2}% • ${x.status}</em></div>`).join('')}</div>`;
}
function resetEncounterData(){state.actions={questions:[],exams:[],procedures:[],hypotheses:[],conduct:[]};state.timeline=[];state.encounter=null;state.popup=null;state.prontuario={history:[],exams:[],procedures:[],hypotheses:[],conduct:[],notes:[]};state.vitalTrend=[];}

function clinicalPanel(){const e=state.encounter||defaultEncounter();return '<div class="clinical-board '+(e.kind==='exams'?'exam-mode':'')+'"><div class="board-head"><small>'+esc(e.kind)+'</small><b>'+esc(e.title)+'</b><time>'+esc(e.time||minToClock())+'</time></div><p id="typewriter" data-text="'+esc(e.text)+'"></p><div class="board-detail">'+esc(e.detail||'')+'</div></div>'}
function popupHtml(){if(!state.popup)return '';const p=state.popup;return '<div class="modal-back"><div class="result-modal pop"><button class="modal-x" onclick="closePopup()">×</button><small>'+esc(p.kind)+'</small><h2>'+esc(p.title)+'</h2><p>'+esc(p.text)+'</p><em>'+esc(p.detail)+'</em><button class="btn primary" onclick="closePopup()">Entendi</button></div></div>'}
function count(a,b){return a.filter(x=>b.includes(x)).length}function calcScore(){const c=activeCase();let q=count(state.actions.questions,c.correctQuestions),e=count(state.actions.exams,c.correctExams),pr=count(state.actions.procedures,c.correctProcedures),co=count(state.actions.conduct,c.idealConduct);let diag=state.actions.hypotheses.includes(c.diagnosis)?25:0;let excess=Math.max(0,state.actions.exams.length-c.correctExams.length)*6;let missingConduct=Math.max(0,c.idealConduct.length-co)*4;return Math.max(15,Math.min(100,Math.round(q*6+e*7+pr*5+co*6+diag+10-excess-missingConduct-state.simulation.criticality)))}
function finishCaseCore(){const c=activeCase(),sc=calcScore();state.score=sc;state.completed.push({id:c.id,score:sc,at:BUILD.label});state.player.xp+=Math.round(c.xp*(sc/100));state.player.credits+=sc>=80?110:60;state.player.patients++;if(sc>=80)state.player.highScoreCases++;state.player.streak=sc>=75?state.player.streak+1:0;state.player.correct=Math.round((state.player.correct+sc)/2);state.player.reputation=rep(sc);state.currentCase=(state.currentCase+1)%casesForSelectedSpecialty().length;syncProgress();save();go('post')}
function missionProgress(m){return Math.min(m.goal,state.player[m.metric]||0)}function canClaim(m){return missionProgress(m)>=m.goal&&!state.missions.claimed.includes(m.id)}function claimMission(id){let m=missionBank.find(x=>x.id===id);if(!m||!canClaim(m))return toast('Missão ainda não concluída','warn');state.missions.claimed.push(id);state.player.xp+=m.rewardXp;state.player.credits+=m.rewardCredits;syncProgress();save();toast('Recompensa coletada!','level');render()}
function logo(){return `<div class="brand"><div class="pulse-line"></div><div class="logo"><span>Simulador de</span><b>Medicina</b></div><small>VALE EDITION • MODO SIMULADOR</small></div>`}
function profile(){let p=state.player,pr=syncProgress();return `<div class="profile panel"><img src="${av(p.avatar)}"><div><strong>${p.name}</strong><em>${p.title} • Nível ${p.level}</em><div class="xp"><i style="width:${pr.pct}%"></i></div><small>${pr.spent} / ${pr.next} XP • Rep. ${p.reputation}</small></div></div>`}
function top(section){return `<header class="topbar">${logo()}<div class="top-actions"><button class="hamb" onclick="toggleDrawer()">☰</button><button class="fullscreen-btn" onclick="requestGameFullscreen()" title="Tela cheia">⛶</button></div><h2>${section}</h2>${profile()}</header>`}
function slug(s){return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
function shell(section,body,bgNum=8){return `<main class="screen fade screen-${slug(section)}" style="--bg:url('${bg(bgNum)}')">${top(section)}${body}<div class="build">${BUILD.label}</div></main>`}
function sidebar(active){let items=[['hub','🏠','Lobby','Visão geral'],['learning','📖','Aprendizagem','Procedimentos'],['specialty','🩺','Plantão','Especialidades'],['settings','⚙️','Configurações','Sistema']];return `<aside class="side panel ${state.drawer?'open':''}">${items.map(x=>`<button onclick="go('${x[0]}')" class="nav ${active==x[0]?'active':''}"><span>${x[1]}</span><b>${x[2]}</b><small>${x[3]}</small></button>`).join('')}</aside><div class="shade ${state.drawer?'show':''}" onclick="toggleDrawer()"></div>`}
function setup(){app.innerHTML=`<main class="screen fade" style="--bg:url('${bg(1)}')">${logo()}<img class="hero-doc" src="${av(state.player.avatar)}"><section class="setup panel pop"><h3>🫀 NOVO GAME</h3><h2>1. Escolha seu avatar</h2><div class="avatar-row">${[1,2,3,4,5].map(i=>`<button class="avatar-choice ${state.player.avatar==i?'active':''}" onclick="pickAvatar(${i})"><img src="${av(i)}"></button>`).join('')}</div><h2>2. Nome do personagem</h2><input class="input" id="name" value="${state.player.name}"><h2>3. País de origem</h2><select class="input"><option>🇧🇷 Brasil</option></select><button class="btn primary" onclick="startGame()">🫀 Continuar</button></section><div class="build">${BUILD.label}</div></main>`}
function menu(){app.innerHTML=`<main class="screen fade" style="--bg:url('${bg(2)}')">${logo()}<section class="welcome slide"><h1>Bem-vindo,<br><span>${state.player.short}</span></h1><p>O conhecimento é a sua maior ferramenta. Cada decisão pode mudar uma vida.</p></section><section class="mode-grid"><article class="mode card" style="--cardbg:url('${bg(3)}')"><h2>Modo Carreira</h2><p>Progressão real, reputação, missões e desbloqueios.</p><button class="btn primary" onclick="go('hub')">Entrar</button></article><article class="mode card" style="--cardbg:url('${bg(7)}')"><h2>Modo Simulador</h2><p>Casos mais rigorosos, tempo clínico e penalidade por excesso de exames.</p><button class="btn" onclick="go('specialty')">Praticar</button></article></section><div class="build">${BUILD.label}</div></main>`}
function hub(){let p=state.player,pr=syncProgress();app.innerHTML=shell('LOBBY DO RESIDENTE',`<div class="layout">${sidebar('hub')}<section class="maincol"><div class="hero-card card" style="--cardbg:url('${bg(8)}')"><h1>Bem-vindo, ${p.short}</h1><p>v0.12.0: save transacional, backups rotativos, watchdog de abertura e central de recuperação.</p><div class="level medallion">${p.level}</div><div class="stats"><div>🏆<b>${p.xp}</b><small>XP total</small></div><div>🌐<b>#${p.rank}</b><small>Ranking local</small></div><div>👥<b>${p.patients}</b><small>Pacientes</small></div><div>🎯<b>${p.correct}%</b><small>Acerto</small></div></div></div><div class="two"><div class="card"><h3>Progresso da carreira</h3><p>${p.title} • Reputação ${p.reputation}</p><div class="xp big"><i style="width:${pr.pct}%"></i></div><p>${pr.spent} / ${pr.next} XP • Desbloqueadas: ${state.unlocks.specialties.join(', ')}</p><button class="btn primary" onclick="go('specialty')">Iniciar plantão</button></div><div class="card"><h3>Últimos casos</h3>${state.completed.slice(-4).reverse().map(x=>`<p>✅ ${x.id} <b>${x.score}/100</b></p>`).join('')||'<p>Nenhum caso concluído nesta build.</p>'}</div></div></section><aside class="rightcol"><div class="card"><h3>Missões e recompensas</h3>${missionBank.map(m=>`<div class='mission'><b>${m.type}</b><span>${m.title}</span><small>${missionProgress(m)} / ${m.goal}</small><button class='btn mini' onclick="claimMission('${m.id}')" ${canClaim(m)?'':'disabled'}>Coletar</button></div>`).join('')}</div><div class="card"><h3>Economia</h3><h2>${p.credits} créditos</h2><p>Base pronta para loja futura, cosméticos e packs.</p></div></aside></div>`,8)}
function specialty(){app.innerHTML=shell('PLANTÃO — ESPECIALIDADE',`<div class="layout">${sidebar('specialty')}<section class="maincol"><h1>Escolha sua especialidade</h1><p class="muted">Modo simulador: especialidades desbloqueiam por nível.</p><div class="specialties">${specs.map(s=>{const levelLocked=state.player.level<s[6],hasCases=cases.some(c=>c.specialty===s[0]),locked=levelLocked||!hasCases;const reason=levelLocked?'Desbloqueia no nível '+s[6]:'Conteúdo em preparação';return `<article class="spec card ${locked?'locked':''}" onclick="${locked?`toast('${reason}','warn')`:`state.selectedSpec='${s[0]}';state.currentCase=0;resetEncounterData();go('shift')`}"><img src="${s[5]}"><span>${s[3]}</span><h2>${s[1]}</h2><p>${s[2]}</p><b>${locked?reason:'Disponível • '+cases.filter(c=>c.specialty===s[0]).length+' caso(s)'}</b></article>`}).join('')}</div></section><aside class="rightcol"><div class="card"><h3>Regras simulador</h3><p>Exame desnecessário, conduta incompleta e demora reduzem seu score.</p></div><button class="btn primary" onclick="resetEncounterData();go('specialty')">Iniciar plantão</button></aside></div>`,4)}
function shift(){const c=activeCase();const q=directedQuestions;app.innerHTML=shell('PLANTÃO - MODO SIMULADOR',`<div class="shift"><aside class="patient-list panel"><h3>Fila de atendimento</h3><b>${patients.length} Pacientes</b>${patients.map((p,i)=>`<div class="patient ${p==c.patient?'active':''}"><span>${String(i+1).padStart(2,'0')}</span><div><b>${p}</b><small>${p==c.patient?'Em atendimento':'Aguardando'}</small></div><time>${['08:15','09:10','09:45','10:20','11:05','11:40','12:22'][i]||'18:'+String(i*5).padStart(2,'0')}</time></div>`).join('')}<button class="btn" onclick="finishCaseCore()">Finalizar consulta</button></aside><section class="case panel"><h2><em>Em atendimento</em>${c.patient}</h2><p>${c.age} anos | ${c.sex}<br>Profissão: ${c.profession}</p>${clinicalPanel()}${prontuarioPanel()}<img class="patient-art" src="${ui((state.currentCase%3)+1)}"><div class="card vitals"><h3>Sinais vitais</h3>${c.vitals.map(v=>`<div><small>${v[0]}</small><b>${v[1]}</b><small>${v[2]}</small></div>`).join('')}</div><div class="card"><h3>Anamnese dirigida</h3>${q.map(x=>`<button class="listbtn ${selected('questions',x)?'selected':''}" onclick="toggleAction('questions','${x}')">💬 ${x}</button>`).join('')}<input class="input" placeholder="Escreva sua própria pergunta..."></div></section><aside class="rightpanel"><div class="card"><h3>Exames</h3>${exams.map(x=>`<button class="listbtn ${selected('exams',x)?'selected':''}" onclick="toggleAction('exams','${x}')">🧪 ${x}</button>`).join('')}</div><div class="card"><h3>Procedimentos</h3>${procedures.map(x=>`<button class="listbtn ${selected('procedures',x)?'selected':''}" onclick="toggleAction('procedures','${x}')">⚕ ${x}</button>`).join('')}</div><div class="card"><h3>Hipóteses e conduta</h3>${hypotheses.map(x=>`<button class="listbtn ${selected('hypotheses',x)?'selected':''}" onclick="toggleAction('hypotheses','${x}')">${x}</button>`).join('')}<hr>${conducts.map(x=>`<button class="listbtn ${selected('conduct',x)?'selected':''}" onclick="toggleAction('conduct','${x}')">📋 ${x}</button>`).join('')}<button class="btn primary" onclick="finishCaseCore()">Confirmar diagnóstico</button></div></aside></div>${popupHtml()}<div class="hud"><b>Hora clínica ${minToClock()}</b><b>Atendidos ${state.player.patients}</b><b>Criticidade ${state.simulation.criticality}</b><b>Score previsto ${calcScore()}/100</b><button class="btn primary" onclick="toast('Plantão pausado')">Pausar</button></div>`,5)}
function post(){let last=state.completed[state.completed.length-1]||{score:state.score||88,id:'hipertensao-1'},c=cases.find(x=>x.id==last.id)||cases[0],sc=last.score;app.innerHTML=shell('PÓS-CONSULTA',`<section class="post"><div class="card"><h3>Consulta concluída</h3><img class="portrait" src="${ui(2)}"><h2>${c.patient}</h2><p>${c.complaint}</p><div class="success">Diagnóstico final: ${c.diagnosis}</div><p>Reputação atual: <b>${state.player.reputation}</b><br>Sequência: <b>${state.player.streak}</b></p></div><div class="card score"><h2>Sua pontuação</h2><div class="ring">${sc}<small>/100</small></div><h1>${sc>=85?'Muito Bom!':sc>=70?'Bom desempenho':'Revise a conduta'}</h1><p>Score combina anamnese, exames, procedimentos, hipótese, conduta, tempo e excesso de ações.</p><div class="stats"><div>🧠<b>${Math.min(98,sc+2)}%</b><small>Raciocínio</small></div><div>🧪<b>${Math.max(50,sc-3)}%</b><small>Exames</small></div><div>📋<b>${Math.max(55,sc)}%</b><small>Conduta</small></div></div></div><aside class="card"><h3>Linha do tempo</h3>${state.timeline.slice(-8).map(x=>`<p>🕒 ${x.t} — ${x.text}</p>`).join('')||'<p>Consulta registrada.</p>'}<h3>XP e recompensas</h3><p>⭐ +${Math.round(c.xp*(sc/100))} XP<br>💰 +${sc>=80?110:60} Créditos</p><button class="btn primary" onclick="resetEncounterData();go('shift')">Próximo paciente</button><button class="btn" onclick="go('hub')">Voltar ao lobby</button></aside></section>`,7)}
function learning(){app.innerHTML=shell('APRENDIZAGEM MÉDICA',`<div class="layout">${sidebar('learning')}<section class="maincol"><h1>Aprendizagem integrada</h1><div class='card'><h3>v0.12.0 Anti-quebra 2.0</h3><p>Completar módulos melhora missões, XP, domínio clínico e ajuda a manter sequência de bons atendimentos.</p></div><div class="procedure card"><img src="${ui(3)}"><div><h2>Cateterismo venoso periférico <small>Básico</small></h2><p>Procedimento para acesso venoso periférico para medicamentos, hidratação ou coleta de exames.</p><p>✅ Indicação • ✅ Materiais • ✅ Técnica segura • ✅ Complicações</p><button class="btn primary" onclick="state.player.learnedModules++;state.player.xp+=60;syncProgress();save();toast('Módulo concluído +60 XP');render()">Marcar como concluído</button></div></div><div class="card"><h3>Todos os procedimentos</h3>${['Coleta de sangue venoso ✅ 100%','Intubação orotraqueal 🟡 60%','Eletrocardiograma (ECG) ✅ 100%','Sutura simples ⚪ 0%','Ultrassonografia POCUS 🟡 20%'].map(x=>`<p>${x}</p>`).join('')}</div></section><aside class="rightcol"><div class="card"><h3>Seu progresso</h3><div class="ring small">${state.player.learnedModules}</div><p>Módulos concluídos</p></div></aside></div>`,9)}
function settings(){const contentStatus=window.VALE_CONTENT_STATUS||{mode:'boot-fallback',caseCount:cases.length,warnings:[]};const store=stateStore.inspect();const diag=diagnostics.summary();app.innerHTML=shell('CONFIGURAÇÕES',`<div class="layout">${sidebar('settings')}<section class="settings-grid"><div class="card"><h2>Geral</h2><p>Idioma-base: ${localeLabel(state.locale)}<br>Estrutura preparada: PT-BR, EN e ES<br><small>A tradução integral da interface e dos casos será concluída na fase específica de internacionalização.</small><br>Dificuldade: Simulador<br>Salvar automaticamente: Ativo<br>Build: ${BUILD.label}</p><label>Preferência de idioma<select class="input" onchange="setAppLocale(this.value)">${SUPPORTED_LOCALES.map(item=>`<option value="${item.id}" ${state.locale===item.id?'selected':''}>${item.label}</option>`).join('')}</select></label><h2>Acessibilidade</h2><p>Legendas: Ativo<br>Alto contraste: Inativo<br>Tamanho do texto: Médio</p></div><div class="card"><h2>Conteúdo e atualização</h2><p>Conteúdo: <b>${contentStatus.mode}</b><br>Fonte: ${contentStatus.source||'interna'}<br>Casos carregados: ${contentStatus.caseCount||cases.length}<br>Runtime: <b>${runtimeBuildStatus.ok===true?'coerente':runtimeBuildStatus.ok===false?'atenção':'verificando'}</b><br>Service worker: ${swStatus.registered?'registrado':'não registrado'}${swStatus.updateReady?' • atualização pronta':''}</p>${contentStatus.warnings?.length?`<details><summary>Avisos protegidos (${contentStatus.warnings.length})</summary>${contentStatus.warnings.map(item=>`<p><small>${esc(item)}</small></p>`).join('')}</details>`:''}${swStatus.updateReady?'<button class="btn primary" onclick="applyGameUpdate()">Aplicar atualização segura</button>':''}<button class="btn" onclick="clearClinicalCache()">Revalidar conteúdo no próximo início</button></div><div class="card"><h2>Proteção do progresso</h2><p>Save schema: ${BUILD.saveSchema}<br>Slot principal: <b>${store.main.ok?'íntegro':store.main.exists?'corrompido':'novo'}</b><br>Backups recuperáveis: <b>${store.backups.filter(x=>x.ok).length}</b> / ${store.backups.length}<br>Gravação pendente: ${store.pending.exists?store.pending.ok?'válida':'inválida':'nenhuma'}<br>Último evento: ${esc(store.lastStatus.message)}</p><button class="btn primary" onclick="openRecoveryCenter()">Abrir central de recuperação</button><button class="btn" onclick="createManualBackup()">Criar backup agora</button><button class="btn" onclick="safeExportSave()">Exportar save</button><button class="btn danger" onclick="resetLocalSave()">Resetar slot principal</button></div><div class="card"><h2>Observabilidade</h2><p>Eventos locais: ${diag.total}<br>Avisos: ${diag.warnings}<br>Erros: ${diag.errors}<br>Modo seguro: ${safeMode?'ativo':'inativo'}</p><button class="btn" onclick="safeExportDiagnostics()">Exportar diagnóstico</button><button class="btn" onclick="clearDiagnostics()">Limpar registros técnicos</button></div></section></div>`,10)}

function recovery(){
  const store=stateStore.inspect();
  const events=diagnostics.list(8);
  const validBackups=store.backups.filter(item=>item.ok);
  app.innerHTML=shell('CENTRAL DE RECUPERAÇÃO',`<div class="layout">${sidebar('recovery')}<section class="maincol"><div class="card recovery-hero"><p class="safety-kicker">ANTI-QUEBRA 2.0</p><h1>Central de recuperação</h1><p>Ferramentas locais para reparar a sessão sem apagar carreira, XP, créditos ou histórico confirmado.</p><div class="recovery-actions"><button class="btn primary" onclick="repairTransientState()">Reparar apenas a sessão atual</button><button class="btn" onclick="createManualBackup()">Criar backup manual</button><button class="btn" onclick="safeExportSave()">Exportar save protegido</button><button class="btn" onclick="safeExportDiagnostics()">Exportar diagnóstico</button></div></div><div class="card"><h2>Backups rotativos</h2>${validBackups.length?store.backups.map((item,index)=>item.ok?`<article class="backup-row"><div><b>${esc(item.playerName)}</b><small>${item.updatedAt?new Date(item.updatedAt).toLocaleString('pt-BR'):'Data indisponível'} • nível ${item.level} • ${item.xp} XP • tela ${esc(item.screen)}</small></div><button class="btn mini" onclick="restoreBackupAt(${index})">Restaurar</button></article>`:`<article class="backup-row"><div><b>Backup inválido isolado</b><small>${esc(item.error)}</small></div></article>`).join(''):'<p>Nenhum backup automático foi criado ainda. Eles aparecem conforme o jogo confirma novos saves.</p>'}</div><div class="card"><h2>Estado do armazenamento</h2><p>Slot principal: <b>${store.main.ok?'íntegro':store.main.exists?'inválido':'não criado'}</b><br>Gravação temporária: ${store.pending.exists?store.pending.ok?'recuperável':'inválida':'nenhuma'}<br>Último status: ${esc(store.lastStatus.message)}</p><p><small>O botão de reset remove somente o slot principal. Os backups permanecem disponíveis para recuperação.</small></p><button class="btn danger" onclick="resetLocalSave()">Resetar somente o slot principal</button></div></section><aside class="rightcol"><div class="card"><h3>Eventos recentes</h3>${events.length?events.map(event=>`<p class="diag-event ${event.level}"><b>${event.category}</b><br><small>${new Date(event.at).toLocaleTimeString('pt-BR')} — ${esc(event.message)}</small></p>`).join(''):'<p>Nenhum evento técnico registrado.</p>'}</div><div class="card"><h3>Garantias desta build</h3><p>✓ checksum do save<br>✓ gravação temporária antes do commit<br>✓ até cinco backups rotativos<br>✓ recuperação de save antigo<br>✓ watchdog contra tela branca<br>✓ último conteúdo clínico válido<br>✓ cache anterior preservado</p></div></aside></div>`,8)
}

function focusClinicalPanel(){
  try{
    if(!matchMedia('(max-width: 980px)').matches)return;
    const board=document.querySelector('.clinical-board');
    if(board){board.classList.add('focus-pulse');board.scrollIntoView({behavior:'smooth',block:'start'});setTimeout(()=>board.classList.remove('focus-pulse'),900)}
  }catch(e){}
}
window.pickAvatar=i=>{sound('tap');state.player.avatar=i;save();setup()};window.startGame=()=>{state.player.name=document.querySelector('#name').value||'Dr. Rafael Santos';state.player.short=state.player.name.split(' ').slice(0,2).join(' ');go('menu')};
function requestGameFullscreen(){
  const root=document.documentElement;
  try{
    if(!document.fullscreenElement && root.requestFullscreen){root.requestFullscreen({navigationUI:'hide'}).catch(()=>{});} 
  }catch(e){}
  document.body.classList.add('mobile-fullscreen-active');
  toast('Modo tela cheia ativado','ok');
}
let fullscreenArmed=true;
document.addEventListener('click',()=>{
  if(!fullscreenArmed) return;
  fullscreenArmed=false;
  if(matchMedia('(max-width: 980px)').matches){requestGameFullscreen();}
},{once:true});

window.go=go;window.requestGameFullscreen=requestGameFullscreen;window.state=state;window.save=save;window.toast=toast;window.render=render;window.syncProgress=syncProgress;window.toggleDrawer=()=>{state.drawer=!state.drawer;render()};window.toggleAction=toggleAction;window.finishCaseCore=finishCaseCore;window.claimMission=claimMission;window.resetEncounterData=resetEncounterData;window.setAppLocale=value=>{state.locale=normalizeLocale(value);save({label:'locale'});toast('Preferência de idioma salva');render();};window.resetLocalSave=()=>{stateStore.backup('before-reset');stateStore.reset();location.reload();};
window.openRecoveryCenter=()=>{state.screen='recovery';save({label:'open-recovery'});render();};
window.createManualBackup=()=>{const ok=stateStore.backup('manual');toast(ok?'Backup local criado':'Não havia save válido para copiar',ok?'ok':'warn');render();};
window.restoreBackupAt=index=>{const backup=stateStore.listBackups()[Number(index)];if(!backup)return toast('Backup não encontrado','warn');const result=stateStore.restoreBackup(backup.storageKey);if(result.ok){diagnostics.warn('recovery','Backup restaurado manualmente.',{storageKey:backup.storageKey});location.reload();}else toast('Falha ao restaurar: '+result.error,'warn');};
window.repairTransientState=()=>{state.popup=null;state.encounter=null;state.drawer=false;state.actions={questions:[],exams:[],procedures:[],hypotheses:[],conduct:[]};state.prontuario={history:[],exams:[],procedures:[],hypotheses:[],conduct:[],notes:[]};state.timeline=[];state.screen='hub';save({label:'repair-transient',forceBackup:true});diagnostics.info('recovery','Dados transitórios limpos; carreira mantida.');render();};
window.clearDiagnostics=()=>{diagnostics.clear();toast('Registros técnicos removidos');render();};
window.clearClinicalCache=()=>{clearClinicalContentCache();toast('Conteúdo será revalidado no próximo início');};
window.applyGameUpdate=()=>{if(applyWaitingUpdate(waitingRegistration)){toast('Atualização segura iniciada');}else toast('Nenhuma atualização aguardando','warn');};
function render(){try{normalizeState();syncProgress();const screens={setup,menu,hub,specialty,shift,post,learning,settings,recovery};(screens[state.screen]||hub)();setTimeout(typeWriter,30)}catch(err){console.error('Render protegido',err);showRecoveryScreen(err)}}
window.VALE_BOOT_GUARD?.checkpoint('initial-render');
render();
state.meta.lastHealthyAt=new Date().toISOString();
window.VALE_BOOT_GUARD?.healthy();
diagnostics.info('boot','Primeira renderização concluída.',{screen:state.screen});
verifyRuntimeBuild(BUILD.version).then(result=>{runtimeBuildStatus=result;result.ok?diagnostics.info('integrity',result.message,result):diagnostics.warn('integrity',result.message,result);if(!result.ok)toast('Versões de cache divergentes; recarregue se notar falhas','warn');});
initServiceWorker({version:BUILD.version,onStatus:status=>{swStatus=status;},onUpdate:({registration})=>{waitingRegistration=registration;swStatus.updateReady=true;diagnostics.info('update','Nova atualização aguardando aplicação segura.');toast('Nova versão disponível nas configurações','ok');}}).then(status=>{swStatus=status;});
window.VALE_BOOT_GUARD?.checkpoint('loading-content');
loadGameContent({version:BUILD.version,safeMode,diagnostics}).then(({content,status})=>{applyGameContent(content,status);save({label:'content-ready'});window.VALE_BOOT_GUARD?.checkpoint('content-ready');render();}).catch(error=>{console.warn('[ValeContentLoader] Fallback mantido.',error);diagnostics.error('content','Falha não recuperada no loader; fallback de boot mantido.',{error:error.message});window.VALE_CONTENT_STATUS={mode:'fallback',source:'boot',caseCount:cases.length,warnings:[String(error)]};render();});
