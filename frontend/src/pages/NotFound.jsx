import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
      }}
    >
      <div className="not-found-code">404</div>
      <h2
        style={{
          fontFamily: 'DM Serif Display, serif',
          fontSize: 26,
          marginTop: 16,
          marginBottom: 8,
        }}
      >
        Trágico! Esta página também partiu.
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
        O endereço que você tentou acessar não existe no sistema.
      </p>
      <button className="btn-omar" onClick={() => navigate('/')}>
        Voltar ao início
      </button>
    </div>
  )
}
