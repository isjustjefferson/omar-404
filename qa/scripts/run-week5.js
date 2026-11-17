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
  { nome: 'jest-api', comando: npmComando, args: ['run', 'test:api'], shell: shellNpm },
  { nome: 'setup-unit', comando: process.execPath, args: ['scripts/reset-test-db.js'] },
  { nome: 'setup-unit-seed', comando: process.execPath, args: ['scripts/seed-test.js'] },
  { nome: 'jest-unit', comando: npmComando, args: ['run', 'test:unit'], shell: shellNpm },
  { nome: 'setup-events', comando: process.execPath, args: ['scripts/reset-test-db.js'] },
  { nome: 'setup-events-seed', comando: process.execPath, args: ['scripts/seed-test.js'] },
  { nome: 'jest-events', comando: npmComando, args: ['run', 'test:events'], shell: shellNpm },
  { nome: 'setup-bdd', comando: process.execPath, args: ['scripts/reset-test-db.js'] },
  { nome: 'setup-bdd-seed', comando: process.execPath, args: ['scripts/seed-test.js'] },
  { nome: 'cucumber', comando: npmComando, args: ['run', 'test:bdd'], shell: shellNpm },
  { nome: 'setup-e2e', comando: process.execPath, args: ['scripts/reset-test-db.js'] },
  { nome: 'setup-e2e-seed', comando: process.execPath, args: ['scripts/seed-test.js'] },
  { nome: 'cypress', comando: npmComando, args: ['run', 'test:e2e'], shell: shellNpm }
]

const CTS = [
  { id: 'CT01', etapa: 'cucumber' },
  { id: 'CT02', etapa: 'cucumber' },
  { id: 'CT03', etapa: 'jest-api' },
  { id: 'CT04', etapa: 'cypress' },
  { id: 'CT07', etapa: 'cucumber' },
  { id: 'CT08', etapa: 'jest-api' },
  { id: 'CT09', etapa: 'jest-api' },
  { id: 'CT10', etapa: 'jest-api' },
  { id: 'CT11', etapa: 'jest-api' },
  { id: 'CT12', etapa: 'jest-api' },
  { id: 'CT13', etapa: 'jest-api' },
  { id: 'CT14', etapa: 'jest-events' },
  { id: 'CT15', etapa: 'jest-events' },
  { id: 'CT16', etapa: 'manual' },
  { id: 'CT24', etapa: 'jest-api' },
  { id: 'CT25', etapa: 'jest-api' },
  { id: 'CT26', etapa: 'jest-events' },
  { id: 'CT27', etapa: 'jest-events' },
  { id: 'UNIT', etapa: 'jest-unit' }
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

function escreverRelatorios(resultados) {
  const destino = path.join(QA_ROOT, 'evidencias', 'week5')
  fs.mkdirSync(destino, { recursive: true })

  const agora = new Date().toISOString()
  const linhas = [
    '# Relatório de transmissão - Semana 5',
    '',
    `- Data/hora: ${agora}`,
    `- Commit testado: ${obterCommit()}`,
    '- Projeto: Omar-404 - Sistema de Administração de Funerária',
    '- Ambiente: Windows, Node.js, PostgreSQL 18 (WSL2), Redis 8 (WSL2)',
    '- Banco de teste: omar404_test',
    '- Redis lógico: /1',
    '- API: http://localhost:3000',
    '- Frontend: http://localhost:5173',
    '- Executor da automação: Jefferson',
    '- Responsável pela revisão: Vinícius',
    '',
    '## Comandos executados',
    '',
    '| Etapa | Comando | Código |',
    '| --- | --- | --- |'
  ]

  for (const resultado of resultados) {
    linhas.push(`| ${resultado.nome} | ${resultado.comando} ${resultado.args.join(' ')} | ${resultado.codigo} |`)
  }

  linhas.push('', '## Evidências', '', '- `jest/junit.xml`', '- `cucumber/report.html` e `cucumber/report.json`', '- `cypress/videos/` e `cypress/screenshots/`', '- `ct16-manual/roteiro.md`', '- `hipoteses-defeito.md`', '- `massa-dados.md`', '- `logs/`', '')

  fs.writeFileSync(path.join(destino, 'relatorio-transmissao.md'), linhas.join('\n'))

  const etapasComFalha = new Set(resultados.filter((resultado) => resultado.codigo !== 0).map((resultado) => resultado.nome))
  const linhasExecucao = [
    '# Log de execução - Semana 5',
    '',
    `- Data/hora: ${agora}`,
    '',
    '| CT | Técnica | Suíte | Situação da suíte |',
    '| --- | --- | --- | --- |'
  ]

  for (const ct of CTS) {
    const situacao = ct.etapa === 'manual'
      ? 'Execução manual pendente'
      : etapasComFalha.has(ct.etapa)
        ? 'Suíte com falha'
        : 'Suíte executada'
    linhasExecucao.push(`| ${ct.id} | ${ct.etapa === 'manual' ? 'Manual' : 'Automatizada'} | ${ct.etapa} | ${situacao} |`)
  }

  linhasExecucao.push('', 'Os detalhes de cada caso estão nos relatórios JUnit, Cucumber e Cypress.', '')
  fs.writeFileSync(path.join(destino, 'log-execucao.md'), linhasExecucao.join('\n'))
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

    escreverRelatorios(resultados)
    const falhas = resultados.filter((resultado) => resultado.codigo !== 0)
    process.stdout.write(`Execução concluída. ${falhas.length} etapa(s) com falha.\n`)
    process.exitCode = falhas.length ? 1 : 0
  } catch (erro) {
    console.error(erro)
    escreverRelatorios(resultados)
    process.exitCode = 1
  } finally {
    await stopAll()
  }
}

main()
