const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./views/authRoutes');
const usuarioRoutes = require('./views/usuarioRoutes');
const falecidoRoutes = require('./views/falecidoRoutes');
const clienteRoutes = require('./views/clienteRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', usuarioRoutes);
app.use('/falecidos', falecidoRoutes);
app.use('/clientes', clienteRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Omar-404 API funcionando' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});