from pathlib import Path
import json, subprocess, re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
CSS=(ROOT/'src/styles.css').read_text(encoding='utf-8')
cat=(ROOT/'src/i18n/catalogs.js').read_text(encoding='utf-8').replace('export const CATALOGS','const CATALOGS')
idx=(ROOT/'src/i18n/index.js').read_text(encoding='utf-8')
idx=re.sub(r"^import .*?;\n",'',idx,count=1)
idx=idx.replace('export ','')
I18N=cat+'\n'+idx
exported=subprocess.run(['node','tools/export-audit-screens.mjs'],cwd=ROOT,capture_output=True,text=True,check=True)
SCREENS=json.loads(exported.stdout)['screens']
outdir=ROOT/'docs/screenshots-v0.24.0';outdir.mkdir(exist_ok=True)
profiles=[
 ('pt-BR','setup','NOVO GAME',360,800),('en','setup','NEW GAME',360,800),('es','setup','NUEVA PARTIDA',360,800),
 ('pt-BR','shift','PLANTÃO - MODO SIMULADOR',360,800),('en','shift','SHIFT — SIMULATOR MODE',360,800),('es','shift','GUARDIA — MODO SIMULADOR',360,800),
 ('en','settings','SETTINGS',360,800),('es','settings','CONFIGURACIÓN',360,800),
 ('en','shift','SHIFT — SIMULATOR MODE',1366,768),('es','shift','GUARDIA — MODO SIMULADOR',1366,768)
]
results=[]
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'])
  for locale,screen,marker,width,height in profiles:
    page=browser.new_page(viewport={'width':width,'height':height})
    errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
    html=f'''<!doctype html><html lang="pt-BR"><head><meta name="viewport" content="width=device-width,initial-scale=1"></head><body><div id="a11y-live" class="sr-only" aria-live="polite"></div><div id="a11y-alert" class="sr-only" aria-live="assertive"></div>{SCREENS[screen]}</body></html>'''
    page.set_content(html,wait_until='domcontentloaded')
    page.add_style_tag(content=CSS)
    page.add_script_tag(content=I18N)
    page.evaluate('''(locale)=>{
      const names={'pt-BR':'Português (Brasil)',en:'English',es:'Español'};
      document.querySelectorAll('.top-locale,#locale-select').forEach(element=>{element.value=locale});
      const paragraph=document.querySelector('.general-settings p');
      if(paragraph?.firstChild?.nodeType===Node.TEXT_NODE)paragraph.firstChild.nodeValue='Idioma-base: '+names[locale];
      applyDocumentLocale(locale);
      localizeDOM(document.body,locale);
    }''',locale)
    text=page.locator('body').inner_text()
    metrics=page.evaluate('''()=>({vw:innerWidth,w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight,lang:document.documentElement.lang,locale:document.documentElement.dataset.locale,controls:[...document.querySelectorAll('button,select,input')].filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0}).length,minControl:[...document.querySelectorAll('button,select,input')].filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0}).reduce((m,x)=>Math.min(m,x.getBoundingClientRect().height),999)})''')
    name=f'{locale}-{screen}-{width}x{height}.png'
    page.screenshot(path=str(outdir/name),full_page=True)
    results.append({'locale':locale,'screen':screen,'viewport':[width,height],'marker':marker,'markerFound':marker in text,'overflowX':metrics['w']>metrics['vw']+1,'metrics':metrics,'sample':text[:420],'pageErrors':errors,'screenshot':f'docs/screenshots-v0.24.0/{name}'})
    page.close()
  browser.close()
fail=[]
for r in results:
  if not r['markerFound']:fail.append(f"{r['locale']}:{r['screen']}: marker")
  if r['overflowX']:fail.append(f"{r['locale']}:{r['screen']}: overflow")
  if r['metrics']['minControl']<47.5:fail.append(f"{r['locale']}:{r['screen']}: control {r['metrics']['minControl']}")
  if r['pageErrors']:fail.append(f"{r['locale']}:{r['screen']}: errors")
out={'ok':not fail,'method':'Generated production DOM + production CSS + live i18n catalogs in isolated Chromium','failures':fail,'profiles':results}
(ROOT/'docs/audit-i18n-layout-v0.24.0.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(out,ensure_ascii=False,indent=2))
if fail:raise SystemExit(1)
