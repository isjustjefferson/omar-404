import { useState, useEffect } from 'react'

const formVazio = {
  tipo: '',
  descricao: '',
  valor: '',
  falecido_id: '',
  status: 'pendente',
}

const tiposServico = [
  'Velório + Sepultamento',
  'Cremação',
  'Velório simples',
  'Sepultamento simples',
  'Traslado',
  'Outro',
]

const statusOpcoes = [
  { value: 'pendente',     label: 'Pendente'     },
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluido',    label: 'Concluído'    },
  { value: 'cancelado',    label: 'Cancelado'    },
]

export default function ContratoModal({ aberto, onFechar, onSalvar, contrato }) {
  const [form, setForm] = useState(formVazio)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  const editando = !!contrato

  useEffect(() => {
    if (contrato) {
      setForm({
        tipo:        contrato.tipo        || '',
        descricao:   contrato.descricao   || '',
        valor:       contrato.valor       || '',
        falecido_id: contrato.falecido_id || '',
        status:      contrato.status      || 'pendente',
      })
    } else {
      setForm(formVazio)
    }
    setErro('')
  }, [contrato, aberto])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  // Máscara de valor: R$ 0.000,00
  function handleValor(e) {
    let v = e.target.value.replace(/\D/g, '')
    if (!v) { setForm({ ...form, valor: '' }); return }
    v = (parseInt(v) / 100).toFixed(2)
    v = v.replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    setForm({ ...form, valor: 'R$ ' + v })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErro('')

    if (!form.tipo || !form.valor || !form.falecido_id) {
      setErro('Tipo, valor e falecido são obrigatórios.')
      return
    }

    setSalvando(true)
    try {
      await onSalvar(form)
      onFechar()
    } catch (err) {
      setErro(err.message || 'Erro ao salvar contrato.')
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
          width: '100%', maxWidth: 540,
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          padding: '28px 32px',
          zIndex: 201,
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontFamily: 'DM Serif Display, serif', fontSize: 20, margin: 0 }}>
            {editando ? 'Editar contrato' : 'Novo contrato'}
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
              <label className="form-label">Tipo de serviço *</label>
              <select
                className="input-omar"
                name="tipo"
                value={form.tipo}
                onChange={handleChange}
                required
              >
                <option value="">Selecione...</option>
                {tiposServico.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Descrição</label>
              <textarea
                className="input-omar"
                name="descricao"
                placeholder="Detalhes adicionais do serviço..."
                value={form.descricao}
                onChange={handleChange}
                rows={3}
                style={{ resize: 'none' }}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Valor *</label>
              <input
                className="input-omar"
                name="valor"
                placeholder="R$ 0,00"
                value={form.valor}
                onChange={handleValor}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select
                className="input-omar"
                name="status"
                value={form.status}
                onChange={handleChange}
              >
                {statusOpcoes.map(s => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">ID do falecido *</label>
              <input
                className="input-omar"
                name="falecido_id"
                placeholder="ID do falecido vinculado"
                value={form.falecido_id}
                onChange={handleChange}
                required
              />
              <span style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, display: 'block' }}>
                Futuramente será um seletor com os falecidos cadastrados.
              </span>
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
