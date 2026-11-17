const path = require('path')
const dotenv = require('dotenv')

dotenv.config({ path: path.join(__dirname, '..', '.env.test') })

process.env.BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
process.env.FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173'
