# PREPARAÇÃO PARA APK — v2.0.0

## Pronto estruturalmente

- aplicação estática sem servidor de aplicação e sem dependência de `localhost`;
- caminhos relativos e fundos compatíveis com subpasta;
- `manifest.webmanifest` com orientação landscape;
- PWA e service worker com funcionamento offline;
- ícones, favicon, safe areas, `dvh`, toque, pausa por orientação e retomada;
- salvamento local versionado, backup e recuperação;
- saída web em `dist/`;
- `capacitor.config.json` apontando para `dist`.

## Fluxo recomendado

Capacitor é a opção mais direta para Android porque permite empacotar a distribuição web e, posteriormente, acrescentar integrações nativas. Antes de inicializar o projeto Android:

1. instalar Node.js, Android Studio, JDK e dependências atuais do Capacitor;
2. executar `npm run build:web`;
3. instalar e inicializar Capacitor em ambiente de desenvolvimento controlado;
4. adicionar Android, sincronizar `dist/` e configurar orientação landscape;
5. gerar ícones/splash nativos, testar WebView e ciclo de vida;
6. criar keystore, assinar AAB e validar em aparelhos reais;
7. preencher Data Safety, classificação indicativa, ficha da loja e política de privacidade;
8. executar testes internos e fechados antes de produção.

## Permissões

A versão atual não necessita câmera, microfone, localização, contatos ou arquivos. Mantenha permissões mínimas. Qualquer futura telemetria, conta ou nuvem exigirá consentimento, segurança, política de retenção e revisão da declaração da loja.

## Pendências obrigatórias

- revisão clínica independente e aprovação documentada do conteúdo;
- revisão jurídica e de privacidade nos países de distribuição;
- testes em Android de entrada, intermediário e topo de linha;
- teste de teclado virtual, áudio, suspensão, baixo armazenamento e atualização;
- assinatura, AAB, conta de desenvolvedor e processo de loja.

Estruturalmente preparado não significa APK já compilado, assinado ou aprovado pela Play Store.
