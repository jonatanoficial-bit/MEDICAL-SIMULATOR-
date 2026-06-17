import {FALLBACK_PRESENTATION} from '../data/fallback-presentation.js';

const clamp=(value,min=0,max=1)=>Math.min(max,Math.max(min,Number(value)||0));
export function normalizeAudioPreferences(value={}){
  const d=FALLBACK_PRESENTATION.audio.defaults;
  return {enabled:value.enabled!==false,ambient:value.ambient!==false,sfx:value.sfx!==false,master:clamp(value.master??d.master),ambientVolume:clamp(value.ambientVolume??d.ambientVolume),sfxVolume:clamp(value.sfxVolume??d.sfxVolume)};
}
export function normalizePresentationPreferences(value={}){
  return {quality:['auto','high','balanced','battery'].includes(value.quality)?value.quality:'auto',reduceVisualEffects:Boolean(value.reduceVisualEffects)};
}
export function resolveTrackForScreen(config,screen){return config?.audio?.screenTracks?.[screen]??null;}
export async function loadPresentationConfig({version='dev',safeMode=false}={}){
  if(safeMode)return {config:FALLBACK_PRESENTATION,status:{mode:'safe-fallback',warnings:['Modo seguro: apresentação externa ignorada.']}};
  try{
    const response=await fetch(`data/presentation.json?v=${encodeURIComponent(version)}`,{cache:'no-store'});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const config=await response.json();
    if(config?.schemaVersion!==1||!config?.audio?.sfx||!config?.visual?.screenThemes)throw new Error('Schema de apresentação inválido.');
    return {config,status:{mode:'external',warnings:[]}};
  }catch(error){return {config:FALLBACK_PRESENTATION,status:{mode:'fallback',warnings:[String(error.message||error)]}};}
}
export function createPresentationManager({getState=()=>({}),diagnostics=null}={}){
  let config=FALLBACK_PRESENTATION,unlocked=false,currentKey=null,currentAudio=null;
  const audioCache=new Map();
  const state=()=>getState()||{};
  const prefs=()=>normalizeAudioPreferences(state().audio||{enabled:state().sound!==false});
  const makeAudio=path=>{if(!globalThis.Audio)return null;if(audioCache.has(path))return audioCache.get(path);const audio=new Audio(path);audio.preload='none';audioCache.set(path,audio);return audio;};
  function setConfig(next){if(next?.audio&&next?.visual)config=next;return config;}
  async function unlock(){unlocked=true;try{await currentAudio?.play?.();currentAudio?.pause?.();}catch{}return true;}
  function applyTheme(screen){const theme=config.visual?.screenThemes?.[screen]||'system';if(globalThis.document?.documentElement?.dataset){document.documentElement.dataset.scene=theme;document.documentElement.dataset.visualQuality=state().presentation?.quality||'auto';document.documentElement.dataset.visualEffects=state().presentation?.reduceVisualEffects?'reduced':'full';}return theme;}
  function stopAmbient(){if(currentAudio){currentAudio.pause();currentAudio.currentTime=0;}currentAudio=null;currentKey=null;}
  async function syncScreen(screen){applyTheme(screen);const p=prefs(),key=resolveTrackForScreen(config,screen);if(!p.enabled||!p.ambient||!key||!unlocked){if(!p.enabled||!p.ambient||!key)stopAmbient();return {playing:false,key};}if(key===currentKey&&currentAudio){currentAudio.volume=clamp(p.master*p.ambientVolume);return {playing:!currentAudio.paused,key};}stopAmbient();const path=config.audio?.ambience?.[key];if(!path)return {playing:false,key,error:'track-missing'};const audio=makeAudio(path);if(!audio)return {playing:false,key,error:'audio-api-missing'};audio.loop=true;audio.volume=clamp(p.master*p.ambientVolume);currentAudio=audio;currentKey=key;try{await audio.play();return {playing:true,key};}catch(error){diagnostics?.info?.('audio','Áudio aguardando interação do usuário.',{key,error:String(error)});return {playing:false,key,blocked:true};}}
  function playSfx(type='tap'){const p=prefs();if(!p.enabled||!p.sfx||!unlocked)return false;const path=config.audio?.sfx?.[type]||config.audio?.sfx?.tap;const source=makeAudio(path);if(!source)return false;try{const audio=source.cloneNode?.()||source;audio.volume=clamp(p.master*p.sfxVolume);audio.play?.().catch(()=>{});return true;}catch{return false;}}
  function status(){return {unlocked,currentKey,playing:Boolean(currentAudio&&!currentAudio.paused),configVersion:config.contentVersion,assets:(config.visual?.assetSlots||[]).length};}
  return {setConfig,unlock,applyTheme,syncScreen,playSfx,stopAmbient,status,getConfig:()=>config};
}
