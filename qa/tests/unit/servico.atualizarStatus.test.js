jest.mock('../../../backend/config/db.js', () => ({ query: jest.fn() }))

const db = require('../../../backend/config/db.js')
const Servico = require('../../../backend/models/Servico')

beforeEach(() => {
  jest.clearAllMocks()
})

describe('Servico.atualizarStatus', () => {
  test('rejeita status fora da lista permitida sem consultar o banco', async () => {
    await expect(Servico.atualizarStatus(1, 'finalizado', 2)).rejects.toThrow(
      'Status inválido. Use: pendente, em_andamento, concluido, cancelado'
    )
    expect(db.query).not.toHaveBeenCalled()
  })

  test('aceita status válido e atualiza apenas o serviço do administrador', async () => {
    const registro = { id: 1, status: 'concluido', admin_id: 2 }
    db.query.mockResolvedValue({ rows: [registro] })

    const resultado = await Servico.atualizarStatus(1, 'concluido', 2)

    expect(resultado).toEqual(registro)
    expect(db.query).toHaveBeenCalledWith(
      'UPDATE servicos SET status = $1 WHERE id = $2 AND admin_id = $3 RETURNING *',
      ['concluido', 1, 2]
    )
  })

  test('retorna undefined quando o serviço não pertence ao administrador', async () => {
    db.query.mockResolvedValue({ rows: [] })

    const resultado = await Servico.atualizarStatus(99, 'pendente', 2)

    expect(resultado).toBeUndefined()
  })
})
