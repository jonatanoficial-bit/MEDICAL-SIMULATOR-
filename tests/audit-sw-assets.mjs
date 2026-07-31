import {fileURLToPath} from 'node:url';
import fs from 'node:fs';
import path from 'node:path';
const root=fileURLToPath(new URL('..',import.meta.url));
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
const blocks=['CRITICAL_ASSETS','DATA_ASSETS','OPTIONAL_ASSETS'];
const assets=[];
for(const name of blocks){
  const match=sw.match(new RegExp(`const ${name}=\\[([\\s\\S]*?)\\];`));
  if(!match)throw new Error(`Bloco ${name} ausente.`);
  for(const item of match[1].matchAll(/'([^']+)'/g))assets.push({block:name,url:item[1]});
}
const missing=assets.filter(item=>{
  const relative=item.url==='./'?'index.html':item.url.replace(/^\.\//,'');
  return !fs.existsSync(path.join(root,relative));
});
const duplicates=assets.map(x=>x.url).filter((url,index,array)=>array.indexOf(url)!==index);
if(missing.length||duplicates.length)throw new Error(JSON.stringify({missing,duplicates}));
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
for(const required of ['src/styles.css','src/core/boot-guard.js','src/app.js','manifest.webmanifest','favicon.ico'])if(!index.includes(required))throw new Error(`Referência ausente no index: ${required}`);
console.log(JSON.stringify({ok:true,assets:assets.length,critical:assets.filter(x=>x.block==='CRITICAL_ASSETS').length,data:assets.filter(x=>x.block==='DATA_ASSETS').length,optional:assets.filter(x=>x.block==='OPTIONAL_ASSETS').length},null,2));
