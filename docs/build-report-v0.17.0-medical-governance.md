# Build Report — v0.17.0 Governança Médica

**Build:** v0.17.0 | build 2026-06-12 17:00:59 BRT  
**Save schema:** 8  
**Content schema:** 2  
**Canal clínico:** development

## Escopo entregue

- registro de fontes e governança carregado junto ao conteúdo clínico;
- validação estrutural antes da ativação dos casos;
- fallback interno também contém governança;
- aviso educacional por idioma no atendimento;
- badge de status clínico por paciente;
- painel de fontes, riscos e pendências nas configurações;
- resumo do release gate em aprendizagem;
- exportação do relatório completo em JSON;
- cache clínico atualizado para envelope schema 2;
- release gate executável por `npm run release-gate`.

## Resultado da governança

- 6 casos registrados;
- 7 fontes ativas;
- 6 casos em `reference-mapped`;
- 0 casos em `clinically-approved`;
- 0 casos publicáveis;
- 6 casos bloqueados para release comercial.

## Decisão de segurança

A build permanece jogável para desenvolvimento. O bloqueio comercial é deliberado e só poderá ser removido após revisão humana documentada. Nenhum nome de revisor foi inventado e nenhuma aprovação foi presumida.
