const { http, authHeader, loginOrThrow } = require('../../../support/auth')
const { pool } = require('../../../support/db')
const { USUARIOS, dataISO } = require('../../../support/fixtures')

jest.setTimeout(60000)

let tokenAdminA
let tokenAdminC
let clienteAdminAId

beforeAll(async () => {
  tokenAdminA = (await loginOrThrow(USUARIOS['Admin A'].email, USUARIOS['Admin A'].senha)).token
  tokenAdminC = (await loginOrThrow(USUARIOS['Admin C'].email, USUARIOS['Admin C'].senha)).token

  const cliente = await pool.query("SELECT id FROM clientes WHERE nome = 'Cliente A1' ORDER BY id LIMIT 1")
  clienteAdminAId = cliente.rows[0].id
})

async function criarFalecido(token, corpo) {
  return http().post('/falecidos').set(authHeader(token)).send(corpo)
}

async function contarFalecidos(nome) {
  const resultado = await pool.query('SELECT COUNT(*)::int AS total FROM falecidos WHERE nome = $1', [nome])
  return resultado.rows[0].total
}

describe('CT22 - Datas do falecido', () => {
  test.each([
    ['(a) falecimento igual ao nascimento', dataISO(-10), dataISO(-10), 201, null],
    ['(b) falecimento igual ao dia de hoje', dataISO(-5), dataISO(0), 201, null],
    ['(c) apenas nome, falecimento e cliente', undefined, dataISO(-5), 201, null],
    ['(d) falecimento 1 dia antes do nascimento', dataISO(0), dataISO(-1), 400, /nascimento/i],
    ['(e) falecimento amanhã', dataISO(-10), dataISO(1), 400, /futura/i],
    ['(f) nascimento amanhã', dataISO(1), dataISO(0), 400, /nascimento|futura/i]
  ])('%s', async (_rotulo, nascimento, falecimento, statusEsperado, erroEsperado) => {
    const nome = `Falecido CT22 ${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const corpo = {
      nome,
      data_falecimento: falecimento,
      cliente_id: clienteAdminAId
    }
    if (nascimento) corpo.data_nascimento = nascimento

    const resposta = await criarFalecido(tokenAdminA, corpo)

    expect(resposta.status).toBe(statusEsperado)
    if (erroEsperado) {
      expect(resposta.body.erro).toMatch(erroEsperado)
      expect(await contarFalecidos(nome)).toBe(0)
    } else {
      expect(resposta.body.id).toBeDefined()
    }
  })
})

describe('CT23 - Campos obrigatórios e pré-condição de cliente', () => {
  test.each([
    ['sem nome', { data_falecimento: '2020-01-01', cliente_id: 1 }],
    ['sem data de falecimento', { nome: 'Falecido CT23 sem data', cliente_id: 1 }],
    ['sem cliente_id', { nome: 'Falecido CT23 sem cliente', data_falecimento: '2020-01-01' }]
  ])('(a) %s com Admin A', async (_rotulo, corpo) => {
    const resposta = await criarFalecido(tokenAdminA, corpo)

    expect(resposta.status).toBe(400)
    expect(resposta.body.erro).toBe('Nome, data de falecimento e cliente são obrigatórios.')
  })

  test('(b) Admin C sem clientes recebe orientação para cadastrar cliente', async () => {
    const resposta = await criarFalecido(tokenAdminC, {
      nome: 'Falecido CT23 Admin C',
      data_falecimento: '2020-01-01',
      cliente_id: clienteAdminAId
    })

    expect(resposta.status).toBe(422)
    expect(resposta.body.erro).toMatch(/clientes cadastrados/i)
  })
})
