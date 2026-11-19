const fs = require('fs')
const path = require('path')
const http = require('http')
const net = require('net')
const { spawn, spawnSync, execSync } = require('child_process')
const dotenv = require('dotenv')
const { USUARIOS } = require('./fixtures')

const QA_ROOT = path.join(__dirname, '..')
const STATE_FILE = path.join(QA_ROOT, '.qa-server-state.json')
const ENV_FILE = path.join(QA_ROOT, '.env.test')
const WEEK_DIR = process.env.QA_WEEK_DIR || 'week5'
const LOG_DIR = path.join(QA_ROOT, 'evidencias', WEEK_DIR, 'logs')
const BACKEND_DIR = path.join(QA_ROOT, '..', 'backend')
const FRONTEND_DIR = path.join(QA_ROOT, '..', 'frontend')

function loadEnv() {
  return dotenv.parse(fs.readFileSync(ENV_FILE))
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function ensureLogDir() {
  fs.mkdirSync(LOG_DIR, { recursive: true })
}

function readState() {
  try {
    return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'))
  } catch {
    return {}
  }
}

function saveState(dados) {
  const estado = { ...readState(), ...dados }
  fs.writeFileSync(STATE_FILE, JSON.stringify(estado, null, 2))
}

function clearState() {
  fs.rmSync(STATE_FILE, { force: true })
}

function findPidsByPort(porta) {
  if (process.platform === 'win32') {
    try {
      const saida = execSync('netstat -ano -p TCP', { encoding: 'utf8' })
      return [...new Set(
        saida
          .split(/\r?\n/)
          .filter((linha) => new RegExp(`:${porta}\\s+.*LISTENING\\s+(\\d+)`).test(linha))
          .map((linha) => linha.match(new RegExp(`:${porta}\\s+.*LISTENING\\s+(\\d+)`))[1])
      )].map(Number).filter((pid) => pid && pid !== process.pid)
    } catch {
      return []
    }
  }

  try {
    return execSync(`lsof -ti tcp:${porta}`, { encoding: 'utf8' })
      .split(/\s+/)
      .map(Number)
      .filter((pid) => pid && pid !== process.pid)
  } catch {
    return []
  }
}

function killPort(porta) {
  const pids = findPidsByPort(porta)
  for (const pid of pids) {
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' })
    } else {
      try {
        process.kill(pid, 'SIGTERM')
      } catch {}
    }
  }
  return pids
}

async function waitForPortClosed(porta, timeoutMs = 10000) {
  const inicio = Date.now()
  while (Date.now() - inicio < timeoutMs) {
    if (findPidsByPort(porta).length === 0) return true
    await delay(250)
  }
  return false
}

function httpOk(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume()
      resolve(res.statusCode < 500)
    })
    req.on('error', () => resolve(false))
    req.setTimeout(1000, () => {
      req.destroy()
      resolve(false)
    })
  })
}

async function waitForUrl(url, timeoutMs = 60000) {
  const inicio = Date.now()
  while (Date.now() - inicio < timeoutMs) {
    if (await httpOk(url)) return true
    await delay(500)
  }
  throw new Error(`Timeout aguardando ${url}`)
}

async function isTestBackend() {
  const env = loadEnv()
  const baseUrl = env.BASE_URL || 'http://localhost:3000'
  const usuario = USUARIOS['Admin A']
  try {
    const resposta = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: usuario.email, senha: usuario.senha })
    })
    if (!resposta.ok) return false
    const corpo = await resposta.json()
    return Boolean(corpo.token && corpo.usuario && corpo.usuario.perfil === 'admin')
  } catch {
    return false
  }
}

async function waitForTestBackend(timeoutMs = 60000) {
  const inicio = Date.now()
  while (Date.now() - inicio < timeoutMs) {
    if (await isTestBackend()) return true
    await delay(500)
  }
  throw new Error('Backend de teste não reconhecido após iniciar')
}

function spawnComLog(comando, args, opcoes) {
  ensureLogDir()
  const out = fs.openSync(opcoes.outLog, 'a')
  const err = fs.openSync(opcoes.errLog, 'a')
  const child = spawn(comando, args, {
    cwd: opcoes.cwd,
    env: opcoes.env,
    shell: opcoes.shell || false,
    detached: process.platform !== 'win32',
    stdio: ['ignore', out, err]
  })
  fs.closeSync(out)
  fs.closeSync(err)
  child.unref()
  return child
}

async function ensureBackend() {
  if (await isTestBackend()) {
    clearState()
    return false
  }

  const env = { ...process.env, ...loadEnv() }
  killPort(3000)
  await waitForPortClosed(3000)

  const child = spawnComLog(process.execPath, [path.join(BACKEND_DIR, 'index.js')], {
    cwd: BACKEND_DIR,
    env,
    outLog: path.join(LOG_DIR, 'backend.out.log'),
    errLog: path.join(LOG_DIR, 'backend.err.log')
  })
  saveState({ backendPid: child.pid })

  await waitForUrl(env.BASE_URL || 'http://localhost:3000')
  await waitForTestBackend()
  return true
}

async function ensureFrontend() {
  const env = { ...process.env, ...loadEnv(), VITE_API_URL: loadEnv().BASE_URL || 'http://localhost:3000' }
  killPort(5173)
  await waitForPortClosed(5173)

  const npmComando = process.platform === 'win32' ? 'npm.cmd' : 'npm'
  const child = spawnComLog(npmComando, ['run', 'dev', '--', '--port', '5173', '--strictPort'], {
    cwd: FRONTEND_DIR,
    env,
    shell: process.platform === 'win32',
    outLog: path.join(LOG_DIR, 'frontend.out.log'),
    errLog: path.join(LOG_DIR, 'frontend.err.log')
  })

  saveState({ frontendPid: child.pid })
  await waitForUrl(env.FRONTEND_URL || 'http://localhost:5173')
  return true
}

async function stopAll() {
  const estado = readState()
  for (const pid of [estado.frontendPid, estado.backendPid]) {
    if (!pid) continue
    if (process.platform === 'win32') {
      spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' })
    } else {
      try {
        process.kill(pid, 'SIGTERM')
      } catch {}
    }
  }
  fs.rmSync(STATE_FILE, { force: true })
}

module.exports = {
  QA_ROOT,
  LOG_DIR,
  loadEnv,
  delay,
  findPidsByPort,
  killPort,
  isTestBackend,
  ensureBackend,
  ensureFrontend,
  stopAll,
  clearState,
  readState
}
