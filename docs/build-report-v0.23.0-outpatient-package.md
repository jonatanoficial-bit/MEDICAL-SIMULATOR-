# Build Report — v0.23.0

Build: **v0.23.0 | build 2026-06-13 11:57:41 BRT**

## Escopo

A Fase 14 adiciona um Centro de Seguimento independente do plantão e da emergência. O modo longitudinal acompanha o mesmo paciente ao longo de retornos programados, sem utilizar aleatoriedade clínica escondida.

## Conteúdo

- 10 linhas de cuidado;
- 15 ações ambulatoriais;
- 3 a 5 consultas por linha;
- metas, adesão, engajamento, sintomas e risco;
- barreiras de acesso, custo, rotina e estigma;
- ausência ao retorno;
- histórico entre consultas;
- score e debriefing;
- conteúdo em PT-BR, inglês e espanhol.

## Anti-quebra

- save schema 14;
- content schema 8;
- migração da v0.22.0;
- checksum e gravação transacional;
- cinco backups rotativos;
- fallback interno do pacote ambulatorial;
- cache clínico íntegro anterior;
- service worker com cache da versão anterior;
- release gate ampliado.

## Auditoria

- as dez linhas concluíram de forma determinística;
- faltas aumentaram risco em todas as linhas;
- fontes mapeadas foram encontradas no registro de governança;
- recompensa concedida somente uma vez;
- progresso persistido no save schema 14;
- layout aprovado em 360×800, 768×1024 e 1366×768;
- rolagem por gesto real aprovada no catálogo, resumo e plano;
- nenhum estouro horizontal;
- controles com mínimo de 48 px.

## Limites

O pacote é educacional e permanece bloqueado para publicação comercial. Não representa prescrição, previsão clínica, cálculo de risco real nem recomendação individual.
