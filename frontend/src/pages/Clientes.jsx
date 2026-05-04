import { useState } from 'react'

const mockData = [
  { id: 1, nome: 'Ana Beatriz',    cpf: '123.456.789-00', telefone: '(81) 99999-0001', parentesco: 'Filha'   },
  { id: 2, nome: 'Carlos Eduardo', cpf: '987.654.321-00', telefone: '(81) 99999-0002', parentesco: 'Cônjuge' },
]

export default function Clientes() {
  const [dados] = useState(mockData)
  const [busca, setBusca] = useState('')

  const filtrados = dados.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">Contratantes e responsáveis</p>
        </div>
        <button className="btn-omar">+ Novo cliente</button>
      </div>

      <div className="card-omar">
        <div className="mb-3">
          <input
            className="input-omar"
            style={{ maxWidth: 320 }}
            placeholder="Buscar por nome..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>

        <table className="table table-omar mb-0">
          <thead>
            <tr>
              <th>Nome</th>
              <th>CPF</th>
              <th>Telefone</th>
              <th>Parentesco</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                  Nenhum cliente encontrado.
                </td>
              </tr>
            ) : (
              filtrados.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.nome}</td>
                  <td style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{c.cpf}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.telefone}</td>
                  <td><span className="badge-status badge-ativo">{c.parentesco}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-ghost me-2" style={{ padding: '4px 12px', fontSize: 12 }}>Editar</button>
                    <button className="btn-danger-ghost" style={{ padding: '4px 12px', fontSize: 12 }}>Remover</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  )
}
