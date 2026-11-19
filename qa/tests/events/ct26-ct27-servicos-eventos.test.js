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
  const falhas = []
  const registrar = (descricao, condicao, detalhe = '') => {
    if (!condicao) falhas.push(`${descricao}${detalhe ? `: ${detalhe}` : ''}`)
  }
  const observador = await connectSocket('ct27')
  conexoes.push(observador)

  const criacao = await http()
    .post('/servicos')
    .set(authHeader(admin.token))
    .send(payloadServico(clienteId, falecidoId))
  registrar('CT27 criação do serviço', criacao.status === 201, `status=${criacao.status}`)
  const servicoId = criacao.body.id

  const preparacao = await http()
    .patch(`/servicos/${servicoId}/status`)
    .set(authHeader(admin.token))
    .send({ status: 'em_andamento' })
  registrar('CT27 preparação do status', preparacao.status === 200, `status=${preparacao.status}`)
  observador.limpar()
  await delay(200)

  const corpoBase = payloadServico(clienteId, falecidoId)
  const corpo = { ...corpoBase }
  delete corpo.status

  const semStatus = await http()
    .put(`/servicos/${servicoId}`)
    .set(authHeader(admin.token))
    .send(corpo)

  registrar('CT27 PUT sem status', semStatus.status === 200, `status=${semStatus.status}`)
  registrar('CT27 status preservado', semStatus.body.status === 'em_andamento', `status=${semStatus.body.status}`)
  await delay(300)

  const atualizados = observador.recebidos('contrato:atualizado')
  registrar('CT27 evento contrato:atualizado sem status', atualizados.length === 1, `recebidos=${atualizados.length}`)
  registrar('CT27 payload mantém status sem status', atualizados.some((item) => item.payload.status === 'em_andamento'))
  registrar('CT27 evento sepultamento:confirmado sem status', observador.recebidos('sepultamento:confirmado').length === 0)
  registrar('CT27 evento contrato:cancelado sem status', observador.recebidos('contrato:cancelado').length === 0)

  observador.limpar()
  await delay(300)

  const concluido = await http()
    .put(`/servicos/${servicoId}`)
    .set(authHeader(admin.token))
    .send({ ...corpoBase, status: 'concluido' })

  registrar('CT27 PUT com status concluido', concluido.status === 200, `status=${concluido.status}`)
  registrar('CT27 status concluido', concluido.body.status === 'concluido', `status=${concluido.body.status}`)
  await delay(300)

  const concluidos = observador.recebidos('sepultamento:confirmado')
  registrar('CT27 evento contrato:atualizado com concluido', observador.recebidos('contrato:atualizado').length === 1)
  registrar('CT27 evento sepultamento:confirmado', concluidos.length === 1, `recebidos=${concluidos.length}`)
  registrar('CT27 payload de sepultamento:confirmado', concluidos.some((item) => item.payload.status === 'concluido'))

  observador.limpar()
  await delay(300)

  const cancelado = await http()
    .put(`/servicos/${servicoId}`)
    .set(authHeader(admin.token))
    .send({ ...corpoBase, status: 'cancelado' })

  registrar('CT27 PUT com status cancelado', cancelado.status === 200, `status=${cancelado.status}`)
  registrar('CT27 status cancelado', cancelado.body.status === 'cancelado', `status=${cancelado.body.status}`)
  await delay(300)

  const cancelados = observador.recebidos('contrato:cancelado')
  registrar('CT27 evento contrato:atualizado com cancelado', observador.recebidos('contrato:atualizado').length === 1)
  registrar('CT27 evento contrato:cancelado', cancelados.length === 1, `recebidos=${cancelados.length}`)
  registrar('CT27 payload de contrato:cancelado', cancelados.some((item) => item.payload.status === 'cancelado'))

  expect(falhas).toEqual([])
})
