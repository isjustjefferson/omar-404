require('../../support/env')
const { http, loginOrThrow, authHeader } = require('../../support/auth')
const { query } = require('../../support/db')
const { connectSocket, disconnectAll, delay } = require('../../support/sockets')
const { USUARIOS, gerarCpf, payloadCliente, payloadFalecido, payloadServico } = require('../../support/fixtures')

let conexoes = []

async function criarCliente(token, sufixo) {
  const resposta = await http()
    .post('/clientes')
    .set(authHeader(token))
    .send(payloadCliente(gerarCpf(String(sufixo)), `Cliente Evento ${sufixo}`))
  expect(resposta.status).toBe(201)
  return resposta.body
}

async function criarFalecido(token, clienteId, sufixo) {
  const resposta = await http()
    .post('/falecidos')
    .set(authHeader(token))
    .send(payloadFalecido(clienteId, `Falecido Evento ${sufixo}`))
  expect(resposta.status).toBe(201)
  return resposta.body
}

afterEach(async () => {
  await disconnectAll(conexoes)
  conexoes = []
})

test('CT14 - todas as operações publicam evento', async () => {
  const observador = await connectSocket('observador')
  conexoes.push(observador)

  const admin = await loginOrThrow(USUARIOS['Admin A'].email, USUARIOS['Admin A'].senha)
  await delay(400)
  expect(observador.recebidos('usuario:logado').length).toBe(1)

  const cliente = await criarCliente(admin.token, 123456789)
  await delay(250)

  const clienteAtualizado = await http()
    .put(`/clientes/${cliente.id}`)
    .set(authHeader(admin.token))
    .send({ ...cliente, nome: 'Cliente Evento Atualizado' })
  expect(clienteAtualizado.status).toBe(200)

  const falecido = await criarFalecido(admin.token, cliente.id, 234567890)
  await delay(250)

  const falecidoAtualizado = await http()
    .put(`/falecidos/${falecido.id}`)
    .set(authHeader(admin.token))
    .send({
      nome: 'Falecido Evento Atualizado',
      data_nascimento: '1951-01-01',
      data_falecimento: '2021-05-10',
      causa_morte: 'Causa atualizada',
      cliente_id: cliente.id
    })
  expect(falecidoAtualizado.status).toBe(200)

  const servico = await http()
    .post('/servicos')
    .set(authHeader(admin.token))
    .send(payloadServico(cliente.id, falecido.id))
  expect(servico.status).toBe(201)

  const servicoAtualizado = await http()
    .put(`/servicos/${servico.body.id}`)
    .set(authHeader(admin.token))
    .send({ ...payloadServico(cliente.id, falecido.id), descricao: 'Descrição atualizada' })
  expect(servicoAtualizado.status).toBe(200)

  const concluido = await http()
    .patch(`/servicos/${servico.body.id}/status`)
    .set(authHeader(admin.token))
    .send({ status: 'concluido' })
  expect(concluido.status).toBe(200)

  const cancelado = await http()
    .patch(`/servicos/${servico.body.id}/status`)
    .set(authHeader(admin.token))
    .send({ status: 'cancelado' })
  expect(cancelado.status).toBe(200)

  const servicoRemovido = await http()
    .delete(`/servicos/${servico.body.id}`)
    .set(authHeader(admin.token))
  expect(servicoRemovido.status).toBe(200)

  const falecidoRemovido = await http()
    .delete(`/falecidos/${falecido.id}`)
    .set(authHeader(admin.token))
  expect(falecidoRemovido.status).toBe(200)

  const clienteRemovido = await http()
    .delete(`/clientes/${cliente.id}`)
    .set(authHeader(admin.token))
  expect(clienteRemovido.status).toBe(200)

  const operador = await http()
    .post('/users/operadores')
    .set(authHeader(admin.token))
    .send({
      nome: 'Operador Evento',
      email: `operador.evento.${Date.now()}@teste.com`,
      senha: 'Senha@123'
    })
  expect(operador.status).toBe(201)

  const operadorRemovido = await http()
    .delete(`/users/${operador.body.usuario.id}`)
    .set(authHeader(admin.token))
  expect([200, 500]).toContain(operadorRemovido.status)

  await delay(1500)

  const eventos = [
    'usuario:logado',
    'cliente:cadastrado',
    'cliente:atualizado',
    'cliente:removido',
    'falecido:cadastrado',
    'falecido:atualizado',
    'falecido:removido',
    'contrato:criado',
    'contrato:atualizado',
    'sepultamento:confirmado',
    'contrato:cancelado',
    'contrato:removido',
    'operador:cadastrado',
    'operador:removido'
  ]

  for (const evento of eventos) {
    expect(observador.recebidos(evento).length).toBeGreaterThan(0)
  }
})

test('CT15 - eventos são isolados por administrador', async () => {
  const socketsPorNome = {}
  for (const nome of ['Admin A', 'Operador A1', 'Admin B', 'Operador B1']) {
    socketsPorNome[nome] = await connectSocket(nome)
    conexoes.push(socketsPorNome[nome])
  }

  const admin = await loginOrThrow(USUARIOS['Admin A'].email, USUARIOS['Admin A'].senha)
  const operador = await loginOrThrow(USUARIOS['Operador A1'].email, USUARIOS['Operador A1'].senha)
  await delay(300)

  const cliente = await criarCliente(admin.token, 345678901)
  const falecido = await criarFalecido(admin.token, cliente.id, 456789012)

  const servico = await http()
    .post('/servicos')
    .set(authHeader(admin.token))
    .send(payloadServico(cliente.id, falecido.id))
  expect(servico.status).toBe(201)

  const status = await http()
    .patch(`/servicos/${servico.body.id}/status`)
    .set(authHeader(admin.token))
    .send({ status: 'concluido' })
  expect(status.status).toBe(200)

  await delay(1500)

  const eventos = [
    'usuario:logado',
    'cliente:cadastrado',
    'falecido:cadastrado',
    'contrato:criado',
    'sepultamento:confirmado'
  ]

  for (const evento of eventos) {
    expect(socketsPorNome['Admin A'].recebidos(evento).length).toBeGreaterThan(0)
    expect(socketsPorNome['Operador A1'].recebidos(evento).length).toBeGreaterThan(0)
    expect(socketsPorNome['Admin B'].recebidos(evento).length).toBe(0)
    expect(socketsPorNome['Operador B1'].recebidos(evento).length).toBe(0)
  }

  const registrosB = await query('SELECT COUNT(*)::int AS total FROM clientes WHERE admin_id = $1', [(await loginOrThrow(USUARIOS['Admin B'].email, USUARIOS['Admin B'].senha)).usuario.id])
  expect(registrosB.rows[0].total).toBe(2)
  expect(operador.usuario.perfil).toBe('operador')
})
