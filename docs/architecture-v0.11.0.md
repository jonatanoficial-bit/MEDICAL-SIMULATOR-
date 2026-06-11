# Arquitetura ativa — v0.11.0

```text
index.html
└── src/app.js
    ├── src/config/build.js
    ├── src/core/default-state.js
    ├── src/core/object.js
    ├── src/core/storage.js
    ├── src/data/content-loader.js
    │   ├── src/data/content-schema.js
    │   └── src/data/fallback-content.js
    ├── src/i18n/index.js
    └── src/compat/legacy-guards.js
```

## Recursos externos obrigatórios

```text
data/core-cases.json
data/gameplay.json
data/queue.json
data/specialties.json
data/missions.json
data/clinical-responses.json
```

## Regra anti-quebra

O jogo inicia com o fallback interno imediatamente. Em seguida, tenta carregar os arquivos JSON externos. Cada recurso pode falhar isoladamente. Depois do carregamento, o conjunto completo é validado. Se a combinação externa for inválida, o jogo retorna ao fallback integral.

## Regra de conteúdo

Nenhum novo caso deve ser inserido diretamente em `src/app.js`. Todo caso novo deve:

1. seguir o schema atual;
2. possuir ID único;
3. apontar para especialidade existente;
4. usar exames, procedimentos e condutas registrados;
5. passar em `npm run audit`;
6. receber revisão clínica antes de ser marcado como comercial.
