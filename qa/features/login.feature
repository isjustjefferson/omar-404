# language: pt
Funcionalidade: Login e emissão de token
  Como administrador do sistema
  Quero autenticar com e-mail e senha
  Para receber um token JWT e acessar meus dados

  Contexto:
    Dado que a API está disponível

  @CT01
  Cenário: Login com credenciais válidas
    Dado que o administrador "Admin A" está cadastrado
    E que um cliente socket está conectado para observar eventos
    Quando ele envia o e-mail e a senha corretos para o login
    Então a resposta tem status 200
    E a resposta contém um token JWT e os dados do usuário, sem a senha
    E o token expira em 8 horas
    E o evento "usuario:logado" é publicado

  @CT02
  Esquema do Cenário: Login com credenciais inválidas
    Dado que o administrador "Admin A" está cadastrado
    Quando ele tenta login com e-mail "<email>", senha "<senha>" e corpo "<corpo>"
    Então a resposta tem status <status>
    E a resposta não contém token
    E a mensagem informa "<mensagem>"

    Exemplos:
      | email               | senha      | status | mensagem              | corpo     |
      | admina@teste.com    | SenhaErrada| 401    | credenciais inválidas | completo  |
      | inexistente@teste.com | Senha@123 | 401    | credenciais inválidas | completo  |
      |                     |            | 400    | obrigatórios          | completo  |
      | admina@teste.com    |            | 400    | obrigatórios          | completo  |
      |                     | Senha@123  | 400    | obrigatórios          | completo  |
      | admina@teste.com    | Senha@123  | 400    | obrigatórios          | sem-email |
      | admina@teste.com    | Senha@123  | 400    | obrigatórios          | sem-senha |
