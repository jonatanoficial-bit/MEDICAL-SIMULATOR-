// Contrato de rolagem mobile: nunca cancela touchmove e nunca bloqueia o documento.
export function installTouchScrollGuard({diagnostics}={}){
  const root=document?.documentElement;
  const body=document?.body;
  const apply=()=>{
    root?.classList?.add?.('touch-scroll-enabled');
    body?.classList?.add?.('touch-scroll-enabled');
    root?.style?.setProperty?.('--scroll-contract','pan-y');
  };
  apply();
  let startY=0,startX=0,moved=false;
  const onStart=event=>{const touch=event.touches?.[0];if(!touch)return;startY=touch.clientY;startX=touch.clientX;moved=false;};
  const onMove=event=>{const touch=event.touches?.[0];if(!touch)return;if(Math.abs(touch.clientY-startY)>6||Math.abs(touch.clientX-startX)>6)moved=true;};
  const onEnd=()=>{if(moved)diagnostics?.info?.('mobile-scroll','Gesto de rolagem por toque detectado sem cancelamento.',{scrollY:Math.round(window.scrollY||0)});};
  document?.addEventListener?.('touchstart',onStart,{passive:true});
  document?.addEventListener?.('touchmove',onMove,{passive:true});
  document?.addEventListener?.('touchend',onEnd,{passive:true});
  return{destroy(){document?.removeEventListener?.('touchstart',onStart);document?.removeEventListener?.('touchmove',onMove);document?.removeEventListener?.('touchend',onEnd);}};
}
