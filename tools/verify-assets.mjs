import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('..',import.meta.url));
const original=process.argv[2];
if(!original||!fs.existsSync(original))throw new Error('Informe a pasta original existente como primeiro argumento.');
const visualExtensions=new Set(['.png','.jpg','.jpeg','.webp','.gif','.svg','.ico']);
function collect(base){
  const assetRoot=path.join(base,'assets');
  const files=[];
  const walk=dir=>{for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory())walk(full);else if(visualExtensions.has(path.extname(entry.name).toLowerCase()))files.push(full);}};
  walk(assetRoot);
  return Object.fromEntries(files.sort().map(file=>{
    const data=fs.readFileSync(file);
    const relative=path.relative(assetRoot,file).replaceAll('\\','/');
    return [relative,{size:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')}];
  }));
}
const source=collect(path.resolve(original));
const copy=collect(root);
const names=[...new Set([...Object.keys(source),...Object.keys(copy)])].sort();
const differences=names.filter(name=>!source[name]||!copy[name]||source[name].size!==copy[name].size||source[name].sha256!==copy[name].sha256).map(name=>({path:name,original:source[name]||null,copy:copy[name]||null}));
const report={ok:differences.length===0,scope:'assets visual files',algorithm:'SHA-256',originalRoot:path.resolve(original),copyRoot:root,originalCount:Object.keys(source).length,copyCount:Object.keys(copy).length,differenceCount:differences.length,differences,files:copy};
const output=path.join(root,'docs/asset-integrity-v2.0.0.json');
fs.writeFileSync(output,`${JSON.stringify(report,null,2)}\n`);
console.log(JSON.stringify({ok:report.ok,originalCount:report.originalCount,copyCount:report.copyCount,differenceCount:report.differenceCount,report:path.relative(root,output)},null,2));
if(!report.ok)process.exitCode=1;
