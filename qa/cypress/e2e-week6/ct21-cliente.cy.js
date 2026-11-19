describe('CT21 - Cadastro de cliente pela interface', () => {
  beforeEach(() => {
    cy.clearLocalStorage()
    cy.loginComo('admina@teste.com', 'Senha@123')
    cy.url().should('match', /\/$/)
    cy.window()
      .its('localStorage')
      .invoke('getItem', 'token')
      .should('be.a', 'string')
      .and('not.be.empty')
    cy.visit('/clientes')
    cy.contains('h1', 'Clientes').should('be.visible')
  })

  it('(a) CPF válido cadastra o cliente e o exibe na lista', () => {
    const nome = `Cliente CT21 Válido ${Date.now()}`

    cy.contains('button', '+ Novo cliente').click()
    cy.get('input[name="nome"]').type(nome)
    cy.get('input[name="cpf"]').type('52998224725')
    cy.get('input[name="telefone"]').type('81988888888')
    cy.get('input[name="email"]').type('ct21-valido@teste.com')
    cy.contains('button', 'Cadastrar').click()

    cy.contains('td', nome).should('be.visible')
    cy.contains('td', '529.982.247-25').should('be.visible')
  })

  it('(b) CPF inválido é rejeitado pelo formulário e não cria o cliente', () => {
    const nome = `Cliente CT21 Inválido ${Date.now()}`

    cy.contains('button', '+ Novo cliente').click()
    cy.get('input[name="nome"]').type(nome)
    cy.get('input[name="cpf"]').type('11111111111')
    cy.contains('button', 'Cadastrar').click()

    cy.contains('CPF inválido.').should('be.visible')
    cy.contains('td', nome).should('not.exist')
  })
})
