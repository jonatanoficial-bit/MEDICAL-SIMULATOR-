import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root=path.resolve(fileURLToPath(new URL('..',import.meta.url)));
const output=path.join(root,'dist');
if(path.dirname(output)!==root)throw new Error('Destino de build inválido.');
fs.rmSync(output,{recursive:true,force:true});
fs.mkdirSync(output,{recursive:true});

const files=['index.html','404.html','privacy.html','terms.html','accessibility.html','manifest.webmanifest','favicon.ico','sw.js','BUILD.json','BUILD-INFO.json','BUILD.txt','RELEASE.json','VERSAO.txt'];
const directories=['assets','content','data','src'];
for(const file of files)fs.copyFileSync(path.join(root,file),path.join(output,file));
for(const directory of directories)fs.cpSync(path.join(root,directory),path.join(output,directory),{recursive:true});

const count=directory=>fs.readdirSync(directory,{withFileTypes:true}).reduce((sum,item)=>sum+(item.isDirectory()?count(path.join(directory,item.name)):1),0);
console.log(JSON.stringify({ok:true,output,files:count(output)},null,2));
