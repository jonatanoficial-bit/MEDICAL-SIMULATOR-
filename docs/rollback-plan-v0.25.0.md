# Plano de rollback — v0.25.0

## Versão de retorno

v0.24.0 — Casos Ramificados e Níveis de Dificuldade.

## Procedimento

1. Manter uma cópia integral do ZIP v0.24.0.
2. Publicar novamente os arquivos da v0.24.0 no mesmo caminho HTTPS.
3. Não apagar os slots de save do usuário.
4. O service worker mantém cache anterior para recuperação.
5. Caso um save schema 16 seja aberto por versão anterior incompatível, usar a Central de Recuperação para restaurar um backup anterior à migração.
6. Preservar o arquivo exportado do save antes de qualquer reset.

## Gatilhos de rollback

- Tela branca ou falha de boot em aparelho real.
- Corrupção de save confirmada.
- Loop de atualização do service worker.
- Navegação da carreira impedindo acesso aos modos clínicos.
- Falha de rolagem por toque em aparelhos físicos.
- Recompensa ou promoção duplicada.

## Dados adicionados nesta fase

O objeto `career` inclui estágio, rotação, provas, recompensas já recebidas, presenças, missões, competências e histórico. A remoção da v0.25.0 não deve apagar esses dados manualmente; o backup transacional deve ser priorizado.
