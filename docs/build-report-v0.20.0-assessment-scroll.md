# Build Report — v0.20.0

## Identificação

- Produto: Medical Simulator — Vale Edition
- Fase: 11 — Anamnese e Exame Físico Avançados + correção de rolagem mobile
- Build: `v0.20.0 | build 2026-06-13 09:04:51 BRT`
- Save schema: 11
- Content schema: 5
- Canal: desenvolvimento

## Correção crítica de rolagem mobile

A investigação encontrou duas causas prováveis para o bloqueio percebido no celular:

1. o primeiro gesto global podia solicitar fullscreen, interferindo com a primeira tentativa de rolagem;
2. o documento utilizava uma política de overscroll restritiva, inadequada para páginas clínicas longas.

Correções aplicadas:

- remoção do fullscreen automático por gesto global;
- fullscreen mantido apenas no botão explícito;
- `touch-action: pan-y pinch-zoom` no documento;
- `overflow-y: auto` e altura automática;
- `overscroll-behavior-y: auto`;
- listeners de toque passivos;
- nenhuma chamada a `preventDefault()` em `touchmove`;
- camadas invisíveis com `pointer-events: none`;
- posição vertical preservada depois de registrar ações clínicas;
- remoção do `scrollIntoView()` que podia reposicionar a tela contra a intenção do usuário.

### Teste de gesto real

Em Chromium configurado como aparelho móvel 360 × 800, um gesto CDP de toque foi aplicado sobre o DOM produzido pelo jogo:

- Anamnese: documento com 2.170 px; `scrollY` mudou de 0 para 909 px;
- Exame físico: documento com 1.711 px; `scrollY` mudou de 0 para 525 px;
- fullscreen permaneceu desativado;
- largura do documento permaneceu em 360 px;
- o listener registrou o gesto sem cancelamento.

Resultados completos: `docs/touch-scroll-production-dom-v0.20.0.json`.

## Avaliação clínica estruturada

Foi criado um registro externo e validado em `data/assessment.json`:

- 6 perfis, um por caso ativo;
- 30 perguntas contextuais de anamnese;
- 24 itens de exame físico;
- localização em PT-BR, inglês e espanhol;
- resposta ou achado específico por caso;
- justificativa educacional;
- prioridade;
- domínio clínico;
- sinalização de segurança e sinais de alarme;
- vínculo canônico com ações já reconhecidas pelo score.

### Integração ao gameplay

- perguntas e exames físicos consomem tempo clínico;
- cada ação entra no prontuário e na linha do tempo;
- achados permanecem documentados e não são apagados ao trocar de tela;
- o motor fisiológico recebe o avanço temporal correspondente;
- o save preserva o progresso da avaliação;
- recompensas e score continuam usando valores canônicos, evitando quebra dos saves anteriores.

## Anti-quebra

- validação do registro antes da ativação;
- fallback interno completo;
- último conteúdo íntegro preservado;
- migração para save schema 11;
- gravação transacional, checksum e cinco backups;
- service worker atualizado;
- release gate ampliado para incluir avaliação clínica;
- publicação bloqueada até revisão clínica, terminológica e de segurança independente.

## Limitações declaradas

- o conteúdo permanece educacional e de desenvolvimento;
- não substitui exame presencial, atendimento, treinamento supervisionado ou julgamento profissional;
- a validação visual usou Chromium isolado porque a política do ambiente bloqueia navegação direta por `localhost`;
- testes físicos ainda são necessários em Android e iOS para confirmar comportamento em navegadores e fabricantes específicos.
