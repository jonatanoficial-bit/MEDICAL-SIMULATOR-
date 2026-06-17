# Medical Simulator — Vale Edition

**Versão:** v0.27.0  
**Build:** 2026-06-17 10:43:42 BRT  
**Canal:** Beta fechado  
**Fase 18:** Auditoria final e preparação para Release Candidate

## Execução

Hospede a raiz em servidor HTTP/HTTPS e abra `index.html`. Para PWA, cache offline e tela cheia instalável, use HTTPS.

```bash
npm run audit
npm run audit:beta-layout
npm run release-gate
npm run manifest
npm run verify-manifest
```

`npm run release-gate` deve terminar com código `2`. Isso é intencional: a matriz física ainda está pendente e o conteúdo médico não possui aprovação clínica independente.

## Centro Beta Fechado

A nova área `Beta` oferece:

- auditoria interna com 12 verificações;
- checklist manual de 10 fluxos essenciais;
- matriz de 6 famílias de aparelhos/navegadores;
- relatório de falha exportado em JSON;
- telemetria local opcional e desativada por padrão;
- no máximo 25 sessões locais;
- remoção de nome e texto livre dos eventos automáticos;
- exportação exclusivamente manual;
- nenhum endpoint de transmissão.

## Compatibilidade preservada

- 6 casos clínicos regulares;
- 9 cenários de emergência ABCDE;
- 10 linhas de cuidado ambulatorial;
- 9 módulos e 27 lições da Academia;
- 6 perfis fisiológicos;
- 30 perguntas de anamnese e 24 itens de exame físico;
- 13 exames, 14 intervenções e 2 procedimentos;
- 4 níveis de dificuldade e 6 perfis ramificados;
- 5 estágios de carreira, 8 setores e 4 provas;
- PT-BR, inglês e espanhol;
- acessibilidade, PWA, áudio adaptativo e assets com fallback.

## Rolagem mobile

- `touch-action: pan-y pinch-zoom`;
- nenhum cancelamento de `touchmove`;
- fullscreen somente por botão explícito;
- sem estouro horizontal nos perfis auditados;
- controles visíveis com mínimo de 48 px.

## Schemas

- Save schema: 18.
- Content schema: 12.
- Presentation schema: 1.
- Beta schema: 1.

## Situação de lançamento

A build está pronta para distribuição a um grupo controlado de testadores, mas **não está pronta para publicação comercial nem para Release Candidate**. Permanecem obrigatórios:

- testes físicos em Android, iPhone, tablet e PC;
- instalação e atualização PWA em HTTPS;
- teste offline real;
- TalkBack, VoiceOver e NVDA;
- sessões prolongadas;
- revisão médica, farmacêutica e terminológica independente.
