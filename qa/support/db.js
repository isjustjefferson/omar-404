require('./env')

const { Pool } = require('pg')

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || 'omar404_test',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD,
  max: 10
})

function query(text, params) {
  return pool.query(text, params)
}

async function end() {
  await pool.end()
}

if (typeof afterAll === 'function') {
  afterAll(async () => {
    await end()
  })
}

module.exports = { pool, query, end }
