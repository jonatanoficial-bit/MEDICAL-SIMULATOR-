from pathlib import Path
import json, subprocess, re
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
CSS=(ROOT/'src/styles.css').read_text(encoding='utf-8')
cat=(ROOT/'src/i18n/catalogs.js').read_text(encoding='utf-8').replace('export const CATALOGS','const CATALOGS')
idx=(ROOT/'src/i18n/index.js').read_text(encoding='utf-8')
idx=re.sub(r"^import .*?;\n",'',idx,count=1).replace('export ','')
I18N=cat+'\n'+idx
exported=subprocess.run(['node','tools/export-audit-screens.mjs'],cwd=ROOT,capture_output=True,text=True,check=True)
SCREENS=json.loads(exported.stdout)['screens']
outdir=ROOT/'docs/screenshots-v0.24.0';outdir.mkdir(exist_ok=True)
profiles=[
 ('pt-BR','pt-BR-outpatient-catalog','CENTRO DE SEGUIMENTO',360,800),
 ('pt-BR','pt-BR-outpatient-active','CENTRO DE SEGUIMENTO',360,800),
 ('pt-BR','pt-BR-outpatient-plan','CENTRO DE SEGUIMENTO',360,800),
 ('en','en-outpatient-catalog','FOLLOW-UP CENTER',360,800),
 ('en','en-outpatient-active','FOLLOW-UP CENTER',1366,768),
 ('es','es-outpatient-plan','CENTRO DE SEGUIMIENTO',768,1024),
]
results=[]
with sync_playwright() as p:
  browser=p.chromium.launch(headless=True,executable_path='/usr/bin/chromium',args=['--no-sandbox','--disable-dev-shm-usage','--disable-gpu'])
  for locale,screen,marker,width,height in profiles:
    context=browser.new_context(viewport={'width':width,'height':height},has_touch=width<=768,is_mobile=width<=768)
    page=context.new_page(); errors=[]; page.on('pageerror',lambda error:errors.append(str(error)))
    html=f'''<!doctype html><html lang="pt-BR" class="touch-scroll-enabled"><head><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body class="touch-scroll-enabled"><div id="a11y-live" class="sr-only" aria-live="polite"></div><div id="a11y-alert" class="sr-only" aria-live="assertive"></div>{SCREENS[screen]}</body></html>'''
    page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=CSS);page.add_script_tag(content=I18N)
    page.evaluate('''(locale)=>{applyDocumentLocale(locale);localizeDOM(document.body,locale);}''',locale)
    text=page.locator('body').inner_text()
    metrics=page.evaluate('''()=>{const controls=[...document.querySelectorAll('button,select,input')].filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0});return {vw:innerWidth,w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight,lang:document.documentElement.lang,controls:controls.length,minControl:controls.reduce((m,x)=>Math.min(m,x.getBoundingClientRect().height),999),bodyTouch:getComputedStyle(document.body).touchAction,htmlOverflowY:getComputedStyle(document.documentElement).overflowY};}''')
    scroll_test=None
    if width==360 and metrics['h']>height+100:
      before=page.evaluate('scrollY');session=context.new_cdp_session(page)
      session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':180,'y':650,'radiusX':5,'radiusY':5,'force':1}]})
      page.wait_for_timeout(50)
      for y in [610,570,530,490,450,410,370,330,290,250,210,170,130,90]:
        session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':180,'y':y,'radiusX':5,'radiusY':5,'force':1}]});page.wait_for_timeout(20)
      session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(300)
      after=page.evaluate('scrollY');scroll_test={'before':before,'after':after,'moved':after>before+20}
    name=f'outpatient-{locale}-{screen.split("-")[-1]}-{width}x{height}.png';page.screenshot(path=str(outdir/name),full_page=True)
    results.append({'locale':locale,'screen':screen,'viewport':[width,height],'marker':marker,'markerFound':marker in text,'overflowX':metrics['w']>metrics['vw']+1,'metrics':metrics,'scroll':scroll_test,'pageErrors':errors,'screenshot':f'docs/screenshots-v0.24.0/{name}'})
    context.close()
  browser.close()
fail=[]
for r in results:
  if not r['markerFound']:fail.append(f"{r['locale']}:{r['screen']}: marker")
  if r['overflowX']:fail.append(f"{r['locale']}:{r['screen']}: overflow")
  if r['metrics']['minControl']<47.5:fail.append(f"{r['locale']}:{r['screen']}: control {r['metrics']['minControl']}")
  if r['scroll'] and not r['scroll']['moved']:fail.append(f"{r['locale']}:{r['screen']}: touch scroll")
  if r['pageErrors']:fail.append(f"{r['locale']}:{r['screen']}: errors")
out={'ok':not fail,'method':'Generated production outpatient DOM + production CSS + live i18n in isolated Chromium; CDP touch swipe on mobile profiles','failures':fail,'profiles':results}
(ROOT/'docs/audit-outpatient-layout-v0.24.0.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(out,ensure_ascii=False,indent=2))
if fail:raise SystemExit(1)
