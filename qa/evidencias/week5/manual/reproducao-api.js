// Reprodução manual dos casos reprovados (Semana 5) - roda a partir de qa/
const qa = process.cwd()
require(qa + '/support/env')
const { spawnSync } = require('child_process')
const s = require(qa + '/support/server')
const { query, end } = require(qa + '/support/db')
const { USUARIOS, payloadFalecido, payloadServico } = require(qa + '/support/fixtures')
const BASE = process.env.BASE_URL
const out = []
const log = (ct, desc, r) => { const l = { ct, desc, status: r.status, body: r.body }; out.push(l); console.log(JSON.stringify(l)) }

async function req(m, rota, token, body) {
  const r = await fetch(BASE + rota, { method: m, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: body ? JSON.stringify(body) : undefined })
  let b; try { b = await r.json() } catch { b = null }
  return { status: r.status, body: b }
}
const reset = () => { for (const f of ['reset-test-db.js', 'seed-test.js']) spawnSync(process.execPath, [qa + '/scripts/' + f], { stdio: 'ignore' }) }
const tok = async (n) => (await req('POST', '/auth/login', null, { email: USUARIOS[n].email, senha: USUARIOS[n].senha })).body.token
const existe = async (id) => (await query('SELECT id, email, perfil FROM usuarios WHERE id=$1', [id])).rows[0] || null

;(async () => {
  reset(); await s.ensureBackend()
  // CT09
  let r = await req('POST', '/auth/register', null, { nome: 'Intruso', email: 'intruso@teste.com', senha: 'Senha@123', perfil: 'admin' })
  log('CT09', 'POST /auth/register perfil=admin sem token', r)
  log('CT09', 'login do admin criado', await req('POST', '/auth/login', null, { email: 'intruso@teste.com', senha: 'Senha@123' }))

  // CT10
  reset(); let a = await tok('Admin A')
  r = await req('DELETE', '/users/3', a); log('CT10a', 'Admin A remove Operador A1 (id 3)', r); console.log('  id3 no banco:', await existe(3)); out.push({ ct: 'CT10a', banco: await existe(3) })
  reset(); a = await tok('Admin A')
  r = await req('DELETE', '/users/4', a); log('CT10b', 'Admin A remove Operador B1 (id 4, de Admin B)', r); out.push({ ct: 'CT10b', banco: await existe(4) }); console.log('  id4 no banco:', await existe(4))
  reset(); a = await tok('Admin A')
  r = await req('DELETE', '/users/2', a); log('CT10c', 'Admin A remove Admin B (id 2)', r); out.push({ ct: 'CT10c', banco: await existe(2) }); console.log('  id2 no banco:', await existe(2))
  reset(); a = await tok('Admin A')
  r = await req('DELETE', '/users/9999', a); log('CT10d', 'Admin A remove id inexistente 9999', r)

  // CT13
  reset(); const b = await tok('Admin B')
  r = await req('POST', '/falecidos', b, payloadFalecido(1, 'Falecido Invadido')); log('CT13', 'Admin B cria falecido com cliente 1 (de Admin A)', r)
  r = await req('POST', '/servicos', b, payloadServico(1, 1)); log('CT13', 'Admin B cria serviço com cliente 1 / falecido 1 (de Admin A)', r)

  // CT24 c/d
  reset(); const c = await tok('Admin C'), d = await tok('Admin D')
  log('CT24c', 'Admin C (sem clientes) cria serviço', await req('POST', '/servicos', c, payloadServico(1, 1)))
  log('CT24d', 'Admin D (sem falecidos) cria serviço', await req('POST', '/servicos', d, payloadServico(5, 1)))

  // CT25 valor 0
  reset(); a = await tok('Admin A')
  log('CT25', 'Admin A cria serviço valor 0', await req('POST', '/servicos', a, payloadServico(1, 1, 0)))

  // CT27 PUT sem status
  reset(); a = await tok('Admin A')
  await req('PATCH', '/servicos/1/status', a, { status: 'em_andamento' })
  const corpo = payloadServico(1, 1); delete corpo.status
  r = await req('PUT', '/servicos/1', a, corpo); log('CT27', 'PUT /servicos/1 sem status (status anterior em_andamento)', r)
  out.push({ ct: 'CT27', banco: (await query('SELECT id, status FROM servicos WHERE id=1')).rows[0] })

  require('fs').writeFileSync(qa + '/evidencias/week5/manual/reproducao-api.json', JSON.stringify(out, null, 2))
  await end(); await s.stopAll()
})().catch(async (e) => { console.error(e); await s.stopAll(); process.exit(1) })
