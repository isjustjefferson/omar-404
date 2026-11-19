const path = require('path')

const rootDir = __dirname

module.exports = {
  rootDir,
  testEnvironment: 'node',
  maxWorkers: 1,
  globalSetup: path.join(rootDir, 'support', 'global-setup.js'),
  globalTeardown: path.join(rootDir, 'support', 'global-teardown.js'),
  setupFiles: [path.join(rootDir, 'support', 'env.js')],
  testMatch: ['<rootDir>/tests/week6/api/**/*.test.js'],
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: path.join(rootDir, 'evidencias', 'week6', 'jest'),
        outputName: 'api-junit.xml',
        suiteName: 'Omar-404 Semana 6 - API'
      }
    ]
  ]
}
