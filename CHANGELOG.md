# Changelog

## v1.0.0 — Produção web/PWA — 2026-07-31 16:15:19 BRT

- Interface pública comercial sem central de testes, ferramentas internas ou mensagens provisórias.
- Experiência mobile-first em horizontal, incluindo 568 × 320 e áreas seguras.
- Overlay de rotação acessível, sem `alert()` e sem recarga do estado.
- Pausa segura de fisiologia, emergência e áudio ao girar ou ocultar a página.
- Configuração, menu, especialidades, plantão, ajustes e recuperação redesenhados.
- Manifesto PWA em paisagem com cinco ícones finais e cache v1.0.0.
- Nove recursos de áudio WAV locais adicionados com fallback seguro.
- Build e schemas consistentes, documentação de auditoria e preparação para APK.
- Suíte automatizada e matriz responsiva atualizadas para Windows e navegadores modernos.

## v0.27.0 — Beta Fechado, Auditoria Final e Preparação para RC — 2026-06-17 10:43:42 BRT

- Centro Beta Fechado com status, checklist, feedback e sessões locais.
- Autoauditoria com 12 verificações de build, save, conteúdo, governança, PWA, idioma e acessibilidade.
- Matriz de 6 famílias de aparelhos/navegadores, pendente por padrão.
- Telemetria local opcional, desativada por padrão, limitada a 25 sessões e sem transmissão.
- Exportação manual de pacote beta e relatório de falha em JSON.
- Nome e texto livre removidos dos eventos automáticos.
- Save schema 18, content schema 12 e beta schema 1.
- Service worker ampliado para 98 recursos: 55 críticos, 18 de dados e 25 opcionais.
- Auditoria visual trilíngue do Centro Beta em celular, tablet e PC.
- Release Candidate gate permanece bloqueado por matriz física e validação médica pendentes.

## v0.26.0 — 2026-06-17
- Sistema audiovisual premium com fallback seguro.
- 6 SFX e 3 ambientes originais.
- Tema visual adaptativo e qualidade configurável.
- Inventário oficial de assets substituíveis.
- Save schema 17 e content schema 11.

# Changelog

## v0.24.0 — Casos Ramificados e Níveis de Dificuldade
- Quatro níveis: iniciante, estudante, profissional e desafio.
- Seis perfis ramificados, pistas condicionais e diagnósticos diferenciais.
- Limite de hipóteses por dificuldade, penalidades e recompensa ajustadas.
- Quatro desfechos auditáveis: seguro, seguimento, risco não resolvido e encerramento inseguro.
- Save schema 15, content schema 9 e fallback anti-quebra.
- Rolagem vertical mobile preservada.

## v0.23.0 — Pacote Ambulatorial Longitudinal — 2026-06-13 11:57:41 BRT

- Centro de Seguimento separado do plantão agudo.
- Dez linhas de cuidado longitudinal com três a cinco retornos.
- Quinze ações sobre avaliação, monitorização, adesão, barreiras, segurança e continuidade.
- Metas determinísticas, evolução entre consultas, faltas e desfechos persistentes.
- Recompensa única por linha de cuidado e histórico no save schema 14.
- Conteúdo trilíngue, PWA e rolagem mobile nativa preservados.
- Release gate ampliado para bloquear todo o pacote ambulatorial até revisão independente.

## v0.22.0 — 2026-06-13 11:13:08 BRT
- Centro de Emergência com 9 cenários ABCDE.
- Motor determinístico de deterioração e resposta a ações críticas.
- RCP, SCA, AVC, sepse, anafilaxia, overdose, TEP, asma grave e hipoglicemia.
- Conteúdo trilíngue e governança com fontes oficiais atualizadas.
- Save schema 13, content schema 7, fallback e release gate ampliados.
- Rolagem mobile nativa preservada.

## v0.21.0 — 2026-06-13 10:01:34 BRT

- Exames com estados solicitado, processando, liberado e cancelado.
- Tempos clínicos comprimidos e resultados persistentes no prontuário.
- Reconciliação medicamentosa com seis barreiras obrigatórias.
- Ordens educacionais com dose, via, frequência, duração, alertas e contraindicações.
- Incidentes simulados por indicação incorreta e penalidade auditável.
- Procedimentos com riscos, tentativas e desfechos determinísticos.
- Save schema 12, content schema 6, fallback e release gate ampliados.
- Rolagem vertical por toque preservada.

## v0.20.0 — Anamnese e Exame Físico Avançados + Scroll Mobile — 2026-06-13 09:04:51 BRT

- correção crítica da rolagem vertical por toque no celular;
- remoção do acionamento automático de tela cheia no primeiro gesto;
- `touchmove` permanece passivo e nunca é cancelado;
- `touch-action: pan-y pinch-zoom`, overflow vertical nativo e overscroll restaurados;
- camadas invisíveis deixaram de interceptar gestos;
- preservação da posição da página após ações clínicas;
- registro estruturado com 6 perfis de avaliação clínica;
- 30 perguntas contextuais de anamnese e 24 itens de exame físico;
- conteúdo localizado em PT-BR, inglês e espanhol;
- respostas, achados, justificativas, prioridades e sinais de alarme por caso;
- integração ao prontuário, linha do tempo, tempo clínico e motor fisiológico;
- fallback íntegro, validação antes da ativação e release gate ampliado;
- save schema 11, content schema 5 e service worker atualizados;
- teste de gesto real em Chromium mobile: deslocamento de 0 para 809 px sem fullscreen acidental.

## v0.18.0 — Academia Clínica Introdutória — 2026-06-12 17:15:20 BRT

- Academia trilíngue com 9 módulos e 27 lições.
- Pré-teste diagnóstico sem penalidade.
- Checkpoints sequenciais, progresso persistente e XP concedido uma única vez.
- Caso guiado de dor torácica com cinco decisões e debriefing estruturado.
- Fontes oficiais vinculadas por módulo e aviso educacional permanente.
- Save schema 9 e content schema 3 com fallback integral da Academia.
- Conteúdo continua bloqueado para publicação clínica/comercial até revisão independente.


## v0.17.0 — Governança Médica — 2026-06-12 17:00:59 BRT

- registro central de governança em `data/governance.json`;
- sete fontes oficiais vinculadas aos seis casos clínicos ativos;
- identificação de região, ano, organização e data de verificação de cada fonte;
- status clínico por caso: rascunho, fontes mapeadas, em revisão, aprovado, suspenso ou retirado;
- histórico de alteração, riscos, pendências, responsáveis e datas de revisão;
- aviso educacional trilíngue dentro do atendimento;
- painel de governança nas configurações e resumo na área de aprendizagem;
- exportação do relatório técnico de governança;
- validação automática da vigência das fontes e do agendamento de revisão;
- release gate que encerra com erro enquanto houver caso ativo sem aprovação clínica completa;
- os seis casos permanecem jogáveis apenas no canal de desenvolvimento e não estão liberados para publicação comercial;
- save schema 8, content schema 2 e service worker atualizados para v0.17.0.

## v0.16.0 — Internacionalização PT-BR, English e Español — 2026-06-12 16:40:52 BRT

- interface completa em português do Brasil, inglês e espanhol;
- detecção inicial pelo idioma do navegador e suporte a `?lang=`;
- seletor PT/EN/ES no cabeçalho e nas configurações;
- troca instantânea de idioma sem reiniciar a consulta;
- idioma persistido no save schema 7, com migração da v0.15.0;
- tradução dos 6 casos ativos, 9 especialidades, 6 missões e respostas clínicas;
- 380 entradas de interface, 111 termos clínicos e 46 respostas detalhadas por catálogo traduzido;
- datas e horários formatados por localidade;
- valores internos canônicos preservados para não alterar score, histórico ou save;
- PWA, service worker, testes e build atualizados para v0.16.0.

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
## v0.26.0 — Carreira, Residência e Retenção
- Cinco estágios fictícios de progressão.
- Quatro provas de carreira trilíngues.
- Oito setores hospitalares com desbloqueios.
- Calendário semanal, competências e seis missões.
- Save schema 17 e content schema 10.
