import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Operadores() {
  const [operadores, setOperadores] = useState([])
  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [salvando, setSalvando] = useState(false)

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  useEffect(() => {
    carregarOperadores()
  }, [])

  async function carregarOperadores() {
    try {
      const res = await api.get('/users/operadores')
      setOperadores(res.data)
    } catch (err) {
      setErro('Erro ao carregar operadores.')
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    setSalvando(true)
    try {
      await api.post('/users/operadores', form)
      setSucesso('Operador cadastrado com sucesso.')
      setForm({ nome: '', email: '', senha: '' })
      carregarOperadores()
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao cadastrar operador.')
    } finally {
      setSalvando(false)
    }
  }

  async function handleDeletar(id) {
    if (!confirm('Remover este operador?')) return
    try {
      await api.delete(`/users/${id}`)
      carregarOperadores()
    } catch (err) {
      setErro('Erro ao remover operador.')
    }
  }

  if (usuario.perfil !== 'admin') {
    return (
      <div style={{ padding: 32 }}>
        <p style={{ color: 'var(--danger)' }}>Acesso restrito a administradores.</p>
      </div>
    )
  }

  return (
    <div>
      <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 24, marginBottom: 32 }}>
        Gerenciar Operadores
      </h2>

      {/* Formulário de cadastro */}
      <div className="card-omar" style={{ maxWidth: 480, marginBottom: 40 }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 20 }}>Novo operador</h3>

        {erro && (
          <div style={{ background: 'rgba(192,84,74,0.1)', border: '1px solid rgba(192,84,74,0.3)', borderRadius: 8, padding: '10px 14px', color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>
            {erro}
          </div>
        )}
        {sucesso && (
          <div style={{ background: 'rgba(100,200,80,0.1)', border: '1px solid rgba(100,200,80,0.3)', borderRadius: 8, padding: '10px 14px', color: '#6ec96e', fontSize: 13, marginBottom: 16 }}>
            {sucesso}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Nome</label>
            <input className="input-omar" name="nome" placeholder="Nome do operador" value={form.nome} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">E-mail</label>
            <input className="input-omar" type="email" name="email" placeholder="operador@email.com" value={form.email} onChange={handleChange} required />
          </div>
          <div className="mb-4">
            <label className="form-label">Senha</label>
            <input className="input-omar" type="password" name="senha" placeholder="••••••••" value={form.senha} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn-omar" disabled={salvando}>
            {salvando ? 'Cadastrando...' : 'Cadastrar operador'}
          </button>
        </form>
      </div>

      {/* Lista de operadores */}
      <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>
        Operadores cadastrados
      </h3>

      {operadores.length === 0 ? (
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Nenhum operador cadastrado ainda.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {operadores.map(op => (
            <div key={op.id} style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '14px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{op.nome}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{op.email}</div>
              </div>
              <button
                onClick={() => handleDeletar(op.id)}
                style={{ background: 'none', border: '1px solid rgba(192,84,74,0.3)', color: 'var(--danger)', borderRadius: 6, padding: '6px 12px', cursor: 'pointer', fontSize: 12 }}
              >
                Remover
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}