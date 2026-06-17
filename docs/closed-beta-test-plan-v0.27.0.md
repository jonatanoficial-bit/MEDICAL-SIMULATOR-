# Plano do beta fechado — v0.27.0

## Objetivo

Validar estabilidade, rolagem mobile, persistência, PWA, acessibilidade, tradução e clareza dos fluxos antes de uma Release Candidate.

## Matriz obrigatória

- Android + Chrome.
- Android + Samsung Internet.
- iPhone + Safari.
- Windows + Chrome.
- Windows + Edge.

iPad + Safari é recomendado, mas não bloqueia sozinho a RC.

## Fluxo mínimo por aparelho

1. Abrir o jogo sem tela branca.
2. Criar ou carregar personagem.
3. Subir e descer com o dedo/mouse em telas longas.
4. Iniciar e concluir um caso regular.
5. Abrir um cenário de emergência.
6. Abrir um seguimento ambulatorial.
7. Trocar PT-BR/EN/ES.
8. Testar alto contraste e texto muito grande.
9. Fechar, reabrir e confirmar o save.
10. Instalar PWA, abrir offline e atualizar quando aplicável.

## Critérios de bloqueio

- tela branca;
- perda de save;
- rolagem vertical impedida;
- botão essencial inacessível;
- erro que impede concluir um caso;
- PWA que não abre após instalação;
- conteúdo clínico publicado sem aprovação independente.
