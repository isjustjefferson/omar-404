require('../support/env')

const fs = require('fs')
const path = require('path')
const bcrypt = require('bcryptjs')
const { pool, end } = require('../support/db')
const { USUARIOS, CPF_VALIDOS, gerarCpf, formatarCpf } = require('../support/fixtures')

const WEEK_DIR = process.env.QA_WEEK_DIR || 'week5'
const SAIDA_MASSA = path.join(__dirname, '..', 'evidencias', WEEK_DIR, 'massa-dados.md')
const CPFS_SEED = WEEK_DIR === 'week6'
  ? { clienteA1: gerarCpf('555444333'), clienteA2: gerarCpf('666555444'), clienteB1: gerarCpf('777666555'), clienteB2: gerarCpf('888777666') }
  : CPF_VALIDOS

async function main() {
  const client = await pool.connect()
  const senhaHash = await bcrypt.hash('Senha@123', 10)
  const idsUsuarios = {}
  const idsClientes = {}
  const idsFalecidos = {}
  const idsServicos = {}

  try {
    await client.query('BEGIN')

    for (const [chave, usuario] of Object.entries(USUARIOS)) {
      const adminId = chave === 'Operador A1'
        ? idsUsuarios['Admin A']
        : chave === 'Operador B1'
          ? idsUsuarios['Admin B']
          : null

      const resultado = await client.query(
        'INSERT INTO usuarios (nome, email, senha, perfil, admin_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [usuario.nome, usuario.email, senhaHash, usuario.perfil, adminId]
      )
      idsUsuarios[chave] = resultado.rows[0].id
    }

    const clientes = [
      ['A1', 'Cliente A1', CPFS_SEED.clienteA1, 'Admin A'],
      ['A2', 'Cliente A2', CPFS_SEED.clienteA2, 'Admin A'],
      ['B1', 'Cliente B1', CPFS_SEED.clienteB1, 'Admin B'],
      ['B2', 'Cliente B2', CPFS_SEED.clienteB2, 'Admin B'],
      ['D1', 'Cliente D1', gerarCpf('111222333'), 'Admin D']
    ]

    for (const [chave, nome, cpf, admin] of clientes) {
      const resultado = await client.query(
        'INSERT INTO clientes (nome, cpf, telefone, email, admin_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [nome, cpf.replace(/\D/g, ''), '81999999999', `${nome.toLowerCase().replace(/\s+/g, '.')}@teste.com`, idsUsuarios[admin]]
      )
      idsClientes[chave] = resultado.rows[0].id
    }

    const falecidos = [
      ['A1', 'Falecido A1', 'A1', 'Admin A'],
      ['A2', 'Falecido A2', 'A2', 'Admin A'],
      ['B1', 'Falecido B1', 'B1', 'Admin B'],
      ['B2', 'Falecido B2', 'B2', 'Admin B']
    ]

    for (const [chave, nome, cliente, admin] of falecidos) {
      const resultado = await client.query(
        'INSERT INTO falecidos (nome, data_nascimento, data_falecimento, causa_morte, cliente_id, admin_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
        [nome, '1950-01-01', '2020-05-10', 'Causa teste', idsClientes[cliente], idsUsuarios[admin]]
      )
      idsFalecidos[chave] = resultado.rows[0].id
    }

    for (const [chave, falecido, cliente, admin] of [
      ['A1', 'A1', 'A1', 'Admin A'],
      ['A2', 'A2', 'A2', 'Admin A'],
      ['B1', 'B1', 'B1', 'Admin B'],
      ['B2', 'B2', 'B2', 'Admin B']
    ]) {
      const resultado = await client.query(
        'INSERT INTO servicos (tipo, descricao, valor, falecido_id, cliente_id, admin_id, status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        ['Velório', 'Serviço inicial de teste', 1500, idsFalecidos[falecido], idsClientes[cliente], idsUsuarios[admin], 'pendente']
      )
      idsServicos[chave] = resultado.rows[0].id
    }

    await client.query('COMMIT')

    const tituloSemana = WEEK_DIR === 'week6' ? 'Semana 6' : 'Semana 5'
    const linhas = [
      `# Massa de dados - ${tituloSemana}`,
      '',
      `Senha comum: \`${'Senha@123'}\``,
      '',
      ...(WEEK_DIR === 'week6'
        ? [
            'CPFs reservados para CT17/CT21: `529.982.247-25` e `11144477735`.',
            'E-mails de CT05/CT06 são gerados automaticamente e não fazem parte desta massa fixa.',
            ''
          ]
        : []),
      '## Usuários',
      '',
      '| Nome | E-mail | Perfil | Vínculo | ID |',
      '| --- | --- | --- | --- | --- |'
    ]

    for (const [chave, usuario] of Object.entries(USUARIOS)) {
      const vinculo = idsUsuarios[chave] && usuario.perfil === 'operador'
        ? (chave === 'Operador órfão' ? 'sem admin' : chave === 'Operador A1' ? 'Admin A' : 'Admin B')
        : '-'
      linhas.push(`| ${usuario.nome} | ${usuario.email} | ${usuario.perfil} | ${vinculo} | ${idsUsuarios[chave]} |`)
    }

    linhas.push('', '## Clientes', '', '| Nome | CPF | Admin | ID |', '| --- | --- | --- | --- |')
    for (const [chave, nome, cpf, admin] of clientes) {
      linhas.push(`| ${nome} | ${formatarCpf(cpf)} | ${admin} | ${idsClientes[chave]} |`)
    }

    linhas.push('', '## Falecidos e serviços', '', '| Falecido | Cliente | Serviço | ID |', '| --- | --- | --- | --- |')
    for (const chave of ['A1', 'A2', 'B1', 'B2']) {
      linhas.push(`| Falecido ${chave} (${idsFalecidos[chave]}) | Cliente ${chave} (${idsClientes[chave]}) | Serviço ${chave} (${idsServicos[chave]}) | ${idsServicos[chave]} |`)
    }

    linhas.push('', '## CPFs inválidos previstos', '', '- 111.111.111-11', '- 529.982.247-24', '- 5299822472', '- 529982247250', '- abcdefghijk', '')

    fs.mkdirSync(path.dirname(SAIDA_MASSA), { recursive: true })
    fs.writeFileSync(SAIDA_MASSA, linhas.join('\n'))

    console.log('Massa de dados de teste criada.')
  } catch (erro) {
    await client.query('ROLLBACK')
    throw erro
  } finally {
    client.release()
    await end()
  }
}

main().catch((erro) => {
  console.error(erro)
  process.exit(1)
})
