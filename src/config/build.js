export const BUILD = Object.freeze({
  version: '1.0.0',
  stamp: '20260731_161519_BRT',
  label: 'Versão 1.0.0',
  phase: 'Production',
  saveSchema: 18,
  contentSchema: 12,
  presentationSchema: 1,
  betaSchema: 1
});

export const ASSET_ROOT = 'assets/';
export const bg = n => `${ASSET_ROOT}backgrounds/background_${String(n).padStart(2,'0')}.png`;
export const av = n => `${ASSET_ROOT}avatars/avatar_${String(n).padStart(2,'0')}.png`;
export const ui = n => `${ASSET_ROOT}ui/ui_${String(n).padStart(2,'0')}.png`;
