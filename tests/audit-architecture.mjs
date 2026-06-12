import fs from 'node:fs';
const required=['src/config/build.js','src/core/default-state.js','src/core/storage.js','src/core/checksum.js','src/core/diagnostics.js','src/core/boot-guard.js','src/core/runtime-health.js','src/core/sw-manager.js','src/core/accessibility.js','src/data/content-loader.js','src/data/content-schema.js','src/data/fallback-content.js','src/i18n/index.js','src/compat/legacy-guards.js','data/content-index.json'];
const missing=required.filter(file=>!fs.existsSync(new URL('../'+file,import.meta.url)));
if(missing.length){console.error({missing});process.exit(1);} 
const app=fs.readFileSync(new URL('../src/app.js',import.meta.url),'utf8');
const forbidden=['const cases=[','const exams=[','const missionBank=[','const examResultBank={'];
const embedded=forbidden.filter(token=>app.includes(token));
if(embedded.length){console.error({embedded});process.exit(1);} 
console.log(JSON.stringify({ok:true,requiredModules:required.length,appBytes:Buffer.byteLength(app)},null,2));
