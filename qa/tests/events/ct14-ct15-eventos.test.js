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
  const falhas = []
  const registrar = (descricao, condicao, detalhe = '') => {
    if (!condicao) falhas.push(`${descricao}${detalhe ? `: ${detalhe}` : ''}`)
  }
  const socketsPorNome = {}
  for (const nome of ['Admin A', 'Operador A1', 'Admin B', 'Operador B1']) {
    socketsPorNome[nome] = await connectSocket(nome)
    conexoes.push(socketsPorNome[nome])
  }

  const admin = await loginOrThrow(USUARIOS['Admin A'].email, USUARIOS['Admin A'].senha)
  const operador = await loginOrThrow(USUARIOS['Operador A1'].email, USUARIOS['Operador A1'].senha)
  await delay(300)

  const cpf = gerarCpf('345678901')
  const nomeCliente = 'Cliente Evento 345678901'

  const cliente = await http()
    .post('/clientes')
    .set(authHeader(admin.token))
    .send(payloadCliente(cpf, nomeCliente))
  registrar('CT15 cadastro de cliente', cliente.status === 201, `status=${cliente.status}`)

  const falecido = await http()
    .post('/falecidos')
    .set(authHeader(admin.token))
    .send(payloadFalecido(cliente.body.id, 'Falecido Evento 456789012'))
  registrar('CT15 cadastro de falecido', falecido.status === 201, `status=${falecido.status}`)

  const servico = await http()
    .post('/servicos')
    .set(authHeader(admin.token))
    .send(payloadServico(cliente.body.id, falecido.body.id))
  registrar('CT15 criação de serviço', servico.status === 201, `status=${servico.status}`)

  const status = await http()
    .patch(`/servicos/${servico.body.id}/status`)
    .set(authHeader(admin.token))
    .send({ status: 'concluido' })
  registrar('CT15 conclusão de serviço', status.status === 200, `status=${status.status}`)

  await delay(1500)

  const eventos = [
    'usuario:logado',
    'cliente:cadastrado',
    'falecido:cadastrado',
    'contrato:criado',
    'sepultamento:confirmado'
  ]

  const verificarEvento = (nome, evento, deveReceber) => {
    const quantidade = socketsPorNome[nome].recebidos(evento).length
    registrar(
      `CT15 ${nome} / ${evento}`,
      deveReceber ? quantidade > 0 : quantidade === 0,
      `recebidos=${quantidade}, esperado=${deveReceber ? '>0' : '0'}`
    )
  }

  for (const evento of eventos) {
    verificarEvento('Admin A', evento, true)
    verificarEvento('Operador A1', evento, true)
    verificarEvento('Admin B', evento, false)
    verificarEvento('Operador B1', evento, false)
  }

  const dadosSensiveis = [
    cpf.toLowerCase(),
    nomeCliente.toLowerCase(),
    operador.usuario.email.toLowerCase(),
    operador.usuario.perfil.toLowerCase()
  ]
  const payloadsPorNome = {
    'Admin B': socketsPorNome['Admin B'].eventos.map((item) => JSON.stringify(item.payload || {}).toLowerCase()),
    'Operador B1': socketsPorNome['Operador B1'].eventos.map((item) => JSON.stringify(item.payload || {}).toLowerCase())
  }

  for (const [nome, payloads] of Object.entries(payloadsPorNome)) {
    for (const dado of dadosSensiveis) {
      registrar(`CT15 ${nome} não recebe ${dado}`, !payloads.some((payload) => payload.includes(dado)))
    }
  }

  const adminB = await loginOrThrow(USUARIOS['Admin B'].email, USUARIOS['Admin B'].senha)
  const registrosB = await query('SELECT COUNT(*)::int AS total FROM clientes WHERE admin_id = $1', [adminB.usuario.id])
  registrar('CT15 clientes do Admin B', registrosB.rows[0].total === 2, `total=${registrosB.rows[0].total}`)
  registrar('CT15 perfil do operador', operador.usuario.perfil === 'operador', `perfil=${operador.usuario.perfil}`)

  expect(falhas).toEqual([])
})
