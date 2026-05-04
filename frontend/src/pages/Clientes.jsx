import { useState } from 'react'
import ClienteModal from '../components/ClienteModal'

const mockData = [
  { id: 1, nome: 'Ana Beatriz',    cpf: '123.456.789-00', telefone: '(81) 99999-0001', email: 'ana@email.com',    parentesco: 'Filha'   },
  { id: 2, nome: 'Carlos Eduardo', cpf: '987.654.321-00', telefone: '(81) 99999-0002', email: 'carlos@email.com', parentesco: 'Cônjuge' },
]

export default function Clientes() {
  const [dados, setDados] = useState(mockData)
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)
  const [confirmandoId, setConfirmandoId] = useState(null)

  const filtrados = dados.filter(c =>
    c.nome.toLowerCase().includes(busca.toLowerCase())
  )

  function abrirNovo() {
    setClienteEditando(null)
    setModalAberto(true)
  }

  function abrirEditar(cliente) {
    setClienteEditando(cliente)
    setModalAberto(true)
  }

  async function handleSalvar(form) {
    if (clienteEditando) {
      // TODO: chamar PUT /clientes/:id
      setDados(dados.map(c =>
        c.id === clienteEditando.id ? { ...c, ...form } : c
      ))
    } else {
      // TODO: chamar POST /clientes
      const novo = { id: Date.now(), ...form }
      setDados([novo, ...dados])
    }
  }

  async function handleDeletar(id) {
    // TODO: chamar DELETE /clientes/:id
    setDados(dados.filter(c => c.id !== id))
    setConfirmandoId(null)
  }

  return (
    <>
      <div className="page-header d-flex justify-content-between align-items-start">
        <div>
          <h1 className="page-title">Clientes</h1>
          <p className="page-subtitle">Contratantes e responsáveis</p>
        </div>
        <button className="btn-omar" onClick={abrirNovo}>+ Novo cliente</button>
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
              <th>E-mail</th>
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
                <>
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.nome}</td>
                    <td style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{c.cpf}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.telefone || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.email || '—'}</td>
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
                            Confirmar remoção de <strong style={{ color: 'var(--text-primary)' }}>{c.nome}</strong>?
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

      <ClienteModal
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onSalvar={handleSalvar}
        cliente={clienteEditando}
      />
    </>
  )
}
