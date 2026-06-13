# Plano de Rollback — v0.20.0

## Versão de retorno

**v0.18.0 — Academia Clínica Introdutória**

## Proteções existentes

- chave de save da v0.20.0 separada da chave legada da v0.18.0;
- migração copia dados e não apaga imediatamente a origem;
- cinco backups rotativos com checksum;
- gravação temporária antes da substituição do save principal;
- service worker preserva o cache anterior;
- loader mantém o último pacote de conteúdo validado;
- modo seguro ignora conteúdo externo e service worker quando necessário.

## Procedimento técnico

1. Interromper a distribuição da v0.20.0.
2. Restaurar os arquivos completos da v0.18.0.
3. Publicar novamente o `sw.js` e o manifesto da v0.18.0.
4. Manter a chave de save da v0.20.0 para diagnóstico; não apagá-la automaticamente.
5. Orientar o uso do modo seguro `?safe=1` se houver ciclo de falha.
6. Exportar diagnóstico e save antes de qualquer reparação destrutiva.
7. Confirmar abertura, migração, plantão, Academia e encerramento da consulta.

## Falhas que justificam rollback imediato

- tela branca ou ciclo de inicialização;
- perda ou corrupção de save sem recuperação automática;
- evolução fisiológica fora dos limites validados;
- tempo avançando fora do plantão;
- ação de um caso alterando outro caso;
- incompatibilidade de conteúdo que impeça o carregamento do fallback;
- service worker servindo mistura de versões;
- regressão crítica em mobile ou acessibilidade.

## Recuperação seletiva

Antes do rollback total, a Central de Recuperação permite restaurar backup, limpar apenas dados transitórios, revalidar conteúdo e exportar diagnóstico. A carreira, o XP e as preferências devem ser preservados sempre que possível.
