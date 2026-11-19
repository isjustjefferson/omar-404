jest.mock('../../../../backend/config/db', () => ({ query: jest.fn() }))

const db = require('../../../../backend/config/db')
const Cliente = require('../../../../backend/models/Cliente')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('CT18 - Validação unitária de CPF em Cliente.criar', () => {
  test.each([
    ['dígitos repetidos', '111.111.111-11'],
    ['dígito verificador errado', '529.982.247-24'],
    ['letras', 'abcdefghijk']
  ])('%s lança erro sem consultar o banco', async (_rotulo, cpf) => {
    await expect(Cliente.criar({ nome: 'Cliente CT18 unitário', cpf, admin_id: 1 }))
      .rejects.toThrow('CPF inválido.')

    expect(db.query).not.toHaveBeenCalled()
  })

  test('campos obrigatórios lançam erro sem consultar o banco', async () => {
    await expect(Cliente.criar({ cpf: '52998224725', admin_id: 1 }))
      .rejects.toThrow('Nome e CPF são obrigatórios.')

    expect(db.query).not.toHaveBeenCalled()
  })
})
