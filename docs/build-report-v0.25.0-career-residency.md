# Medical Simulator v0.25.0 — Carreira, Residência e Retenção

## Escopo

Esta fase cria uma progressão fictícia e explicitamente educacional, separada de certificação, residência ou habilitação médica real.

## Entregas

- 5 estágios de carreira: Internato, R1, R2, R3 e Especialista Vale.
- 8 setores hospitalares com desbloqueio progressivo.
- 4 provas trilíngues, com três questões cada e nota mínima crescente.
- Calendário semanal com 7 eventos.
- 6 missões de carreira.
- Competências por área, média, atividades e histórico local.
- Promoções condicionadas a casos, média, Academia, Emergência, Seguimento e prova.
- Recompensa das provas protegida contra duplicação.
- Presença diária protegida contra duplicação na mesma data.
- Integração com casos regulares, emergência e ambulatório.
- Save schema 16 e conteúdo schema 10.
- Atalho PWA para Carreira.
- PT-BR, inglês e espanhol.

## Segurança e limites

A carreira é uma mecânica fictícia do jogo. Nenhum estágio, prova, certificado, título ou competência tem validade acadêmica ou profissional. O release gate mantém o módulo bloqueado para lançamento comercial até revisão de progressão, economia, acessibilidade, retenção e segurança.

## Auditoria visual

Foram inspecionadas sete combinações de tela, idioma e resolução. Em 360×800, as telas de visão geral, residência, hospital, provas e calendário aceitaram gesto vertical nativo sem ativar fullscreen. Não houve estouro horizontal e os controles visíveis mantiveram no mínimo 48 px.

## Resultado técnico

- Registro de carreira válido.
- 5 estágios, 8 setores, 4 provas, 7 eventos e 6 missões.
- Migração de saves anteriores preservada.
- Recompensa de prova concedida somente na primeira aprovação.
- PWA, Academia, fisiologia, terapêutica, emergência, ambulatório, ramificações e acessibilidade preservados.
