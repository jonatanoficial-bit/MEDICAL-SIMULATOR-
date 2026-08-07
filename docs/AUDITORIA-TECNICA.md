# Auditoria técnica final — Medical Simulator 2.0

## Projeto

- Nome: Medical Simulator — Vale Edition
- Versão recebida: 1.0.0
- Versão final: 2.0.0
- Build: 20260807_094701_BRT
- Data e hora: 2026-08-07 09:47:01 BRT
- Tecnologia: HTML, CSS, módulos JavaScript, JSON, PWA e armazenamento local; sem framework e sem dependências de execução.
- Plataforma principal: celular horizontal, com adaptação para tablet e desktop.

## Resultado

A aplicação abre e funciona por HTTP, preserva saves compatíveis, instala como PWA, reabre offline e mantém o estado durante a rotação. O pacote contém 43 experiências configuradas: 24 encontros centrais variáveis, nove emergências e dez linhas ambulatoriais, além de nove módulos da Academia Clínica.

## Falhas encontradas

- Os seis casos centrais repetiam o mesmo perfil humano em cada reencontro.
- A carreira media atividades, mas ainda não criava um mundo persistente com consequências, mentoria e especialização.
- Comunicação e confiança do paciente tinham pouco peso percebido no gameplay.
- Faltavam políticas públicas de privacidade, termos educacionais e acessibilidade.
- Não havia saída web de produção nem configuração estrutural de Capacitor.
- A nova Jornada precisava de validação específica nas menores alturas horizontais.
- Os fundos eram solicitados pelo navegador em `/src/assets/...` e retornavam 404, embora auditorias estáticas não detectassem isso.
- A automação visual antiga pressupunha `/usr/bin/chromium` e não executava neste Windows.

## Correções e melhorias

- Criados quatro perfis humanos para cada caso central, com nome, idade, profissão, contexto, confiança e estresse.
- Implementado motor de interação centrada na pessoa e reação dinâmica a entrevista, exames, hipótese, conduta e reavaliação.
- Implementada Jornada com semana, temporada, seis eventos hospitalares, reputação, estresse, legado e cinco competências.
- Adicionados três mentores e quatro especializações desbloqueáveis.
- Casos, emergências e seguimentos agora alimentam a mesma progressão profissional.
- Adicionado impacto da carreira ao debriefing, preservando o motor clínico e os sistemas anteriores.
- Criadas páginas trilíngues de privacidade, termos e acessibilidade e links nas configurações.
- Adicionados `capacitor.config.json`, gerador de `dist/` e textos de loja em PT-BR, inglês e espanhol.
- Corrigida a resolução dos fundos com URL baseada no documento, compatível com hospedagem em subpasta.
- Ajustados alvos de toque da carreira para no mínimo 44 px no celular horizontal.
- Atualizados PWA, cache offline, testes, versão, build e documentação.

## Preservação

- Pasta original: não alterada.
- Cópia de trabalho: isolada.
- Imagens visuais: 31 no original e 31 no pacote.
- Diferenças SHA-256: zero.
- Save schema: mantido em 18 para compatibilidade.
- Sistemas anteriores: carreira, plantão, Academia, emergência, ambulatório, áudio, acessibilidade, recuperação, PWA e persistência preservados.

## Limites honestos

- Os testes de navegador foram realizados por automação no Edge instalado, não em aparelhos físicos.
- Não foram feitos testes reais de loja, assinatura Android, gamepad, Xbox, Steamworks ou certificação de console.
- O conteúdo clínico permanece marcado como não publicável até revisão médica independente. O release gate deve continuar bloqueando alegações de validação clínica.
- A proteção jurídica final, classificação indicativa, direitos territoriais e política comercial dependem de profissionais e contas externas.

## Principais arquivos alterados

- `src/app.js`, `src/styles.css`, `src/config/build.js`, `src/core/default-state.js`
- `src/simulation/commercial-engine.js`
- `privacy.html`, `terms.html`, `accessibility.html`
- `sw.js`, `index.html`, `capacitor.config.json`
- `tools/build-web.mjs`, `tools/audit-career-layout.mjs`, `tools/audit-browser-runtime.mjs`, `tools/verify-assets.mjs`
- `tests/audit-commercial.mjs`, `tests/audit-runtime-smoke.mjs`
- arquivos de build, documentação e materiais de loja.
