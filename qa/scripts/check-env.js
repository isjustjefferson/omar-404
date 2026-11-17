require('../support/env')

const fs = require('fs')
const path = require('path')
const { createClient } = require('redis')
const { pool, end } = require('../support/db')

async function main() {
  const arquivoEnv = path.join(__dirname, '..', '.env.test')
  if (!fs.existsSync(arquivoEnv)) throw new Error('.env.test não encontrado')

  const resultado = await pool.query('SELECT current_database() AS database')
  const redis = createClient({ url: process.env.REDIS_URL })
  await redis.connect()
  const pong = await redis.ping()
  await redis.quit()
  await end()

  console.log(`Banco: ${resultado.rows[0].database}`)
  console.log(`Redis: ${pong}`)
  console.log('Ambiente de teste OK.')
}

main().catch(async (erro) => {
  console.error(erro)
  try {
    await end()
  } catch {}
  process.exit(1)
})
