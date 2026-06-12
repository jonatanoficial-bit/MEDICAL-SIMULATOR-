import fs from 'node:fs';
import path from 'node:path';
const root=path.resolve(new URL('..',import.meta.url).pathname);
const memory=new Map();
const storage={
  get length(){return memory.size;},
  key:index=>Array.from(memory.keys())[index]??null,
  getItem:key=>memory.has(key)?memory.get(key):null,
  setItem:(key,value)=>memory.set(key,String(value)),
  removeItem:key=>memory.delete(key),clear:()=>memory.clear()
};
const classList={add(){},remove(){},contains(){return false;}};
const appElement={innerHTML:'',dataset:{},classList,append(){},querySelector(){return null;}};
const body={innerHTML:'',classList,append(){},appendChild(){}};
const documentStub={
  readyState:'loading',fullscreenElement:null,
  documentElement:{lang:'pt-BR',dataset:{},style:{setProperty(){}},requestFullscreen:()=>Promise.resolve()},body,
  querySelector:selector=>selector==='#app'?appElement:null,
  querySelectorAll:()=>[],
  addEventListener(){},removeEventListener(){},
  createElement:()=>({className:'',textContent:'',classList,style:{},append(){},click(){},remove(){},setAttribute(){}})
};
Object.defineProperty(globalThis,'window',{value:globalThis,configurable:true});
Object.defineProperty(globalThis,'document',{value:documentStub,configurable:true});
Object.defineProperty(globalThis,'navigator',{value:{userAgent:'ValeRuntimeAudit/1.0',language:'pt-BR',onLine:true,standalone:false},configurable:true});
Object.defineProperty(globalThis,'location',{value:{search:'',protocol:'http:',pathname:'/index.html',reload(){},href:'http://local/index.html'},configurable:true});
globalThis.localStorage=storage;globalThis.sessionStorage=storage;
globalThis.innerWidth=390;globalThis.innerHeight=844;globalThis.visualViewport={width:390,height:844,scale:1,offsetTop:0,offsetLeft:0,addEventListener(){},removeEventListener(){}};globalThis.screen={orientation:{type:'portrait-primary',addEventListener(){},removeEventListener(){}}};
globalThis.matchMedia=()=>({matches:true,addEventListener(){},removeEventListener(){}});
globalThis.alert=()=>{};
globalThis.addEventListener=()=>{};globalThis.removeEventListener=()=>{};
globalThis.fetch=async input=>{
  const raw=String(input).split('?')[0].replace(/^\.\//,'');
  const file=path.join(root,raw);
  if(!fs.existsSync(file))return {ok:false,status:404,json:async()=>({})};
  return {ok:true,status:200,json:async()=>JSON.parse(fs.readFileSync(file,'utf8'))};
};
await import('../src/app.js');
await new Promise(resolve=>setTimeout(resolve,120));
if(!appElement.innerHTML.includes('NOVO GAME'))throw new Error('Tela inicial não renderizou.');
if(!appElement.innerHTML.includes('v0.18.0'))throw new Error('Build visível ausente.');
if(appElement.innerHTML.includes('Modo segurança ativo'))throw new Error('Runtime caiu no modo de segurança.');
if(globalThis.VALE_CONTENT_STATUS?.caseCount!==6)throw new Error('Conteúdo clínico não foi ativado.');
const screens={};
for(const [screen,needle] of [['hub','LOBBY DO RESIDENTE'],['specialty','Escolha sua especialidade'],['shift','PLANTÃO - MODO SIMULADOR'],['settings','Proteção do progresso'],['recovery','Central de recuperação']]){
  globalThis.state.screen=screen;
  if(screen==='shift')globalThis.state.selectedSpec='clinica-medica';
  globalThis.render();
  if(!appElement.innerHTML.includes(needle))throw new Error(`Tela ${screen} não renderizou o conteúdo esperado.`);
  if(screen==='shift'&&!appElement.innerHTML.includes('shift-mobile-tabs'))throw new Error('Navegação clínica mobile ausente.');
  screens[screen]=Buffer.byteLength(appElement.innerHTML);
}
globalThis.setAccessibility('contrast','high');
if(globalThis.state.accessibility.contrast!=='high'||document.documentElement.dataset.contrast!=='high')throw new Error('Alto contraste não foi aplicado ao estado e ao DOM.');
globalThis.setAccessibility('textSize','extra-large');
if(document.documentElement.dataset.textSize!=='extra-large')throw new Error('Tamanho de texto não foi aplicado.');
globalThis.setAccessibility('reduceMotion',true);
if(document.documentElement.dataset.motion!=='reduced')throw new Error('Redução de movimento não foi aplicada.');
globalThis.resetAccessibility();
if(globalThis.state.accessibility.contrast!=='standard'||document.documentElement.dataset.textSize!=='medium')throw new Error('Reset de acessibilidade falhou.');
console.log(JSON.stringify({ok:true,initialScreen:'setup',contentMode:globalThis.VALE_CONTENT_STATUS.mode,cases:globalThis.VALE_CONTENT_STATUS.caseCount,screens,accessibility:'applied-and-reset'},null,2));
