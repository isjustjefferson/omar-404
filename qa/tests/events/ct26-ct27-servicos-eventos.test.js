require('../../support/env')
const { http, loginOrThrow, authHeader } = require('../../support/auth')
const { query } = require('../../support/db')
const { connectSocket, disconnectAll, delay } = require('../../support/sockets')
const { USUARIOS, payloadServico } = require('../../support/fixtures')

let admin
let clienteId
let falecidoId
let conexoes = []

beforeAll(async () => {
  admin = await loginOrThrow(USUARIOS['Admin A'].email, USUARIOS['Admin A'].senha)
  const clientes = await query('SELECT id FROM clientes WHERE admin_id = $1 LIMIT 1', [admin.usuario.id])
  const falecidos = await query('SELECT id FROM falecidos WHERE admin_id = $1 LIMIT 1', [admin.usuario.id])
  clienteId = clientes.rows[0].id
  falecidoId = falecidos.rows[0].id
})

afterEach(async () => {
  await disconnectAll(conexoes)
  conexoes = []
})

async function criarServico() {
  const resposta = await http()
    .post('/servicos')
    .set(authHeader(admin.token))
    .send(payloadServico(clienteId, falecidoId))
  expect(resposta.status).toBe(201)
  return resposta.body.id
}

test('CT26 - transições de status publicam os eventos corretos', async () => {
  const observador = await connectSocket('ct26')
  conexoes.push(observador)
  const servicoId = await criarServico()
  const statuses = ['pendente', 'em_andamento', 'concluido', 'cancelado']

  for (const inicial of statuses) {
    for (const destino of statuses) {
      const preparacao = await http()
        .patch(`/servicos/${servicoId}/status`)
        .set(authHeader(admin.token))
        .send({ status: inicial })
      expect(preparacao.status).toBe(200)

      await delay(300)
      observador.limpar()

      const resposta = await http()
        .patch(`/servicos/${servicoId}/status`)
        .set(authHeader(admin.token))
        .send({ status: destino })

      expect(resposta.status).toBe(200)
      expect(resposta.body.status).toBe(destino)
      await delay(400)

      const confirmados = observador.recebidos('sepultamento:confirmado')
      const cancelados = observador.recebidos('contrato:cancelado')

      expect(confirmados.length).toBe(destino === 'concluido' ? 1 : 0)
      expect(cancelados.length).toBe(destino === 'cancelado' ? 1 : 0)
    }
  }

  observador.limpar()
  for (const invalido of ['finalizado', '', undefined]) {
    const corpo = invalido === undefined ? {} : { status: invalido }
    const resposta = await http()
      .patch(`/servicos/${servicoId}/status`)
      .set(authHeader(admin.token))
      .send(corpo)

    expect(resposta.status).toBe(400)
    expect(resposta.body.erro).toContain('Status inválido. Use: pendente, em_andamento, concluido, cancelado')
  }

  const consulta = await http()
    .get(`/servicos/${servicoId}`)
    .set(authHeader(admin.token))
  expect(consulta.body.status).toBe('cancelado')
  expect(observador.eventos.length).toBe(0)
}, 60000)

test('CT27 - PUT sem status preserva status e com status publica evento', async () => {
  const observador = await connectSocket('ct27')
  conexoes.push(observador)
  const servicoId = await criarServico()

  const preparacao = await http()
    .patch(`/servicos/${servicoId}/status`)
    .set(authHeader(admin.token))
    .send({ status: 'em_andamento' })
  expect(preparacao.status).toBe(200)
  observador.limpar()
  await delay(200)

  const corpoBase = payloadServico(clienteId, falecidoId)
  const corpo = { ...corpoBase }
  delete corpo.status

  const semStatus = await http()
    .put(`/servicos/${servicoId}`)
    .set(authHeader(admin.token))
    .send(corpo)

  expect(semStatus.status).toBe(200)
  expect(semStatus.body.status).toBe('em_andamento')
  await delay(300)
  expect(observador.recebidos('contrato:atualizado').length).toBe(1)
  expect(observador.recebidos('sepultamento:confirmado').length).toBe(0)
  expect(observador.recebidos('contrato:cancelado').length).toBe(0)

  observador.limpar()
  await delay(300)

  const concluido = await http()
    .put(`/servicos/${servicoId}`)
    .set(authHeader(admin.token))
    .send({ ...corpoBase, status: 'concluido' })

  expect(concluido.status).toBe(200)
  await delay(300)
  expect(observador.recebidos('contrato:atualizado').length).toBe(1)
  expect(observador.recebidos('sepultamento:confirmado').length).toBe(1)

  observador.limpar()
  await delay(300)

  const cancelado = await http()
    .put(`/servicos/${servicoId}`)
    .set(authHeader(admin.token))
    .send({ ...corpoBase, status: 'cancelado' })

  expect(cancelado.status).toBe(200)
  await delay(300)
  expect(observador.recebidos('contrato:atualizado').length).toBe(1)
  expect(observador.recebidos('contrato:cancelado').length).toBe(1)
})
