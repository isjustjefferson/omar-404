const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const { conectarPublisher } = require('./events/publisher');
const { conectarSubscriber } = require('./events/subscriber');
const { conectarCache } = require('./utils/cache');

const adminRegisterRoutes = require('./views/adminRegisterRoutes');
const authRoutes = require('./views/authRoutes');
const usuarioRoutes = require('./views/usuarioRoutes');
const falecidoRoutes = require('./views/falecidoRoutes');
const clienteRoutes = require('./views/clienteRoutes');
const servicoRoutes = require('./views/servicoRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*'}
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

app.use('/auth/admin', adminRegisterRoutes);
app.use('/auth', authRoutes);
app.use('/users', usuarioRoutes);
app.use('/falecidos', falecidoRoutes);
app.use('/clientes', clienteRoutes);
app.use('/servicos', servicoRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Omar-404 API funcionando' });
});

io.on('connection', (socket) => {
  console.log(`Cliente conectado: ${socket.id}`);
  socket.on('disconnect', () => {
    console.log(`Cliente desconectado: ${socket.id}`);
  })
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, async () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  await conectarPublisher();
  await conectarSubscriber(io);
  await conectarCache();
});