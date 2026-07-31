# Auditoria técnica final — v1.0.0

Data: 31 de julho de 2026, fuso America/Sao_Paulo.

## Escopo

Auditoria da aplicação web/PWA completa, incluindo HTML, CSS, JavaScript modular, persistência local, conteúdo estruturado, recursos visuais e sonoros, service worker, manifesto, responsividade e interface pública.

## Principais problemas encontrados e correções

1. O modo retrato permanecia interativo. Foi criado um bloqueio visual profissional em tela inteira, com detecção por viewport e toque, acessibilidade por diálogo e retorno automático ao jogo após a rotação.
2. A rotação não suspendia todos os sistemas. Relógios de fisiologia e emergência e a apresentação sonora agora pausam em retrato ou quando a página fica oculta e retomam sem recarregar nem avançar tempo indevidamente.
3. A configuração inicial e o menu não cabiam em 568 × 320. Ambos foram reconstruídos para paisagem compacta, com controles de 44 px, áreas seguras e sem rolagem da página.
4. O menu lateral móvel era deslocado pelo fluxo da grade. A gaveta agora é fixa, sobreposta e acompanhada por sombra clicável.
5. A interface expunha recursos de testes e termos de desenvolvimento. A navegação pública, configurações, recuperação e textos de aprendizagem foram simplificados para uma apresentação comercial.
6. O manifesto permitia qualquer orientação e referenciava ícones ausentes. A orientação passou a ser `landscape` e foram gerados cinco ícones PWA válidos, incluindo variantes maskable e Apple Touch.
7. Nove arquivos de áudio declarados não existiam. Foram produzidos WAV PCM locais para efeitos e ambientes, com fallback seguro e preferências de volume.
8. Vinte testes calculavam o caminho raiz incorretamente no Windows. A normalização foi corrigida.
9. O modo de recuperação exibia mensagens internas e o erro bruto. A tela agora preserva o progresso e apresenta ações claras, sem informações técnicas.

## Arquitetura e robustez

- Aplicação estática, sem backend obrigatório ou dependências de produção.
- Estado persistido localmente com backup, checksum, migração de schema e recuperação.
- Conteúdo clínico validado por schemas internos e fallbacks locais.
- Service worker com cache versionado e tratamento de falha crítica.
- PWA instalável em HTTPS ou localhost, com modo fullscreen/standalone.
- Internacionalização em português, inglês e espanhol.
- Modo de movimento reduzido, contraste, descrições, foco visível e regiões de anúncio.

## Limites honestos

A auditoria não substitui homologação em aparelhos físicos, assinatura de APK/AAB, revisão de loja, teste de distribuição HTTPS real nem validação médica independente. O produto é um simulador educacional e não deve orientar decisões clínicas reais.
