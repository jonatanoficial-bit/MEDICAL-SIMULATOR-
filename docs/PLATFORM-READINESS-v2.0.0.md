# Preparação para plataformas — v2.0.0

## Estado entregue

O projeto possui uma build web/PWA offline, responsiva e orientada a celular horizontal. O comando `pnpm run build:web` gera a pasta `dist`, que pode ser hospedada ou usada como conteúdo web de um empacotador.

O arquivo `capacitor.config.json` prepara a identificação do aplicativo Android e aponta para `dist`. Nenhum SDK nativo ou credencial de loja é incluído.

## Google Play

Pronto estruturalmente para receber um projeto Android do Capacitor. Antes da publicação ainda são necessários: conta de desenvolvedor, assinatura AAB, política de privacidade em URL HTTPS pública, formulário de conteúdo de saúde, classificação etária, ficha de segurança de dados, testes em aparelhos físicos e revisão médica independente.

O produto deve permanecer classificado como jogo/simulação educacional, não como dispositivo médico. Não habilitar coleta de dados de saúde sem nova análise jurídica e técnica.

## Steam

A build web precisa ser incorporada a um executável desktop assinado, por exemplo com Electron, Tauri ou outra camada nativa, antes do envio ao Steamworks. Também são necessários conta Steamworks, taxa, página da loja, arte nos formatos oficiais, depot, instalador, suporte a controles e testes Windows.

O jogo já inclui navegação por teclado, saves locais, idiomas e recursos de acessibilidade que podem ser declarados na ficha da Steam após validação manual.

## Xbox e Xbox Cloud Gaming

Xbox Cloud Gaming não recebe diretamente uma PWA. É necessário ingressar no programa de publicação Xbox, produzir e certificar uma versão Xbox nativa, implementar os SDKs autorizados, controles completos por gamepad, sistema de conta e requisitos técnicos da Microsoft. Esta entrega preserva a lógica e o conteúdo que podem ser portados, mas não constitui uma build Xbox certificável.

## Outras lojas e web

A pasta `dist` pode ser publicada em hospedagem HTTPS compatível com service worker. Para iOS/App Store, será necessário projeto nativo, assinatura Apple, análise das diretrizes médicas e testes em iPhone/iPad.

## Bloqueios externos obrigatórios

- revisão clínica independente de todos os cenários, medicamentos e textos;
- revisão jurídica e de privacidade nos países de venda;
- localização profissional de textos clínicos e materiais de loja;
- testes físicos de acessibilidade, desempenho, áudio e orientação;
- contas, certificados, taxas e aprovação de cada plataforma;
- endereço público de suporte e política de privacidade hospedada.
