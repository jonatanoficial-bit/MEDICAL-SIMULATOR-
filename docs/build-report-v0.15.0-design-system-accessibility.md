# Build Report — v0.15.0 Design System e Acessibilidade

**Build:** v0.15.0 | build 2026-06-12 16:15:18 BRT  
**Fase:** 6  
**Save schema:** 6  
**Prioridade:** mobile, tablet e desktop

## Objetivo

Padronizar a interface e tornar o simulador utilizável por pessoas com diferentes necessidades de leitura, movimento, contraste e navegação, sem modificar casos clínicos, pontuação ou progressão.

## Implementações

### Preferências persistentes

- texto pequeno, médio, grande e muito grande;
- contraste padrão ou alto;
- redução de movimento;
- foco reforçado;
- descrições textuais compactáveis;
- sons da interface.

As preferências são normalizadas antes do uso, salvas no schema 6 e migradas com o restante da carreira.

### Navegação e leitores de tela

- link “Pular para o conteúdo principal”;
- foco programático no conteúdo após mudança de tela;
- regiões `aria-live` polite e assertive;
- botões selecionáveis com `aria-pressed`;
- abas com `role=tab`, `aria-selected` e navegação por setas/Home/End;
- diálogos com `role=dialog`, `aria-modal` e título associado;
- fechamento de janelas, revisão e menu por Esc;
- atalhos Alt+1 Lobby, Alt+2 Aprendizagem, Alt+3 Plantão, Alt+4 Configurações e Alt+5 Resultados;
- imagens decorativas e informativas com texto alternativo;
- barras de progresso com valores semânticos.

### Design system

- escala de espaçamento;
- superfícies e bordas semânticas;
- raios padronizados;
- foco único e consistente;
- controles com mínimo de 48 px;
- tipografia responsiva;
- estados selecionado, desabilitado, sucesso, aviso e perigo;
- suporte a `forced-colors`.

## Contraste calculado

- texto principal sobre fundo: **19,28:1**;
- texto secundário sobre fundo: **11,73:1**;
- texto de destaque sobre fundo: **14,13:1**;
- texto branco sobre azul do alto contraste: **8,89:1**;
- foco amarelo sobre preto: **16,57:1**.

Essas combinações centrais superam os limiares WCAG AA para texto normal. O jogo ainda requer futura revisão manual completa de todas as imagens e gradientes em contexto real.

## Auditorias

- conteúdo clínico: 6 casos, 9 especialidades e 6 missões;
- carregamento externo, último pacote válido e fallback seguro;
- migração v0.14.0 → schema 6;
- save transacional, checksum e cinco backups;
- runtime smoke de setup, lobby, especialidades, plantão, configurações e recuperação;
- 52 recursos no service worker;
- interface clínica e score oculto preservados;
- auditoria de acessibilidade automatizada;
- DOM real gerado pelo jogo auditado em harness Chromium isolado em 360×800, 768×1024 e 1366×768;
- sem overflow horizontal;
- controle visível mínimo: 48 px;
- foco visível de 4 px;
- redução de movimento confirmada;
- alto contraste e texto de 20 px confirmados no perfil máximo.

## Limitações conhecidas

- o ambiente bloqueia navegação Chromium por localhost/file e captura de screenshot;
- o harness visual utiliza o DOM real gerado pelo runtime com o CSS de produção, mas sem navegação por servidor;
- leitores de tela reais como TalkBack, VoiceOver e NVDA ainda devem ser testados em aparelhos físicos;
- fullscreen, instalação e atualização offline continuam dependendo de validação HTTPS em aparelho real.
