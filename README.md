# Omar-404 — Sistema de Administração de Funerária

![Node.js](https://img.shields.io/badge/Node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React 19](https://img.shields.io/badge/React_19-20232a?style=for-the-badge&logo=react&logoColor=61DAFB)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

## Tecnologias

- **Backend:** Node.js + Express
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT + bcryptjs
- **Pub/Sub:** Redis + Socket.io
- **Frontend:** React 19 + Vite
- **Roteamento**: React Router DOM v7
- **Estilização**: Bootstrap 5 + CSS customizado

---

## Pré-requisitos

- [Node.js v18+](https://nodejs.org)
- [React v19](https://react.dev/)
- [PostgreSQL v14+](https://www.postgresql.org/download/)
- [Redis](https://redis.io/downloads/)
- [Git](https://git-scm.com)

---

## Estrutura do projeto

```
omar-404/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── usuarioController.js
│   │   ├── falecidoController.js
│   │   ├── clienteController.js
│   │   └── servicoController.js
│   ├── events/
│   │   ├── publisher.js
│   │   └── subscriber.js
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
│   │   ├── falecidoRoutes.js
│   │   ├── clienteRoutes.js
│   │   └── servicoRoutes.js
│   ├── .env.example
│   ├── README.md
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── database/
│   ├── schema.sql
│   └── seed.sql
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── PrivateRoute.jsx
│   │   │   ├── FalecidoModal.jsx
│   │   │   ├── ClienteModal.jsx
│   │   │   └── ContratoModal.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Perfil.jsx
│   │   │   ├── Falecidos.jsx
│   │   │   ├── Clientes.jsx
│   │   │   ├── Contratos.jsx
│   │   │   └── NotFound.jsx
│   │   └── services/
│   │   │   └── api.js
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

---

## Readme.md:
- **[Backend README.md](./backend/README.md)**: Guia para rodar o Backend localmente.
- **[Frontend README.md](./frontend/README.md)**: Guia para rodar o Frontend localmente.

---

# Colaboradores:

- **Jefferson Silva** · [LinkedIn](https://www.linkedin.com/in/jefferson-silva-1a035836b/)
· [GitHub](https://github.com/isjustjefferson)

- **Elton Santos** · [LinkedIn](https://www.linkedin.com/in/elton-santos-76a287270/)
· [GitHub](https://github.com/El-tinho)
