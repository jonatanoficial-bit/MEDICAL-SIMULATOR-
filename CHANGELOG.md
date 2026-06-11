# Changelog

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