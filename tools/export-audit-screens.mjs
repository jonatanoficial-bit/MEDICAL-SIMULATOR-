import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('..',import.meta.url));
const memory=new Map();
const storage={get length(){return memory.size;},key:index=>Array.from(memory.keys())[index]??null,getItem:key=>memory.has(key)?memory.get(key):null,setItem:(key,value)=>memory.set(key,String(value)),removeItem:key=>memory.delete(key),clear:()=>memory.clear()};
const classList={add(){},remove(){},contains(){return false;},toggle(){}};
const appElement={innerHTML:'',dataset:{},classList,append(){},querySelector(){return null;},querySelectorAll(){return[];}};
const body={innerHTML:'',classList,append(){},appendChild(){}};
const documentStub={readyState:'loading',fullscreenElement:null,documentElement:{lang:'pt-BR',dataset:{},style:{setProperty(){}},requestFullscreen:()=>Promise.resolve()},body,querySelector:selector=>selector==='#app'?appElement:null,querySelectorAll:()=>[],createTreeWalker:()=>({currentNode:null,nextNode(){return false;}}),addEventListener(){},removeEventListener(){},createElement:()=>({className:'',textContent:'',classList,style:{},append(){},click(){},remove(){},setAttribute(){}})};
Object.defineProperty(globalThis,'window',{value:globalThis,configurable:true});
Object.defineProperty(globalThis,'document',{value:documentStub,configurable:true});
Object.defineProperty(globalThis,'navigator',{value:{userAgent:'ValeScreenExporter/1.0',language:'pt-BR',onLine:true,standalone:false},configurable:true});
Object.defineProperty(globalThis,'location',{value:{search:'',protocol:'http:',pathname:'/index.html',reload(){},href:'http://local/index.html'},configurable:true});
globalThis.localStorage=storage;globalThis.sessionStorage=storage;globalThis.innerWidth=390;globalThis.innerHeight=844;
globalThis.visualViewport={width:390,height:844,scale:1,offsetTop:0,offsetLeft:0,addEventListener(){},removeEventListener(){}};
globalThis.screen={orientation:{type:'portrait-primary',addEventListener(){},removeEventListener(){}}};
globalThis.matchMedia=query=>({matches:query.includes('max-width'),addEventListener(){},removeEventListener(){}});
globalThis.alert=()=>{};globalThis.addEventListener=()=>{};globalThis.removeEventListener=()=>{};
globalThis.NodeFilter={SHOW_TEXT:4,FILTER_REJECT:2,FILTER_ACCEPT:1};
globalThis.fetch=async input=>{const raw=String(input).split('?')[0].replace(/^\.\//,'');const file=path.join(root,raw);if(!fs.existsSync(file))return {ok:false,status:404,json:async()=>({})};return {ok:true,status:200,json:async()=>JSON.parse(fs.readFileSync(file,'utf8'))};};
await import('../src/app.js');
await new Promise(resolve=>setTimeout(resolve,120));
const screens={};
for(const screenName of ['setup','hub','career','specialty','shift','learning','settings','outpatient','emergency','beta','recovery']){
  globalThis.state.screen=screenName;
  if(screenName==='shift'){globalThis.state.selectedSpec='clinica-medica';globalThis.state.ui.shiftTab='summary';globalThis.state.ui.resultsOpen=false;globalThis.state.ui.closureReview=false;}
  globalThis.render();
  screens[screenName]=appElement.innerHTML;
}
globalThis.state.screen='shift';globalThis.state.ui.resultsOpen=true;globalThis.render();screens['shift-results']=appElement.innerHTML;
globalThis.state.ui.resultsOpen=false;globalThis.state.ui.closureReview=true;globalThis.render();screens['shift-review']=appElement.innerHTML;
globalThis.state.ui.closureReview=false;globalThis.state.ui.shiftTab='questions';globalThis.render();screens['shift-questions']=appElement.innerHTML;
globalThis.state.ui.shiftTab='procedures';globalThis.render();screens['shift-procedures']=appElement.innerHTML;
globalThis.state.ui.shiftTab='exams';globalThis.render();screens['shift-exams']=appElement.innerHTML;
globalThis.state.ui.shiftTab='diagnosis';globalThis.render();screens['shift-diagnosis']=appElement.innerHTML;


for(const locale of ['pt-BR','en','es']){
  globalThis.state.locale=locale;
  globalThis.state.screen='emergency';
  globalThis.state.emergency={scenarioId:null,session:null,completed:{},rewarded:{}};
  globalThis.render();
  screens[`${locale}-emergency-catalog`]=appElement.innerHTML;
  globalThis.startEmergencyScenario('anaphylaxis');
  screens[`${locale}-emergency-active`]=appElement.innerHTML;
}


for(const locale of ['pt-BR','en','es']){
  globalThis.state.locale=locale;
  globalThis.state.screen='outpatient';
  globalThis.state.outpatient={programId:null,session:null,completed:[],xpClaimed:[]};
  globalThis.render();
  screens[`${locale}-outpatient-catalog`]=appElement.innerHTML;
  globalThis.startOutpatientProgram('hypertension-followup');
  screens[`${locale}-outpatient-active`]=appElement.innerHTML;
  globalThis.state.ui.outpatientTab='plan';globalThis.render();
  screens[`${locale}-outpatient-plan`]=appElement.innerHTML;
}


for(const locale of ['pt-BR','en','es']){
  globalThis.state.locale=locale;globalThis.state.screen='specialty';globalThis.state.difficulty='student';globalThis.render();screens[`${locale}-branch-specialty`]=appElement.innerHTML;
  for(const difficulty of ['beginner','student','professional','challenge']){
    globalThis.state.difficulty=difficulty;globalThis.state.selectedSpec='clinica-medica';globalThis.resetEncounterData();globalThis.state.screen='shift';globalThis.state.ui.shiftTab='summary';globalThis.render();screens[`${locale}-branch-${difficulty}-summary`]=appElement.innerHTML;
    globalThis.state.ui.shiftTab='diagnosis';globalThis.render();screens[`${locale}-branch-${difficulty}-diagnosis`]=appElement.innerHTML;
  }
}



for(const locale of ['pt-BR','en','es']){
  globalThis.state.locale=locale;
  globalThis.state.screen='career';
  globalThis.state.emergency.completed=[];globalThis.state.outpatient.completed=[];
  globalThis.state.career={stageId:'intern',day:4,rotationId:'triage',examSession:null,examResults:{},examRewardsClaimed:[],claimedMissions:[],attendanceDates:[],activityLog:[{type:'case',score:86,at:'2026-06-13T15:00:00.000Z'}],competencies:{'clinica-medica':{activities:3,totalScore:252,average:84}},streak:3,lastActivityDate:'2026-06-13',totalActivities:3};
  globalThis.state.completed=[
    {id:'hypertension',score:84},{id:'tension-headache',score:82},{id:'gerd',score:86}
  ];
  globalThis.state.academy.passedModules={'safety-limits':true,'initial-assessment':true};
  globalThis.state.commercial.world.stress=42;
  globalThis.state.commercial.world.journal=[{type:'case',caseId:'hypertension',week:1,score:86}];
  globalThis.state.ui.careerTab='overview';globalThis.render();screens[`${locale}-career-overview`]=appElement.innerHTML;
  globalThis.state.ui.careerTab='journey';globalThis.render();screens[`${locale}-career-journey`]=appElement.innerHTML;
  globalThis.state.ui.careerTab='residency';globalThis.render();screens[`${locale}-career-residency`]=appElement.innerHTML;
  globalThis.state.ui.careerTab='hospital';globalThis.render();screens[`${locale}-career-hospital`]=appElement.innerHTML;
  globalThis.state.ui.careerTab='exams';globalThis.render();screens[`${locale}-career-exams`]=appElement.innerHTML;
  globalThis.state.ui.careerTab='calendar';globalThis.render();screens[`${locale}-career-calendar`]=appElement.innerHTML;
}


for(const locale of ['pt-BR','en','es']){
  globalThis.state.locale=locale;globalThis.state.screen='beta';globalThis.state.ui.betaTab='status';globalThis.runBetaAudit();screens[`${locale}-beta-status`]=appElement.innerHTML;
  globalThis.state.ui.betaTab='checklist';globalThis.render();screens[`${locale}-beta-checklist`]=appElement.innerHTML;
  globalThis.state.ui.betaTab='feedback';globalThis.render();screens[`${locale}-beta-feedback`]=appElement.innerHTML;
  globalThis.state.ui.betaTab='sessions';globalThis.render();screens[`${locale}-beta-sessions`]=appElement.innerHTML;
}

const academy=JSON.parse(fs.readFileSync(path.join(root,'data/academy.json'),'utf8'));
for(const locale of ['pt-BR','en','es']){
  globalThis.state.locale=locale;globalThis.state.screen='learning';globalThis.state.ui.academyView='catalog';globalThis.state.ui.academyModuleId=null;globalThis.render();screens[`${locale}-academy-catalog`]=appElement.innerHTML;
  globalThis.openAcademyModule('safety-limits');screens[`${locale}-academy-module`]=appElement.innerHTML;
  const first=academy.modules[0].locales[locale];for(const lesson of first.lessons)globalThis.state.academy.completedLessons[`safety-limits:${lesson.id}`]=true;
  globalThis.state.ui.academyView='quiz';globalThis.state.ui.academyModuleId='safety-limits';globalThis.state.ui.academyQuizFeedback=null;globalThis.render();screens[`${locale}-academy-quiz`]=appElement.innerHTML;
  globalThis.state.academy.passedModules['guided-reasoning']=true;globalThis.state.academy.guided={current:0,answers:[],correct:0,completed:false,score:null};globalThis.state.ui.academyView='guided';globalThis.state.ui.academyModuleId='guided-reasoning';globalThis.render();screens[`${locale}-academy-guided`]=appElement.innerHTML;
}
process.stdout.write(JSON.stringify({build:'2.0.0',screens}));
