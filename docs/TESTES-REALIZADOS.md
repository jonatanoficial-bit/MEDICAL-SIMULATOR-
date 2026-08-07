# Testes realizados — v2.0.0

## Suíte automatizada

O comando `npm run audit` cobre conteúdo comercial, beta local preservado, apresentação, áudio, carreira, ramificações, ambulatório, emergência, governança, Academia, fisiologia, avaliação clínica, terapêutica, toque, arquitetura, carregamento, armazenamento, diagnóstico, consistência de build, recuperação, runtime, service worker, PWA, interface clínica, acessibilidade e internacionalização.

Resultado final: aprovado. O bloqueio de publicação clínica não é uma falha; é uma proteção deliberada enquanto a revisão independente estiver pendente.

## Navegador real

Execução por servidor HTTP efêmero no Microsoft Edge instalado:

- inicialização real e criação de perfil;
- abertura da Jornada;
- carregamento de imagens e fundos sem 404;
- zero erro de página e zero erro de console;
- rotação de 844×390 para 390×844 e retorno;
- overlay de rotação visível, aplicação inerte e estado da carreira preservado;
- retorno ao horizontal sem recarga forçada e sem overflow lateral;
- nova abertura offline após o servidor HTTP ser desligado, atendida pelo service worker.

## Matriz responsiva da Jornada

Renderização no Edge, nos idiomas PT-BR, inglês e espanhol, sem overflow horizontal, sem erro de página e com controles mínimos de 44 px no mobile:

- Mobile horizontal: 568×320, 640×360, 667×375, 740×360, 780×360, 812×375, 844×390, 852×393, 896×414, 915×412, 932×430 e 960×432.
- Tablet/desktop: 768×1024, 1024×600, 1024×768, 1180×820, 1280×720, 1280×800, 1366×768, 1440×900, 1600×900, 1920×1080 e 2560×1440.
- Retrato de controle: 390×844, com aviso de rotação.

Relatórios: `audit-career-layout-v2.0.0.json` e `audit-browser-runtime-v2.0.0.json`.

## Integridade e distribuição

- 31 imagens comparadas com o original por SHA-256; zero diferenças.
- Build web gerada em `dist/`.
- Manifesto SHA-256 regenerado e verificado.
- ZIP aberto, enumerado e reextraído para auditoria final.

## Não realizado

- aparelhos físicos, teclado virtual de um sistema móvel real, notch físico e consumo de bateria;
- assinatura AAB/APK e submissão à Play Store;
- wrapper desktop, Steamworks e gamepad;
- Xbox/GDK e certificação xCloud;
- revisão clínica e jurídica independente.
