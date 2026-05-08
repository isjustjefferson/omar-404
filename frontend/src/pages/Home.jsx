import { useState, useEffect } from 'react'
import api from '../services/api'

const statusClasse = {
  pendente:     'badge-pendente',
  em_andamento: 'badge-ativo',
  concluido:    'badge-encerrado',
  cancelado:    'badge-encerrado',
}

const statusLabel = {
  pendente:     'Pendente',
  em_andamento: 'Em andamento',
  concluido:    'Concluído',
  cancelado:    'Cancelado',
}

export default function Home() {
  const [stats, setStats] = useState({
    falecidos: '—',
    clientes: '—',
    pendentes: '—',
    total: '—',
  })
  const [recentes, setRecentes] = useState([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/falecidos'),
      api.get('/clientes'),
      api.get('/servicos'),
    ]).then(([falecidos, clientes, servicos]) => {
      const pendentes = servicos.data.filter(s => s.status === 'pendente').length
      setStats({
        falecidos: falecidos.data.length,
        clientes:  clientes.data.length,
        pendentes,
        total:     servicos.data.length,
      })
      setRecentes(servicos.data.slice(0, 5))
    }).catch(() => {}).finally(() => setCarregando(false))
  }, [])

  const cards = [
    { label: 'Falecidos registrados', value: stats.falecidos, sub: 'total no sistema' },
    { label: 'Clientes ativos',       value: stats.clientes,  sub: 'contratantes'     },
    { label: 'Contratos pendentes',   value: stats.pendentes, sub: 'aguardando'        },
    { label: 'Serviços registrados',  value: stats.total,     sub: 'total no sistema' },
  ]

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Visão geral do sistema Omar 404</p>
      </div>

      <div className="row g-3 mb-4">
        {cards.map(s => (
          <div key={s.label} className="col-6 col-md-3">
            <div className="stat-card">
              <div className="stat-label">{s.label}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card-omar">
        <h2 style={{ fontSize: 15, fontWeight: 500, marginBottom: 16, color: 'var(--text-primary)' }}>
          Atividades recentes
        </h2>

        {carregando ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>
            Carregando...
          </p>
        ) : recentes.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0 }}>
            Nenhuma atividade recente.
          </p>
        ) : (
          recentes.map((s, i) => (
            <div
              key={s.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 0',
                borderBottom: i < recentes.length - 1 ? '1px solid var(--border)' : 'none',
              }}
            >
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{s.tipo}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  {s.nome_falecido || `Falecido #${s.falecido_id}`}
                  {s.nome_cliente ? ` · ${s.nome_cliente}` : ''}
                </div>
              </div>
              <span className={`badge-status ${statusClasse[s.status] || 'badge-pendente'}`}>
                {statusLabel[s.status] || s.status}
              </span>
            </div>
          ))
        )}
      </div>
    </>
  )
}
