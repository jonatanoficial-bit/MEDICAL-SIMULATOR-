# Checklist de Regressão — v0.20.0

## Build e integridade

- [x] Versão 0.20.0 consistente em build, pacote, manifesto web, conteúdo, configuração, HTML e service worker.
- [x] Save schema 10 e content schema 4.
- [x] Manifesto SHA-256 regenerado após o congelamento dos arquivos.
- [x] ZIP completo testado antes da entrega.

## Conteúdo

- [x] 6 casos ativos validados.
- [x] 9 especialidades validadas.
- [x] 6 missões validadas.
- [x] 9 módulos e 27 lições da Academia preservados.
- [x] 6 perfis fisiológicos vinculados aos casos corretos.
- [x] Conteúdo externo, último pacote íntegro e fallback funcionais.

## Motor fisiológico

- [x] Sessão criada ao iniciar caso.
- [x] Mesmas entradas produzem o mesmo resultado.
- [x] Tempo contínuo avança apenas no plantão ativo.
- [x] Retorno de aba respeita limite de avanço.
- [x] Custos de tempo por ação aplicados.
- [x] Curso natural altera variáveis do caso.
- [x] Condutas usam efeitos específicos do perfil.
- [x] Ações sem efeito definido não geram melhora genérica.
- [x] Reavaliação registra tendência e prontuário.
- [x] Janela de segurança influencia estado e score.
- [x] Score fisiológico permanece entre 0 e 15.
- [x] Pós-consulta apresenta evolução simulada.

## Save e anti-quebra

- [x] Migração da v0.18.0.
- [x] Checksum válido.
- [x] Gravação transacional.
- [x] Recuperação de slot temporário.
- [x] Cinco backups rotativos.
- [x] Watchdog e detecção de ciclo de falha.
- [x] Modo seguro.
- [x] Último conteúdo íntegro.
- [x] Cache anterior preservado para rollback.

## Interface e dispositivos

- [x] Mobile 360×800 sem estouro horizontal.
- [x] Tablet 768×1024 sem estouro horizontal.
- [x] Desktop 1366×768 sem estouro horizontal.
- [x] Botão Reavaliar com mínimo de 48 px.
- [x] PT-BR, inglês e espanhol sem cortes horizontais.
- [x] Alto contraste e texto muito grande.
- [x] Navegação por teclado e foco em modais.
- [x] PWA e safe areas preservados.

## Governança

- [x] Release gate reconhece 6/6 casos bloqueados.
- [x] Academia permanece não publicável.
- [x] Perfis fisiológicos permanecem não publicáveis.
- [x] Nenhuma credencial ou aprovação inventada.
- [ ] Revisão médica independente — pendente.
- [ ] Revisão terminológica trilíngue — pendente.
- [ ] Auditoria de segurança em aparelho real — pendente.
- [ ] Testes PWA/offline/tela cheia em HTTPS e aparelho físico — pendentes.
