# Medical Simulator — Vale Edition

Build atual: **v0.18.0 | build 2026-06-12 17:15:20 BRT**  
Fase 9: **Academia Clínica Introdutória trilíngue**

## Execução

Hospede a raiz em um servidor HTTP/HTTPS e abra `index.html`. Para validar localmente:

```bash
npm run audit
python tools/audit_academy_layout.py
npm run audit:i18n-layout
python tools/audit_accessibility_layout.py
npm run release-gate
npm run manifest
npm run verify-manifest
```

`npm run release-gate` deve terminar com código 2 nesta build. Isso é intencional: os seis casos e os nove módulos educacionais continuam no canal de desenvolvimento até revisão clínica, terminológica e de segurança independente.

## Academia Clínica

- 9 módulos sequenciais;
- 27 lições em PT-BR, inglês e espanhol;
- pré-teste de 5 perguntas sem penalidade;
- checkpoint ao fim de cada módulo;
- 1 caso guiado com 5 decisões e debriefing;
- progresso persistente no save schema 9;
- XP concedido uma única vez por módulo e pelo caso guiado;
- fontes oficiais vinculadas a cada módulo;
- aviso permanente de que o conteúdo não substitui formação, certificação ou atendimento real.

## Módulos

1. Segurança, limites e papel do simulador.
2. Avaliação inicial, estabilidade e prioridade.
3. Sinais vitais, contexto e tendência.
4. Anamnese, comunicação e sinais de alarme.
5. Exame físico e limitações da simulação.
6. Exames complementares, probabilidade e incerteza.
7. Segurança medicamentosa e reavaliação.
8. Mapa introdutório dos protocolos do jogo.
9. Raciocínio guiado e debriefing.

## Garantias anti-quebra

A build preserva gravação transacional, checksum, cinco backups rotativos, recuperação de escrita pendente, watchdog de inicialização, fallback integral da Academia, último pacote de conteúdo íntegro, cache anterior do service worker, acessibilidade, internacionalização trilíngue e manifesto SHA-256.

## Situação clínica

A Academia e os seis casos ativos estão disponíveis apenas para desenvolvimento e testes. Nenhum conteúdo foi marcado como clinicamente aprovado ou liberado para publicação comercial. Credenciais ou aprovações médicas não são atribuídas automaticamente.

## Próxima fase prevista

**v0.19.0 — Motor Fisiológico:** tempo clínico contínuo, deterioração baseada no caso, resposta a intervenções, monitorização e desfechos, preservando a governança e o tutorial já construídos.
