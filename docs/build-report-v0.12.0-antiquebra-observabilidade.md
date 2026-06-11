# Relatório de Build — v0.12.0 Anti-quebra 2.0 e Observabilidade

**Produto:** Medical Simulator - Vale Edition  
**Build:** v0.12.0 | build 2026-06-11 19:01:22 BRT  
**Fase:** 3 de 18 — Anti-quebra 2.0 e observabilidade  
**Prioridade:** mobile, tablet e PC  
**Save schema:** 3  
**Content schema:** 1

## Objetivo da fase

Transformar a proteção básica da v0.11.0 em uma camada de continuidade operacional. Esta fase não altera o balanceamento clínico nem adiciona novos casos. Ela reduz o risco de perda de progresso, tela branca, conteúdo corrompido e atualização incompleta.

## Implementações concluídas

### 1. Save transacional

O save principal `medsim-vale-save-v012` não é mais sobrescrito diretamente. O fluxo agora é:

1. Normalização do estado.
2. Criação de envelope com metadados e checksum.
3. Gravação no slot temporário `medsim-vale-save-v012-pending`.
4. Leitura e validação do slot temporário.
5. Commit no slot principal.
6. Nova leitura e validação do slot principal.
7. Remoção do slot temporário somente após confirmação.

Se a execução for interrompida entre as etapas 3 e 5, o jogo identifica o slot temporário mais novo e o promove automaticamente na próxima abertura.

### 2. Integridade e migração

- Envelope de save identificado por `vale-medical-save`.
- Checksum FNV-1a de 32 bits sobre serialização estável.
- Migração automática das chaves v0.11.0, v0.10.0 e v0.8.0.
- Saves antigos em JSON simples são convertidos para o envelope da v0.12.0.
- Save principal corrompido é isolado; o jogo procura slot temporário, backup e chave anterior válida.
- Reset remove somente o slot principal e mantém backups.

O checksum não é uma assinatura criptográfica. Sua finalidade é detectar truncamento, alteração acidental e gravação incompleta no armazenamento local.

### 3. Backups rotativos

- Até cinco backups locais por perfil.
- Backup automático limitado por intervalo para evitar desgaste e consumo excessivo.
- Backup forçado antes de reset, restauração ou recuperação crítica.
- Informações exibidas na Central de Recuperação: personagem, data, nível, XP e tela salva.
- Restauração seletiva de qualquer backup válido.

### 4. Watchdog de inicialização

O arquivo `src/core/boot-guard.js` é carregado antes do módulo principal.

Proteções:

- Tempo limite de 12 segundos para a primeira renderização.
- Registro da etapa de inicialização.
- Contagem de aberturas consecutivas sem conclusão.
- Tela de recuperação independente do `app.js`.
- Abertura por `?safe=1`.
- Opção de limpar somente service worker e caches, preservando o save.

### 5. Central de Recuperação

Foi adicionada uma tela interna acessível pelas configurações ou pelo modo de segurança.

Ações disponíveis:

- Reparar somente sessão, prontuário transitório, popup e ações atuais.
- Preservar nome, carreira, XP, créditos, missões e casos concluídos.
- Criar backup manual.
- Restaurar backup selecionado.
- Exportar save protegido.
- Exportar diagnóstico técnico.
- Resetar apenas o slot principal.

### 6. Observabilidade local

- Log limitado aos 80 eventos mais recentes.
- Categorias: boot, storage, content, integrity, update, runtime, promise e recovery.
- Níveis: informação, aviso e erro.
- Ambiente exportado: build, navegador, idioma, conectividade e viewport.
- Nenhum conteúdo clínico digitado pelo jogador é coletado externamente.
- Os registros permanecem somente no dispositivo até exportação manual.

### 7. Conteúdo clínico protegido

O loader agora possui:

- Timeout de 5 segundos por recurso.
- Uma nova tentativa automática.
- Validação completa antes da ativação.
- Cache local do último pacote clínico aprovado.
- Rejeição de estrutura JSON malformada sem lançar erro fatal.
- Fallback interno integral.
- Modo seguro que ignora arquivos externos.

Ordem de recuperação:

1. Conteúdo externo validado.
2. Conteúdo híbrido validado.
3. Último pacote local validado.
4. Fallback interno empacotado.

### 8. Atualização e service worker

- Cache ativo: `medical-simulator-vale-edition-v0-12-0`.
- Instalação só é aprovada após todos os arquivos críticos entrarem no cache.
- Arquivos opcionais podem falhar sem impedir a aplicação de abrir.
- O cache imediatamente anterior é mantido para rollback offline.
- Nova versão aguarda comando explícito antes de assumir o controle.
- Navegação offline usa `index.html` do cache atual ou anterior.
- Verificação em runtime compara `src/config/build.js` com `BUILD.json`.

## Arquivos principais adicionados

- `src/core/checksum.js`
- `src/core/diagnostics.js`
- `src/core/boot-guard.js`
- `src/core/runtime-health.js`
- `src/core/sw-manager.js`
- `tests/audit-diagnostics.mjs`
- `tests/audit-build-consistency.mjs`
- `tests/audit-antibreak.mjs`
- `tests/audit-runtime-smoke.mjs`

## Auditoria automatizada

Todos os testes de `npm run audit` foram aprovados.

| Grupo | Resultado |
|---|---:|
| Casos clínicos | 6 válidos |
| Especialidades | 9 válidas |
| Missões | 6 válidas |
| Recursos externos do loader | 6 de 6 |
| Recuperação last-known-good | Aprovada |
| Modo seguro de conteúdo | Aprovado |
| Migração de save | Aprovada |
| Recuperação de pending interrompido | Aprovada |
| Corrupção simulada do slot principal | Recuperada |
| Backups rotativos | Limitados a 5 |
| Coerência de versão | 7 de 7 verificações |
| Asserções anti-quebra | 21 aprovadas |
| Renderização isolada | setup, lobby, especialidades, plantão, configurações e recuperação |

## Auditoria de regressão

- Gameplay clínico existente preservado.
- Seis casos ativos continuam disponíveis.
- Especialidades continuam filtrando casos.
- Build permanece visível.
- Fallback interno abre a tela inicial sem conteúdo externo.
- Save antigo preserva nome, avatar e XP.
- Central de recuperação não apaga carreira ao reparar a sessão.
- Nenhum arquivo legado voltou ao caminho de execução principal.

## Limitações conhecidas

- A instalação real da PWA, troca entre caches e comportamento offline dependem de hospedagem HTTP/HTTPS e ainda precisam de confirmação em aparelho físico.
- O Chromium headless disponível no ambiente de construção não concluiu o teste por servidor local; por isso, a interface foi auditada por runtime DOM isolado, validação estrutural e testes de módulos.
- Os casos clínicos ainda não foram submetidos à governança médica da Fase 8.
- O tutorial clínico completo será implementado na Fase 9.
- O motor fisiológico real será implementado na Fase 10.

## Status da fase

**APROVADA para continuidade do desenvolvimento.**

A v0.12.0 deve ser usada como nova base técnica. A próxima fase não deve remover a gravação transacional, a rotação de backups, o watchdog ou a retenção do cache anterior.
