export const BUILD = Object.freeze({
  version: '0.18.0',
  stamp: '20260612_171520_BRT',
  label: 'v0.18.0 | build 2026-06-12 17:15:20 BRT',
  phase: 'Academia Clínica Introdutória trilíngue',
  saveSchema: 9,
  contentSchema: 3
});

export const ASSET_ROOT = 'assets/';
export const bg = n => `${ASSET_ROOT}backgrounds/background_${String(n).padStart(2,'0')}.png`;
export const av = n => `${ASSET_ROOT}avatars/avatar_${String(n).padStart(2,'0')}.png`;
export const ui = n => `${ASSET_ROOT}ui/ui_${String(n).padStart(2,'0')}.png`;
