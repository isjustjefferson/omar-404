const USUARIOS = {
  'Admin A': { nome: 'Admin A', email: 'admina@teste.com', senha: 'Senha@123', perfil: 'admin' },
  'Admin B': { nome: 'Admin B', email: 'adminb@teste.com', senha: 'Senha@123', perfil: 'admin' },
  'Operador A1': { nome: 'Operador A1', email: 'operadora1@teste.com', senha: 'Senha@123', perfil: 'operador' },
  'Operador B1': { nome: 'Operador B1', email: 'operadorb1@teste.com', senha: 'Senha@123', perfil: 'operador' },
  'Admin C': { nome: 'Admin C', email: 'adminc@teste.com', senha: 'Senha@123', perfil: 'admin' },
  'Admin D': { nome: 'Admin D', email: 'admind@teste.com', senha: 'Senha@123', perfil: 'admin' },
  'Operador órfão': { nome: 'Operador órfão', email: 'operadororfao@teste.com', senha: 'Senha@123', perfil: 'operador' }
}

const CPF_VALIDOS = {
  clienteA1: '529.982.247-25',
  clienteA2: '111.444.777-35',
  clienteB1: '390.533.447-05',
  clienteB2: '608.917.223-51'
}

const CPF_INVALIDOS = {
  repetido: '111.111.111-11',
  digito: '529.982.247-24',
  curto: '5299822472',
  longo: '529982247250',
  letras: 'abcdefghijk'
}

function somarDigito(base, pesoInicial) {
  let soma = 0
  for (let i = 0; i < base.length; i += 1) {
    soma += Number(base[i]) * (pesoInicial - i)
  }
  const resto = soma % 11
  return resto < 2 ? 0 : 11 - resto
}

function gerarCpf(base) {
  const numeros = String(base).replace(/\D/g, '').slice(0, 9)
  const primeiro = somarDigito(numeros, 10)
  const segundo = somarDigito(numeros + String(primeiro), 11)
  return `${numeros}${primeiro}${segundo}`
}

function payloadCliente(cpf, nome = 'Cliente Teste') {
  return {
    nome,
    cpf,
    telefone: '81999999999',
    email: `${nome.toLowerCase().replace(/\s+/g, '.')}@teste.com`
  }
}

function payloadFalecido(clienteId, nome = 'Falecido Teste') {
  return {
    nome,
    data_nascimento: '1950-01-01',
    data_falecimento: '2020-01-01',
    causa_morte: 'Teste',
    cliente_id: clienteId
  }
}

function payloadServico(clienteId, falecidoId, valor = 1500) {
  return {
    tipo: 'Velório',
    descricao: 'Serviço de teste',
    valor,
    cliente_id: clienteId,
    falecido_id: falecidoId
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

module.exports = {
  USUARIOS,
  CPF_VALIDOS,
  CPF_INVALIDOS,
  gerarCpf,
  payloadCliente,
  payloadFalecido,
  payloadServico,
  delay
}
