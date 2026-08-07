# Medical Simulator — Vale Edition 2.0

Simulador clínico educacional, trilíngue e instalável como PWA. A edição 2.0 combina casos clínicos, pacientes variáveis, carreira dinâmica, emergências ABCDE, acompanhamento ambulatorial e Academia Clínica.

> Uso exclusivamente educacional. Não substitui avaliação, diagnóstico, tratamento, treinamento supervisionado nem certificação profissional.

## Conteúdo

- 24 encontros centrais variáveis, distribuídos em seis casos-base.
- Nove emergências, dez linhas de seguimento e nove módulos de aprendizagem.
- 43 experiências clínicas configuradas no total.
- Quatro níveis de dificuldade e decisões clínicas ramificadas.
- Carreira com cinco competências, reputação hospitalar, estresse, mentores, eventos semanais e especializações.
- Confiança, estresse e reação do paciente influenciados pela comunicação.
- Português do Brasil, inglês e espanhol.
- PWA offline, salvamento local com backups, acessibilidade e experiência mobile horizontal.

## Executar

O projeto não exige instalação de pacotes. Sirva a pasta por HTTP:

```bash
python -m http.server 8080
```

Abra `http://localhost:8080`. Em celular, use o aparelho na horizontal.

## Verificar e gerar a distribuição web

Com Node.js 20 ou superior:

```bash
npm run audit
npm run build:web
npm run manifest
npm run verify-manifest
```

A saída web fica em `dist/`. O arquivo `capacitor.config.json` aponta para essa pasta para futura criação do projeto Android.

## Publicação responsável

A estrutura web/PWA está pronta para hospedagem HTTPS. A publicação comercial do conteúdo médico continua condicionada a revisão clínica independente, revisão jurídica e testes em aparelhos físicos. Steam, Play Store e Xbox Cloud Gaming também exigem contas, empacotamento, assinatura e certificações próprias; consulte `docs/PLATFORM-READINESS-v2.0.0.md`.

Build: `v2.0.0 | build 2026-08-07 09:47:01 BRT`.
