# Plano de rollback — v0.18.0

## Versão segura anterior

**v0.17.0 — Governança Médica**

## Procedimento

1. Retirar a v0.18.0 da hospedagem sem apagar os dados do navegador.
2. Restaurar integralmente o ZIP da v0.17.0.
3. Invalidar somente o cache `medical-simulator-v0.18.0` caso a atualização tenha sido ativada.
4. Manter o cache anterior preservado pelo service worker.
5. Não converter manualmente saves nem editar checksums.
6. Caso a inicialização falhe, abrir com `?safe=1` e usar a Central de Recuperação.
7. Exportar diagnóstico e save antes de qualquer limpeza.

## Compatibilidade de save

A v0.18.0 usa slot e schema próprios e preserva os slots legados. O rollback para v0.17.0 não deve interpretar o progresso exclusivo da Academia, mas a carreira anterior permanece disponível em seus slots compatíveis. Não reutilizar um arquivo v0.18.0 como se fosse schema 8.

## Critérios para acionar rollback

- tela branca recorrente após atualização;
- falha de migração do save;
- indisponibilidade simultânea do conteúdo externo e fallback;
- Academy schema inválido aceito pelo runtime;
- regressão que impeça acesso ao plantão ou à carreira;
- divergência de manifesto em arquivo crítico.
