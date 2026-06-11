# Relatório de Build — v0.10.0 Recovery Foundation

## Objetivo
Criar uma base confiável para continuar a transformação do Medical Simulator em produto comercial, reduzindo risco de cache antigo, divergência de versão e quebras visuais em mobile.

## Alterações executadas
- Fonte única de versão criada em `BUILD.json`.
- `BUILD.txt` e `VERSAO.txt` atualizados.
- `src/app.js` atualizado para exibir v0.10.0.
- Chave de save migrada para `medsim-vale-save-v010`, com tentativa de leitura do save antigo.
- `sw.js` refeito com cache `medical-simulator-vale-edition-v0-10-0`.
- Service worker passa a usar estratégia network-first para HTML/JS/CSS, reduzindo risco de atualização travada.
- CSS recebeu camada mobile-first de segurança.
- Marcadores visuais antigos de release freeze/gold candidate ocultados.
- Fluxo de especialidade corrigido de forma inicial: ao selecionar uma especialidade, os casos ativos são filtrados por `specialty` quando houver correspondência.

## Auditoria anti-quebra
- Build abre por `index.html`.
- App ativo continua sendo `src/app.js`.
- CSS ativo continua sendo `src/styles.css`.
- Não houve reescrita do gameplay central.
- Arquivos legados foram preservados para rollback, mas não são a entrada ativa.
- Manifesto de hashes regenerado após as alterações.

## Itens ainda pendentes
- Carregamento real dos casos de `data/cases.json`.
- Separação modular do motor.
- Internacionalização PT-BR, EN e ES.
- Tutorial médico completo.
- Simulação fisiológica real.
- Revisão médica dos protocolos.

## Resultado
Build aprovada como fundação de recuperação técnica, não como build comercial final.
