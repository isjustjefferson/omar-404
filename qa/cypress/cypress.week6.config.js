process.env.QA_WEEK_DIR = 'week6'

const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    specPattern: 'e2e-week6/**/*.cy.js',
    supportFile: 'support/e2e.js',
    videosFolder: '../evidencias/week6/cypress/videos',
    screenshotsFolder: '../evidencias/week6/cypress/screenshots',
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000
  }
})
