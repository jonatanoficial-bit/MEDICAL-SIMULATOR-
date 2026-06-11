# Plano de rollback — v0.11.0

## Versão de retorno

`MEDICAL-SIMULATOR-v0.10.0-Recovery-Foundation.zip`

## Quando reverter

Reverter somente se ocorrer uma destas condições:

- Tela branca na inicialização em hospedagem real.
- Falha generalizada na migração de saves.
- Conteúdo externo e fallback falharem simultaneamente.
- Service worker impedir atualização ou abertura offline.
- Regressão crítica que impeça iniciar ou finalizar consultas.

## Procedimento

1. Preservar o ZIP v0.11.0 e os logs do problema.
2. Exportar o save pelo menu ou tela de recuperação.
3. Publicar novamente todos os arquivos da v0.10.0.
4. Remover o service worker v0.11.0 da hospedagem ou alterar o nome de cache.
5. Limpar somente o cache do site; não apagar o save sem backup.
6. Confirmar abertura da v0.10.0 em mobile e PC.
7. Registrar o erro e criar patch v0.11.1, sem sobrescrever a build defeituosa.

## Compatibilidade de save

A v0.11.0 cria a chave `medsim-vale-save-v011` e preserva as chaves antigas. O rollback para v0.10.0 continuará encontrando `medsim-vale-save-v010`. Progresso criado exclusivamente após a migração pode não aparecer na v0.10.0; por isso, exporte o save antes do rollback.
