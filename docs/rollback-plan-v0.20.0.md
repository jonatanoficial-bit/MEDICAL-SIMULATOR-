# Plano de rollback — v0.20.0

## Versão anterior segura

- Retorno previsto: v0.19.0 — Motor Fisiológico.
- O cache anterior do service worker é preservado durante a atualização.
- O save schema 11 mantém os campos anteriores e adiciona apenas o estado de avaliação estruturada.

## Procedimento

1. Retirar a v0.20.0 do servidor.
2. Restaurar integralmente o ZIP da v0.19.0.
3. Restaurar o service worker e o `BUILD.json` da v0.19.0.
4. Não apagar `localStorage` automaticamente.
5. Abrir o jogo e confirmar recuperação do save principal ou de um dos cinco backups.
6. Verificar lobby, especialidade, plantão, prontuário e pós-consulta.

## Dados da v0.20.0

A v0.19.0 pode ignorar os campos novos de avaliação. Caso seja necessária recuperação seletiva, exporte o diagnóstico e o save antes do rollback. O progresso principal, XP, idioma, acessibilidade e carreira permanecem em campos já existentes.

## Gatilhos para rollback

- tela branca persistente;
- falha de migração de save;
- bloqueio de rolagem reproduzido em aparelhos reais;
- falha no carregamento dos casos ou da fisiologia;
- regressão crítica de PWA/offline;
- divergência no manifesto de integridade.
