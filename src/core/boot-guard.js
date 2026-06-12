(function(){
  const START=Date.now();
  const TIMEOUT=12000;
  const ATTEMPT_KEY='medsim-boot-attempts-v015';
  let timer=null;
  let healthy=false;
  let stage='script-start';
  const app=()=>document.getElementById('app');
  const attempts=(()=>{try{return Number(sessionStorage.getItem(ATTEMPT_KEY)||0)+1;}catch{return 1;}})();
  try{sessionStorage.setItem(ATTEMPT_KEY,String(attempts));}catch{}
  function safeText(value){return String(value||'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
  function recovery(reason){
    if(healthy)return;
    const target=app();
    const message=safeText(reason||`Inicialização não concluída na etapa ${stage}.`);
    const html=`<main style="min-height:100vh;background:radial-gradient(circle at top,#12324d,#020814 65%);color:#eff8ff;font-family:Arial,sans-serif;padding:24px;display:grid;place-items:center"><section style="width:min(560px,100%);background:rgba(4,19,33,.94);border:1px solid #3f7898;border-radius:20px;padding:22px;box-shadow:0 20px 80px #0008"><p style="color:#8dd9ff;font-weight:800;letter-spacing:.08em">ANTI-QUEBRA v0.15.0</p><h1>Inicialização protegida</h1><p>O jogo detectou que a abertura não terminou corretamente. Seu save não foi apagado.</p><p style="padding:12px;background:#071522;border-radius:12px"><small>${message}</small></p><div style="display:grid;gap:10px"><button onclick="location.reload()" style="padding:13px;border:0;border-radius:12px;font-weight:800">Tentar novamente</button><button onclick="location.href=location.pathname+'?safe=1'" style="padding:13px;border:1px solid #5aa6ca;border-radius:12px;background:#0a2235;color:white;font-weight:800">Abrir em modo seguro</button><button onclick="window.VALE_BOOT_GUARD.clearCaches()" style="padding:13px;border:1px solid #744;background:#281217;color:white;border-radius:12px;font-weight:800">Limpar somente cache e recarregar</button></div><p><small>Etapa: ${safeText(stage)} • tentativa ${attempts} • ${Date.now()-START} ms</small></p></section></main>`;
    if(target)target.innerHTML=html;else document.body.innerHTML=html;
  }
  window.VALE_BOOT_GUARD={
    checkpoint(next){stage=String(next||stage);},
    healthy(){healthy=true;stage='healthy';clearTimeout(timer);try{sessionStorage.setItem(ATTEMPT_KEY,'0');sessionStorage.setItem('medsim-last-healthy-v015',new Date().toISOString());}catch{}},
    fail(error){stage='failed';recovery(error&&error.message?error.message:String(error||'Falha de inicialização.'));},
    status(){return {healthy,stage,attempts,elapsedMs:Date.now()-START};},
    async clearCaches(){
      try{if('serviceWorker'in navigator){const regs=await navigator.serviceWorker.getRegistrations();await Promise.all(regs.map(r=>r.unregister()));}if('caches'in window){const keys=await caches.keys();await Promise.all(keys.map(k=>caches.delete(k)));}}catch{}
      location.reload();
    }
  };
  timer=setTimeout(()=>recovery(attempts>=3?'Foram detectadas aberturas consecutivas sem conclusão. O modo seguro é recomendado.':`Tempo limite excedido na etapa ${stage}.`),TIMEOUT);
  window.addEventListener('error',event=>{if(!healthy)window.VALE_BOOT_GUARD.fail(event.error||event.message);});
  window.addEventListener('unhandledrejection',event=>{if(!healthy)window.VALE_BOOT_GUARD.fail(event.reason);});
})();
