export const BUILD = Object.freeze({
  version: '0.15.0',
  stamp: '20260612_161518_BRT',
  label: 'v0.15.0 | build 2026-06-12 16:15:18 BRT',
  phase: 'Design System e Acessibilidade',
  saveSchema: 6,
  contentSchema: 1
});

export const ASSET_ROOT = 'assets/';
export const bg = n => `${ASSET_ROOT}backgrounds/background_${String(n).padStart(2,'0')}.png`;
export const av = n => `${ASSET_ROOT}avatars/avatar_${String(n).padStart(2,'0')}.png`;
export const ui = n => `${ASSET_ROOT}ui/ui_${String(n).padStart(2,'0')}.png`;
