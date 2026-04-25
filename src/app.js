const $ = (q)=>document.querySelector(q);
const saveKey = 'msve-save-v090';
const game = {
  build: window.BUILD_INFO?.label || 'v0.9.0',
  case: null,
  confidence: 12,
  time: 0,
  patientState: 'estável',
  xp: 420,
  level: 4,
  credits: 130,
  missions: {m1:0,m2:0,m3:0},
  record: JSON.parse(localStorage.getItem(saveKey) || 'null')?.record || {anamnesis:[],exams:[],procedures:[],hypotheses:[],conduct:[],timeline:[]}
};
const labels = {anamnesis:'Anamnese',exams:'Exames',procedures:'Procedimentos',hypotheses:'Hipóteses',conduct:'Conduta'};
async function load(){
  const [cases, missions] = await Promise.all([fetch('assets/data/cases.json').then(r=>r.json()), fetch('assets/data/missions.json').then(r=>r.json())]);
  game.case = cases[0]; game.missionList = missions; render(); addTimeline('Sistema', 'Plantão iniciado. Prontuário persistente ativo.');
}
function render(){
  const c=game.case;
  $('#app').innerHTML = `<div class="bg"></div><main class="shell">
    <header class="topbar"><div class="brand"><div class="logo">ECG</div><div><h1>Medical Simulator - Vale Edition</h1><small>Modo simulador com UX premium e prontuário persistente</small></div></div><div class="build">${game.build}</div></header>
    <section class="grid">
      <aside class="panel"><div class="hero-card pad"><div class="avatar"></div><h2>Dr. Vale</h2><span class="muted">Residente • Clínica Médica</span></div><div class="pad">
        ${stat('Nível', game.level, 'XP '+game.xp, Math.min(100,game.xp%500/5))}
        ${stat('Confiança diagnóstica', game.confidence+'%', game.patientState, game.confidence)}
        <h3 style="margin-top:16px">Missões</h3><div id="missions"></div>
      </div></aside>
      <section class="panel mobile-sticky"><div class="pad"><h2>Atendimento atual</h2><div class="complaint"><b>Queixa inicial</b><p>${c.complaint}</p><div class="vitals">${vitals(c.vitals)}</div></div><div id="clinicalFeed" class="clinical-feed"><div class="instant-card"><div class="label">Painel clínico</div><div class="type">Selecione uma pergunta, exame ou procedimento. A resposta aparecerá aqui imediatamente e será salva no prontuário.</div></div></div><div class="timeline"><h3>Timeline</h3><div id="timeline"></div></div></div></section>
      <aside class="panel"><div class="pad"><h2>Prontuário</h2><div class="tabs"><span class="tab">Ana</span><span class="tab">Exa</span><span class="tab">Proc</span><span class="tab">Hip</span></div><div id="record" class="record"></div></div></aside>
    </section>
    <section class="grid" style="grid-template-columns:1fr 1fr 1fr"><div class="panel pad"><h3>Perguntas</h3><div class="actions">${Object.keys(c.questions).map(k=>button('Perguntar: '+pretty(k),`ask('${k}')`)).join('')}</div></div><div class="panel pad"><h3>Exames</h3><div class="actions">${Object.keys(c.exams).map(k=>button('Solicitar '+pretty(k),`exam('${k}')`)).join('')}</div></div><div class="panel pad"><h3>Procedimentos e hipótese</h3><div class="actions">${Object.keys(c.procedures).map(k=>button('Executar '+pretty(k),`procedure('${k}')`)).join('')}${c.hypotheses.map(h=>button('Hipótese: '+pretty(h),`hypothesis('${h}')`)).join('')}<button class="btn danger" onclick="finish()">Finalizar consulta</button></div></div></section>
  </main><div class="modal" id="modal"><div class="modal-card" id="modalCard"></div></div><div class="toast" id="toast"></div>`;
  renderRecord(); renderTimeline(); renderMissions(); updateBars();
}
function stat(a,b,c,w){return `<div class="stat"><b>${a}</b><span>${b}</span><small class="muted">${c}</small><div class="bar"><i style="width:${w}%"></i></div></div>`}
function vitals(v){return Object.entries(v).map(([k,val])=>`<div class="vital"><strong>${val}</strong><small>${k.toUpperCase()}</small></div>`).join('')}
function button(t,fn){return `<button class="btn" onclick="${fn}">${t}</button>`}
function pretty(s){return s.replaceAll('-',' ').replace(/\b\w/g,m=>m.toUpperCase())}
function typeInto(el,text){el.textContent=''; let i=0; const tick=()=>{el.textContent=text.slice(0,i++); if(i<=text.length)setTimeout(tick,12)}; tick();}
function instant(kind,title,text,critical=false){
  const feed=$('#clinicalFeed'); feed.innerHTML=`<div class="instant-card ${critical?'critical':''} pulse"><div class="label">${kind}</div><h3>${title}</h3><div class="type" id="typing"></div></div>`;
  typeInto($('#typing'), text); beep(critical?'critical':'click');
}
function addRecord(section,title,text){game.record[section].unshift({time:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),title,text}); game.record.timeline.unshift({time:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),title:labels[section]||section,text}); localStorage.setItem(saveKey, JSON.stringify({record:game.record})); renderRecord(); renderTimeline();}
function addTimeline(title,text){game.record.timeline.unshift({time:new Date().toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'}),title,text}); localStorage.setItem(saveKey, JSON.stringify({record:game.record})); renderTimeline();}
window.ask = (k)=>{const text=game.case.questions[k]; instant('Resposta do paciente', pretty(k), text); addRecord('anamnesis', pretty(k), text); progressMission('m1'); progressMission('m3'); game.confidence+=7; updateBars(); toast('Resposta adicionada ao prontuário.');}
window.exam = (k)=>{const e=game.case.exams[k]; game.confidence += e.confidence; const critical=e.status==='critico'; instant('Resultado de exame', pretty(k), e.result, critical); addRecord('exams', pretty(k)+' • '+e.status.toUpperCase(), e.result); showExam(k,e); progressMission('m2'); progressMission('m3'); updateBars();}
window.procedure = (k)=>{const text=game.case.procedures[k]; instant('Achado de procedimento', pretty(k), text); addRecord('procedures', pretty(k), text); progressMission('m1'); progressMission('m3'); game.confidence+=8; updateBars();}
window.hypothesis = (h)=>{const ok=h===game.case.correct; const text=ok?'Hipótese coerente com os achados atuais. Continue confirmando com exames e conduta.':'Hipótese possível, mas os dados atuais não sustentam como principal.'; instant(ok?'Hipótese forte':'Hipótese fraca', pretty(h), text, !ok); addRecord('hypotheses', pretty(h), text); game.confidence+=ok?15:-8; updateBars();}
window.finish = ()=>{const score=Math.max(0,Math.min(100,game.confidence + game.record.exams.length*4 + game.record.procedures.length*3)); game.xp+=Math.round(score*1.4); game.credits+=Math.round(score/4); if(game.xp>game.level*500){game.level++; toast('Level up! Novo nível médico desbloqueado.')} instant('Pós-consulta', 'Score '+score+'%', `Consulta encerrada. Confiança ${game.confidence}%. Estado do paciente: ${game.patientState}. XP e créditos atualizados.`); addRecord('conduct','Consulta finalizada',`Score ${score}%. Estado: ${game.patientState}.`); updateBars();}
function showExam(k,e){const m=$('#modal'), card=$('#modalCard'); card.innerHTML=`<h2>${pretty(k)}</h2><span class="badge ${e.status}">${e.status.toUpperCase()}</span><p style="line-height:1.6">${e.result}</p><button class="btn" onclick="document.getElementById('modal').classList.remove('on')">Enviar ao prontuário e fechar</button>`; m.classList.add('on');}
function renderRecord(){const r=$('#record'); if(!r)return; const html=Object.keys(labels).map(sec=>`<h3>${labels[sec]}</h3>${(game.record[sec]||[]).slice(0,8).map(e=>`<div class="entry"><b>${e.time} • ${e.title}</b><br>${e.text}</div>`).join('')||'<p class="muted">Sem registros ainda.</p>'}`).join(''); r.innerHTML=html;}
function renderTimeline(){const t=$('#timeline'); if(!t)return; t.innerHTML=(game.record.timeline||[]).slice(0,8).map(e=>`<div class="entry"><b>${e.time} • ${e.title}</b><br>${e.text}</div>`).join('') || '<p class="muted">Sem eventos.</p>';}
function renderMissions(){const box=$('#missions'); if(!box)return; box.innerHTML=game.missionList.map(m=>`<div class="mission"><span>${m.title}</span><b>${Math.min(m.goal,game.missions[m.id]||0)}/${m.goal}</b></div>`).join('')}
function progressMission(id){game.missions[id]=(game.missions[id]||0)+1; renderMissions();}
function updateBars(){game.confidence=Math.max(0,Math.min(100,game.confidence)); const bars=document.querySelectorAll('.bar>i'); if(bars[0]) bars[0].style.width=Math.min(100,game.xp%500/5)+'%'; if(bars[1]) bars[1].style.width=game.confidence+'%'; if(game.confidence<20) game.patientState='risco'; else if(game.confidence>70) game.patientState='estável';}
function toast(msg){const el=$('#toast'); el.textContent=msg; el.classList.add('on'); setTimeout(()=>el.classList.remove('on'),1700)}
function beep(type){try{const a=new AudioContext(); const o=a.createOscillator(); const g=a.createGain(); o.connect(g); g.connect(a.destination); o.frequency.value=type==='critical'?180:560; g.gain.value=.035; o.start(); setTimeout(()=>{o.stop();a.close()},type==='critical'?220:90)}catch(e){}}
load();
