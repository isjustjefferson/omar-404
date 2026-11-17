require('../support/env')

const { spawnSync } = require('child_process')
const path = require('path')
const { ensureBackend, QA_ROOT } = require('../support/server')

function executarScript(nome) {
  const resultado = spawnSync(process.execPath, [path.join(QA_ROOT, 'scripts', nome)], {
    cwd: QA_ROOT,
    stdio: 'inherit'
  })
  if (resultado.status !== 0) {
    throw new Error(`Falha ao executar ${nome}`)
  }
}

module.exports = async () => {
  executarScript('reset-test-db.js')
  executarScript('seed-test.js')
  await ensureBackend()
}
