# omar-404

## Pré-requisitos

Antes de rodar o projeto, instale:

- [Node.js v18+](https://nodejs.org)
- [PostgreSQL v14+](https://www.postgresql.org/download/)
- [Git](https://git-scm.com)

---

## Como rodar

### 1. Instalar as dependências do backend

```bash
cd backend
npm install
```

### 2. Configurar as variáveis de ambiente

Dentro da pasta `backend/`, copia o arquivo de exemplo e preenche com teus dados:

```bash
cp .env.example .env
```

Abre o `.env` e preenche:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=omar404
DB_USER=postgres
DB_PASSWORD=sua_senha_aqui (usa aquela senha que te passei no Discord)
```

### 3. Criar o banco de dados

Abre o terminal do PostgreSQL e cria o banco:

```bash
psql -U postgres
```

```sql
CREATE DATABASE omar404;
\q
```

> **Windows:** se `psql` não for reconhecido, use o caminho completo:
> `"C:\Program Files\PostgreSQL\18\bin\psql.exe" -U postgres`
> Ou use o **pgAdmin** ou **DBeaver**.
> Ou também dá para configurar nas variáveis do ambiente.

### 4. Executar o schema (criar as tabelas)

Na raiz do projeto:

```bash
psql -U postgres -d omar404 -f database/schema.sql
```

### 5. Popular o banco de dados (seed)
```bash
psql -U postgres -d omar404 -f database/seed.sql
```

### 6. Rodar o servidor

```bash
cd backend
npm run dev
```

Acessa no navegador: [http://localhost:3000](http://localhost:3000)

> Endpoints criados até agora:
> '/' (health): Verifica se a API está funcionando
> '/falecido': Retorna todas as linhas da tabela Falecido em json.
> '/servico': Retorna todas as linhas da tabela Servico em json.
> '/cliente': Retorna todas as linhas da tabela Cliente em json.
> '/usuario': Retorna todas as linhas da tabela Usuario em json.

---

## Estrutura do projeto

```
omar-404/
├── frontend/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   ├── views/
│   ├── controllers/
│   ├── events/
│   └── index.js
├── database/
│   └── schema.sql
└── README.md
```

---

## Dúvidas

Manda um zap ( ͡° ͜ʖ ͡°)