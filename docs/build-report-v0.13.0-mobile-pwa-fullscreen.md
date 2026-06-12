# Relatório de Build — v0.13.0 Mobile, PWA e Tela Cheia

**Build:** v0.13.0 | build 2026-06-12 11:31:30 BRT  
**Fase:** 4 de 18  
**Prioridade:** celular, tablet e PC

## Objetivo

Remover os principais bloqueios de uso no celular sem alterar as regras clínicas existentes. A tela de plantão deixou de depender de uma única página vertical extensa e passou a usar etapas móveis independentes.

## Entregas

- altura dinâmica baseada em `visualViewport`;
- suporte às safe areas de aparelhos com notch e barra gestual;
- sete abas clínicas móveis: Resumo, Anamnese, Exames, Procedimentos, Diagnóstico, Prontuário e Fila;
- dock inferior com acesso ao paciente, fila e finalização;
- HUD mobile compacto;
- build deixa de sobrepor botões no celular;
- perfil e cabeçalho compactados;
- alvos de toque com mínimo planejado de 48 px;
- rolagem reiniciada ao mudar de tela;
- PWA com ícones 192, 512 e versões maskable;
- prompt de instalação quando suportado;
- suporte a fullscreen, standalone e minimal-ui;
- detecção online/offline;
- fallback de navegação offline;
- service worker preserva o cache anterior para rollback;
- migração automática do save v0.12.0 para a chave v0.13.0 e schema 4.

## Limites conhecidos

- navegadores iOS não oferecem a mesma API de prompt de instalação do Chromium; nesses aparelhos a instalação deve ser feita pelo menu Compartilhar > Adicionar à Tela de Início;
- tela cheia real depende de gesto do usuário e das permissões do navegador;
- instalação, atualização e abertura offline ainda precisam ser confirmadas em aparelho físico e hospedagem HTTPS;
- a fase não altera fidelidade clínica, score ou conteúdo médico.

## Critérios de aprovação

- nenhum estouro horizontal nas resoluções-alvo;
- botões principais acessíveis sem ficarem sob a build;
- plantão mobile navegável sem percorrer toda a árvore clínica em uma única rolagem;
- manifesto PWA válido e todos os ícones existentes;
- módulos JavaScript e service worker sem erro de sintaxe;
- auditorias técnicas e manifesto SHA-256 aprovados.
