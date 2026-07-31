# Testes realizados — v1.0.0

## Automação

- 34 auditorias Node.js executadas individualmente.
- Verificação de sintaxe dos módulos centrais.
- Validação JSON de build, manifesto PWA, conteúdo e configuração audiovisual.
- Integridade SHA-256 de todos os arquivos da distribuição por `BUILD_MANIFEST.json`.
- Verificação de existência e duplicidade dos recursos do service worker.
- Validação dos nove arquivos WAV e dos cinco ícones PWA.

## Navegador

Fluxo funcional verificado em navegador real: configuração de perfil, menu, escolha de especialidade, abertura de caso e navegação para Anamnese.

Viewports avaliados:

| Viewport | Resultado |
| --- | --- |
| 320 × 568 | Bloqueio de orientação exibido; jogo inacessível atrás da sobreposição |
| 568 × 320 | Configuração, menu, especialidades e plantão utilizáveis |
| 640 × 360 | Sem rolagem horizontal; alvos principais com 44 px |
| 844 × 390 | Sem rolagem horizontal; navegação compacta funcional |
| 932 × 430 | Sem rolagem horizontal; HUD e abas funcionais |
| 768 × 1024 | Bloqueio de orientação em tablet retrato |
| 1024 × 768 | Layout de tablet completo |
| 1366 × 768 | Layout desktop completo |
| 1920 × 1080 | Layout desktop amplo completo |

## Rotação e continuidade

Durante um plantão, a tela foi girada de 568 × 320 para 320 × 568 e de volta sem recarga. A tela `shift`, a aba Anamnese e o estado do caso foram preservados; o overlay foi ocultado automaticamente ao retornar à horizontal.

## Pendências externas

- Matriz de celulares e tablets físicos, incluindo Safari/iOS e Chrome/Android.
- Instalação PWA em origem HTTPS de produção e validação offline após atualização.
- Compilação, assinatura e teste de APK/AAB.
- Testes de leitor de tela em hardware real.
- Revisão clínica independente do conteúdo educacional.
