const { BeforeAll, AfterAll, After, setWorldConstructor, World } = require('@cucumber/cucumber')
const { spawnSync } = require('child_process')
const path = require('path')
const { ensureBackend, stopAll, QA_ROOT } = require('./server')
const { disconnectAll } = require('./sockets')

let backendIniciadoPeloHook = false

class QAWorld extends World {
  constructor(options) {
    super(options)
    this.resposta = null
    this.conexoes = []
    this.token = null
  }
}

function executarScript(nome) {
  const resultado = spawnSync(process.execPath, [path.join(QA_ROOT, 'scripts', nome)], {
    cwd: QA_ROOT,
    stdio: 'inherit'
  })
  if (resultado.status !== 0) throw new Error(`Falha ao executar ${nome}`)
}

setWorldConstructor(QAWorld)

BeforeAll(async () => {
  executarScript('reset-test-db.js')
  executarScript('seed-test.js')
  backendIniciadoPeloHook = await ensureBackend()
})

After(async function () {
  await disconnectAll(this.conexoes)
})

AfterAll(async () => {
  if (backendIniciadoPeloHook) await stopAll()
})
