# Omar-404 — Sistema de Administração de Funerária

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=ffffff)

Sistema de gestão funerária desenvolvido como projeto acadêmico. Permite o cadastro e gerenciamento de clientes, falecidos e contratos de serviço, com suporte a múltiplos administradores e operadores, autenticação JWT, controle de acesso por perfil e eventos em tempo real via Pub/Sub.

## Stack

| Camada | Tecnologia |
|--------|------------|
| Frontend | React 19 + Vite + React Router DOM v7 |
| Backend | Node.js + Express |
| Banco de dados (SGBD) | PostgreSQL |
| Autenticação | JWT + bcryptjs |
| Pub/Sub | Redis + Socket.io |
| Estilização | Bootstrap 5 + CSS customizado |

---

## Estrutura do repositório

```yaml
omar-404/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── mailer.js
│   ├── controllers/
│   │   ├── adminRegisterController.js
│   │   ├── authController.js
│   │   ├── clienteController.js
│   │   ├── falecidoController.js
│   │   ├── servicoController.js
│   │   └── usuarioController.js
│   ├── events/
│   │   ├── publisher.js
│   │   └── subscriber.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   └── perfil.js
│   ├── models/
│   │   ├── Cliente.js
│   │   ├── Falecido.js
│   │   ├── Servico.js
│   │   └── Usuario.js
│   ├── utils/
│   │   └── getAdminId.js
│   ├── views/
│   │   ├── adminRegisterRoutes.js
│   │   ├── authRoutes.js
│   │   ├── clienteRoutes.js
│   │   ├── falecidoRoutes.js
│   │   ├── servicoRoutes.js
│   │   └── usuarioRoutes.js
│   ├── .env.example
│   ├── index.js
│   └── package.json
├── database/
│   ├── schema.sql
│   └── seed.sql
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ClienteModal.jsx
│   │   │   ├── ContratoModal.jsx
│   │   │   ├── FalecidoModal.jsx
│   │   │   ├── Layout.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Toast.jsx
│   │   ├── context/
│   │   │   └── ToastContext.jsx
│   │   ├── hooks/
│   │   │   └── useSocket.js
│   │   ├── pages/
│   │   │   ├── CadastroAdmin.jsx
│   │   │   ├── Clientes.jsx
│   │   │   ├── Contratos.jsx
│   │   │   ├── Falecidos.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── NotFound.jsx
│   │   │   ├── Operadores.jsx
│   │   │   └── Perfil.jsx
│   │   ├── services/
│   │   │   ├── api.js
│   │   │   └── socket.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── .gitignore
└── README.md
```

---

## Documentação
Cada parte do projeto tem seu proprio README com instrucoes detalhadas de configuracao e uso:
- **[Backend README.md](./backend/README.md)** — instalaão, variáveis de ambiente, banco de dados, endpoints e Pub/Sub
- **[Frontend README.md](./frontend/README.md)**— instalação, variáveis de ambiente, páginas e integração com Socket.io

---
## Como rodar projeto completo
São necessário **3 terminais** abertos simultaneamente.

### Terminal 1 - Redis:
```bash
# Windows (WSL)
wsl
sudo service redis-server start

# Linux/macOS
sudo service redis-server start
```

### Terminal 2 - Backend:
```bash
cd backend
npm install   # caso não tenha instalado dependências
npm run dev
```

### Terminal 3 - Frontend:
```bash
cd backend
npm install   # caso não tenha instalado dependências
npm run dev
```

Acesse o sistema em http://localhost:5173.

---
## Funcionalidades
- Cadastro de administradores com verificação de e-mail (codigo de 6 dígitos).
- Login com JWT (expiração configurável).
- Controle de acesso por perfil: `admin` e `operador`.
- Multitenancy: cada `admin` gerencia seus pr´rprios registros; `operadores` só visualizam dados do admin ao qual estão vinculados.
- CRUD completo de clientes, falecidos e contratos de serviço.
- Validação matemática de CPF no frontend e backend.
- Eventos em tempo real via Redis Pub/Sub + Socket.io.

---
## Eventos Pub/Sub
| Evento | Onde é disparado | Quando | 
|--------|------------------|--------|
| `usuario:logado` | `authController.login` | Ao fazer login |
| `cliente:cadastrado` | `clienteController.create` | Ao cadastrar cliente |
| `falecido:cadastrado` | `falecidoController.create` | Ao cadastrar falecido |
| `contrato:cadastrado` | `servicoController.create` | Ao cadastrar serviço |
| `contrato:atualizado` | `servicoController.update` | Ao editar serviço |
| `contrato:cancelado` | `servicoController.updateStatus` | Status do serviço vira `cancelado` |
| `sepultamento:confirmado` | `servicoController.updateStatus` | Status do serviço vira `concluido` |
| `operador:cadastrado` | `authController.registrarOperador` | Ao cadastrar operador |
| `operador:removido` | `usuarioController.deletarOperadores` | Ao remover operador |

---
# Colaboradores:

- **Jefferson Silva** · [LinkedIn](https://www.linkedin.com/in/jefferson-silva-1a035836b/)
· [GitHub](https://github.com/isjustjefferson)

- **Elton Santos** · [LinkedIn](https://www.linkedin.com/in/elton-santos-76a287270/)
· [GitHub](https://github.com/El-tinho)
