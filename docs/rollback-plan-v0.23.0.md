# Rollback — v0.23.0

1. Preserve o ZIP completo da v0.22.0 antes de publicar a v0.23.0.
2. O service worker mantém o cache imediatamente anterior.
3. Em falha de atualização, restaure os arquivos da v0.22.0 e recarregue a página.
4. A v0.23.0 usa save schema 14; ao retornar a uma versão antiga, prefira um backup criado antes da migração.
5. Não apague os backups rotativos nem o arquivo exportado do save.
6. O modo seguro `?safe=1` ignora conteúdo externo e reduz o risco de tela branca.
7. O Centro de Recuperação pode remover apenas a sessão atual, preservando carreira e histórico confirmado.
