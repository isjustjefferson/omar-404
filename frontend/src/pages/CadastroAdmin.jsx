import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../services/api'

export default function CadastroAdmin() {
  const navigate = useNavigate()
  const [etapa, setEtapa] = useState(1)
  const [form, setForm] = useState({ nome: '', email: '', senha: '' })
  const [codigo, setCodigo] = useState('')
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [carregando, setCarregando] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSolicitar(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await api.post('/auth/admin/solicitar', form)
      setSucesso(`Código enviado para ${form.email}`)
      setEtapa(2)
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao solicitar cadastro.')
    } finally {
      setCarregando(false)
    }
  }

  async function handleConfirmar(e) {
    e.preventDefault()
    setErro('')
    setCarregando(true)
    try {
      await api.post('/auth/admin/confirmar', { email: form.email, codigo })
      setSucesso('Admin cadastrado! Redirecionando...')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      setErro(err.response?.data?.erro || 'Código inválido.')
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-primary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span style={{ fontFamily: 'DM Serif Display, serif', fontSize: 32, color: 'var(--text-primary)', display: 'block' }}>
            Sr. Omar
          </span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.12em' }}>
            {etapa === 1 ? 'Cadastro de administrador' : 'Confirme seu e-mail'}
          </span>
        </div>

        <div className="card-omar">
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

          {etapa === 1 ? (
            <form onSubmit={handleSolicitar}>
              <div className="mb-3">
                <label className="form-label">Nome</label>
                <input className="input-omar" name="nome" placeholder="Seu nome" value={form.nome} onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">E-mail</label>
                <input className="input-omar" type="email" name="email" placeholder="seu@email.com" value={form.email} onChange={handleChange} required />
              </div>
              <div className="mb-4">
                <label className="form-label">Senha</label>
                <input className="input-omar" type="password" name="senha" placeholder="••••••••" value={form.senha} onChange={handleChange} required />
              </div>
              <button type="submit" className="btn-omar w-100" disabled={carregando}>
                {carregando ? 'Enviando...' : 'Enviar código de confirmação'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirmar}>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 20 }}>
                Digite o código de 6 dígitos enviado para <strong style={{ color: 'var(--text-primary)' }}>{form.email}</strong>
              </p>
              <div className="mb-4">
                <label className="form-label">Código de verificação</label>
                <input
                  className="input-omar"
                  placeholder="000000"
                  value={codigo}
                  onChange={e => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  maxLength={6}
                  style={{ letterSpacing: '0.3em', fontSize: 20, textAlign: 'center' }}
                  required
                />
              </div>
              <button type="submit" className="btn-omar w-100" disabled={carregando}>
                {carregando ? 'Confirmando...' : 'Confirmar cadastro'}
              </button>
              <button type="button" className="btn-ghost w-100 mt-2" onClick={() => setEtapa(1)}>
                Voltar
              </button>
            </form>
          )}
        </div>

        <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 20 }}>
          Já tem conta? <Link to="/login" style={{ color: 'var(--accent)' }}>Entrar</Link>
        </p>
      </div>
    </div>
  )
}