const { stopAll } = require('./server')

module.exports = async () => {
  await stopAll()
}
