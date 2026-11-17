describe('CT04 - Login pela interface', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
  })

  it('(a) credenciais válidas autenticam e redirecionam', () => {
    cy.loginComo('admina@teste.com', 'Senha@123')

    cy.url().should('match', /\/$/)
    cy.window()
      .its('localStorage')
      .invoke('getItem', 'token')
      .should('be.a', 'string')
      .and('not.be.empty')
  })

  it('(b) senha incorreta mantém o usuário na tela de login', () => {
    cy.loginComo('admina@teste.com', 'SenhaErrada')

    cy.url().should('include', '/login')
    cy.get('.card-omar div').should('be.visible')
    cy.window()
      .its('localStorage')
      .invoke('getItem', 'token')
      .should('be.null')
  })
})
