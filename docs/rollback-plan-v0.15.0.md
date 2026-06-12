# Plano de rollback — v0.15.0

1. Preserve o ZIP v0.15.0 e o save exportado antes de qualquer troca.
2. Em falha visual, use Configurações → Acessibilidade → Restaurar padrão.
3. Em falha de sessão, abra a Central de Recuperação e repare apenas os dados transitórios.
4. Em corrupção de save, restaure um dos cinco backups rotativos.
5. Em incompatibilidade da build, publique novamente o ZIP v0.14.0 completo.
6. O service worker preserva o cache anterior durante a transição.
7. Saves v0.15.0 usam schema 6; antes do downgrade, mantenha uma cópia exportada.
8. Após rollback, limpe somente o cache se a interface continuar apontando para a versão nova.
