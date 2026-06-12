# Plano de rollback — v0.17.0

## Alvo anterior

Build estável anterior: **v0.16.0 — Internacionalização Trilíngue**.

## Procedimento

1. retirar a v0.17.0 da hospedagem;
2. restaurar integralmente o ZIP v0.16.0;
3. manter o cache anterior do service worker disponível;
4. não apagar chaves de save do usuário;
5. a v0.16.0 poderá migrar/ler seus próprios slots anteriores, enquanto o slot v0.17.0 permanece isolado;
6. registrar o motivo do rollback e preservar o relatório de governança exportado;
7. corrigir a falha em nova versão patch, sem editar silenciosamente a build publicada.

## Critérios para rollback imediato

- tela inicial não abre;
- save não migra ou corrompe progresso;
- loader rejeita tanto conteúdo externo quanto fallback;
- governança deixa casos sem registro passarem silenciosamente;
- release gate libera caso sem revisão completa;
- service worker mantém mistura de versões incompatíveis.
