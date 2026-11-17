require('../support/env')

const { createClient } = require('redis')
const { pool, end } = require('../support/db')

async function main() {
  await pool.query('TRUNCATE TABLE servicos, falecidos, clientes, verificacoes_email, usuarios RESTART IDENTITY CASCADE')

  const redis = createClient({ url: process.env.REDIS_URL })
  await redis.connect()
  await redis.flushDb()
  await redis.quit()

  await end()
  console.log('Banco e Redis de teste resetados.')
}

main().catch(async (erro) => {
  console.error(erro)
  try {
    await end()
  } catch {}
  process.exit(1)
})
