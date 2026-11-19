process.env.QA_WEEK_DIR = 'week6'

const fs = require('fs')
const path = require('path')
const { spawn } = require('child_process')
const { ensureBackend, ensureFrontend, stopAll, loadEnv, QA_ROOT, LOG_DIR } = require('../support/server')

const npmComando = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const shellNpm = process.platform === 'win32'

const COMANDOS_INICIAIS = [
  { nome: 'setup-inicial', comando: process.execPath, args: ['scripts/reset-test-db.js'] },
  { nome: 'seed-inicial', comando: process.execPath, args: ['scripts/seed-test.js'] }
]

const COMANDOS = [
  { nome: 'setup-api', comando: process.execPath, args: ['scripts/reset-test-db.js'] },
  { nome: 'setup-api-seed', comando: process.execPath, args: ['scripts/seed-test.js'] },
  { nome: 'jest-api', comando: npmComando, args: ['run', 'test:week6:api'], shell: shellNpm },
  { nome: 'setup-unit', comando: process.execPath, args: ['scripts/reset-test-db.js'] },
  { nome: 'setup-unit-seed', comando: process.execPath, args: ['scripts/seed-test.js'] },
  { nome: 'jest-unit', comando: npmComando, args: ['run', 'test:week6:unit'], shell: shellNpm },
  { nome: 'setup-e2e', comando: process.execPath, args: ['scripts/reset-test-db.js'] },
  { nome: 'setup-e2e-seed', comando: process.execPath, args: ['scripts/seed-test.js'] },
  { nome: 'cypress', comando: npmComando, args: ['run', 'test:week6:e2e'], shell: shellNpm }
]

function executarComando(etapa) {
  return new Promise((resolve) => {
    fs.mkdirSync(LOG_DIR, { recursive: true })
    const arquivoLog = path.join(LOG_DIR, `${etapa.nome}.log`)
    const saida = fs.openSync(arquivoLog, 'w')
    const child = spawn(etapa.comando, etapa.args, {
      cwd: QA_ROOT,
      env: { ...process.env, ...loadEnv() },
      shell: Boolean(etapa.shell),
      stdio: ['ignore', saida, saida]
    })

    process.stdout.write(`[${etapa.nome}] iniciado\n`)

    child.on('close', (codigo) => {
      fs.closeSync(saida)
      process.stdout.write(`[${etapa.nome}] finalizado com código ${codigo}\n`)
      resolve({ ...etapa, codigo })
    })
  })
}

function obterCommit() {
  const gitDir = path.join(QA_ROOT, '..', '.git')
  try {
    const head = fs.readFileSync(path.join(gitDir, 'HEAD'), 'utf8').trim()
    if (!head.startsWith('ref:')) return head
    const caminhoRef = path.join(gitDir, head.slice(5).trim())
    if (fs.existsSync(caminhoRef)) return fs.readFileSync(caminhoRef, 'utf8').trim()
    return head
  } catch {
    return 'indisponível'
  }
}

function escreverRelatorio(resultados) {
  const destino = path.join(QA_ROOT, 'evidencias', 'week6')
  fs.mkdirSync(destino, { recursive: true })

  const agora = new Date().toISOString()
  const falhas = resultados.filter((resultado) => resultado.codigo !== 0)
  const linhas = [
    '# Relatório de automação - Semana 6',
    '',
    `- Data/hora: ${agora}`,
    `- Commit testado: ${obterCommit()}`,
    '- Projeto: Omar-404 - Sistema de Administração de Funerária',
    '- Ambiente: Windows, Node.js, PostgreSQL 18 (WSL2), Redis 8 (WSL2)',
    '- Banco de teste: omar404_test',
    '- Redis lógico: /1',
    '- API: http://localhost:3000',
    '- Frontend: http://localhost:5173',
    '- Preparação de ambiente, massa de dados e automação: Jefferson',
    '- Executor dos casos: Vinícius',
    '- Escopo automatizado: CT05, CT06, CT17, CT18, CT19, CT20, CT21, CT22 e CT23',
    `- Etapas com falha: ${falhas.length}`,
    '',
    'Este relatório registra apenas a execução das suítes. A decisão Aprovado/Reprovado/Bloqueado e o log de execução são de responsabilidade do executor.',
    '',
    '## Comandos executados',
    '',
    '| Etapa | Comando | Código |',
    '| --- | --- | --- |'
  ]

  for (const resultado of resultados) {
    linhas.push(`| ${resultado.nome} | ${resultado.comando} ${resultado.args.join(' ')} | ${resultado.codigo} |`)
  }

  linhas.push(
    '',
    '## Evidências geradas',
    '',
    '- `jest/api-junit.xml`',
    '- `jest/unit-junit.xml`',
    '- `cypress/videos/` e `cypress/screenshots/`',
    '- `massa-dados.md`',
    '- `logs/`',
    '- `roteiro-executor.md`',
    ''
  )

  fs.writeFileSync(path.join(destino, 'relatorio-automacao.md'), linhas.join('\n'))
}

async function main() {
  const resultados = []
  try {
    for (const etapa of COMANDOS_INICIAIS) {
      resultados.push(await executarComando(etapa))
    }

    await ensureBackend()
    await ensureFrontend()

    for (const etapa of COMANDOS) {
      resultados.push(await executarComando(etapa))
    }

    escreverRelatorio(resultados)
    const falhas = resultados.filter((resultado) => resultado.codigo !== 0)
    process.stdout.write(`Execução concluída. ${falhas.length} etapa(s) com falha.\n`)
    process.exitCode = falhas.length ? 1 : 0
  } catch (erro) {
    console.error(erro)
    escreverRelatorio(resultados)
    process.exitCode = 1
  } finally {
    await stopAll()
  }
}

main()
