import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const memory=new Map();
const storage={get length(){return memory.size;},key:index=>Array.from(memory.keys())[index]??null,getItem:key=>memory.has(key)?memory.get(key):null,setItem:(key,value)=>memory.set(key,String(value)),removeItem:key=>memory.delete(key),clear:()=>memory.clear()};
const classList={add(){},remove(){},contains(){return false;},toggle(){}};
const appElement={innerHTML:'',dataset:{},classList,append(){},querySelector(){return null;},querySelectorAll(){return[];}};
const body={innerHTML:'',classList,append(){},appendChild(){}};
const documentStub={readyState:'loading',fullscreenElement:null,documentElement:{lang:'pt-BR',dataset:{},style:{setProperty(){}},requestFullscreen:()=>Promise.resolve()},body,querySelector:selector=>selector==='#app'?appElement:null,querySelectorAll:()=>[],addEventListener(){},removeEventListener(){},createElement:()=>({className:'',textContent:'',classList,style:{},append(){},click(){},remove(){},setAttribute(){}})};
Object.defineProperty(globalThis,'window',{value:globalThis,configurable:true});
Object.defineProperty(globalThis,'document',{value:documentStub,configurable:true});
Object.defineProperty(globalThis,'navigator',{value:{userAgent:'ValeScreenExporter/1.0',language:'pt-BR',onLine:true,standalone:false},configurable:true});
Object.defineProperty(globalThis,'location',{value:{search:'',protocol:'http:',pathname:'/index.html',reload(){},href:'http://local/index.html'},configurable:true});
globalThis.localStorage=storage;globalThis.sessionStorage=storage;globalThis.innerWidth=390;globalThis.innerHeight=844;
globalThis.visualViewport={width:390,height:844,scale:1,offsetTop:0,offsetLeft:0,addEventListener(){},removeEventListener(){}};
globalThis.screen={orientation:{type:'portrait-primary',addEventListener(){},removeEventListener(){}}};
globalThis.matchMedia=query=>({matches:query.includes('max-width'),addEventListener(){},removeEventListener(){}});
globalThis.alert=()=>{};globalThis.addEventListener=()=>{};globalThis.removeEventListener=()=>{};
globalThis.fetch=async input=>{const raw=String(input).split('?')[0].replace(/^\.\//,'');const file=path.join(root,raw);if(!fs.existsSync(file))return {ok:false,status:404,json:async()=>({})};return {ok:true,status:200,json:async()=>JSON.parse(fs.readFileSync(file,'utf8'))};};
await import('../src/app.js');
await new Promise(resolve=>setTimeout(resolve,120));
const screens={};
for(const screenName of ['setup','hub','specialty','shift','settings','recovery']){
  globalThis.state.screen=screenName;
  if(screenName==='shift'){globalThis.state.selectedSpec='clinica-medica';globalThis.state.ui.shiftTab='summary';globalThis.state.ui.resultsOpen=false;globalThis.state.ui.closureReview=false;}
  globalThis.render();
  screens[screenName]=appElement.innerHTML;
}
globalThis.state.screen='shift';globalThis.state.ui.resultsOpen=true;globalThis.render();screens['shift-results']=appElement.innerHTML;
globalThis.state.ui.resultsOpen=false;globalThis.state.ui.closureReview=true;globalThis.render();screens['shift-review']=appElement.innerHTML;
process.stdout.write(JSON.stringify({build:'0.15.0',screens}));
