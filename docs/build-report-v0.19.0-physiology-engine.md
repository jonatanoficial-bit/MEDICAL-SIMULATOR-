# Relatório de Build — v0.20.0 Motor Fisiológico Determinístico

**Build:** v0.20.0 | build 2026-06-13 09:04:51 BRT  
**Fase:** 10  
**Save schema:** 10  
**Content schema:** 4  
**Physiology schema:** 1  
**Engine:** 1.0.0  
**Canal:** desenvolvimento

## Objetivo

Introduzir tempo clínico, evolução própria por caso e resposta específica às ações, eliminando a regra antiga em que qualquer conduta correta melhorava genericamente frequência cardíaca e saturação.

## Entregas

- registro `data/physiology.json` com seis perfis;
- fallback integral em `src/data/fallback-physiology.js`;
- motor modular em `src/simulation/physiology-engine.js`;
- validação do registro antes da ativação;
- carregamento externo, último pacote íntegro e fallback seguro;
- tempo clínico contínuo com limite de recuperação em segundo plano;
- custo de tempo por pergunta, exame, procedimento, hipótese, conduta, anotação e reavaliação;
- deterioração e janela de segurança específicas de cada caso;
- resposta específica por ação compatível com o perfil;
- sinais vitais, sintomas, reserva e estado dinâmicos;
- reavaliação com prontuário, linha do tempo e tendência;
- componente fisiológico no score final;
- debriefing de evolução no pós-consulta;
- traduções PT-BR, inglês e espanhol;
- migração dos saves da v0.18.0;
- service worker atualizado para 63 recursos.

## Resultado dos testes automatizados

- 6 casos, 9 especialidades e 6 missões válidos;
- 6/6 perfis fisiológicos válidos;
- determinismo confirmado em todos os perfis;
- atraso de 45 minutos no caso de angina alterou o estado para atenção;
- tendências e pontuação fisiológica dentro dos limites;
- runtime integrado iniciou sessão, aplicou ação e registrou reavaliação;
- loader aprovado em modo externo, último conteúdo íntegro e fallback seguro;
- save schema 10, checksum, gravação transacional e cinco backups aprovados;
- 63 recursos do service worker validados: 37 críticos, 10 de dados e 16 opcionais;
- interface clínica, PWA, acessibilidade e internacionalização aprovadas;
- nenhum estouro horizontal na auditoria visual;
- controles visíveis com mínimo de 48 px após a correção do botão Reavaliar.

O registro integral dos testes está em `docs/test-results-v0.20.0.txt`.

## Inspeção visual

Foram auditadas telas de criação, plantão e configurações em PT-BR, inglês e espanhol, nas resoluções 360×800 e 1366×768. Também foram avaliados alto contraste, texto muito grande, teclado, modais e tablet 768×1024.

Arquivos:

- `docs/i18n-layout-v0.20.0.json`;
- `docs/accessibility-layout-v0.20.0.json`;
- `docs/screenshots-v0.20.0/`.

## Limitações conhecidas

- modelo educacional, não preditivo e não validado clinicamente;
- sem dose, farmacocinética, interações ou cálculo por peso;
- sem probabilidades clínicas reais;
- casos avançados continuam desativados;
- validação em aparelhos físicos, PWA offline e tela cheia ainda depende de hospedagem HTTPS;
- revisão médica e terminológica independente pendente.

## Release gate

A publicação é bloqueada intencionalmente porque:

- 0/6 casos estão clinicamente aprovados;
- a Academia permanece em revisão;
- 0/6 perfis fisiológicos estão liberados para publicação;
- responsáveis, revisores e datas de aprovação ainda não foram registrados.

O relatório está em `docs/release-gate-v0.20.0.json` e a saída do comando em `docs/release-gate-console-v0.20.0.txt`.
