import { useState, useEffect } from 'react'
import api from '../services/api'
import ContratoModal from '../components/ContratoModal'

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
  const [dados, setDados] = useState([])
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [modalAberto, setModalAberto] = useState(false)
  const [contratoEditando, setContratoEditando] = useState(null)
  const [confirmandoId, setConfirmandoId] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    api.get('/servicos')
      .then(res => setDados(res.data))
      .catch(() => alert('Erro ao carregar contratos.'))
      .finally(() => setCarregando(false))
  }, [])

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
      const res = await api.put(`/servicos/${contratoEditando.id}`, form)
      setDados(dados.map(c => c.id === contratoEditando.id ? res.data : c))
    } else {
      const res = await api.post('/servicos', form)
      setDados([res.data, ...dados])
    }
  }

  async function handleDeletar(id) {
    await api.delete(`/servicos/${id}`)
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
              <th>Falecido</th>
              <th>Valor</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {carregando ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                  Carregando...
                </td>
              </tr>
            ) : filtrados.length === 0 ? (
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
                    <td style={{ color: 'var(--text-secondary)' }}>{c.nome_falecido || `#${c.falecido_id}`}</td>
                    <td style={{ fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{c.valor}</td>
                    <td>
                      <span className={`badge-status ${statusClasse[c.status] || 'badge-pendente'}`}>
                        {statusLabel[c.status] || c.status}
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
