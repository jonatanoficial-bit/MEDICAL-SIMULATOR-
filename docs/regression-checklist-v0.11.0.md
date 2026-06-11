# Checklist de regressão — v0.11.0

## Inicialização

- [x] `index.html` referencia somente o motor ativo.
- [x] `src/app.js` passa no teste de sintaxe.
- [x] Todos os módulos passam no teste de sintaxe.
- [x] Fallback inicia com seis casos.
- [x] Loader externo retorna seis casos.
- [x] Falha em JSON não causa tela branca.

## Save

- [x] Save v0.10.0 é localizado.
- [x] Save é migrado para `medsim-vale-save-v011`.
- [x] XP e personagem são preservados.
- [x] Save schema 2 é gravado.
- [x] Backup é criado antes de reset manual.

## Gameplay

- [x] Setup abre.
- [x] Personagem pode ser criado.
- [x] Menu abre.
- [x] Lobby abre.
- [x] Clínica Médica abre casos clínicos.
- [x] Cardiologia e Dermatologia mantêm seus próprios casos.
- [x] Especialidade sem caso não abre caso incorreto.
- [x] Perguntas retornam resposta.
- [x] Exames abrem modal.
- [x] Procedimentos registram prontuário.
- [x] Pós-consulta continua acessível.

## Interface

- [x] Sem overflow horizontal em 360 × 800.
- [x] Sem overflow horizontal em 768 × 1024.
- [x] Sem overflow horizontal em 1366 × 768.
- [x] Build permanece visível.
- [x] Configurações exibem diagnóstico do conteúdo.
- [x] Preferência PT-BR, EN e ES pode ser salva.

## Conteúdo

- [x] IDs de casos são únicos.
- [x] Especialidades referenciadas existem.
- [x] Exames corretos existem no catálogo.
- [x] Procedimentos corretos existem no catálogo.
- [x] Condutas corretas existem no catálogo.
- [x] Casos legados estão isolados e desativados.

## Pendente para aparelho real

- [ ] Instalação PWA Android.
- [ ] Atualização do service worker sobre v0.10.0.
- [ ] Teste offline completo.
- [ ] Full screen real após gesto do usuário.
- [ ] Retorno do app após alternar para outro aplicativo.
