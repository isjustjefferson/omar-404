require('./env')

const { io } = require('socket.io-client')

const BASE_URL = process.env.BASE_URL

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function connectSocket(label, token) {
  const socket = io(BASE_URL, {
    transports: ['websocket'],
    reconnection: false,
    forceNew: true,
    auth: token ? { token } : {}
  })

  const eventos = []
  socket.onAny((evento, payload) => eventos.push({ evento, payload }))

  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      socket.disconnect()
      reject(new Error(`Timeout ao conectar socket ${label}`))
    }, 10000)

    socket.once('connect', () => {
      clearTimeout(timer)
      resolve()
    })

    socket.once('connect_error', (erro) => {
      clearTimeout(timer)
      socket.disconnect()
      reject(erro)
    })
  })

  return {
    label,
    socket,
    eventos,
    recebidos(evento) {
      return eventos.filter((item) => item.evento === evento)
    },
    limpar() {
      eventos.length = 0
    }
  }
}

async function disconnectAll(conexoes) {
  for (const conexao of conexoes || []) {
    if (conexao && conexao.socket && conexao.socket.connected) {
      conexao.socket.disconnect()
    }
  }
}

module.exports = { connectSocket, disconnectAll, delay }
