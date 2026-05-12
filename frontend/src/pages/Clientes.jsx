import React, { useState, useEffect, useCallback } from 'react'
import useSocket from '../hooks/useSocket'
import api from '../services/api'
import ClienteModal from '../components/ClienteModal'
 
export default function Clientes() {
  const [dados, setDados] = useState([])
  const [busca, setBusca] = useState('')
  const [modalAberto, setModalAberto] = useState(false)
  const [clienteEditando, setClienteEditando] = useState(null)
  const [confirmandoId, setConfirmandoId] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const confirmaAdmin = usuario.perfil === 'admin'

  const handleClienteCadastrado = useCallback((cliente) => {
    setDados(prev => {
      const jaExiste = prev.some(c => c.id === cliente.id)
      if (jaExiste) return prev
      return [cliente, ...prev]
    })
  }, [])

  const handleClienteRemovido = useCallback((cliente) => {
    setDados(prev => prev.filter(c => c.id !== cliente.id))
  }, [])

  const handleClienteAtualizado = useCallback((cliente) => {
    setDados(prev => prev.map(c => c.id === cliente.id ? { ...c, ...cliente } : c))
  }, [])

  useSocket('cliente:cadastrado', handleClienteCadastrado)
  useSocket('cliente:removido', handleClienteRemovido)
  useSocket('cliente:atualizado', handleClienteAtualizado)


  
  useEffect(() => {
    api.get('/clientes')
      .then(res => setDados(res.data))
      .catch(() => alert('Erro ao carregar clientes.'))
      .finally(() => setCarregando(false))
  }, [])
 
  const filtrados = dados.filter(c =>
  c.nome && c.nome.toLowerCase().includes(busca.toLowerCase())
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

    const res = await api.put(`/clientes/${clienteEditando.id}`, form)

    setDados(prev =>
      prev.map(c =>
        c.id === clienteEditando.id ? res.data : c
      )
    )

  } else {

    const res = await api.post('/clientes', form)

    setDados(prev => {

      const jaExiste = prev.some(c => c.id === res.data.id)

      if (jaExiste) return prev

      return [res.data, ...prev]
    })

  }
}
 
  async function handleDeletar(id) {
    await api.delete(`/clientes/${id}`)
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
        { confirmaAdmin && (
          <button className="btn-omar" onClick={abrirNovo}>+ Novo cliente</button>
        )}
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
                    Nenhum cliente encontrado.
                  </div>  
                </td>
              </tr>
            ) : (
              filtrados.map(c => (
              <React.Fragment key={c.id}>
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.nome}</td>
                    <td style={{ color: 'var(--text-secondary)', fontFamily: 'DM Mono, monospace', fontSize: 13 }}>{c.cpf}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.telefone || '—'}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{c.email || '—'}</td>
                    {confirmaAdmin && (
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
                    )}
                  </tr>
 
                  {confirmaAdmin && confirmandoId === c.id && (
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
                </React.Fragment>
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