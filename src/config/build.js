export const BUILD = Object.freeze({
  version: '0.12.0',
  stamp: '20260611_190122_BRT',
  label: 'v0.12.0 | build 2026-06-11 19:01:22 BRT',
  phase: 'Anti-quebra 2.0 e Observabilidade',
  saveSchema: 3,
  contentSchema: 1
});

export const ASSET_ROOT = 'assets/';
export const bg = n => `${ASSET_ROOT}backgrounds/background_${String(n).padStart(2,'0')}.png`;
export const av = n => `${ASSET_ROOT}avatars/avatar_${String(n).padStart(2,'0')}.png`;
export const ui = n => `${ASSET_ROOT}ui/ui_${String(n).padStart(2,'0')}.png`;
