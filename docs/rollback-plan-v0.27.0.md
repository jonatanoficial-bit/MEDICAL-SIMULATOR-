# Plano de rollback — v0.27.0

1. Não apagar os caches anteriores durante a primeira ativação; o service worker preserva uma versão anterior.
2. Antes de aplicar atualização, criar backup rotativo do save.
3. Em falha de abertura, usar `?safe=1`.
4. Na Central de Recuperação, restaurar um dos cinco backups.
5. Se o Centro Beta falhar, retornar à v0.26.0; o save v0.27.0 não deve ser importado para trás sem conversor.
6. Para reimplantar, publicar o ZIP v0.26.0 e limpar somente o cache atual.
7. Não alterar ou liberar flags médicas durante rollback.
