# Changelog

## v0.15.0 — Design System e Acessibilidade — 2026-06-12 16:15:18 BRT

- design system com tokens reutilizáveis e controles padronizados;
- quatro tamanhos de texto e alto contraste persistentes;
- redução de movimento manual e pela preferência do sistema;
- foco visível reforçado, skip link e regiões ARIA live;
- diálogos semânticos e fechamento por Esc;
- navegação por setas em abas e atalhos Alt+1 a Alt+5;
- suporte a leitores de tela e Windows Forced Colors;
- alvos de toque mínimos de 48 px;
- save schema 6 com migração da v0.14.0;
- service worker e cache atualizados para v0.15.0.

## v0.14.0 — Nova Interface Clínica Premium

- painel de comando do paciente com situação clínica e tempo;
- indicador de progresso em cinco etapas;
- prontuário eletrônico com seis abas e histórico cronológico;
- central de resultados de exames e procedimentos;
- observações clínicas livres no prontuário;
- revisão protegida antes do encerramento;
- pós-consulta premium com métricas e debriefing;
- score previsto removido da interface do plantão;
- save schema 5 com migração da v0.13.0;
- build e cache atualizados para v0.14.0 | build 2026-06-12 12:36:19 BRT.

## v0.13.0 — Mobile, PWA e Tela Cheia — 2026-06-12 11:31:30 BRT

- Plantão mobile dividido em sete abas clínicas.
- Dock inferior e HUD compacto para toque.
- Safe areas e altura dinâmica por visualViewport.
- PWA instalável com ícones any e maskable.
- Detecção online/offline e modos fullscreen/standalone.
- Service worker com fallback offline e cache anterior preservado.
- Save schema 4 com migração da v0.12.0.
- Build e rolagem corrigidas para não cobrir controles mobile.

## v0.12.0 — Anti-quebra 2.0 e Observabilidade — 2026-06-11 19:01:22 BRT

- Save schema 3 com envelope, checksum e gravação transacional por slot temporário.
- Até cinco backups rotativos recuperáveis, com restauração seletiva.
- Migração automática dos saves v0.11.0, v0.10.0 e v0.8.0.
- Watchdog de inicialização de 12 segundos e detecção de ciclo de falhas.
- Central de recuperação para reparar somente dados transitórios sem apagar a carreira.
- Log técnico local exportável, limitado a 80 eventos.
- Conteúdo clínico com timeout, nova tentativa e cache do último pacote validado.
- Verificação de coerência entre módulo JavaScript e BUILD.json em tempo de execução.
- Service worker com instalação crítica validada e retenção do cache anterior para rollback.
- Modo seguro por `?safe=1`, ignorando conteúdo externo e service worker.

## v0.11.0 — Arquitetura Modular — 2026-06-11 18:42:27 BRT

- Separação de build, estado, armazenamento, conteúdo, idiomas e compatibilidade.
- Seis casos ativos externalizados em JSON com validação de schema.
- Fallback interno integral caso um ou mais arquivos de conteúdo falhem.
- Migração automática do save v0.10.0 para save schema 2.
- Dados de especialidades, fila, missões e respostas clínicas externalizados.
- Motor antigo isolado em `legacy/` e removido do caminho ativo.
- Especialidades sem casos agora aparecem como conteúdo em preparação, sem abrir caso incorreto.
- Infraestrutura inicial de idiomas PT-BR, EN e ES.
- Service worker atualizado para todos os módulos e dados críticos.
- Auditorias automatizadas de conteúdo, arquitetura, loader e armazenamento.

## v0.10.0 — Recovery Foundation — 2026-06-11 18:42 BRT

### Corrigido
- Versionamento ativo unificado para v0.10.0 na interface, BUILD.txt, VERSAO.txt e BUILD.json.
- Service worker atualizado para cache v0.10.0, evitando reaproveitamento de arquivos antigos da v0.9.1.
- Manifesto de integridade será regenerado com SHA-256 real de todos os arquivos.
- Marcadores antigos de Release Freeze, Gold Candidate e Pré-final Seguro foram ocultados para evitar sobreposição no celular.
- Ajustes mobile iniciais: padding inferior seguro, HUD mais compacto, build menor e botões com toque mais previsível.
- Save local ganhou chave v0.10.0 com tentativa de migração da chave v0.8.0.
- Escolha de especialidade passa a filtrar os casos quando houver casos daquela especialidade.

### Mantido
- Gameplay principal preservado para não quebrar a base.
- Assets e estrutura pública mantidos.
- Motor clínico avançado ainda fica para fases futuras.

### Próxima fase recomendada
- v0.11.0 — Arquitetura modular: separar core, casos, idiomas, tutorial e simulação.