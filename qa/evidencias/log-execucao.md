# Log de execução – Omar-404

Modelo da seção 6 do guia de execução: uma linha por caso e por execução.

- **Ambiente:** banco `omar404_test` (PostgreSQL 16 em Docker, porta 5434), Redis 7 (Docker, base lógica /1), API em `:3000`, frontend em `:5173`. Detalhes em [week5/relatorio-transmissao.md](week5/relatorio-transmissao.md).
- **Massa de dados:** restaurada antes de cada suíte (`reset-test-db.js` + `seed-test.js`). Descrição em [week5/massa-dados.md](week5/massa-dados.md).
- **Commit testado:** `6c7d34f`. O backend, o frontend e o banco são idênticos ao `fbdc93f`.
- **Comparação com o esperado:** feita pelas asserções dos scripts do Jefferson e, nos reprovados, conferida com chamadas manuais à API ([week5/manual/](week5/manual/)).

## Semana 5 – Ciclo 1

| Caso | Data | Executor | Commit testado | Ciclo | Resultado obtido (resumo) | Status | Evidência | Defeito vinculado |
|---|---|---|---|---|---|---|---|---|
| CT01 | 18/11/2026 | Vinícius | 6c7d34f | 1 | Login com credenciais válidas retorna token e dados do usuário (1/1 cenário). | Aprovado | `evidencias/CT01/` | |
| CT02 | 18/11/2026 | Vinícius | 6c7d34f | 1 | As 7 combinações de credenciais inválidas são recusadas (7/7 exemplos). | Aprovado | `evidencias/CT02/` | |
| CT03 | 18/11/2026 | Vinícius | 6c7d34f | 1 | Token válido é aceito. Token expirado, ausente ou com assinatura alterada é recusado (4/4). | Aprovado | `evidencias/CT03/` | |
| CT04 | 18/11/2026 | Vinícius | 6c7d34f | 1 | Login na interface redireciona com credenciais válidas e mantém a tela de login com senha errada (2/2, vídeo). | Aprovado | `evidencias/CT04/` | |
| CT07 | 18/11/2026 | Vinícius | 6c7d34f | 1 | O admin escreve; o operador não escreve e consulta os dados do próprio admin (3/3 cenários). | Aprovado | `evidencias/CT07/` | |
| CT08 | 18/11/2026 | Vinícius | 6c7d34f | 1 | O operador não consulta, não edita e não remove usuários (1/1). | Aprovado | `evidencias/CT08/` | |
| CT09 | 18/11/2026 | Vinícius | 6c7d34f | 1 | `POST /auth/register` sem token e com `perfil: admin` retorna **201** e cria o administrador, que depois faz login (200). Esperado: 401/403. | Reprovado | `evidencias/CT09/` | |
| CT10 | 18/11/2026 | Vinícius | 6c7d34f | 1 | `DELETE /users/:id` retorna **500** (`PublicKeyCredential is not defined`) em (a), (b) e (c), **mas o registro é apagado**: o Admin A removeu o operador do Admin B e o próprio Admin B. Em (d), ID inexistente, retorna 500 em vez de 404. | Reprovado | `evidencias/CT10/` | |
| CT11 | 18/11/2026 | Vinícius | 6c7d34f | 1 | Cada admin e operador vê só os registros do seu admin. O operador órfão recebe erro (5/5). | Aprovado | `evidencias/CT11/` | |
| CT12 | 18/11/2026 | Vinícius | 6c7d34f | 1 | O Admin B recebe 404 ao consultar, alterar ou remover registros do Admin A (1/1). | Aprovado | `evidencias/CT12/` | |
| CT13 | 18/11/2026 | Vinícius | 6c7d34f | 1 | O Admin B cria falecido (**201**) e serviço (**201**) usando cliente e falecido do Admin A. Esperado: 400/403 sem gravar nada. | Reprovado | `evidencias/CT13/` | |
| CT14 | 18/11/2026 | Vinícius | 6c7d34f | 1 | Todas as operações publicam o evento correspondente (1/1). | Aprovado | `evidencias/CT14/` | |
| CT15 | 18/11/2026 | Vinícius | 6c7d34f | 1 | O socket do Admin B recebeu **2** eventos `usuario:logado` gerados pelo Admin A e pelo Operador A1. Esperado: 0. O teste para no primeiro evento, então os demais (`cliente:cadastrado` etc.) não foram verificados. | Reprovado | `evidencias/CT15/` | |
| CT16 | – | Vinícius | – | 1 | Caso manual: precisa de duas janelas e gravação de tela. Ainda não executado. | Pendente | `evidencias/CT16/` | |
| CT24 | 18/11/2026 | Vinícius | 6c7d34f | 1 | (a) e (b) passaram. (c) O Admin C, sem clientes, e (d) o Admin D, sem falecidos, criam o serviço com **201**, usando cliente e falecido do Admin A, sem receber aviso. Esperado: 422 com aviso. | Reprovado | `evidencias/CT24/` | |
| CT25 | 18/11/2026 | Vinícius | 6c7d34f | 1 | Limites -0,01, 0,01, 99.999.999,99 e 100.000.000 corretos. **Valor 0** retorna 400 "Tipo, valor, falecido e cliente são obrigatórios.". Esperado: 201. | Reprovado | `evidencias/CT25/` | |
| CT26 | 18/11/2026 | Vinícius | 6c7d34f | 1 | As transições de status publicam os eventos corretos (1/1). | Aprovado | `evidencias/CT26/` | |
| CT27 | 18/11/2026 | Vinícius | 6c7d34f | 1 | `PUT /servicos/:id` sem o campo `status` retorna 200, mas grava **`status: null`** (antes era `em_andamento`). Esperado: manter `em_andamento`. | Reprovado | `evidencias/CT27/` | |

### Resumo do ciclo 1

| Aprovados | Reprovados | Bloqueados | Pendentes | Total |
|---|---|---|---|---|
| 10 | 7 | 0 | 1 (CT16) | 18 |

### Observações para a análise

- Nas mensagens do Jest com `expect([400, 403]).toContain(status)`, os rótulos aparecem invertidos: o "Expected value" é o status **obtido** e o "Received array" é o **esperado**.
- CT10: a causa provável é a chamada a `PublicKeyCredential(...)` em [usuarioController.js:90](../../backend/controllers/usuarioController.js#L90), que roda depois do `DELETE`. A rota também não confere se o usuário removido é operador do admin logado.
- CT13 e CT24 (c, d) parecem ter a mesma causa: o cadastro não confere se `cliente_id` e `falecido_id` pertencem ao admin logado.
- CT25: o valor 0 é tratado como "campo ausente" pela checagem `!valor` em [Servico.js:5](../../backend/models/Servico.js#L5).
- A suíte unitária (`getAdminId`, `Servico.atualizarStatus`, 7/7) passou, mas não corresponde a nenhum CT.
