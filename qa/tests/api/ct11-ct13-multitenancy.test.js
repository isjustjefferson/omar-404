require('../../support/env')
const { http, loginOrThrow, authHeader } = require('../../support/auth')
const { query } = require('../../support/db')
const { USUARIOS, CPF_VALIDOS, payloadCliente, payloadFalecido, payloadServico } = require('../../support/fixtures')

let usuarios

async function listar(token, rota) {
  const resposta = await http().get(rota).set(authHeader(token))
  expect(resposta.status).toBe(200)
  return resposta.body
}

async function totalTabela(tabela) {
  const resultado = await query(`SELECT COUNT(*)::int AS total FROM ${tabela}`)
  return resultado.rows[0].total
}

beforeAll(async () => {
  usuarios = {}
  for (const chave of Object.keys(USUARIOS)) {
    const usuario = USUARIOS[chave]
    usuarios[chave] = await loginOrThrow(usuario.email, usuario.senha)
  }
})

describe('CT11 - Isolamento por administrador', () => {
  test.each([
    ['Admin A', 'Admin A'],
    ['Operador A1', 'Admin A'],
    ['Admin B', 'Admin B'],
    ['Operador B1', 'Admin B']
  ])('%s vê somente registros de %s', async (chaveLogin, chaveDono) => {
    const token = usuarios[chaveLogin].token
    const adminId = usuarios[chaveDono].usuario.id

    for (const rota of ['/clientes', '/falecidos', '/servicos']) {
      const registros = await listar(token, rota)
      expect(registros.length).toBeGreaterThan(0)
      expect(registros.every((registro) => registro.admin_id === adminId)).toBe(true)
    }
  })

  test('operador órfão recebe erro sem vínculo', async () => {
    const resposta = await http()
      .get('/clientes')
      .set(authHeader(usuarios['Operador órfão'].token))

    expect(resposta.status).toBe(500)
    expect(resposta.body.erro).toBe('Operador sem administrador vinculado.')
  })
})

describe('CT12 - Acesso a registros de outro administrador', () => {
  test('admin B não consulta, altera nem remove registros de A', async () => {
    const clientes = await listar(usuarios['Admin A'].token, '/clientes')
    const falecidos = await listar(usuarios['Admin A'].token, '/falecidos')
    const servicos = await listar(usuarios['Admin A'].token, '/servicos')

    const clienteId = clientes[0].id
    const falecidoId = falecidos[0].id
    const servicoId = servicos[0].id

    const operacoes = [
      { metodo: 'get', rota: `/clientes/${clienteId}` },
      { metodo: 'put', rota: `/clientes/${clienteId}`, corpo: payloadCliente(CPF_VALIDOS.clienteA1, 'Cliente Invadido') },
      { metodo: 'delete', rota: `/clientes/${clienteId}` },
      { metodo: 'get', rota: `/falecidos/${falecidoId}` },
      { metodo: 'put', rota: `/falecidos/${falecidoId}`, corpo: payloadFalecido(clienteId, 'Falecido Invadido') },
      { metodo: 'delete', rota: `/falecidos/${falecidoId}` },
      { metodo: 'get', rota: `/servicos/${servicoId}` },
      { metodo: 'put', rota: `/servicos/${servicoId}`, corpo: payloadServico(clienteId, falecidoId) },
      { metodo: 'patch', rota: `/servicos/${servicoId}/status`, corpo: { status: 'concluido' } },
      { metodo: 'delete', rota: `/servicos/${servicoId}` }
    ]

    for (const chave of ['Admin B']) {
      for (const operacao of operacoes) {
        let requisicao = http()[operacao.metodo](operacao.rota).set(authHeader(usuarios[chave].token))
        if (operacao.corpo) requisicao = requisicao.send(operacao.corpo)
        const resposta = await requisicao
        expect(resposta.status).toBe(404)
      }
    }

    const clientesDepois = await listar(usuarios['Admin A'].token, '/clientes')
    const falecidosDepois = await listar(usuarios['Admin A'].token, '/falecidos')
    const servicosDepois = await listar(usuarios['Admin A'].token, '/servicos')

    expect(clientesDepois).toEqual(clientes)
    expect(falecidosDepois).toEqual(falecidos)
    expect(servicosDepois).toEqual(servicos)
  })
})

describe('CT13 - Criação com vínculo de outro administrador', () => {
  test('não cria falecido nem serviço usando cliente de outro administrador', async () => {
    const clientesA = await listar(usuarios['Admin A'].token, '/clientes')
    const falecidosA = await listar(usuarios['Admin A'].token, '/falecidos')
    const clienteId = clientesA.find((cliente) => cliente.admin_id === usuarios['Admin A'].usuario.id).id
    const falecidoId = falecidosA.find((falecido) => falecido.admin_id === usuarios['Admin A'].usuario.id).id

    const totalFalecidosAntes = await totalTabela('falecidos')
    const totalServicosAntes = await totalTabela('servicos')

    const respostaFalecido = await http()
      .post('/falecidos')
      .set(authHeader(usuarios['Admin B'].token))
      .send(payloadFalecido(clienteId, 'Falecido Invadido'))

    const respostaServico = await http()
      .post('/servicos')
      .set(authHeader(usuarios['Admin B'].token))
      .send(payloadServico(clienteId, falecidoId))

    expect([400, 403]).toContain(respostaFalecido.status)
    expect([400, 403]).toContain(respostaServico.status)
    expect(await totalTabela('falecidos')).toBe(totalFalecidosAntes)
    expect(await totalTabela('servicos')).toBe(totalServicosAntes)
  })
})
