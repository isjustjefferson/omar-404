import { useState } from 'react'

const mockData = [
  { id: 1, tipo: 'Velório + Sepultamento', cliente: 'Ana Beatriz',    dataVelorio: '2025-04-28', valor: 'R$ 4.500,00', status: 'pendente'  },
  { id: 2, tipo: 'Cremação',               cliente: 'Carlos Eduardo', dataVelorio: '2025-04-29', valor: 'R$ 3.200,00', status: 'ativo'     },
  { id: 3, tipo: 'Velório simples',         cliente: 'Pedro Santos',   dataVelorio: '2025-04-15', valor: 'R$ 1.800,00', status: 'encerrado' },
]

const statusLabel = {
  pendente:  'Pendente',
  ativo:     'Ativo',
  encerrado: 'Encerrado',
}

export default function Contratos() {
  const [dados] = useState(mockData)
  const [filtroStatus, setFiltroStatus] = useState('todos')

  const filtrados = dados.filter(c =>
    filtroStatus === 'todos' || c.status === filtroStatus
  )

  return (
    <>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="page-title">Contratos</h1>
          <p className="page-subtitle">Serviços e contratos funerários</p>
        </div>
        <button className="btn-omar">+ Novo contrato</button>
      </div>

      <div className="card-omar">
        <div className="d-flex gap-2 mb-3">
          {['todos', 'pendente', 'ativo', 'encerrado'].map(s => (
            <button
              key={s}
              onClick={() => setFiltroStatus(s)}
              className={filtroStatus === s ? 'btn-omar' : 'btn-ghost'}
              style={{ padding: '5px 14px', fontSize: 12 }}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        <table className="table table-omar mb-0">
          <thead>
            <tr>
              <th>Tipo de serviço</th>
              <th>Cliente</th>
              <th>Data velório</th>
              <th>Valor</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                  Nenhum contrato encontrado.
                </td>
              </tr>
            ) : (
              filtrados.map(c => (
                <tr key={c.id}>
                  <td style={{ fontWeight: 500 }}>{c.tipo}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.cliente}</td>
                  <td style={{ color: 'var(--text-secondary)' }}>{c.dataVelorio}</td>
                  <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{c.valor}</td>
                  <td><span className={`badge-status badge-${c.status}`}>{statusLabel[c.status]}</span></td>
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
