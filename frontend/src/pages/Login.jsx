import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', senha: '' })
  const [erro, setErro] = useState('')

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
    try {
      // const res = await axios.post('/api/auth/login', form)
      // localStorage.setItem('token', res.data.token)
      navigate('/')
    } catch {
      setErro('E-mail ou senha inválidos.')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--bg-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%', maxWidth: 380 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <span
            style={{
              fontFamily: 'DM Serif Display, serif',
              fontSize: 32,
              color: 'var(--text-primary)',
              display: 'block',
            }}
          >
            Sr. Omar
          </span>
          <span
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: 11,
              color: 'var(--accent)',
              letterSpacing: '0.12em',
            }}
          >
            Error 404 - Sua vida não foi encontrada (trágico!)
          </span>
        </div>

        <div className="card-omar">
          <h2
            style={{
              fontSize: 18,
              fontWeight: 500,
              marginBottom: 24,
              color: 'var(--text-primary)',
            }}
          >
            Login
          </h2>

          {erro && (
            <div
              style={{
                background: 'rgba(192,84,74,0.1)',
                border: '1px solid rgba(192,84,74,0.3)',
                borderRadius: 8,
                padding: '10px 14px',
                color: 'var(--danger)',
                fontSize: 13,
                marginBottom: 16,
              }}
            >
              {erro}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">E-mail</label>
              <input
                className="input-omar"
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Senha</label>
              <input
                className="input-omar"
                type="password"
                name="senha"
                placeholder="••••••••"
                value={form.senha}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn-omar w-100">
              Entrar
            </button>
          </form>
        </div>

        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'var(--text-muted)',
            marginTop: 20,
          }}
        >
          Sistema de gestão funerária · Omar 404
        </p>
      </div>
    </div>
  )
}
