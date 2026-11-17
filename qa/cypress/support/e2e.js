Cypress.Commands.add('loginComo', (email, senha) => {
  cy.visit('/login')
  cy.get('input[name="email"]').clear().type(email)
  cy.get('input[name="senha"]').clear().type(senha)
  cy.get('button[type="submit"]').click()
})
