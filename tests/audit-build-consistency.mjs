import fs from 'node:fs';
const read=file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const json=file=>JSON.parse(read(file));
const expected='0.18.0';
const build=json('BUILD.json');
const packageJson=json('package.json');
const webmanifest=json('manifest.webmanifest');
const content=json('data/content-index.json');
const coreManifest=json('content/manifest.json');
const config=read('src/config/build.js');
const index=read('index.html');
const sw=read('sw.js');
const checks={
  build:build.version===expected,
  package:packageJson.version===expected,
  webmanifest:webmanifest.start_url.includes(expected)&&webmanifest.display_override.includes('fullscreen'),
  content:content.contentVersion===expected,
  coreManifest:coreManifest.version===expected&&coreManifest.architecture.saveSchema===9&&coreManifest.architecture.contentSchema===3,
  config:config.includes(`version: '${expected}'`)&&config.includes('saveSchema: 9')&&config.includes('contentSchema: 3'),
  index:index.includes(`v${expected}`)&&index.includes('src/core/boot-guard.js'),
  serviceWorker:sw.includes(`VERSION='${expected}'`)
};
const failed=Object.entries(checks).filter(([,ok])=>!ok);
if(failed.length)throw new Error(`Versionamento divergente: ${failed.map(([key])=>key).join(', ')}`);
console.log(JSON.stringify({ok:true,version:expected,checks},null,2));
