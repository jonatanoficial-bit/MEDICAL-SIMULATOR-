# Rollback — v0.21.0

1. Restaurar o ZIP completo v0.20.0.
2. O service worker mantém um cache anterior.
3. O save schema 12 preserva os dados legados; a v0.20.0 deve ser aberta somente após exportar backup.
4. Em falha, usar `?safe=1`, exportar o save e restaurar um backup pela Central de Recuperação.
