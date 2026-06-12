# Checklist de regressão — v0.18.0

## Build e integridade

- [x] Versão v0.18.0 alinhada em BUILD.json, JavaScript, package, manifesto web e service worker.
- [x] Build visível: 2026-06-12 17:15:20 BRT.
- [x] Save schema 9.
- [x] Content schema 3.
- [x] Academy schema 1.
- [x] Manifesto SHA-256 regenerado após congelamento.
- [x] ZIP descompactado e verificado novamente.

## Academia

- [x] 9 módulos carregados.
- [x] 27 lições em cada idioma.
- [x] 5 perguntas no pré-teste.
- [x] 9 checkpoints sequenciais.
- [x] 5 decisões no caso guiado.
- [x] Debriefing preserva resposta e explicação de cada etapa.
- [x] Módulos posteriores permanecem bloqueados até o requisito anterior.
- [x] XP não é duplicado ao refazer checkpoint ou caso guiado.
- [x] Troca de idioma não altera respostas, score ou progresso.
- [x] Fallback integral da Academia validado.

## Save e anti-quebra

- [x] Migração dos saves anteriores.
- [x] Gravação transacional.
- [x] Checksum.
- [x] Até 5 backups rotativos.
- [x] Recuperação do slot pendente.
- [x] Último pacote íntegro.
- [x] Modo seguro.
- [x] Watchdog de inicialização.

## Layout e acessibilidade

- [x] Catálogo, módulo, quiz e caso guiado em 360×800.
- [x] Academia em tablet 768×1024.
- [x] Academia em desktop 1366×768.
- [x] PT-BR, inglês e espanhol sem estouro horizontal.
- [x] Alvos de toque com no mínimo 48 px.
- [x] Alto contraste e texto muito grande preservados.
- [x] Navegação por teclado e leitores de tela preservados.

## Governança

- [x] Fontes vinculadas aos módulos.
- [x] Aviso educacional trilíngue.
- [x] Conteúdo marcado como development-only.
- [x] Release gate bloqueia 6 casos e 9 módulos ainda não aprovados.
