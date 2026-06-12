# Plano de rollback — v0.13.0

1. Preservar o ZIP v0.13.0 e o checksum externo.
2. Exportar o save pelo menu Configurações antes de limpar dados.
3. Não excluir as chaves `medsim-vale-save-v013` nem seus backups.
4. Em falha visual, abrir com `?safe=1` e exportar diagnóstico.
5. Restaurar o ZIP v0.12.0 no servidor sem apagar o cache anterior imediatamente.
6. A v0.12.0 não lê automaticamente a chave v0.13.0; o progresso deve permanecer guardado para retorno à build corrigida.
7. Retornar à v0.13.0 somente após validar abertura, save, plantão e atualização PWA.
