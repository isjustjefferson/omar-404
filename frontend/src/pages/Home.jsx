export default function Home() {
  // Futuramente: buscar dados reais da API
  const stats = [
    { label: 'Falecidos registrados', value: '—', sub: 'total no sistema' },
    { label: 'Clientes ativos',       value: '—', sub: 'contratantes'     },
    { label: 'Contratos em aberto',   value: '—', sub: 'pendentes'        },
    { label: 'Serviços este mês',     value: '—', sub: 'realizados'       },
  ]

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Visão geral do sistema Omar 404</p>
      </div>

      <div className="row g-3 mb-4">
        {stats.map(s => (
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
        <p style={{ color: 'var(--text-muted)', fontSize: 13, margin: 0, fontFamily: 'var(--font-mono)' }}>
          // Atividades recentes serão listadas aqui
        </p>
      </div>
    </>
  )
}
