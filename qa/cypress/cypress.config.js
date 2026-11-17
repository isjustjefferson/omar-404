const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
    specPattern: 'e2e/**/*.cy.js',
    supportFile: 'support/e2e.js',
    videosFolder: '../evidencias/week5/cypress/videos',
    screenshotsFolder: '../evidencias/week5/cypress/screenshots',
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 5000
  }
})
