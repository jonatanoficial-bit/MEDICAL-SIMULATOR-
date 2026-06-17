const VERSION='0.27.0';
const CACHE_PREFIX='medical-simulator-vale-edition-v';
const CACHE_NAME=`${CACHE_PREFIX}${VERSION.replaceAll('.','-')}`;
const OFFLINE_FALLBACK='./index.html';
const CRITICAL_ASSETS=[
  './','./index.html','./manifest.webmanifest','./favicon.ico','./BUILD.json','./VERSAO.txt',
  './src/core/boot-guard.js','./src/app.js','./src/styles.css','./src/config/build.js',
  './src/core/default-state.js','./src/core/touch-scroll-guard.js','./src/core/object.js','./src/core/checksum.js','./src/core/storage.js',
  './src/core/diagnostics.js','./src/core/beta-observability.js','./src/core/beta-self-test.js','./src/core/runtime-health.js','./src/core/sw-manager.js','./src/core/mobile-experience.js','./src/core/accessibility.js','./src/core/presentation-manager.js',
  './src/data/fallback-presentation.js','./src/data/content-loader.js','./src/data/content-schema.js','./src/data/assessment-schema.js','./src/data/clinical-governance.js','./src/data/academy-schema.js','./src/data/fallback-content.js','./src/data/fallback-assessment.js','./src/data/fallback-governance.js','./src/data/fallback-academy.js','./src/data/fallback-physiology.js','./src/data/fallback-therapeutics.js','./src/data/fallback-emergency.js','./src/data/fallback-outpatient.js','./src/data/fallback-branching.js','./src/data/fallback-career.js','./src/simulation/branching-engine.js','./src/simulation/physiology-engine.js','./src/simulation/therapeutics-engine.js','./src/simulation/emergency-engine.js','./src/simulation/outpatient-engine.js','./src/simulation/career-engine.js',
  './src/data/beta-program.js','./src/i18n/index.js','./src/i18n/catalogs.js','./src/i18n/academy-ui.js','./src/compat/legacy-guards.js',
  './assets/icons/pwa/icon-192.png','./assets/icons/pwa/icon-512.png',
  './assets/icons/pwa/icon-maskable-192.png','./assets/icons/pwa/icon-maskable-512.png','./assets/icons/pwa/apple-touch-icon.png'
];
const DATA_ASSETS=[
  './data/content-index.json','./data/core-cases.json','./data/gameplay.json','./data/queue.json',
  './data/specialties.json','./data/missions.json','./data/clinical-responses.json','./data/governance.json','./data/academy.json','./data/physiology.json','./data/assessment.json','./data/therapeutics.json','./data/emergency.json','./data/outpatient.json','./data/branching.json','./data/career.json','./data/presentation.json','./data/beta-program.json'
];
const OPTIONAL_ASSETS=[
  './assets/backgrounds/background_01.png','./assets/backgrounds/background_04.png','./assets/backgrounds/background_05.png',
  './assets/backgrounds/background_08.png','./assets/backgrounds/background_09.png','./assets/backgrounds/background_10.png',
  './assets/avatars/avatar_01.png','./assets/avatars/avatar_02.png','./assets/avatars/avatar_03.png','./assets/avatars/avatar_04.png','./assets/avatars/avatar_05.png',
  './assets/ui/ui_01.png','./assets/ui/ui_02.png','./assets/ui/ui_03.png','./assets/ui/ui_04.png','./assets/ui/ui_05.png','./assets/audio/sfx/ui-tap.wav','./assets/audio/sfx/ui-ok.wav','./assets/audio/sfx/ui-warn.wav','./assets/audio/sfx/ui-nav.wav','./assets/audio/sfx/ui-level.wav','./assets/audio/sfx/clinical-confirm.wav','./assets/audio/ambient/hospital-lobby.wav','./assets/audio/ambient/clinical-room.wav','./assets/audio/ambient/emergency-bay.wav'
];

async function installVerifiedCache(){
  const cache=await caches.open(CACHE_NAME);
  await cache.addAll(CRITICAL_ASSETS);
  const checks=await Promise.all(CRITICAL_ASSETS.map(async asset=>({asset,ok:!!(await cache.match(asset,{ignoreSearch:true}))})));
  const missing=checks.filter(item=>!item.ok);
  if(missing.length)throw new Error(`Cache crítico incompleto: ${missing.map(x=>x.asset).join(', ')}`);
  await Promise.allSettled([...DATA_ASSETS,...OPTIONAL_ASSETS].map(asset=>cache.add(asset)));
}

self.addEventListener('install',event=>event.waitUntil(installVerifiedCache()));

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    if(self.registration.navigationPreload)await self.registration.navigationPreload.enable().catch(()=>{});
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

async function fetchWithTimeout(request,timeoutMs=6000){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{return await fetch(request,{signal:controller.signal});}finally{clearTimeout(timer);}
}

async function navigationNetworkFirst(event){
  const cache=await caches.open(CACHE_NAME);
  try{
    const preload=await event.preloadResponse;
    const response=preload||await fetchWithTimeout(event.request,6000);
    if(response?.ok)cache.put(OFFLINE_FALLBACK,response.clone()).catch(()=>{});
    return response;
  }catch{
    return (await matchAcrossCaches(OFFLINE_FALLBACK))||Response.error();
  }
}

async function networkFirst(request){
  const cache=await caches.open(CACHE_NAME);
  try{
    const response=await fetchWithTimeout(request,6000);
    if(response?.ok)cache.put(request,response.clone()).catch(()=>{});
    return response;
  }catch(error){
    const cached=await matchAcrossCaches(request);
    if(cached)return cached;
    throw error;
  }
}

async function staleWhileRevalidate(request){
  const cached=await matchAcrossCaches(request);
  const update=fetchWithTimeout(request,8000).then(async response=>{
    if(response?.ok)(await caches.open(CACHE_NAME)).put(request,response.clone()).catch(()=>{});
    return response;
  }).catch(()=>null);
  return cached||await update||Response.error();
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  if(url.origin!==self.location.origin)return;
  if(event.request.mode==='navigate'){event.respondWith(navigationNetworkFirst(event));return;}
  const path=url.pathname;
  const isVersionedCode=/\.(?:js|css|json|webmanifest)$/.test(path);
  event.respondWith(isVersionedCode?networkFirst(event.request):staleWhileRevalidate(event.request));
});

self.addEventListener('message',event=>{
  const type=event.data?.type;
  if(type==='SKIP_WAITING')self.skipWaiting();
  if(type==='GET_VERSION')event.source?.postMessage({type:'SW_VERSION',version:VERSION,cache:CACHE_NAME});
  if(type==='HEALTH_CHECK')event.source?.postMessage({type:'SW_HEALTH',version:VERSION,cache:CACHE_NAME,ok:true,criticalAssets:CRITICAL_ASSETS.length});
  if(type==='CLEAR_CURRENT_CACHE')event.waitUntil(caches.delete(CACHE_NAME));
});
