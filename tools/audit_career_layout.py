from pathlib import Path
import json, subprocess, re, os
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
CSS=(ROOT/'src/styles.css').read_text(encoding='utf-8')
cat=(ROOT/'src/i18n/catalogs.js').read_text(encoding='utf-8').replace('export const CATALOGS','const CATALOGS')
idx=(ROOT/'src/i18n/index.js').read_text(encoding='utf-8')
idx=re.sub(r"^import .*?;\n",'',idx,count=1).replace('export ','')
I18N=cat+'\n'+idx
exported=subprocess.run(['node','tools/export-audit-screens.mjs'],cwd=ROOT,capture_output=True,text=True,check=True)
SCREENS=json.loads(exported.stdout)['screens']
outdir=ROOT/'docs/screenshots-v2.0.0';outdir.mkdir(exist_ok=True)
profiles=[
 ('pt-BR','pt-BR-career-journey','Reputação do hospital',568,320),
 ('pt-BR','pt-BR-career-journey','Mentoria',640,360),
 ('en','en-career-journey','Hospital reputation',844,390),
 ('es','es-career-journey','Reputación del hospital',932,430),
 ('pt-BR','pt-BR-career-journey','Especializações',768,1024),
 ('en','en-career-journey','Specializations',1024,768),
 ('es','es-career-journey','Especializaciones',1366,768),
 ('pt-BR','pt-BR-career-journey','Histórico recente',1920,1080),
 ('pt-BR','pt-BR-career-overview','CARREIRA E RESIDÊNCIA',360,800),
 ('pt-BR','pt-BR-career-residency','Residência',360,800),
 ('pt-BR','pt-BR-career-calendar','Agenda da semana',360,800),
 ('en','en-career-hospital','CAREER AND RESIDENCY',360,800),
 ('en','en-career-overview','Promotion progress',1366,768),
 ('es','es-career-exams','CARRERA Y RESIDENCIA',360,800),
 ('es','es-career-hospital','Rotación actual',768,1024),
]
results=[]
browser_candidates=[
 os.environ.get('MEDSIM_BROWSER'),
 r'C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe',
 r'C:\Program Files\Microsoft\Edge\Application\msedge.exe',
 r'C:\Program Files\Google\Chrome\Application\chrome.exe',
 '/usr/bin/chromium',
]
browser_path=next((candidate for candidate in browser_candidates if candidate and Path(candidate).exists()),None)
with sync_playwright() as p:
  launch_options={'headless':True,'args':['--no-sandbox','--disable-dev-shm-usage','--disable-gpu']}
  if browser_path:launch_options['executable_path']=browser_path
  browser=p.chromium.launch(**launch_options)
  for locale,screen,marker,width,height in profiles:
    context=browser.new_context(viewport={'width':width,'height':height},has_touch=width<=768,is_mobile=width<=768)
    page=context.new_page();errors=[];page.on('pageerror',lambda error:errors.append(str(error)))
    html=f'''<!doctype html><html lang="{locale}" class="touch-scroll-enabled"><head><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"></head><body class="touch-scroll-enabled"><div id="a11y-live" class="sr-only"></div><div id="a11y-alert" class="sr-only"></div>{SCREENS[screen]}</body></html>'''
    page.set_content(html,wait_until='domcontentloaded');page.add_style_tag(content=CSS);page.add_script_tag(content=I18N)
    page.evaluate('''(locale)=>{applyDocumentLocale(locale);localizeDOM(document.body,locale);}''',locale)
    text=page.locator('body').inner_text()
    metrics=page.evaluate('''()=>{const controls=[...document.querySelectorAll('button,select,input')].filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0});return{vw:innerWidth,w:document.documentElement.scrollWidth,h:document.documentElement.scrollHeight,controls:controls.length,minControl:controls.reduce((m,x)=>Math.min(m,x.getBoundingClientRect().height),999),touch:getComputedStyle(document.body).touchAction};}''')
    scroll=None
    if width==360 and metrics['h']>height+100:
      before=page.evaluate('scrollY');session=context.new_cdp_session(page)
      session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':180,'y':650,'radiusX':5,'radiusY':5,'force':1}]})
      for y in [610,560,510,460,410,360,310,260,210,160,110]:
        session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':180,'y':y,'radiusX':5,'radiusY':5,'force':1}]});page.wait_for_timeout(20)
      session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(250)
      after=page.evaluate('scrollY');scroll={'before':before,'after':after,'moved':after>before+20}
    safe=screen.replace('pt-BR-','').replace('en-','').replace('es-','')
    name=f'career-{locale}-{safe}-{width}x{height}.png';page.screenshot(path=str(outdir/name),full_page=True)
    results.append({'locale':locale,'screen':screen,'viewport':[width,height],'markerFound':marker in text,'overflowX':metrics['w']>metrics['vw']+1,'metrics':metrics,'scroll':scroll,'pageErrors':errors,'screenshot':f'docs/screenshots-v2.0.0/{name}'})
    context.close()
  browser.close()
fail=[]
for r in results:
  if not r['markerFound']:fail.append(f"{r['screen']}: marker")
  if r['overflowX']:fail.append(f"{r['screen']}: overflow")
  if r['metrics']['minControl']<47.5:fail.append(f"{r['screen']}: control {r['metrics']['minControl']}")
  if r['scroll'] and not r['scroll']['moved']:fail.append(f"{r['screen']}: touch scroll")
  if r['pageErrors']:fail.append(f"{r['screen']}: errors")
out={'ok':not fail,'method':'Production career DOM + production CSS + live i18n in isolated Chromium/Edge; CDP touch swipe on mobile','browser':browser_path or 'Playwright bundled Chromium','failures':fail,'profiles':results}
(ROOT/'docs/audit-career-layout-v2.0.0.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(out,ensure_ascii=False,indent=2))
if fail:raise SystemExit(1)
