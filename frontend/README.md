# FRONTEND Omar-404 

![React 19](https://img.shields.io/badge/React_19-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router_7-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![Bootstrap 5](https://img.shields.io/badge/Bootstrap_5-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

## Tecnologias

- **Framework**: React 19 + Vite
- **Roteamento**: React Router DOM v7
- **Estilização**: Bootstrap 5 + CSS customizado
- **Requisições HTTP**: Axios
- **Autenticação**: JWT armazenado no localStorage
- **Tempo real:** Socket.io client

---

## Pré-requisitos

- [Node.js v18+](https://nodejs.org)
- [React v19](https://react.dev/)
- Backend rodando em `http://localhost:3000`
- [Git](https://git-scm.com)

---

## Como rodar localmente

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Configurar variaveis de ambiente

Crie um arquivo `.env` na pasta frontend:

```env
VITE_API_URL=http://localhost:3000
```

### 3. Rodar o servidor de desenvolvimento

```bash
npm run dev
```
Acesse: http://localhost:5173
---
## Estrutura de arquivos
```yaml
src/
├── components/
│   ├── ClienteModal.jsx     — modal de cadastro e edição de clientes
│   ├── ContratoModal.jsx    — modal de cadastro e edição de contratos
│   ├── FalecidoModal.jsx    — modal de cadastro e edição de falecidos
│   ├── Layout.jsx           — estrutura base com sidebar e topbar
│   ├── PrivateRoute.jsx     — proteção de rotas autenticadas
│   ├── Sidebar.jsx          — menu lateral com controle por perfil
│   └── Toast.jsx            — notificação visual de erros globais
├── context/
│   └── ToastContext.jsx     — contexto global para exibir toasts
├── hooks/
│   └── useSocket.js         — hook para escutar eventos Socket.io
├── pages/
│   ├── CadastroAdmin.jsx    — cadastro de admin com verificação de e-mail
│   ├── Clientes.jsx         — listagem e gerenciamento de clientes
│   ├── Contratos.jsx        — listagem e gerenciamento de contratos
│   ├── Falecidos.jsx        — listagem e gerenciamento de falecidos
│   ├── Home.jsx             — dashboard principal
│   ├── Login.jsx            — tela de login
│   ├── NotFound.jsx         — pagina 404
│   ├── Operadores.jsx       — gerenciamento de operadores (só admin)
│   └── Perfil.jsx           — perfil do usuário logado
├── services/
│   ├── api.js               — instância do Axios com interceptors
│   └── socket.js            — instância do Socket.io client
├── App.jsx                  — definição de rotas
└── main.jsx                 — entry point com providers
```

---
## Páginas e funcionalidades
### Autenticação
- `/login` — Login com e-mail e senha. Token JWT salvo no localStorage. Redireciona automaticamente para `/login` se o token expirar (401).
- `/cadastro` — Cadastro de administrador em duas etapas: preenchimento de dados e confirmação por coóigo enviado ao e-mail (válido por 15 minutos).

### Dashboard
- `/` — Visão geral do sistema. Notificação em tempo real quando outro usuario faz login (apenas para admins).

### Clientes - `/clientes`
- Listagem com busca por nome.
- Cadastro com CPF (validado matematicamente), telefone e e-mail.
- CPF não pode ser alterado apos o cadastro.
- Edição de nome, telefone e e-mail.
- Remoção com confirmação inline.
- Clientes com falecidos vinculados não podem ser removidos.

### Falecidos - `/falecidos`
- Listagem com busca por nome.
- Cadastro com nome, datas de nascimento/falecimento, causa da morte e cliente responsável (seletor com clientes do admin).
- Edição e remoção com confirmação inline.

### Contratos/Serviços - `/contratos`
- Listagem com filtro por status.
- Cadastro vinculado a cliente e falecido via seletores.
- Status: `pendente`, `em andamento`, `concluido`, `cancelado`.
- Edição e remoção com confirmação.
---

### Operadores - `/operadores` (somente admin)
- Cadastro de operadores vinculados ao admin logado.
- Listagem de operadores cadastrados pelo admin.
- Remoção de operadores.

### Perfil - `/perfil`
- Visualização dos dados do usuário logado.
- Edição de nome e e-mail.
- Exclusão de conta.
---
## Controle de acesso por perfil
| Ação | Operador | Admin |
|------|----------|-------|
| Visualizar registros | Sim | Sim |
| Cadastrar / Editar / Remover | Não | Sim |
| Acessar página de Operadores | Não | Sim |
| Ver item Operadores na sidebar | Não | Sim |
Quando um operador tenta realizar uma ação bloqueada, um toast de erro aparece automaticamente no canto inferior direito da tela com a mensagem retornada pela API.

---
## Eventos em tempo real (Socket.io)
O frontend escuta eventos publicados pelo backend via Redis Pub/Sub. O hook `useSocket` é usado em cada página para reagir aos eventos sem recarregar a página.
| Evento | Página | Comportamento | 
|--------|--------|---------------|
| `cliente:cadastrado` | Clientes | Adiciona na lista |
| `falecido:cadastrado` | Falecidos | Adiciona na lista |
| `contrato:criado` | Contratos | Adiciona na lista |
| `contrato:atualizado` | Contratos | Atualiza o item na lista |
| `contrato:cancelado` | Contrato | Muda status para `cancelado` |
| `sepultamento:confirmado` | Contratos | Muda status para `concluido` |
| `operador:cadastrado` | Operadores | Adiciona na lista |
| `operador:removido` | Operadores | Remove da lista |
| `usuario:logado` | Home | Toast de notificação para o admin |
O socket só coneta após o login e desconecta ao fazer logout.

---
## Interceptors do Axios
O `api.js` possui dois interceptors configurados:
- **Request:** injeta o token JWT automaticamente em toda requisição.
- **Response:**
    - **Erro 401** - remove o token e redireciona para `/login`.
    - **Erro 403** - dispara o evento ``omar:forbidden`` que exibe o toast de acesso negado.

---
## Observações

- Nunca suba o arquivo `.env` para o GitHub — ele está no `.gitignore`
- O frontend consome a API do backend em http://localhost:3000.
- Todas as rotas exceto `/login` exigem autenticação.
- O token JWT expira em 8h — após isso o sistema redireciona automaticamente para o login.
- O socket precisa do backend rodando para funcionar — sem backend, a conexão falha silenciosamente.
- Usuários com perfil `operador` só visualizam registros do `admin` ao qual estão vinculados.
- A sidebar oculta o item Operadores automaticamente para usuários com perfil `operador`.
