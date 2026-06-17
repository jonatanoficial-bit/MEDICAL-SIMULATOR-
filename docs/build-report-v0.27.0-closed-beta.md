# Relatório de build — v0.27.0

## Entrega

Canal fechado para testes controlados. A build introduz ferramentas de coleta local, auditoria e triagem sem criar transmissão de dados.

## Componentes novos

- `src/core/beta-observability.js`
- `src/core/beta-self-test.js`
- `src/data/beta-program.js`
- `data/beta-program.json`
- tela Beta no runtime
- scripts `audit-beta` e `audit-beta-runtime`
- auditoria visual `audit:beta-layout`

## Resultado automatizado

A suíte completa passou. O runtime smoke renderizou setup, lobby, carreira, especialidades, plantão, configurações, ambulatório, emergência, Beta e recuperação.

## Resultado visual

Sete perfis foram renderizados em Chromium isolado usando DOM, CSS e i18n de produção. Não houve overflow horizontal ou erro de página. Os gestos móveis deslocaram as páginas e todos os controles mediram pelo menos 48 px.

## Pendências honestas

- nenhuma família da matriz física foi marcada como aprovada;
- PWA HTTPS/offline não foi testada em aparelho físico neste ambiente;
- TalkBack, VoiceOver e NVDA seguem pendentes;
- conteúdo médico continua bloqueado pelo release gate.
## Fechamento de auditoria

- regressão automatizada: aprovada, código 0;
- auditoria visual Beta: aprovada em 7 perfis;
- controles auditados: mínimo de 48 px;
- overflow horizontal: 0 ocorrências;
- recursos PWA: 98 (55 críticos, 18 de dados e 25 opcionais);
- release gate: código 2 esperado;
- matriz física: 0/5 famílias aprovadas;
- Release Candidate: bloqueado até testes físicos e validação médica independente.
