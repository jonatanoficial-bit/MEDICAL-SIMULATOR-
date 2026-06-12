# Checklist de regressão — v0.17.0

## Build e integridade

- [x] versão 0.17.0 coerente em runtime, PWA, conteúdo e service worker;
- [x] save schema 8 e content schema 2;
- [x] manifesto SHA-256 regenerável;
- [x] ZIP descompactável;
- [x] rollback para cache anterior preservado.

## Conteúdo e governança

- [x] sete fontes carregadas;
- [x] seis casos registrados;
- [x] todos os casos possuem fontes vinculadas;
- [x] URLs exigem HTTPS;
- [x] datas de verificação das fontes são validadas;
- [x] conteúdo sem governança é rejeitado;
- [x] caso não aprovado continua jogável somente em development;
- [x] caso não aprovado é bloqueado em release;
- [x] relatório de bloqueios é gerado;
- [x] nenhum caso foi marcado como aprovado automaticamente.

## Regressão funcional

- [x] loader externo;
- [x] último pacote íntegro;
- [x] fallback seguro;
- [x] migração do save anterior;
- [x] cinco backups rotativos;
- [x] PWA e cache crítico;
- [x] interface clínica premium;
- [x] acessibilidade;
- [x] PT-BR, inglês e espanhol;
- [x] runtime inicial e principais telas.

## Testes físicos ainda pendentes

- [ ] TalkBack em Android;
- [ ] VoiceOver em iOS;
- [ ] instalação e atualização PWA em HTTPS;
- [ ] funcionamento offline em aparelho real;
- [ ] tela cheia real em Android/iOS;
- [ ] revisão clínica humana e trilíngue.
