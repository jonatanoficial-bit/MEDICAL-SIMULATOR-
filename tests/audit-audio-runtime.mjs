import {normalizeAudioPreferences,normalizePresentationPreferences,resolveTrackForScreen} from '../src/core/presentation-manager.js';import {FALLBACK_PRESENTATION} from '../src/data/fallback-presentation.js';
const a=normalizeAudioPreferences({master:2,ambientVolume:-1,sfx:false});if(a.master!==1||a.ambientVolume!==0||a.sfx!==false)throw new Error('normalização de áudio');
const p=normalizePresentationPreferences({quality:'invalid'});if(p.quality!=='auto')throw new Error('qualidade fallback');
if(resolveTrackForScreen(FALLBACK_PRESENTATION,'emergency')!=='emergency'||resolveTrackForScreen(FALLBACK_PRESENTATION,'recovery')!==null)throw new Error('roteamento de ambiente');
console.log(JSON.stringify({ok:true,audio:a,quality:p.quality}));
