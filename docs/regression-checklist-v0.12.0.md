# Checklist de regressão — v0.12.0

## Inicialização

- [x] `index.html` carrega `boot-guard.js` antes de `app.js`.
- [x] Primeira tela renderiza com fallback interno.
- [x] Build v0.12.0 aparece visível.
- [x] Erro de módulo possui tela independente de recuperação.
- [x] Modo `?safe=1` ignora service worker e conteúdo externo.

## Save e recuperação

- [x] Save antigo v0.11.0 migra para schema 3.
- [x] Slot temporário é validado antes do commit.
- [x] Slot temporário válido e mais recente é recuperado após interrupção.
- [x] Slot principal com checksum alterado é rejeitado.
- [x] Backup válido assume quando o slot principal está corrompido.
- [x] A rotação mantém no máximo cinco backups.
- [x] Reset preserva backups.
- [x] Exportação produz envelope identificado.
- [x] Reparação transitória mantém carreira, XP e créditos.

## Conteúdo clínico

- [x] Seis recursos JSON carregam e validam.
- [x] JSON malformado não derruba o validador.
- [x] Último conteúdo válido é restaurado após pacote inválido.
- [x] Fallback interno continua válido.
- [x] Modo seguro carrega seis casos internos.

## Interface

- [x] Setup renderiza.
- [x] Lobby renderiza.
- [x] Especialidades renderizam.
- [x] Plantão renderiza.
- [x] Configurações exibem integridade e backups.
- [x] Central de recuperação renderiza.
- [x] Não há alteração intencional no scoring da v0.11.0.

## Atualização

- [x] Service worker usa cache v0.12.0.
- [x] Arquivos críticos são instalados por `addAll`.
- [x] Cache anterior é mantido.
- [x] Nova versão aguarda `SKIP_WAITING` explícito.
- [x] BUILD.json e módulo ativo são comparados em runtime.

## Testes físicos pendentes

- [ ] Instalação PWA no Android.
- [ ] Atualização v0.11.0 → v0.12.0 em hospedagem real.
- [ ] Abertura offline após instalação.
- [ ] Restauração de backup em navegador mobile real.
- [ ] Validação de safe area em aparelhos com recorte de tela.
