# BACKEND Omar-404 

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=ffffff)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)

## Tecnologias

- **Runtime:** Node.js + Express
- **Banco de dados:** PostgreSQL
- **Autenticaçaão:** JWT + bcryptjs
- **Pub/Sub:** Redis + Socket.io
- **Email:** Nodemailer
- **Validação de CPF:** Validado matematicamente no modelo

---
## Estrutura de arquivos

```yaml
backend/
├── config/
│   ├── db.js                        — conexão com o PostgreSQL
│   └── mailer.js                    — configuração do Nodemailer
├── controllers/
│   ├── adminRegisterController.js   — cadastro de admin com verificação de e-mail
│   ├── authController.js            — login, registro e cadastro de operadores
│   ├── clienteController.js         — CRUD de clientes
│   ├── falecidoController.js        — CRUD de falecidos
│   ├── servicoController.js         — CRUD de servicos e atualização de status
│   └── usuarioController.js         — perfil, listagem e remoção de operadores
├── events/
│   ├── publisher.js                 — publica eventos no Redis
│   └── subscriber.js                — escuta eventos e emite via Socket.io
├── middlewares/
│   ├── auth.js                      — verifica e decodifica o token JWT
│   └── perfil.js                    — restringe rotas ao perfil admin
├── models/
│   ├── Cliente.js                   — queries de clientes com validação de CPF
│   ├── Falecido.js                  — queries de falecidos
│   ├── Servico.js                   — queries de servicos/contratos
│   └── Usuario.js                   — queries de usuarios
├── utils/
│   └── getAdminId.js                — resolve o admin_id para admin e operador
├── views/
│   ├── adminRegisterRoutes.js       — rotas de cadastro de admin
│   ├── authRoutes.js                — rotas de autenticação
│   ├── clienteRoutes.js             — rotas de clientes
│   ├── falecidoRoutes.js            — rotas de falecidos
│   ├── servicoRoutes.js             — rotas de servicos
│   └── usuarioRoutes.js             — rotas de usuarios e operadores
├── .env.example
├── index.js                         — entry point, configuração do Express e Socket.io
└── package.json
```

---

## Pré-requisitos

- [Node.js v18+](https://nodejs.org)
- [PostgreSQL v14+](https://www.postgresql.org/download/)
- [Redis](https://redis.io/downloads/) (via WSL no Windows)
- [Git](https://git-scm.com)

---

## Como rodar localmente

### 1. Iniciar o Redis
#### Windows (WSL): 
```bash
wsl
sudo service redis-server start
redis-cli ping  # deve retornar PONG
```
#### Linux/macOS: 
```bash
sudo service redis-server start
redis-cli ping  # deve retornar PONG
```
> Para instalar o Redis no WSL, rode: `sudo apt install redis-server`.

### 2. Instalar dependências

```bash
cd backend
npm install
```

### 3. Configurar variáveis de ambiente

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

EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app_gmail
EMAIL_FROM=Omar-404 <seu_email@gmail.com>
```
> Para o `EMAIL_PASS`, use uma **senha de app** do Gmail: Google Account > Seguranca > Verificacao em duas etapas > Senhas de app.

### 4. Criar o banco de dados
```bash
psql -U postgres
```
```sql
CREATE DATABASE omar404 ENCODING 'UTF8' LC_COLLATE 'Portuguese_Brazil.1252' LC_CTYPE 'Portuguese_Brazil.1252' TEMPLATE template0;
\q
```
> **Linux/macOS:** use `pt_BR.UTF-8` no lugar de `Portuguese_Brazil.1252`

### 5. Executar o schema
```bash
psql -U postgres -d omar404 -f database/schema.sql
```

### 6. Rodar o servidor
```bash
cd backend
npm run dev
```
Se tudo conectou corretamente, deve aparecer: 
```yaml
Servidor rodando na porta 3000
Redis publisher conectado.
Redis subscriber conectado.
```
---
## Como rodar com Docker
Se preferir não instalar PostgreSQL e Redis localmente, use o Docker Compose na raiz do projeto:

1. Preencha o `.env` com seus dados:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=omar404
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui

JWT_SECRET=um_segredo_longo_e_aleatorio

REDIS_URL=redis://seu_host_redis:6379

EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app_gmail
EMAIL_FROM=Omar-404 <seu_email@gmail.com>
```
> Para o `EMAIL_PASS`, use uma **senha de app** do Gmail: Google Account > Seguranca > Verificacao em duas etapas > Senhas de app.

2. Rode o Docker Compose:
```bash
docker compose up --build
```

O backend estará disponível em `http://localhost:3000`
>  Ao usar Docker, o schema é executado automaticamente na primeira inicialização do banco.

---

## Criar o primeiro admininastor
O cadastro de admins é feito pelo frontend com verificação de e-mail (codigo de 6 digitos válido por 15 minutos). Acesse `/cadastro` na interface.

Para testes rápidos via Postman ou Insomnia: 

```
POST http://localhost:3000/auth/register

{
  "nome": "Admin",
  "email": "admin@omar404.com",
  "senha": "sua_senha",
  "perfil": "admin"
}
```

---

## Endpoints disponíveis

### Autenticação

| Método | Rota | Descrição | Auth |
|--------|------|-----------|------|
| POST | `/auth/register` | Criar novo usuário (uso interno/testes) | -- |
| POST | `/auth/login` | Login e geração do token JWT | -- |
| POST | `/auth/admin/solicitar` | Solicitar cadastro de admin (envia código por e-mail) | -- |
| POST | `/auth/admin/solicitar` | Confirmar código e cria admin | -- |

### Usuários (requer token)

| Método | Rota | Descrição | Perfil |
|--------|------|-----------|--------|
| GET | `/users/me` | Ver perfil do usuário logado | todos |
| PUT | `/users/me` | Atualizar perfil | todos |
| DELETE | `/users/me` | Remover própria conta | todos |
| GET | `/users` | Listar todos os usuários | admin |
| POST | `/users/operadores` | Cadastrar novo operador | admin |
| GET | `/users/operadores` | Listar operadores do admin logado | admin |
| DELETE | `/users/:id` | Remover operador | admin |

### Clientes (requer token)

| Método | Rota | Descrição | Perfil |
|--------|------|-----------|--------|
| GET | `/clientes` | Listar todos os clientes | todos |
| GET | `/clientes/:id` | Buscar cliente com falecidos vinculados | todos |
| POST | `/clientes` | Cadastrar novo cliente | admin |
| PUT | `/clientes/:id` | Atualizar cliente | admin |
| DELETE | `/clientes/:id` | Remover cliente | admin |

### Falecidos (requer token)

| Método | Rota | Descrição | Perfil |
|--------|------|-----------|--------|
| GET | `/falecidos` | Listar todos os falecidos | todos |
| GET | `/falecidos/:id` | Buscar falecido por ID | todos |
| POST | `/falecidos` | Cadastrar novo falecido | admin |
| PUT | `/falecidos/:id` | Atualizar falecido | admin |
| DELETE | `/falecidos/:id` | Remover falecido | admin |

### Serviços (requer token)

| Método | Rota | Descrição | Perfil |
|--------|------|-----------|--------|
| GET | `/servicos` | Listar todos os serviços | todos |
| GET | `/servicos/:id` | Buscar serviço por ID | todos |
| POST | `/servicos` | Cadastrar novo serviço | admin |
| PUT | `/servicos/:id` | Atualizar serviço | admin |
| PATCH | `/servicos/:id/status` | Atualizar status do serviço | admin |
| DELETE | `/clientes/:id` | Remover serviço | admin |

### Como usar o token

```
Authorization: Bearer SEU_TOKEN_AQUI
```

No Postman: aba **Authorization** -> **Bearer Token** -> cole o token.

---

## Multitenancy
Cada admin gerencia seus próprios registros. Operadores visualizam apemas dados do admin ao qual estão vinculados. A lógica é resolvida automaticamente pelo utilitário `utils/getAdminId.js`:
- Se o usuário logado é admin: usa o proprio `id`
- Se o usuário logado é operador: busca o `admin_id` vinculado no banco

---

## Eventos Pub/Sub
O sistema publica eventos via Redis e notifica o frontend em tempo real via Socket.io.

| Evento | Onde é disparado | Quando | 
|--------|------------------|--------|
| `usuario:logado` | `authController.login` | Ao fazer login |
| `cliente:cadastrado` | `clienteController.create` | Ao cadastrar cliente |
| `falecido:cadastrado` | `falecidoController.create` | Ao cadastrar falecido |
| `contrato:criado` | `servicoController.create` | Ao cadastrar serviço |
| `contrato:atualizado` | `servicoController.update` | Ao editar serviço |
| `contrato:cancelado` | `servicoController.updateStatus` | Status do serviço vira `cancelado` |
| `sepultamento:confirmado` | `servicoController.updateStatus` | Status do serviço vira `concluido` |
| `operador:cadastrado` | `authController.registrarOperador` | Ao cadastrar operador |
| `operador:removido` | `usuarioController.deletarOperadores` | Ao remover operador |
Para testar, observe o terminal do servidor após cada ação: 
```yaml
Evento publicado: contrato:criado { id: 1, tipo: 'Velorio' ... }
Evento recebido - contrato:criado: { id: 1, tipo: 'Velorio' ... }
```
> A ordem dos logs pode variar — comportamento normal do event loop do Node.js.
---

### Resetar dados do banco (se necessário)

```bash
psql -U postgres -d omar404
```
```sql
TRUNCATE TABLE servicos, falecidos, clientes RESTART IDENTITY CASCADE;
\q
```
---

## Observações

- Nunca suba o arquivo `.env` para o GitHub — ele está no `.gitignore`
- O `JWT_SECRET` em produção deve ser uma string longa e aleatória
- Senhas são armazenadas com hash bcrypt — nunca em texto puro
- O token JWT expira em 8h — configurável no `authController`
- O CPF é validado matematicamente - CPFs com dígitos aleatórios muito provavelmente serão rejeitados
- Clientes com falecidos vinculados não podem ser removidos (`ON DELETE RESTRIC`)
- IDs no PostgreSQL não reiniciam automaticamente ao recriar registros — isso é comportamento normal
