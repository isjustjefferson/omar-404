const path = require('path')

module.exports = {
  default: {
    paths: ['features/**/*.feature'],
    require: [
      path.join(__dirname, 'support', 'hooks.js'),
      path.join(__dirname, 'features', 'step_definitions', '**/*.js')
    ],
    format: [
      'progress',
      'html:evidencias/week5/cucumber/report.html',
      'json:evidencias/week5/cucumber/report.json'
    ],
    formatOptions: {
      snippetInterface: 'async-await'
    },
    publishQuiet: true
  }
}
