import { useState, useEffect } from 'react'
import api from '../services/api'

const formVazio = {
  nome: '',
  data_nascimento: '',
  data_falecimento: '',
  causa_morte: '',
  cliente_id: '',
}

export default function FalecidoModal({ aberto, onFechar, onSalvar, falecido }) {
  const [form, setForm] = useState(formVazio)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)
  const [clientes, setClientes] = useState([])

  const editando = !!falecido

  useEffect(() => {
    if (aberto) {
      api.get('/clientes').then(res => setClientes(res.data)).catch(() => {})
    }
  }, [aberto])

  // Preenche o formulário ao editar
  useEffect(() => {
    if (falecido) {
      setForm({
        nome:             falecido.nome            || '',
        data_nascimento:  falecido.data_nascimento  || '',
        data_falecimento: falecido.data_falecimento || '',
        causa_morte:      falecido.causa_morte      || '',
        cliente_id:       falecido.cliente_id       || '',
      })
    } else {
      setForm(formVazio)
    }
    setErro('')
  }, [falecido, aberto])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.nome || !form.data_falecimento) {
      setErro('Nome e data de falecimento são obrigatórios.')
      return
    }

    setSalvando(true)
    try {
      await onSalvar(form)
      onFechar()
    } catch (err) {
      setErro(err.message || 'Erro ao salvar registro.')
    } finally {
      setSalvando(false)
    }
  }

  if (!aberto) return null

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onFechar}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.6)',
          zIndex: 200,
        }}
      />

      {/* Modal */}
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
            {editando ? 'Editar registro' : 'Novo registro'}
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
                placeholder="Nome do falecido"
                value={form.nome}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Data de nascimento</label>
              <input
                className="input-omar"
                type="date"
                name="data_nascimento"
                value={form.data_nascimento}
                onChange={handleChange}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Data de falecimento *</label>
              <input
                className="input-omar"
                type="date"
                name="data_falecimento"
                value={form.data_falecimento}
                onChange={handleChange}
                required
              />
            </div>

            <div className="col-12">
              <label className="form-label">Causa da morte</label>
              <input
                className="input-omar"
                name="causa_morte"
                placeholder="Ex: Causas naturais"
                value={form.causa_morte}
                onChange={handleChange}
              />
            </div>

            <div className="col-12">
              <label className="form-label">Cliente responsável *</label>
              <select
                className="input-omar"
                name="cliente_id"
                value={form.cliente_id}
                onChange={handleChange}
                required
              >
                <option value="">Selecione o cliente...</option>
                {clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>
              {clientes.length === 0 && (
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                  Nenhum cliente cadastrado. Cadastre um cliente primeiro.
                </span>
              )}
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
