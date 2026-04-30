const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Omar-404 API funcionando' });
});

const Falecido = require('./models/Falecido');

app.get('/falecido', async(req, res) => {
  const falecidos = await Falecido.listarTodos();
  res.json(falecidos);
});

const Servico = require('./models/Servico');

app.get('/servico', async(req, res) => {
  const servicos = await Servico.listarTodos();
  res.json(servicos);
});

const Cliente = require('./models/Cliente');

app.get('/cliente', async(req, res) => {
  const clientes = await Cliente.listarTodos();
  res.json(clientes);
});

const Usuario = require('./models/Usuario');

app.get('/usuario', async(req, res) => {
  const usuarios = await Usuario.listarTodos();
  res.json(usuarios);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});