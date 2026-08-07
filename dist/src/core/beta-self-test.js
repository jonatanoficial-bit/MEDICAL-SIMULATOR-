const item=(id,label,status,detail)=>({id,label,status,detail});
const ok=value=>value?'pass':'fail';

export function runBetaSelfTests({build,state,contentStatus,governanceSummary,stateStore,diagnostics,pwaStatus,documentRef=globalThis.document}={}){
  const checks=[];
  checks.push(item('build','Versão única da build',ok(build?.version==='2.0.0'),build?.label||'indisponível'));
  checks.push(item('save-schema','Save schema 18',ok(Number(state?.meta?.saveSchema)===18),`schema ${state?.meta?.saveSchema??'?'}`));
  checks.push(item('content-schema','Conteúdo schema 12',ok(Number(build?.contentSchema)===12),`schema ${build?.contentSchema??'?'}`));
  checks.push(item('content','Pacote clínico carregado',Number(contentStatus?.caseCount||0)>=6?'pass':'fail',`${contentStatus?.caseCount||0} casos • ${contentStatus?.mode||'unknown'}`));
  checks.push(item('governance','Trava clínica ativa',governanceSummary?.ready===false?'pass':'fail',governanceSummary?.ready?'release liberado indevidamente':`${governanceSummary?.blockedCount||0} casos bloqueados`));
  const storage=stateStore?.inspect?.();
  checks.push(item('storage','Integridade do save',storage?.main?.ok||!storage?.main?.exists?'pass':'fail',storage?.main?.ok?'slot íntegro':storage?.main?.exists?'slot inválido':'novo slot'));
  checks.push(item('backups','Backups rotativos',storage?.backups?.filter?.(entry=>entry.ok).length>=0?'pass':'fail',`${storage?.backups?.filter?.(entry=>entry.ok).length||0} recuperáveis`));
  const touch=globalThis.getComputedStyle&&documentRef?.documentElement?globalThis.getComputedStyle(documentRef.documentElement).touchAction||'':documentRef?.documentElement?.style?.touchAction||'';
  checks.push(item('touch','Rolagem vertical nativa',touch.includes('pan-y')||!touch?'pass':'warn',touch||'verificação por aparelho necessária'));
  checks.push(item('runtime','Runtime sem erro fatal',diagnostics?.summary?.().errors===0?'pass':'warn',`${diagnostics?.summary?.().errors||0} erros locais registrados`));
  checks.push(item('pwa','PWA/service worker',pwaStatus?.registered?'pass':globalThis.location?.protocol==='https:'?'warn':'warn',pwaStatus?.registered?'registrado':'validar em HTTPS/aparelho real'));
  checks.push(item('locale','Idioma suportado',['pt-BR','en','es'].includes(state?.locale)?'pass':'fail',state?.locale||'unknown'));
  checks.push(item('accessibility','Preferências de acessibilidade',state?.accessibility?'pass':'fail',state?.accessibility?.contrast||'indisponível'));
  const totals={pass:checks.filter(x=>x.status==='pass').length,warn:checks.filter(x=>x.status==='warn').length,fail:checks.filter(x=>x.status==='fail').length};
  return {id:`audit-${Date.now()}`,build:build?.label||'unknown',checkedAt:new Date().toISOString(),status:totals.fail?'fail':totals.warn?'warn':'pass',totals,checks};
}
