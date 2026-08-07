export const BUILD = Object.freeze({
  version: '2.0.0',
  stamp: '20260807_094701_BRT',
  label: 'Versão 2.0.0',
  phase: 'Production',
  saveSchema: 18,
  contentSchema: 12,
  presentationSchema: 1,
  betaSchema: 1
});

export const ASSET_ROOT = 'assets/';
const runtimeBase=()=>typeof document!=='undefined'&&document.baseURI?document.baseURI:typeof location!=='undefined'&&location.href?location.href:import.meta.url;
export const bg = n => new URL(`${ASSET_ROOT}backgrounds/background_${String(n).padStart(2,'0')}.png`,runtimeBase()).href;
export const av = n => `${ASSET_ROOT}avatars/avatar_${String(n).padStart(2,'0')}.png`;
export const ui = n => `${ASSET_ROOT}ui/ui_${String(n).padStart(2,'0')}.png`;
