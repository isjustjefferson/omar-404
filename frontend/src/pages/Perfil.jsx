import { useState } from 'react'

export default function Perfil() {
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({
    nome: 'Usuário Teste',
    email: 'usuario@omar404.com',
    telefone: '',
    senhaAtual: '',
    novaSenha: '',
  })

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  function handleSalvar(e) {
    e.preventDefault()
    // TODO: chamar PUT /api/users/me
    setEditando(false)
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
            <div
              className="avatar mx-auto mb-3"
              style={{ width: 64, height: 64, fontSize: 22 }}
            >
              {form.nome.slice(0, 2).toUpperCase()}
            </div>
            <div style={{ fontWeight: 500 }}>{form.nome}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {form.email}
            </div>
          </div>
        </div>

        <div className="col-md-8">
          <div className="card-omar">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 20,
              }}
            >
              <h2 style={{ fontSize: 16, fontWeight: 500, margin: 0 }}>
                Dados pessoais
              </h2>
              {!editando && (
                <button
                  className="btn-ghost"
                  onClick={() => setEditando(true)}
                >
                  Editar
                </button>
              )}
            </div>

            <form onSubmit={handleSalvar}>
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Nome completo</label>
                  <input
                    className="input-omar"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">E-mail</label>
                  <input
                    className="input-omar"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label">Telefone</label>
                  <input
                    className="input-omar"
                    name="telefone"
                    placeholder="(00) 00000-0000"
                    value={form.telefone}
                    onChange={handleChange}
                    disabled={!editando}
                  />
                </div>

                {editando && (
                  <>
                    <div className="col-md-6">
                      <label className="form-label">Senha atual</label>
                      <input
                        className="input-omar"
                        name="senhaAtual"
                        type="password"
                        placeholder="••••••••"
                        value={form.senhaAtual}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Nova senha</label>
                      <input
                        className="input-omar"
                        name="novaSenha"
                        type="password"
                        placeholder="••••••••"
                        value={form.novaSenha}
                        onChange={handleChange}
                      />
                    </div>
                  </>
                )}

                {editando && (
                  <div className="col-12 d-flex gap-2 mt-2">
                    <button type="submit" className="btn-omar">
                      Salvar alterações
                    </button>
                    <button
                      type="button"
                      className="btn-ghost"
                      onClick={() => setEditando(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            </form>
          </div>

          <div className="card-omar mt-3">
            <h2
              style={{
                fontSize: 16,
                fontWeight: 500,
                marginBottom: 12,
                color: 'var(--danger)',
              }}
            >
              Zona de perigo
            </h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>
              A exclusão da conta é permanente e não pode ser desfeita.
            </p>
            <button className="btn-danger-ghost">Excluir minha conta</button>
          </div>
        </div>
      </div>
    </>
  )
}
