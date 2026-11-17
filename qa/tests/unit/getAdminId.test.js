jest.mock('../../../backend/config/db', () => ({ query: jest.fn() }))
jest.mock('../../../backend/utils/cache', () => ({ get: jest.fn(), set: jest.fn() }))

const db = require('../../../backend/config/db')
const cache = require('../../../backend/utils/cache')
const getAdminId = require('../../../backend/utils/getAdminId')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('getAdminId', () => {
  test('admin retorna o próprio id sem consultar cache ou banco', async () => {
    const resultado = await getAdminId({ id: 10, perfil: 'admin' })

    expect(resultado).toBe(10)
    expect(cache.get).not.toHaveBeenCalled()
    expect(db.query).not.toHaveBeenCalled()
  })

  test('operador com cache retorna o admin_id em cache', async () => {
    cache.get.mockResolvedValue(7)

    const resultado = await getAdminId({ id: 3, perfil: 'operador' })

    expect(resultado).toBe(7)
    expect(cache.get).toHaveBeenCalledWith('admin_id:operador:3')
    expect(db.query).not.toHaveBeenCalled()
  })

  test('operador sem cache consulta o banco e preenche o cache', async () => {
    cache.get.mockResolvedValue(null)
    db.query.mockResolvedValue({ rows: [{ admin_id: 9 }] })

    const resultado = await getAdminId({ id: 4, perfil: 'operador' })

    expect(resultado).toBe(9)
    expect(db.query).toHaveBeenCalledWith('SELECT admin_id FROM usuarios WHERE id = $1', [4])
    expect(cache.set).toHaveBeenCalledWith('admin_id:operador:4', 9, 300)
  })

  test('operador sem vínculo lança erro específico', async () => {
    cache.get.mockResolvedValue(null)
    db.query.mockResolvedValue({ rows: [{ admin_id: null }] })

    await expect(getAdminId({ id: 5, perfil: 'operador' })).rejects.toThrow('Operador sem administrador vinculado.')
    expect(cache.set).not.toHaveBeenCalled()
  })
})
