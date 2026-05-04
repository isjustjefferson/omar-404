import { useState } from 'react'

const mockData = [
  { id: 1, nome: 'José da Silva',    dataNascimento: '1940-03-12', dataObito: '2025-04-20', causa: 'Causas naturais' },
  { id: 2, nome: 'Maria Aparecida',  dataNascimento: '1955-07-08', dataObito: '2025-04-27', causa: 'Causas naturais' },
]

export default function Falecidos() {
  const [dados] = useState(mockData)
  const [busca, setBusca] = useState('')

  const filtrados = dados.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="page-title">Falecidos</h1>
          <p className="page-subtitle">Registros de falecidos no sistema</p>
        </div>
        <button className="btn-omar">+ Novo registro</button>
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
              <th>Nascimento</th>
              <th>Óbito</th>
              <th>Causa</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            ) : (
              filtrados.map(f => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 500 }}>{f.nome}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{f.dataNascimento}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{f.dataObito}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{f.causa}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="btn-ghost me-2" style={{ padding: '4px 12px', fontSize: 12 }}>
                      Editar
                    </button>
                    <button className="btn-danger-ghost" style={{ padding: '4px 12px', fontSize: 12 }}>
                      Remover
                    </button>
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
