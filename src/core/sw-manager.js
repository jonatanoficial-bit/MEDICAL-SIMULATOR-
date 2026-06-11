export function initServiceWorker({version='dev',onUpdate=()=>{},onStatus=()=>{}}={}){
  try{sessionStorage.removeItem('medsim-sw-refresh');}catch{}
  const status={supported:'serviceWorker'in navigator,registered:false,controlled:!!navigator.serviceWorker?.controller,version,updateReady:false,error:null};
  if(!status.supported||location.protocol==='file:'||new URLSearchParams(location.search).get('safe')==='1'){
    onStatus({...status,disabled:true});
    return Promise.resolve(status);
  }
  return navigator.serviceWorker.register('./sw.js').then(registration=>{
    status.registered=true;status.controlled=!!navigator.serviceWorker.controller;onStatus({...status});
    const inspect=worker=>{
      if(!worker)return;
      worker.addEventListener('statechange',()=>{
        if(worker.state==='installed'&&navigator.serviceWorker.controller){status.updateReady=true;onStatus({...status});onUpdate({registration,worker,status:{...status}});}
      });
    };
    inspect(registration.installing);
    registration.addEventListener('updatefound',()=>inspect(registration.installing));
    if(registration.waiting){status.updateReady=true;onUpdate({registration,worker:registration.waiting,status:{...status}});}
    navigator.serviceWorker.addEventListener('controllerchange',()=>{if(sessionStorage.getItem('medsim-sw-refresh')==='1')return;sessionStorage.setItem('medsim-sw-refresh','1');location.reload();});
    return status;
  }).catch(error=>{status.error=error.message;onStatus({...status});return status;});
}

export function applyWaitingUpdate(registration){
  if(registration?.waiting){registration.waiting.postMessage({type:'SKIP_WAITING'});return true;}
  return false;
}
