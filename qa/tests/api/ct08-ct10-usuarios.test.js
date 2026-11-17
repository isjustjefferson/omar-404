require('../../support/env')
const { http, loginOrThrow, authHeader } = require('../../support/auth')
const { USUARIOS } = require('../../support/fixtures')

let adminA
let adminB
let operadorA1
let operadorB1

async function totalUsuarios() {
  const resposta = await http().get('/users').set(authHeader(adminA.token))
  return Array.isArray(resposta.body) ? resposta.body.length : -1
}

beforeAll(async () => {
  adminA = await loginOrThrow(USUARIOS['Admin A'].email, USUARIOS['Admin A'].senha)
  adminB = await loginOrThrow(USUARIOS['Admin B'].email, USUARIOS['Admin B'].senha)
  operadorA1 = await loginOrThrow(USUARIOS['Operador A1'].email, USUARIOS['Operador A1'].senha)
  operadorB1 = await loginOrThrow(USUARIOS['Operador B1'].email, USUARIOS['Operador B1'].senha)
})

describe('CT08 - Controle de acesso em usuários', () => {
  test('operador não consulta, edita nem remove usuários', async () => {
    const antes = await totalUsuarios()
    const alvo = adminB.usuario.id

    const operacoes = [
      { metodo: 'get', rota: '/users' },
      { metodo: 'get', rota: '/users/operadores' },
      {
        metodo: 'post',
        rota: '/users/operadores',
        corpo: {
          nome: 'Operador Invasor',
          email: `operador.invasor.${Date.now()}@teste.com`,
          senha: 'Senha@123'
        }
      },
      { metodo: 'delete', rota: `/users/${alvo}` }
    ]

    for (const operacao of operacoes) {
      let requisicao = http()[operacao.metodo](operacao.rota).set(authHeader(operadorA1.token))
      if (operacao.corpo) requisicao = requisicao.send(operacao.corpo)
      const resposta = await requisicao

      expect(resposta.status).toBe(403)
      expect(await totalUsuarios()).toBe(antes)
    }
  })
})

describe('CT09 - Auto-registro de administrador', () => {
  test('não permite criar administrador via /auth/register', async () => {
    const antes = await totalUsuarios()
    const email = 'admin.invasor@teste.com'

    const resposta = await http().post('/auth/register').send({
      nome: 'Admin Invasor',
      email,
      senha: 'Senha@123',
      perfil: 'admin'
    })

    expect([401, 403]).toContain(resposta.status)
    expect(await totalUsuarios()).toBe(antes)

    const tentativaLogin = await http().post('/auth/login').send({ email, senha: 'Senha@123' })
    expect(tentativaLogin.status).toBe(401)
  })
})

describe('CT10 - Remoção de operadores', () => {
  test('(a) admin remove operador do próprio vínculo', async () => {
    const antes = await totalUsuarios()
    const resposta = await http()
      .delete(`/users/${operadorA1.usuario.id}`)
      .set(authHeader(adminA.token))

    expect(resposta.status).toBe(200)
    expect(resposta.body.mensagem).toBe('Usuário removido com sucesso.')
    expect(await totalUsuarios()).toBe(antes - 1)
  })

  test('(b) não remove operador de outro administrador', async () => {
    const antes = await totalUsuarios()
    const resposta = await http()
      .delete(`/users/${operadorB1.usuario.id}`)
      .set(authHeader(adminA.token))

    expect([400, 403]).toContain(resposta.status)
    expect(await totalUsuarios()).toBe(antes)
  })

  test('(c) não remove outro administrador', async () => {
    const antes = await totalUsuarios()
    const resposta = await http()
      .delete(`/users/${adminB.usuario.id}`)
      .set(authHeader(adminA.token))

    expect([400, 403]).toContain(resposta.status)
    expect(await totalUsuarios()).toBe(antes)
  })

  test('(d) ID inexistente retorna 404', async () => {
    const antes = await totalUsuarios()
    const resposta = await http()
      .delete('/users/999999')
      .set(authHeader(adminA.token))

    expect(resposta.status).toBe(404)
    expect(await totalUsuarios()).toBe(antes)
  })
})
