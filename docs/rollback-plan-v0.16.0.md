# Plano de rollback — v0.16.0

## Versão de retorno

Retornar para **v0.15.0 — Design System e Acessibilidade** caso a internacionalização cause falha crítica de inicialização, perda de save, score incorreto ou conteúdo clínico inacessível.

## Proteções disponíveis

- save v0.16.0 usa uma chave própria;
- migração lê a chave da v0.15.0 sem apagar a origem;
- até cinco backups rotativos são mantidos;
- cache anterior do service worker é preservado;
- último pacote clínico válido permanece disponível;
- modo seguro pode ser acionado com `?safe=1`;
- português do Brasil é o fallback final dos catálogos.

## Procedimento

1. Retirar a v0.16.0 da hospedagem.
2. Republicar o ZIP íntegro da v0.15.0.
3. Manter o armazenamento do navegador intacto.
4. Abrir uma vez com internet para o service worker reconhecer a versão publicada.
5. Caso necessário, usar a Central de Recuperação para restaurar o backup mais recente.
6. Não limpar `localStorage`, dados do site ou cache manualmente antes de exportar o diagnóstico.

## Critérios de rollback imediato

- tela branca ou ciclo de inicialização;
- idioma trocado altera pontuação ou escolhas clínicas;
- save anterior não é migrado;
- catálogos impedem abertura de um caso ativo;
- controles essenciais ficam inacessíveis em 360 px;
- service worker não consegue instalar os recursos críticos.
