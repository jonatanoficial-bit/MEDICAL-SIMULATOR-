// Camada de compatibilidade isolada do núcleo modular.
/* v0.8.8 stability polish safe patch */
(function(){
  window.VALE_BUILD_LABEL = 'v0.24.0 | build 2026-06-13 11:57:41 BRT';
  window.addEventListener('error', function(ev){
    try{ console.warn('[ValeSafeGuard]', ev.message); document.body.classList.add('safe-runtime'); }catch(e){}
  });
  window.addEventListener('unhandledrejection', function(ev){
    try{ console.warn('[ValeSafeGuard Promise]', ev.reason); document.body.classList.add('safe-runtime'); }catch(e){}
  });
  document.addEventListener('click', function(ev){
    const btn = ev.target.closest('button, .listbtn, [data-action]');
    if(!btn) return;
    btn.classList.add('tap-confirm');
    setTimeout(function(){btn.classList.remove('tap-confirm')}, 260);
    const board = document.querySelector('.clinical-board,.response,.clinical-response,#clinicalBoard,#responsePanel');
    if(board && window.innerWidth < 780){
      setTimeout(function(){ board.scrollIntoView({behavior:'smooth', block:'nearest'}); }, 80);
    }
  }, true);
  function ensureBuildBadge(){
    if(document.querySelector('.build')) return;
    const b=document.createElement('div');
    b.className='build';
    b.textContent='v0.24.0 | build 2026-06-13 11:57:41 BRT';
    document.body.appendChild(b);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensureBuildBadge);
  else ensureBuildBadge();
})();


/* v0.8.9 release readiness safe patch */
(function(){
  window.VALE_BUILD_LABEL = 'v0.24.0 | build 2026-06-13 11:57:41 BRT';
  function preloadBackgrounds(){
    try {
      var paths = [
        'assets/backgrounds/background_01.png',
        'assets/backgrounds/background_02.png',
        'assets/backgrounds/background_03.png',
        'assets/backgrounds/background_08.png'
      ];
      paths.forEach(function(src){
        var img = new Image();
        img.decoding = 'async';
        img.loading = 'eager';
        img.src = src;
      });
    } catch(e) {}
  }
  function addReleaseBadge(){
    if(document.querySelector('.release-ready-badge')) return;
    var badge = document.createElement('div');
    badge.className = 'release-ready-badge';
    badge.textContent = 'Release readiness ativo';
    document.body.appendChild(badge);
    setTimeout(function(){ if(badge && badge.parentNode) badge.parentNode.removeChild(badge); }, 2200);
  }
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ preloadBackgrounds(); addReleaseBadge(); });
  } else {
    preloadBackgrounds(); addReleaseBadge();
  }
})();


/* v0.9.0 release candidate safe patch */
(function(){
  window.VALE_BUILD_LABEL = 'v0.24.0 | build 2026-06-13 11:57:41 BRT';
  window.ValeReleaseCandidate = {
    version: '0.9.0',
    build: 'v0.24.0 | build 2026-06-13 11:57:41 BRT',
    safeMode: true,
    exportSave: function(){
      try {
        var payload = {};
        for (var i=0;i<localStorage.length;i++) {
          var k = localStorage.key(i);
          if (k && /medical|msve|vale/i.test(k)) payload[k] = localStorage.getItem(k);
        }
        var blob = new Blob([JSON.stringify(payload, null, 2)], {type:'application/json'});
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'medical-simulator-save-backup-v0.9.0.json';
        a.click();
        setTimeout(function(){URL.revokeObjectURL(a.href)}, 800);
      } catch(e) { console.warn('[ValeSaveExport]', e); }
    }
  };
  function addRCButton(){
    if(document.querySelector('.rc-safe-tools')) return;
    var box = document.createElement('div');
    box.className = 'rc-safe-tools';
    box.innerHTML = '<button type="button" title="Exportar backup do save">Backup Save</button>';
    box.querySelector('button').addEventListener('click', function(ev){
      ev.preventDefault();
      window.ValeReleaseCandidate.exportSave();
    });
    document.body.appendChild(box);
  }
  function verifyCriticalAssets(){
    try {
      ['assets/backgrounds/background_08.png','src/styles.css'].forEach(function(src){
        var img = new Image();
        img.onerror = function(){ document.body.classList.add('asset-fallback-mode'); };
        if(src.match(/\.png$/)) img.src = src;
      });
    } catch(e) {}
  }
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ addRCButton(); verifyCriticalAssets(); });
  } else {
    addRCButton(); verifyCriticalAssets();
  }
})();


/* v0.9.1 diagnostics safe patch */
(function(){
  window.VALE_BUILD_LABEL = 'v0.24.0 | build 2026-06-13 11:57:41 BRT';
  var LOG_KEY = 'medical_simulator_diagnostics_v091';
  function readLog(){
    try { return JSON.parse(localStorage.getItem(LOG_KEY) || '[]'); } catch(e) { return []; }
  }
  function writeLog(log){ try { localStorage.setItem(LOG_KEY, JSON.stringify(log.slice(-120))); } catch(e) {} }
  function addLog(type, detail){
    try {
      var log = readLog();
      log.push({type:type, detail:String(detail||''), at:new Date().toISOString(), build:'v0.24.0 | build 2026-06-13 11:57:41 BRT', width:innerWidth, height:innerHeight});
      writeLog(log);
    } catch(e) {}
  }
  window.ValeDiagnostics = {
    log:addLog,
    export:function(){
      try {
        var payload = {build:'v0.24.0 | build 2026-06-13 11:57:41 BRT', diagnostics:readLog()};
        var blob = new Blob([JSON.stringify(payload,null,2)], {type:'application/json'});
        var a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'medical-simulator-diagnostics-v0.9.1.json';
        a.click();
        setTimeout(function(){URL.revokeObjectURL(a.href)},800);
      } catch(e) { console.warn('[ValeDiagnosticsExport]', e); }
    }
  };
  window.addEventListener('error', function(ev){ addLog('error', ev.message || 'runtime error'); });
  window.addEventListener('unhandledrejection', function(ev){ addLog('promise', ev.reason || 'unhandled promise'); });
  window.addEventListener('load', function(){ addLog('load','game loaded'); });
  document.addEventListener('click', function(ev){
    var t = ev.target && ev.target.closest ? ev.target.closest('button,.listbtn,[data-action]') : null;
    if(t) addLog('click', (t.textContent || t.getAttribute('aria-label') || 'action').trim().slice(0,80));
  }, true);
  function addPanel(){
    if(document.querySelector('.diagnostics-safe-tools')) return;
    var box = document.createElement('div');
    box.className = 'diagnostics-safe-tools';
    box.innerHTML = '<button type="button">Diagnóstico</button>';
    box.querySelector('button').addEventListener('click', function(ev){ ev.preventDefault(); window.ValeDiagnostics.export(); });
    document.body.appendChild(box);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addPanel);
  else addPanel();
})();


/* v0.9.2 prefinal ui safe patch */
(function(){
  window.VALE_BUILD_LABEL = 'v0.24.0 | build 2026-06-13 11:57:41 BRT';
  function setTechVisible(visible){
    try {
      document.body.classList.toggle('show-tech-tools', !!visible);
      sessionStorage.setItem('vale_show_tech_tools', visible ? '1' : '0');
    } catch(e) {}
  }
  function getTechVisible(){
    try { return sessionStorage.getItem('vale_show_tech_tools') === '1'; } catch(e) { return false; }
  }
  function applyTechState(){
    document.body.classList.toggle('show-tech-tools', getTechVisible());
  }
  var pressTimer = null;
  document.addEventListener('keydown', function(ev){
    if((ev.ctrlKey || ev.metaKey) && ev.shiftKey && String(ev.key).toLowerCase() === 'd'){
      setTechVisible(!document.body.classList.contains('show-tech-tools'));
    }
  });
  document.addEventListener('pointerdown', function(ev){
    var build = ev.target.closest && ev.target.closest('.build');
    if(!build) return;
    pressTimer = setTimeout(function(){ setTechVisible(!document.body.classList.contains('show-tech-tools')); }, 900);
  }, true);
  document.addEventListener('pointerup', function(){ if(pressTimer) clearTimeout(pressTimer); pressTimer=null; }, true);
  document.addEventListener('pointercancel', function(){ if(pressTimer) clearTimeout(pressTimer); pressTimer=null; }, true);
  function addHint(){
    if(document.querySelector('.prefinal-safe-note')) return;
    var note = document.createElement('div');
    note.className = 'prefinal-safe-note';
    note.textContent = 'Pré-final seguro';
    document.body.appendChild(note);
    setTimeout(function(){ if(note && note.parentNode) note.parentNode.removeChild(note); }, 1800);
  }
  if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){ applyTechState(); addHint(); });
  } else {
    applyTechState(); addHint();
  }
})();


/* v0.9.3 final test polish safe patch */
(function(){
  window.VALE_BUILD_LABEL = 'v0.24.0 | build 2026-06-13 11:57:41 BRT';
  var checklist = [
    'Lobby com fundo visível',
    'Atendimento abre sem tela branca',
    'Perguntas exibem resposta clara',
    'Exames mostram resultado claro',
    'Procedimentos registram achado',
    'Prontuário persiste no caso',
    'Mobile não exige sobe/desce excessivo',
    'Fullscreen/PWA não quebra layout'
  ];
  function toggleChecklist(){
    var old = document.querySelector('.final-test-panel');
    if(old) { old.remove(); return; }
    var done = {};
    try { done = JSON.parse(localStorage.getItem('vale_final_test_checklist_v093') || '{}'); } catch(e) {}
    var panel = document.createElement('section');
    panel.className = 'final-test-panel';
    panel.innerHTML = '<div class="final-test-head"><b>Checklist final v0.9.3</b><button type="button" data-close>×</button></div>' +
      checklist.map(function(item, i){
        var checked = done[item] ? 'checked' : '';
        return '<label><input type="checkbox" data-item="'+ item.replace(/"/g,'&quot;') +'" '+checked+'> <span>'+item+'</span></label>';
      }).join('') +
      '<small>Esse painel é só para teste. Não altera o jogo.</small>';
    panel.addEventListener('change', function(ev){
      var input = ev.target;
      if(input && input.matches('input[type="checkbox"]')) {
        done[input.getAttribute('data-item')] = input.checked;
        try { localStorage.setItem('vale_final_test_checklist_v093', JSON.stringify(done)); } catch(e) {}
      }
    });
    panel.querySelector('[data-close]').addEventListener('click', function(){ panel.remove(); });
    document.body.appendChild(panel);
  }
  document.addEventListener('keydown', function(ev){
    if((ev.ctrlKey || ev.metaKey) && ev.shiftKey && String(ev.key).toLowerCase() === 't') toggleChecklist();
  });
  document.addEventListener('click', function(ev){
    var b = ev.target.closest && ev.target.closest('.build');
    if(!b) return;
    if(ev.detail >= 2) toggleChecklist();
  }, true);
  function applySafeViewport(){
    try {
      document.documentElement.style.setProperty('--vh', (window.innerHeight * 0.01) + 'px');
    } catch(e) {}
  }
  window.addEventListener('resize', applySafeViewport);
  window.addEventListener('orientationchange', function(){ setTimeout(applySafeViewport, 250); });
  applySafeViewport();
})();


/* v0.9.4 release freeze safe patch */
(function(){
  window.VALE_BUILD_LABEL = 'v0.24.0 | build 2026-06-13 11:57:41 BRT';
  window.VALE_RELEASE_FREEZE = {
    frozen: false,
    build: 'v0.24.0 | build 2026-06-13 11:57:41 BRT',
    policy: 'No core gameplay changes after this build without explicit rollback plan.'
  };
  function addFreezeMarker(){
    if(document.querySelector('.release-freeze-marker')) return;
    var marker = document.createElement('div');
    marker.className = 'release-freeze-marker';
    marker.textContent = 'Release freeze';
    document.body.appendChild(marker);
    setTimeout(function(){ if(marker && marker.parentNode) marker.parentNode.removeChild(marker); }, 1700);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', addFreezeMarker);
  else addFreezeMarker();
})();


/* v0.9.5 gold candidate safe patch */
(function(){
  window.VALE_BUILD_LABEL = 'v0.24.0 | build 2026-06-13 11:57:41 BRT';
  window.VALE_GOLD_CANDIDATE = {
    candidate: false,
    build: 'v0.24.0 | build 2026-06-13 11:57:41 BRT',
    rule: 'Only critical fixes after this build.'
  };
  function marker(){
    if(document.querySelector('.gold-candidate-marker')) return;
    var el=document.createElement('div');
    el.className='gold-candidate-marker';
    el.textContent='Gold Candidate';
    document.body.appendChild(el);
    setTimeout(function(){ if(el && el.parentNode) el.parentNode.removeChild(el); }, 1600);
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', marker);
  else marker();
})();
