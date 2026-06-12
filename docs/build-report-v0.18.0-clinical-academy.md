# Build Report — v0.18.0 Academia Clínica Introdutória

**Build:** v0.18.0 | build 2026-06-12 17:15:20 BRT  
**Fase:** 9 de 18  
**Save schema:** 9  
**Content schema:** 3  
**Academy schema:** 1  
**Canal:** development

## Escopo entregue

A antiga área de aprendizagem foi substituída por uma Academia Clínica Introdutória completa para jogadores sem formação em saúde. O objetivo é ensinar linguagem, prioridades e limites suficientes para compreender o simulador, sem apresentar o jogo como habilitação profissional ou orientação para casos reais.

### Conteúdo

- 9 módulos sequenciais;
- 27 lições, com 3 lições por módulo;
- cobertura integral em PT-BR, inglês e espanhol;
- pré-teste de 5 questões, sem perda de XP ou bloqueio;
- 9 checkpoints obrigatórios;
- caso guiado de dor torácica aos esforços com 5 decisões;
- debriefing por decisão;
- fontes oficiais vinculadas por módulo;
- avisos de segurança e governança presentes em toda a Academia.

### Progressão

- módulos liberados em sequência;
- lições registradas individualmente;
- checkpoint disponível após as 3 lições do módulo;
- 45 XP por módulo, concedidos apenas uma vez;
- 90 XP pelo caso guiado, concedidos apenas uma vez;
- reinício de testes permitido sem farming de XP;
- progresso persistido e migrado automaticamente no save schema 9.

### Arquitetura e anti-quebra

- `data/academy.json` é a fonte externa de conteúdo;
- `src/data/fallback-academy.js` mantém cópia integral de emergência;
- `src/data/academy-schema.js` rejeita conteúdo incompleto ou incompatível;
- loader, último pacote íntegro e modo seguro incluem a Academia;
- service worker registra os novos recursos;
- valores de progressão são independentes do idioma da interface.

## Fundamentos documentais

A estrutura pedagógica usa segurança do paciente, comunicação estruturada, RCP/ECC, segurança medicamentosa e excelência diagnóstica como referências introdutórias. As fontes estão registradas em `data/governance.json` e resumidas em `docs/source-registry-v0.18.0.md`.

## Auditoria

- 9 módulos validados;
- 27 lições por idioma;
- 5 perguntas no pré-teste;
- 5 decisões no caso guiado;
- progressão completa automatizada: 9/9 checkpoints e 27/27 lições;
- XP máximo auditado: 495, sem duplicação;
- loader externo, último pacote íntegro e fallback aprovados;
- save schema 9 e 5 backups aprovados;
- 60 recursos verificados no service worker;
- interface sem estouro horizontal nos perfis auditados;
- controles com altura mínima de 48 px;
- testes gerais, trilíngues e de acessibilidade aprovados.

## Release gate

O gate encerra com código 2 de forma intencional:

- 0 de 6 casos clinicamente aprovados;
- 6 de 6 casos bloqueados para publicação;
- 9 de 9 módulos da Academia em revisão;
- revisão clínica, terminológica e de segurança independente ainda pendente.

## Limitações conhecidas

- a Academia ainda precisa de revisão por profissionais habilitados e revisores médicos nativos nos três idiomas;
- o caso guiado é educacional e simplificado;
- testes físicos de PWA, offline, fullscreen, TalkBack e VoiceOver dependem de hospedagem HTTPS e aparelhos reais;
- o motor fisiológico dinâmico será desenvolvido na fase seguinte.
