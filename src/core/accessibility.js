export const ACCESSIBILITY_DEFAULTS=Object.freeze({
  contrast:'standard',
  textSize:'medium',
  reduceMotion:false,
  focusMode:true,
  descriptions:true
});

const TEXT_SIZES=new Set(['small','medium','large','extra-large']);
const CONTRASTS=new Set(['standard','high']);

export function normalizeAccessibility(value={}){
  return {
    contrast:CONTRASTS.has(value.contrast)?value.contrast:ACCESSIBILITY_DEFAULTS.contrast,
    textSize:TEXT_SIZES.has(value.textSize)?value.textSize:ACCESSIBILITY_DEFAULTS.textSize,
    reduceMotion:Boolean(value.reduceMotion),
    focusMode:value.focusMode!==false,
    descriptions:value.descriptions!==false
  };
}

export function prefersReducedMotion(preferences={}){
  return Boolean(preferences.reduceMotion)||Boolean(globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
}

export function applyAccessibilityPreferences(preferences={}){
  const prefs=normalizeAccessibility(preferences);
  const root=document.documentElement;
  root.dataset.contrast=prefs.contrast;
  root.dataset.textSize=prefs.textSize;
  root.dataset.motion=prefs.reduceMotion?'reduced':'full';
  root.dataset.focus=prefs.focusMode?'enhanced':'standard';
  root.dataset.descriptions=prefs.descriptions?'on':'off';
  return prefs;
}

export function announce(message,{priority='polite'}={}){
  const region=document.querySelector(priority==='assertive'?'#a11y-alert':'#a11y-live');
  if(!region)return;
  region.textContent='';
  requestAnimationFrame(()=>{region.textContent=String(message||'');});
}

function labelIconButtons(root){
  root.querySelectorAll('button').forEach(button=>{
    const text=(button.textContent||'').replace(/\s+/g,' ').trim();
    if(!button.getAttribute('aria-label')&&!text){button.setAttribute('aria-label',button.title||'Ação');}
  });
}

function markInteractiveState(root){
  root.querySelectorAll('.listbtn').forEach(button=>button.setAttribute('aria-pressed',String(button.classList.contains('selected'))));
  root.querySelectorAll('.avatar-choice').forEach(button=>button.setAttribute('aria-pressed',String(button.classList.contains('active'))));
  root.querySelectorAll('.nav.active').forEach(button=>button.setAttribute('aria-current','page'));
  root.querySelectorAll('.shift-tab,.record-tabs button,.workflow-step').forEach(button=>{
    const selected=button.classList.contains('active')||button.classList.contains('done');
    if(button.closest('.shift-mobile-tabs,.record-tabs'))button.setAttribute('aria-selected',String(button.classList.contains('active')));
    if(button.closest('.workflow-steps'))button.setAttribute('aria-current',selected?'step':'false');
  });
}

function enhanceImages(root){
  root.querySelectorAll('img:not([alt])').forEach(image=>{
    if(image.classList.contains('patient-art'))image.alt='Representação visual do paciente em atendimento';
    else if(image.closest('.profile'))image.alt='Avatar do profissional';
    else if(image.closest('.avatar-choice'))image.alt='Opção de avatar';
    else image.alt='';
  });
}

function enhanceProgress(root){
  root.querySelectorAll('.xp i,.workflow-meter i,.metric-bars i u').forEach(bar=>{
    const raw=bar.style.width||'0%';
    const value=Math.max(0,Math.min(100,Number.parseFloat(raw)||0));
    const host=bar.parentElement;
    if(host){host.setAttribute('role','progressbar');host.setAttribute('aria-valuemin','0');host.setAttribute('aria-valuemax','100');host.setAttribute('aria-valuenow',String(Math.round(value)));}
  });
}

function enhanceDialogs(root){
  const dialog=root.querySelector('.modal-back > section,.modal-back > .result-modal');
  root.querySelectorAll('.modal-back > section,.modal-back > .result-modal').forEach(item=>{
    item.setAttribute('role','dialog');item.setAttribute('aria-modal','true');item.setAttribute('tabindex','-1');
    const heading=item.querySelector('h1,h2,h3');
    if(heading){if(!heading.id)heading.id='dialog-title-'+Math.random().toString(36).slice(2,8);item.setAttribute('aria-labelledby',heading.id);}
  });
  if(dialog&&!dialog.contains(document.activeElement))requestAnimationFrame(()=>dialog.focus({preventScroll:true}));
}

export function enhanceAccessibility(root=document){
  if(!root||typeof root.querySelectorAll!=='function')return;
  labelIconButtons(root);
  markInteractiveState(root);
  enhanceImages(root);
  enhanceProgress(root);
  enhanceDialogs(root);
  root.querySelectorAll('.shift-mobile-tabs,.record-tabs').forEach(nav=>nav.setAttribute('role','tablist'));
  root.querySelectorAll('.shift-mobile-tabs button,.record-tabs button').forEach(button=>button.setAttribute('role','tab'));
}

export function focusMain({preventScroll=true}={}){
  const main=document.querySelector('#main-content');
  if(main)requestAnimationFrame(()=>main.focus({preventScroll}));
}

export function installKeyboardNavigation({onEscape,onShortcut}={}){
  document.addEventListener('keydown',event=>{
    const target=event.target;
    if(event.key==='Tab'){
      const dialog=document.querySelector('[role="dialog"][aria-modal="true"]');
      if(dialog){
        const focusable=[...dialog.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(item=>{const style=getComputedStyle(item),rect=item.getBoundingClientRect();return style.display!=='none'&&style.visibility!=='hidden'&&rect.width>0&&rect.height>0;});
        if(focusable.length){const first=focusable[0],last=focusable[focusable.length-1];if(event.shiftKey&&(target===first||target===dialog)){event.preventDefault();last.focus();return;}if(!event.shiftKey&&target===last){event.preventDefault();first.focus();return;}}
      }
    }
    if(event.key==='Escape'&&typeof onEscape==='function'){onEscape(event);return;}
    const tab=target?.closest?.('[role="tab"]');
    if(tab&&['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key)){
      const group=[...tab.parentElement.querySelectorAll('[role="tab"]:not([disabled])')];
      if(group.length){event.preventDefault();let index=group.indexOf(tab);if(event.key==='Home')index=0;else if(event.key==='End')index=group.length-1;else index=(index+(event.key==='ArrowLeft'||event.key==='ArrowUp'?-1:1)+group.length)%group.length;group[index].focus();group[index].click();}
      return;
    }
    if(event.altKey&&!event.ctrlKey&&!event.metaKey&&typeof onShortcut==='function'&&/^[1-5]$/.test(event.key)){
      if(target?.matches?.('input,textarea,select,[contenteditable="true"]'))return;
      event.preventDefault();onShortcut(Number(event.key));
    }
  });
}
