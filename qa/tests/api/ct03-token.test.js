const jwt = require('jsonwebtoken')
require('../../support/env')
const { http, authHeader } = require('../../support/auth')

function gerarToken(segundos, segredo = process.env.JWT_SECRET) {
  return jwt.sign(
    { id: 1, nome: 'Usuário token', perfil: 'admin' },
    segredo,
    { expiresIn: segundos }
  )
}

describe('CT03 - Token JWT', () => {
  test('(a) token dentro da validade é aceito', async () => {
    const resposta = await http()
      .get('/clientes')
      .set(authHeader(gerarToken(3600)))

    expect(resposta.status).toBe(200)
    expect(Array.isArray(resposta.body)).toBe(true)
  })

  test('(b) token expirado é recusado', async () => {
    const resposta = await http()
      .get('/clientes')
      .set(authHeader(gerarToken(-1)))

    expect(resposta.status).toBe(401)
    expect(resposta.body.erro).toBe('Token inválido ou expirado')
    expect(resposta.body).not.toHaveProperty('id')
    expect(Array.isArray(resposta.body)).toBe(false)
  })

  test('(c) requisição sem token é recusada', async () => {
    const resposta = await http().get('/clientes')

    expect(resposta.status).toBe(401)
    expect(resposta.body.erro).toBe('Token não fornecido.')
    expect(Array.isArray(resposta.body)).toBe(false)
  })

  test('(d) token com assinatura alterada é recusado', async () => {
    const resposta = await http()
      .get('/clientes')
      .set(authHeader(gerarToken(3600, 'segredo-invalido')))

    expect(resposta.status).toBe(401)
    expect(resposta.body.erro).toBe('Token inválido ou expirado')
    expect(Array.isArray(resposta.body)).toBe(false)
  })
})
