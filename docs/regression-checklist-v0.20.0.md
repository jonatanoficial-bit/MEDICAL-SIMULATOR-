# Checklist de regressão — v0.20.0

## Build e integridade

- [x] Versão 0.20.0 alinhada em runtime, BUILD, package, manifest, conteúdo e service worker.
- [x] Save schema 11 e content schema 5.
- [x] Sintaxe dos módulos JavaScript validada.
- [x] Manifesto SHA-256 regenerado após congelamento.
- [x] ZIP final deve ser descompactado e verificado novamente.

## Rolagem e mobile

- [x] Fullscreen automático por primeiro gesto removido.
- [x] Fullscreen disponível somente por botão explícito.
- [x] `touchmove` passivo e sem cancelamento.
- [x] `pan-y` e pinch zoom habilitados.
- [x] Overscroll vertical nativo restaurado.
- [x] Camadas invisíveis não interceptam toque.
- [x] Anamnese rolou de 0 para 909 px em Chromium mobile.
- [x] Exame físico rolou de 0 para 525 px em Chromium mobile.
- [x] Nenhum estouro horizontal em 360 × 800.
- [x] Tablet 768 × 1024 sem estouro horizontal.
- [x] Desktop 1366 × 768 sem estouro horizontal.

## Avaliação clínica

- [x] 6 perfis validados.
- [x] 30 perguntas de anamnese validadas.
- [x] 24 itens de exame físico validados.
- [x] PT-BR, inglês e espanhol completos.
- [x] IDs únicos e vínculos canônicos presentes.
- [x] Integração ao prontuário e à linha do tempo.
- [x] Integração ao tempo clínico e motor fisiológico.
- [x] Fallback e último pacote íntegro aprovados.

## Compatibilidade preservada

- [x] 6 casos e 9 especialidades carregados.
- [x] Academia com 9 módulos e 27 lições.
- [x] Motor fisiológico determinístico com 6 perfis.
- [x] Migração do save anterior aprovada.
- [x] Cinco backups rotativos aprovados.
- [x] PWA e 67 recursos do service worker auditados.
- [x] Alto contraste, quatro tamanhos de texto e teclado preservados.
- [x] Interface trilíngue sem overflow horizontal.

## Trava comercial

- [x] 6 casos bloqueados sem aprovação clínica.
- [x] Academia bloqueada para publicação.
- [x] 6 perfis fisiológicos bloqueados.
- [x] 6 perfis de avaliação clínica bloqueados.
- [x] `npm run release-gate` retorna código 2 intencionalmente.
