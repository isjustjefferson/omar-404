require('./env')

const request = require('supertest')

const BASE_URL = process.env.BASE_URL

function http() {
  return request(BASE_URL)
}

async function login(email, senha) {
  return http().post('/auth/login').send({ email, senha })
}

async function loginOrThrow(email, senha) {
  const resposta = await login(email, senha)
  if (resposta.status !== 200 || !resposta.body.token) {
    const erro = new Error(`Falha ao autenticar ${email}: ${resposta.status} ${JSON.stringify(resposta.body)}`)
    erro.resposta = resposta
    throw erro
  }
  return resposta.body
}

function authHeader(token) {
  return { Authorization: `Bearer ${token}` }
}

module.exports = { request, http, BASE_URL, login, loginOrThrow, authHeader }
