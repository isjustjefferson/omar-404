import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Perfil from './pages/Perfil'
import Falecidos from './pages/Falecidos'
import Clientes from './pages/Clientes'
import Contratos from './pages/Contratos'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      {/* Rotas protegidas — redireciona para /login se não tiver token */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="perfil" element={<Perfil />} />
          <Route path="falecidos" element={<Falecidos />} />
          <Route path="clientes" element={<Clientes />} />
          <Route path="contratos" element={<Contratos />} />
          <Route path="404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
