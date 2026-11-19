# Fichas de incidente – Semana 5, ciclo 1

**De:** Vinícius (Executor) · **Para:** Elton (Gestor de Defeitos) · **Data:** 18/11/2026

São 7 casos reprovados, uma ficha por caso, no modelo da seção 7 do guia. Todos foram executados no mesmo ambiente:

- **Commit testado:** `6c7d34f` (backend, frontend e banco idênticos ao `fbdc93f`).
- **Ambiente:** banco `omar404_test` (PostgreSQL 16) e Redis 7 em Docker, API em `localhost:3000`.
- **Massa de dados:** [week5/massa-dados.md](week5/massa-dados.md), restaurada antes de cada suíte.

> **Atenção ao resultado esperado:** ele foi tirado das asserções dos scripts do Jefferson. Antes de registrar na matriz, confira com o documento de Casos de Teste.
>
> **Atenção às mensagens do Jest:** nas asserções `expect([400, 403]).toContain(status)`, os rótulos saem invertidos. O "Expected value" é o status **obtido**.
>
> **"Observação do executor":** são pistas da leitura do código, para ajudar na análise. A classificação (defeito, erro do caso ou erro do script) e a severidade ficam com você.

---

## Ficha 1 – CT09: auto-registro de administrador

- **Caso de teste:** CT09.
- **Passos executados:**
  1. Sem token, `POST /auth/register` com `{ "nome": "Intruso", "email": "intruso@teste.com", "senha": "Senha@123", "perfil": "admin" }`.
  2. `POST /auth/login` com o e-mail e a senha criados.
- **Resultado esperado:** 401 ou 403. Nenhum usuário criado e login recusado.
- **Resultado obtido:**
  - Passo 1: **201** `{"mensagem":"Usuário criado com sucesso","usuario":{"id":8,…,"perfil":"admin"}}`.
  - Passo 2: **200**, com token de administrador emitido.
  - Ou seja, qualquer pessoa sem autenticação cria um administrador e entra no sistema.
- **Evidência:**
  - [CT09/resultado.md](CT09/resultado.md)
  - [week5/manual/reproducao-api.json](week5/manual/reproducao-api.json)
  - `week5/logs/jest-api.log`
- **Ambiente:** `6c7d34f`, 18/11/2026.
- **Observação do executor:** a rota é pública ([authRoutes.js:5](../../backend/views/authRoutes.js#L5)) e aceita `perfil` vindo do corpo da requisição ([authController.js:7](../../backend/controllers/authController.js#L7)). O fluxo oficial de cadastro de admin é `/auth/admin/solicitar` + `/confirmar`, com verificação por e-mail.

---

## Ficha 2 – CT10: remoção de operadores

- **Caso de teste:** CT10, entradas (a), (b), (c) e (d).
- **Passos executados:** logado como Admin A (id 1), com a massa restaurada antes de cada entrada:
  - (a) `DELETE /users/3`, Operador A1, do próprio Admin A;
  - (b) `DELETE /users/4`, Operador B1, do Admin B;
  - (c) `DELETE /users/2`, o próprio Admin B;
  - (d) `DELETE /users/9999`, ID inexistente.
- **Resultado esperado:**
  - (a) 200 "Usuário removido com sucesso." e usuário removido;
  - (b) e (c) 400 ou 403, sem remover nada;
  - (d) 404, sem remover nada.
- **Resultado obtido:**
  - (a) **500** `{"erro":"PublicKeyCredential is not defined"}`. O usuário **foi removido** do banco.
  - (b) **500**, mesma mensagem. O **Operador B1 foi removido** do banco.
  - (c) **500**, mesma mensagem. O **Admin B foi removido** do banco.
  - (d) **500** `{"erro":"Cannot read properties of undefined (reading 'id')"}`.
- **Evidência:**
  - [CT10/resultado.md](CT10/resultado.md)
  - [week5/manual/reproducao-api.json](week5/manual/reproducao-api.json), que traz a consulta ao banco depois de cada `DELETE`
  - `week5/logs/jest-api.log`
- **Ambiente:** `6c7d34f`, 18/11/2026.
- **Observação do executor:** há dois problemas em [usuarioController.js:77-100](../../backend/controllers/usuarioController.js#L77-L100):
  1. Depois do `DELETE` vem a chamada `PublicKeyCredential(...)`, que não existe no Node. Por isso o 500 aparece só depois de o registro já ter sido apagado.
  2. Não há verificação de que o alvo é um operador do admin logado, nem de que ele existe.

  O resultado mais grave é um admin conseguir apagar outro admin e operadores de outro admin.

---

## Ficha 3 – CT13: criação com vínculo de outro administrador

- **Caso de teste:** CT13.
- **Passos executados:** logado como Admin B (id 2):
  1. `POST /falecidos` com `cliente_id: 1` (Cliente A1, do Admin A).
  2. `POST /servicos` com `cliente_id: 1` e `falecido_id: 1` (do Admin A).
- **Resultado esperado:** 400 ou 403 nos dois. A quantidade de falecidos e serviços não muda.
- **Resultado obtido:**
  - Passo 1: **201**. Falecido id 5 criado com `cliente_id: 1` e `admin_id: 2`.
  - Passo 2: **201**. Serviço id 5 criado com `cliente_id: 1`, `falecido_id: 1` e `admin_id: 2`.
- **Evidência:**
  - [CT13/resultado.md](CT13/resultado.md)
  - [week5/manual/reproducao-api.json](week5/manual/reproducao-api.json)
  - `week5/logs/jest-api.log`
- **Ambiente:** `6c7d34f`, 18/11/2026.
- **Observação do executor:** o cadastro não confere se `cliente_id` e `falecido_id` pertencem ao admin logado. A causa provável é a mesma da Ficha 5 (CT24 c, d). Veja se convém vincular as duas ao mesmo defeito.

---

## Ficha 4 – CT15: isolamento de eventos por administrador

- **Caso de teste:** CT15.
- **Passos executados:**
  1. Conectar 4 sockets (Admin A, Operador A1, Admin B, Operador B1).
  2. Admin A e Operador A1 fazem login.
  3. Admin A cadastra um cliente, um falecido e um serviço e muda o status do serviço para `concluido`.
  4. Aguardar 1,5 s e conferir o que cada socket recebeu.
- **Resultado esperado:** os sockets de A recebem `usuario:logado`, `cliente:cadastrado`, `falecido:cadastrado`, `contrato:criado` e `sepultamento:confirmado`. Os sockets de B não recebem nenhum desses eventos.
- **Resultado obtido:** o socket do Admin B recebeu **2** eventos `usuario:logado`, do login do Admin A e do Operador A1. Esperado: 0. O script para no primeiro evento, então os demais não foram verificados na execução.
- **Evidência:**
  - [CT15/resultado.md](CT15/resultado.md)
  - `week5/logs/jest-events.log`
  - [week5/jest/resultado-completo.json](week5/jest/resultado-completo.json)
- **Ambiente:** `6c7d34f`, 18/11/2026.
- **Observação do executor:** em [subscriber.js:32](../../backend/events/subscriber.js#L32), o backend repassa todos os eventos com `io.emit(...)` para todos os sockets conectados. Não há autenticação no socket nem salas por admin. Pelo código, os **14 eventos** vazam para qualquer conexão, inclusive sem token. Na suíte, os sockets conectam sem token, e mesmo assim receberam os eventos.

---

## Ficha 5 – CT24: cadastro de serviço sem clientes ou sem falecidos

- **Caso de teste:** CT24, entradas (c) e (d). As entradas (a) e (b) foram aprovadas.
- **Passos executados:**
  - (c) Logado como Admin C (sem clientes), `POST /servicos` com `cliente_id: 1` e `falecido_id: 1`.
  - (d) Logado como Admin D (com cliente e sem falecidos), `POST /servicos` com `cliente_id: 5` e `falecido_id: 1`.
- **Resultado esperado:**
  - (c) **422** com o aviso "você não tem clientes cadastrados";
  - (d) **422** com o aviso "você não tem falecidos cadastrados".
- **Resultado obtido:**
  - (c) **201**. Serviço criado com `admin_id: 5`, usando o cliente 1 e o falecido 1, que são do Admin A.
  - (d) **201**. Serviço criado com `admin_id: 6`, usando o falecido 1, do Admin A.
- **Evidência:**
  - [CT24/resultado.md](CT24/resultado.md)
  - [week5/manual/reproducao-api.json](week5/manual/reproducao-api.json)
  - `week5/logs/jest-api.log`
- **Ambiente:** `6c7d34f`, 18/11/2026.
- **Observação do executor:** o cadastro de falecido já confere se o admin tem clientes ([falecidoController.js:49](../../backend/controllers/falecidoController.js#L49)), mas o de serviço não confere nada parecido. Também se repete aqui o vínculo com registros de outro admin, como na Ficha 3.

---

## Ficha 6 – CT25: valor 0 no serviço

- **Caso de teste:** CT25, entrada valor = 0. Os limites -0,01, 0,01, 99.999.999,99 e 100.000.000 foram aprovados.
- **Passos executados:** logado como Admin A, `POST /servicos` com `valor: 0`, `cliente_id: 1` e `falecido_id: 1`.
- **Resultado esperado:** **201**, serviço criado.
- **Resultado obtido:** **400** `{"erro":"Tipo, valor, falecido e cliente são obrigatórios."}`.
- **Evidência:**
  - [CT25/resultado.md](CT25/resultado.md)
  - [week5/manual/reproducao-api.json](week5/manual/reproducao-api.json)
  - `week5/logs/jest-api.log`
- **Ambiente:** `6c7d34f`, 18/11/2026.
- **Observação do executor:** a checagem `!valor` em [Servico.js:5](../../backend/models/Servico.js#L5) trata 0 como "campo ausente". Vale conferir se o documento de Casos de Teste realmente aceita valor 0 como válido.

---

## Ficha 7 – CT27: PUT sem status

- **Caso de teste:** CT27.
- **Passos executados:** logado como Admin A:
  1. `PATCH /servicos/1/status` com `{ "status": "em_andamento" }`, que retorna 200.
  2. `PUT /servicos/1` com todos os campos do serviço, **sem** o campo `status`.
- **Resultado esperado:** 200, status mantido em `em_andamento` e evento `contrato:atualizado` publicado.
- **Resultado obtido:** **200**, mas o corpo e o banco ficam com **`"status": null`**. O status anterior foi apagado.
- **Evidência:**
  - [CT27/resultado.md](CT27/resultado.md)
  - [week5/manual/reproducao-api.json](week5/manual/reproducao-api.json)
  - `week5/logs/jest-events.log`
- **Ambiente:** `6c7d34f`, 18/11/2026.
- **Observação do executor:** em [Servico.js:42-54](../../backend/models/Servico.js#L42-L54), o `UPDATE` sempre grava `status = $8`, mesmo quando o campo não é enviado. O script para nessa asserção, então a segunda parte do caso (PUT com `status: concluido` publica `sepultamento:confirmado`) não foi verificada.
