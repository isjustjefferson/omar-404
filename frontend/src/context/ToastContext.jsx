import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import Toast from '../components/Toast'

const ToastContext = createContext()

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const mostrar = useCallback((mensagem, tipo = 'erro') => {
    setToast({ mensagem, tipo })
  }, [])

  const fechar = useCallback(() => setToast(null), [])

  useEffect(() => {
    function handleForbidden(e) {
      mostrar(e.detail.mensagem, 'erro')
    }
    window.addEventListener('omar:forbidden', handleForbidden)
    return () => window.removeEventListener('omar:forbidden', handleForbidden)
  }, [mostrar])

  return (
    <ToastContext.Provider value={{ mostrar }}>
      {children}
      {toast && <Toast mensagem={toast.mensagem} tipo={toast.tipo} onFechar={fechar} />}
    </ToastContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useToast = () => useContext(ToastContext)