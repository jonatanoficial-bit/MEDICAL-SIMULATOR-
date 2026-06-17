from pathlib import Path
import json,re
ROOT=Path(__file__).resolve().parents[1]
css=(ROOT/'src/styles.css').read_text(encoding='utf-8')
app=(ROOT/'src/app.js').read_text(encoding='utf-8')
data=json.loads((ROOT/'data/presentation.json').read_text(encoding='utf-8'))
checks={'premiumCss':'presentation-settings' in css,'mobileRange':'audio-sliders' in css,'settingsCard':'presentationSettingsCard' in app,'touchPreserved':'pan-y pinch-zoom' in css,'slots':len(data['visual']['assetSlots'])}
(ROOT/'docs/audit-presentation-layout-v0.27.0.json').write_text(json.dumps({'ok':all(v for k,v in checks.items() if k!='slots') and checks['slots']>=6,'checks':checks},ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps(checks,ensure_ascii=False))
