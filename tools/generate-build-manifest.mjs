import fs from 'node:fs';import path from 'node:path';import crypto from 'node:crypto';
const root=path.resolve(new URL('..',import.meta.url).pathname);const skip=new Set(['BUILD_MANIFEST.json']);
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{const full=path.join(dir,entry.name);return entry.isDirectory()?walk(full):[full];});}
const files=walk(root).filter(file=>!skip.has(path.relative(root,file).replaceAll('\\','/'))).sort();
const entries=files.map(file=>{const data=fs.readFileSync(file);return {path:path.relative(root,file).replaceAll('\\','/'),size:data.length,sha256:crypto.createHash('sha256').update(data).digest('hex')};});
const build=JSON.parse(fs.readFileSync(path.join(root,'BUILD.json'),'utf8'));
fs.writeFileSync(path.join(root,'BUILD_MANIFEST.json'),JSON.stringify({product:build.product,version:build.version,build:build.build,algorithm:'SHA-256',fileCount:entries.length,files:entries},null,2)+'\n');
console.log(`manifest: ${entries.length} files`);
