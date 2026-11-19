const { http, authHeader, loginOrThrow } = require('../../../support/auth')
const { pool } = require('../../../support/db')
const { gerarCpf, payloadCliente } = require('../../../support/fixtures')

jest.setTimeout(60000)

let tokenAdmin

async function criarCliente(cpf, nome) {
  return http().post('/clientes').set(authHeader(tokenAdmin)).send(payloadCliente(cpf, nome))
}

async function limparCpfs(cpfs) {
  await pool.query('DELETE FROM clientes WHERE cpf = ANY($1)', [cpfs])
}

async function clienteExiste(id) {
  const resultado = await pool.query('SELECT id FROM clientes WHERE id = $1', [id])
  return resultado.rows.length > 0
}

async function falecidoExiste(id) {
  const resultado = await pool.query('SELECT id FROM falecidos WHERE id = $1', [id])
  return resultado.rows.length > 0
}

beforeAll(async () => {
  const login = await loginOrThrow('admina@teste.com', 'Senha@123')
  tokenAdmin = login.token
})

describe('CT17 - CPF válido e tamanho do CPF', () => {
  beforeAll(async () => {
    await limparCpfs(['529.982.247-25', '52998224725', '11144477735'])
  })

  test.each([
    ['(a) CPF válido com máscara', '529.982.247-25', 201, null],
    ['(b) CPF válido sem máscara', '11144477735', 201, null],
    ['(c) CPF com 10 dígitos', '5299822472', 400, 'CPF inválido.'],
    ['(d) CPF com 12 dígitos', '529982247250', 400, 'CPF inválido.']
  ])('%s', async (_rotulo, cpf, statusEsperado, erroEsperado) => {
    const resposta = await criarCliente(cpf, `Cliente CT17 ${String(cpf).replace(/\D/g, '').slice(-4)}`)

    expect(resposta.status).toBe(statusEsperado)
    if (erroEsperado) expect(resposta.body.erro).toBe(erroEsperado)
    else expect(resposta.body.id).toBeDefined()
  })
})

describe('CT18 - CPF inválido e campos obrigatórios na API', () => {
  test.each([
    ['(a) CPF com dígitos repetidos', { nome: 'Cliente CT18 A', cpf: '111.111.111-11' }, 'CPF inválido.'],
    ['(b) CPF com dígito verificador errado', { nome: 'Cliente CT18 B', cpf: '529.982.247-24' }, 'CPF inválido.'],
    ['(c) CPF com letras', { nome: 'Cliente CT18 C', cpf: 'abcdefghijk' }, 'CPF inválido.'],
    ['(d) sem nome', { cpf: '52998224725' }, 'Nome e CPF são obrigatórios.'],
    ['(e) sem CPF', { nome: 'Cliente CT18 sem CPF' }, 'Nome e CPF são obrigatórios.'],
    ['(f) corpo vazio', {}, 'Nome e CPF são obrigatórios.']
  ])('%s', async (_rotulo, corpo, erroEsperado) => {
    const resposta = await http()
      .post('/clientes')
      .set(authHeader(tokenAdmin))
      .send(corpo)

    expect(resposta.status).toBe(400)
    expect(resposta.body.erro).toBe(erroEsperado)
  })
})

describe('CT19 - CPF duplicado', () => {
  const cpfBase = '52998224725'

  beforeAll(async () => {
    await limparCpfs([cpfBase, '529.982.247-25'])
  })

  test('(a) e (b) máscara e número sem máscara não criam duplicidade', async () => {
    const cadastro = await criarCliente(cpfBase, 'Cliente CT19 Base')
    expect(cadastro.status).toBe(201)

    for (const [rotulo, cpf] of [
      ['(a) com máscara', '529.982.247-25'],
      ['(b) sem máscara', cpfBase]
    ]) {
      const resposta = await criarCliente(cpf, `Cliente CT19 ${rotulo}`)
      expect(resposta.status).toBe(400)
      expect(resposta.body.erro).toBe('CPF já cadastrado.')
    }

    const total = await pool.query(
      "SELECT COUNT(*)::int AS total FROM clientes WHERE REPLACE(REPLACE(cpf, '.', ''), '-', '') = '52998224725'"
    )
    expect(total.rows[0].total).toBe(1)
  })
})

describe('CT20 - Atualização do cliente e remoções com vínculos', () => {
  let clienteComFalecido
  let cpfOriginal
  let clienteSemVinculo
  let clienteParaFalecidoSemServico
  let falecidoComServico
  let falecidoSemServico

  beforeAll(async () => {
    const cliente = await pool.query("SELECT id, cpf FROM clientes WHERE nome = 'Cliente A1' ORDER BY id LIMIT 1")
    clienteComFalecido = cliente.rows[0]
    cpfOriginal = clienteComFalecido.cpf

    const falecido = await pool.query('SELECT id FROM falecidos WHERE cliente_id = $1 ORDER BY id LIMIT 1', [clienteComFalecido.id])
    falecidoComServico = falecido.rows[0]

    const cpfSemVinculo = gerarCpf('999888777')
    const cpfFalecidoSemServico = gerarCpf('888999666')
    await limparCpfs([cpfSemVinculo, cpfFalecidoSemServico])

    const criacaoSemVinculo = await criarCliente(cpfSemVinculo, 'Cliente CT20 Sem Vinculo')
    clienteSemVinculo = criacaoSemVinculo.body

    const criacaoParaFalecido = await criarCliente(cpfFalecidoSemServico, 'Cliente CT20 Falecido Sem Servico')
    clienteParaFalecidoSemServico = criacaoParaFalecido.body

    const criacaoFalecido = await http()
      .post('/falecidos')
      .set(authHeader(tokenAdmin))
      .send({
        nome: 'Falecido CT20 Sem Servico',
        data_falecimento: '2020-01-01',
        cliente_id: clienteParaFalecidoSemServico.id
      })
    falecidoSemServico = criacaoFalecido.body
  })

  test('(a) atualiza nome, telefone e e-mail e mantém o CPF original', async () => {
    const resposta = await http()
      .put(`/clientes/${clienteComFalecido.id}`)
      .set(authHeader(tokenAdmin))
      .send({
        nome: 'Cliente CT20 Atualizado',
        telefone: '81977777777',
        email: 'ct20-atualizado@teste.com',
        cpf: gerarCpf('777666999')
      })

    expect(resposta.status).toBe(200)
    expect(resposta.body.nome).toBe('Cliente CT20 Atualizado')
    expect(resposta.body.telefone).toBe('81977777777')
    expect(resposta.body.email).toBe('ct20-atualizado@teste.com')

    const consulta = await pool.query('SELECT cpf FROM clientes WHERE id = $1', [clienteComFalecido.id])
    expect(consulta.rows[0].cpf).toBe(cpfOriginal)
  })

  test('(b) remove cliente sem vínculo e bloqueia cliente com falecido', async () => {
    const comVinculo = await http()
      .delete(`/clientes/${clienteComFalecido.id}`)
      .set(authHeader(tokenAdmin))

    expect(comVinculo.status).toBe(400)
    expect(comVinculo.body.erro).toMatch(/falecidos vinculados/)
    expect(await clienteExiste(clienteComFalecido.id)).toBe(true)

    const semVinculo = await http()
      .delete(`/clientes/${clienteSemVinculo.id}`)
      .set(authHeader(tokenAdmin))

    expect(semVinculo.status).toBe(200)
    expect(semVinculo.body.mensagem).toBe('Cliente removido com sucesso.')
    expect(await clienteExiste(clienteSemVinculo.id)).toBe(false)
  })

  test('(c) bloqueia falecido com serviço e remove falecido sem serviço', async () => {
    const comServico = await http()
      .delete(`/falecidos/${falecidoComServico.id}`)
      .set(authHeader(tokenAdmin))

    expect(comServico.status).toBeGreaterThanOrEqual(400)
    expect(await falecidoExiste(falecidoComServico.id)).toBe(true)

    const servico = await pool.query('SELECT id FROM servicos WHERE falecido_id = $1', [falecidoComServico.id])
    expect(servico.rows.length).toBeGreaterThan(0)

    const semServico = await http()
      .delete(`/falecidos/${falecidoSemServico.id}`)
      .set(authHeader(tokenAdmin))

    expect(semServico.status).toBe(200)
    expect(semServico.body.mensagem).toBe('Falecido removido com sucesso.')
    expect(await falecidoExiste(falecidoSemServico.id)).toBe(false)
  })
})
