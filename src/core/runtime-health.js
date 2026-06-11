export async function verifyRuntimeBuild(expectedVersion,{timeoutMs=3500}={}){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),timeoutMs);
  try{
    const response=await fetch(`BUILD.json?health=${Date.now()}`,{cache:'no-store',signal:controller.signal});
    if(!response.ok)throw new Error(`HTTP ${response.status}`);
    const build=await response.json();
    const ok=build.version===expectedVersion;
    return {ok,expectedVersion,servedVersion:build.version||null,build:build.build||null,message:ok?'Build coerente.':'Módulo e BUILD.json pertencem a versões diferentes.'};
  }catch(error){return {ok:false,expectedVersion,servedVersion:null,message:`Verificação indisponível: ${error.message}`};}
  finally{clearTimeout(timer);}
}
