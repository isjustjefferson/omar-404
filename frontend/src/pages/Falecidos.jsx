import { useCallback } from 'react'
import useSocket from '../hooks/useSocket'
import { useState, useEffect } from 'react'
import api from '../services/api'
import FalecidoModal from '../components/FalecidoModal'

export default function Falecidos() {
  const [dados, setDados] = useState([])
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [falecidoEditando, setFalecidoEditando] = useState(null)
  const [confirmandoId, setConfirmandoId] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const handleFalecidoCadastrado = useCallback((f) => {
  setDados(prev => {
    const jaExiste = prev.some(d => d.id === f.id)
    if (jaExiste) return prev
    return [f, ...prev]
  })
}, [])

const handleFalecidoAtualizado = useCallback((f) => {
  setDados(prev => prev.map(d => d.id === f.id ? { ...d, ...f } : d))
}, [])

const handleFalecidoRemovido = useCallback((f) => {
  setDados(prev => prev.filter(d => d.id !== Number(f.id)))
}, [])

useSocket('falecido:cadastrado', handleFalecidoCadastrado)
useSocket('falecido:atualizado', handleFalecidoAtualizado)
useSocket('falecido:removido', handleFalecidoRemovido)

  useEffect(() => {
    api.get('/falecidos')
      .then(res => setDados(res.data))
      .catch(() => alert('Erro ao carregar falecidos.'))
      .finally(() => setCarregando(false))
  }, [])

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
      await api.put(`/falecidos/${falecidoEditando.id}`, form)
    } else {
      await api.post('/falecidos', form)
    }
  }

  async function handleDeletar(id) {
  await api.delete(`/falecidos/${id}`)
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
            {carregando ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>
                  Carregando...
                </td>
              </tr>
            ) : filtrados.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div style={{
                    background: 'rgba(100,200,80,0.05)',
                    border: '1px solid rgba(100,200,80,0.15)',
                    borderRadius: 8,
                    padding: '12px 16px',
                    color: 'var(--text-muted)',
                    fontSize: 13,
                    margin: '8px 0',
                    textAlign: 'center',
                  }}>
                    Nenhum registro encontrado.
                  </div>
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