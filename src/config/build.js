export const BUILD = Object.freeze({
  version: '0.24.0',
  stamp: '20260613_122500_BRT',
  label: 'v0.24.0 | build 2026-06-13 12:25:00 BRT',
  phase: 'Casos Ramificados e Níveis de Dificuldade',
  saveSchema: 15,
  contentSchema: 9
});

export const ASSET_ROOT = 'assets/';
export const bg = n => `${ASSET_ROOT}backgrounds/background_${String(n).padStart(2,'0')}.png`;
export const av = n => `${ASSET_ROOT}avatars/avatar_${String(n).padStart(2,'0')}.png`;
export const ui = n => `${ASSET_ROOT}ui/ui_${String(n).padStart(2,'0')}.png`;
