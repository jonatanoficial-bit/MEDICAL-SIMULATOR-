# Arquivos legados isolados

Os arquivos desta pasta pertencem ao motor anterior e não são carregados por `index.html`.
Foram preservados exclusivamente para auditoria e rollback histórico.

A build ativa utiliza somente:

- `src/app.js`
- módulos em `src/config`, `src/core`, `src/data`, `src/i18n` e `src/compat`
- conteúdo validado em `data/*.json`

Não reative os arquivos legados sem uma migração explícita e testes de regressão.
