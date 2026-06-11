const VERSION='0.12.0';
const CACHE_PREFIX='medical-simulator-vale-edition-v';
const CACHE_NAME=`${CACHE_PREFIX}${VERSION.replaceAll('.','-')}`;
const CRITICAL_ASSETS=[
  './','./index.html','./manifest.webmanifest','./favicon.ico','./BUILD.json','./VERSAO.txt',
  './src/core/boot-guard.js','./src/app.js','./src/styles.css','./src/config/build.js',
  './src/core/default-state.js','./src/core/object.js','./src/core/checksum.js','./src/core/storage.js',
  './src/core/diagnostics.js','./src/core/runtime-health.js','./src/core/sw-manager.js',
  './src/data/content-loader.js','./src/data/content-schema.js','./src/data/fallback-content.js',
  './src/i18n/index.js','./src/compat/legacy-guards.js'
];
const DATA_ASSETS=[
  './data/content-index.json','./data/core-cases.json','./data/gameplay.json','./data/queue.json',
  './data/specialties.json','./data/missions.json','./data/clinical-responses.json'
];
const OPTIONAL_ASSETS=[
  './assets/backgrounds/background_01.png','./assets/backgrounds/background_04.png','./assets/backgrounds/background_05.png',
  './assets/backgrounds/background_08.png','./assets/backgrounds/background_09.png','./assets/backgrounds/background_10.png',
  './assets/avatars/avatar_01.png','./assets/avatars/avatar_02.png','./assets/avatars/avatar_03.png','./assets/avatars/avatar_04.png','./assets/avatars/avatar_05.png',
  './assets/ui/ui_01.png','./assets/ui/ui_02.png','./assets/ui/ui_03.png','./assets/ui/ui_04.png','./assets/ui/ui_05.png'
];

async function installVerifiedCache(){
  const cache=await caches.open(CACHE_NAME);
  await cache.addAll(CRITICAL_ASSETS);
  const criticalChecks=await Promise.all(CRITICAL_ASSETS.map(async asset=>({asset,ok:!!(await cache.match(asset,{ignoreSearch:true}))})));
  const missing=criticalChecks.filter(item=>!item.ok);
  if(missing.length)throw new Error(`Cache crítico incompleto: ${missing.map(x=>x.asset).join(', ')}`);
  await Promise.allSettled([...DATA_ASSETS,...OPTIONAL_ASSETS].map(asset=>cache.add(asset)));
}

self.addEventListener('install',event=>{
  event.waitUntil(installVerifiedCache());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=(await caches.keys()).filter(key=>key.startsWith(CACHE_PREFIX)).sort().reverse();
    const keep=new Set([CACHE_NAME,...keys.filter(key=>key!==CACHE_NAME).slice(0,1)]);
    await Promise.all(keys.filter(key=>!keep.has(key)).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

async function matchAcrossCaches(request){
  const current=await caches.open(CACHE_NAME);
  const currentMatch=await current.match(request,{ignoreSearch:true});
  if(currentMatch)return currentMatch;
  const keys=(await caches.keys()).filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).sort().reverse();
  for(const key of keys){const match=await (await caches.open(key)).match(request,{ignoreSearch:true});if(match)return match;}
  return null;
}

async function fetchWithTimeout(request,timeoutMs=5000){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{return await fetch(request,{signal:controller.signal});}finally{clearTimeout(timer);}
}

async function networkFirst(request){
  const cache=await caches.open(CACHE_NAME);
  try{
    const response=await fetchWithTimeout(request,5000);
    if(response&&response.ok)cache.put(request,response.clone()).catch(()=>{});
    return response;
  }catch(error){
    const cached=await matchAcrossCaches(request);
    if(cached)return cached;
    if(request.mode==='navigate')return matchAcrossCaches('./index.html');
    throw error;
  }
}

async function cacheFirst(request){
  const cached=await matchAcrossCaches(request);
  if(cached)return cached;
  const response=await fetchWithTimeout(request,7000);
  if(response&&response.ok)(await caches.open(CACHE_NAME)).put(request,response.clone()).catch(()=>{});
  return response;
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  const path=url.pathname;
  const isCodeOrData=/\.(?:html|js|css|json|webmanifest)$/.test(path)||path.endsWith('/');
  event.respondWith(isCodeOrData?networkFirst(event.request):cacheFirst(event.request));
});

self.addEventListener('message',event=>{
  const type=event.data?.type;
  if(type==='SKIP_WAITING')self.skipWaiting();
  if(type==='GET_VERSION')event.source?.postMessage({type:'SW_VERSION',version:VERSION,cache:CACHE_NAME});
  if(type==='HEALTH_CHECK')event.source?.postMessage({type:'SW_HEALTH',version:VERSION,cache:CACHE_NAME,ok:true});
  if(type==='CLEAR_CURRENT_CACHE')event.waitUntil(caches.delete(CACHE_NAME));
});
