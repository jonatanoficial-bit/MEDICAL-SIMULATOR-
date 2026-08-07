import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('..',import.meta.url));
const dependencyRoot='C:/Users/jonat/.cache/codex-runtimes/codex-primary-runtime/dependencies/node';
const require=createRequire(path.join(dependencyRoot,'package.json'));
const {chromium}=require('playwright');
const browserCandidates=[
  process.env.MEDSIM_BROWSER,
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/usr/bin/chromium'
].filter(Boolean);
const executablePath=browserCandidates.find(candidate=>fs.existsSync(candidate));
const exported=JSON.parse(execFileSync(process.execPath,[path.join(root,'tools/export-audit-screens.mjs')],{cwd:root,encoding:'utf8',maxBuffer:40*1024*1024}));
const css=fs.readFileSync(path.join(root,'src/styles.css'),'utf8');
const outdir=path.join(root,'docs/screenshots-v2.0.0');
fs.mkdirSync(outdir,{recursive:true});
const profiles=[
  ['pt-BR',568,320,'Reputação do hospital'],
  ['pt-BR',640,360,'Mentoria'],
  ['pt-BR',667,375,'Especializações'],
  ['en',740,360,'Hospital reputation'],
  ['es',780,360,'Reputación del hospital'],
  ['pt-BR',812,375,'Histórico recente'],
  ['en',844,390,'Hospital reputation'],
  ['es',852,393,'Mentoría'],
  ['pt-BR',896,414,'Especializações'],
  ['en',915,412,'Specializations'],
  ['es',932,430,'Reputación del hospital'],
  ['pt-BR',960,432,'Reputação do hospital'],
  ['pt-BR',768,1024,'Especializações'],
  ['en',1024,600,'Hospital reputation'],
  ['en',1024,768,'Specializations'],
  ['es',1180,820,'Especializaciones'],
  ['pt-BR',1280,720,'Histórico recente'],
  ['en',1280,800,'Recent history'],
  ['es',1366,768,'Especializaciones'],
  ['pt-BR',1440,900,'Reputação do hospital'],
  ['en',1600,900,'Mentoring'],
  ['pt-BR',1920,1080,'Histórico recente']
  ,['es',2560,1440,'Historial reciente']
];
const captureSet=new Set(['568x320','640x360','844x390','932x430','768x1024','1024x768','1366x768','1920x1080']);
const browser=await chromium.launch({headless:true,executablePath,args:['--no-sandbox','--disable-gpu']});
const results=[];
for(const [locale,width,height,marker] of profiles){
  const context=await browser.newContext({viewport:{width,height},hasTouch:width<=932,isMobile:false});
  const page=await context.newPage();
  const errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  const screen=`${locale}-career-journey`;
  await page.setContent(`<!doctype html><html lang="${locale}" class="touch-scroll-enabled"><head><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><style>${css}</style></head><body class="touch-scroll-enabled">${exported.screens[screen]}</body></html>`,{waitUntil:'domcontentloaded'});
  const text=await page.locator('body').innerText();
  const metrics=await page.evaluate(()=>{
    const controls=[...document.querySelectorAll('button,select,input')].filter(node=>{const rect=node.getBoundingClientRect();const style=getComputedStyle(node);return rect.width>0&&rect.height>0&&style.display!=='none'&&style.visibility!=='hidden';});
    return {viewportWidth:innerWidth,documentWidth:document.documentElement.scrollWidth,documentHeight:document.documentElement.scrollHeight,visibleControls:controls.length,minControlHeight:controls.length?Math.min(...controls.map(node=>node.getBoundingClientRect().height)):null};
  });
  const name=`career-journey-${locale}-${width}x${height}.png`;
  const screenshot=captureSet.has(`${width}x${height}`)?`docs/screenshots-v2.0.0/${name}`:null;
  if(screenshot)await page.screenshot({path:path.join(root,screenshot),fullPage:true});
  results.push({locale,viewport:[width,height],markerFound:text.includes(marker),overflowX:metrics.documentWidth>metrics.viewportWidth+1,metrics,pageErrors:errors,screenshot});
  await context.close();
}
await browser.close();
const failures=[];
for(const result of results){
  if(!result.markerFound)failures.push(`${result.locale} ${result.viewport.join('x')}: marker`);
  if(result.overflowX)failures.push(`${result.locale} ${result.viewport.join('x')}: horizontal overflow`);
  if(result.metrics.minControlHeight!==null&&result.metrics.minControlHeight<43.5)failures.push(`${result.locale} ${result.viewport.join('x')}: control ${result.metrics.minControlHeight}`);
  if(result.pageErrors.length)failures.push(`${result.locale} ${result.viewport.join('x')}: page error`);
}
const report={ok:failures.length===0,method:'Production career DOM and CSS rendered in installed Chromium browser',browser:executablePath||'bundled',minimumControlHeight:44,failures,profiles:results};
fs.writeFileSync(path.join(root,'docs/audit-career-layout-v2.0.0.json'),`${JSON.stringify(report,null,2)}\n`);
console.log(JSON.stringify(report,null,2));
if(failures.length)process.exitCode=1;
