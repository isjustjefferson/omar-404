import { NavLink, useNavigate } from 'react-router-dom'

const navItems = [
  { to: '/',          icon: '◈', label: 'Dashboard' },
  { to: '/falecidos', icon: '✦', label: 'Falecidos'  },
  { to: '/clientes',  icon: '◉', label: 'Clientes'   },
  { to: '/contratos', icon: '◎', label: 'Contratos'  },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')

  function handleLogout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="brand-name">Omar</span>
        <span className="brand-code">ERROR_404</span>
      </div>

      <nav className="sidebar-nav">
        <div className="nav-section-label">Menu</div>

        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              'sidebar-link' + (isActive ? ' active' : '')
            }
          >
            <span className="link-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}

        {usuario.perfil === 'admin' && (
          <NavLink
            to="/operadores"
            className={({ isActive }) =>
              'sidebar-link' + (isActive ? ' active' : '')
            }
          >
            <span className="link-icon">◑</span>
            Operadores
          </NavLink>
        )}

        <div className="nav-section-label" style={{ marginTop: 24 }}>Conta</div>

        <NavLink
          to="/perfil"
          className={({ isActive }) =>
            'sidebar-link' + (isActive ? ' active' : '')
          }
        >
          <span className="link-icon">◷</span>
          Meu Perfil
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-link w-100 border-0 text-start"
          style={{ background: 'none', cursor: 'pointer', color: 'var(--danger)' }}
          onClick={handleLogout}
        >
          <span className="link-icon">⊗</span>
          Sair
        </button>
      </div>
    </aside>
  )
}
