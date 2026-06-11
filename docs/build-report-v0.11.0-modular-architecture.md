# Relatório de Build — v0.11.0 Arquitetura Modular

**Build:** v0.11.0 | build 2026-06-11 18:42:27 BRT  
**Fase:** 2 de 18 — Arquitetura Modular  
**Prioridade:** mobile, tablet e desktop  
**Status:** aprovada para continuidade do desenvolvimento

## Objetivo da fase

Reduzir o acoplamento do protótipo sem alterar o fluxo jogável principal. A build anterior concentrava versão, save, conteúdo clínico, interface e patches históricos em um único arquivo. Esta fase cria uma base segura para as próximas evoluções: tutorial médico, internacionalização, motor fisiológico e expansão de casos.

## Alterações realizadas

### Núcleo e configuração

- Criado `src/config/build.js` como fonte de versão usada pelo jogo.
- Criado estado padrão independente em `src/core/default-state.js`.
- Criado merge defensivo em `src/core/object.js`.
- Criado armazenamento versionado em `src/core/storage.js`.
- Novo save: `medsim-vale-save-v011`.
- Migração automática das chaves `medsim-vale-save-v010` e `medsim-vale-save-v080`.
- Save schema elevado para 2.

### Conteúdo clínico

- Os seis casos jogáveis foram removidos do `app.js` e transferidos para `data/core-cases.json`.
- Exames, procedimentos, hipóteses, condutas e perguntas foram movidos para `data/gameplay.json`.
- Respostas de anamnese, exames e procedimentos foram movidas para `data/clinical-responses.json`.
- Fila, especialidades e missões agora possuem arquivos próprios.
- Criado `data/content-index.json`.
- Criado schema de validação em `src/data/content-schema.js`.
- Criado loader seguro em `src/data/content-loader.js`.
- Criado fallback integral em `src/data/fallback-content.js`.
- O procedimento “Avaliação dermatológica”, já exigido por um caso, foi incluído no catálogo para eliminar referência quebrada.

### Casos antigos

- Os três casos avançados antigos foram preservados em `data/legacy-cases-v0.8.json`.
- Eles continuam desativados porque usam outro formato de dados e ainda precisam de adaptação e revisão médica.
- `data/cases.json` agora espelha os casos ativos, evitando que um caminho genérico aponte para conteúdo incompatível.

### Interface e fluxo

- Especialidades sem casos ativos não iniciam mais um caso de outra área.
- Essas especialidades aparecem como “Conteúdo em preparação”.
- Perguntas de anamnese passaram a vir do arquivo de gameplay.
- Funções usadas por eventos HTML foram expostas corretamente em `window`, corrigindo falhas silenciosas em botões e seletores.
- A referência global de estado é atualizada após normalização, evitando que eventos HTML operem sobre um objeto de estado antigo.
- Configurações exibem modo do conteúdo, quantidade de casos, save schema e content schema.

### Internacionalização

- Criada fundação em `src/i18n/`.
- Locales registrados: `pt-BR`, `en` e `es`.
- A preferência de idioma passa a ser salva.
- A interface integral ainda permanece em português; a tradução completa está reservada para a fase de internacionalização.

### Legado

- O motor antigo e folhas de estilo antigas foram movidos para `legacy/v0.8-engine/`.
- Esses arquivos não são carregados pelo `index.html`.
- A camada de proteções históricas ativa foi isolada em `src/compat/legacy-guards.js`.

### PWA e cache

- Service worker atualizado para cache `medical-simulator-vale-edition-v0-11-0`.
- Módulos e arquivos JSON críticos foram adicionados ao precache.
- Instalação usa cache individual, impedindo que um único arquivo ausente invalide toda a instalação.
- Código e dados usam estratégia network-first com fallback de cache.
- Imagens e demais assets usam cache-first.

## Auditoria automatizada

### Conteúdo

Resultado:

- 6 casos ativos.
- 9 especialidades cadastradas.
- 6 missões.
- 0 erros de schema.
- 0 avisos de referência cruzada.

### Arquitetura

Resultado:

- 9 módulos obrigatórios localizados.
- Dados clínicos removidos do `app.js`.
- `app.js` reduzido de aproximadamente 55 KB para aproximadamente 31 KB.

### Loader

Resultado:

- 6 de 6 recursos externos carregados em teste controlado.
- Modo retornado: `external`.
- Fallback validado separadamente.

### Save

Resultado:

- Save v0.10.0 migrado para v0.11.0.
- Nome, XP e avatar preservados.
- Save schema 2 confirmado.
- Gravação e leitura posterior confirmadas.

### Renderização

Foi executado um teste headless com bundle de auditoria nas resoluções:

- 360 × 800.
- 768 × 1024.
- 1366 × 768.

Fluxos verificados:

- Criação do personagem.
- Menu.
- Lobby.
- Especialidades.
- Abertura do plantão.
- Pergunta de anamnese.
- Resultado de ECG em modal.
- Configurações.
- Alteração da preferência de idioma.
- Ausência de overflow horizontal.
- Funcionamento do fallback com seis casos.

O ambiente bloqueou navegação headless para `localhost` e `file://` com `ERR_BLOCKED_BY_ADMINISTRATOR`. Por isso, o teste visual utilizou um bundle isolado em `about:blank`; o carregamento externo foi testado separadamente pelo teste automatizado do loader. O service worker deve ser validado novamente em aparelho real ou hospedagem de teste na próxima fase.

## Limitações que permanecem

- A tela de plantão ainda é muito longa em mobile.
- O prontuário ainda não usa abas compactas.
- O motor clínico permanece simplificado.
- O score previsto ainda é visível durante o caso.
- Os seis casos ainda precisam de revisão médica formal.
- EN e ES ainda não traduzem toda a interface.
- Os três casos avançados antigos ainda não foram convertidos.

## Resultado da fase

A build preserva o gameplay existente, elimina dados clínicos embutidos no arquivo principal, cria migração de save, valida conteúdo antes de uso e mantém um fallback integral. A base está pronta para a Fase 3: Anti-quebra 2.0 e observabilidade.
