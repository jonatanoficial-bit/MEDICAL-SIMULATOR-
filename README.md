# Medical Simulator — Vale Edition

Build atual: **v0.23.0 | build 2026-06-13 11:57:41 BRT**  
Fase 14: **Pacote Ambulatorial Longitudinal**

## Execução

Hospede a raiz em servidor HTTP/HTTPS e abra `index.html`. Para validar localmente:

```bash
npm run audit
npm run audit:outpatient-layout
npm run release-gate
npm run manifest
npm run verify-manifest
```

`npm run release-gate` deve terminar com código `2` nesta build. Isso é intencional: casos, Academia, fisiologia, avaliação clínica, terapêutica, emergência e ambulatório permanecem no canal de desenvolvimento até revisão independente.

## Centro de Seguimento

- 10 linhas de cuidado longitudinais;
- 15 ações de avaliação, monitorização, comunicação, segurança, adesão e continuidade;
- 3 a 5 consultas simuladas por paciente;
- metas clínicas simuladas e tendência entre retornos;
- adesão, engajamento, sintomas e risco persistentes;
- barreiras sociais e financeiras;
- faltas ao retorno com consequência determinística;
- score, histórico e debriefing;
- recompensa única por linha de cuidado;
- português do Brasil, inglês e espanhol.

Linhas disponíveis: hipertensão, cefaleia tensional, angina estável, retorno de infecção urinária, refluxo, dermatite atópica, diabetes tipo 2, dislipidemia, asma e cuidado longitudinal do peso.

Todo o conteúdo permanece educacional, determinístico e não preditivo. Não substitui consulta, prescrição, protocolo local ou acompanhamento real.

## Rolagem mobile

- fullscreen somente pelo botão explícito;
- rolagem vertical nativa com `pan-y` e pinch zoom;
- nenhum manipulador cancela `touchmove`;
- auditoria por gesto real em 360×800;
- nenhum estouro horizontal;
- controles visíveis com pelo menos 48 px.

## Compatibilidade preservada

- 6 casos clínicos regulares;
- 9 cenários de emergência ABCDE;
- 9 módulos e 27 lições da Academia;
- 6 perfis fisiológicos;
- 13 exames, 14 intervenções e 2 procedimentos;
- save schema 14 e content schema 8;
- gravação transacional, checksum e cinco backups;
- PWA, modo seguro, rollback de cache e três idiomas.

## Situação de publicação

A build é jogável para desenvolvimento e testes. Nenhuma credencial, validação ou aprovação médica é atribuída automaticamente.

## Próxima fase prevista

**v0.24.0 — Casos Ramificados e Dificuldade:** múltiplos desfechos, níveis de dificuldade, dados parcialmente ocultos e redução de exploração por memorização.
