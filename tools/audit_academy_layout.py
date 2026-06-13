from pathlib import Path
import json, subprocess
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
CSS=(ROOT/'src/styles.css').read_text(encoding='utf-8')
exported=subprocess.run(['node','tools/export-audit-screens.mjs'],cwd=ROOT,capture_output=True,text=True,check=True)
SCREENS=json.loads(exported.stdout)['screens']
outdir=ROOT/'docs/screenshots-v0.24.0';outdir.mkdir(exist_ok=True)
profiles=[]
for locale,markers in {
 'pt-BR':['Academia Clínica Introdutória','Segurança, limites e papel do simulador','Checkpoint de aprendizagem','Caso guiado: dor no peito durante esforço'],
 'en':['Introductory Clinical Academy','Safety, limits, and the role of the simulator','Learning checkpoint','Guided case: exertional chest pain'],
 'es':['Academia Clínica Introductoria','Seguridad, límites y función del simulador','Checkpoint de aprendizaje','Caso guiado: dolor torácico con esfuerzo']
}.items():
 for kind,marker in zip(['catalog','module','quiz','guided'],markers):profiles.append((locale,kind,marker,360,800))
profiles += [('pt-BR','catalog','Academia Clínica Introdutória',768,1024),('en','module','Safety, limits, and the role of the simulator',1366,768)]
results=[]
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'])
 for locale,kind,marker,width,height in profiles:
  page=browser.new_page(viewport={'width':width,'height':height})
  errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
  key=f'{locale}-academy-{kind}'
  html=f'''<!doctype html><html lang="{locale}"><head><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body><div id="a11y-live" class="sr-only" aria-live="polite"></div><div id="a11y-alert" class="sr-only" aria-live="assertive"></div>{SCREENS[key]}</body></html>'''
  page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=CSS)
  text=page.locator('body').inner_text()
  metrics=page.evaluate('''()=>{const controls=[...document.querySelectorAll('button,input,select,textarea')].filter(x=>{const r=x.getBoundingClientRect(),s=getComputedStyle(x);return r.width>0&&r.height>0&&s.display!=='none'&&s.visibility!=='hidden'});return{vw:innerWidth,w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight,minControl:controls.length?Math.min(...controls.map(x=>x.getBoundingClientRect().height)):null,modules:document.querySelectorAll('.academy-module').length,options:document.querySelectorAll('.academy-option').length,lessonTabs:document.querySelectorAll('.academy-lesson-tab').length}}''')
  name=f'academy-{locale}-{kind}-{width}x{height}.png';page.screenshot(path=str(outdir/name),full_page=True)
  results.append({'locale':locale,'view':kind,'viewport':[width,height],'marker':marker,'markerFound':marker in text,'overflowX':metrics['w']>metrics['vw']+1,'metrics':metrics,'pageErrors':errors,'screenshot':f'docs/screenshots-v0.24.0/{name}'})
  page.close()
 browser.close()
fail=[]
for r in results:
 if not r['markerFound']:fail.append(f"{r['locale']}:{r['view']}:marker")
 if r['overflowX']:fail.append(f"{r['locale']}:{r['view']}:overflow")
 if r['metrics']['minControl'] is not None and r['metrics']['minControl']<47.5:fail.append(f"{r['locale']}:{r['view']}:control {r['metrics']['minControl']}")
 if r['view']=='catalog' and r['metrics']['modules']!=9:fail.append(f"{r['locale']}:catalog:modules {r['metrics']['modules']}")
 if r['view']=='module' and r['metrics']['lessonTabs']!=4:fail.append(f"{r['locale']}:module:tabs {r['metrics']['lessonTabs']}")
 if r['view'] in ('quiz','guided') and r['metrics']['options']!=4:fail.append(f"{r['locale']}:{r['view']}:options {r['metrics']['options']}")
 if r['pageErrors']:fail.append(f"{r['locale']}:{r['view']}:errors")
out={'ok':not fail,'method':'Generated production DOM + production CSS in isolated Chromium','failures':fail,'profiles':results}
(ROOT/'docs/audit-academy-layout-v0.24.0.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(out,ensure_ascii=False,indent=2))
if fail:raise SystemExit(1)
