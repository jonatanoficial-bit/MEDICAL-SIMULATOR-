# Build Report — v0.16.0 Internacionalização Trilíngue

**Build:** v0.16.0 | build 2026-06-12 16:40:52 BRT  
**Fase:** 7  
**Save schema:** 7  
**Idiomas:** Português do Brasil, English e Español  
**Prioridade:** mobile, tablet e desktop

## Objetivo

Transformar a infraestrutura inicial de idiomas em internacionalização funcional, cobrindo interface, casos clínicos, especialidades, missões e respostas do atendimento sem modificar a lógica de score, a progressão ou o conteúdo canônico salvo.

## Arquitetura de idioma

- `src/i18n/catalogs.js`: catálogos PT-BR, EN e ES;
- `src/i18n/index.js`: normalização, detecção, tradução, formatação e aplicação no DOM;
- valores internos da gameplay permanecem canônicos em PT-BR;
- a camada de apresentação traduz valores e textos no momento da renderização;
- mudança de idioma não recria a consulta nem altera escolhas já registradas;
- idioma salvo no perfil e reaplicado na inicialização;
- primeiro acesso detecta o idioma do navegador;
- parâmetro de URL `?lang=` permite forçar o idioma suportado.

## Cobertura implementada

Por catálogo traduzido:

- 380 entradas de interface;
- 111 termos clínicos e gerais;
- 46 respostas clínicas detalhadas.

Conteúdo ativo coberto:

- 6 casos clínicos;
- 9 especialidades;
- 6 missões;
- exames, procedimentos, hipóteses, condutas, perguntas, queixas, profissões, estados clínicos e títulos de carreira usados pela build.

## Experiência do usuário

- seletor compacto PT/EN/ES no cabeçalho;
- seletor completo nas configurações;
- troca ao vivo sem recarregar a página;
- atributos `lang` e marcadores de localidade atualizados;
- título do documento localizado;
- datas e horários formatados com `Intl`;
- mensagens de erro, recuperação e notificações traduzidas;
- acessibilidade, foco, contraste, texto ampliado e redução de movimento preservados.

## Proteção da gameplay

A internacionalização não grava traduções como novos identificadores de regras. Diagnósticos, condutas, missões e ações continuam usando os valores canônicos já esperados pelo motor. Isso evita:

- mudança de score ao trocar de idioma;
- incompatibilidade de saves;
- duplicação de escolhas no prontuário;
- quebra de casos por diferenças linguísticas;
- necessidade de três motores clínicos separados.

## Auditorias

- suíte técnica integral aprovada;
- migração v0.15.0 → schema 7 aprovada;
- save transacional, checksum e cinco backups preservados;
- 53 recursos verificados no service worker;
- 30 recursos críticos, 7 clínicos e 16 opcionais;
- todos os termos canônicos ativos cobertos em inglês e espanhol;
- todas as 46 respostas clínicas cobertas nos dois idiomas traduzidos;
- troca ao vivo e preservação dos valores canônicos validadas;
- visual auditado com DOM de produção, CSS de produção e catálogos reais em Chromium isolado;
- sem estouro horizontal em 360×800 e 1366×768;
- controles visíveis com mínimo de 48 px;
- nenhum erro de página no harness trilíngue.

## Limitações conhecidas

- a política do ambiente bloqueou navegação automatizada por `localhost` e `file://`;
- a inspeção visual utilizou DOM real gerado pelo jogo, CSS de produção e catálogos reais em Chromium isolado;
- instalação PWA, atualização offline, fullscreen e leitores de tela reais ainda precisam de validação em aparelhos físicos e hospedagem HTTPS;
- as traduções são editoriais e funcionais, mas ainda não foram certificadas por tradutores médicos nem por revisores clínicos nativos;
- nomes próprios de pacientes permanecem iguais em todos os idiomas por decisão de design;
- protocolos e fontes médicas serão tratados na fase de governança médica.
