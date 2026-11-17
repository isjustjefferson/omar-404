const assert = require('assert')
const { Given, When, Then } = require('@cucumber/cucumber')
const { http, login } = require('../../support/auth')
const { connectSocket, delay } = require('../../support/sockets')
const { USUARIOS } = require('../../support/fixtures')

Given('que a API está disponível', async function () {
  const resposta = await http().get('/')
  assert.strictEqual(resposta.status, 200)
})

Given('que o administrador {string} está cadastrado', function (nome) {
  this.usuario = USUARIOS[nome]
  assert.ok(this.usuario, `Administrador ${nome} não existe na massa`)
})

Given('que um cliente socket está conectado para observar eventos', async function () {
  const conexao = await connectSocket('login-bdd')
  this.conexoes.push(conexao)
})

When('ele envia o e-mail e a senha corretos para o login', async function () {
  this.resposta = await login(this.usuario.email, this.usuario.senha)
})

When('ele tenta login com e-mail {string}, senha {string} e corpo {string}', async function (email, senha, corpo) {
  let corpoRequisicao = { email, senha }
  if (corpo === 'sem-email') corpoRequisicao = { senha }
  if (corpo === 'sem-senha') corpoRequisicao = { email }
  this.resposta = await http().post('/auth/login').send(corpoRequisicao)
})

Then('a resposta tem status {int}', function (status) {
  assert.strictEqual(this.resposta.status, status)
})

Then('a resposta contém um token JWT e os dados do usuário, sem a senha', function () {
  const corpo = this.resposta.body
  assert.ok(corpo.token)
  assert.strictEqual(corpo.usuario.email, this.usuario.email)
  assert.strictEqual(corpo.usuario.perfil, 'admin')
  assert.strictEqual(Object.prototype.hasOwnProperty.call(corpo.usuario, 'senha'), false)
})

Then('o token expira em 8 horas', function () {
  const partes = this.resposta.body.token.split('.')
  const payload = JSON.parse(Buffer.from(partes[1], 'base64url').toString('utf8'))
  assert.strictEqual(payload.exp - payload.iat, 8 * 60 * 60)
})

Then('o evento {string} é publicado', async function (evento) {
  await delay(1000)
  assert.ok(this.conexoes[0].recebidos(evento).length > 0, `Evento ${evento} não recebido`)
})

Then('a resposta não contém token', function () {
  assert.strictEqual(Object.prototype.hasOwnProperty.call(this.resposta.body, 'token'), false)
})

Then('a mensagem informa {string}', function (mensagem) {
  const erro = String(this.resposta.body.erro || '').toLowerCase()
  assert.ok(erro.includes(mensagem.toLowerCase()), `Mensagem recebida: ${erro}`)
})
