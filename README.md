# Omar-404 — Sistema de Administração de Funerária

## Tecnologias

- **Backend:** Node.js + Express
- **Banco de dados:** PostgreSQL
- **Autenticação:** JWT + bcryptjs
- **Validação de CPF:** Brasil API

---

## Pré-requisitos

- [Node.js v18+](https://nodejs.org)
- [PostgreSQL v14+](https://www.postgresql.org/download/)
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
│   │   └── clienteController.js
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
│   │   └── clienteRoutes.js
│   ├── .env.example
│   ├── README.md
│   ├── index.js
│   ├── package-lock.json
│   └── package.json
├── database/
│   ├── schema.sql
│   └── seed.sql
├── frontend/
│   ├── index/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   └── services/
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
- **[Frontend README.md]**: Guia para rodar o Frontend localmente. (à ser publicado)
