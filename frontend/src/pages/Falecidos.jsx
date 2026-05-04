import { useState } from 'react'
import FalecidoModal from '../components/FalecidoModal'

const mockData = [
  { id: 1, nome: 'José da Silva',   data_nascimento: '1940-03-12', data_falecimento: '2025-04-20', causa_morte: 'Causas naturais', cliente_id: 1 },
  { id: 2, nome: 'Maria Aparecida', data_nascimento: '1955-07-08', data_falecimento: '2025-04-27', causa_morte: 'Causas naturais', cliente_id: 2 },
]

export default function Falecidos() {
  const [dados, setDados] = useState(mockData)
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [falecidoEditando, setFalecidoEditando] = useState(null)
  const [confirmandoId, setConfirmandoId] = useState(null)

  const filtrados = dados.filter(f =>
    f.nome.toLowerCase().includes(busca.toLowerCase())
  )

  function abrirNovo() {
    setFalecidoEditando(null)
    setModalAberto(true)
  }

  function abrirEditar(falecido) {
    setFalecidoEditando(falecido)
    setModalAberto(true)
  }

  async function handleSalvar(form) {
    if (falecidoEditando) {
      // TODO: chamar PUT /falecidos/:id
      setDados(dados.map(f =>
        f.id === falecidoEditando.id ? { ...f, ...form } : f
      ))
    } else {
      // TODO: chamar POST /falecidos
      const novo = { id: Date.now(), ...form }
      setDados([novo, ...dados])
    }
  }

  async function handleDeletar(id) {
    // TODO: chamar DELETE /falecidos/:id
    setDados(dados.filter(f => f.id !== id))
    setConfirmandoId(null)
  }

  return (
    <>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="page-title">Falecidos</h1>
          <p className="page-subtitle">Registros de falecidos no sistema</p>
        </div>
        <button className="btn-omar" onClick={abrirNovo}>+ Novo registro</button>
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
                <>
                  <tr key={f.id}>
                    <td style={{ fontWeight: 500 }}>{f.nome}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{f.data_nascimento || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{f.data_falecimento}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{f.causa_morte || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="btn-ghost me-2"
                        style={{ padding: '4px 12px', fontSize: 12 }}
                        onClick={() => abrirEditar(f)}
                      >
                        Editar
                      </button>
                      <button
                        className="btn-danger-ghost"
                        style={{ padding: '4px 12px', fontSize: 12 }}
                        onClick={() => setConfirmandoId(f.id)}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>

                  {/* Linha de confirmação de exclusão */}
                  {confirmandoId === f.id && (
                    <tr key={`confirm-${f.id}`}>
                      <td colSpan={5} style={{
                        background: 'rgba(192,84,74,0.08)',
                        border: '1px solid rgba(192,84,74,0.2)',
                        borderRadius: 8,
                        padding: '12px 16px',
                      }}>
                        <div className="d-flex align-items-center justify-content-between">
                          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                            Confirmar remoção de <strong style={{ color: 'var(--text-primary)' }}>{f.nome}</strong>?
                          </span>
                          <div className="d-flex gap-2">
                            <button
                              className="btn-danger-ghost"
                              style={{ padding: '4px 14px', fontSize: 12 }}
                              onClick={() => handleDeletar(f.id)}
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

      <FalecidoModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={handleSalvar}
        falecido={falecidoEditando}
      />
    </>
  )
}
