# Build Report — v0.22.0

Build: **v0.22.0 | build 2026-06-13 11:13:08 BRT**

## Escopo
- Centro de Emergência independente com 9 cenários críticos.
- Fluxo ABCDE, cronômetro clínico contínuo e deterioração determinística.
- RCP, SCA, AVC, sepse, anafilaxia, overdose, TEP, asma grave e hipoglicemia.
- Conteúdo PT-BR, inglês e espanhol.
- Rolagem mobile nativa preservada.
- Release gate ampliado para bloquear o pacote até revisão independente.

## Limites
O conteúdo é educacional, não substitui treinamento certificado ou protocolos locais e não está aprovado para publicação comercial.

## Resultado de auditoria
- 9/9 cenários estabilizam com sua sequência esperada.
- 9/9 cenários deterioram após ultrapassar a janela crítica.
- 34 ações e 5 etapas ABCDE validadas.
- PT-BR, inglês e espanhol sem estouro horizontal nas resoluções auditadas.
- Rolagem por gesto real aprovada em 360×800.
- Alvos de toque visíveis com mínimo de 48 px.
- Release gate encerra intencionalmente com código 2.

## Testes físicos pendentes
Instalação PWA, cache offline, tela cheia, TalkBack, VoiceOver e desempenho térmico ainda dependem de hospedagem HTTPS e aparelhos reais.
