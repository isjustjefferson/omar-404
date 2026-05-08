import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Perfil() {
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({
    nome: '',
    email: '',
    senhaAtual: '',
    novaSenha: '',
  })
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')

  useEffect(() => {
    api.get('/users/me')
      .then(res => {
        setForm(f => ({ ...f, nome: res.data.nome, email: res.data.email }))
      })
      .catch(() => setErro('Erro ao carregar perfil.'))
  }, [])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSalvar(e) {
    e.preventDefault()
    setErro('')
    setSucesso('')
    try {
      await api.put('/users/me', { nome: form.nome, email: form.email })
      setSucesso('Perfil atualizado com sucesso!')
      setEditando(false)
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao atualizar perfil.')
    }
  }

  async function handleDeletar() {
    if (!window.confirm('Tem certeza que deseja excluir sua conta?')) return
    try {
      await api.delete('/users/me')
      localStorage.removeItem('token')
      localStorage.removeItem('usuario')
      window.location.href = '/login'
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao excluir conta.')
    }
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Meu Perfil</h1>
        <p className="page-subtitle">Gerencie suas informações de acesso</p>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card-omar" style={{ textAlign: 'center' }}>
            <div className="avatar mx-auto mb-3" style={{ width: 64, height: 64, fontSize: 22 }}>
              {form.nome.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ fontWeight: 500 }}>{form.nome}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{form.email}</div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card-omar">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>Dados pessoais</h2>
              {!editando && (
                <button className="btn-ghost" onClick={() => setEditando(true)}>Editar</button>
              )}
            </div>

            {erro && (
              <div style={{ background: 'rgba(192,84,74,0.1)', border: '1px solid rgba(192,84,74,0.3)', borderRadius: 8, padding: '10px 14px', color: 'var(--danger)', fontSize: 13, marginBottom: 16 }}>
                {erro}
              </div>
            )}

            {sucesso && (
              <div style={{ background: 'rgba(74,140,110,0.1)', border: '1px solid rgba(74,140,110,0.3)', borderRadius: 8, padding: '10px 14px', color: 'var(--success)', fontSize: 13, marginBottom: 16 }}>
                {sucesso}
              </div>
            )}

            <form onSubmit={handleSalvar}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Nome completo</label>
                  <input className="input-omar" name="nome" value={form.nome} onChange={handleChange} disabled={!editando} />
                </div>
                <div className="col-12">
                  <label className="form-label">E-mail</label>
                  <input className="input-omar" name="email" type="email" value={form.email} onChange={handleChange} disabled={!editando} />
                </div>
                {editando && (
                  <div className="col-12 d-flex gap-2 mt-2">
                    <button type="submit" className="btn-omar">Salvar alterações</button>
                    <button type="button" className="btn-ghost" onClick={() => setEditando(false)}>Cancelar</button>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="card-omar mt-3">
            <h2 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12, color: 'var(--danger)' }}>Zona de perigo</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>A exclusão da conta é permanente e não pode ser desfeita.</p>
            <button className="btn-danger-ghost" onClick={handleDeletar}>Excluir minha conta</button>
          </div>
        </div>
      </div>
    </>
  )
}