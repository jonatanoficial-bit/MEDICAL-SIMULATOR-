import fs from 'node:fs';
const read=file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const required={
  storage:['vale-medical-save','pendingKey','maxBackups','restoreBackup','checksum'],
  boot:['TIMEOUT=12000','medsim-boot-attempts-v012','modo seguro','clearCaches'],
  loader:['last-known-good','timeoutMs=5000','retries=1','validateGameContent'],
  sw:['CRITICAL_ASSETS','Cache crítico incompleto','slice(0,1)','SKIP_WAITING'],
  app:['CENTRAL DE RECUPERAÇÃO','repairTransientState','safeExportDiagnostics','verifyRuntimeBuild']
};
const sources={storage:read('src/core/storage.js'),boot:read('src/core/boot-guard.js'),loader:read('src/data/content-loader.js'),sw:read('sw.js'),app:read('src/app.js')};
const missing=[];
for(const [group,tokens] of Object.entries(required))for(const token of tokens)if(!sources[group].includes(token))missing.push(`${group}:${token}`);
if(missing.length)throw new Error(`Proteções ausentes: ${missing.join(' | ')}`);
console.log(JSON.stringify({ok:true,groups:Object.keys(required),assertions:Object.values(required).flat().length},null,2));
