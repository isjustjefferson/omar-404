# Omar-404 — Sistema de Administração de Funerária

## Tecnologias

- **Backend:** Node.js + Express
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT + bcryptjs

---

## Pre-requisitos

- [Node.js v18+](https://nodejs.org)
- [PostgreSQL v14+](https://www.postgresql.org/download/)
- [Git](https://git-scm.com)

---

## Estrutura do projeto

```
omar-404/
├── frontend/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── usuarioController.js
│   │   └── falecidoController.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Falecido.js
│   │   ├── Cliente.js
│   │   └── Servico.js
│   ├── views/
│   │   ├── authRoutes.js
│   │   ├── usuarioRoutes.js
│   │   └── falecidoRoutes.js
│   ├── index.js
│   ├── package.json
│   └── .env.example
├── database/
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

---

## Como rodar localmente

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Configurar variaveis de ambiente

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
```

### 3. Criar o banco de dados

```bash
psql -U postgres
```

```sql
CREATE DATABASE omar404 ENCODING 'UTF8' LC_COLLATE 'Portuguese_Brazil.1252' LC_CTYPE 'Portuguese_Brazil.1252' TEMPLATE template0;
\q
```

> **Linux/macOS:** use `pt_BR.UTF-8` no lugar de `Portuguese_Brazil.1252`

### 4. Executar o schema e o seed

```bash
psql -U postgres -d omar404 -f database/schema.sql
psql -U postgres -d omar404 -f database/seed.sql
```

> **Atencao:** o seed nao insere usuarios, pois as senhas precisam ser criptografadas.
> Crie o primeiro usuario via `/auth/register` conforme explicado abaixo.

### 5. Rodar o servidor

```bash
cd backend
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Criar o primeiro usuario

O seed nao cria usuarios com senha criptografada. Crie o primeiro admin via API:

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

### Atualizar falecido

```
PUT http://localhost:3000/falecidos/1

{
  "nome": "Carlos Oliveira",
  "data_nascimento": "1950-05-10",
  "data_falecimento": "2024-03-20",
  "causa_morte": "Insuficiencia cardiaca",
  "cliente_id": 1
}
```

### Deletar falecido

```
DELETE http://localhost:3000/falecidos/1
```

---

## Resetar dados do banco (opcional)

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
- O `JWT_SECRET` em producao deve ser uma string longa e aleatoria
- Senhas sao armazenadas com hash bcrypt — nunca em texto puro
- O token JWT expira em 24h — apos isso e necessario fazer login novamente
- O `cliente_id` ao cadastrar um falecido deve ser um ID existente na tabela `clientes`
- IDs no PostgreSQL nao reiniciam automaticamente ao recriar registros — isso e comportamento normal