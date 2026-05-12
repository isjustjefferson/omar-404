import { useEffect } from 'react'
import socket from '../services/socket'

function useSocket(evento, callback) {

  useEffect(() => {

    const listener = (dados) => {
      console.log('evento recebido:', evento, dados)
      callback(dados)
    }

    socket.on(evento, listener)

    return () => {
      socket.off(evento, listener)
    }

  }, [evento, callback])
}

export default useSocket