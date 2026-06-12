# Relatório de Build — v0.14.0

**Produto:** Medical Simulator - Vale Edition  
**Fase:** 5 — Nova Interface Clínica Premium  
**Build:** v0.14.0 | build 2026-06-12 12:36:19 BRT

## Objetivo

Reorganizar o atendimento clínico em um fluxo profissional e progressivo, reduzindo excesso de informação simultânea e protegendo o encerramento da consulta. A lógica clínica, os seis casos ativos, a progressão e o sistema anti-quebra foram preservados.

## Entregas

- painel de comando do paciente com identificação, especialidade, estado, tempo e sinais vitais;
- fluxo visual com cinco etapas documentadas;
- navegação por etapas também no desktop, evitando três blocos de ações empilhados;
- prontuário eletrônico com seis abas: visão geral, anamnese, resultados, hipóteses/plano, sinais vitais e linha do tempo;
- central histórica de exames e procedimentos;
- registro de observações clínicas livres;
- revisão obrigatória antes do encerramento;
- avisos de documentação incompleta;
- pós-consulta com métricas, linha do tempo e recompensas reorganizadas;
- remoção do score previsto durante o atendimento;
- save schema 5 com migração automática da v0.13.0.

## Resultado da auditoria

- 6 casos, 9 especialidades e 6 missões validados;
- conteúdo externo, último pacote íntegro e fallback seguro aprovados;
- gravação transacional, checksum, recuperação e cinco backups aprovados;
- 51 recursos do service worker verificados;
- 5 etapas clínicas e 6 abas do prontuário verificadas;
- nenhuma ocorrência de estouro horizontal em 360×800, 768×1024 e 1366×768;
- nenhuma exceção no harness visual;
- runtime das telas setup, lobby, especialidades, plantão, configurações e recuperação aprovado.

## Limitação do ambiente

A navegação Chromium direta por `localhost` e `file://` foi bloqueada pela política do ambiente. O runtime modular foi testado em harness Node com dados reais, e o DOM/CSS resultante foi inspecionado separadamente em Chromium isolado. Instalação PWA, atualização offline e fullscreen real continuam pendentes de aparelho físico com HTTPS.
