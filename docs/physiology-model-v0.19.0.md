# Modelo Fisiológico Educacional — v0.20.0

## Escopo

O motor fisiológico v1.0.0 é um sistema **determinístico de simulação educacional**. Ele cria consequência temporal dentro do jogo, mas não é um modelo matemático validado para prever evolução clínica real, risco, mortalidade, dose ou resposta individual.

As mesmas condições iniciais, ações e minutos clínicos produzem o mesmo resultado. Não existe aleatoriedade clínica oculta nesta versão.

## Variáveis simuladas

- pressão arterial sistólica e diastólica;
- frequência cardíaca;
- frequência respiratória;
- temperatura;
- saturação periférica de oxigênio;
- intensidade dos sintomas em escala interna de 0 a 100;
- reserva fisiológica educacional em escala interna de 0 a 100;
- estado: estável, melhorando, atenção ou instável.

As escalas de sintomas e reserva são indicadores próprios do jogo. Elas não equivalem a escores médicos validados.

## Tempo clínico

- 12 segundos reais equivalem a 1 minuto clínico;
- ações possuem custo próprio de tempo;
- ao retornar de uma aba em segundo plano, o avanço automático é limitado a 5 minutos clínicos;
- o save é atualizado periodicamente e após ações importantes;
- a evolução é pausada fora do plantão e quando não há caso ativo.

## Perfis ativos

Existem seis perfis, vinculados aos seis casos ativos:

1. hipertensão em investigação;
2. cefaleia tensional;
3. angina estável;
4. infecção urinária não complicada;
5. refluxo gastroesofágico;
6. dermatite atópica.

Cada perfil define linha de base, curso natural, janela de segurança, limiares, efeitos de ações e regras de desfecho.

## Ações e efeitos

A versão anterior aplicava melhora genérica após qualquer conduta considerada correta. A v0.20.0 substitui isso por efeitos declarados no perfil de cada caso. Uma ação sem efeito fisiológico definido pode continuar sendo registrada no raciocínio e no prontuário, mas não altera artificialmente os sinais vitais.

A retirada posterior de uma seleção não reverte efeitos fisiológicos que já ocorreram, pois o tempo e a intervenção já foram registrados.

## Reavaliação e tendências

O botão Reavaliar consome tempo clínico, registra nova observação, atualiza o prontuário e acrescenta um ponto à tendência. A linha do tempo preserva as avaliações e intervenções realizadas.

## Pontuação

O resultado pode receber de 0 a 15 pontos fisiológicos, de acordo com estabilidade, sintomas, janela de segurança e evolução simulada. Esse componente não substitui os critérios de anamnese, exames, hipóteses e condutas.

## Limitações e trava comercial

- não há farmacocinética ou farmacodinâmica;
- não há cálculo por peso, idade, função renal, gestação ou comorbidades;
- não há modelos probabilísticos ou populacionais;
- não há validação prospectiva;
- casos graves e suporte avançado ainda não fazem parte deste motor;
- os perfis não estão clinicamente aprovados;
- a publicação comercial permanece bloqueada pelo release gate.

Qualquer liberação futura exige responsável clínico, revisão médica independente, revisão terminológica trilíngue, auditoria da segurança da simulação, registro das datas e aprovação explícita.
