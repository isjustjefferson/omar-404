const assert = require('assert')
const { Given, When, Then } = require('@cucumber/cucumber')
const { http, loginOrThrow, authHeader } = require('../../support/auth')
const { query } = require('../../support/db')
const { USUARIOS, gerarCpf, payloadCliente } = require('../../support/fixtures')

Given('que o administrador {string} está autenticado', async function (nome) {
  const usuario = USUARIOS[nome]
  const sessao = await loginOrThrow(usuario.email, usuario.senha)
  this.token = sessao.token
  this.usuarioAutenticado = usuario
})

Given('que o operador {string} está autenticado', async function (nome) {
  const usuario = USUARIOS[nome]
  const sessao = await loginOrThrow(usuario.email, usuario.senha)
  this.token = sessao.token
  this.usuarioAutenticado = usuario
})

When('ele cadastra, atualiza e remove um cliente', async function () {
  const cpf = gerarCpf(String(Date.now()).slice(-9))
  const criacao = await http()
    .post('/clientes')
    .set(authHeader(this.token))
    .send(payloadCliente(cpf, 'Cliente BDD'))

  const atualizacao = await http()
    .put(`/clientes/${criacao.body.id}`)
    .set(authHeader(this.token))
    .send({ ...criacao.body, nome: 'Cliente BDD Atualizado' })

  const remocao = await http()
    .delete(`/clientes/${criacao.body.id}`)
    .set(authHeader(this.token))

  this.statuses = [criacao.status, atualizacao.status, remocao.status]
  this.resposta = remocao
})

Then('todas as operações de escrita têm sucesso', function () {
  assert.deepStrictEqual(this.statuses, [201, 200, 200])
})

When('ele tenta executar uma operação de escrita', async function () {
  const total = await query('SELECT COUNT(*)::int AS total FROM clientes')
  this.totalAntes = total.rows[0].total

  this.resposta = await http()
    .post('/clientes')
    .set(authHeader(this.token))
    .send(payloadCliente(gerarCpf(String(Date.now()).slice(-9)), 'Cliente Negado'))
})

Then('a mensagem informa que apenas administradores podem realizar a ação', function () {
  assert.ok(String(this.resposta.body.erro).includes('Apenas administradores podem realizar esta ação.'))
})

Then('nenhum dado é criado, alterado ou removido', async function () {
  const total = await query('SELECT COUNT(*)::int AS total FROM clientes')
  assert.strictEqual(total.rows[0].total, this.totalAntes)
})

When('ele consulta clientes, falecidos e serviços', async function () {
  this.respostas = []
  for (const rota of ['/clientes', '/falecidos', '/servicos']) {
    const resposta = await http().get(rota).set(authHeader(this.token))
    this.respostas.push(resposta)
  }
  this.resposta = this.respostas[0]
})

Then('a resposta contém apenas os registros do {string}', async function (nome) {
  const resultado = await query('SELECT id FROM usuarios WHERE email = $1', [USUARIOS[nome].email])
  const adminId = resultado.rows[0].id

  for (const resposta of this.respostas) {
    assert.strictEqual(resposta.status, 200)
    assert.ok(resposta.body.length > 0)
    assert.ok(resposta.body.every((registro) => registro.admin_id === adminId))
  }
})
