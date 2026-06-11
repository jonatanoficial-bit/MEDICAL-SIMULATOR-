# Plano de Rollback — v0.10.0

1. Restaurar ZIP anterior v0.9.5 caso a v0.10.0 apresente tela branca.
2. Limpar cache do navegador/PWA no dispositivo de teste.
3. Remover service worker registrado pelo navegador.
4. Reabrir `index.html`.
5. Caso o save esteja corrompido, usar os backups locais criados com prefixo `medsim-vale-save-v010-` ou `medsim-vale-save-v080-`.

A v0.10.0 preserva arquivos legados para inspeção, mas a entrada ativa permanece `src/app.js`.
