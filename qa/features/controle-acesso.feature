# language: pt
Funcionalidade: Controle de acesso por perfil
  Como gestor da funerária
  Quero que operadores tenham acesso somente de leitura
  Para proteger os dados de cada administrador

  Contexto:
    Dado que a API está disponível

  @CT07
  Cenário: Administrador realiza operações de escrita
    Dado que o administrador "Admin A" está autenticado
    Quando ele cadastra, atualiza e remove um cliente
    Então todas as operações de escrita têm sucesso

  @CT07
  Cenário: Operador não realiza operações de escrita
    Dado que o operador "Operador A1" está autenticado
    Quando ele tenta executar uma operação de escrita
    Então a resposta tem status 403
    E a mensagem informa que apenas administradores podem realizar a ação
    E nenhum dado é criado, alterado ou removido

  @CT07
  Cenário: Operador consulta dados do próprio administrador
    Dado que o operador "Operador A1" está autenticado
    Quando ele consulta clientes, falecidos e serviços
    Então a resposta tem status 200
    E a resposta contém apenas os registros do "Admin A"
