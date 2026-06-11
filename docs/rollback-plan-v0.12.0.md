# Plano de rollback — v0.12.0

## Gatilhos

Executar rollback somente se ocorrer um destes eventos em hospedagem real:

- tela de recuperação em mais de uma abertura consecutiva;
- falha generalizada de migração do save v0.11.0;
- service worker impedindo a carga do `index.html`;
- consumo anormal de armazenamento;
- restauração selecionada promovendo perfil incorreto.

## Retorno técnico

1. Preservar o ZIP v0.12.0 e os diagnósticos exportados.
2. Restaurar o ZIP completo v0.11.0 no servidor.
3. Não apagar manualmente as chaves `medsim-vale-save-v012`.
4. Manter o cache v0.12.0 disponível até confirmar a abertura da versão anterior.
5. Orientar o usuário a exportar o save v0.12.0 antes de limpar caches.

## Compatibilidade do save

A v0.12.0 usa envelope e schema 3. A v0.11.0 não lê automaticamente a chave `medsim-vale-save-v012`.

Antes do rollback:

- exportar o save pela Central de Recuperação;
- preservar `medsim-vale-save-v011`, que não é removida durante a migração;
- usar a chave v0.11.0 como ponto de retorno da carreira anterior.

O progresso produzido exclusivamente na v0.12.0 pode não aparecer na v0.11.0. Não excluir a chave v0.12.0, pois ela poderá ser recuperada quando a build corrigida retornar.

## Rollback somente de cache

Quando o código estiver correto e a divergência for apenas de cache:

1. Abrir a tela do watchdog.
2. Selecionar “Limpar somente cache e recarregar”.
3. Preservar localStorage.
4. Reabrir online.
5. Confirmar a versão exibida no rodapé e em Configurações.

## Critério de retorno à v0.12.0

- reprodução do defeito documentada;
- correção coberta por teste automatizado;
- manifesto SHA-256 regenerado;
- teste de migração e recuperação aprovado;
- nova build com versão superior, nunca substituindo silenciosamente o mesmo ZIP.
