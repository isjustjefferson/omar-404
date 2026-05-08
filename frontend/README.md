# FRONTEND Omar-404 

## Tecnologias

- **Framework**: React 19 + Vite
- **Roteamento**: React Router DOM v7
- **Estilização**: Bootstrap 5 + CSS customizado
- **Requisições HTTP**: Axios
- **Autenticação**: JWT armazenado no localStorage

---

## Pré-requisitos

- [Node.js v18+](https://nodejs.org)
- [React 19](https://react.dev/)
- [Git](https://git-scm.com)

---

## Como rodar localmente

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Configurar variaveis de ambiente

```bash
cp .env.example .env
```

### 3. Crie um arquivo `.env` na pasta frontend:

```env
VITE_API_URL=http://localhost:3000
```

### 4. Rodar o servidor de desenvolvimento

```bash
npm run dev
```
---

## Funcionalidades
### Autenticação
- Login com e-mail e senha.
- Token JWT salvo no localStorage.
- Redirecionamento automático para /login se não autenticado.
- Logout com limpeza do token.

### Perfil do usuário
- Visualização dos dados do usuário logado.
- Edição de nome e e-mail.
- Exclusão de conta.

### Falecidos
- Listagem com busca por nome.
- Cadastro com nome, datas e causa da morte.
- Edição e remoção com confirmação.


### Clientes
- Cadastro com CPF (validado matematicamente), telefone e e-mail.
- CPF não pode ser alterado após cadastro.
- Edição e remoção com confirmação.

### Contratos/Serviços
- Listagem com filtro por status.
- Cadastro vinculado a cliente e falecido via seletor.
- Status: pendente, em andamento, concluído, cancelado.
- Edição e remoção com confirmação.
- 
---

## Observações

- O frontend consome a API do backend em http://localhost:3000.
- Todas as rotas exceto /login exigem autenticação.
- O token JWT expira em 8h — após isso o sistema redireciona automaticamente para o login.
- Nunca suba o arquivo .env para o GitHub — ele está no .gitignore.
