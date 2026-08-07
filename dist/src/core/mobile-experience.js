const DISPLAY_QUERIES = [
  ['fullscreen','(display-mode: fullscreen)'],
  ['standalone','(display-mode: standalone)'],
  ['minimal-ui','(display-mode: minimal-ui)']
];

function detectDisplayMode(){
  if(window.navigator.standalone===true)return 'standalone';
  for(const [name,query] of DISPLAY_QUERIES){
    try{if(window.matchMedia(query).matches)return name;}catch{}
  }
  return 'browser';
}

function viewportSnapshot(){
  const viewport=window.visualViewport;
  return {
    width:Math.round(viewport?.width||window.innerWidth||document.documentElement.clientWidth||0),
    height:Math.round(viewport?.height||window.innerHeight||document.documentElement.clientHeight||0),
    scale:Number(viewport?.scale||1),
    offsetTop:Math.round(viewport?.offsetTop||0),
    offsetLeft:Math.round(viewport?.offsetLeft||0)
  };
}

function shouldBlockPortrait(viewport){
  const width=Number(viewport?.width||0),height=Number(viewport?.height||0);
  if(!width||!height||height<=width)return false;
  const compactViewport=width<=1100;
  const touchDevice=Number(navigator.maxTouchPoints||0)>0;
  return compactViewport||touchDevice;
}

function applyOrientationOverlay(blocked){
  const overlay=document.querySelector('#orientation-lock');
  const app=document.querySelector('#app');
  document.documentElement.dataset.orientationBlocked=String(blocked);
  document.body?.classList?.toggle?.('orientation-blocked',blocked);
  if(overlay){
    overlay.hidden=!blocked;
    overlay.setAttribute?.('aria-hidden',String(!blocked));
  }
  if(app){
    app.inert=blocked;
    app.setAttribute?.('aria-hidden',String(blocked));
  }
}

export function createMobileExperience({diagnostics,onChange=()=>{},isOrientationRequired=()=>true}={}){
  let installEvent=null;
  let status={
    displayMode:detectDisplayMode(),
    installAvailable:false,
    installed:detectDisplayMode()!=='browser',
    fullscreen:!!document.fullscreenElement,
    online:navigator.onLine!==false,
    viewport:viewportSnapshot(),
    orientation:screen.orientation?.type||((innerWidth>innerHeight)?'landscape':'portrait'),
    orientationBlocked:false,
    lastInstallResult:null
  };

  const emit=()=>{
    const viewport=viewportSnapshot();
    const orientation=screen.orientation?.type||((viewport.width>viewport.height)?'landscape':'portrait');
    const orientationBlocked=shouldBlockPortrait(viewport)&&Boolean(isOrientationRequired());
    status={...status,displayMode:detectDisplayMode(),fullscreen:!!document.fullscreenElement,online:navigator.onLine!==false,viewport,orientation,orientationBlocked};
    document.documentElement.dataset.displayMode=status.displayMode;
    document.documentElement.dataset.online=String(status.online);
    document.documentElement.dataset.orientation=status.orientation;
    document.documentElement.style.setProperty('--app-height',`${status.viewport.height}px`);
    document.documentElement.style.setProperty('--app-width',`${status.viewport.width}px`);
    applyOrientationOverlay(status.orientationBlocked);
    onChange({...status});
  };

  const onBeforeInstall=event=>{
    event.preventDefault();
    installEvent=event;
    status.installAvailable=true;
    diagnostics?.info?.('pwa','Instalação PWA disponível.');
    emit();
  };
  const onInstalled=()=>{
    installEvent=null;
    status.installAvailable=false;
    status.installed=true;
    status.lastInstallResult='installed';
    diagnostics?.info?.('pwa','Aplicativo instalado.');
    emit();
  };
  const onFullscreenChange=()=>emit();
  const onVisibility=()=>emit();
  const onConnectivity=()=>{diagnostics?.info?.('network',navigator.onLine?'Conexão restabelecida.':'Aplicativo offline.');emit();};
  const onViewport=()=>emit();

  window.addEventListener('beforeinstallprompt',onBeforeInstall);
  window.addEventListener('appinstalled',onInstalled);
  window.addEventListener('online',onConnectivity);
  window.addEventListener('offline',onConnectivity);
  window.addEventListener('resize',onViewport,{passive:true});
  window.addEventListener('orientationchange',onViewport,{passive:true});
  document.addEventListener('fullscreenchange',onFullscreenChange);
  document.addEventListener('visibilitychange',onVisibility);
  window.visualViewport?.addEventListener('resize',onViewport,{passive:true});
  window.visualViewport?.addEventListener('scroll',onViewport,{passive:true});
  screen.orientation?.addEventListener?.('change',onViewport);
  emit();

  return {
    getStatus:()=>({...status}),
    refresh:()=>emit(),
    async install(){
      if(!installEvent)return {ok:false,reason:'unavailable'};
      try{
        installEvent.prompt();
        const result=await installEvent.userChoice;
        const accepted=result?.outcome==='accepted';
        status.lastInstallResult=result?.outcome||'unknown';
        if(accepted){installEvent=null;status.installAvailable=false;}
        diagnostics?.info?.('pwa','Prompt de instalação concluído.',{outcome:status.lastInstallResult});
        emit();
        return {ok:accepted,outcome:status.lastInstallResult};
      }catch(error){
        diagnostics?.warn?.('pwa','Falha ao abrir instalação.',{error:error.message});
        return {ok:false,reason:error.message};
      }
    },
    async requestFullscreen(){
      if(document.fullscreenElement)return {ok:true,already:true};
      const root=document.documentElement;
      if(!root.requestFullscreen)return {ok:false,reason:'unsupported'};
      try{
        await root.requestFullscreen({navigationUI:'hide'});
        await screen.orientation?.lock?.('landscape').catch(()=>{});
        emit();
        return {ok:true};
      }catch(error){
        diagnostics?.warn?.('fullscreen','Navegador recusou tela cheia.',{error:error.message});
        return {ok:false,reason:error.message};
      }
    },
    async exitFullscreen(){
      if(!document.fullscreenElement)return {ok:true,already:true};
      try{await document.exitFullscreen();emit();return {ok:true};}
      catch(error){return {ok:false,reason:error.message};}
    },
    async toggleFullscreen(){
      return document.fullscreenElement?this.exitFullscreen():this.requestFullscreen();
    },
    destroy(){
      window.removeEventListener('beforeinstallprompt',onBeforeInstall);
      window.removeEventListener('appinstalled',onInstalled);
      window.removeEventListener('online',onConnectivity);
      window.removeEventListener('offline',onConnectivity);
      window.removeEventListener('resize',onViewport);
      window.removeEventListener('orientationchange',onViewport);
      document.removeEventListener('fullscreenchange',onFullscreenChange);
      document.removeEventListener('visibilitychange',onVisibility);
      window.visualViewport?.removeEventListener('resize',onViewport);
      window.visualViewport?.removeEventListener('scroll',onViewport);
      screen.orientation?.removeEventListener?.('change',onViewport);
    }
  };
}
