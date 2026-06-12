# Plano de rollback — v0.14.0

## Versão de retorno

`MEDICAL-SIMULATOR-v0.13.0-Mobile-PWA-Fullscreen.zip`

## Procedimento

1. Preserve o ZIP v0.14.0 e exporte o save pela Central de Recuperação.
2. Publique integralmente a pasta da v0.13.0.
3. Não misture arquivos das duas versões.
4. Aguarde o service worker manter a versão anterior e recarregue o aplicativo.
5. O save v0.14.0 usa schema 5; para retorno seguro, restaure um backup criado antes da migração ou use o save exportado apenas após validação.
6. Confirme lobby, especialidade, início do plantão, conclusão e recarga.

## Gatilhos de rollback

- tela branca não recuperada pelo watchdog;
- corrupção de save sem backup recuperável;
- impossibilidade de abrir qualquer etapa clínica;
- atualização PWA presa em loop;
- erro crítico reproduzível em mais de uma resolução.
