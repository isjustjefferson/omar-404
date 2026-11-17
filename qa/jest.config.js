const path = require('path')

const rootDir = __dirname

module.exports = {
  rootDir,
  testEnvironment: 'node',
  maxWorkers: 1,
  globalSetup: path.join(rootDir, 'support', 'global-setup.js'),
  globalTeardown: path.join(rootDir, 'support', 'global-teardown.js'),
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: path.join(rootDir, 'evidencias', 'week5', 'jest'),
        outputName: 'junit.xml',
        suiteName: 'Omar-404 Semana 5'
      }
    ]
  ],
  projects: [
    {
      displayName: 'api',
      rootDir,
      testEnvironment: 'node',
      setupFiles: [path.join(rootDir, 'support', 'env.js')],
      testMatch: ['<rootDir>/tests/api/**/*.test.js']
    },
    {
      displayName: 'events',
      rootDir,
      testEnvironment: 'node',
      setupFiles: [path.join(rootDir, 'support', 'env.js')],
      testMatch: ['<rootDir>/tests/events/**/*.test.js']
    },
    {
      displayName: 'unit',
      rootDir,
      testEnvironment: 'node',
      setupFiles: [path.join(rootDir, 'support', 'env.js')],
      testMatch: ['<rootDir>/tests/unit/**/*.test.js']
    }
  ]
}
