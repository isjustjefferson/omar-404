import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'

const pageTitles = {
  '/':          'Dashboard',
  '/falecidos': 'Falecidos',
  '/clientes':  'Clientes',
  '/contratos': 'Contratos',
  '/perfil':    'Meu Perfil',
  '/operadores': 'Operadores',
}

export default function Layout() {
  const { pathname } = useLocation()
  const title = pageTitles[pathname] ?? 'Omar 404'

  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}')
  const initials = usuario.nome ? usuario.nome.slice(0, 2).toUpperCase() : 'US'

  return (
    <>
      <Sidebar />
      <div className="main-wrapper">
        <header className="topbar">
          <span className="topbar-title">{title}</span>
          <div className="topbar-user">
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              {usuario.nome || 'Usuário'}
            </span>
            <div className="avatar">{initials}</div>
          </div>
        </header>

        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </>
  )
}