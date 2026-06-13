import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);
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
for(const screenName of ['setup','hub','specialty','shift','learning','settings','outpatient','emergency','recovery']){
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

const academy=JSON.parse(fs.readFileSync(path.join(root,'data/academy.json'),'utf8'));
for(const locale of ['pt-BR','en','es']){
  globalThis.state.locale=locale;globalThis.state.screen='learning';globalThis.state.ui.academyView='catalog';globalThis.state.ui.academyModuleId=null;globalThis.render();screens[`${locale}-academy-catalog`]=appElement.innerHTML;
  globalThis.openAcademyModule('safety-limits');screens[`${locale}-academy-module`]=appElement.innerHTML;
  const first=academy.modules[0].locales[locale];for(const lesson of first.lessons)globalThis.state.academy.completedLessons[`safety-limits:${lesson.id}`]=true;
  globalThis.state.ui.academyView='quiz';globalThis.state.ui.academyModuleId='safety-limits';globalThis.state.ui.academyQuizFeedback=null;globalThis.render();screens[`${locale}-academy-quiz`]=appElement.innerHTML;
  globalThis.state.academy.passedModules['guided-reasoning']=true;globalThis.state.academy.guided={current:0,answers:[],correct:0,completed:false,score:null};globalThis.state.ui.academyView='guided';globalThis.state.ui.academyModuleId='guided-reasoning';globalThis.render();screens[`${locale}-academy-guided`]=appElement.innerHTML;
}
process.stdout.write(JSON.stringify({build:'0.24.0',screens}));
