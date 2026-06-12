# Medical Simulator - Vale Edition

Build atual: **v0.15.0 | build 2026-06-12 16:15:18 BRT**  
Fase 6: **Design System e Acessibilidade**

## Execução

Hospede a raiz em um servidor HTTP/HTTPS e abra `index.html`. Para validar localmente:

```bash
npm run audit
npm run manifest
npm run verify-manifest
```

## Evoluções desta fase

- design system com tokens de espaço, superfícies, bordas, foco e controles;
- quatro tamanhos de texto: pequeno, médio, grande e muito grande;
- alto contraste aplicável em tempo real;
- redução de movimento manual e respeito a `prefers-reduced-motion`;
- foco visível reforçado para teclado e controles;
- skip link para o conteúdo principal;
- regiões de anúncio para leitores de tela;
- diálogos com semântica, rótulos e fechamento por Esc;
- navegação por setas entre abas;
- atalhos Alt+1 a Alt+5;
- suporte a Windows Forced Colors;
- alvos de toque com mínimo de 48 px;
- preferências preservadas no save schema 6;
- migração automática da v0.14.0.

## Garantias anti-quebra

A build preserva gravação transacional, checksum, cinco backups rotativos, watchdog de inicialização, fallback clínico, service worker com cache anterior e manifesto SHA-256.
