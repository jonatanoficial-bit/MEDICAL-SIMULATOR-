# Rollback — v0.22.0

1. Exportar o save antes de qualquer reversão.
2. Restaurar o ZIP v0.21.0 e limpar somente o cache atual do service worker.
3. A v0.22.0 usa save schema 13; priorize restaurar um backup criado antes da migração ao abrir uma versão antiga.
4. Nunca apagar os cinco backups rotativos durante o rollback.
