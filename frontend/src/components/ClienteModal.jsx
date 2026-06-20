import { useState, useEffect } from 'react'

const formVazio = {
  nome: '',
  cpf: '',
  telefone: '',
  email: '',
}

export default function ClienteModal({ aberto, onFechar, onSalvar, cliente }) {
  const [form, setForm] = useState(formVazio)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const editando = !!cliente

  useEffect(() => {
    if (cliente) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        nome:     cliente.nome     || '',
        cpf:      cliente.cpf      || '',
        telefone: cliente.telefone || '',
        email:    cliente.email    || '',
      })
    } else {
      setForm(formVazio)
    }
    setErro('')
  }, [cliente, aberto])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Máscara de CPF: 000.000.000-00
  function handleCPF(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11)
    if (v.length > 9) v = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, '$1.$2.$3-$4')
    else if (v.length > 6) v = v.replace(/(\d{3})(\d{3})(\d{0,3})/, '$1.$2.$3')
    else if (v.length > 3) v = v.replace(/(\d{3})(\d{0,3})/, '$1.$2')
    setForm({ ...form, cpf: v })
  }

  // Máscara de telefone: (00) 00000-0000
  function handleTelefone(e) {
    let v = e.target.value.replace(/\D/g, '').slice(0, 11)
    if (v.length > 6) v = v.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3')
    else if (v.length > 2) v = v.replace(/(\d{2})(\d{0,5})/, '($1) $2')
    setForm({ ...form, telefone: v })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')
  
    if (!form.nome || !form.cpf) {
      setErro('Nome e CPF são obrigatórios.')
      return
    }

    const cpfLimpo = form.cpf.replace(/\D/g, '')
    if (cpfLimpo.length !== 11) {
      setErro('CPF deve ter 11 dígitos.')
      return
    }

    setSalvando(true)
    try {
      await onSalvar(form)
      onFechar()
    } catch (err) {
      setErro(err.response?.data?.erro || err.message || 'Erro ao registrar cliente.')
    } finally {
      setSalvando(false)
    }
  }

  if (!aberto) return null

  return (
    <>
      <div
        onClick={onFechar}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 200,
        }}
      />

      <div
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '100%', maxWidth: 520,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '28px 32px',
          zIndex: 201,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, margin: 0 }}>
            {editando ? 'Editar cliente' : 'Novo cliente'}
          </h2>
          <button
            onClick={onFechar}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 20, cursor: 'pointer', lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        {erro && (
          <div style={{
            background: 'rgba(192,84,74,0.1)',
            border: '1px solid rgba(192,84,74,0.3)',
            borderRadius: 8, padding: '10px 14px',
            color: 'var(--danger)', fontSize: 13, marginBottom: 16,
          }}>
            {erro}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="row g-3">

            <div className="col-12">
              <label className="form-label">Nome completo *</label>
              <input
                className="input-omar"
                name="nome"
                placeholder="Nome do cliente"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">CPF *</label>
              <input
                className="input-omar"
                name="cpf"
                placeholder="000.000.000-00"
                value={form.cpf}
                onChange={handleCPF}
                disabled={editando}
                required
              />
              {editando && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  O CPF não pode ser alterado.
                </span>
              )}
            </div>

            <div className="col-md-6">
              <label className="form-label">Telefone</label>
              <input
                className="input-omar"
                name="telefone"
                placeholder="(00) 00000-0000"
                value={form.telefone}
                onChange={handleTelefone}
              />
            </div>

            <div className="col-12">
              <label className="form-label">E-mail</label>
              <input
                className="input-omar"
                name="email"
                type="email"
                placeholder="cliente@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="d-flex gap-2 mt-4">
            <button type="submit" className="btn-omar" disabled={salvando}>
              {salvando ? 'Salvando...' : editando ? 'Salvar alterações' : 'Cadastrar'}
            </button>
            <button type="button" className="btn-ghost" onClick={onFechar}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
