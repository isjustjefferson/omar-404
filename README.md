# Omar-404 — Sistema de Administração de Funerária

## Tecnologias

- **Backend:** Node.js + Express
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT + bcryptjs

---

## Pré-requisitos

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
│   │   └── usuarioController.js
│   ├── middlewares/
│   │   └── auth.js
│   ├── models/
│   │   ├── Usuario.js
│   │   ├── Falecido.js
│   │   ├── Cliente.js
│   │   └── Servico.js
│   ├── views/
│   │   ├── authRoutes.js
│   │   └── usuarioRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── database/
│   ├── schema.sql
│   └── seed.sql
└── README.md
```

---

## Como rodar localmente

### 1. Instalar dependências

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

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

### 5. Rodar o servidor

```bash
cd backend
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Endpoints disponíveis

### Autenticação

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Criar novo usuário |
| POST | `/auth/login` | Login e geração do token JWT |

### Perfil (requer token)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/users/me` | Ver perfil do usuário logado |
| GET | `/users` | Listar todos os usuários |
| PUT | `/users/me` | Atualizar perfil |
| DELETE | `/users/me` | Remover conta |

### Como usar o token

Após o login, inclua o token em todas as requisições protegidas:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

## Criar o primeiro usuário

O seed não cria usuários com senha criptografada. Crie o primeiro admin via API:

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
Após isso, você pode rodar o seed para popular o banco, caso queira.
---

## Observacoes

- Nunca suba o arquivo `.env` para o GitHub — ele está no `.gitignore`
- O `JWT_SECRET` em producao deve ser uma string longa e aleatoria
- Senhas sao armazenadas com hash bcrypt — nunca em texto puro