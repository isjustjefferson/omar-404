# BACKEND Omar-404 

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=ffffff)
![Bcrypt](https://img.shields.io/badge/Bcrypt-563D7C?style=for-the-badge&logo=lock&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

## Tecnologias

- **Backend:** Node.js + Express
- **Banco de dados:** PostgreSQL
- **Autenticaçaão:** JWT + bcryptjs
- **Pub/Sub:** Redis + Socket.io

---

## Pré-requisitos

- [Node.js v18+](https://nodejs.org)
- [PostgreSQL v14+](https://www.postgresql.org/download/)
- [Redis](https://redis.io/downloads/)
- [Git](https://git-scm.com)

---

## Como rodar localmente

### 1. Rodar o Redis:

```bash
sudo service redis-server start  
```
> Para instalar o Redis no WSL, rode: `sudo apt install redis-server`.

### 2. Em outro terminal, instalar dependencias:

```bash
cd backend
npm install
```

### 3. Configurar variaveis de ambiente

```bash
cp .env.example .env
```

Preencha o `.env` com seus dados:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=omar404
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

JWT_SECRET=um_segredo_longo_e_aleatorio

REDIS_URL=redis://seu_host_redis:6379
```

### 4. Criar o banco de dados

```bash
psql -U postgres
```

```sql
CREATE DATABASE omar404 ENCODING 'UTF8' LC_COLLATE 'Portuguese_Brazil.1252' LC_CTYPE 'Portuguese_Brazil.1252' TEMPLATE template0;
\q
```

> **Linux/macOS:** use `pt_BR.UTF-8` no lugar de `Portuguese_Brazil.1252`

### 5. Executar o schema e o seed

```bash
psql -U postgres -d omar404 -f database/schema.sql
psql -U postgres -d omar404 -f database/seed.sql
```

> **Atencao:** o seed nao insere usuarios, pois as senhas precisam ser criptografadas.
> Crie o primeiro usuario via `/auth/register` conforme explicado abaixo.

### 6. Rodar o servidor

```bash
cd backend
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)


---

## Criar o primeiro usuario

```
POST http://localhost:3000/auth/register
Content-Type: application/json

{
  "nome": "Admin",
  "email": "admin@omar404.com",
  "senha": "sua_senha",
  "perfil": "admin"
}
```

---

## Endpoints disponiveis

### Autenticacao

| Metodo | Rota | Descricao |
|--------|------|-----------|
| POST | `/auth/register` | Criar novo usuario |
| POST | `/auth/login` | Login e geracao do token JWT |

### Perfil (requer token)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/users/me` | Ver perfil do usuario logado |
| GET | `/users` | Listar todos os usuarios |
| PUT | `/users/me` | Atualizar perfil |
| DELETE | `/users/me` | Remover conta |

### Falecidos (requer token)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/falecidos` | Listar todos os falecidos |
| GET | `/falecidos/:id` | Buscar falecido por ID |
| POST | `/falecidos` | Cadastrar novo falecido |
| PUT | `/falecidos/:id` | Atualizar falecido |
| DELETE | `/falecidos/:id` | Remover falecido |

### Clientes (requer token)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/clientes` | Listar todos os clientes |
| GET | `/clientes/:id` | Buscar cliente com falecidos vinculados |
| POST | `/clientes` | Cadastrar novo cliente |
| PUT | `/clientes/:id` | Atualizar cliente |
| DELETE | `/clientes/:id` | Remover cliente |

### Servicos (requer token)

| Metodo | Rota | Descricao |
|--------|------|-----------|
| GET | `/servicos` | Listar todos os serviços |
| GET | `/servicos/:id` | Buscar serviço por ID |
| POST | `/servicos` | Cadastrar novo serviço |
| PUT | `/servicos/:id` | Atualizar serviço |
| PATCH | `/servicos/:id/status` | Atualizar status do serviço |
| DELETE | `/clientes/:id` | Remover serviço |

### Como usar o token

Apos o login, inclua o token em todas as requisicoes protegidas:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

No Postman: aba **Authorization** -> **Bearer Token** -> cole o token.

---

## Exemplos de uso no Postman

### Login

```
POST http://localhost:3000/auth/login

{
  "email": "admin@omar404.com",
  "senha": "sua_senha"
}
```

### Cadastrar cliente

```
POST http://localhost:3000/clientes

{
  "nome": "Pedro Costa",
  "cpf": "999.888.777-66",
  "telefone": "(81) 99999-0003",
  "email": "pedro@email.com"
}
```

> **Atencao:** o CPF deve estar no formato `000.000.000-00` e ser unico no sistema.
> O comportamento do axios não está adequado, será corrigido no futuro.

### Buscar cliente com falecidos vinculados

```
GET http://localhost:3000/clientes/1
```

Retorna o cliente e todos os falecidos vinculados a ele:

```json
{
  "id": 1,
  "nome": "Maria Silva",
  "cpf": "111.222.333-44",
  "falecidos": [
    {
      "id": 3,
      "nome": "Carlos Oliveira",
      "data_falecimento": "2024-03-20"
    }
  ]
}
```

### Atualizar cliente

```
PUT http://localhost:3000/clientes/1

{
  "nome": "Maria Silva Santos",
  "telefone": "(81) 98888-0001",
  "email": "maria.nova@email.com"
}
```

> **Atencao:** o CPF nao pode ser alterado pelo PUT — apenas nome, telefone e email.

### Deletar cliente

```
DELETE http://localhost:3000/clientes/1
```

> Se o cliente tiver falecidos vinculados, o sistema bloqueia a exclusao automaticamente
> e retorna um erro explicativo.

### Cadastrar falecido

```
POST http://localhost:3000/falecidos

{
  "nome": "Carlos Oliveira",
  "data_nascimento": "1950-05-10",
  "data_falecimento": "2024-03-20",
  "causa_morte": "Causas naturais",
  "cliente_id": 1
}
```

> **Atencao:** o `cliente_id` precisa existir na tabela `clientes`.
> Use `SELECT id, nome FROM clientes;` no psql para ver os IDs disponiveis.

> No terminal, deve aparecer algo como:
> ```bash
> Evento publicado: falecido:cadastrado ...
> Evento recebido - falecido:cadastrado: ...
> ```

### Cadastrar servico
```
POST http://localhost:3000/servicos

{
  "tipo": "Velorio",
  "descricao": "Sala standard 12h",
  "valor": 1500.00,
  "data_velorio": "2024-03-21 08:00:00",
  "data_sepultamento": "2024-03-21 16:00:00",
  "falecido_id": 1,
  "cliente_id": 1
}
```

> No terminal, deve aparecer algo como:
> ```bash
> Evento publicado: contrato:criado ...
> Evento recebido - contrato:criado: ...
> ```

### Atualizar apenas o status do servico

```
PATCH http://localhost:3000/servicos/1/status

{
  "status": "concluido"
}
```
> Status válidos: `pendente`, `em_andamento`, `concluido`, `cancelado`.

> No terminal, deve aparecer algo como:
> ```bash
> Evento publicado: sepultamento:confirmado ...
> Evento recebido - sepultamento:confirmado: ...
> ```

---

## Resetar dados do banco (obrigatório)

Se quiser limpar os dados e reiniciar os IDs do zero:

```bash
psql -U postgres -d omar404
```

```sql
TRUNCATE TABLE servicos, falecidos, clientes RESTART IDENTITY CASCADE;
\q
```

Depois rode o seed novamente:

```bash
psql -U postgres -d omar404 -f database/seed.sql
```

---

## Observacoes

- Nunca suba o arquivo `.env` para o GitHub — ele esta no `.gitignore`
- O `JWT_SECRET` em producao deve ser uma string longa e aleatória
- Senhas sao armazenadas com hash bcrypt — nunca em texto puro
- O token JWT expira em 8h — apos isso e necessario fazer login novamente
- O CPF deve estar no formato `000.000.000-00` e ser validado pela Brasil API
- Clientes com falecidos vinculados nao podem ser removidos
- IDs no PostgreSQL não reiniciam automaticamente ao recriar registros — isso é comportamento normal
- Todo serviço precisa de um `falecido_id` e `cliente_id` existentes no banco.
- A ordem dos logs do Pub/Sub pode variar - isso é um comportamento normal do Node.js.
