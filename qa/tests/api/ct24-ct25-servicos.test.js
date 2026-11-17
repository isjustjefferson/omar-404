require('../../support/env')
const { http, loginOrThrow, authHeader } = require('../../support/auth')
const { query } = require('../../support/db')
const { USUARIOS, payloadServico } = require('../../support/fixtures')

let adminA
let adminC
let adminD
let clienteAId
let falecidoAId

beforeAll(async () => {
  adminA = await loginOrThrow(USUARIOS['Admin A'].email, USUARIOS['Admin A'].senha)
  adminC = await loginOrThrow(USUARIOS['Admin C'].email, USUARIOS['Admin C'].senha)
  adminD = await loginOrThrow(USUARIOS['Admin D'].email, USUARIOS['Admin D'].senha)

  const clientes = await query('SELECT id FROM clientes WHERE admin_id = $1 LIMIT 1', [adminA.usuario.id])
  const falecidos = await query('SELECT id FROM falecidos WHERE admin_id = $1 LIMIT 1', [adminA.usuario.id])
  clienteAId = clientes.rows[0].id
  falecidoAId = falecidos.rows[0].id
})

describe('CT24 - Cadastro de serviço', () => {
  test('(a) cria serviço e exibe nomes na listagem', async () => {
    const resposta = await http()
      .post('/servicos')
      .set(authHeader(adminA.token))
      .send(payloadServico(clienteAId, falecidoAId))

    expect(resposta.status).toBe(201)
    expect(resposta.body.status).toBe('pendente')
    expect(Number(resposta.body.valor)).toBe(1500)

    const listagem = await http().get('/servicos').set(authHeader(adminA.token))
    expect(listagem.status).toBe(200)
    expect(listagem.body.some((servico) => servico.id === resposta.body.id && servico.nome_cliente && servico.nome_falecido)).toBe(true)
  })

  test('(b) campos obrigatórios ausentes', async () => {
    const base = payloadServico(clienteAId, falecidoAId)
    const campos = ['tipo', 'valor', 'falecido_id', 'cliente_id']

    for (const campo of campos) {
      const corpo = { ...base }
      delete corpo[campo]
      const resposta = await http()
        .post('/servicos')
        .set(authHeader(adminA.token))
        .send(corpo)

      expect(resposta.status).toBe(400)
      expect(resposta.body.erro).toBe('Tipo, valor, falecido e cliente são obrigatórios.')
    }
  })

  test('(c) admin sem clientes recebe aviso', async () => {
    const resposta = await http()
      .post('/servicos')
      .set(authHeader(adminC.token))
      .send(payloadServico(clienteAId, falecidoAId))

    expect(resposta.status).toBe(422)
    expect(resposta.body.erro).toContain('você não tem clientes cadastrados')
  })

  test('(d) admin sem falecidos recebe aviso', async () => {
    const resposta = await http()
      .post('/servicos')
      .set(authHeader(adminD.token))
      .send(payloadServico(clienteAId, falecidoAId))

    expect(resposta.status).toBe(422)
    expect(resposta.body.erro).toContain('você não tem falecidos cadastrados')
  })
})

describe('CT25 - Validação de valor do serviço', () => {
  test.each([
    [-0.01, 400],
    [0, 201],
    [0.01, 201],
    [99999999.99, 201],
    [100000000, 400]
  ])('valor %s deve retornar %s', async (valor, statusEsperado) => {
    const resposta = await http()
      .post('/servicos')
      .set(authHeader(adminA.token))
      .send(payloadServico(clienteAId, falecidoAId, valor))

    expect(resposta.status).toBe(statusEsperado)
  })
})
