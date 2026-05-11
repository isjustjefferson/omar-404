import { useEffect } from 'react'

export default function Toast({ mensagem, tipo = 'erro', onFechar }) {
  useEffect(() => {
    const t = setTimeout(onFechar, 4000)
    return () => clearTimeout(t)
  }, [onFechar])

  const cores = {
    erro:    { bg: 'rgba(192,84,74,0.12)', border: 'rgba(192,84,74,0.35)', color: 'var(--danger)' },
    sucesso: { bg: 'rgba(100,200,80,0.12)', border: 'rgba(100,200,80,0.35)', color: '#6ec96e' },
    aviso:   { bg: 'rgba(240,180,60,0.12)', border: 'rgba(240,180,60,0.35)', color: '#f0b060' },
  }

  const cor = cores[tipo] || cores.erro

  return (
    <div style={{
      position: 'fixed',
      bottom: 28, right: 28,
      background: cor.bg,
      border: `1px solid ${cor.border}`,
      color: cor.color,
      borderRadius: 10,
      padding: '14px 20px',
      fontSize: 14,
      zIndex: 9999,
      maxWidth: 380,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      backdropFilter: 'blur(8px)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      animation: 'slideIn 0.2s ease',
    }}>
      <span>{mensagem}</span>
      <button
        onClick={onFechar}
        style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 18, lineHeight: 1 }}
      >×</button>
    </div>
  )
}