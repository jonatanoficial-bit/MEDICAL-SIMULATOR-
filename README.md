# Medical Simulator - Vale Edition

**Build ativa:** v0.12.0 | build 2026-06-11 19:01:22 BRT  
**Fase:** Anti-quebra 2.0 e Observabilidade

## Como executar

Hospede a pasta em um servidor HTTP/HTTPS, como GitHub Pages. A abertura direta por `file://` mantém o fallback interno, mas PWA, service worker e carregamento externo de JSON dependem de hospedagem.

## Arquitetura ativa

- `src/app.js`: composição da interface e fluxo atual.
- `src/config/`: versão e caminhos.
- `src/core/`: estado padrão, merge e armazenamento versionado.
- `src/data/`: carregador, schema e fallback anti-quebra.
- `src/i18n/`: fundação para PT-BR, EN e ES.
- `src/compat/`: proteções históricas isoladas do núcleo.
- `data/`: casos, catálogos, fila, missões e respostas clínicas.
- `legacy/`: motor anterior arquivado; não é carregado.

## Conteúdo clínico

A build mantém os seis casos jogáveis anteriores. Três casos avançados antigos estão preservados em `data/legacy-cases-v0.8.json`, mas permanecem desativados até adaptação ao schema atual e revisão médica.

## Auditoria

Execute:

```bash
npm run audit
npm run manifest
```

Consulte `docs/build-report-v0.12.0-antiquebra-observabilidade.md` para o relatório integral.
