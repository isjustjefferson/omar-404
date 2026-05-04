import { useState } from 'react'
import ContratoModal from '../components/ContratoModal'

const mockData = [
  { id: 1, tipo: 'Velório + Sepultamento', descricao: '', valor: 'R$ 4.500,00', falecido_id: 1, status: 'pendente'     },
  { id: 2, tipo: 'Cremação',               descricao: '', valor: 'R$ 3.200,00', falecido_id: 2, status: 'em_andamento' },
  { id: 3, tipo: 'Velório simples',         descricao: '', valor: 'R$ 1.800,00', falecido_id: 1, status: 'concluido'   },
]

const statusLabel = {
  pendente:     'Pendente',
  em_andamento: 'Em andamento',
  concluido:    'Concluído',
  cancelado:    'Cancelado',
}

const statusClasse = {
  pendente:     'badge-pendente',
  em_andamento: 'badge-ativo',
  concluido:    'badge-encerrado',
  cancelado:    'badge-encerrado',
}

export default function Contratos() {
  const [dados, setDados] = useState(mockData)
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [modalAberto, setModalAberto] = useState(false)
  const [contratoEditando, setContratoEditando] = useState(null)
  const [confirmandoId, setConfirmandoId] = useState(null)

  const filtrados = dados.filter(c =>
    filtroStatus === 'todos' || c.status === filtroStatus
  )

  function abrirNovo() {
    setContratoEditando(null)
    setModalAberto(true)
  }

  function abrirEditar(contrato) {
    setContratoEditando(contrato)
    setModalAberto(true)
  }

  async function handleSalvar(form) {
    if (contratoEditando) {
      // TODO: chamar PUT /servicos/:id
      setDados(dados.map(c =>
        c.id === contratoEditando.id ? { ...c, ...form } : c
      ))
    } else {
      // TODO: chamar POST /servicos
      const novo = { id: Date.now(), ...form }
      setDados([novo, ...dados])
    }
  }

  async function handleDeletar(id) {
    // TODO: chamar DELETE /servicos/:id
    setDados(dados.filter(c => c.id !== id))
    setConfirmandoId(null)
  }

  return (
    <>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="page-title">Contratos</h1>
          <p className="page-subtitle">Serviços e contratos funerários</p>
        </div>
        <button className="btn-omar" onClick={abrirNovo}>+ Novo contrato</button>
      </div>

      <div className="card-omar">
        <div className="d-flex gap-2 mb-3 flex-wrap">
          {['todos', 'pendente', 'em_andamento', 'concluido', 'cancelado'].map(s => (
            <button
              key={s}
              onClick={() => setFiltroStatus(s)}
              className={filtroStatus === s ? 'btn-omar' : 'btn-ghost'}
              style={{ padding: '5px 14px', fontSize: 12 }}
            >
              {statusLabel[s] ?? 'Todos'}
            </button>
          ))}
        </div>

        <table className="table table-omar mb-0">
          <thead>
            <tr>
              <th>Tipo de serviço</th>
              <th>Falecido ID</th>
              <th>Valor</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                  Nenhum contrato encontrado.
                </td>
              </tr>
            ) : (
              filtrados.map(c => (
                <>
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.tipo}</td>
                    <td style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace', fontSize: 13 }}>
                      #{c.falecido_id}
                    </td>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{c.valor}</td>
                    <td>
                      <span className={`badge-status ${statusClasse[c.status]}`}>
                        {statusLabel[c.status]}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-ghost me-2"
                        style={{ padding: '4px 12px', fontSize: 12 }}
                        onClick={() => abrirEditar(c)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-danger-ghost"
                        style={{ padding: '4px 12px', fontSize: 12 }}
                        onClick={() => setConfirmandoId(c.id)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>

                  {confirmandoId === c.id && (
                    <tr key={`confirm-${c.id}`}>
                      <td colSpan={5} style={{
                        background: 'rgba(192,84,74,0.08)',
                        border: '1px solid rgba(192,84,74,0.2)',
                        borderRadius: 8,
                        padding: '12px 16px',
                      }}>
                        <div className="d-flex align-items-center justify-content-between">
                          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            Confirmar remoção do contrato <strong style={{ color: 'var(--text-primary)' }}>{c.tipo}</strong>?
                          </span>
                          <div className="d-flex gap-2">
                            <button
                              className="btn-danger-ghost"
                              style={{ padding: '4px 14px', fontSize: 12 }}
                              onClick={() => handleDeletar(c.id)}
                            >
                              Sim, remover
                            </button>
                            <button
                              className="btn-ghost"
                              style={{ padding: '4px 14px', fontSize: 12 }}
                              onClick={() => setConfirmandoId(null)}
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ContratoModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={handleSalvar}
        contrato={contratoEditando}
      />
    </>
  )
}
