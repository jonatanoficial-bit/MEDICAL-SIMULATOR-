# Checklist de regressão — v0.16.0

## Build e inicialização

- [x] versão 0.16.0 consistente em BUILD, runtime, PWA e service worker;
- [x] save schema 7 consistente;
- [x] inicialização normal e modo seguro preservados;
- [x] carregamento externo, último pacote íntegro e fallback aprovados;
- [x] nenhum recurso crítico ausente no service worker.

## Internacionalização

- [x] PT-BR, EN e ES normalizados corretamente;
- [x] detecção do idioma do navegador;
- [x] parâmetro `?lang=` suportado;
- [x] troca instantânea no cabeçalho;
- [x] troca instantânea nas configurações;
- [x] idioma persistido no save;
- [x] idioma reaplicado após reinício;
- [x] score preservado ao mudar de idioma;
- [x] ações e histórico preservados ao mudar de idioma;
- [x] seis casos ativos traduzidos;
- [x] nove especialidades traduzidas;
- [x] seis missões traduzidas;
- [x] 46 respostas clínicas traduzidas;
- [x] datas e horários localizados.

## Interface e acessibilidade

- [x] setup 360×800 nos três idiomas sem overflow horizontal;
- [x] plantão 360×800 nos três idiomas sem overflow horizontal;
- [x] configurações em EN e ES sem overflow horizontal;
- [x] plantão 1366×768 em EN e ES sem overflow horizontal;
- [x] controles visíveis com mínimo de 48 px;
- [x] alto contraste, tamanhos de texto e redução de movimento preservados;
- [x] navegação por teclado e regiões ARIA preservadas.

## Anti-quebra

- [x] migração da v0.15.0;
- [x] checksum do save;
- [x] gravação transacional;
- [x] cinco backups rotativos;
- [x] recuperação de slot temporário;
- [x] recuperação de conteúdo clínico íntegro;
- [x] watchdog e diagnóstico local preservados.

## Pendências para ambiente físico

- [ ] instalação PWA em Android e iOS;
- [ ] atualização offline entre v0.15.0 e v0.16.0;
- [ ] tela cheia real em navegadores móveis;
- [ ] TalkBack, VoiceOver e NVDA;
- [ ] revisão linguística por falantes nativos;
- [ ] revisão de terminologia por tradutores médicos.
