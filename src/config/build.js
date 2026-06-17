export const BUILD = Object.freeze({
  version: '0.27.0',
  stamp: '20260617_104342_BRT',
  label: 'v0.27.0 | build 2026-06-17 10:43:42 BRT',
  phase: 'Beta Fechado, Auditoria Final e Preparação para RC',
  saveSchema: 18,
  contentSchema: 12,
  presentationSchema: 1,
  betaSchema: 1
});

export const ASSET_ROOT = 'assets/';
export const bg = n => `${ASSET_ROOT}backgrounds/background_${String(n).padStart(2,'0')}.png`;
export const av = n => `${ASSET_ROOT}avatars/avatar_${String(n).padStart(2,'0')}.png`;
export const ui = n => `${ASSET_ROOT}ui/ui_${String(n).padStart(2,'0')}.png`;
