from pathlib import Path
import json, subprocess
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
CSS=(ROOT/'src/styles.css').read_text(encoding='utf-8')
MODULE=(ROOT/'src/core/accessibility.js').read_text(encoding='utf-8').replace('export ','')
exported=subprocess.run(['node','tools/export-audit-screens.mjs'],cwd=ROOT,capture_output=True,text=True,check=True)
SCREENS=json.loads(exported.stdout)['screens']

profiles=[
    ('settings-mobile-standard','settings',360,800,{'contrast':'standard','textSize':'medium','reduceMotion':False,'focusMode':True,'descriptions':True}),
    ('settings-mobile-high-extra','settings',360,800,{'contrast':'high','textSize':'extra-large','reduceMotion':True,'focusMode':True,'descriptions':True}),
    ('shift-mobile-extra','shift',360,800,{'contrast':'standard','textSize':'extra-large','reduceMotion':True,'focusMode':True,'descriptions':True}),
    ('shift-tablet-large','shift',768,1024,{'contrast':'standard','textSize':'large','reduceMotion':False,'focusMode':True,'descriptions':True}),
    ('shift-desktop-standard','shift',1366,768,{'contrast':'standard','textSize':'medium','reduceMotion':False,'focusMode':True,'descriptions':True}),
    ('dialog-results-mobile','shift-results',360,800,{'contrast':'high','textSize':'large','reduceMotion':True,'focusMode':True,'descriptions':True}),
    ('dialog-review-desktop','shift-review',1366,768,{'contrast':'standard','textSize':'medium','reduceMotion':False,'focusMode':True,'descriptions':True})
]

results=[]
with sync_playwright() as p:
    browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'])
    for name,screen,width,height,prefs in profiles:
        page=browser.new_page(viewport={'width':width,'height':height})
        errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
        html=f'''<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="a11y-live" class="sr-only" aria-live="polite"></div><div id="a11y-alert" class="sr-only" aria-live="assertive"></div>{SCREENS[screen]}</body></html>'''
        page.set_content(html,wait_until='domcontentloaded')
        page.add_style_tag(content=CSS)
        page.add_script_tag(content=MODULE)
        page.evaluate('''()=>{for(const name of ['setShiftTab','setRecordTab','toggleResultsCenter','cancelFinishReview','confirmFinishCase','closePopup','go','toggleDrawer','requestGameFullscreen','installGame','setAccessibility','setGameSound','announceAccessibilityPreview','resetAccessibility'])window[name]=()=>{};window.__escapeCount=0;}''')
        page.evaluate('(prefs)=>applyAccessibilityPreferences(prefs)',prefs)
        page.evaluate("installKeyboardNavigation({onEscape:()=>window.__escapeCount++,onShortcut:()=>{}});enhanceAccessibility(document)")
        tab_count=page.locator('[role="tab"]').count()
        dialog_count=page.locator('[role="dialog"][aria-modal="true"]').count()
        focused_after_arrow=None
        focus_trap=None
        if dialog_count:
            prepared=page.evaluate("""() => {
              const dialog=document.querySelector('[role=\"dialog\"][aria-modal=\"true\"]');
              if(!dialog)return false;
              const focusables=[...dialog.querySelectorAll('button:not([disabled]),[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex=\"-1\"])')].filter(el=>{
                const r=el.getBoundingClientRect(),s=getComputedStyle(el);
                return r.width>0&&r.height>0&&s.visibility!=='hidden'&&s.display!=='none';
              });
              if(focusables.length<2)return false;
              focusables[0].dataset.auditFocus='first';
              focusables[focusables.length-1].dataset.auditFocus='last';
              focusables[focusables.length-1].focus();
              return true;
            }""")
            if prepared:
                page.keyboard.press('Tab')
                focus_trap=page.evaluate("document.activeElement?.dataset.auditFocus==='first'")
        elif tab_count>=2:
            first=page.locator('[role="tab"]').first;first.focus();page.keyboard.press('ArrowRight');focused_after_arrow=page.evaluate('document.activeElement?.textContent.replace(/\\s+/g," " ).trim()')
        else:
            target=page.locator('button:not([disabled]),select,input').first
            if target.count():target.focus()
        page.keyboard.press('Escape')
        metrics=page.evaluate('''()=>{
          const controls=[...document.querySelectorAll('button,input,select,textarea')].filter(x=>{const r=x.getBoundingClientRect();const s=getComputedStyle(x);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'});
          const focus=document.activeElement,cs=focus?getComputedStyle(focus):null,body=getComputedStyle(document.body),root=getComputedStyle(document.documentElement);
          const dialogs=[...document.querySelectorAll('[role="dialog"]')];
          return {
            viewport:{w:innerWidth,h:innerHeight},document:{w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight},
            overflowX:document.documentElement.scrollWidth>innerWidth+1,minControlHeight:controls.length?Math.min(...controls.map(x=>x.getBoundingClientRect().height)):null,
            rootFont:parseFloat(root.fontSize),bodyColor:body.color,bodyBackground:body.backgroundColor,focusOutline:cs?`${cs.outlineWidth} ${cs.outlineStyle} ${cs.outlineColor}`:'',
            motion:root.scrollBehavior,skipLink:!!document.querySelector('.skip-link'),liveRegions:document.querySelectorAll('[aria-live]').length,
            dialogs:dialogs.length,modalDialogs:dialogs.filter(x=>x.getAttribute('aria-modal')==='true').length,dialogHasLabel:dialogs.every(x=>x.hasAttribute('aria-labelledby')),
            activeElementRole:focus?.getAttribute?.('role')||focus?.tagName||null,escapeCount:window.__escapeCount,
            selectedControls:document.querySelectorAll('[aria-pressed="true"],[aria-selected="true"]').length
          }
        }''')
        metrics.update({'profile':name,'screen':screen,'preferences':prefs,'tabCount':tab_count,'focusedAfterArrow':focused_after_arrow,'focusTrap':focus_trap,'pageErrors':errors})
        results.append(metrics);page.close()
    browser.close()

failures=[]
for item in results:
    if item['overflowX']:failures.append(item['profile']+': horizontal overflow')
    if item['minControlHeight'] is not None and item['minControlHeight']<47.5:failures.append(item['profile']+': visible control below 48px')
    if item['liveRegions']<2:failures.append(item['profile']+': live regions missing')
    if item['preferences']['reduceMotion'] and item['motion']!='auto':failures.append(item['profile']+': reduced motion not applied')
    if item['escapeCount']!=1:failures.append(item['profile']+': escape handling')
    if not item['dialogs'] and item['tabCount']>=2 and not item['focusedAfterArrow']:failures.append(item['profile']+': tab arrow navigation')
    if item['dialogs'] and (item['dialogs']!=item['modalDialogs'] or not item['dialogHasLabel']):failures.append(item['profile']+': dialog semantics')
    if item['dialogs'] and item.get('focusTrap') is not True:failures.append(item['profile']+': modal focus trap')
    if item['pageErrors']:failures.append(item['profile']+': page errors '+','.join(item['pageErrors']))
output={'ok':not failures,'method':'Actual generated game DOM + production CSS in isolated Chromium/Playwright harness','failures':failures,'profiles':results}
(ROOT/'docs/audit-layout-v0.24.0.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(output,ensure_ascii=False,indent=2))
if failures:raise SystemExit(1)
