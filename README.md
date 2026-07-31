# Medical Simulator — Vale Edition

Versão 1.0.0 de um simulador clínico educacional, trilíngue e instalável como PWA. A experiência reúne carreira, plantões, Academia Clínica, cenários de emergência e seguimento ambulatorial.

> Uso exclusivamente educacional. O conteúdo não substitui avaliação, diagnóstico, tratamento ou treinamento profissional supervisionado.

## Executar localmente

O projeto não exige instalação de dependências. Sirva a pasta por HTTP para habilitar módulos ES e o service worker:

```bash
python -m http.server 8080
```

Abra `http://localhost:8080`. Em celular ou tablet, use o dispositivo na horizontal.

## Verificação

Com Node.js 20 ou superior:

```bash
npm run audit
npm run manifest
npm run verify-manifest
```

A suíte automatizada cobre conteúdo, armazenamento, recuperação, PWA, service worker, acessibilidade, internacionalização e os principais motores de simulação.

## Estrutura

- `index.html`, `manifest.webmanifest` e `sw.js`: entrada e instalação PWA.
- `src/`: aplicação, simulação, persistência, acessibilidade e idiomas.
- `data/` e `content/`: conteúdo clínico estruturado.
- `assets/`: imagens, ícones e áudio local.
- `tests/`: auditorias automatizadas sem dependências externas.
- `tools/`: geração de manifesto, ícones, áudio e verificações de layout.
- `docs/`: auditoria final, testes e preparação para Android.

## Publicação

A distribuição web deve usar HTTPS e servir todos os arquivos preservando seus caminhos relativos. Para Android, consulte `docs/PREPARACAO-PARA-APK-v1.0.0.md`.

Build: `v1.0.0 | build 2026-07-31 16:15:19 BRT`.
