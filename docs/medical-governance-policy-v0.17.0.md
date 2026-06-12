# Política de governança médica — v0.17.0

## Objetivo

Impedir que um caso clínico seja tratado como pronto para publicação apenas por funcionar tecnicamente. A aprovação comercial exige rastreabilidade de fontes, revisão humana qualificada, revisão trilíngue e auditoria de segurança da simulação.

## Canais

- **development:** permite casos com fontes mapeadas para desenvolvimento, teste e correção;
- **staging:** reservado para conteúdo em revisão final;
- **release:** exibe somente casos que atendam integralmente ao release gate.

## Requisitos por caso para publicação

1. status `clinically-approved`;
2. `publishable: true`;
3. ao menos uma fonte ativa, vinculada e com vigência verificada;
4. responsável clínico identificado;
5. revisor médico independente identificado;
6. revisores de terminologia para PT-BR, inglês e espanhol;
7. auditor de segurança/QA identificado;
8. datas válidas de revisão clínica, terminológica e de QA;
9. próxima revisão agendada e ainda vigente;
10. ausência de erro estrutural no registro de governança.

## Princípios

- software não concede aprovação médica automática;
- uma fonte não substitui julgamento clínico e adaptação regional;
- conteúdo educacional não equivale a conselho médico;
- divergências de diretrizes devem ser documentadas;
- conteúdo vencido, suspenso ou sem revisor bloqueia publicação;
- alterações após aprovação exigem novo histórico e possível nova revisão.

## Situação da v0.17.0

- casos registrados: 6;
- fontes oficiais registradas: 7;
- casos clinicamente aprovados: 0;
- casos comercialmente publicáveis: 0;
- release clínico: bloqueado intencionalmente.
