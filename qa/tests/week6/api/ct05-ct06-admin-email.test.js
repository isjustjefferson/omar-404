const { http, loginOrThrow } = require('../../../support/auth')
const { pool } = require('../../../support/db')
const { USUARIOS, emailUnico } = require('../../../support/fixtures')

jest.setTimeout(120000)

const SENHA = 'Senha@123'

async function solicitar(email, nome) {
  return http().post('/auth/admin/solicitar').send({ nome, email, senha: SENHA })
}

async function confirmar(email, codigo) {
  return http().post('/auth/admin/confirmar').send({ email, codigo })
}

async function obterVerificacao(email) {
  const resultado = await pool.query(
    'SELECT id, codigo, expira_em, usado FROM verificacoes_email WHERE email = $1 ORDER BY criado_em DESC, id DESC LIMIT 1',
    [email]
  )
  return resultado.rows[0]
}

async function ajustarExpiracao(email, deslocamentoMs) {
  const verificacao = await obterVerificacao(email)
  await pool.query('UPDATE verificacoes_email SET expira_em = $1 WHERE id = $2', [
    new Date(Date.now() + deslocamentoMs),
    verificacao.id
  ])
}

describe('CT05 e CT06 - Cadastro de administrador por e-mail', () => {
  test('CT05 - solicitação, confirmação e login com e-mail novo', async () => {
    const email = emailUnico('ct05')
    const solicitacao = await solicitar(email, 'Admin CT05')

    expect(solicitacao.status).toBe(200)
    expect(solicitacao.body.mensagem).toMatch(/15 minutos/)

    const verificacao = await obterVerificacao(email)
    expect(verificacao).toBeDefined()
    expect(verificacao.usado).toBe(false)

    const confirmacao = await confirmar(email, verificacao.codigo)
    expect(confirmacao.status).toBe(201)
    expect(confirmacao.body.usuario.perfil).toBe('admin')
    expect(confirmacao.body.usuario.email).toBe(email)

    const login = await loginOrThrow(email, SENHA)
    expect(login.usuario.perfil).toBe('admin')
  })

  test('CT06(a) - código correto confirmado 14 min 59 s após a solicitação', async () => {
    const email = emailUnico('ct06a')
    await solicitar(email, 'Admin CT06A')
    await ajustarExpiracao(email, (14 * 60 + 59) * 1000)

    const verificacao = await obterVerificacao(email)
    const resposta = await confirmar(email, verificacao.codigo)

    expect(resposta.status).toBe(201)
    expect(resposta.body.usuario.perfil).toBe('admin')
  })

  test('CT06(b) - código correto confirmado 15 min 1 s após a solicitação', async () => {
    const email = emailUnico('ct06b')
    await solicitar(email, 'Admin CT06B')
    await ajustarExpiracao(email, -(1 * 1000))

    const verificacao = await obterVerificacao(email)
    const resposta = await confirmar(email, verificacao.codigo)

    expect(resposta.status).toBe(400)
    expect(resposta.body.erro).toBe('Código expirado. Solicite um novo.')
  })

  test('CT06(c) - código errado', async () => {
    const email = emailUnico('ct06c')
    await solicitar(email, 'Admin CT06C')

    const resposta = await confirmar(email, '000000')

    expect(resposta.status).toBe(400)
    expect(resposta.body.erro).toBe('Código inválido.')
  })

  test('CT06(d) - reutilização do mesmo código após confirmação', async () => {
    const email = emailUnico('ct06d')
    await solicitar(email, 'Admin CT06D')

    const verificacao = await obterVerificacao(email)
    const primeira = await confirmar(email, verificacao.codigo)
    const segunda = await confirmar(email, verificacao.codigo)

    expect(primeira.status).toBe(201)
    expect(segunda.status).toBe(400)
    expect(segunda.body.erro).toBe('Código inválido.')
  })

  test('CT06(e) - solicitação com e-mail de administrador já cadastrado', async () => {
    const resposta = await solicitar(USUARIOS['Admin A'].email, 'Admin duplicado')

    expect(resposta.status).toBe(409)
    expect(resposta.body.erro).toBe('Email já cadastrado.')
  })

  test('CT06(f) - segunda solicitação invalida o código da primeira', async () => {
    const email = emailUnico('ct06f')
    await solicitar(email, 'Admin CT06F')
    const primeira = await obterVerificacao(email)

    await solicitar(email, 'Admin CT06F')
    const segunda = await obterVerificacao(email)

    const codigoAntigo = await confirmar(email, primeira.codigo)
    expect(codigoAntigo.status).toBe(400)
    expect(codigoAntigo.body.erro).toBe('Código inválido.')

    const codigoAtual = await confirmar(email, segunda.codigo)
    expect(codigoAtual.status).toBe(201)
    expect(codigoAtual.body.usuario.email).toBe(email)
  })
})
